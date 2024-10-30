import React, { useState, useEffect } from "react";
import axios from "axios";

export default function FrontPage() {
  const [repos, setRepos] = useState([]);
  const [filteredRepos, setFilteredRepos] = useState([]);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUserRepositories = async () => {
    setError("");
    setRepos([]);
    try {
      const res = await axios.get(
        `https://api.github.com/users/${username}/repos`
      );
      const reposData = res.data.map((repo) => ({
        name: repo.name || "No Name",
        description: repo.description || "No Description",
        forks: repo.forks_count || 0,
        watchers: repo.watchers_count || 0,
      }));
      setRepos(reposData);
      setFilteredRepos(reposData); // Initialize filteredRepos
    } catch (error) {
      setError(
        "Failed to fetch repository data. Please check the username and try again."
      );
    }
  };

  useEffect(() => {
    // Filter repos based on searchTerm
    const filtered = repos.filter((repo) =>
      repo.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRepos(filtered);
  }, [searchTerm, repos]);

  const resetSearch = () => {
    setSearchTerm("");
    setFilteredRepos(repos); // Reset to the original repos
  };

  return (
    <div className="flex flex-col items-center justify-center  p-4 space-y-4">
      <label
        htmlFor="username-input"
        className="block text-sm font-medium text-gray-900 dark:text-white"
      >
        Enter the GitHub username:
      </label>
      <input
        type="text"
        id="username-input"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="block w-1/2 p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
      <button
        onClick={fetchUserRepositories}
        className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
      >
        Fetch User Repositories
      </button>

      {error && <p className="text-red-500">{error}</p>}

      <div className="mt-4">
        <label
          htmlFor="search-input"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Search Repositories:
        </label>
        <input
          type="text"
          id="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-1/2 p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <button
          onClick={resetSearch}
          className="mt-2 px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700"
        >
          Reset Search
        </button>
      </div>

      {filteredRepos.length > 0 && (
        <div className="mt-4 text-center">
          <h2 className="text-xl font-semibold">Repositories:</h2>
          {filteredRepos.map((repo, index) => (
            <div
              key={index}
              className="p-4 my-4 border rounded-lg bg-gray-50 dark:bg-gray-700"
            >
              <p>
                <strong>Name:</strong> {repo.name}
              </p>
              <p>
                <strong>Description:</strong> {repo.description}
              </p>
              <p>
                <strong>Forks:</strong> {repo.forks}
              </p>
              <p>
                <strong>Watchers:</strong> {repo.watchers}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
    