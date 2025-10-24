// src/components/EditEntryForm.jsx
import React, { useState } from 'react';

/**
 * A form for editing a journal entry.
 * @param {object} props - The component's props.
 * @param {object} props.entry - The journal entry to edit.
 * @param {function} props.onSave - The function to call when the entry is saved.
 * @param {function} props.onCancel - The function to call when the editing is canceled.
 * @returns {JSX.Element} The rendered component.
 */
const EditEntryForm = ({ entry, onSave, onCancel }) => {
    const [editedContent, setEditedContent] = useState(entry.content);

    const handleSave = () => {
        onSave(entry._id, editedContent);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 transform transition-all duration-300">
            <div className="mb-4 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                <h3 className="text-lg font-semibold text-gray-800">Edit Entry</h3>
            </div>
            <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full min-h-[150px] p-4 text-gray-700 placeholder-gray-400 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-lg leading-relaxed resize-none"
                placeholder="Edit your thoughts..." 
                autoFocus
            />
            <div className="mt-4 flex justify-end gap-3">
                <button
                    onClick={onCancel}
                    className="px-6 py-2.5 text-gray-500 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200 flex items-center gap-2 font-medium"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 font-medium"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default EditEntryForm;