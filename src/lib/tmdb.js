const apiKey = "58744524d3302bfecfdd44b8b1519a58";
const baseURL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

class TMDBError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'TMDBError';
    this.status = status;
  }
}

const fetchWithErrorHandling = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new TMDBError(`HTTP error! status: ${response.status}`, response.status);
  }
  return response.json();
};

export const tmdbAPI = {
  getPopularMovies: async (page = 1) => {
    return fetchWithErrorHandling(`${baseURL}/movie/popular?api_key=${apiKey}&page=${page}`);
  },

  getNowPlayingMovies: async (page = 1) => {
    return fetchWithErrorHandling(`${baseURL}/movie/now_playing?api_key=${apiKey}&page=${page}`);
  },

  getTrendingMovies: async (timeWindow = 'day') => {
    return fetchWithErrorHandling(`${baseURL}/trending/movie/${timeWindow}?api_key=${apiKey}`);
  },

  getMovieDetails: async (movieId) => {
    return fetchWithErrorHandling(
      `${baseURL}/movie/${movieId}?api_key=${apiKey}&append_to_response=credits,videos,similar`
    );
  },

  searchMovies: async (query, page = 1) => {
    return fetchWithErrorHandling(
      `${baseURL}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=${page}`
    );
  },

  getGenres: async () => {
    return fetchWithErrorHandling(`${baseURL}/genre/movie/list?api_key=${apiKey}`);
  },

  getMoviesByGenre: async (genreId, page = 1) => {
    return fetchWithErrorHandling(
      `${baseURL}/discover/movie?api_key=${apiKey}&with_genres=${genreId}&page=${page}&sort_by=popularity.desc`
    );
  },

  discoverMovies: async (params = {}) => {
    const { page = 1, genre, year, sortBy = 'popularity.desc', minRating } = params;
    let url = `${baseURL}/discover/movie?api_key=${apiKey}&page=${page}&sort_by=${sortBy}`;
    
    if (genre) url += `&with_genres=${genre}`;
    if (year) url += `&year=${year}`;
    if (minRating) url += `&vote_average.gte=${minRating}`;
    
    return fetchWithErrorHandling(url);
  },

  getRecommendations: async (movieId, page = 1) => {
    return fetchWithErrorHandling(
      `${baseURL}/movie/${movieId}/recommendations?api_key=${apiKey}&page=${page}`
    );
  },

  getImageURL: (path, size = 'w500') => {
    if (!path) return null;
    return `${IMAGE_BASE_URL}/${size}${path}`;
  },

  getBackdropURL: (path, size = 'w1280') => {
    if (!path) return null;
    return `${IMAGE_BASE_URL}/${size}${path}`;
  },

  // TV Shows
  getPopularTVShows: async (page = 1) => {
    return fetchWithErrorHandling(`${baseURL}/tv/popular?api_key=${apiKey}&page=${page}`);
  },

  getTrendingTVShows: async (timeWindow = 'day') => {
    return fetchWithErrorHandling(`${baseURL}/trending/tv/${timeWindow}?api_key=${apiKey}`);
  },

  getOnTheAirTVShows: async (page = 1) => {
    return fetchWithErrorHandling(`${baseURL}/tv/on_the_air?api_key=${apiKey}&page=${page}`);
  },

  // Anime Movies (Japanese movies with animation genre)
  getAnimeMovies: async (page = 1) => {
    return fetchWithErrorHandling(
      `${baseURL}/discover/movie?api_key=${apiKey}&with_genres=16&with_original_language=ja&page=${page}&sort_by=popularity.desc`
    );
  },

  // Top Rated Movies
  getTopRatedMovies: async (page = 1) => {
    return fetchWithErrorHandling(`${baseURL}/movie/top_rated?api_key=${apiKey}&page=${page}`);
  },

  // Upcoming Movies
  getUpcomingMovies: async (page = 1) => {
    return fetchWithErrorHandling(`${baseURL}/movie/upcoming?api_key=${apiKey}&page=${page}`);
  },

  // Search TV Shows
  searchTVShows: async (query, page = 1) => {
    return fetchWithErrorHandling(
      `${baseURL}/search/tv?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=${page}`
    );
  },

  // Get TV Show Details
  getTVShowDetails: async (tvId) => {
    return fetchWithErrorHandling(
      `${baseURL}/tv/${tvId}?api_key=${apiKey}&append_to_response=credits,videos,similar`
    );
  }
};
