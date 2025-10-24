import { useState, useEffect } from "react";
import Header from "../components/Header.jsx";
import JournalForm from "../components/JournalForm.jsx";
import JournalFeed from "../components/JournalFeed.jsx";
import { useAuth } from "../context/AuthContext";
import Search from "../components/Search.jsx";

/**
 * The main page for the journal.
 * @returns {JSX.Element} The rendered component.
 */
function JournalPage() {
    // const mockUser = { name: "John" };
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchResults, setSearchResults] = useState(null);
    const [editingEntryId, setEditingEntryId] = useState(null);
    const { user, token } = useAuth(); // 2. Get the token from the context
    useEffect(() => {
        /**
         * Fetches the journal entries from the server.
         */
        const fetchEntries = async () => {
            try {
                const response = await fetch("/api/entries", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setEntries(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        if (token) {
            // 4. Only fetch if logged in
            fetchEntries();
        }
        // fetchEntries();
    }, [token]);

    const handleEntryAdded = (newEntry) => {
        setEntries([newEntry, ...entries]);
    };
    const handleDelete = async (entryId) => {
        let entriescopy = [...entries];
        setEntries(entries.filter((entry) => entry._id !== entryId));
        try {
            const response = await fetch(`/api/entries/${entryId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) {
                throw new Error("Failed to delete entry on server");
            }
        } catch (error) {
            console.error("Delete failed:", error);
            // Revert UI change if API call fails
            setEntries(entriescopy);
        }
    };
    const handleUpdate = async (entryId, updatedContent) => {
        // We will implement the PUT request logic here later.
        try {
            const response = await fetch(`/api/entries/${entryId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content: updatedContent }),
            });
            if (!response.ok) {
                throw new Error("Failed to update the entry on server");
            }
            const updatedEntryFromServer = await response.json();
            setEntries(entries.map(entry => (entry._id === entryId ? updatedEntryFromServer : entry)));
            setEditingEntryId(null);
            // setEntries(entries.map(entry => (entry._id === entryId ? updatedEntryFromServer : entry)));
        } catch (error) {
            console.error("Update failed:", error);
        }
        //
    };
    const handleEditStart = (entry) => {
        setEditingEntryId(entry._id);
        // We'll set the editedContent here later
    };

    const handleCancelEdit = () => {
        setEditingEntryId(null);
    };
    const handleSearch = async (query) => {
        if (!query.trim()) {
            setSearchResults(null);
            return;
        }
        try {
            setError(null);
            setLoading(true);
            const encodedQuery = encodeURIComponent(query);
            const response = await fetch(`/api/search?q=${encodedQuery}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("Search failed.");
            const data = await response.json();
            setSearchResults(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    const displayEntries = searchResults !== null ? searchResults : entries;
    return (
        // Main container for the whole application
        <div className="min-h-screen min-w-screen bg-slate-50 text-slate-900">
            <Header />
            <main className="p-8">
                <JournalForm user={user} onEntryAdded={handleEntryAdded} />
                <Search onSearch={handleSearch} loading={loading} />
                <JournalFeed
                    entries={displayEntries}
                    loading={loading}
                    error={error}
                    onDelete={handleDelete}
                    editingEntryId={editingEntryId}
                    onEditStart={handleEditStart}
                    onUpdate={handleUpdate}
                    onCancelEdit={handleCancelEdit}
                />
            </main>
        </div>
    );
}

export default JournalPage;
