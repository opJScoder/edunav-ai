import 'dotenv/config';import pg from 'pg';import {drizzle} from 'drizzle-orm/node-postgres';import {pgTable,serial,text,jsonb,integer} from 'drizzle-orm/pg-core';import {sql} from 'drizzle-orm'
export const users=pgTable('users',{id:serial('id').primaryKey(),email:text('email').notNull().unique(),hash:text('hash').notNull()})
export const profiles=pgTable('profiles',{userId:integer('user_id').primaryKey(),data:jsonb('data').notNull()})
const url=process.env.DATABASE_URL||''
export const db=drizzle(new pg.Pool({connectionString:url,ssl:/localhost|127\.0\.0\.1/.test(url)?false:{rejectUnauthorized:false}}))
export const init=async()=>{await db.execute(sql`CREATE TABLE IF NOT EXISTS users(id serial PRIMARY KEY,email text UNIQUE NOT NULL,hash text NOT NULL)`);await db.execute(sql`CREATE TABLE IF NOT EXISTS profiles(user_id integer PRIMARY KEY REFERENCES users(id),data jsonb NOT NULL)`)}
