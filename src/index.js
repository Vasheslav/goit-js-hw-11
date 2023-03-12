import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
// import markupCard from './partials/templates/markupCards.hbs';
import 'simplelightbox/dist/simple-lightbox.min.css';
const axios = require('axios').default;

const formEl = document.querySelector('.search-form');
const galleryList = document.querySelector('.gallery');
const btnEl = document.querySelector('.load-more');
const messageEl = document.querySelector('.message');

formEl.addEventListener('submit', onSearchForm);
btnEl.addEventListener('click', onClickLoadMore);

let page = 1;
let value = '';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '34228603-b891bcae5effe4f7195da3207';

function makeMarkupCards(arr) {
  const imageEl = arr.map(el => markupCard(el).join(''));
  galleryList.insertAdjacentHTML('beforeend', imageEl);
}

async function getImages(value) {
  try {
    const response = await axios.get(
      `${BASE_URL}?key=${KEY}&q=${value}&page=${page}`,
      {
        params: {
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
          per_page: 40,
        },
      }
    );
    page += 1;
    const listImage = response.data;
    return listImage;
  } catch (error) {
    console.error(error);
  }
}

function onSearchForm(e) {
  e.preventDefault();

  value = e.currentTarget.elements.searchQuery.value;
  page = 1;
  galleryList.innerHTML = '';

  getImages(value)
    .then(listImage => {
      if (listImage.hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }

      if (listImage.hits.length >= 1) {
        Notiflix.Notify.info(`Hooray! We found ${listImage.totalHits} images.`);

        // makeMarkupCards(listImage.hits);
        const imageEl = listImage.hits
          .map(
            el =>
              `<div class="photo-card">
                  <a href="${el.largeImageURL}" download>
                    <img src="${el.webformatURL}" alt="${el.tags}" loading="lazy" />
                  </a>
          <div class="info">
            <p class="info-item">
              <b>Likes:</b>
              ${el.likes}
            </p>
            <p class="info-item">
              <b>Views:</b>
              ${el.views}
            </p>
            <p class="info-item">
              <b>Comments:</b>
              ${el.comments}
            </p>
            <p class="info-item">
              <b>Downloads:</b>
              ${el.downloads}
            </p>
          </div>
        </div>`
          )
          .join('');
        galleryList.insertAdjacentHTML('beforeend', imageEl);

        if (listImage.hits.length >= 1 && listImage.hits.length < 40) {
          messageEl.classList.remove('message-hiden');
        } else if (listImage.hits.length == 40) {
          btnEl.classList.remove('hiden');
        }
      }
      lightbox.refresh();
    })
    .catch(error => {
      console.log(error);
    });
}

function onClickLoadMore() {
  getImages(value)
    .then(listImage => {
      if (listImage.hits.length >= 1) {
        const imageEl = listImage.hits
          .map(
            el =>
              `<div class="photo-card">
        <a href="${el.largeImageURL}">
        <img src="${el.webformatURL}" alt="${el.tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item">
            <b>Likes:</b>
            ${el.likes}
          </p>
          <p class="info-item">
            <b>Views:</b>
            ${el.views}
          </p>
          <p class="info-item">
            <b>Comments:</b>
            ${el.comments}
          </p>
          <p class="info-item">
            <b>Downloads:</b>
            ${el.downloads}
          </p>
        </div>
      </div>`
          )
          .join('');
        galleryList.insertAdjacentHTML('beforeend', imageEl);

        if (listImage.hits.length >= 0 && listImage.hits.length < 40) {
          const message =
            "We're sorry, but you've reached the end of search results.";
          galleryList.insertAdjacentHTML('afterend', message);
        }
      }
      lightbox.refresh();
    })
    .catch(error => {
      console.log(error);
    });
}

const lightbox = new SimpleLightbox('.gallery a', {});
