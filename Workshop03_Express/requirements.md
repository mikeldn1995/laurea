# Workshop 03 – Requirements

## Overview
This document describes the **tasks and requirements** for Workshop 03 - Building a Web Server with Express.js.

Complete all **mandatory tasks** (Tasks 1-5).  
Optional tasks (Task 6) are provided for additional practice.

---

## General Rules
- Work only inside the `starter/` folder
- Do not change the repository structure unless instructed
- Commit your work regularly with meaningful commit messages
- Do **not** commit `node_modules`
- Use Express.js framework for all implementations

---

## Mandatory Tasks

### Task 1 – Install and Import Express
**Description**  
Set up Express.js in your project and create an Express application instance.

**Requirements**
- Install Express.js using `npm install express`
- Import Express at the top of `server.js` using `require('express')`
- Create an Express application instance using `express()`
- Define a PORT constant (use 3000)

**Expected Code Structure**
```javascript
const express = require('express');
const app = express();
const PORT = 3000;
```

---

### Task 2 – Serve Static Files
**Description**  
Configure Express to automatically serve static files (HTML, CSS, images, etc.) from the `public` directory.

**Requirements**
- Use `express.static()` middleware to serve files from the `public` folder
- Place the middleware configuration before any route handlers
- Ensure CSS files in `public/styles/` are accessible

**Expected Code Structure**
```javascript
app.use(express.static('public'));
```

**Testing**
- CSS files should load automatically when referenced in HTML
- Direct access to files like `http://localhost:3000/styles/style.css` should work

---

### Task 3 – Add Route Handlers
**Description**  
Create Express route handlers for the main pages of your website.

**Requirements**
- Create a GET route for `/` (home page) that serves `public/index.html`
- Create a GET route for `/about` that serves `public/about.html`
- Create a GET route for `/contact` that serves `public/contact.html`
- Use `res.sendFile()` with absolute paths (use `path.join(__dirname, 'public', 'filename.html')`)

**Expected Code Structure**
```javascript
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/about', (req, res) => {
    // Your code here
});

app.get('/contact', (req, res) => {
    // Your code here
});
```

**Testing**
- Visiting `http://localhost:3000/` should show the home page
- Visiting `http://localhost:3000/about` should show the about page
- Visiting `http://localhost:3000/contact` should show the contact page

---

### Task 4 – Create API Endpoint
**Description**  
Create a RESTful API endpoint that returns current date and time information in JSON format.

**Requirements**
- Create a GET route for `/api/time`
- Return a JSON response with:
  - `datetime`: Current ISO 8601 formatted date/time string
  - `timestamp`: Current Unix timestamp
- Use `res.json()` to send the response

**Expected Code Structure**
```javascript
app.get('/api/time', (req, res) => {
    res.json({
        datetime: new Date().toISOString(),
        timestamp: Date.now()
    });
});
```

**Expected Response**
```json
{
    "datetime": "2026-01-28T12:00:00.000Z",
    "timestamp": 1738065600000
}
```

**Testing**
- Visit `http://localhost:3000/api/time` in browser or use curl
- Should return valid JSON with current date/time

---

### Task 5 – Error Handling Middleware
**Description**  
Implement custom error handling middleware for 404 (Not Found) and 500 (Server Error) responses.

**Requirements**
- Create a 404 handler middleware that catches all unmatched routes
- The 404 handler should:
  - Try to serve `public/404.html`
  - If the file doesn't exist, send a plain text "404 - Page Not Found" response
  - Set status code to 404
- Create a 500 error handler middleware that catches server errors
- The 500 handler should:
  - Log the error to console
  - Try to serve `public/500.html`
  - If the file doesn't exist, send a plain text "500 - Internal Server Error" response
  - Set status code to 500
- Place the 404 handler **after** all other routes
- Place the 500 handler **after** the 404 handler

**Expected Code Structure**
```javascript
// 404 handler (must be after all other routes)
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// 500 error handler (must be last)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).sendFile(path.join(__dirname, 'public', '500.html'));
});
```

**Testing**
- Visit `http://localhost:3000/nonexistent` should show custom 404 page
- Verify error logging works in console

---

### Task 6 – Start the Server
**Description**  
Configure the Express server to listen on the specified port.

**Requirements**
- Use `app.listen()` to start the server on PORT 3000
- Log a message to the console when the server starts
- Include information about available routes

**Expected Code Structure**
```javascript
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Available routes:');
    console.log('  GET /              -> Home page');
    console.log('  GET /about         -> About page');
    console.log('  GET /contact       -> Contact page');
    console.log('  GET /api/time      -> Current date/time API');
});
```

**Testing**
- Run `node server.js` or `npm start`
- Server should start without errors
- Console should display startup message

---

## Validation / Acceptance Criteria
Your solution will be considered complete if:
- The application runs without errors
- All mandatory tasks (1-6) are implemented
- Express.js is properly installed and configured
- Static files are served correctly using middleware
- All routes work as expected
- Error handlers catch 404 and 500 errors appropriately
- Code is readable and well-structured
- No unnecessary files (like `node_modules`) are committed

---

## Optional Tasks (Bonus)

### Bonus Task 1 – Use Express Router
**Description**  
Organize your routes using Express Router for better code organization.

**File Location**  
Add this code in `starter/server.js` after all regular route handlers (Task 3) but **before** error handling middleware (Task 5).

**Requirements**
- Create a separate router for API routes
- Move `/api/time` to the API router
- Mount the router on `/api` path

**Example Structure**
```javascript
const apiRouter = express.Router();

apiRouter.get('/time', (req, res) => {
    res.json({
        datetime: new Date().toISOString(),
        timestamp: Date.now()
    });
});

app.use('/api', apiRouter);
```

**Middleware Order**
1. Static files middleware (Task 2)
2. Regular route handlers (Task 3)
3. **API Router (This task)** ← Add here
4. Error handling middleware (Task 5)
5. Server listener

### Bonus Task 2 – Request Logging Middleware
**Description**  
Create custom middleware to log all incoming requests.

**Requirements**
- Create middleware that logs: method, URL, and timestamp
- Apply the middleware globally using `app.use()`

**Example**
```javascript
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});
```

### Bonus Task 3 – Additional API Endpoints
**Description**  
Create additional API endpoints to practice.

**Suggestions**
- `/api/info` - Returns server information (Node version, Express version)
- `/api/status` - Returns server status (uptime, memory usage)

---

## Submission Checklist
Before submitting, make sure that:
- [x] All mandatory tasks (1-6) are completed
- [x] Application starts successfully with `npm start`
- [x] All routes are accessible and working
- [x] Error pages display correctly
- [x] Code is pushed to GitHub
- [x] Repository does not contain `node_modules`
- [x] `package.json` includes Express as a dependency

---

## Evaluation Criteria (If Graded)
Your submission may be evaluated based on:
- **Correctness** (40%): All features work as specified
- **Code Quality** (30%): Clean, readable, well-organized code
- **Express Best Practices** (20%): Proper use of middleware, routing, and error handling
- **Git Usage** (10%): Meaningful commits, proper .gitignore

---

## Notes
- Express.js significantly reduces code compared to raw Node.js HTTP
- Middleware order matters! Static files and routes must come before error handlers
- Always use `next()` in middleware to pass control to the next handler
- Ask questions if requirements are unclear
- Partial solutions may receive partial credit

---

Good luck! 💪