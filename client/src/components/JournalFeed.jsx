// src/components/JournalFeed.jsx
import React, { useState, useEffect } from 'react';

const JournalFeed = () => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEntries = async () => {
            try {
                // IMPORTANT: For now, you must get a token by logging in with Postman
                // and hardcode it here. We will manage this dynamically later.
                const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YWMwYjk3YzEwOWQ5ZmEzZmRjNWE1ZSIsIm5hbWUiOiJ0ZXN0dXNlciIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE3NTYyODM0MzQsImV4cCI6MTc1NjI4NzAzNH0.taPwz3cCv3j9VSkyjDPb-8NX15-GtaUmcFEwPUMMKrA";

                const response = await fetch('/api/entries', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
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

        fetchEntries();
    }, []); // The empty array [] ensures this effect runs only once.

    if (loading) return <p>Loading entries...</p>;
    if (error) return <p>Error fetching entries: {error}</p>;

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Journal Feed</h2>
            <div className="space-y-4">
                {entries.length > 0 ? (
                    entries.map(entry => (
                        <div key={entry._id} className="p-4 bg-white rounded-lg shadow">
                            <p className="text-slate-800">{entry.content}</p>
                            <small className="text-slate-500">
                                {new Date(entry.createdAt).toLocaleString()}
                            </small>
                        </div>
                    ))
                ) : (
                    <p>No entries found. Write your first one using the form above!</p>
                )}
            </div>
        </div>
    );
};

export default JournalFeed;