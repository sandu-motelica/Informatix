# In\<form\>atiX

In\<form\>atiX is a full-stack web platform for high school students to learn programming through curated problem-solving. It allows teachers to manage virtual classrooms, assign homeworks, and evaluate submissions, while students can solve problems, track progress, and interact via comments and ratings.

---

## Tech Stack

- Frontend: HTML, CSS, Vanilla JavaScript (modular)
- Backend: Node.js, MongoDB (Mongoose), JWT
- API: RESTful
- Features: Role-based access, problem tagging, solution evaluation, statistics, import/export

---

## User Roles

| Role    | Capabilities                                           |
| ------- | ------------------------------------------------------ |
| Admin   | Approves problems, manages users                       |
| Teacher | Manages classes, assigns problems, evaluates solutions |
| Student | Solves problems, submits solutions, views feedback     |

---

## Key Features

### Authentication

- JWT-based login and registration
- Role assignment: student / teacher / admin

### Classroom Management

- Teachers create classes
- Students join via identifier
- Class-specific homeworks

### Problem Management

- Problem definition: title, description, tags, difficulty
- JSON import support
- Admin approval required
- API-ready structure

### Homework & Evaluation

- Assignments made from problem pool
- Students submit solutions
- Teachers evaluate and grade
- Students view aggregate scores

### Tagging & Filtering

- Problems organized by difficulty and topic
- Multi-tag filtering on problem list

### Reporting

- Per-user: number of attempts, grades, solved problems
- Per-problem: submission rate, acceptance ratio

### Data Interoperability

- JSON import/export of problems
- Extendable API layer (REST)

---

## Setup

### Backend

```bash
cd BACKEND
npm install
npm start
```

### Frontend

```bash
cd FRONTEND
# Open index.html in browser or use a static server
```

### Environment Variables

Create a `.env` file in `/BACKEND`:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/informatiX
JWT_SECRET=your_jwt_secret
```

---

## Security

- JWT-based session management
- Role-based authorization middleware
- Password hashing (bcrypt assumed)

---

## License

This project was developed for academic purposes only, as part of a university course.
