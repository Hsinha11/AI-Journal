// src/components/JournalForm.jsx
import React, { useState } from 'react'; // 1. Import useState hook

// 2. Destructure `user` from the props object
const JournalForm = ({ user }) => {
    // 3. Initialize state to manage the textarea's content
    const [entry, setEntry] = useState('');

    // 4. Event handler to update state whenever the user types
    const handleInputChange = (event) => {
        setEntry(event.target.value);
    };

    // 5. Event handler for the button click
    const handleSubmit = () => {
        console.log('Saving entry:', entry);
        // We will add API call logic here later
        setEntry(''); // Clear the textarea after submission
    };

    // 6. Determine if the textarea is empty to disable the button
    const isTextareaEmpty = entry.trim() === '';

    return (
        <div className="p-4 border rounded-lg">
            <h3>What's on your mind, {user.name}?</h3>
            <textarea
                value={entry} // The textarea's value is now controlled by our state
                onChange={handleInputChange} // This function runs on every keystroke
                placeholder="Start writing..."
                className="w-full h-40 p-2 border rounded mt-2"
            />
            <button
                onClick={handleSubmit}
                disabled={isTextareaEmpty} // The button is disabled based on our condition
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
            >
                Save Entry
            </button>
        </div>
    );
};

export default JournalForm;