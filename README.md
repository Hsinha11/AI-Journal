# 🌟 AI Journal - Your Digital Thought Sanctuary

<div align="center">
  
![AI Journal Banner](https://capsule-render.vercel.app/api?type=waving&color=gradient&height=200&section=header&text=AI%20Journal&fontSize=80&fontAlignY=35&animation=twinkling&fontColor=ffffff)

[![Made with Love](https://img.shields.io/badge/Made%20with-❤️-white.svg)](https://github.com/Hsinha11)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-purple.svg)](https://vitejs.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.0-teal.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

## ✨ Features

- 🤖 **AI-Enhanced Journaling** - Your personal AI companion for deeper self-reflection.
- 📝 **Rich Text Editor** - Express yourself with a beautiful, intuitive interface.
- 🔒 **Secure & Private** - Your thoughts are encrypted and protected.
- 🌙 **Dark/Light Mode** - Journal comfortably any time of day.
- 📱 **Responsive Design** - Perfect on any device.
- 🔄 **Real-time Sync** - Never lose a thought again.

## 🚀 Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/en/download/) (v14 or later)
*   [MongoDB](https://www.mongodb.com/try/download/community) (or a MongoDB Atlas account)
*   [Pinecone](https://www.pinecone.io/) account for AI features.

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/Hsinha11/AI-Journal.git
    cd AI-Journal
    ```

2.  **Install server dependencies:**
    ```sh
    cd server
    npm install
    ```

3.  **Install client dependencies:**
    ```sh
    cd ../client
    npm install
    ```

4.  **Set up environment variables:**
    *   Create a `.env` file in the `server` directory.
    *   Add the following variables:
        ```
        PORT=8000
        MONGO_URI=your_mongodb_connection_string
        PINECONE_API_KEY=your_pinecone_api_key
        JWT_SECRET=a-very-long-and-secure-random-string-for-dev
        ```

### Running the Application

1.  **Start the backend server:**
    ```sh
    cd server
    npm start
    ```

2.  **Start the frontend development server:**
    ```sh
    cd ../client
    npm run dev
    ```

The application will be available at `http://localhost:5173`.

## 🎭 Tech Stack

### Frontend
- **React** - For beautiful UI composition
- **Vite** - Lightning-fast development
- **Tailwind CSS** - Stylish and responsive design

### Backend
- **Node.js** - Server-side excellence
- **Express** - RESTful API orchestration
- **MongoDB** - Data persistence perfection
- **JWT** - Secure authentication

### AI & Machine Learning
- **Pinecone** - Vector database for semantic search
- **@xenova/transformers** - For generating text embeddings

## 🌿 Project Structure

```
ai-journal-app/
├── client/              # Frontend sanctuary
│   ├── src/
│   │   ├── components/  # UI building blocks
│   │   ├── context/
│   │   ├── lib/
│   │   └── pages/
│   └── public/
└── server/             # Backend fortress
    ├── models/         # Data blueprints
    ├── src/
    │   └── services/
    └── server.js
```

## 🤝 Contributing

Your creative energy is welcome here! Feel free to:
1. 🍴 Fork the repository
2. 🌟 Create your feature branch
3. 💫 Commit your changes
4. 🚀 Push to the branch
5. 🎉 Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💖 Acknowledgments

- Hat tip to all contributors
- Special thanks to the open-source community
- Inspired by the power of AI and human creativity

<div align="center">

### Made with ❤️ by [Harianant Sinha](https://github.com/Hsinha11)

[![Follow on GitHub](https://img.shields.io/github/followers/Hsinha11?label=Follow&style=social)](https://github.com/Hsinha11)

</div>

---

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=100&section=footer" width="100%"/>
</div>
