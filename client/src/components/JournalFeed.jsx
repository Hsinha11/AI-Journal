// src/components/JournalFeed.jsx
import EditEntryForm from './EditEntryForm';
const JournalFeed = ({
    entries,
    loading,
    error,
    onDelete,
    editingEntryId,
    onEditStart,
    onCancelEdit,
    onUpdate,
}) => {
    // The empty array [] ensures this effect runs only once.

    if (loading) return <p>Loading entries...</p>;
    if (error)
        return (
            <p>Hmm.. Seems you are not Logged In, Login to see your entries</p>
        );

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Journal Feed</h2>
            <div className="space-y-4">
                {entries.length > 0 ? (
                    entries.map((entry) => (
                        <div key={entry._id}>
                            {editingEntryId === entry._id ? (
                                // --- EDIT VIEW ---
                                // If this entry's ID matches the one in state, render the Edit Form
                                <EditEntryForm
                                    entry={entry}
                                    onSave={onUpdate}
                                    onCancel={onCancelEdit}
                                />
                            ) : (
                                // --- DISPLAY VIEW ---
                                // Otherwise, render the normal entry display
                                <div className="p-4 bg-white rounded-lg shadow flex justify-between items-start">
                                    <div>
                                        <p className="text-slate-800">
                                            {entry.content}
                                        </p>
                                        <small className="text-slate-500">
                                            {new Date(
                                                entry.createdAt
                                            ).toLocaleString()}
                                        </small>
                                    </div>
                                    <div className="flex space-x-2 flex-shrink-0 ml-4">
                                        <button
                                            onClick={() => onEditStart(entry)}
                                            className="px-4 py-2 bg-blue-500 text-white text-xs font-bold rounded hover:bg-blue-600"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => onDelete(entry._id)}
                                            className="px-4 py-2 bg-red-500 text-white text-xs font-bold rounded hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No entries found.</p>
                )}
            </div>
        </div>
    );
};

export default JournalFeed;
