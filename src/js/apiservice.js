import axios from 'axios';

// const URL = 'https://pixabay.com/api/';
// const API_KEY = '34997553-a7b2d36a26db158f740bb35fd';

// export default class NewsApiService {
//   constructor() {
//     this.searchQuery = '';
//     this.page = 1;
//     this.loadedHits = 0;
//   }

//   async fetchImages() {
//     const searchParams = new URLSearchParams({
//       key: API_KEY,
//       q: this.searchQuery,
//       image_type: 'photo',
//       orientation: 'horizontal',
//       safesearch: true,
//       page: this.page,
//       per_page: 40,
//     });

//     const url = `${URL}?${searchParams}`;

//     try {
//       const response = await axios.get(url);
//       this.incrementPage();

//       return response.data;
//     } catch (error) {
//       console.warn(`${error}`);
//     }
//   }

//   incrementLoadedHits(hits) {
//     this.loadedHits += hits.length;
//   }

//   resetLoadedHits() {
//     this.loadedHits = 0;
//   }

//   incrementPage() {
//     this.page += 1;
//   }

//   resetPage() {
//     this.page = 1;
//   }

//   get query() {
//     return this.searchQuery;
//   }

//   set query(newQuery) {
//     this.searchQuery = newQuery;
//   }
// }
export default class NewsApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.PER_PAGE = 40;
  }
  async fetchGallery() {
    const axiosOptions = {
      method: 'get',
      url: 'https://pixabay.com/api/',
      params: {
        key: '34997553-a7b2d36a26db158f740bb35fd',
        q: `${this.searchQuery}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: `${this.page}`,
        per_page: `${this.PER_PAGE}`,
      },
    };
    try {
      const response = await axios(axiosOptions);

      const data = response.data;

      this.incrementPage();
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  resetEndOfHits() {
    this.endOfHits = false;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}