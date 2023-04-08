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

import './sass/index.scss';
import { fetchImages } from './js/fetch-images';
import { renderGallery } from './js/render-gallery';
import { onScroll, onToTopBtn } from './js/scroll';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';

import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.btn-load-more');
let query = '';
let page = 1;
let simpleLightBox;
const perPage = 40;

searchForm.addEventListener('submit', onSearchForm);
loadMoreBtn.addEventListener('click', onLoadMoreBtn);

onScroll();
onToTopBtn();

function onSearchForm(e) {
  e.preventDefault();
  window.scrollTo({ top: 0 });
  page = 1;
  query = e.currentTarget.searchQuery.value.trim();
  gallery.innerHTML = '';
  loadMoreBtn.classList.add('is-hidden');

  if (query === '') {
    alertNoEmptySearch();
    return;
  }

  fetchImages(query, page, perPage)
    .then(({ data }) => {
      if (data.totalHits === 0) {
        alertNoImagesFound();
      } else {
        renderGallery(data.hits);
        simpleLightBox = new SimpleLightbox('.gallery a').refresh();
        alertImagesFound(data);

        if (data.totalHits > perPage) {
          loadMoreBtn.classList.remove('is-hidden');
        }
      }
    })
    .catch(error => console.log(error))
    .finally(() => {
      searchForm.reset();
    });
}

function onLoadMoreBtn() {
  page += 1;
  simpleLightBox.destroy();

  fetchImages(query, page, perPage)
    .then(({ data }) => {
      renderGallery(data.hits);
      simpleLightBox = new SimpleLightbox('.gallery a').refresh();

      const totalPages = Math.ceil(data.totalHits / perPage);

      if (page > totalPages) {
        loadMoreBtn.classList.add('is-hidden');
        alertEndOfSearch();
      }
    })
    .catch(error => console.log(error));
}

function alertImagesFound(data) {
  Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
}

function alertNoEmptySearch() {
  Notiflix.Notify.failure('The search string cannot be empty. Please specify your search query.');
}

function alertNoImagesFound() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.',
  );
}

function alertEndOfSearch() {
  Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
}