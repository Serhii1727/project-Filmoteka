/*
      ОПИСАНИЕ РАБОТЫ МОДУЛЯ

      В модуле прописан класс "Movie" для работы с каждой карточкой фильма

      --Получить список трендов (популярных фильмов за неделю):

        В модуле "controller.js", при инициализации (функция "init()"") визвана функция "getMovieList()".

*/

// main module to manipulate with data inside an application

import { API_KEY, API_BASE_URL, API_IMG_URL, NOPOSTER_IMG_URL, refs, watchedIdArr, queueIdArr } from './global';
// import { fetchMovie, fetchMovies, getGenres } from 'movie-api';
import { showMovies } from './markup';
import APIService from './movie-api';
import * as initialGenres from './dummy-array-objs/genres.json';
// import DataStorage from './data.js';

class Movie {
  constructor(responseData) {
    // console.log(responseData);
    this.id = responseData.id;
    this.posterPath = this.#getPosterPath(responseData.poster_path);
    this.title = responseData.original_title;
    this.genres = responseData.genre_ids;
    this.releaseDate = responseData.release_date.substr(0, 4);
    this.inWached = this.#getInWached();
    this.inQueue = this.#getInQueue();
  }

  // Genres in row
  get genresInRow() {
    return this.#parseGenresByString(2);
  }

  get wachedOrQueueClass() {
    return this.inWached ? "in-watched" : this.inQueue ? "in-queue" : "";
  }

  // Private methods

  #parseGenresByString(maxCount = 0) {
    const genreList = this.#getGenres();
    const genreNames = [];

    for (let i = 0; i < this.genres.length; i++) {
      if (maxCount && i === maxCount && i < this.genres.length - 1) {
        genreNames.push('others');
        break;
      }

      const findValue = genreList.find(item => item.id === this.genres[i]);

      if (findValue) {
        genreNames.push(findValue.name);
      }
    }

    return genreNames.join(', ');
  }

  #getInWached() {
    return !!watchedIdArr.find(item => item === this.id);
  }

  #getInQueue() {
    return !!queueIdArr.find(item => item === this.id);
  }

  #getGenres() {
  return API.getGenres();
  }

  #getPosterPath(poster_path) {
    const fullPosterPatch = `${API_IMG_URL}${poster_path}`;
    return fullPosterPatch;
    // return NOPOSTER_IMG_URL;

    // const poster = new Image();
    // poster.src = fullPosterPatch;
    // 
    // poster.onload = () => fullPosterPatch;
    // poster.onerror = () => alert("NoImage");
  }

}

// const dataStorage = new DataStorage(API_KEY);
const API = new APIService();

// let currentMovieList = [{ film1 }, { film2 }, { film3 }];

export function getMovieList(params) {
  // depending on params requests API or data
  if (!params) {
    API.getTrending()
      .then(responseData => {        
        console.log(`Current page: ${responseData.page}, total page: ${responseData.total_pages}`); // --> for pagination
        return responseData.results;
      })
      .then(movieList => {
        objectsArray = [];

        movieList.map(movieItem => {          
          const movie = new Movie(movieItem); // class instance
          
          objectsArray.push(movie);
        })
        
        showMovies(objectsArray);

        // Получаем все селекторы с классом ".card-link", это ссылки, для открытия деталей фильма
        refs.cardLinks = document.querySelectorAll('.card-link');

        // console.log(refs.cardLinks); // ВРЕМЕННО

        // Перебираем все селекторы и для каждого навязываем событие 'click'
        refs.cardLinks.forEach(cardLink => {
          // console.log(cardLink); // ВРЕМЕННО
          cardLink.addEventListener('click', () => {
            event.preventDefault();
            console.log(cardLink); // ВРЕМЕННО

            // Открываем модальное окно (убираем класс "is-hidden")
            // cardLink.toggleAttribute(".is-hidden");
              
            });
          });

      })      
      .catch(result => console.log(result));
  }
}

function getMovieInfo(id) {
  return fetchMovie(id);
}

export function searchMovies(params) {
  // depending on params searches films in current list
  if (params) {
    API.searchMovie(params)
      .then(responseData => {
        console.log(`Current page: ${responseData.page}, total page: ${responseData.total_pages}`); // --> for pagination
        return responseData.results;
      })
      .then(movieList => {        
        objectsArray = [];
        movieList.map(movieItem => {
          const movie = new Movie(movieItem); // class instance
        
          objectsArray.push(movie);
        })
        console.log('objectsArray', objectsArray);
        showMovies(objectsArray);
      })
      .catch(result => console.log(result));
  }
  
}

function addQueue(film) {
  // gets dataStorage.getQueue, adds film.id and then sets dataStorage.setQueue
}

function addWatched(film) {
  // gets dataStorage.getQueue, adds film.id and then sets dataStorage.setQueue
}

function removeQueue(film) {
  // gets dataStorage.getQueue, removes film.id and then sets dataStorage.setQueue
}

function removeWatched(film) {
  // gets dataStorage.getQueue, removes film.id and then sets dataStorage.setQueue
}
