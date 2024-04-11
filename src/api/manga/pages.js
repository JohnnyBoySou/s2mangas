
  import axios from "axios";

  export default async function requestPages(chapter, id) {
      //possiveis formatos de link;
      // 1 = https://img.lermanga.org/S/saotome-shimai-wa-manga-no-tame-nara/capitulo-27/02.jpg
      // 2 =  https://img.lermanga.org/S/saotome-shimai-wa-manga-no-tame-nara/capitulo-27/2.png
      // 3 =  https://img.lermanga.org/S/saotome-shimai-wa-manga-no-tame-nara/capitulo-01/2.png
      // 4 =  https://img.lermanga.org/S/saotome-shimai-wa-manga-no-tame-nara/capitulo-01/02.png
      // 5 =  https://img.lermanga.org/S/saotome-shimai-wa-manga-no-tame-nara/capitulo-1/02.png
      // 6 =  https://img.lermanga.org/S/saotome-shimai-wa-manga-no-tame-nara/capitulo-1/2.png

      const baseURL = `https://img.lermanga.org/${id.charAt(0).toUpperCase()}/${id}/capitulo-${chapter}/`;
      const formats = ['jpg', 'jpeg', 'png', 'webp'];
  
      // Adicionando todas as extensões possíveis
      const possibleExtensions = ['jpg', 'jpeg', 'png'];
      const possibleFormats = [];
      for (const ext1 of possibleExtensions) {
          for (const ext2 of possibleExtensions) {
              possibleFormats.push(`${ext1}.${ext2}`);
          }
      }
      formats.push(...possibleFormats);
  
      const returnData = {
          link: '',
          chapterNumber: chapter,
          manga: id,
          images: [],
          format: '',
          pages: 0,
          nextChapter: { number: parseInt(chapter, 10) + 1 },
          previousChapter: { number: parseInt(chapter, 10) >= 2 ? parseInt(chapter, 10) - 1 : 1 }
      };
  
      try {
          let foundPage = false;
          let selectedFormat = '';
  
          for (const format of formats) {
              for (let pageIndex = 1; pageIndex <= 2; pageIndex++) {
                  const link = `${baseURL}${pageIndex}.${format}`;
  
                  try {
                      await axios.get(link);
                      foundPage = true;
                      selectedFormat = format;
                      break;
                  } catch (error) {
                      if (pageIndex === 2) {
                          console.error('Nenhuma página encontrada.');
                          return returnData;
                      }
                  }
              }
              if (foundPage) break;
          }
  
          if (foundPage && selectedFormat) {
              const urls = [];
              let pageIndex = 1;
  
              while (true) {
                  const link = `${baseURL}${pageIndex}.${selectedFormat}`;
  
                  try {
                      await axios.get(link);
                      urls.push(link);
                      pageIndex++;
                  } catch (error) {
                      break;
                  }
              }
  
              returnData.format = selectedFormat;
              returnData.pages = urls.length;
              returnData.images = urls;
              returnData.link = `${baseURL}${pageIndex}.${selectedFormat}`;
          }
  
          console.error('Nenhuma página encontrada.');
          return returnData;
      } catch (error) {
          console.error(error.message);
          return error.message;
      }
  }