# PathForge AI

## Your Personal Career GPS

---

## Problem Statement

Students across all engineering branches struggle to identify what skills they need, in what order to learn them, and how to bridge the gap between their current abilities and their dream career. Generic online courses don't account for a student's unique background, branch, semester, or existing skill set. There is no personalized, structured system that takes a student's profile and produces an actionable, semester-aware career roadmap.

**PS-07:** Build a Personalized Student Career & Learning Assistant that collects student information, analyzes skill gaps against career goals, generates personalized learning roadmaps, recommends relevant projects, and tracks progress over time.

---

## Our Solution

PathForge AI is a full-stack web application that takes a student's academic profile (branch, semester, skills, interests, career goal) and produces:

1. **Skill-Gap Analysis** — a deterministic, explainable comparison of current skills vs. career requirements
2. **Personalized Roadmap** — an ordered, time-estimated learning plan generated from actual gaps
3. **Project Recommendations** — projects that reinforce missing skills at the student's level
4. **Progress Dashboard** — live readiness percentage, skill progress, roadmap completion, and semester goals

The system uses a **hybrid architecture**: a rule-based skill-gap engine (fully explainable, no AI dependency) combined with AI-powered content generation for roadmap descriptions and project suggestions. If AI fails, the system falls back to template-based content so the demo never breaks.

---

## Target Users

- Engineering students (any branch) in semesters 3–8
- Students preparing for internships, placements, or higher studies
- Career counselors who want a data-driven advising tool

---

## Key Features

| Feature | Description |
|---|---|
| Student Profile | Branch, semester, skills, interests, career goal, courses, projects, study hours |
| Career Selection | 12+ career paths across 6+ branches |
| Skill-Gap Engine | Deterministic algorithm producing readiness % and prioritized gaps |
| Personalized Roadmap | Ordered learning plan with time estimates and prerequisites |
| Project Recommendations | Projects matched to missing skills and student level |
| Progress Dashboard | Readiness gauge, skill bars, roadmap progress, study hours |
| Semester Goals | CRUD goals with completion tracking |
| AI Career Assistant (Bonus) | Personalized Q&A using student context |
| Resume Analyzer (Bonus) | Extract skills from resume, update gap analysis |

---

## MVP Scope

### MUST HAVE (Core Demo Flow)

- [ ] Student registration & login
- [ ] Student profile creation/editing
- [ ] Career selection from curated list
- [ ] Skill-gap calculation with readiness percentage
- [ ] Personalized roadmap generation
- [ ] Project recommendation (at least 1 per career)
- [ ] Progress dashboard with real data
- [ ] Semester goals (create, toggle complete)
- [ ] Progress updates that recalculate readiness
- [ ] AI fallback (template-based content if AI fails)

### SHOULD HAVE (If Time Permits)

- [ ] AI-powered roadmap descriptions
- [ ] AI-powered project recommendations
- [ ] Multiple career path comparison
- [ ] Weekly study planner view

### BONUS / IF TIME

- [ ] Resume upload & skill extraction
- [ ] AI career assistant chat
- [ ] Resume-based gap detection
- [ ] Export roadmap as PDF

---

## Product Flow

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│  Student Profile │────▶│  Career Selection │────▶│  Skill-Gap Engine   │
│  (P1)            │     │  (P2)             │     │  (P2)               │
└─────────────────┘     └──────────────────┘     └──────────┬──────────┘
                                                             │
                                                             ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│  Progress        │◀────│  Roadmap +       │◀────│  Structured Gap     │
│  Dashboard (P4)  │     │  Projects (P3)   │     │  JSON               │
└─────────────────┘     └──────────────────┘     └─────────────────────┘
        │
        ▼
┌─────────────────┐
│  Semester Goals  │
│  (P4)            │
└─────────────────┘
```

---

## System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        Frontend (React)                       │
│  React + Tailwind CSS + React Router + Axios                 │
└──────────────────────────┬───────────────────────────────────┘
                           │ REST API (JSON)
┌──────────────────────────▼───────────────────────────────────┐
│                    Backend (Node.js + Express)                │
│                                                              │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐  │
│  │ Auth Routes  │  │ Profile      │  │ Career/Skill       │  │
│  │ (P1)         │  │ Routes (P1)  │  │ Routes (P2)        │  │
│  └─────────────┘  └──────────────┘  └────────────────────┘  │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐  │
│  │ Roadmap      │  │ Project      │  │ Dashboard/Goals    │  │
│  │ Routes (P3)  │  │ Routes (P3)  │  │ Routes (P4)        │  │
│  └─────────────┘  └──────────────┘  └────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              AI Service Layer (P3)                    │   │
│  │  OpenAI / Gemini API with structured JSON output     │   │
│  │  Fallback: Template-based content generator           │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────┬───────────────────────────────────┘
                           │
┌──────────────────────────▼───────────────────────────────────┐
│                    Database (MongoDB)                         │
│  users, student_profiles, skills, careers, career_skills,    │
│  roadmaps, roadmap_items, projects, recommendations,          │
│  semester_goals, progress_snapshots                          │
└──────────────────────────────────────────────────────────────┘
```

---

## AI Architecture

### Where AI Is Used

AI is used **only** in Person 3's module for:
1. Generating human-readable roadmap item descriptions
2. Generating personalized project recommendations
3. (Bonus) Resume skill extraction
4. (Bonus) Career assistant chat responses

### AI Is NOT Used For

- Skill-gap calculation (deterministic algorithm in P2)
- Readiness percentage (deterministic formula in P2)
- Career matching (rule-based in P2)
- Authentication or authorization
- Any critical path that would break the demo

### AI Flow

```
Structured Skill Gap (from P2)
        │
        ▼
┌─────────────────────┐
│  AI Prompt Builder   │  ← Injects: career, gaps, level, study hours
│  (P3)                │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  AI API Call         │  ← OpenAI GPT-4o-mini or Gemini
│  (P3)                │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  JSON Validation     │  ← Zod schema validation
│  (P3)                │
└─────────┬───────────┘
          │
    ┌─────┴─────┐
    │           │
    ▼           ▼
 Success     Failure
    │           │
    ▼           ▼
 Store in   Fallback to
 Database   Template Generator
```

