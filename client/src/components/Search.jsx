import React, { useState } from 'react';

// Note the new props: onSearch and isLoading, which are passed from JournalPage
const Search = ({ onSearch, isLoading }) => {
    // This component only needs to manage the state of the input field
    const [query, setQuery] = useState('');

    // This handler no longer contains fetch logic.
    // It just calls the onSearch function passed down from its parent.
    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(query);
    };
    const handleQueryChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    // If the user clears the input, automatically clear the search results
    if (newQuery === '') {
        onSearch('');
    }
};
    return (
        <div className="max-w-4xl mx-auto my-8 p-8 bg-white rounded-xl shadow-lg backdrop-blur-sm border border-purple-50" >
            <h2 className="text-3xl font-bold mb-6 text-slate-800 tracking-tight">
                Search Your <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Memories</span>
            </h2>
            <p className="text-slate-600 mb-6 text-lg tracking-wide">
                Explore your journal entries using natural language or emotions
            </p>
            <form onSubmit={handleSubmit} className="flex gap-3">
                <div className="flex-grow relative">
                    <input
                        type="text"
                        placeholder="Try 'happy moments' or 'challenging times'..."
                        value={query}
                        onChange={handleQueryChange}
                        className="w-full p-3.5 border border-purple-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10 text-slate-700 placeholder:text-slate-400 transition-all duration-200 hover:border-purple-200"
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={() => {
                                setQuery('');
                                onSearch('');
                            }}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600 transition-all duration-200 p-1.5 rounded-full hover:bg-purple-50 group"
                            aria-label="Clear search"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform transition-transform duration-200 group-hover:rotate-90" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </button>
                    )}
                </div>
                <button
                    type="submit"
                    disabled={isLoading || !query.trim()}
                    className={`px-8 py-3.5  font-semibold rounded-lg transition-all duration-200 flex items-center gap-2
                        ${isLoading || !query.trim() 
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                            : 'bg-purple-600 text-white hover:bg-purple-700 hover:shadow-md hover:shadow-purple-100 active:transform active:scale-95'
                        }`}
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span>Searching</span>
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                            <span>Search</span>
                        </>
                    )}
                </button>
            </form>
            {/* The search results are no longer displayed here.
                They are displayed by the JournalFeed component, which receives the filtered list. */}
        </div>
    );
};

export default Search;