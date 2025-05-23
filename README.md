# Todo Summary Assistant

## Overview

Todo Summary Assistant is a full-stack web application that allows users to manage their personal todos, generate a concise summary of all pending todos using a Large Language Model (LLM), and send the summary to a Slack channel. This project demonstrates integration of React frontend, Node.js backend, PostgreSQL database, OpenRouter LLM API, and Slack Incoming Webhooks.

---

## Features

- Add, edit, delete, and view todos
- Mark todos as completed or pending
- Generate a summary of all pending todos using OpenRouter’s Mistral 7B LLM
- Send the summary to a Slack channel via Incoming Webhook
- Responsive and user-friendly React UI
- Secure environment variable management

---

## Tech Stack

- Frontend: React, JavaScript, CSS
- Backend: Node.js, Express
- Database: PostgreSQL
- AI API: OpenRouter (Mistral 7B)
- Notifications: Slack Incoming Webhooks
- Environment Management: dotenv

---

## Setup Instructions

### Prerequisites

- Node.js and npm installed
- PostgreSQL installed and running
- Slack workspace with Incoming Webhook URL
- OpenRouter API key (sign up at https://openrouter.ai)

---

### Backend Setup

1. Clone the repository and navigate to the backend folder:

cd backend


2. Install backend dependencies:

npm install


3. Create a `.env` file in the backend folder, and add the following variables:

DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database_name

OPENROUTER_API_KEY=your_openrouter_api_key
SLACK_WEBHOOK_URL=your_slack_webhook_url


4. Set up your PostgreSQL database and create the `todos` table:

CREATE TABLE todos (
id SERIAL PRIMARY KEY,
title TEXT NOT NULL,
completed BOOLEAN DEFAULT FALSE
);


5. Start the backend server:

node index.js


The server should run on port 3001 by default.

---

### Frontend Setup

1. Navigate to the frontend folder:

cd frontend


2. Install frontend dependencies:

npm install


3. Ensure the `package.json` has the proxy set to backend:

"proxy": "http://localhost:3001"


4. Start the frontend development server:

npm start


5. Open [http://localhost:3000](http://localhost:3000) in your browser to use the app.

---

## Usage

- Add new todos using the input field and "Add" button.
- Toggle completion status by clicking the checkbox.
- Edit a todo by double-clicking its title, then press Enter or click outside to save.
- Delete a todo using the "Delete" button.
- Click **Summarize & Send to Slack** to generate a summary of pending todos and send it to your Slack channel.
- Check your Slack channel to see the summary message.

---

## Environment Variables

| Variable           | Description                          |
|--------------------|------------------------------------|
| `DB_USER`          | PostgreSQL username                 |
| `DB_PASSWORD`      | PostgreSQL password                 |
| `DB_HOST`          | PostgreSQL host (usually localhost)|
| `DB_PORT`          | PostgreSQL port (usually 5432)     |
| `DB_NAME`          | PostgreSQL database name            |
| `OPENROUTER_API_KEY` | API key for OpenRouter LLM         |
| `SLACK_WEBHOOK_URL` | Slack Incoming Webhook URL          |

---

## Design Decisions

- Used React functional components with hooks (`useState`, `useEffect`) for simplicity and modern best practices.
- Backend uses Express for REST API and `pg` for PostgreSQL interaction.
- OpenRouter chosen for free and easy access to Mistral 7B LLM.
- Slack webhook integration for real-time notifications.
- Proxy setup in React to avoid CORS issues during development.

---

## Troubleshooting

- **Blank screen or fetch errors:**  
Make sure backend is running and proxy is set correctly in frontend `package.json`.
- **Slack message not appearing:**  
Verify Slack webhook URL in `.env` and check backend logs for errors.
- **Database connection errors:**  
Check PostgreSQL service and credentials in `.env`.
- **LLM API errors:**  
Ensure your OpenRouter API key is valid and has quota.

---

## Future Improvements

- Add user authentication and multi-user support.
- Implement pagination or filtering for todos.
- Add dark mode toggle for UI.
- Enhance summary prompt with user customization.
- Deploy backend and frontend to cloud platforms.

---

## License

This project is licensed under the MIT License.

---

## Contact

For questions or feedback, please contact [Goutham] at [gouthamnandula@gmail.com].

---

**Thank you for checking out my Todo Summary Assistant!**  
Feel free to explore, modify, and extend it as you like.
