import './sass/index.scss';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';
import NewsApiService from './js/apiservice';

// const formSearch = document.querySelector('.search-form');
// const galleryCont = document.querySelector('.gallery');
// const loadMoreBtn = document.querySelector('.load-more');

// let isShown = 0;
// const newsApiService = new NewsApiService();

// formSearch.addEventListener('submit', onSearch);
// loadMoreBtn.addEventListener('click', onLoadMore);

// const options = {
//     rootMargin: '55px',
//     root: null,
//     threshold: 0.5,
// };
// const observer = new IntersectionObserver(onLoadMore, options);

// function onSearch(e) {
//     e.preventDefault();
//     galleryCont.innerHTML = '';
//     newsApiService.query = e.currentTarget.elements.searchQuery.value.trim();
//     newsApiService.resetPage();

//     if (newsApiService.query === '') {
//         Notify.warning('Please, fill the main field!');
//         return;
//     }

//     isShown = 0;
//     fetchGallery();
//     // onRenderGallery(hits);
// }

// function onLoadMore() {
//     newsApiService.incrementPage();
//     fetchGallery();
// }

// async function fetchGallery() {
//    loadMoreBtn.classList.add('is-hidden');
  
//     const r = await newsApiService.fetchGallery();
//     const { hits, total } = r;
//     isShown += hits.length;
  
//     if (!hits.length) {
//       Notify.failure(
//         `Sorry, there are no images matching your search query. Please try again.`
//       );
//       loadMoreBtn.classList.add('is-hidden');
//       return;
//     }
  
//     onRenderGallery(hits);
//     isShown += hits.length;
  
//     if (isShown < total) {
//       Notify.success(`Hooray! We found ${total} images !!!`);
//       loadMoreBtn.classList.remove('is-hidden');
//     }
  
//     if (isShown >= total) {
//       Notify.info("We're sorry, but you've reached the end of search results.");
//     }
//   }
  
//   function onRenderGallery(elements) {
//     const markup = elements
//       .map(
//         ({
//           webformatURL,
//           largeImageURL,
//           tags,
//           likes,
//           views,
//           comments,
//           downloads,
//         }) => {
//           return `<div class="photo-card">
//       <a href="${largeImageURL}">
//         <img class="photo-img" src="${webformatURL}" alt="${tags}" loading="lazy" />
//       </a>
//       <div class="info">
//         <p class="info-item">
//           <b>Likes</b>
//           ${likes}
//         </p>
//         <p class="info-item">
//           <b>Views</b>
//           ${views}
//         </p>
//         <p class="info-item">
//           <b>Comments</b>
//           ${comments}
//         </p>
//         <p class="info-item">
//           <b>Downloads</b>
//           ${downloads}
//         </p>
//       </div>
//       </div>`;
//         }
//       )
//       .join('');
//     galleryCont.insertAdjacentHTML('beforeend', markup);
//   }
const galleryCont = document.querySelector('.gallery');
const searchForm = document.querySelector('.search-form');
const newsApiService = new NewsApiService();
// const gallery = new SimpleLightbox('.gallery a');
// // const loadMoreBtn = new LoadMoreBtn({
// //   selector: '.load-more',
// //   hidden: true,
// // });
const optionsForObserver = {
  rootMargin: '250px',
};
const observer = new IntersectionObserver(onEntry, optionsForObserver);

// observer.observe(refs.wrapper);
searchForm.addEventListener('submit', onSearch);
// loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();

  newsApiService.query = e.currentTarget.elements.searchQuery.value.trim();

  newsApiService.resetLoadedHits();
newsApiService.resetPage();
  // loadMoreBtn.show();
  // loadMoreBtn.disable();
  clearGelleryContainer();

  if (!newsApiService.query) {
    return warningQuery();
  }

  newsApiService.fetchImages().then(({ hits, totalHits }) => {
    if (!hits.length) {
      // setTimeout(() => {
      //   loadMoreBtn.hide();
      // }, 1_500);

      return erorrQuery();
    }

    // loadMoreBtn.enable();
    newsApiService.incrementLoadedHits(hits);
    createGalleryMarkup(hits);
    accessQuery(totalHits);
    gallery.refresh();

    if (hits.length === totalHits) {
      // loadMoreBtn.hide();
      endOfSearch();
    }
  });

}

function onEntry(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting && newsApiService.query) {
      newsApiService
        .fetchImages()
        .then(({ hits, totalHits }) => {
          newsApiService.incrementLoadedHits(hits);
          if (totalHits <= newsApiService.loadedHits) {
            endOfSearch();
          }

          createGalleryMarkup(hits);
          gallery.refresh();
        })
        .catch(error => {
          console.warn(`${error}`);
        });
    }
  });
}

// function onLoadMore() {
//   loadMoreBtn.disable();

//   imagesApiService.fetchImages().then(({ hits, totalHits }) => {
//     imagesApiService.incrementLoadedHits(hits);
//     loadMoreBtn.enable();

//     if (totalHits <= imagesApiService.loadedHits) {
//       loadMoreBtn.hide();
//       endOfSearch();
//     }

//     createGalleryMarkup(hits);
//     gallery.refresh();
//   });
// }

function accessQuery(totalHits) {
  Notify.success(`Hooray! We found ${totalHits} images.`);
}

function endOfSearch() {
  Notify.info("We're sorry, but you've reached the end of search results.");
}
function warningQuery() {
  Notify.warning('Please, fill the main field!');
}

function erorrQuery() {
  Notify.failure('Sorry, there are no images matching your search query. Please try again.');
}

function clearGelleryContainer() {
 galleryCont.innerHTML = '';
}

function createGalleryMarkup(images) {
  const markup = images
    .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
      return `
    <div class="photo-card">
      <a href="${webformatURL}">
        <img
          class="photo-card__img"
          src="${largeImageURL}" 
          alt="${tags}" 
          loading="lazy" 
          width="320"
          height="212"
        />
      </a>
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
          <span>${likes}</span>
        </p>
        <p class="info-item">
          <b>Views</b>
          <span>${views}</span>
        </p>
        <p class="info-item">
          <b>Comments</b>
          <span>${comments}</span>
        </p>
        <p class="info-item">
          <b>Downloads</b>
          <span>${downloads}</span>
        </p>
      </div>
    </div>
    `;
    })
    .join('');

  galleryCont.insertAdjacentHTML('beforeend', markup);
}
