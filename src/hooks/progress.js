import AsyncStorage from '@react-native-async-storage/async-storage';
const KEY = '@settings'
// Função para adicionar capítulos ao progresso do usuário
const addChaptersToManga = async (manga, newChapter) => { 
    try {
      // 1. Obtém o objeto de preferences do AsyncStorage
      const preferencesData = await AsyncStorage.getItem(KEY);
      let preferences = preferencesData ? JSON.parse(preferencesData) : {};
  
      // 2. Verifica se existe um array de progresso
      if (!preferences.progress) {
        preferences.progress = [];
      }
  
      // 3. Procura o mangá pelo ID no array de progresso
      const mangaIndex = preferences.progress.findIndex(item => item.id === manga.id);
  
      // Se o mangá for encontrado
      if (mangaIndex !== -1) {
        // 4. Adiciona o capítulo enviado ao campo "chapters" do mangá existente, caso não existam
        if (!preferences.progress[mangaIndex].chapters.includes(newChapter)) {
            preferences.progress[mangaIndex].chapters.push(newChapter);
          }
      } else {
        // 6. Se o mangá não for encontrado, adiciona-o à lista de progresso com o capítulo fornecido
        console.log('Mangá não encontrado na lista de progresso. Adicionando...')
        const newManga = {
          ...manga,
          chapters: [newChapter]
        };
        preferences.progress.push(newManga);
      }
  
      // 5. Salva as alterações de volta no AsyncStorage
      await AsyncStorage.setItem(KEY, JSON.stringify(preferences));
      
     const test = await AsyncStorage.getItem(KEY);
      console.log('Capítulos adicionados ao progresso com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar capítulos ao progresso:', error);
    }
  };


// Função para listar os capítulos de um mangá específico
const listChaptersToManga = async (id) => {
    try {
      // Obtém o objeto de preferences do AsyncStorage
      const preferencesData = await AsyncStorage.getItem(KEY);
      const preferences = preferencesData ? JSON.parse(preferencesData) : {};
  
      // Verifica se existe um array de progresso
      if (!preferences.progress) {
        console.log('Nenhum mangá em progresso encontrado.');
        return [];
      }
  
      // Procura o mangá pelo ID no array de progresso
      const manga = preferences.progress.find(manga => manga.id === id);
  
      // Se o mangá for encontrado
      if (manga) {
        console.log('Capítulos encontrados para o mangá:', manga.name);
        return manga.chapters;
      } else {
        console.log('Mangá não encontrado na lista de progresso.');
        return [];
      }
    } catch (error) {
      console.error('Erro ao listar capítulos do mangá:', error);
      return [];
    }
  };

const listLastManga = async () => {
    try {
        const preferencesData = await AsyncStorage.getItem(KEY);
        const preferences = preferencesData ? JSON.parse(preferencesData) : {};
        if (!preferences.progress) {
            console.log('Nenhum mangá em progresso encontrado.');
            return [];
        }
        const lastManga = preferences.progress[preferences.progress.length - 1];
        return lastManga;
    } catch (error) {
        console.error('Erro ao listar último mangá:', error);
        return [];
    }
}

const excludeMangaProgress = async (id) => {
    try {
        const preferencesData = await AsyncStorage.getItem(KEY);
        const preferences = preferencesData ? JSON.parse(preferencesData) : {};
        if (!preferences.progress) {
            console.log('Nenhum mangá em progresso encontrado.');
            return [];
        }
        const mangaIndex = preferences.progress.findIndex(item => item.id === id);
        if (mangaIndex !== -1) {
            preferences.progress.splice(mangaIndex, 1);
        }
        await AsyncStorage.setItem(KEY, JSON.stringify(preferences));
        console.log('Mangá excluído do progresso com sucesso!');
        return true
    } catch (error) {
        console.error('Erro ao excluir mangá do progresso:', error);
    }
}


  export { addChaptersToManga, listChaptersToManga, listLastManga, excludeMangaProgress };