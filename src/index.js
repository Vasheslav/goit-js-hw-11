import getImages from './js/async-function';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('.search-form');
const galleryList = document.querySelector('.gallery');
const btnEl = document.querySelector('.load-more');
const messageEl = document.querySelector('.message');

formEl.addEventListener('submit', onSearchForm);
btnEl.addEventListener('click', onClickLoadMore);

let page = 1;
let value = '';

function onSearchForm(e) {
  e.preventDefault();

  value = e.currentTarget.elements.searchQuery.value;

  initialValues();

  getImages(value, page)
    .then(listImage => {
      if (value === '') {
        return;
      }

      if (listImage.hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }

      if (listImage.hits.length >= 1) {
        Notiflix.Notify.info(`Hooray! We found ${listImage.totalHits} images.`);

        makeMarkupCard(listImage);
        makeSmoothScrolling();

        page++;

        if (listImage.hits.length >= 1 && listImage.hits.length < 40) {
          messageEl.classList.remove('message-hiden');
        } else if (listImage.hits.length === 40) {
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
  getImages(value, page)
    .then(listImage => {
      if (listImage.hits.length >= 1) {
        makeMarkupCard(listImage);
        makeSmoothScrolling();

        page++;

        if (listImage.hits.length >= 1 && listImage.hits.length < 40) {
          messageEl.classList.remove('message-hiden');
          btnEl.classList.add('hiden');
        } else if (listImage.hits.length === 40) {
          btnEl.classList.remove('hiden');
        }
      }
      lightbox.refresh();
      makeSmoothScrolling();
    })
    .catch(error => {
      console.log(error);
    });
}

function initialValues() {
  page = 1;
  galleryList.innerHTML = '';
  messageEl.classList.add('message-hiden');
  btnEl.classList.add('hiden');
}

function makeMarkupCard(listImage) {
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
}

const lightbox = new SimpleLightbox('.gallery a', {});

function makeSmoothScrolling() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    botton: cardHeight * -100,
    behavior: 'smooth',
  });
}
