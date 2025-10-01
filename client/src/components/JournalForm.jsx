// src/components/JournalForm.jsx
import React, { useState } from 'react'; // 1. Import useState hook
import { useAuth } from '../context/AuthContext';
// 2. Destructure `user` from the props object
const JournalForm = ({  onEntryAdded }) => {
    // 3. Initialize state to manage the textarea's content
    const { user,token } = useAuth();
    const [entry, setEntry] = useState('');

    // 4. Event handler to update state whenever the user types
    const handleInputChange = (event) => {
        setEntry(event.target.value);
    };

    // 5. Event handler for the button click
    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            const response = await fetch('api/entries',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${token}`
                },
                body:
                    JSON.stringify({content:entry})
                
            });
            if (!response.ok) throw new Error('Failed to create new entry');
            const newEntry = await response.json();
            onEntryAdded(newEntry)
            setEntry(''); // Clear the textarea after submission
        }catch (error){
            console.log("Error creating entry",error)
        }
        // console.log('Saving entry:', entry);
        // We will add API call logic here later
    };

    // 6. Determine if the textarea is empty to disable the button
    const isTextareaEmpty = entry.trim() === '';

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white border rounded-lg shadow">
            
<h3 className='font-semibold'>What's on your mind, {user ? user.name : 'User'}?</h3>
            <textarea
                value={entry}
                onChange={handleInputChange}
                placeholder="Start writing..."
                className="w-full h-40 p-2 border rounded mt-2"
            />
            <button
                type="submit" // Use type="submit" for form buttons
                disabled={isTextareaEmpty}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
            >
                Save Entry
            </button>
        </form>
    );
};

export default JournalForm;