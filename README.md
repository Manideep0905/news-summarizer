# 📰 AI-Powered News Summarizer and Bias Detector

Project link: https://news-summarizer-dun.vercel.app

An intelligent web application that fetches the latest news articles, generates concise AI-powered summaries, analyzes potential bias levels, and allows authenticated users to save and manage articles for later reading.

Built using **React**, **FastAPI**, **MongoDB**, and **OpenAI API**.

---

## 🚀 Features

### 📰 News Aggregation
- Fetches latest news articles from external news APIs.
- Supports multiple categories such as:
  - Technology
  - Business
  - Sports
  - Health
  - Entertainment
  - Science

### 📄 Detailed Article View
- Scrapes full article content using Newspaper3k.
- Displays complete article text, images, authors, and publication details.

### 🤖 AI-Powered Summarization
- Generates concise summaries using OpenAI.
- Converts lengthy articles into easy-to-read bullet points.
- Reduces reading time while preserving important information.

### ⚖️ Bias Detection
- Analyzes article content for potential bias.
- Classifies bias level as:
  - Low
  - Medium
  - High

### 👤 User Authentication
- Secure registration and login.
- JWT-based authentication.
- Access Token + Refresh Token mechanism.
- HttpOnly cookie storage for enhanced security.

### 💾 Save Articles
- Save articles to personal collection.
- View saved articles anytime.
- Remove saved articles when no longer needed.

### 📱 Responsive UI
- Mobile-friendly design.
- Dark mode support.
- Modern user interface built with Tailwind CSS.

---

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router
- Redux Toolkit
- Axios
- Tailwind CSS
- React Hot Toast

### Backend
- FastAPI
- Python 3.10+
- Beanie ODM
- Motor
- MongoDB Atlas
- Newspaper3k

### AI & NLP
- OpenAI API
- GPT Models

### Database
- MongoDB Atlas

### Deployment
- Frontend: Vercel
- Backend: Render

---

## 🏗️ System Architecture

```text
User
 │
 ▼
React Frontend (Vercel)
 │
 ▼
FastAPI Backend (Render)
 │
 ├── News API
 │
 ├── Newspaper3k Scraper
 │
 ├── OpenAI API
 │
 ▼
MongoDB Atlas
```

---

## 📂 Project Structure

```text
news-summarizer/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── routes/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   ├── core/
│   ├── database/
│   ├── main.py
│   └── pyproject.toml
│
└── README.md
```

---

## ⚙️ Installation (when running the project locally)

### Clone Repository

```bash
git clone https://github.com/your-username/news-summarizer.git
cd news-summarizer
```

---

## Backend Setup

### Navigate to Backend

```bash
cd backend
```

### Create Virtual Environment

Using UV:

```bash
uv venv
source .venv/bin/activate
```

### Install Dependencies

```bash
uv sync
```

### Create Environment Variables

Create a `.env` file:

```env
NEWSAPI_API_KEY=your_newsapi_key

OPENAI_API_KEY=your_openai_key

MONGODB_URL=your_mongodb_connection_string

JWT_SECRET_KEY=your_secret_key

ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
```

### Run Backend

```bash
uv run main.py
```

Backend runs on:

```text
http://localhost:8000
```

---

## Frontend Setup

### Navigate to Frontend

```bash
cd frontend
```

### Install Dependencies

```bash
npm install
```

### Create Environment Variables

Create `.env`:

```env
VITE_API_URL=http://localhost:8000      # this is the locally running backend
```

### Run Frontend

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## API Endpoints

### Authentication

| Method | Endpoint |
|----------|-------------|
| POST | /api/users/register |
| POST | /api/users/login |
| POST | /api/users/logout |
| POST | /api/users/refresh |
| GET | /api/users/me |

### Articles

| Method | Endpoint |
|----------|-------------|
| GET | /api/articles/{category} |
| GET | /api/articles/detail |
| POST | /api/articles/save-article |
| POST | /api/articles/summarize |
| GET | /api/articles/saved-articles |
| DELETE | /api/articles/remove-article |

---

<!--
## 📸 Screenshots

Add screenshots here:

### Home Page

```text
Insert Screenshot
```

### Article Listing

```text
Insert Screenshot
```

### Detailed View

```text
Insert Screenshot
```

### AI Summary Page

```text
Insert Screenshot
```

### Saved Articles

```text
Insert Screenshot
```
-->


## 👨‍💻 Author

**Manideep Jakkula**

B.Tech Computer Science and Engineering

---

## 📜 License

This project is developed for educational and research purposes.