### AI Output Schema (Roadmap)

```json
{
  "roadmapItems": [
    {
      "skillName": "REST API",
      "description": "Learn to consume RESTful APIs using Dio/HTTP client...",
      "estimatedHours": 6,
      "resources": ["https://restfulapi.net", "Dio package docs"],
      "order": 1
    }
  ]
}
```

### AI Output Schema (Project Recommendation)

```json
{
  "projects": [
    {
      "title": "Campus Event Manager",
      "description": "A Flutter app to manage campus events with Firebase backend...",
      "difficulty": "Intermediate",
      "estimatedWeeks": 3,
      "technologies": ["Flutter", "Firebase", "REST API"],
      "skillsGained": ["REST API", "Firebase Auth", "Cloud Firestore"],
      "careerRelevance": "Directly uses 3 missing skills from your gap analysis"
    }
  ]
}
```

### Fallback Strategy

If AI API fails (quota, network, timeout):
1. Log the error
2. Use `TemplateRoadmapGenerator` — a rule-based generator that creates roadmap items from the skill-gap data using pre-written templates per skill
3. Use `TemplateProjectGenerator` — matches projects from the database based on missing skills
4. Set `aiGenerated: false` in the response so the UI can show "Template-based" badge

---

## Skill-Gap Algorithm

### Data Model

Each career has required skills with weights:

```json
{
  "careerId": "flutter-developer",
  "requiredSkills": [
    { "skillName": "Dart", "weight": 0.9, "category": "core" },
    { "skillName": "Flutter", "weight": 1.0, "category": "core" },
    { "skillName": "REST API", "weight": 0.7, "category": "important" },
    { "skillName": "Firebase", "weight": 0.6, "category": "important" },
    { "skillName": "State Management", "weight": 0.6, "category": "important" },
    { "skillName": "Testing", "weight": 0.4, "category": "nice-to-have" },
    { "skillName": "CI/CD", "weight": 0.3, "category": "nice-to-have" }
  ]
}
```

### Student Skill Proficiency

Students self-report proficiency on a 1–5 scale:

```json
{
  "skills": [
    { "name": "Dart", "level": 4 },
    { "name": "Flutter", "level": 3 },
    { "name": "REST API", "level": 1 }
  ]
}
```

### Gap Calculation

For each required skill:

```
skillGap = max(0, requiredLevel - studentLevel) / requiredLevel
```

Where `requiredLevel` is derived from weight:
- weight >= 0.8 → requiredLevel = 4 (advanced)
- weight >= 0.5 → requiredLevel = 3 (intermediate)
- weight < 0.5 → requiredLevel = 2 (beginner)

### Priority Assignment

| Gap Range | Priority |
|---|---|
| gap >= 0.6 | HIGH |
| gap >= 0.3 | MEDIUM |
| gap > 0 | LOW |
| gap == 0 | MET |

### Readiness Percentage

```
readiness = Σ(skillWeight × (studentLevel / requiredLevel)) / Σ(skillWeight) × 100
```

Capped at 100%. This is a weighted average — core skills matter more.

### Example Output

```json
{
  "careerId": "flutter-developer",
  "readiness": 58,
  "skillAnalysis": [
    { "skill": "Dart", "studentLevel": 4, "requiredLevel": 4, "gap": 0, "priority": "MET", "weight": 0.9 },
    { "skill": "Flutter", "studentLevel": 3, "requiredLevel": 4, "gap": 0.25, "priority": "LOW", "weight": 1.0 },
    { "skill": "REST API", "studentLevel": 1, "requiredLevel": 3, "gap": 0.67, "priority": "HIGH", "weight": 0.7 },
    { "skill": "Firebase", "studentLevel": 0, "requiredLevel": 3, "gap": 1.0, "priority": "HIGH", "weight": 0.6 },
    { "skill": "State Management", "studentLevel": 0, "requiredLevel": 3, "gap": 1.0, "priority": "HIGH", "weight": 0.6 },
    { "skill": "Testing", "studentLevel": 0, "requiredLevel": 2, "gap": 1.0, "priority": "MEDIUM", "weight": 0.4 }
  ],
  "missingSkills": ["REST API", "Firebase", "State Management", "Testing"],
  "strongSkills": ["Dart"],
  "weakSkills": ["Flutter"]
}
```

---

## Database Design

### Overview

MongoDB with Mongoose ODM. 11 collections total.

### Collection Schemas

#### 1. `users` (Owner: P1)

| Field | Type | Required | Notes |
|---|---|---|---|
| _id | ObjectId | Auto | |
| name | String | Yes | |
| email | String | Yes | Unique, lowercase |
| passwordHash | String | Yes | bcrypt, 12 rounds |
| createdAt | Date | Auto | |

#### 2. `student_profiles` (Owner: P1)

| Field | Type | Required | Notes |
|---|---|---|---|
| _id | ObjectId | Auto | |
| userId | ObjectId → users | Yes | Unique index |
| branch | String | Yes | Enum: Computer, IT, Mechanical, Civil, ECE, Electrical, Chemical, Biotechnology |
| degree | String | Yes | e.g., "B.Tech", "B.E." |
| semester | Number | Yes | 1–8 |
| skills | Array of objects | Yes | `[{ name: String, level: Number (1-5) }]` |
| interests | Array of String | No | |
| careerGoal | String | Yes | Must match a career in careers collection |
| completedCourses | Array of String | No | |
| completedProjects | Array of objects | No | `[{ title: String, description: String }]` |
| studyHoursPerWeek | Number | Yes | 1–40 |
| updatedAt | Date | Auto | |

#### 3. `skills` (Owner: P2)

