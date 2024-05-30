import axios from "axios";
import cheerio from 'react-native-cheerio';
const headers = {'Accept': "application/json",} 
const API_URL = "https://lermanga.org/"

export default async function requestNews() {
  try {
    const response = await axios.get(API_URL,  { headers: {'Accept': "text/html", 'Access-Control-Allow-Origin': '*'} });
    const mangaData = clearNews(response?.data);
    return { mangas: mangaData}
  } catch (error) {
    console.log(error)
    return { mangas: []}
  }
}

export function clearNews(html) {
  const $ = cheerio.load(html);
  const bss = $('.innercontent .capitulo_recentehome')
  const mangas = [];
  bss.each((index, element) => {
    const manga = {}
    const bs = $(element);
    const uid = bs.find('.boxAnimeSobreCap h3 a').attr('href')
    manga.id = uid.split('/').reverse()[1];
    const links = bs.find('.fdi-item.fdi-cate a');
    const resultArray = links.map((index, element) => $(element).text()).get();
    const chapterLinks = bs.find('.lancamento-list li a');
    const chapterNumbers = chapterLinks.map((index, element) => $(element).text()).get();
    manga.newchapters = chapterNumbers
    manga.categories = resultArray
    manga.name = bs.find('h3').text()
    manga.chapters = bs.find('.lancamento-list').children().first().text()
    manga.capa = bs.find('.capaMangaCap img').attr('data-src');
    manga.release_date = bs.find('.boxAnimeSobreCap small').text().trim()
    manga.status = 'Em lançamento'
    mangas.push(manga);
  });
  return mangas
}

const manga = 
  {
    id: 'ea4b263d-f512-4935-b2ec-6b2708dd5b38',
    name: "A Hedgehog Hurting Someone Unknowingl",
    type: 'manga',
    desc: '',
    capa: '',
    status: 'Completo',
    adult: false,
    year: 2022,
    categories: ['Comédia', 'Romance', 'Slice of Life'],
    chapters: 1,
    createdAt: "2022-06-02T08:31:26+00:00",
    updatedAt: "2023-12-06T02:47:31+00:00",
    languages: ['pt-br', 'en', 'jp'],
    lastChapter: {id: 'ea4b263d-f512-4935-b2ec-6b2708dd5b38', number: 1, title: 'Capítulo 1', release_date: '2022-06-02T08:31:26+00:00'},

  }
