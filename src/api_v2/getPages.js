import axios from 'axios';

const baseUrl = 'https://api.mangadex.org';

export async function getPages(chapterID = '6abbf820-dc5b-4e50-8335-af06e08f8cbc') {
  try {
      const resp = await axios({
          method: 'GET',
          url: `${baseUrl}/at-home/server/${chapterID}`,
      });

      const { data } = resp; // Obtenha apenas os dados da resposta
      const chapterHash = data.chapter?.hash; // Obtenha a chave de hash do capítulo
      const pages = transformPage(chapterHash, data.chapter?.data); // Use transformPage para obter as URLs das páginas

      return pages;
  } catch (error) {
      console.error(error);
      return null;
  } finally {
      console.log('Finalizou');
  }
}

const transformPage = (chapterHash, pageData, baseUrl = 'https://uploads.mangadex.org') => {
    if (!chapterHash || !pageData || !pageData.length) {
        throw new Error('Invalid chapter data');
    }

    return pageData.map(page => {
        return `${baseUrl}/data/${chapterHash}/${page}`;
    });
};



