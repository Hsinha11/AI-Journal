// src/components/JournalForm.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import TextType from "./TextType";
/**
 * A form for creating a new journal entry.
 * @param {object} props - The component's props.
 * @param {function} props.onEntryAdded - The function to call when a new entry is added.
 * @returns {JSX.Element} The rendered component.
 */
const JournalForm = ({ onEntryAdded }) => {
    const { user, token } = useAuth();
    const [entry, setEntry] = useState("");

    /**
     * Handles the change event of the textarea.
     * @param {React.ChangeEvent<HTMLTextAreaElement>} event - The change event.
     */
    const handleInputChange = (event) => {
        setEntry(event.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("api/entries", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ content: entry }),
            });
            if (!response.ok) throw new Error("Failed to create new entry");
            const newEntry = await response.json();
            onEntryAdded(newEntry);
            setEntry("");
        } catch (error) {
            console.log("Error creating entry", error);
        }
    };

    const isTextareaEmpty = entry.trim() === "";

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                        {user ? user.name[0].toUpperCase() : "U"}
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold">
                            {/* What's on your mind Today? */}
                            <TextType
                                text={["What's on your mind Today?"]}
                                typingSpeed={50}
                                pauseDuration={1500}
                                showCursor={true}
                                cursorCharacter="|"
                                textColors={['#374151']}
                                
                            />
                        </h3>
                        {/* <p className='text-gray-500'>{user ? user.name : 'User'}?</p> */}
                    </div>
                </div>
                <div className="relative">
                    <textarea
                        value={entry}
                        onChange={handleInputChange}
                        placeholder="Write your thoughts here..."
                        className="w-full min-h-[150px] p-4 text-gray-700 placeholder-transparent border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-lg leading-relaxed resize-none"
                    />
                    {isTextareaEmpty && (
                        <div className="absolute top-4 left-4 pointer-events-none text-lg leading-relaxed">
                            <TextType
                                text={["Write your thoughts here..."]}
                                typingSpeed={50}
                                pauseDuration={2000}
                                showCursor={true}
                                cursorCharacter="_"
                                textColors={['#9CA3AF']} // gray-400
                                loop={true}
                            />
                        </div>
                    )}
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isTextareaEmpty}
                        className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300
                            ${
                                isTextareaEmpty
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:shadow-lg hover:-translate-y-0.5 transform"
                            }`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            />
                        </svg>
                        Share your thoughts
                    </button>
                </div>
            </div>
        </form>
    );
};

export default JournalForm;

// export default JournalForm;
