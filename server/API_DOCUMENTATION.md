# PATHFORGE AI — API Documentation

## Base URL

```
http://localhost:5000/api
```

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "Request successful",
  "data": {}
}
```

### Error Response

```json
{
  "success": false,
  "message": "Something went wrong",
  "error": "ERROR_CODE"
}
```

---

## Authentication

### POST /api/auth/register

Register a new user account.

**Authentication:** None

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "role": "student"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student"
    },
    "token": "jwt_token_here"
  }
}
```

**Errors:**
- `409 DUPLICATE_EMAIL` — Email already registered
- `400 VALIDATION_ERROR` — Invalid input data

---

### POST /api/auth/login

Login with email and password.

**Authentication:** None

**Request Body:**
```json
{
  "email": "student01@pathforge.demo",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "name": "Aarav Sharma",
      "email": "student01@pathforge.demo",
      "role": "student"
    },
    "token": "jwt_token_here"
  }
}
```

**Errors:**
- `401 INVALID_CREDENTIALS` — Wrong email or password
- `400 VALIDATION_ERROR` — Invalid input data

---

### GET /api/auth/me

Get current authenticated user.

**Authentication:** Bearer Token

**Response (200):**
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "user": {
      "id": "uuid",
      "name": "Aarav Sharma",
      "email": "student01@pathforge.demo",
      "role": "student",
      "createdAt": "2026-01-15T10:30:00.000Z"
    }
  }
}
```

**Errors:**
- `401 UNAUTHORIZED` — No token provided
- `401 TOKEN_EXPIRED` — Token has expired
- `401 INVALID_TOKEN` — Invalid token

---

## Profile

### GET /api/profile

Get student profile with user details and career goal.

**Authentication:** Bearer Token

**Response (200):**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "profile": {
      "id": "uuid",
      "userId": "uuid",
      "branch": "Computer Engineering",
      "semester": 5,
      "college": "National Institute of Technology",
      "careerGoalId": "uuid",
      "studyHoursPerWeek": 12,
      "bio": "Passionate about building scalable web applications",
      "user": {
        "id": "uuid",
        "name": "Aarav Sharma",
        "email": "student01@pathforge.demo"
      },
      "careerGoal": {
        "id": "uuid",
        "title": "Flutter Developer",
        "category": "Mobile Development"
      }
    }
  }
}
```

---

### PUT /api/profile

Update student profile.

**Authentication:** Bearer Token

**Request Body:**
```json
{
  "branch": "Information Technology",
  "semester": 6,
  "college": "Delhi Technological University",
  "careerGoalId": "uuid",
  "studyHoursPerWeek": 15,
  "bio": "Updated bio"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "profile": { ... }
  }
}
```

---

## Skills

### GET /api/skills

Get all active skills.

**Authentication:** None

**Query Parameters:**
- `category` (optional) — Filter by category
- `search` (optional) — Search by name

**Response (200):**
```json
{
  "success": true,
  "message": "Skills retrieved successfully",
  "data": {
    "skills": [
      {
        "id": "uuid",
        "name": "Dart",
        "category": "Programming Languages",
        "description": "Client-optimized programming language",
        "difficulty": "Beginner",
        "isActive": true
      }
    ],
    "total": 40
  }
}
```

---

### GET /api/skills/:id

Get skill by ID with related data.

**Authentication:** None

**Response (200):**
```json
{
  "success": true,
  "message": "Skill retrieved successfully",
  "data": {
    "skill": {
      "id": "uuid",
      "name": "Dart",
      "category": "Programming Languages",
      "studentSkills": [...],
      "careerSkills": [...]
    }
  }
}
```

---

## Careers

### GET /api/careers

Get all active careers with required skills.

**Authentication:** None

**Query Parameters:**
- `category` (optional) — Filter by category

**Response (200):**
```json
{
  "success": true,
  "message": "Careers retrieved successfully",
  "data": {
    "careers": [
      {
        "id": "uuid",
        "title": "Flutter Developer",
        "description": "Build cross-platform mobile applications",
        "category": "Mobile Development",
        "difficulty": "Intermediate",
        "averageLearningHours": 500,
        "requiredEducation": "Bachelor in Engineering/Technology",
        "careerSkills": [
          {
            "skill": { "id": "uuid", "name": "Dart", "category": "Programming Languages" },
            "weight": 1.0,
            "requiredLevel": 4,
            "importance": "HIGH"
          }
        ]
      }
    ],
    "total": 20
  }
}
```

---

### GET /api/careers/:careerId

Get career by ID with all required skills.

**Authentication:** None

**Response (200):**
```json
{
  "success": true,
  "message": "Career retrieved successfully",
  "data": {
    "career": {
      "id": "uuid",
      "title": "Flutter Developer",
      "description": "...",
      "category": "Mobile Development",
      "careerSkills": [
        {
          "skill": { "id": "uuid", "name": "Dart", "category": "Programming Languages", "description": "..." },
          "weight": 1.0,
          "requiredLevel": 4,
          "importance": "HIGH"
        }
      ]
    }
  }
}
```