| Field | Type | Required | Notes |
|---|---|---|---|
| _id | ObjectId | Auto | |
| name | String | Yes | Unique |
| category | String | Yes | "programming", "design", "management", "domain" |
| description | String | No | |

#### 4. `careers` (Owner: P2)

| Field | Type | Required | Notes |
|---|---|---|---|
| _id | ObjectId | Auto | |
| careerId | String | Yes | Unique slug, e.g., "flutter-developer" |
| title | String | Yes | |
| branch | String | Yes | Primary branch |
| description | String | Yes | |
| icon | String | No | Emoji or icon name |
| averageSalary | String | No | e.g., "6-12 LPA" |

#### 5. `career_skills` (Owner: P2)

| Field | Type | Required | Notes |
|---|---|---|---|
| _id | ObjectId | Auto | |
| careerId | String → careers | Yes | |
| skillName | String → skills | Yes | |
| weight | Number | Yes | 0.0–1.0 |
| category | String | Yes | "core", "important", "nice-to-have" |

#### 6. `roadmaps` (Owner: P3)

| Field | Type | Required | Notes |
|---|---|---|---|
| _id | ObjectId | Auto | |
| userId | ObjectId → users | Yes | |
| careerId | String → careers | Yes | |
| generatedAt | Date | Auto | |
| aiGenerated | Boolean | Yes | true if AI was used |
| totalEstimatedHours | Number | Yes | Sum of item hours |

#### 7. `roadmap_items` (Owner: P3)

| Field | Type | Required | Notes |
|---|---|---|---|
| _id | ObjectId | Auto | |
| roadmapId | ObjectId → roadmaps | Yes | |
| skillName | String | Yes | |
| description | String | Yes | AI or template generated |
| estimatedHours | Number | Yes | |
| order | Number | Yes | 1-indexed |
| status | String | Yes | "pending", "in-progress", "completed" |
| prerequisites | Array of String | No | Skill names |
| resources | Array of String | No | URLs |

#### 8. `projects` (Owner: P3)

| Field | Type | Required | Notes |
|---|---|---|---|
| _id | ObjectId | Auto | |
| title | String | Yes | |
| description | String | Yes | |
| difficulty | String | Yes | "Beginner", "Intermediate", "Advanced" |
| estimatedWeeks | Number | Yes | |
| technologies | Array of String | Yes | |
| skillsGained | Array of String | Yes | |
| careerId | String → careers | No | null = universal |
| level | Number | Yes | 1–5, matches student semester level |

#### 9. `recommendations` (Owner: P3)

| Field | Type | Required | Notes |
|---|---|---|---|
| _id | ObjectId | Auto | |
| userId | ObjectId → users | Yes | |
| projectId | ObjectId → projects | Yes | |
| reason | String | Yes | Why this was recommended |
| matchScore | Number | Yes | 0–100 |
| createdAt | Date | Auto | |

#### 10. `semester_goals` (Owner: P4)

| Field | Type | Required | Notes |
|---|---|---|---|
| _id | ObjectId | Auto | |
| userId | ObjectId → users | Yes | |
| semester | Number | Yes | |
| title | String | Yes | |
| completed | Boolean | Yes | Default false |
| targetDate | Date | No | |
| createdAt | Date | Auto | |

#### 11. `progress_snapshots` (Owner: P4)

| Field | Type | Required | Notes |
|---|---|---|---|
| _id | ObjectId | Auto | |
| userId | ObjectId → users | Yes | |
| careerId | String → careers | Yes | |
| readiness | Number | Yes | 0–100 |
| roadmapCompletion | Number | Yes | 0–100 |
| projectsCompleted | Number | Yes | Count |
| studyHoursLogged | Number | Yes | Cumulative |
| snapshotDate | Date | Auto | |

---

## API Documentation

### Authentication (Owner: P1)

#### POST /api/auth/register

Register a new student account.

**Request:**
```json
{
  "name": "Dharmik",
  "email": "dharmik@college.edu",
  "password": "securePass123"
}
```

**Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "66a1b2c3...",
    "name": "Dharmik",
    "email": "dharmik@college.edu"
  }
}
```

**Errors:** 400 (validation), 409 (email exists)

---

#### POST /api/auth/login

**Request:**
```json
{
  "email": "dharmik@college.edu",
  "password": "securePass123"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": "...", "name": "Dharmik", "email": "..." }
}
```

**Errors:** 401 (invalid credentials)

---

#### GET /api/auth/me

Get current user info. **Auth required.**

**Response (200):**
```json
{
  "success": true,
  "user": { "id": "...", "name": "Dharmik", "email": "..." }
}
```

---

### Student Profile (Owner: P1)

#### POST /api/profile

Create or update student profile. **Auth required.**

**Request:**
```json
{
  "branch": "Computer",
  "degree": "B.Tech",
  "semester": 5,
  "skills": [
    { "name": "Dart", "level": 4 },
    { "name": "Flutter", "level": 3 },
    { "name": "REST API", "level": 1 }
  ],
  "interests": ["Mobile Development", "UI/UX"],
  "careerGoal": "flutter-developer",
  "completedCourses": ["Data Structures", "DBMS", "Operating Systems"],
  "completedProjects": [
    { "title": "Todo App", "description": "Simple Flutter todo with local storage" }
  ],
  "studyHoursPerWeek": 8
}
```

**Response (200):**
```json
{
  "success": true,
  "profile": {
    "id": "...",
    "userId": "...",
    "branch": "Computer",
    "semester": 5,
    "skills": [...],
    "careerGoal": "flutter-developer"
  }
}
```

---

#### GET /api/profile

Get current user's profile. **Auth required.**

**Response (200):**
```json
{
  "success": true,
  "profile": { ... }
}
```

---

### Careers & Skills (Owner: P2)

#### GET /api/careers

List all available careers. **Auth required.**

**Query params:** `?branch=Computer` (optional filter)

**Response (200):**
```json
{
  "success": true,
  "careers": [
    {
      "careerId": "flutter-developer",
      "title": "Flutter Developer",
      "branch": "Computer",
      "description": "Build cross-platform mobile apps...",
      "icon": "📱",
      "averageSalary": "6-12 LPA"
    }
  ]
}
```

---

#### GET /api/careers/:careerId

Get career details with required skills. **Auth required.**

**Response (200):**
```json
{
  "success": true,
  "career": {
    "careerId": "flutter-developer",
    "title": "Flutter Developer",
    "requiredSkills": [
      { "skillName": "Dart", "weight": 0.9, "category": "core" },
      { "skillName": "Flutter", "weight": 1.0, "category": "core" }
    ]
  }
}
```

---

#### POST /api/skill-gap/analyze

Run skill-gap analysis. **Auth required.**

**Request:**
```json
{
  "careerId": "flutter-developer"
}
```

**Response (200):**
```json
{
  "success": true,
  "analysis": {
    "careerId": "flutter-developer",
    "readiness": 58,
    "skillAnalysis": [
      {
        "skill": "REST API",
        "studentLevel": 1,
        "requiredLevel": 3,
        "gap": 0.67,
        "priority": "HIGH",
        "weight": 0.7
      }
    ],
    "missingSkills": ["REST API", "Firebase", "State Management"],
    "strongSkills": ["Dart"],
    "weakSkills": ["Flutter"]
  }
}
```

---

### Roadmap (Owner: P3)

#### POST /api/roadmap/generate

Generate personalized roadmap. **Auth required.**

**Request:**
```json
{
  "careerId": "flutter-developer"
}
```

**Response (200):**
```json
{
  "success": true,
  "roadmap": {
    "id": "...",
    "careerId": "flutter-developer",
    "aiGenerated": true,
    "totalEstimatedHours": 24,
    "items": [
      {
        "skillName": "REST API",
        "description": "Learn HTTP methods, REST conventions...",
        "estimatedHours": 6,
        "order": 1,
        "status": "pending",
        "prerequisites": [],
        "resources": ["https://restfulapi.net"]
      }
    ]
  }
}
```

---

#### GET /api/roadmap

Get user's latest roadmap. **Auth required.**

**Response (200):**
```json
{
  "success": true,
  "roadmap": { ... }
}
```

---

#### PATCH /api/roadmap/item/:itemId

Update roadmap item status. **Auth required.**

**Request:**
```json
{
  "status": "in-progress"
}
```

**Response (200):**
```json
{
  "success": true,
  "item": { "id": "...", "status": "in-progress" }
}
```

---

### Projects (Owner: P3)

#### GET /api/projects/recommended

Get personalized project recommendations. **Auth required.**

**Response (200):**
```json
{
  "success": true,
  "projects": [
    {
      "id": "...",
      "title": "Campus Event Manager",
      "description": "Flutter app with Firebase backend...",
      "difficulty": "Intermediate",
      "estimatedWeeks": 3,
      "technologies": ["Flutter", "Firebase", "REST API"],
      "skillsGained": ["REST API", "Firebase Auth", "Cloud Firestore"],
      "matchScore": 85,
      "reason": "Covers 3 of your missing skills: REST API, Firebase, State Management"
    }
  ]
}
```

---

### Dashboard & Goals (Owner: P4)

#### GET /api/dashboard

Get all dashboard data in one call. **Auth required.**

**Response (200):**
```json
{
  "success": true,
  "dashboard": {
    "readiness": 58,
    "careerGoal": "Flutter Developer",
    "skillProgress": [
      { "name": "Dart", "level": 4, "target": 4, "percent": 100 },
      { "name": "REST API", "level": 1, "target": 3, "percent": 33 }
    ],
    "roadmapCompletion": 20,
    "roadmapTotalItems": 5,
    "projectsCompleted": 1,
    "studyHoursThisWeek": 5,
    "studyHoursPerWeek": 8,
    "semesterGoals": {
      "total": 4,
      "completed": 1
    }
  }
}
```

---

#### GET /api/goals

List semester goals. **Auth required.**

**Response (200):**
```json
{
  "success": true,
  "goals": [
    { "id": "...", "title": "Learn REST API", "completed": true, "semester": 5 }
  ]
}
```

---

#### POST /api/goals

Create a goal. **Auth required.**

**Request:**
```json
{
  "title": "Learn Firebase",
  "semester": 5,
  "targetDate": "2026-10-15"
}
```

**Response (201):**
```json
{
  "success": true,
  "goal": { "id": "...", "title": "Learn Firebase", "completed": false }
}
```

---

#### PATCH /api/goals/:goalId

Toggle or update goal. **Auth required.**

**Request:**
```json
{
  "completed": true
}
```

**Response (200):**
```json
{
  "success": true,
  "goal": { "id": "...", "completed": true }
}
```

---

#### DELETE /api/goals/:goalId

Delete a goal. **Auth required.**

**Response (200):**
```json
{ "success": true }
```

---

#### POST /api/progress/log

Log study hours. **Auth required.**

**Request:**
```json
{
  "hours": 2,
  "date": "2026-09-28"
}
```

**Response (200):**
```json
{
  "success": true,
  "totalHoursThisWeek": 7
}
```

---

## UI Screens

### Screen 1: Landing Page

| Attribute | Value |
|---|---|
| **Owner** | P1 |
| **Purpose** | Introduce product, CTA to register/login |
| **Components** | Hero section, tagline, "Get Started" button, feature highlights |
| **API** | None |
| **Route** | `/` |

### Screen 2: Login / Register

| Attribute | Value |
|---|---|
| **Owner** | P1 |
| **Purpose** | Authenticate student |
| **Components** | Email, password fields; toggle login/register |
| **API** | `POST /api/auth/login`, `POST /api/auth/register` |
| **Route** | `/login` |

### Screen 3: Student Onboarding (Profile Form)

| Attribute | Value |
|---|---|
| **Owner** | P1 |
| **Purpose** | Collect all student profile data |
| **Components** | Multi-step form: (1) Branch/Semester, (2) Skills with level slider, (3) Interests, (4) Career goal dropdown, (5) Courses/Projects, (6) Study hours |
| **API** | `POST /api/profile` |
| **Route** | `/onboarding` |

### Screen 4: Career Selection

| Attribute | Value |
|---|---|
| **Owner** | P2 |
| **Purpose** | Browse and select career path |
| **Components** | Career cards grid with icon, title, branch tag, salary range; filter by branch |
| **API** | `GET /api/careers` |
| **Route** | `/careers` |

### Screen 5: AI Analysis Loading

| Attribute | Value |
|---|---|
| **Owner** | P3 |
| **Purpose** | Show progress while skill-gap + roadmap generate |
| **Components** | Animated loading with steps: "Analyzing skills...", "Identifying gaps...", "Generating roadmap..." |
| **API** | `POST /api/skill-gap/analyze`, `POST /api/roadmap/generate` |
| **Route** | `/analyzing` |

### Screen 6: Career Analysis / Skill Gap

| Attribute | Value |
|---|---|
| **Owner** | P2 |
| **Purpose** | Display skill-gap results |
| **Components** | Readiness gauge (circular progress), skill bars with priority badges (HIGH/MEDIUM/LOW/MET), missing skills list, strong skills list |
| **API** | `POST /api/skill-gap/analyze` |
| **Route** | `/analysis` |

### Screen 7: Personalized Roadmap

| Attribute | Value |
|---|---|
| **Owner** | P3 |
| **Purpose** | Show ordered learning plan |
| **Components** | Vertical timeline with skill name, description, hours, status toggle (pending → in-progress → completed), prerequisite badges |
| **API** | `GET /api/roadmap`, `PATCH /api/roadmap/item/:id` |
| **Route** | `/roadmap` |

### Screen 8: Project Recommendation

| Attribute | Value |
|---|---|
| **Owner** | P3 |
| **Purpose** | Show recommended projects |
| **Components** | Project cards with title, description, difficulty badge, duration, tech tags, skills gained, match score |
| **API** | `GET /api/projects/recommended` |
| **Route** | `/projects` |

### Screen 9: Dashboard

| Attribute | Value |
|---|---|
| **Owner** | P4 |
| **Purpose** | Central progress overview |
| **Components** | Readiness gauge, skill progress bars, roadmap completion %, projects count, study hours this week, semester goals summary |
| **API** | `GET /api/dashboard` |
| **Route** | `/dashboard` |

### Screen 10: Semester Goals

| Attribute | Value |
|---|---|
| **Owner** | P4 |
| **Purpose** | Manage semester goals |
| **Components** | Goal list with checkboxes, add goal form, delete button, progress bar |
| **API** | `GET /api/goals`, `POST /api/goals`, `PATCH /api/goals/:id`, `DELETE /api/goals/:id` |
| **Route** | `/goals` |

### Screen 11: AI Career Assistant (Bonus)

| Attribute | Value |
|---|---|
| **Owner** | P3 |
| **Purpose** | Personalized career Q&A |
| **Components** | Chat UI, context-aware responses |
| **API** | `POST /api/ai/chat` |
| **Route** | `/assistant` |

### Screen 12: Resume Analyzer (Bonus)

| Attribute | Value |
|---|---|
| **Owner** | P3 |
| **Purpose** | Upload resume, extract skills, update gaps |
| **Components** | File upload, extracted skills display, updated gap analysis |
| **API** | `POST /api/ai/resume` |
| **Route** | `/resume` |

---

## 4-Person Team Responsibilities

### PERSON 1 — Auth + Student Profile

**Owns:**
- `users` collection
- `student_profiles` collection
- Auth routes (`/api/auth/*`)
- Profile routes (`/api/profile`)
- Screens: Landing, Login/Register, Onboarding

**Deliverables:**
- JWT-based auth with bcrypt password hashing
- Profile CRUD with validation (express-validator)
- Multi-step onboarding form
- Branch enum validation

**APIs to implement:**
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/profile`
- `GET /api/profile`

**Database fields owned:**
- `users._id`, `users.name`, `users.email`, `users.passwordHash`, `users.createdAt`
- `student_profiles.*` (all fields)

**Integration points:**
- Provides `req.user` (JWT payload with userId) to all downstream routes
- Profile data consumed by P2's skill-gap engine

---

### PERSON 2 — Career + Skill-Gap Engine

**Owns:**
- `skills` collection
- `careers` collection
- `career_skills` collection
- Career routes (`/api/careers/*`)
- Skill-gap routes (`/api/skill-gap/*`)
- Screens: Career Selection, Skill Gap Analysis

**Deliverables:**
- Seed data: 12+ careers with required skills
- Skill-gap calculation algorithm (as defined above)
- Readiness percentage formula
- Priority assignment logic
- Career filtering by branch

**APIs to implement:**
- `GET /api/careers`
- `GET /api/careers/:careerId`
- `POST /api/skill-gap/analyze`

**Database fields owned:**
- `skills.*`
- `careers.*`
- `career_skills.*`

**Integration points:**
- Reads `student_profiles` (owned by P1) for current skills
- Outputs structured gap JSON consumed by P3's roadmap generator

---

### PERSON 3 — AI Roadmap + Project Recommendation

**Owns:**
- `roadmaps` collection
- `roadmap_items` collection
- `projects` collection
- `recommendations` collection
- AI service layer
- Roadmap routes (`/api/roadmap/*`)
- Project routes (`/api/projects/*`)
- Screens: AI Analysis Loading, Roadmap, Project Recommendation, (Bonus) AI Assistant, (Bonus) Resume Analyzer

**Deliverables:**
- AI service with prompt templates
- JSON schema validation (Zod)
- Template-based fallback generator
- Roadmap CRUD with status updates
- Project recommendation matching algorithm
- (Bonus) Resume parsing with AI

**APIs to implement:**
- `POST /api/roadmap/generate`
- `GET /api/roadmap`
- `PATCH /api/roadmap/item/:itemId`
- `GET /api/projects/recommended`
- (Bonus) `POST /api/ai/chat`
- (Bonus) `POST /api/ai/resume`

**Database fields owned:**
- `roadmaps.*`
- `roadmap_items.*`
- `projects.*`
- `recommendations.*`

**Integration points:**
- Reads skill-gap JSON from P2
- Reads `student_profiles` (owned by P1) for level/study hours
- Roadmap data consumed by P4's dashboard

---

### PERSON 4 — Dashboard + Progress + Semester Goals

**Owns:**
- `semester_goals` collection
- `progress_snapshots` collection
- Dashboard routes (`/api/dashboard`)
- Goal routes (`/api/goals/*`)
- Progress routes (`/api/progress/*`)
- Screens: Dashboard, Semester Goals

**Deliverables:**
- Dashboard aggregation endpoint (combines data from all modules)
- Goal CRUD with toggle
- Study hours logging
- Progress snapshot creation
- Final UI polish (responsive design, loading states, error handling)

**APIs to implement:**
- `GET /api/dashboard`
- `GET /api/goals`
- `POST /api/goals`
- `PATCH /api/goals/:goalId`
- `DELETE /api/goals/:goalId`
- `POST /api/progress/log`

**Database fields owned:**
- `semester_goals.*`
- `progress_snapshots.*`

**Integration points:**
- Reads `student_profiles` (P1) for study hours, skills
- Reads `roadmap_items` (P3) for roadmap completion
- Reads `recommendations` (P3) for project count
- Reads `career_skills` (P2) for skill targets

---

## Integration Contracts

### Contract 1: Profile → Skill-Gap (P1 → P2)

P2 reads `student_profiles` document:
```json
{
  "userId": "66a1b2c3...",
  "skills": [{ "name": "Dart", "level": 4 }],
  "careerGoal": "flutter-developer",
  "semester": 5,
  "studyHoursPerWeek": 8
}
```

P2 uses `skills` and `careerGoal` to run analysis. No direct API call needed — P2 queries the database directly.

---

### Contract 2: Skill-Gap → Roadmap (P2 → P3)

P3 calls `POST /api/skill-gap/analyze` (or P2 exposes internal function):
```json
{
  "analysis": {
    "readiness": 58,
    "missingSkills": ["REST API", "Firebase", "State Management"],
    "skillAnalysis": [
      { "skill": "REST API", "gap": 0.67, "priority": "HIGH", "weight": 0.7 }
    ]
  }
}
```

P3 uses `missingSkills` and `skillAnalysis` to generate roadmap items.

---

### Contract 3: Roadmap → Dashboard (P3 → P4)

P4 reads `roadmap_items` collection:
```json
{
  "roadmapId": "...",
  "items": [
    { "skillName": "REST API", "status": "completed", "order": 1 },
    { "skillName": "Firebase", "status": "pending", "order": 2 }
  ]
}
```

P4 calculates: `roadmapCompletion = completedItems / totalItems × 100`

---

### Contract 4: Projects → Dashboard (P3 → P4)

P4 reads `recommendations` collection filtered by userId:
```json
{
  "projectsCompleted": 2,
  "totalRecommended": 5
}
```

---

### Contract 5: Auth → All Modules (P1 → P2, P3, P4)

All protected routes use JWT middleware:
```javascript
// P1 owns this middleware
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = { userId: decoded.userId };
  next();
}
```

P2, P3, P4 import and use this middleware. P1 must finalize JWT secret and middleware first.

---

## Git Workflow

### Branch Strategy

```
main (protected)
  └── develop
        ├── feature/auth-profile        (P1)
        ├── feature/skill-engine        (P2)
        ├── feature/ai-roadmap          (P3)
        └── feature/dashboard           (P4)
```

### Rules

1. **No direct pushes to `main` or `develop`**
2. Create feature branch from `develop`
3. Commit naming: `feat: add login endpoint`, `fix: correct readiness formula`, `docs: update API docs`
4. Pull requests require 1 review from another teammate
5. Merge to `develop` only when feature is working
6. Final merge `develop` → `main` at 4:45 mark

### Conflict Avoidance

- Each person works on their own route files and components
- Shared files (server.js, db.js, models/index.js) are owned by P1 and modified via PR
- Database seed data is in separate files per module: `seeds/careers.js` (P2), `seeds/projects.js` (P3)
- API contract is defined in this README — no ambiguity

### Merge Schedule

| Time | Action |
|---|---|
| 1:00 | P1 merges `feature/auth-profile` → `develop` |
| 2:00 | P2 merges `feature/skill-engine` → `develop` |
| 3:00 | P3 merges `feature/ai-roadmap` → `develop` |
| 3:30 | P4 merges `feature/dashboard` → `develop` |
| 4:30 | Final integration testing on `develop` |
| 4:45 | Merge `develop` → `main` |

---

## 5-Hour Development Plan

### Phase 1: Setup (0:00 – 0:30)

| Time | P1 | P2 | P3 | P4 |
|---|---|---|---|---|
| 0:00–0:15 | Init Git repo, create branches | Init Git repo, create branches | Init Git repo, create branches | Init Git repo, create branches |
| 0:15–0:30 | Set up Express server, MongoDB connection, JWT middleware | Create career/skill seed data | Set up AI service with fallback | Set up React app with routing |

### Phase 2: Core Development (0:30 – 2:00)

| Time | P1 | P2 | P3 | P4 |
|---|---|---|---|---|
| 0:30–1:00 | Auth endpoints (register, login, me) | Career CRUD endpoints | AI prompt templates + fallback generator | Dashboard aggregation endpoint |
| 1:00–1:30 | Profile CRUD endpoints | Skill-gap algorithm implementation | Roadmap generation endpoint | Goals CRUD endpoints |
| 1:30–2:00 | Onboarding form UI | Career selection + Skill gap UI | Roadmap + Projects UI | Dashboard + Goals UI |

### Phase 3: Integration (2:00 – 3:00)

| Time | P1 | P2 | P3 | P4 |
|---|---|---|---|---|
| 2:00–2:30 | Integrate auth with all modules | Test skill-gap with real profile data | Connect roadmap to skill-gap output | Connect dashboard to all data sources |
| 2:30–3:00 | End-to-end auth flow testing | End-to-end analysis flow testing | End-to-end roadmap flow testing | End-to-end dashboard flow testing |

### Phase 4: AI + Polish (3:00 – 4:15)

| Time | P1 | P2 | P3 | P4 |
|---|---|---|---|---|
| 3:00–3:30 | Profile editing UI | Career data expansion | AI integration testing + fallback | UI polish, responsive design |
| 3:30–4:00 | Error handling, loading states | Algorithm edge cases | AI response validation | Progress tracking visualization |
| 4:00–4:15 | Bug fixes | Bug fixes | Bug fixes | Bug fixes |

### Phase 5: Testing + Demo Prep (4:15 – 5:00)

| Time | All |
|---|---|
| 4:15–4:30 | Full end-to-end testing on `develop` branch |
| 4:30–4:45 | Fix critical bugs, merge to `main` |
| 4:45–5:00 | Demo rehearsal, prepare judge talking points |

---

## Demo Flow

### Scenario: Dharmik, Computer Semester 5, wants to be a Flutter Developer

| Step | Action | Screen | What Judges See |
|---|---|---|---|
| 1 | Register with email | Login/Register | Clean auth flow |
| 2 | Fill profile: Computer, Sem 5, Dart(4), Flutter(3), REST API(1), 8 hrs/week | Onboarding | Multi-step form with skill sliders |
| 3 | Select "Flutter Developer" | Career Selection | Career cards with salary info |
| 4 | Click "Analyze My Skills" | AI Analysis | Animated loading with progress steps |
| 5 | View skill gaps | Skill Gap Analysis | Readiness: 58%, REST API HIGH priority, Firebase HIGH priority |
| 6 | View personalized roadmap | Roadmap | 5 items: REST API → Firebase → State Management → Testing → Build Project |
| 7 | View project recommendation | Projects | "Campus Event Manager" — Intermediate, 3 weeks, covers 3 missing skills |
| 8 | View dashboard | Dashboard | Readiness gauge, skill bars, roadmap progress, study hours |
| 9 | Add semester goal: "Learn Firebase" | Goals | Goal appears with checkbox |
| 10 | Mark "REST API" as completed in roadmap | Roadmap | Item turns green, dashboard readiness updates to 68% |
| 11 | Log 2 study hours | Dashboard | Study hours bar updates |

**Total demo time: 2–3 minutes**

---

## Judge Talking Points

### Problem Understanding
- We identified that students don't know WHAT to learn or IN WHAT ORDER
- Generic platforms don't account for branch, semester, or existing skills
- Our solution provides a structured, personalized path

### Innovation / Creativity
- Hybrid architecture: deterministic skill-gap engine + AI content generation
- Readiness percentage is calculated with a weighted formula, not random
- Roadmap is generated from actual gaps, not a generic template
- Projects are matched to missing skills with match scores

### Working Prototype
- Full end-to-end flow: register → profile → career → analysis → roadmap → projects → dashboard → progress
- Real database with 11 collections
- AI fallback ensures demo never breaks

### Technical Implementation
- JWT-based authentication
- RESTful API with 20+ endpoints
- MongoDB with proper relationships and indexing
- AI integration with structured JSON output and Zod validation
- React frontend with Tailwind CSS

### UI/UX
- Clean, modern design with consistent color scheme
- Multi-step onboarding reduces cognitive load
- Visual progress indicators (gauges, bars, badges)
- Responsive layout for demo on any screen

### Real-World Practicality
- Works for ANY branch (Computer, Mechanical, Civil, ECE, Electrical, etc.)
- 12+ career paths with real skill requirements
- Semester-aware goals and time estimates
- Progress tracking motivates consistent learning

### Presentation
- Clear demo flow showing INPUT → ANALYSIS → PERSONALIZATION → ACTION → PROGRESS
- Each team member can explain their module independently
- Architecture diagram shows clean separation of concerns

---

## Testing Checklist

### Unit Tests (If Time)
- [ ] Skill-gap calculation produces correct readiness %
- [ ] Priority assignment follows rules
- [ ] Roadmap items are ordered correctly
- [ ] Project match score is calculated correctly

### Integration Tests
- [ ] Register → Login → Create Profile → Analyze → Roadmap → Dashboard flow works
- [ ] Auth middleware blocks unauthenticated requests
- [ ] Profile update reflects in skill-gap analysis
- [ ] Roadmap item status update reflects in dashboard
- [ ] Goal creation/deletion works
- [ ] Study hours logging updates dashboard

### Manual Tests
- [ ] All screens render without errors
- [ ] Loading states show during API calls
- [ ] Error states show for failed API calls
- [ ] Responsive on laptop screen (demo device)
- [ ] AI fallback works when API key is invalid

---

## Definition of Done

The MVP is complete only when:

- [ ] Student can register and login
- [ ] Student can complete profile with all fields
- [ ] Student can select a career from the list
- [ ] System has career requirements data (12+ careers)
- [ ] Skill-gap calculation works with correct formula
- [ ] Career readiness is calculated logically (weighted average)
- [ ] Personalized roadmap is generated from gaps
- [ ] Project recommendation works with match score
- [ ] Dashboard displays actual stored data (not hardcoded)
- [ ] Semester goals can be created, toggled, and deleted
- [ ] Progress can be updated and readiness recalculates
- [ ] All four modules integrate without errors
- [ ] Database works with proper relationships
- [ ] AI failure has template-based fallback
- [ ] Demo can run from start to finish without crashes
- [ ] No critical API errors in browser console
- [ ] Team can explain the architecture and algorithm

---

## Future Improvements

- **Resume Analyzer** — Upload PDF, extract skills with AI, auto-update profile
- **AI Career Assistant** — Chat interface for personalized advice
- **Weekly Planner** — Auto-schedule study hours across the week
- **Peer Comparison** — Anonymous comparison with other students in same branch/semester
- **Job Market Integration** — Show real job postings requiring the skills being learned
- **Certificate Generation** — Generate completion certificates for roadmap milestones
- **Mobile App** — React Native version for on-the-go learning
- **Alumni Network** — Connect with seniors in target careers

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router, Tailwind CSS, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT (jsonwebtoken), bcrypt |
| AI | OpenAI GPT-4o-mini or Google Gemini API |
| Validation | express-validator, Zod |
| Deployment | Vercel (frontend), Render/Railway (backend), MongoDB Atlas (DB) |

---

## How to Run

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier)
- OpenAI API key (optional, for AI features)

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT_SECRET
npm run seed    # Seed careers and skills data
npm run dev     # Start on http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with VITE_API_URL=http://localhost:5000
npm run dev     # Start on http://localhost:3000
```

### Quick Start (Demo Mode)

If MongoDB is not available, use the in-memory demo mode:

```bash
cd backend
npm run demo    # Starts with in-memory data, no MongoDB needed
```

---

## Environment Variables

### Backend `.env`

```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/pathforge
JWT_SECRET=your-super-secret-key-change-in-production
OPENAI_API_KEY=sk-optional-for-ai-features
# OR
GEMINI_API_KEY=optional-for-ai-features
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:5000
```

---

## Project Structure

```
pathforge-ai/
├── README.md
├── backend/
│   ├── server.js
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── StudentProfile.js
│   │   ├── Skill.js
│   │   ├── Career.js
│   │   ├── CareerSkill.js
│   │   ├── Roadmap.js
│   │   ├── RoadmapItem.js
│   │   ├── Project.js
│   │   ├── Recommendation.js
│   │   ├── SemesterGoal.js
│   │   └── ProgressSnapshot.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── profile.js
│   │   ├── careers.js
│   │   ├── skillGap.js
│   │   ├── roadmap.js
│   │   ├── projects.js
│   │   ├── dashboard.js
│   │   ├── goals.js
│   │   └── progress.js
│   ├── services/
│   │   ├── skillGapEngine.js
│   │   ├── aiService.js
│   │   ├── templateRoadmap.js
│   │   └── templateProjects.js
│   ├── seeds/
│   │   ├── careers.js
│   │   ├── skills.js
│   │   └── projects.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── api/
│   │   │   └── client.js
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── ui/
│   │   │       ├── Button.jsx
│   │   │       ├── Card.jsx
│   │   │       ├── Input.jsx
│   │   │       ├── ProgressBar.jsx
│   │   │       └── Badge.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Onboarding.jsx
│   │   │   ├── CareerSelection.jsx
│   │   │   ├── Analyzing.jsx
│   │   │   ├── SkillGap.jsx
│   │   │   ├── Roadmap.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Goals.jsx
│   │   │   ├── Assistant.jsx
│   │   │   └── Resume.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   └── useApi.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   └── index.css
│   ├── .env.example
│   └── package.json
└── docs/
    └── API_CONTRACT.md
```

---

## Career Seed Data

### Computer / IT

| Career ID | Title | Required Skills |
|---|---|---|
| `flutter-developer` | Flutter Developer | Dart, Flutter, REST API, Firebase, State Management, Testing |
| `fullstack-developer` | Full Stack Developer | JavaScript, React, Node.js, MongoDB, REST API, Git |
| `ai-ml-engineer` | AI/ML Engineer | Python, Machine Learning, Deep Learning, Mathematics, TensorFlow |
| `data-analyst` | Data Analyst | Python, SQL, Excel, Statistics, Data Visualization |
| `devops-engineer` | DevOps Engineer | Linux, Docker, Kubernetes, CI/CD, AWS, Scripting |

### Mechanical

| Career ID | Title | Required Skills |
|---|---|---|
| `robotics-engineer` | Robotics Engineer | C++, ROS, Electronics, Control Systems, CAD |
| `automotive-engineer` | Automotive Engineer | CAD, Thermodynamics, Vehicle Dynamics, MATLAB |
| `cad-designer` | CAD Designer | AutoCAD, SolidWorks, GD&T, Manufacturing Processes |

### Civil

| Career ID | Title | Required Skills |
|---|---|---|
| `structural-engineer` | Structural Engineer | AutoCAD, STAAD.Pro, Structural Analysis, Concrete Design |
| `construction-manager` | Construction Manager | Project Management, Estimation, Scheduling, Safety |

### ECE

| Career ID | Title | Required Skills |
|---|---|---|
| `embedded-engineer` | Embedded Engineer | C, Microcontrollers, RTOS, PCB Design, Communication Protocols |
| `iot-engineer` | IoT Engineer | C++, Python, Sensors, Cloud Platforms, Networking |
| `vlsi-engineer` | VLSI Engineer | Verilog, VHDL, Digital Design, CMOS, FPGA |

### Electrical

| Career ID | Title | Required Skills |
|---|---|---|
| `power-engineer` | Power Engineer | Power Systems, MATLAB, Electrical Machines, Protection |
| `automation-engineer` | Automation Engineer | PLC, SCADA, HMI, Industrial Networking, Instrumentation |

---

## API Error Format

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "details": [
      { "field": "email", "message": "Email is required" }
    ]
  }
}
```

### Common Error Codes

| Code | HTTP Status | Meaning |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists |
| `AI_ERROR` | 503 | AI service unavailable (fallback used) |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

---

*This README is the single source of truth for the PathForge AI project. All team members should refer to this document for API contracts, database schemas, and ownership boundaries.*
