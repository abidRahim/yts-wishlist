let allMoviesList = [];
let watchList = JSON.parse(localStorage.getItem("watchListItems")) || [];
const movieContainer = document.querySelector(".movie-container ul");
const moviesContainer = document.querySelector(".movies__container ul");
const searchMovies = document.querySelector("[name=site-search]");
const watchListBtn = document.querySelector(".watch-list");
const homeBtn = document.querySelector(".home");

async function fetchData() {
  try {
    const { results } = await fetch("./assets/src/fetch.json").then(blob =>
      blob.json()
    );
    allMoviesList = results;
    showMovies(results);
  } catch (error) {
    throw error;
  }
}

function showMovies(movies) {
  moviesContainer.innerHTML = movies
    .map((movie, index) => {
      let year = "";
      const postetUrl = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
      if (movie.release_date) {
        [year] = movie.release_date.split("-");
      }

      return `<li class="movie-wrapper" data-id=${index}>
      <div class=movie_cover>
        <img  src="${postetUrl}">
      </div>
      <div class="data-wrap">
        <h3 class="movie-name">${movie.original_title}</h3>
        <span class="release-year">${year}</span>
      </div>  
      <div class="data-wrap">
        <div class="star">
          <i class="fas fa-star"></i>
          <span class="movie-rating">${movie.vote_average}/10</span>
        </div>
        <i class="fas fa-plus-circle fa-2x" id="add-btn" data-tooltip="Add to watchList" data-id=${movie.id}></i>
      </div>
    </li>`;
    })
    .join("");
}

function addWatchList(e) {
  if (!e.target.classList.contains("fa-plus-circle")) return;
  const id = e.target.dataset.id;
  if (!watchList.includes(id)) {
    watchList.push(id);
  }
  localStorage.setItem("watchListItems", JSON.stringify(watchList));
}

function addClearList() {
  watchListBtn.insertAdjacentHTML(
    "afterend",
    '<li><a class="clear" href="#">Clear List</a></li>'
  );
  const clearBtn = document.querySelector(".clear");
  clearBtn.addEventListener("click", () => {
    window.localStorage.clear();
    showMovies([]);
  });
}

function showWatchList() {
  watchListBtn.classList.add("hilight");
  homeBtn.classList.remove("hilight");
  const favMovieArray = watchList.map(id => {
    // Causes error if tripple equals is used
    const movieIndex = allMoviesList.findIndex(
      movie => movie.id.toString() === id
    );
    return allMoviesList[movieIndex];
  });
  showMovies(favMovieArray);
  addClearList();
}

function search() {
  let searchText = this.value.toLowerCase();
  const searchedMovie = allMoviesList.filter(movie =>
    movie.original_title.toLowerCase().includes(searchText)
  );
  showMovies(searchedMovie);
}

function homePageActive() {
  homeBtn.classList.add("hilight");
  watchListBtn.classList.remove("hilight");
}

fetchData();

searchMovies.addEventListener("keyup", search);
moviesContainer.addEventListener("click", addWatchList);
watchListBtn.addEventListener("click", showWatchList);
homeBtn.addEventListener("click", homePageActive);
