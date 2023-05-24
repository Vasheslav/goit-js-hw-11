const axios = require('axios').default;

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '34228603-b891bcae5effe4f7195da3207';

export default async function getImages(value, page) {
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
  const listImage = response.data;
  return listImage;
}
