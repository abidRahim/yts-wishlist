var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let allMoviesList = [];
let watchList = JSON.parse(localStorage.getItem("watchListItems")) || [];
const moviesContainer = document.querySelector(".movies__container ul");
const searchMovies = document.querySelector("[name=site-search]");
const watchListBtn = document.querySelector(".watch-list");
const homeBtn = document.querySelector(".home");
function fetchData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { results } = yield fetch("./assets/src/fetch.json").then(blob => blob.json());
            allMoviesList = results;
            showMovies(results);
        }
        catch (error) {
            throw error;
        }
    });
}
function showMovies(movies) {
    moviesContainer.innerHTML = movies
        .map((movie, index) => {
        let year = "";
        if (movie.release_date) {
            [year] = movie.release_date.split("-");
        }
        return `<li class="movie-wrapper" data-id=${index}>
      <div class=movie_cover>
        <img  src="${movie.poster_path}">
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
function addWatchList(event) {
    const target = event.target;
    if (!target.classList.contains("fa-plus-circle"))
        return;
    const id = target.dataset.id;
    const intId = Number(id);
    if (!watchList.includes(intId)) {
        watchList.push(intId);
    }
    localStorage.setItem("watchListItems", JSON.stringify(watchList));
}
function addClearList() {
    watchListBtn.insertAdjacentHTML("afterend", '<li><a class="clear" href="#">Clear List</a></li>');
    const clearBtn = document.querySelector(".clear");
    clearBtn.addEventListener("click", () => {
        window.localStorage.clear();
        showMovies([]);
    });
}
function showWatchList() {
    const favMovieArray = watchList.map(id => {
        // Causes error if tripple equals is used
        const movieIndex = allMoviesList.findIndex((movie) => movie.id === id);
        return allMoviesList[movieIndex];
    });
    watchListBtn.classList.add("hilight");
    homeBtn.classList.remove("hilight");
    showMovies(favMovieArray);
    addClearList();
}
function search(event) {
    /**
     * Can also be written as :
     * const searchText = (event.target as HTMLInputElement).value.toLowerCase();
     *
     * or,
     * const searchTaget = event.target as HTMLInputElement;
     * const searchText = searchTaget.value.toLowerCase();
     */
    const searchText = (event.target).value.toLowerCase();
    const searchedMovie = allMoviesList.filter((movie) => movie.original_title.toLowerCase().includes(searchText));
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
