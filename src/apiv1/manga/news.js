import axios from "axios";

export default async function requestNews() {
  try {
    const response = await axios.get('https://www.s2mangas.com/api/publish/news',  { headers: {'Accept': "text/html", 'Access-Control-Allow-Origin': '*'} });
    return response.data
  } catch (error) {
    console.log(error)
    return { mangas: []}
  }
}
