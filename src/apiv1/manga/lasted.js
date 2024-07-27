import axios from "axios";

export default async function requestLasted() {
  try {
    const response = await axios.get('https://www.s2mangas.com/api/publish/lasted',  { headers: {'Accept': "text/html", 'Access-Control-Allow-Origin': '*'} });
    return response.data
  } catch (error) {
    return error.message;
  }
}