**Errors:**
- `404 NOT_FOUND` — Career not found

---

## Skill Gap Analysis

### POST /api/skill-gap/analyze

Analyze skill gap between student and career.

**Authentication:** Bearer Token

**Request Body:**
```json
{
  "careerId": "uuid-of-career"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Skill gap analysis completed",
  "data": {
    "career": {
      "id": "uuid",
      "title": "Flutter Developer",
      "category": "Mobile Development",
      "difficulty": "Intermediate"
    },
    "readiness": 52,
    "missingSkills": [
      {
        "skillId": "uuid",
        "skillName": "Firebase",
        "currentLevel": 2,
        "requiredLevel": 3,
        "gap": 0.33,
        "priority": "MEDIUM"
      }
    ],
    "skillAnalysis": [
      {
        "skillId": "uuid",
        "skillName": "Dart",
        "category": "Programming Languages",
        "studentLevel": 3,
        "requiredLevel": 4,
        "gap": 0.25,
        "priority": "LOW",
        "importance": "HIGH",
        "weight": 1.0
      }
    ],
    "totalRequiredSkills": 7,
    "metSkills": 3
  }
}
```

**Errors:**
- `404 NOT_FOUND` — Career not found
- `400 VALIDATION_ERROR` — Invalid career ID format

---

## Roadmap

### POST /api/roadmap/generate

Generate a new learning roadmap using AI.

**Authentication:** Bearer Token

**Request Body:**
```json
{
  "careerId": "uuid-of-career"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Roadmap generated successfully",
  "data": {
    "roadmap": {
      "id": "uuid",
      "studentId": "uuid",
      "careerId": "uuid",
      "title": "Flutter Developer Learning Path",
      "description": "A structured roadmap...",
      "readinessAtCreation": 45,
      "estimatedTotalHours": 500,
      "status": "not_started",
      "roadmapItems": [
        {
          "id": "uuid",
          "title": "Learn Dart Fundamentals",
          "stepOrder": 1,
          "estimatedHours": 30,
          "difficulty": "Beginner",
          "status": "not_started",
          "progressPercentage": 0
        }
      ],
      "career": { "id": "uuid", "title": "Flutter Developer" }
    }
  }
}
```

---

### GET /api/roadmap

Get all roadmaps for authenticated student.

**Authentication:** Bearer Token

**Response (200):**
```json
{
  "success": true,
  "message": "Roadmaps retrieved successfully",
  "data": {
    "roadmaps": [
      {
        "id": "uuid",
        "title": "Flutter Developer Learning Path",
        "status": "in_progress",
        "career": { "id": "uuid", "title": "Flutter Developer" },
        "roadmapItems": [...]
      }
    ],
    "total": 3
  }
}
```

---

### GET /api/roadmap/:roadmapId

Get roadmap by ID with all items.

**Authentication:** Bearer Token

**Response (200):**
```json
{
  "success": true,
  "message": "Roadmap retrieved successfully",
  "data": {
    "roadmap": {
      "id": "uuid",
      "title": "Flutter Developer Learning Path",
      "status": "in_progress",
      "career": { ... },
      "roadmapItems": [
        {
          "id": "uuid",
          "title": "Learn Dart Fundamentals",
          "stepOrder": 1,
          "status": "in_progress",
          "progressPercentage": 50,
          "skill": { "id": "uuid", "name": "Dart" }
        }
      ]
    }
  }
}
```

---

### PUT /api/roadmap/item/:itemId

Update roadmap item progress.

**Authentication:** Bearer Token

**Request Body:**
```json
{
  "status": "in_progress",
  "progress_percentage": 75
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Roadmap item updated successfully",
  "data": {
    "item": {
      "id": "uuid",
      "title": "Learn Dart Fundamentals",
      "status": "in_progress",
      "progressPercentage": 75
    }
  }
}
```

---

## Projects

### GET /api/projects

Get all projects.

**Authentication:** None

**Query Parameters:**
- `difficulty` (optional) — Filter by difficulty
- `search` (optional) — Search by title

**Response (200):**
```json
{
  "success": true,
  "message": "Projects retrieved successfully",
  "data": {
    "projects": [
      {
        "id": "uuid",
        "title": "Student Attendance App",
        "description": "A mobile app to track student attendance",
        "difficulty": "Intermediate",
        "estimatedHours": 80,
        "technologies": ["Flutter", "Firebase", "REST API"],
        "features": ["QR scanning", "Real-time sync", "Reports"],
        "projectSkills": [
          { "skill": { "id": "uuid", "name": "Flutter", "category": "Mobile Development" } }
        ]
      }
    ],
    "total": 25
  }
}
```

---

### GET /api/projects/recommended

Get personalized project recommendations.

**Authentication:** Bearer Token

