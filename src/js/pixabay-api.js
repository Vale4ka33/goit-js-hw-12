import axios from 'axios';

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

axios.defaults.baseURL = "https://pixabay.com/api/";

export async function searchImage(searchInput = '', page = 1) {
    const API_KEY = "43261238-3a65c2c3cbe2ed873fa1b88e3";
try {
     const response = await axios.get('', {
        params: {
            q: searchInput,
            page,
            per_page: 15,
            orientation: 'portrait',
            //  orientation: 'horizontal',
            key: API_KEY,
            image_type: 'photo',
            safesearch: true
        }
     })
    return response.data;
} catch (error) {
    console.log(error);
    iziToast.error({
                    message: 'Sorry, there are no images matching your search query. Please try again!',
                    position: 'topRight',
                    backgroundColor: '#EF4040',
                    messageColor: '#fff',
                    
    });
    throw error;
}
}