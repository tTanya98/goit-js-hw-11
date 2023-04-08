// import './sass/index.scss';
// import { Notify } from 'notiflix/build/notiflix-notify-aio';
// import LoadMoreBtn from './js/load-more';
// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';
// import NewsApiService from './js/apiservice';

// const galleryCont = document.querySelector('.gallery');
// const searchForm = document.querySelector('.search-form');
// const newsApiService = new NewsApiService();
// const gallery = new SimpleLightbox('.gallery a');
// const loadMoreBtn = new LoadMoreBtn({
//   selector: '.load-more',
//   hidden: true,
// });
// const optionsForObserver = {
//   rootMargin: '250px',
//   root: null,
//   threshold: 0.5,
// };
// // const observer = new IntersectionObserver(onEntry, optionsForObserver);

// searchForm.addEventListener('submit', onSearch);
// // loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

// function onSearch(e) {
//   e.preventDefault();
//   newsApiService.query = e.currentTarget.elements.searchQuery.value.trim();
//   // newsApiService.resetLoadedHits();
// newsApiService.resetPage();
//   clearGelleryContainer();

//   if (!newsApiService.query) {
//     return warningQuery();
//   }

//   newsApiService.getImages().then(({ hits, totalHits }) => {
//     if (!hits.length) {
//         loadMoreBtn.hide();
//       return erorrQuery();
//     }

//     // newsApiService.incrementLoadedHits(hits);
//     createGalleryMarkup(hits);
//     accessQuery(totalHits);
//     gallery.refresh();
//     loadMoreBtn.show();

//     if (hits.length === totalHits) {
//       loadMoreBtn.hide();
//       endOfSearch();
//     }
//   });

// }

// // function onEntry(entries) {
// //   entries.forEach(entry => {
// //     if (entry.isIntersecting && newsApiService.query) {
// //       newsApiService
// //         .fetchImages()
// //         .then(({ hits, totalHits }) => {
// //           newsApiService.incrementLoadedHits(hits);
// //           if (totalHits <= newsApiService.loadedHits) {
// //             endOfSearch();
// //           }

// //           createGalleryMarkup(hits);
// //           gallery.refresh();
// //         })
// //         .catch(error => {
// //           console.warn(`${error}`);
// //         });
// //     }
// //   });
// // }

// // function onLoadMore() {

// //   newsApiService.fetchImages().then(({ hits, totalHits }) => {
// //     newsApiService.incrementLoadedHits(hits);

// //     if (totalHits <= newsApiService.loadedHits) {
// //       loadMoreBtn.hide();
// //       endOfSearch();
// //     }

// //     createGalleryMarkup(hits);
// //     gallery.refresh();
// //     loadMoreBtn.enable();

// //   });
// // }

// const onEntry = async function (entries, observer){
//   entries.forEach(async entry => {
//     if (entry.isIntersecting) {
//       newsApiService
//         .getImages()
//       // observer.unobserve(entry.target);
//       newsApiService.incrementPage();
//         try {
//           const { hits, totalHits } = await newsApiService.getImages();
//           const markup = createGalleryMarkup(hits);
//           galleryCont.insertAdjacentHTML('beforeend', markup);
//           newsApiService.incrementLoadedHits(hits);
//           if (totalHits <= newsApiService.loadedHits) {
//             endOfSearch();
//           }
//           gallery.refresh();
//         }
//         catch (error) {
//           console.warn(`${error}`);
//         }
//     }
//   });
// } 
// const observer = new IntersectionObserver(onEntry, optionsForObserver);

// const onLoadMore = async () => {
//   // newsApiService.incrementLoadedHits(hits);
//   newsApiService.incrementPage();
//     try {
//       const { hits, totalHits } = await newsApiService.getImages();
//     if (totalHits <= newsApiService.loadedHits) {
//       loadMoreBtn.hide();
//       endOfSearch();
//     }  
//       const markup = createGalleryMarkup(hits);
//       galleryCont.insertAdjacentHTML('beforeend', markup);
//       gallery.refresh();
//       // loadMoreBtn.enable(); 
//     }
//     catch (error) {
//       console.warn(`${error}`);
//     }
// }

// loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

// function accessQuery(totalHits) {
//   Notify.success(`Hooray! We found ${totalHits} images.`);
// }

// function endOfSearch() {
//   Notify.info("We're sorry, but you've reached the end of search results.");
// }
// function warningQuery() {
//   Notify.warning('Please, fill the main field!!');
// }

// function erorrQuery() {
//   Notify.failure('Sorry, there are no images matching your search query. Please try again.');
// }

