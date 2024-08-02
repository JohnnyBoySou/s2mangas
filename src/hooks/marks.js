import AsyncStorage from '@react-native-async-storage/async-storage';

const getMarksData = async () => {
  try {
    const marksData = await AsyncStorage.getItem('marks');
    return marksData ? JSON.parse(marksData) : [];
  } catch (error) {
    console.error('Erro ao obter os dados de marcas:', error);
    return [];
  }
};

// Função para salvar dados de marcas
const saveMarksData = async (marks) => {
  try {
    await AsyncStorage.setItem('marks', JSON.stringify(marks));
  } catch (error) {
    console.error('Erro ao salvar os dados de marcas:', error);
  }
};

// Adicionar capítulo ao mangá
const addMarkToManga = async (mangaId, chapter) => {
  try {
    const marks = await getMarksData();
    const mangaIndex = marks.findIndex(manga => manga.id === mangaId);

    if (mangaIndex !== -1) {
      marks[mangaIndex].chapters.push(chapter);
    } else {
      marks.push({ id: mangaId, chapters: [chapter] });
    }

    await saveMarksData(marks);
  } catch (error) {
    console.error('Erro ao adicionar capítulo ao mangá:', error);
  }
};

// Remover capítulo do mangá
const removeMarkToManga = async (mangaId, chapterId) => {
  try {
    const marks = await getMarksData();
    const mangaIndex = marks.findIndex(manga => manga.id === mangaId);

    if (mangaIndex !== -1) {
      marks[mangaIndex].chapters = marks[mangaIndex].chapters.filter(chapter => chapter.id !== chapterId);

      if (marks[mangaIndex].chapters.length === 0) {
        marks.splice(mangaIndex, 1);
      }

      await saveMarksData(marks);
    } else {
      console.log('Mangá não encontrado na lista de marcas.');
    }
  } catch (error) {
    console.error('Erro ao remover capítulo do mangá:', error);
  }
};

// Alternar marca de capítulo
const toggleMarkToManga = async (mangaId, chapter) => {
  try {
    const marks = await getMarksData();
    const mangaIndex = marks.findIndex(manga => manga.id === mangaId);

    if (mangaIndex !== -1) {
      const chapterIndex = marks[mangaIndex].chapters.findIndex(c => c.id === chapter.id);

      if (chapterIndex !== -1) {
        await removeMarkToManga(mangaId, chapter.id);
        console.log('Capítulo removido.');
        return false;
      } else {
        await addMarkToManga(mangaId, chapter);
        console.log('Capítulo adicionado.');
        return true;
      }
    } else {
      await addMarkToManga(mangaId, chapter);
      console.log('Mangá e capítulo adicionados.');
      return true;
    }
  } catch (error) {
    console.error('Erro ao alternar marca do capítulo:', error);
    return false;
  }
};

// Verificar se o capítulo está marcado
const verifyMarkToManga = async (mangaId, chapterId) => {
  try {
    const marks = await getMarksData();
    const manga = marks.find(manga => manga.id === mangaId);

    if (manga) {
      return manga.chapters.some(chapter => chapter.id === chapterId);
    } else {
      return false;
    }
  } catch (error) {
    console.error('Erro ao verificar marca do capítulo:', error);
    return false;
  }
};

const listMarksToManga = async (mangaId) => {
  try {
    const marks = await getMarksData();
    const manga = marks.find(manga => manga.id === mangaId);

    if (manga) {
      return manga.chapters; // Retorna a lista de capítulos do mangá
    } else {
      console.log('Mangá não encontrado na lista de marcas.');
      return []; // Retorna uma lista vazia se o mangá não for encontrado
    }
  } catch (error) {
    console.error('Erro ao listar capítulos do mangá:', error);
    return []; // Retorna uma lista vazia em caso de erro
  }
};
export { addMarkToManga, removeMarkToManga, toggleMarkToManga, verifyMarkToManga, listMarksToManga };