const searchForm = document.querySelector('form');
const searchInput = document.querySelector('.searchInput');
const movieContainer = document.querySelector('.movie-container');
const clearBtn = document.querySelector('.clear-btn');
const retryBtn = document.querySelector('.retry-btn');
const themeToggle = document.querySelector('.theme-toggle');

let lastSearchedMovie = "";

// Handle form submission
const formSubmission = (e) => {
    e.preventDefault();
    const movieName = searchInput.value.trim();
    if (movieName) {
            movieContainer.classList.remove('noBackground');
        showErrorMess("🎬 Fetching movie information...");
        lastSearchedMovie = movieName;
        getMovieInfo(movieName);
    } else {
        showErrorMess("❗ Please enter a movie name.");
        movieContainer.classList.remove('noBackground');
    }
};

searchForm.addEventListener('submit', formSubmission);

// Fetch movie details
const getMovieInfo = async (movie) => {
    try {
        const myApikey = "a1d17ccb";
        const URL = `https://www.omdbapi.com/?apikey=${myApikey}&t=${movie}`;
        const response = await fetch(URL);
        if (!response.ok) throw new Error("Network Error");

        const data = await response.json();
        if (data.Response === "False") {
            showErrorMess("❌ Movie not found.");
        } else {
            showMovieData(data);
        }
    } catch (error) {
        showErrorMess("⚠️ Network error. Please check your connection.");
        showRetryButton();
    }
};

// Show movie data
const showMovieData = (data) => {
    retryBtn.style.display = "none";
    movieContainer.innerHTML = "";
    movieContainer.classList.add('noBackground');

    const {
        Title, imdbRating, Genre, Released, Runtime, Actors, Plot,
        Poster, Director, Writer, Language, Country, Awards, BoxOffice,
        
    } = data;

    const movieElement = document.createElement('div');
    movieElement.classList.add('movie-info');

    const starRating = Math.round(Number(imdbRating) / 2);
    const stars = '★'.repeat(starRating) + '☆'.repeat(5 - starRating);

    const movieGenreElement = document.createElement('div');
    movieGenreElement.classList.add('movie-genre');
    Genre.split(",").forEach(element => {
        const p = document.createElement('p');
        p.innerText = element.trim();
        movieGenreElement.appendChild(p);
    });

    const trailerURL = `https://www.youtube.com/results?search_query=${Title}+trailer`;

    movieElement.innerHTML = `
        <h2>🎬 ${Title}</h2>
        <p><strong>⭐ IMDb Rating:</strong> ${stars} (${imdbRating}/10)</p>
    `;
    movieElement.appendChild(movieGenreElement);
    movieElement.innerHTML += `
        <p><strong>📅 Released:</strong> ${Released}</p>
        <p><strong>⏱️ Duration:</strong> ${Runtime}</p>
        <p><strong>🎭 Cast:</strong> ${Actors}</p>
        <p><strong>🎥 Director:</strong> ${Director}</p>
        <p><strong>✍️ Writer:</strong> ${Writer}</p>
        <p><strong>🌐 Language:</strong> ${Language}</p>
        <p><strong>🏳️ Country:</strong> ${Country}</p>
        <p><strong>🏆 Awards:</strong> ${Awards}</p>
        <p><strong>💰 Box Office:</strong> ${BoxOffice}</p>
        <p><strong>📄 Plot:</strong> ${Plot}</p>
        <p><a href="${trailerURL}" target="_blank">▶️ Watch Trailer on YouTube</a></p>
    `;

    const moviePosterElement = document.createElement('div');
    moviePosterElement.classList.add('movie-poster');
    moviePosterElement.innerHTML = `
        <img src="${Poster !== "N/A" ? Poster : 'fallback.jpg'}" alt="${Title} Poster"/>  
    `;

    movieContainer.appendChild(moviePosterElement);
    movieContainer.appendChild(movieElement);
};

// Show error with message
const showErrorMess = (message) => {
    movieContainer.innerHTML = `<h2>${message}</h2>`;
    movieContainer.classList.remove('noBackground');
    retryBtn.style.display = "none";
};

// Show retry button
const showRetryButton = () => {
    retryBtn.style.display = "inline-block";
};

// Retry fetch
retryBtn.addEventListener('click', () => {
    if (lastSearchedMovie) {
        showErrorMess("🔄 Retrying...");
        getMovieInfo(lastSearchedMovie);
    }
});

// Clear search input and results
clearBtn.addEventListener('click', () => {
    searchInput.value = "";
    movieContainer.innerHTML = "";
    movieContainer.classList.add('noBackground');
    retryBtn.style.display = "none";
});

// Theme toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const mode = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', mode);
    updateThemeIcon();
});

const updateThemeIcon = () => {
    themeToggle.textContent = document.body.classList.contains('dark-mode') ? "🌙 Dark" : "☀️ Light";
};

// Load theme on start
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
    updateThemeIcon();
});
