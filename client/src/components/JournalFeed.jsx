// src/components/JournalFeed.jsx
import EditEntryForm from "./EditEntryForm";
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
    if (loading)
        return (
            <div className="mt-8 max-w-4xl mx-auto px-4">
                <div className="animate-pulse flex flex-col gap-4">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-gray-100 p-6 rounded-xl">
                                <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                                <div className="h-20 bg-gray-200 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );

    if (error)
        return (
            <div className="mt-8 max-w-4xl mx-auto px-4">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <div className="text-red-600 font-medium">
                        Please log in to see your entries
                    </div>
                </div>
            </div>
        );

    return (
        <div className="mt-8 max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                <span className="bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
                    Your Journal
                </span>
                <span className="text-lg font-normal text-gray-400">
                    ✨ Reflect & Grow
                </span>
            </h2>
            <div className="space-y-6">
                {entries.length > 0 ? (
                    entries.map((entry) => (
                        <div
                            key={entry._id}
                            className="transform transition-all duration-300 hover:-translate-y-1"
                        >
                            {editingEntryId === entry._id ? (
                                <EditEntryForm
                                    entry={entry}
                                    onSave={onUpdate}
                                    onCancel={onCancelEdit}
                                />
                            ) : (
                                <div className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex-1">
                                            <div className="flex flex-col gap-1 mb-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                                                    <span className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        Created: {new Date(entry.createdAt).toLocaleDateString("en-US", {
                                                            weekday: "long",
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit"
                                                        })}
                                                    </span>
                                                </div>
                                                {entry.updatedAt && entry.updatedAt !== entry.createdAt && (
                                                    <div className="flex items-center gap-2 ml-4">
                                                        <span className="text-xs font-medium text-gray-400 flex items-center gap-2">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            Updated: {new Date(entry.updatedAt).toLocaleDateString("en-US", {
                                                                weekday: "long",
                                                                year: "numeric",
                                                                month: "long",
                                                                day: "numeric",
                                                                hour: "2-digit",
                                                                minute: "2-digit"
                                                            })}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                                                {entry.content}
                                            </p>
                                        </div>
                                        <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <button
                                                onClick={() =>
                                                    onEditStart(entry)
                                                }
                                                className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200 flex items-center gap-2"
                                                title="Edit entry"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-4 w-4"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                                    />
                                                </svg>
                                                <span className="text-sm font-medium">
                                                    Edit
                                                </span>
                                            </button>
                                            <button
                                                onClick={() =>
                                                    onDelete(entry._id)
                                                }
                                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 flex items-center gap-2"
                                                title="Delete entry"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-4 w-4"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                    />
                                                </svg>
                                                <span className="text-sm font-medium">
                                                    Delete
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                        <div className="flex flex-col items-center gap-4">
                            <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8 text-purple-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">
                                    No entries yet
                                </h3>
                                <p className="text-gray-500 mt-1">
                                    Start writing your first journal entry
                                    above!
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JournalFeed;
