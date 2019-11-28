interface Movie {
  id: number;
  video: boolean;
  vote_count: number;
  vote_average: number;
  title: string;
  release_date: string;
  original_language: string;
  original_title: string;
  genre_ids: number[];
  backdrop_path: string;
  adult: boolean;
  overview: string;
  poster_path: string;
  popularity: number;
}

type MovieList = Movie[];

let allMoviesList: MovieList = [];
let watchList: number[] =
  JSON.parse(localStorage.getItem("watchListItems")) || [];
const moviesContainer: HTMLElement = document.querySelector(
  ".movies__container ul"
) as HTMLUListElement;
const searchMovies: HTMLInputElement = document.querySelector(
  "[name=site-search]"
);
const watchListBtn: HTMLUListElement = document.querySelector(".watch-list");
const homeBtn: HTMLElement = document.querySelector(".home");

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

function showMovies(movies: MovieList): void {
  moviesContainer.innerHTML = movies
    .map((movie: Movie, index: number): string => {
      let year: string = "";
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

function addWatchList(event: MouseEvent) {
  const target = event.target as HTMLElement;

  if (!target.classList.contains("fa-plus-circle")) return;
  const id = target.dataset.id;
  const intId: number = Number(id);
  if (!watchList.includes(intId)) {
    watchList.push(intId);
  }

  localStorage.setItem("watchListItems", JSON.stringify(watchList));
}

function addClearList(): void {
  watchListBtn.insertAdjacentHTML(
    "afterend",
    '<li><a class="clear" href="#">Clear List</a></li>'
  );
  const clearBtn: HTMLElement = document.querySelector(".clear");

  clearBtn.addEventListener("click", () => {
    window.localStorage.clear();
    showMovies([]);
  });
}

function showWatchList(): void {
  const favMovieArray: MovieList = watchList.map(id => {
    // Causes error if tripple equals is used
    const movieIndex: number = allMoviesList.findIndex(
      (movie: Movie) => movie.id === id
    );
    return allMoviesList[movieIndex];
  });

  watchListBtn.classList.add("hilight");
  homeBtn.classList.remove("hilight");

  showMovies(favMovieArray);
  addClearList();
}

function search(event: KeyboardEvent): void {
  /**
   * Can also be written as :
   * const searchText = (event.target as HTMLInputElement).value.toLowerCase();
   *
   * or,
   * const searchTaget = event.target as HTMLInputElement;
   * const searchText = searchTaget.value.toLowerCase();
   */
  const searchText: string = (<HTMLInputElement>(
    event.target
  )).value.toLowerCase();
  const searchedMovie: MovieList = allMoviesList.filter((movie: Movie) =>
    movie.original_title.toLowerCase().includes(searchText)
  );
  showMovies(searchedMovie);
}

function homePageActive(): void {
  homeBtn.classList.add("hilight");
  watchListBtn.classList.remove("hilight");
}

fetchData();

searchMovies.addEventListener("keyup", search);
moviesContainer.addEventListener("click", addWatchList);
watchListBtn.addEventListener("click", showWatchList);
homeBtn.addEventListener("click", homePageActive);
