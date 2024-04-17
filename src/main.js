import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import { searchImage } from './js/pixabay-api';
import { createMarkup} from './js/render-funcions';

const form = document.querySelector('.form');
const imgList = document.querySelector('.img-list');
const loader = document.querySelector('.loader');
const loadBtn = document.querySelector('.load-more');
const lightbox = new SimpleLightbox('.img-list a', {
        captionsData: 'alt',
        captionPosition: 'bottom',
        captionDelay: 250,
        animationSpeed: 250,
        animationSlide: true
    });

form.addEventListener('submit', submitForm);
loadBtn.addEventListener('click', loadClick);
let page = 1;
let searchInput = null;


async function submitForm(event) {
    event.preventDefault();
    searchInput = event.currentTarget.elements.search.value.trim();
    page = 1;

    try {
         loader.classList.add('loader--visible');
        const response = await searchImage(searchInput, page);
        
        if (response.hits.length === 0) {
            iziToast.error({
                message: 'Sorry, there are no images matching your search query. Please try again!',
                position: 'topRight',
                backgroundColor: '#EF4040',
                messageColor: '#fff',
            });
            imgList.innerHTML = '';
            loadBtn.classList.add('is-hidden');
        } else {
            imgList.innerHTML = createMarkup(response.hits);
            if (response.totalHits > 15) {
                loadBtn.classList.remove('is-hidden');
            } else {
                loadBtn.classList.add('is-hidden');
            }
            lightbox.refresh();
        }

    } catch (error) {
        console.log(error.message);
    } finally {
        loader.classList.remove('loader--visible');
        event.target.reset();
    }
}

async function loadClick() {
    page += 1;
    
    try {
        loader.classList.add('loader--visible');
        const response = await searchImage(searchInput, page);
        
        imgList.insertAdjacentHTML('beforeend', createMarkup(response.hits));
        lightbox.refresh();

        // Функція для скролу
        const { height: cardHeight } = document
            .querySelector('.img-list')
            .firstElementChild.getBoundingClientRect();

        window.scrollBy({
            top: cardHeight * 2,
            behavior: 'smooth',
        });
        
        const lastPage = Math.ceil(response.totalHits / 15);
        if (lastPage === page) {
            loadBtn.classList.add('is-hidden');
            iziToast.info({
                message: "We're sorry, but you've reached the end of search results",
            });
        }
    } catch (error) {
        console.log(error.message);
    } finally {
        loader.classList.remove('loader--visible');
    }
}