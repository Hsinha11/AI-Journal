// src/components/EditEntryForm.jsx
import React, { useState } from 'react';

const EditEntryForm = ({ entry, onSave, onCancel }) => {
    // 1. Create local state to manage the textarea, initialized with the original entry's content.
    const [editedContent, setEditedContent] = useState(entry.content);

    // 2. When save is clicked, call the onSave prop with the entry's ID and the new content.
    const handleSave = () => {
        onSave(entry._id, editedContent);
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-sm">
            <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full h-24 p-2 border rounded border-slate-200"
                placeholder="Edit your Journal..." 
            />
            <div className="mt-2 flex justify-end space-x-2">
                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Save
                </button>
                <button
                    onClick={onCancel}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default EditEntryForm;