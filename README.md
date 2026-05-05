# AI Note Management - Backend

The robust backend engine powering the AI Note Management, built with Node.js, Express, and MongoDB. This service handles note management, asynchronous AI processing using Google Gemini, and intelligent querying.

## 🚀 Features

- **Note Management**: Full CRUD operations for personal notes.
- **AI Processing**: Automatically generates summaries, key points, and tags for every note using `gemini-3-flash-preview`.
- **Smart Querying**: Ask questions about specific notes and get AI-powered answers based on the note's context.
- **Asynchronous Workflow**: Non-blocking AI processing to ensure a smooth user experience.
- **Health Monitoring**: Built-in health check endpoint for deployment monitoring.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **AI Integration**: Google Generative AI (Gemini)
- **Utilities**: Axios, CORS, Dotenv, Express Async Handler

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local or Atlas)
- [Google AI Studio API Key](https://aistudio.google.com/)

## ⚙️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root of the backend directory and add the following:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ai-note-management
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the server**:
   ```bash
   # Development mode with nodemon
   npm run dev

   # Production mode
   npm start
   ```
## ⚠️ AI API Usage Note

This project uses the **Google Gemini API (free tier)** for AI-powered features such as summarization and querying.

Due to free-tier limitations, the API may occasionally:

- Hit **rate limits**
- Return **quota exceeded errors**
- Temporarily fail during heavy usage

### 🧪 Testing Recommendation

If you encounter issues while testing:

1. Wait for the rate limit to reset  
   **OR**  
2. Replace the API key with your own:

```env
GEMINI_API_KEY=your_api_key_here
```

## 📡 API Documentation

### Notes API
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/notes` | Get all notes |
| `POST` | `/api/notes` | Create a new note (triggers AI processing) |
| `GET` | `/api/notes/:id` | Get a specific note by ID |
| `DELETE` | `/api/notes/:id` | Delete a note |
| `POST` | `/api/notes/:id/query` | Ask AI a question about a specific note |

### System API
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Server health check |

## 🏗️ Project Structure

```text
backend/
├── controllers/    # Request handlers
├── models/         # Mongoose schemas
├── routes/         # Express route definitions
├── services/       # AI and external service logic
├── utils/          # Helper functions
├── server.js       # Entry point
└── .env            # Configuration
```

## 🛠️ Development Utilities

- **Model Listing**: Run `node listModels.js` to see all available Gemini models associated with your API key.

## 🔐 Environment Variables

- `PORT`: The port on which the server will run (default: 5000).
- `MONGODB_URI`: Connection string for your MongoDB database.
- `GEMINI_API_KEY`: Your API key from Google AI Studio.

---

Built with ❤️ for the AI Note Management project.
