# Campus Club Management Portal

A full-stack MERN web application for managing campus clubs, events, memberships, and registrations.

---

## Project Overview

Students can discover clubs, join them, browse events, and register. Admins manage clubs, events, users, and registrations through a dedicated dashboard.

---

## Technology Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React.js, Vite, Bootstrap 5, Axios  |
| Backend    | Node.js, Express.js                 |
| Database   | MongoDB Atlas, Mongoose             |
| Auth       | JWT, bcryptjs                       |
| Validation | express-validator (server), custom (client) |

---

## User Roles

- **Admin** — Full CRUD on clubs, events, users. View all registrations.
- **Student** — Browse clubs/events, join clubs, register for events, manage own data.

---

## Project Structure

```
campus-club-management-portal/
  client/
    src/
      components/     # Reusable UI (Spinner, Alert, ConfirmModal, ProtectedRoute)
      context/        # AuthContext (JWT + user state)
      layouts/        # Navbar, MainLayout
      pages/
        admin/        # AdminDashboard, AdminClubs, AdminEvents, AdminUsers, AdminRegistrations
        student/      # StudentDashboard, MyMemberships, MyRegistrations
        Landing, Login, Signup, ClubsPage, ClubDetail,
        EventsPage, EventDetail, ChangePassword, NotFound
      services/       # api.js (axios instance) + index.js (all API calls)
  server/
    config/           # db.js (MongoDB connection)
    controllers/      # authController, clubController, eventController,
                      # membershipController, registrationController,
                      # userController, dashboardController
    middleware/       # auth.js (protect + adminOnly), validate.js
    models/           # User, Club, Membership, Event, EventRegistration
    routes/           # One file per resource
    app.js            # Express app setup
    server.js         # Entry point
  .gitignore
  README.md
  VIVA_PREPARATION.md
```

---

## Prerequisites

- Node.js v18+
- npm v9+
- A free MongoDB Atlas account

---

## MongoDB Atlas Setup

1. Go to https://cloud.mongodb.com and create a free account.
2. Create a new **free tier (M0)** cluster.
3. Under **Database Access**, create a user with a username and password.
4. Under **Network Access**, add `0.0.0.0/0` (allow from anywhere) for development.
5. Click **Connect > Drivers** and copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<username>` and `<password>` with your credentials.
7. Add your database name before the `?`: `.../campus_club_portal?retryWrites...`

---

## Environment Variable Setup

```bash
# In the server/ folder, copy the example file:
copy server\.env.example server\.env
```

Then open `server/.env` and fill in:

```env
MONGODB_URI=mongodb+srv://youruser:yourpass@cluster0.xxxxx.mongodb.net/campus_club_portal?retryWrites=true&w=majority
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=7d
PORT=5000
CLIENT_URL=http://localhost:5173
```

To generate a secure JWT secret, run:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Installation & Running

### Backend
```bash
cd server
npm install
npm run dev
# Server runs on http://localhost:5000
```

### Frontend
```bash
cd client
npm install
npm run dev
# App runs on http://localhost:5173
```

Open http://localhost:5173 in your browser.

---

## Creating the First Admin

Public signup always creates a **student** account. To create an admin:

1. Sign up normally to create a student account.
2. In MongoDB Atlas, open your cluster > Browse Collections > `users`.
3. Find your user document and change `"role": "student"` to `"role": "admin"`.
4. Log out and log back in — you'll be redirected to the Admin Dashboard.

---

## API Endpoints

### Auth
| Method | Endpoint                  | Access    | Description          |
|--------|---------------------------|-----------|----------------------|
| POST   | /api/auth/signup          | Public    | Register new student |
| POST   | /api/auth/login           | Public    | Login                |
| GET    | /api/auth/me              | Protected | Get current user     |
| PUT    | /api/auth/change-password | Protected | Change password      |

### Clubs
| Method | Endpoint        | Access    |
|--------|-----------------|-----------|
| GET    | /api/clubs      | Public    |
| GET    | /api/clubs/:id  | Public    |
| POST   | /api/clubs      | Admin     |
| PUT    | /api/clubs/:id  | Admin     |
| DELETE | /api/clubs/:id  | Admin     |

### Events
| Method | Endpoint         | Access    |
|--------|------------------|-----------|
| GET    | /api/events      | Public    |
| GET    | /api/events/:id  | Public    |
| POST   | /api/events      | Admin     |
| PUT    | /api/events/:id  | Admin     |
| DELETE | /api/events/:id  | Admin     |

### Memberships
| Method | Endpoint              | Access    |
|--------|-----------------------|-----------|
| POST   | /api/memberships      | Student   |
| GET    | /api/memberships/my   | Student   |
| GET    | /api/memberships      | Admin     |
| DELETE | /api/memberships/:id  | Student   |

### Registrations
| Method | Endpoint                | Access    |
|--------|-------------------------|-----------|
| POST   | /api/registrations      | Student   |
| GET    | /api/registrations/my   | Student   |
| GET    | /api/registrations      | Admin     |
| DELETE | /api/registrations/:id  | Student   |

### Users (Admin only)
| Method | Endpoint        |
|--------|-----------------|
| GET    | /api/users      |
| POST   | /api/users      |
| PUT    | /api/users/:id  |
| DELETE | /api/users/:id  |

### Dashboard
| Method | Endpoint        | Access |
|--------|-----------------|--------|
| GET    | /api/dashboard  | Admin  |

---

## Postman Testing Guide

1. **Signup**: POST `http://localhost:5000/api/auth/signup`
   ```json
   { "name": "Test Student", "email": "student@test.com", "password": "Test1234" }
   ```

2. **Login**: POST `http://localhost:5000/api/auth/login`
   ```json
   { "email": "student@test.com", "password": "Test1234" }
   ```
   Copy the `token` from the response.

3. For protected routes, add header: `Authorization: Bearer <token>`

4. **Create Club (Admin token required)**:
   POST `http://localhost:5000/api/clubs`
   ```json
   {
     "name": "Coding Club",
     "description": "For programming enthusiasts",
     "category": "Technical",
     "facultyCoordinator": "Dr. Smith",
     "meetingDetails": "Every Monday 5PM"
   }
   ```

5. **Join Club**: POST `http://localhost:5000/api/memberships`
   ```json
   { "clubId": "<club_id_from_step_4>" }
   ```

6. **Register for Event**: POST `http://localhost:5000/api/registrations`
   ```json
   { "eventId": "<event_id>" }
   ```

---

## Test Scenarios

- ✅ Valid signup and login
- ✅ Invalid email / weak password (missing uppercase or number)
- ✅ Duplicate email signup → 400 error
- ✅ Wrong login credentials → 401 error
- ✅ Access protected route without token → 401
- ✅ Student hitting admin API → 403
- ✅ Admin CRUD on clubs, events, users
- ✅ Student joining a club
- ✅ Duplicate membership → 400 error
- ✅ Event registration
- ✅ Duplicate event registration → 400 error
- ✅ Event full (capacity exceeded) → 400 error
- ✅ Change password with wrong current password → 400

---

## GitHub Setup

```bash
# From the project root
git init
git add .
git commit -m "Initial commit: Campus Club Management Portal"
git remote add origin https://github.com/<your-username>/campus-club-portal.git
git push -u origin main
```

Make sure `.env` is in `.gitignore` before pushing.

---

## Known Limitations

- No email verification on signup
- No image upload for clubs/events
- Admin cannot reset another user's password from the UI (only via MongoDB Atlas directly)
- No pagination on large data sets
