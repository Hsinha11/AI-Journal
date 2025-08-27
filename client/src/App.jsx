// src/App.jsx

// import { useState, useEffect } from "react";
import Header from "./components/Header.jsx";
import JournalForm from "./components/JournalForm.jsx";
import JournalFeed from "./components/JournalFeed.jsx";
function App() {
    const mockUser = { name: "John" };

    return (
        // Main container for the whole application
        <div className="min-h-screen min-w-screen bg-slate-50 text-slate-900">
            <Header />
            {/* Centered content area with padding */}

            <main className="p-8">
                <JournalForm user={mockUser} />
                <JournalFeed />
            </main>
        </div>
    );
}

export default App;
