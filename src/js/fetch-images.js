// import axios from 'axios';

// const API_URL = 'https://pixabay.com/api/';
// const API_KEY = '34997553-a7b2d36a26db158f740bb35fd';

// export default class NewsApiImages {
//   constructor() {
//     this.searchQuery = '';
//     this.page = 1;
//     this.per_page = 40;
//     this.totalPages = 0;
//   }

//   async getImages() {
//     const searchParams = new URLSearchParams({
//       key: '34997553-a7b2d36a26db158f740bb35fd',
//       q: `${this.searchQuery}`,
//       image_type: 'photo',
//       orientation: 'horizontal',
//       safesearch: true,
//       per_page: `${this.per_page}`,
//       page: `${this.page}`,
//     });

//     const { data } = await axios.get(`${BASE_URL}?${searchParams}`);
//     return data;
//   }

//   incrementPage() {
//     return (this.page += 1);
//   }

//   resetPage() {
//     return (this.page = 1);
//   }

//   setTotal(total) {
//     return (this.totalPages = total);
//   }

//   resetTotalPage() {
//     return (this.totalPages = 0);
//   }

//   hasMoreImages() {
//     return this.page === Math.ceil(this.totalPages / this.per_page);
//   }
// }

// import axios from 'axios';
// export { fetchImages };

// axios.defaults.baseURL = 'https://pixabay.com/api/';
// const KEY = '34997553-a7b2d36a26db158f740bb35fd';

// async function fetchImages(query, page, perPage) {
//   const response = await axios.get(
//     `?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`,
//   );
//   return response;
// }
import axios from "axios";

export class PixabayAPI {
    #BASE_URL = `https://pixabay.com/api/`;
    #API_KEY = `34997553-a7b2d36a26db158f740bb35fd`;

    #BASE_SEARCH_PARAMS = {
        image_type: `photo`,
        orientation: `horizontal`,
        safesearch: `true`,
        per_page: 40,
    }

    get perPage() {
        return this.#BASE_SEARCH_PARAMS.per_page;
    }

    q = null;
    page = 1;
    
    fetchPhotos() {
        return axios.get(`${this.#BASE_URL}?key=${this.#API_KEY}&`,{
            params: {
                q: this.q,
                ...this.#BASE_SEARCH_PARAMS,
                page: this.page,
        },
    });
    }
}