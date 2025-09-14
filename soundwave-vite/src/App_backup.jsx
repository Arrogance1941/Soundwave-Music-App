import { useEffect, useState } from "react";

export default function App() {
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Fetch songs.json from public/
  useEffect(() => {
    fetch("/songs.json")
      .then((res) => res.json())
      .then((data) => {
        setSongs(data);
        setFilteredSongs(data);
      })
      .catch((err) => console.error("Error loading songs:", err));
  }, []);

  // Filter songs when search changes
  useEffect(() => {
    const q = search.toLowerCase();
    setFilteredSongs(
      songs.filter(
        (song) =>
          song.title.toLowerCase().includes(q) ||
          song.artist.toLowerCase().includes(q)
      )
    );
  }, [search, songs]);

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-gray-100 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 pb-28">
        {/* Header */}
        <header className="sticky top-0 z-10 backdrop-blur bg-white/70 dark:bg-zinc-900/70 border-b border-gray-200 dark:border-zinc-800">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold">SoundWave</h1>
            <div className="flex gap-3 items-center">
              <input
                type="text"
                placeholder="Search songs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-3 py-2 rounded-lg bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-500"
              >
                {darkMode ? "Light" : "Dark"}
              </button>
            </div>
          </div>
        </header>

        {/* Song List */}
        <main className="max-w-5xl mx-auto px-4 py-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSongs.map((song) => (
            <div
              key={song.id}
              className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow hover:shadow-lg hover:scale-[1.01] transition transform flex flex-col justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold">{song.title}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{song.artist}</p>
                <p className="text-xs text-gray-400">{song.duration}</p>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setCurrentSong(song)}
                  className="flex-1 px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-500"
                >
                  Play
                </button>
                <a
                  href={song.downloadUrl}
                  download
                  className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-zinc-700 text-center"
                >
                  Download
                </a>
              </div>
            </div>
          ))}
        </main>

        {/* Player */}
        {currentSong && (
          <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-zinc-900/90 backdrop-blur border-t border-gray-200 dark:border-zinc-800 shadow-lg">
            <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
              <div>
                <p className="font-semibold">{currentSong.title}</p>
                <p className="text-sm text-gray-500">{currentSong.artist}</p>
              </div>
              <audio
                controls
                autoPlay
                src={currentSong.audioUrl}
                className="w-64"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
