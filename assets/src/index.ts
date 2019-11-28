/**************************************************
 * Type declarations
 *************************************************/
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
type PromiseList = {
  results: Movie[];
};

/**************************************************
 * Variable declarations
 *************************************************/
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

/**************************************************
 * Fetches Data from local fetch.jsom
 **************************************************/
async function fetchData() {
  try {
    const movieList = await new Promise<PromiseList>((resolve, reject) => {
      fetch("./assets/src/fetch.json").then(blob => {
        if (blob.ok) {
          return resolve(blob.json());
        } else {
          return reject(new Error("Error"));
        }
      });
    });
    /*
     * Simpler async/await implementation would have been:
     * const { results } = await fetch("./assets/src/fetch.json").then(blob => blob.json());
     */
    allMoviesList = movieList.results;
    showMovies(allMoviesList);
  } catch (error) {
    throw new Error(error);
  }
}

/**************************************************
 * Displays movies passed as parameter
 * @param movies Array of Movies to displayed
 **************************************************/
function showMovies(movies: MovieList): void {
  console.log(movies);

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

/**************************************************
 * To add selected movies to the list
 * @param event : Mouse trigger event
 **************************************************/
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

/**************************************************
 * Adds a Clear List button
 **************************************************/
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

/**************************************************
 * Displays Added movies to the watchList
 **************************************************/
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

/**************************************************
 * Allows to search from list of fetched movies
 * @param event Keyboard triggered event
 **************************************************/
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
