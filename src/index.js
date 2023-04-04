import './sass/index.scss';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import NewsApiService from './js/apiservice';

const formSearch = document.querySelector('.search-form');
const galleryCont = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let isShown = 0;
const newsApiService = new NewsApiService();

formSearch.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

const options = {
    rootMargin: '55px',
    root: null,
    threshold: 0.5,
};
const observer = new IntersectionObserver(onLoadMore, options);

function onSearch(e) {
    e.preventDefault();
    galleryCont.innerHTML = '';
    newsApiService.query = e.currentTarget.elements.searchQuery.value.trim();
    newsApiService.resetPage();

    if (newsApiService.query === '') {
        Notify.warning('Please, fill the main field!');
        return;
    }

    isShown = 0;
    fetchGallery();
    // onRenderGallery(hits);
}

function onLoadMore() {
    newsApiService.incrementPage();
    fetchGallery();
}

async function fetchGallery() {
   loadMoreBtn.classList.add('is-hidden');
  
    const r = await newsApiService.fetchGallery();
    const { hits, total } = r;
    isShown += hits.length;
  
    if (!hits.length) {
      Notify.failure(
        `Sorry, there are no images matching your search query. Please try again.`
      );
      loadMoreBtn.classList.add('is-hidden');
      return;
    }
  
    onRenderGallery(hits);
    isShown += hits.length;
  
    if (isShown < total) {
      Notify.success(`Hooray! We found ${total} images !!!`);
      loadMoreBtn.classList.remove('is-hidden');
    }
  
    if (isShown >= total) {
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
  }
  
  function onRenderGallery(elements) {
    const markup = elements
      .map(
        ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) => {
          return `<div class="photo-card">
      <a href="${largeImageURL}">
        <img class="photo-img" src="${webformatURL}" alt="${tags}" loading="lazy" />
      </a>
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
          ${likes}
        </p>
        <p class="info-item">
          <b>Views</b>
          ${views}
        </p>
        <p class="info-item">
          <b>Comments</b>
          ${comments}
        </p>
        <p class="info-item">
          <b>Downloads</b>
          ${downloads}
        </p>
      </div>
      </div>`;
        }
      )
      .join('');
    galleryCont.insertAdjacentHTML('beforeend', markup);
    // lightbox.refresh();
  }