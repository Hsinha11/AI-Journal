// src/components/JournalForm.jsx
import React, { useState } from 'react'; // 1. Import useState hook
import { useAuth } from '../context/AuthContext';
// 2. Destructure `user` from the props object
const JournalForm = ({ onEntryAdded }) => {
    const { user, token } = useAuth();
    const [entry, setEntry] = useState('');

    const handleInputChange = (event) => {
        setEntry(event.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('api/entries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content: entry })
            });
            if (!response.ok) throw new Error('Failed to create new entry');
            const newEntry = await response.json();
            onEntryAdded(newEntry);
            setEntry('');
        } catch (error) {
            console.log("Error creating entry", error);
        }
    };

    const isTextareaEmpty = entry.trim() === '';

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                        {user ? user.name[0].toUpperCase() : 'U'}
                    </div>
                    <div>
                        <h3 className='text-xl font-semibold text-gray-800'>What's on your mind Today?</h3>
                        {/* <p className='text-gray-500'>{user ? user.name : 'User'}?</p> */}
                    </div>
                </div>
                <textarea
                    value={entry}
                    onChange={handleInputChange}
                    placeholder="Write your thoughts here..."
                    className="w-full min-h-[150px] p-4 text-gray-700 placeholder-gray-400 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-lg leading-relaxed resize-none"
                />
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isTextareaEmpty}
                        className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300
                            ${isTextareaEmpty 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:shadow-lg hover:-translate-y-0.5 transform'}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
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