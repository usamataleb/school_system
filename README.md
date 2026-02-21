# SchoolSys Frontend — 24BIT108

React frontend for the School Students System REST API.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm start
```

App runs at: http://localhost:3000
Login with: admin / admin123

## Requirements
- Node.js 16+
- Django backend running at http://127.0.0.1:8000

## Pages

| Page        | Route          | Description                     |
|-------------|----------------|---------------------------------|
| Login       | /login         | Admin JWT login                 |
| Dashboard   | /              | Stats overview + recent records |
| Students    | /students      | Register, view, edit, delete    |
| Courses     | /courses       | Add, view, edit, delete         |
| Enrollments | /enrollments   | Enroll students into courses    |
| Results     | /results       | Record marks, view grades       |

## Stack
- React 18 + React Router v6
- Axios (API calls with JWT)
- Custom CSS (no UI library)
