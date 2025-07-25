let watchlist = [];

const loadFromStorage = () => {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("watchlist");
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading watchlist from localStorage:", error);
      return [];
    }
  }
  return [];
};

const saveToStorage = () => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("watchlist", JSON.stringify(watchlist));
    } catch (error) {
      console.error("Error saving watchlist to localStorage:", error);
    }
  }
};

const getWatchlistCount = () => {
  return watchlist.length;
};

const watchlistManager = {
  loadWatchlist: () => {
    watchlist = loadFromStorage();
    return watchlist;
  },

  getWatchlist: () => watchlist,

  addToWatchlist: (movie) => {
    const exists = watchlist.find((m) => m.id === movie.id);
    if (!exists) {
      watchlist.push(movie);
      saveToStorage();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("watchlist-updated"));
      }
    }
  },

  removeFromWatchlist: (movieId) => {
    watchlist = watchlist.filter((m) => m.id !== movieId);
    saveToStorage();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("watchlist-updated"));
    }
  },

  getWatchlistCount,

  isInWatchlist: (movieId) => {
    return watchlist.some((m) => m.id === movieId);
  },
};

export default watchlistManager;