// function clearGelleryContainer() {
//  galleryCont.innerHTML = '';
// }

// function createGalleryMarkup(images) {
//   const markup = images
//     .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
//       return `
//     <div class="photo-card">
//       <a href="${webformatURL}">
//         <img
//           class="photo-card__img"
//           src="${largeImageURL}" 
//           alt="${tags}" 
//           loading="lazy" 
//           width="320"
//           height="212"
//         />
//       </a>
//       <div class="info">
//         <p class="info-item">
//           <b>Likes</b>
//           <span>${likes}</span>
//         </p>
//         <p class="info-item">
//           <b>Views</b>
//           <span>${views}</span>
//         </p>
//         <p class="info-item">
//           <b>Comments</b>
//           <span>${comments}</span>
//         </p>
//         <p class="info-item">
//           <b>Downloads</b>
//           <span>${downloads}</span>
//         </p>
//       </div>
//     </div>
//     `;
//     })
//     .join('');

//   galleryCont.insertAdjacentHTML('beforeend', markup);
// }

import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// пошук елементів документа
const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('input'),
  gallery: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('.load-more'),
};

let page = 1; // початкове значення параметра page повинно бути 1 сторніка

refs.btnLoadMore.style.display = 'none'; // ховаємо кнопку
refs.form.addEventListener('submit', onSearch); // слухач події на submit
refs.btnLoadMore.addEventListener('click', onBtnLoadMore); // слухач події клік по кнопці loadMore

// обробка події на submit
function onSearch(evt) {
  evt.preventDefault(); // відміна перезавантаження сторінки

  page = 1;
  refs.gallery.innerHTML = ''; // очищення попереднього вмісту галереї

  const name = refs.input.value.trim(); // обрізання пробілів до і після слова

  // якщо слово пошука НЕ пуста строка то:
  if (name !== '') {
    pixabay(name); // отримати зображення

  } else {
    refs.btnLoadMore.style.display = 'none';

    // вивести повідомлення про те, що НЕ знайдено жодного зображення
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

// дії кнопки LoadMore
function onBtnLoadMore() {
  const name = refs.input.value.trim();
  page += 1; // додаємо +1 сторінку яка має +40 картинок
  pixabay(name, page); // завантаження зображень
}

// отримання зображень
async function pixabay(name, page) {
  const API_URL = 'https://pixabay.com/api/';

  // параметри запиту на бекенд
  const options = {
    params: {
      key: '34997553-a7b2d36a26db158f740bb35fd', // мій персональний ключ з pixabay
      q: name,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: page,
      per_page: 40,
    },
  };

  try {
    // отримання відповіді-результату від бекенду
    const response = await axios.get(API_URL, options);

    // сповіщення notiflix
    notification(
      response.data.hits.length, // довжина всіх знайдених зображень
      response.data.total // отримання кількості
    );

    createMarkup(response.data); // рендер розмітки на сторінку
  } catch (error) {
    console.log(error);
  }
}

// рендер розмітки на сторінку
function createMarkup(arr) {
  const markup = arr.hits
    .map(
      item =>
        `<a class="photo-link" href="${item.largeImageURL}">
            <div class="photo-card">
            <div class="photo">
            <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy"/>
            </div>
                    <div class="info">
                        <p class="info-item">
                            <b>Likes</b>
                            ${item.likes}
                        </p>
                        <p class="info-item">
                            <b>Views</b>
                            ${item.views}
                        </p>
                        <p class="info-item">
                            <b>Comments</b>
                            ${item.comments}
                        </p>
                        <p class="info-item">
                            <b>Downloads</b>
                            ${item.downloads}
                        </p>
                    </div>
            </div>
        </a>`
    )
    .join(''); // сполучення рядків всіх об'єктів (всіх картинок)
  refs.gallery.insertAdjacentHTML('beforeend', markup); // вставлення розмітки на сторінку
  simpleLightBox.refresh(); // оновлення екземпляру lightbox
}

// екземпляр модального вікна слайдера-зображень
const simpleLightBox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt', // опис
  captionDelay: 250, // затримка 250 мілісекунд
});

// всі сповіщення notiflix
function notification(length, totalHits) {
  if (length === 0) {

      // вивести повідомлення про те, що НЕ знайдено жодного зображення
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  if (page === 1) {
    refs.btnLoadMore.style.display = 'flex'; // показуємо кнопку loadMore

    // вивести повідомлення про кількість знайдених зобрежнь
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  }

  if (length < 40) {
    refs.btnLoadMore.style.display = 'none'; // ховаємо кнопку loadMore

      // вивести інфо-повідомлення про те, що більше вже немає зображень
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
}