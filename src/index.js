// import './sass/index.scss';
// import { fetchImages } from './js/fetch-images';
// import { renderGallery } from './js/render-gallery';
// import { onScroll, onToTopBtn } from './js/scroll';
// import Notiflix from 'notiflix';
// import SimpleLightbox from 'simplelightbox';

// import 'simplelightbox/dist/simple-lightbox.min.css';

// const searchForm = document.querySelector('#search-form');
// const gallery = document.querySelector('.gallery');
// const loadMoreBtn = document.querySelector('.btn-load-more');
// let query = '';
// let page = 1;
// let simpleLightBox;
// const perPage = 40;

// searchForm.addEventListener('submit', onSearchForm);
// loadMoreBtn.addEventListener('click', onLoadMoreBtn);
// onScroll();
// onToTopBtn();

// function onSearchForm(e) {
//   e.preventDefault();
//   window.scrollTo({ top: 0 });
//   page = 1;
//   query = e.currentTarget.searchQuery.value.trim();
//   gallery.innerHTML = '';
//   loadMoreBtn.classList.add('is-hidden');

//   if (query === '') {
//     alertNoEmptySearch();
//     return;
//   }

//   fetchImages(query, page, perPage)
//     .then(({ data }) => {
//       if (data.totalHits === 0) {
//         alertNoImagesFound();
//       } else {
//         renderGallery(data.hits);
//         simpleLightBox = new SimpleLightbox('.gallery a').refresh();
//         alertImagesFound(data);

//         if (data.totalHits > perPage) {
//           loadMoreBtn.classList.remove('is-hidden');
//         }
//       }
//     })
//     .catch(error => console.log(error))
//     .finally(() => {
//       searchForm.reset();
//     });
// }

// function onLoadMoreBtn() {
//   page += 1;
//   simpleLightBox.destroy();

//   fetchImages(query, page, perPage)
//     .then(({ data }) => {
//       renderGallery(data.hits);
//       simpleLightBox = new SimpleLightbox('.gallery a').refresh();

//       const totalPages = Math.ceil(data.totalHits / perPage);

//       if (page > totalPages) {
//         loadMoreBtn.classList.add('is-hidden');
//         alertEndOfSearch();
//       }
//     })
//     .catch(error => console.log(error));
// }

// function alertImagesFound(data) {
//   Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
// }

// function alertNoEmptySearch() {
//   Notiflix.Notify.failure('The search string cannot be empty. Please specify your search query.');
// }

// function alertNoImagesFound() {
//   Notiflix.Notify.failure(
//     'Sorry, there are no images matching your search query. Please try again.',
//   );
// }

// function alertEndOfSearch() {
//   Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
// }
import Notiflix from "notiflix";
import { PixabayAPI } from "./js/fetch-images";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const galleryLightBox = new SimpleLightbox(`.gallery a`);
const pixabayAPI = new PixabayAPI();

const perPage = pixabayAPI.perPage;

const formEl = document.querySelector(`#search-form`);
const galleryEl = document.querySelector(`.gallery`);
const loadMoreEl = document.querySelector(`.load-more`);
const divSearchEl = document.querySelector(`.search`);

formEl.addEventListener(`submit`, handleSearchPhotos);
loadMoreEl.addEventListener(`click`, handleLoadMoreEls);

async function handleSearchPhotos(e) {
    e.preventDefault();

    pixabayAPI.q = e.target.elements.searchQuery.value.trim();

    if (!pixabayAPI.q) {
        Notiflix.Notify.warning(`The field cannot be empty. Please enter a search query`);
        return
    }
    
    divSearchEl.classList.add(`search-fixed`)
    pixabayAPI.page = 1;

    try {
        const { data } = await pixabayAPI.fetchPhotos();         
        const totalPage = Math.ceil(data.totalHits / perPage);
        if (!data.hits.length) {
            galleryEl.innerHTML = '';
            throw new Error()

        } else if (totalPage === pixabayAPI.page) {
            Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images`)
            galleryEl.innerHTML = renderingGallery(data.hits);
            galleryLightBox.refresh();
            loadMoreEl.classList.add("is-hiden");
            return
        }
    
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images`)
        galleryEl.innerHTML = renderingGallery(data.hits);
        loadMoreEl.classList.remove("is-hiden")
        galleryLightBox.refresh();
    }

        catch (error) {
        loadMoreEl.classList.add("is-hiden");
        Notiflix.Notify.failure(`Sorry, there are no images matching your search query. Please try again`);
    };
}

async function handleLoadMoreEls(e) {

    pixabayAPI.page += 1;

    try {
        const { data } = await pixabayAPI.fetchPhotos();
        const totalPage = Math.ceil(data.totalHits / perPage);
        if (totalPage === pixabayAPI.page) {
            galleryEl.insertAdjacentHTML(`beforeend`, renderingGallery(data.hits));
            loadMoreEl.classList.add("is-hiden");
            throw new Error();
        }
        
        galleryEl.insertAdjacentHTML(`beforeend`, renderingGallery(data.hits));
        galleryLightBox.refresh();

        const { height: cardHeight } = document
        .querySelector(".gallery")
        .firstElementChild.getBoundingClientRect();

        window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
});
        
    } catch (error) {
        Notiflix.Notify.failure(`We're sorry, but you've reached the end of search results`);
    }
}

function renderingGallery(img) {
    return img.map(({ webformatURL, tags, likes, views, comments, downloads, largeImageURL, }) => `
    <a class="gallery__link" href="${largeImageURL}">
        <div class="photo-card">
            <img src="${webformatURL}" "alt="${tags}" loading="lazy" class="gallery__image"/>
        
        <div class="info">
            <p class="info-item">
                <b class="info-item__statistic">❤️ ${likes}</b>
            </p>
            <p class="info-item">
                <b class="info-item__statistic">👀 ${views}</b>
            </p>
            <p class="info-item">
                <b class="info-item__statistic">💬 ${comments}</b>
            </p>
            <p class="info-item">
                <b class="info-item__statistic">💾 ${downloads}</b>
            </p>
        </div>
        </div>
    </a>`).join('');
}