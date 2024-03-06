import axios from 'axios';

export async function requestCollectionsBackground() {
    const res = await axios.get('https://www.s2mangas.com/api/shop/collections');
    return res.data;
}