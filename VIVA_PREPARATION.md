# Viva Preparation — Campus Club Management Portal

Simple explanations for your viva/presentation.

---

## 1. What is React.js?

React is a JavaScript library for building user interfaces. Instead of reloading the whole page, React updates only the parts that change — this is called a **Single Page Application (SPA)**.

Key concepts used in this project:
- **Components** — reusable UI pieces (e.g., Navbar, Spinner, Alert)
- **useState** — stores data that can change (e.g., form inputs, loading state)
- **useEffect** — runs code when a component loads (e.g., fetch clubs from API)
- **Context API** — shares user/auth state across all components without prop drilling

---

## 2. What is Node.js?

Node.js lets you run JavaScript on the **server** (outside the browser). It is fast because it handles many requests at once without waiting (non-blocking I/O).

---

## 3. What is Express.js?

Express is a lightweight framework built on Node.js that makes it easy to:
- Define API routes (GET, POST, PUT, DELETE)
- Use middleware (functions that run before your route handler)
- Send JSON responses

Example:
```js
app.get('/api/clubs', (req, res) => {
  res.json({ clubs: [] });
});
```

---

## 4. What is MongoDB Atlas?

MongoDB is a **NoSQL database** that stores data as JSON-like documents instead of tables. Atlas is the cloud-hosted version — no local installation needed.

Why MongoDB for this project?
- Flexible schema (easy to add fields)
- Works naturally with JavaScript/JSON
- Free tier available on Atlas

---

## 5. What is Mongoose?

Mongoose is an ODM (Object Data Modeling) library that connects Node.js to MongoDB. It lets you:
- Define **schemas** (structure of your data)
- Add **validation** (required fields, min/max values)
- Use **models** to query the database

Example:
```js
const club = await Club.findById(id); // Mongoose query
```

---

## 6. What is a REST API?

REST (Representational State Transfer) is a standard way to build APIs using HTTP methods:

| HTTP Method | Action         | Example              |
|-------------|----------------|----------------------|
| GET         | Read data      | GET /api/clubs       |
| POST        | Create data    | POST /api/clubs      |
| PUT         | Update data    | PUT /api/clubs/:id   |
| DELETE      | Delete data    | DELETE /api/clubs/:id|

The server always responds with **JSON** and an appropriate **status code** (200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Server Error).

---

## 7. What is JWT (JSON Web Token)?

JWT is a secure way to authenticate users without storing sessions on the server.

**Flow:**
1. User logs in → server verifies password → creates a signed JWT token
2. Token is stored in the browser's `localStorage`
3. Every API request sends the token in the `Authorization: Bearer <token>` header
4. Server verifies the token signature → knows who the user is

A JWT has 3 parts: `header.payload.signature`
- The payload contains the user's ID
- The signature ensures it hasn't been tampered with

---

## 8. What is bcrypt?

bcrypt is used to **hash passwords** before storing them in the database.

- A hash is a one-way transformation — you cannot reverse it to get the original password
- When a user logs in, bcrypt compares the entered password against the stored hash
- Even if the database is leaked, passwords are not exposed

```js
const hash = await bcrypt.hash(password, 10); // 10 = salt rounds
const match = await bcrypt.compare(enteredPassword, storedHash);
```

---

## 9. What is CRUD?

CRUD stands for the four basic database operations:

| Operation | HTTP Method | Example                    |
|-----------|-------------|----------------------------|
| Create    | POST        | Add a new club             |
| Read      | GET         | View all clubs             |
| Update    | PUT         | Edit a club's details      |
| Delete    | DELETE      | Remove a club              |

---

## 10. What is Middleware?

Middleware is a function that runs **between** the request arriving and the route handler responding.

In this project:
- `protect` middleware — checks the JWT token, attaches `req.user`
- `adminOnly` middleware — checks if `req.user.role === 'admin'`
- `validate` middleware — checks express-validator results

```
Request → protect → adminOnly → controller → Response
```

---

## 11. What is Role-Based Authorization?

Different users have different permissions:

| Action              | Student | Admin |
|---------------------|---------|-------|
| View clubs/events   | ✅      | ✅    |
| Join a club         | ✅      | ❌    |
| Create/edit clubs   | ❌      | ✅    |
| Manage users        | ❌      | ✅    |

**Important:** Authorization is enforced on the **backend**, not just by hiding buttons in React. Even if someone bypasses the UI, the server will return 403 Forbidden.

---

## 12. Data Flow: Frontend → Backend → MongoDB

```
User fills form in React
        ↓
Axios sends HTTP request with JWT token
        ↓
Express receives request
        ↓
protect middleware verifies JWT → attaches req.user
        ↓
adminOnly middleware checks role (if needed)
        ↓
Controller function runs business logic
        ↓
Mongoose queries MongoDB Atlas
        ↓
MongoDB returns data
        ↓
Controller sends JSON response
        ↓
Axios receives response in React
        ↓
useState updates → UI re-renders
```

---

## 13. Common Viva Questions & Answers

**Q: Why did you use JWT instead of sessions?**
A: JWT is stateless — the server doesn't need to store session data. It scales better and works well with REST APIs.

**Q: How do you prevent duplicate club memberships?**
A: The Membership model has a compound unique index on `{ userId, clubId }`. MongoDB rejects duplicate inserts at the database level, and the server returns a 400 error.

**Q: How is the admin role protected?**
A: The `adminOnly` middleware on the server checks `req.user.role`. The role comes from the database, not from the client. Hiding buttons in React is only for UX — the real security is on the backend.

**Q: What happens if the event is full?**
A: Before creating a registration, the server counts existing confirmed registrations for that event. If `count >= event.capacity`, it returns a 400 error with "Event is full".

**Q: Why use MongoDB instead of MySQL?**
A: MongoDB's document model fits naturally with JavaScript objects and JSON APIs. For a project like this with flexible club/event data, it's faster to develop with.

**Q: What is the purpose of `.env`?**
A: It stores sensitive configuration (database URI, JWT secret) outside the code. It is never committed to GitHub. Other developers use `.env.example` as a template.
