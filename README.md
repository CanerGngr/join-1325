# Join - Kanban Project Management Tool

A web-based Kanban board application for team task management. Organize tasks across columns, assign team members, track progress with subtasks, and manage contacts — all from a responsive interface that works on desktop and mobile.

## Features

- **Kanban Board** — Drag-and-drop tasks across columns: To Do, In Progress, Awaiting Feedback, Done
- **Mobile Touch Support** — Long-press (300ms) to drag cards on touch devices
- **Task Management** — Create, edit, and delete tasks with title, description, category, priority, due date, subtasks, and assignees
- **Dashboard** — Overview of task counts by status, urgent tasks, and upcoming deadlines
- **Contact Management** — Maintain a directory of team members for task assignment
- **User Authentication** — Register, log in, or try as guest with demo data
- **Real-time Persistence** — Firebase Realtime Database keeps data in sync

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | HTML5, CSS3, Vanilla JavaScript   |
| Backend   | Firebase Realtime Database        |
| Auth      | Custom session-based (SessionStorage) |
| Hosting   | Any static file server            |

No frameworks. No build tools. No bundlers. Pure vanilla.

## Getting Started

### Prerequisites

- A web browser
- A local HTTP server (any of the options below)

### Run Locally

Clone the repository and serve the files:

```bash
git clone https://github.com/<your-username>/join-1325.git
cd join-1325

# Option 1: Python
python3 -m http.server 8000

# Option 2: Node.js
npx serve

# Option 3: PHP
php -S localhost:8000
```

Open `http://localhost:8000` in your browser.

### Deploy

Works on any static hosting provider:

- **Firebase Hosting** — `firebase deploy --only hosting`
- **GitHub Pages** — Push to `gh-pages` branch
- **Netlify / Vercel** — Connect repo, no build step needed

## Project Structure

```
join-1325/
├── index.html                 # Dashboard / Summary page
├── html/                      # HTML pages (board, login, contacts, etc.)
├── js/                        # JavaScript modules
│   ├── script.js              # Session management, avatar, logout
│   ├── taskManagement.js      # Task lifecycle & rendering
│   ├── kanbanDragging.js      # Desktop drag-and-drop
│   ├── kanbanTouchDragging.js # Mobile touch drag-and-drop
│   ├── addTask.js             # Task creation
│   ├── editTask.js            # Task editing
│   ├── contact.js             # Contact CRUD
│   ├── login.js               # Authentication
│   ├── summary.js             # Dashboard stats
│   └── ...                    # Search, validation, overlays, etc.
├── scrDB/                     # Firebase database integration
│   ├── dbConfig.js            # Firebase config
│   ├── taskDB.js              # Task CRUD operations
│   └── userDB.js              # User operations
├── css/                       # Modular stylesheets
└── assets/                    # Icons, fonts, images
```

## Firebase Setup

The app uses Firebase Realtime Database. Data is scoped per user:

```
/boards/{userId}/tasks/{taskId}
/users/{userId}
/contacts/{userId}/{contactId}
```

Firebase SDK (v8.10.0) is loaded via CDN — no npm install needed.

## Guest Mode

Try the app without registration. Guest mode stores tasks in SessionStorage (data lost on session end).

## License

This project was created as part of a web development course.