**Response (200):**
```json
{
  "success": true,
  "message": "Recommended projects retrieved successfully",
  "data": {
    "recommendations": [
      {
        "projectId": "uuid",
        "title": "Student Attendance App",
        "description": "...",
        "difficulty": "Intermediate",
        "estimatedHours": 80,
        "technologies": ["Flutter", "Firebase", "REST API"],
        "matchPercentage": 75,
        "matchedSkills": ["Flutter", "Firebase"],
        "missingSkills": ["REST API"],
        "priority": "high",
        "reason": "This project allows you to practice Flutter, Firebase skills."
      }
    ],
    "total": 10
  }
}
```

---

## Dashboard

### GET /api/dashboard

Get aggregated dashboard data.

**Authentication:** Bearer Token

**Response (200):**
```json
{
  "success": true,
  "message": "Dashboard data retrieved successfully",
  "data": {
    "student": {
      "id": "uuid",
      "name": "Aarav Sharma",
      "email": "student01@pathforge.demo",
      "branch": "Computer Engineering",
      "semester": 5,
      "college": "National Institute of Technology",
      "studyHoursPerWeek": 12
    },
    "career": {
      "id": "uuid",
      "title": "Flutter Developer",
      "category": "Mobile Development"
    },
    "readiness": 62,
    "roadmapProgress": 42,
    "studyHoursThisWeek": 12.5,
    "completedProjects": 2,
    "skillsCompleted": 8,
    "totalSkills": 15,
    "goals": [
      {
        "id": "uuid",
        "title": "Complete Dart Fundamentals",
        "status": "completed",
        "progressPercentage": 100
      }
    ],
    "recentProgress": [
      {
        "date": "2026-09-20",
        "studyHours": 3.5,
        "readinessPercentage": 58.5
      }
    ],
    "recommendedProjects": [
      {
        "projectId": "uuid",
        "title": "Student Attendance App",
        "matchPercentage": 75,
        "priority": "high"
      }
    ]
  }
}
```

---

## Goals

### GET /api/goals

Get all goals for authenticated student.

**Authentication:** Bearer Token

**Query Parameters:**
- `status` (optional) — Filter by status
- `semester` (optional) — Filter by semester

**Response (200):**
```json
{
  "success": true,
  "message": "Goals retrieved successfully",
  "data": {
    "goals": [
      {
        "id": "uuid",
        "title": "Complete Dart Fundamentals",
        "description": "Finish Dart language basics",
        "semester": 1,
        "targetDate": "2026-12-15",
        "progressPercentage": 100,
        "status": "completed"
      }
    ],
    "total": 5
  }
}
```

---

### POST /api/goals

Create a new goal.

**Authentication:** Bearer Token

**Request Body:**
```json
{
  "title": "Learn React",
  "description": "Complete React tutorial",
  "semester": 4,
  "target_date": "2027-03-15",
  "progress_percentage": 0,
  "status": "not_started"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Goal created successfully",
  "data": {
    "goal": { ... }
  }
}
```

---

### PUT /api/goals/:goalId

Update a goal.

**Authentication:** Bearer Token

**Request Body:**
```json
{
  "title": "Learn React",
  "progress_percentage": 50,
  "status": "in_progress"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Goal updated successfully",
  "data": {
    "goal": { ... }
  }
}
```

---

### DELETE /api/goals/:goalId

Delete a goal.

**Authentication:** Bearer Token

**Response (200):**
```json
{
  "success": true,
  "message": "Goal deleted successfully",
  "data": null
}
```

---

## Progress

### GET /api/progress

Get progress snapshots for authenticated student.

**Authentication:** Bearer Token

**Query Parameters:**
- `limit` (optional) — Number of records to return (default: 30, max: 100)

**Response (200):**
```json
{
  "success": true,
  "message": "Progress retrieved successfully",
  "data": {
    "progress": [
      {
        "id": "uuid",
        "date": "2026-09-20",
        "studyHours": 3.5,
        "completedRoadmapItems": 5,
        "completedProjects": 1,
        "readinessPercentage": 58.5,
        "skillsImproved": ["JavaScript", "React"]
      }
    ],
    "total": 30
  }
}
```

---

### POST /api/progress/log

Log a new progress snapshot.

**Authentication:** Bearer Token

**Request Body:**
```json
{
  "study_hours": 4.5,
  "completed_roadmap_items": 6,
  "completed_projects": 1,
  "readiness_percentage": 60,
  "skills_improved": ["Dart", "Flutter"],
  "date": "2026-09-28"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Progress logged successfully",
  "data": {
    "snapshot": { ... }
  }
}
```

---

## Error Codes

| Code | HTTP Status | Description |
|---|---|---|
| UNAUTHORIZED | 401 | No token provided |
| TOKEN_EXPIRED | 401 | JWT token expired |
| INVALID_TOKEN | 401 | Invalid JWT token |
| INVALID_CREDENTIALS | 401 | Wrong email/password |
| VALIDATION_ERROR | 400 | Invalid input data |
| DUPLICATE_EMAIL | 409 | Email already registered |
| DUPLICATE_ENTRY | 409 | Unique constraint violation |
| FOREIGN_KEY_VIOLATION | 400 | Referenced record doesn't exist |
| NOT_FOUND | 404 | Record not found |
| INTERNAL_ERROR | 500 | Server error |
