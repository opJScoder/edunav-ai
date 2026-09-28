import 'dotenv/config';import express from 'express';import bcrypt from 'bcryptjs';import jwt from 'jsonwebtoken';import path from 'path';import {fileURLToPath} from 'url';import {eq} from 'drizzle-orm'
import {db,init,users,profiles} from './db.js';import {careers,deps,aliases} from './data.js'
const app=express(),S=process.env.JWT_SECRET||'dev-secret-change-me',hits=new Map(),blank={name:'',branch:'Computer Science & IT',semester:1,goal:'Full-Stack Developer',hoursPerWeek:8,interests:[],skills:{},projects:[],setup:false}
app.use(express.json({limit:'200kb'}))
const limit=(n,ms=6e4)=>(q,s,nx)=>{const k=q.ip+q.path,t=Date.now(),a=(hits.get(k)||[]).filter(x=>t-x<ms);a.push(t);hits.set(k,a);a.length>n?s.status(429).json({error:'Too many requests, wait a minute'}):nx()}
const auth=(q,s,nx)=>{try{q.uid=jwt.verify((q.headers.authorization||'').slice(7),S).id;nx()}catch{s.status(401).json({error:'Please sign in'})}}
const wrap=f=>(q,s)=>f(q,s).catch(e=>{console.error(e);s.status(500).json({error:'Server error'})})
const tok=u=>jwt.sign({id:u.id},S,{expiresIn:'7d'})
const cred=b=>{const e=String(b.email||'').trim().toLowerCase(),p=String(b.password||'');return /^\S+@\S+\.\S+$/.test(e)&&p.length>=8?{e,p}:null}
const getP=async id=>(await db.select().from(profiles).where(eq(profiles.userId,id)))[0].data
const saveP=(id,data)=>db.update(profiles).set({data}).where(eq(profiles.userId,id))
app.post('/api/auth/register',limit(10),wrap(async(q,s)=>{const c=cred(q.body);if(!c)return s.status(400).json({error:'Use a valid email and a password of 8+ characters'})
if((await db.select().from(users).where(eq(users.email,c.e))).length)return s.status(409).json({error:'Email already registered'})
const[u]=await db.insert(users).values({email:c.e,hash:await bcrypt.hash(c.p,10)}).returning();await db.insert(profiles).values({userId:u.id,data:blank});s.json({token:tok(u)})}))
app.post('/api/auth/login',limit(10),wrap(async(q,s)=>{const c=cred(q.body),[u]=c?await db.select().from(users).where(eq(users.email,c.e)):[]
if(!u||!await bcrypt.compare(c.p,u.hash))return s.status(401).json({error:'Wrong email or password'});s.json({token:tok(u)})}))
const analyze=p=>{const c=careers[p.goal],lv=k=>p.skills[k]??0
const gaps=c.skills.map(k=>({skill:k,level:lv(k),status:lv(k)>=2?'strong':lv(k)?'improve':'missing'})),todo=gaps.filter(g=>g.status!='strong')
const roadmap=todo.map(g=>{const d=deps[g.skill],blocked=d&&lv(d)<2;return{skill:g.skill,status:g.status,hours:g.level?15:30,after:blocked?d:null,why:`${g.status=='missing'?'Not in your profile yet':'You rated this Beginner'}, and ${p.goal} work relies on it.${blocked?` Build ${d} first.`:''}`}})
const projects=c.projects.map(([name,...sk])=>{const solves=sk.filter(k=>lv(k)<2);return{name,skills:sk,solves,why:solves.length?`Closes ${solves.length} gap${solves.length>1?'s':''}: ${solves.join(', ')}. Building it end to end is how the skills stick.`:'Uses skills you already have, so it turns them into portfolio proof.'}}).sort((a,b)=>b.solves.length-a.solves.length)
const weekly=[];let cap=p.hoursPerWeek,w={week:1,tasks:[]}
for(const r of roadmap){let h=r.hours;while(h>0){const t=Math.min(h,cap);w.tasks.push({skill:r.skill,hours:t});h-=t;cap-=t;if(!cap){weekly.push(w);w={week:weekly.length+1,tasks:[]};cap=p.hoursPerWeek}}}
if(w.tasks.length)weekly.push(w)
const strong=gaps.length-todo.length
return{gaps,roadmap,projects,weekly:weekly.slice(0,6),progress:{strong,total:gaps.length,pct:Math.round(100*strong/gaps.length),hoursLeft:roadmap.reduce((a,r)=>a+r.hours,0),weeks:weekly.length}}}
const clean=(b,o)=>{const n={...o},str=(v,l)=>String(v??'').trim().slice(0,l),cl=(v,a,z)=>Math.min(z,Math.max(a,Math.trunc(+v)||a))
if('name'in b)n.name=str(b.name,60);if('branch'in b)n.branch=str(b.branch,60);if(b.semester)n.semester=cl(b.semester,1,8);if(careers[b.goal])n.goal=b.goal;if(b.hoursPerWeek)n.hoursPerWeek=cl(b.hoursPerWeek,1,60)
if(Array.isArray(b.interests))n.interests=b.interests.slice(0,15).map(x=>str(x,40)).filter(Boolean)
if(Array.isArray(b.projects))n.projects=b.projects.slice(0,20).map(x=>str(x,120)).filter(Boolean)
if(b.skills&&typeof b.skills=='object'){n.skills={};for(const[k,v]of Object.entries(b.skills).slice(0,80))if(str(k,40))n.skills[str(k,40)]=cl(v,0,3)}
n.setup=true;return n}
app.get('/api/dashboard',auth,wrap(async(q,s)=>{const p=await getP(q.uid),[u]=await db.select().from(users).where(eq(users.id,q.uid))
s.json({email:u.email,profile:p,analysis:analyze(p),catalog:Object.fromEntries(Object.entries(careers).map(([n,c])=>[n,c.skills])),careers:Object.entries(careers).map(([name,c])=>({name,pct:Math.round(100*c.skills.filter(k=>(p.skills[k]??0)>=2).length/c.skills.length)}))})}))
app.put('/api/profile',auth,wrap(async(q,s)=>{await saveP(q.uid,clean(q.body||{},await getP(q.uid)));s.json({ok:true})}))
app.post('/api/learned',auth,wrap(async(q,s)=>{const p=await getP(q.uid),k=String(q.body.skill);if(!careers[p.goal].skills.includes(k))return s.status(400).json({error:'Unknown skill'})
await saveP(q.uid,{...p,skills:{...p.skills,[k]:Math.max(p.skills[k]??0,2)}});s.json({ok:true})}))
const esc=x=>x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),all=[...new Set(Object.values(careers).flatMap(c=>c.skills))]
app.post('/api/resume',auth,limit(20),wrap(async(q,s)=>{const t=String(q.body.text||'').slice(0,20000),low=t.toLowerCase()
const has=k=>new RegExp(`(^|[^a-z0-9+#])(${[k,...(aliases[k]||[])].map(x=>esc(x.toLowerCase())).join('|')})([^a-z0-9+#]|$)`).test(low)
const found=all.filter(has),p=await getP(q.uid),missing=careers[p.goal].skills.filter(k=>!found.includes(k)&&(p.skills[k]??0)<2),tips=[]
if(t.length<600)tips.push('Add detail: aim for a full page with projects, skills and education.');if(!/\d/.test(t))tips.push('Add numbers that show impact (users, speed-ups, accuracy).');if(!/project/i.test(t))tips.push('Add a Projects section with links.')
if(missing.length)tips.push(`Learn and show evidence for: ${missing.join(', ')}.`)
if(q.body.apply){const sk={...p.skills};found.forEach(k=>sk[k]=Math.max(sk[k]??0,1));await saveP(q.uid,{...p,skills:sk})}
s.json({found,missing,tips,goal:p.goal})}))
app.post('/api/chat',auth,limit(15),wrap(async(q,s)=>{const p=await getP(q.uid),a=analyze(p),m=String(q.body.message||'').slice(0,1000),l=m.toLowerCase(),n=a.roadmap[0]
const ctx=`Student ${p.name||''}, ${p.branch}, semester ${p.semester}, ${p.hoursPerWeek}h/week. Goal: ${p.goal}. Strong: ${a.gaps.filter(g=>g.status=='strong').map(g=>g.skill).join(', ')||'none'}. Learn next: ${a.roadmap.map(r=>r.skill).join(', ')||'nothing'}. Interests: ${p.interests.join(', ')}.`
if(process.env.LLM_URL)try{const h=(Array.isArray(q.body.history)?q.body.history.slice(-6):[]).map(x=>({role:x.role=='assistant'?'assistant':'user',content:String(x.content).slice(0,1000)}))
const r=await fetch(process.env.LLM_URL,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+(process.env.LLM_KEY||'')},body:JSON.stringify({model:process.env.LLM_MODEL,messages:[{role:'system',content:'You are EduNav AI, a concise career mentor for students. Always explain why. Context: '+ctx},...h,{role:'user',content:m}]})})
const t=(await r.json()).choices?.[0]?.message?.content;if(t)return s.json({reply:t})}catch(e){console.error('LLM failed:',e.message)}
s.json({reply:/project/.test(l)?`Start with "${a.projects[0].name}". ${a.projects[0].why}`:/intern|placement|resume/.test(l)?`For ${p.goal} internships, show ${a.roadmap.slice(0,3).map(r=>r.skill).join(', ')||'your projects'} in real projects, then check coverage in the Resume tab.`:n?`Next for ${p.goal}: ${n.skill} (about ${n.hours}h). ${n.why} At ${p.hoursPerWeek}h/week your whole roadmap takes about ${a.progress.weeks} weeks.`:`You cover every core ${p.goal} skill. Build a project, or compare another career on the Overview tab.`})}))
const D=path.join(path.dirname(fileURLToPath(import.meta.url)),'../dist')
app.use(express.static(D));app.get('*',(q,s)=>s.sendFile(path.join(D,'index.html')))
init().then(()=>app.listen(process.env.PORT||3001,()=>console.log('EduNav AI on',process.env.PORT||3001))).catch(e=>{console.error('DB init failed. Check DATABASE_URL:',e.message);process.exit(1)})
