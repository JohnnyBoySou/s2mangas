import AsyncStorage from '@react-native-async-storage/async-storage';

// Função para adicionar capítulos a um mangá específico
const addMarksToManga = async (id, chapter) => {
  try {
    // Obtém o objeto de preferences do AsyncStorage
    const preferencesData = await AsyncStorage.getItem('preferences');
    let preferences = preferencesData ? JSON.parse(preferencesData) : {};

    // Verifica se existe um array de marcas
    if (!preferences.marks) {
      preferences.marks = [];
    }

    // Procura o mangá pelo ID no array de marcas
    const mangaIndex = preferences.marks.findIndex(manga => manga.id === id);

    // Se o mangá for encontrado
    if (mangaIndex !== -1) {
      // Adiciona o capítulo ao array de capítulos do mangá
      preferences.marks[mangaIndex].chapters.push(chapter);

      // Salva as alterações de volta no AsyncStorage
      await AsyncStorage.setItem('preferences', JSON.stringify(preferences));
      console.log('Capítulo adicionado com sucesso!');
    } else {
      console.log('Mangá não encontrado na lista de marcas.');
    }
  } catch (error) {
    console.error('Erro ao adicionar capítulo ao mangá:', error);
  }
};

const listMarksToManga = async (id) => {
    try {
      // Obtém o objeto de preferences do AsyncStorage
      const preferencesData = await AsyncStorage.getItem('preferences');
      const preferences = preferencesData ? JSON.parse(preferencesData) : {};
  
      // Verifica se existe um array de marcas
      if (!preferences.marks) {
        console.log('Nenhuma marca encontrada.');
        return [];
      }
  
      // Procura o mangá pelo ID no array de marcas
      const manga = preferences.marks.find(manga => manga.id === id);
  
      // Se o mangá for encontrado
      if (manga) {
        console.log('Capítulos encontrados para o mangá:', manga.name);
        return manga.chapters;
      } else {
        console.log('Mangá não encontrado na lista de marcas.');
        return [];
      }
    } catch (error) {
      console.error('Erro ao listar capítulos do mangá:', error);
      return [];
    }
  };