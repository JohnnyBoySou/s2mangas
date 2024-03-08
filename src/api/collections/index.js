import AsyncStorage from "@react-native-async-storage/async-storage";

export const createCollection = async (collection) => {
    try {
      // Buscar as coleções existentes
      const collectionsJSON = await AsyncStorage.getItem('@mangas_collections');
      const existingCollections = collectionsJSON ? JSON.parse(collectionsJSON) : [];
      
      
      const collectionExists = existingCollections.some(existingCollection => existingCollection.name === collection.name);
      if (collectionExists) {
        return false;
      }
      // Adicionar a nova coleção à lista
      existingCollections.push(collection);
  
      // Salvar a lista atualizada no AsyncStorage
      await AsyncStorage.setItem('@mangas_collections', JSON.stringify(existingCollections));
      
      console.log('Coleção criada com sucesso!');
      return true; // Indicando que a criação foi bem-sucedida
    } catch (error) {
      console.error('Erro ao criar coleção:', error);
      return false; // Indicando que a criação falhou
    }
  };
  

  export const addMangasToCollection = async (collectionID, mangaArray) => {
    try {
      // Buscar as coleções existentes
      const collectionsJSON = await AsyncStorage.getItem('@mangas_collections');
      const existingCollections = collectionsJSON ? JSON.parse(collectionsJSON) : [];
  
      // Encontrar a coleção alvo
      const targetCollectionIndex = existingCollections.findIndex(collection => collection.id === collectionID);
      if (targetCollectionIndex === -1) {
        console.error('Coleção não encontrada.');
        return;
      }
  
      const targetCollection = existingCollections[targetCollectionIndex];
      // Verificar se a mangaId já está na coleção
      if (!targetCollection.mangas.some(manga => manga.id === mangaArray.id)) {
        targetCollection.mangas.push(mangaArray);
        
        // Salvar a lista atualizada no AsyncStorage
        await AsyncStorage.setItem('@mangas_collections', JSON.stringify(existingCollections));
        console.log('Mangá adicionado à coleção com sucesso!');
        return true;
      } else {
        console.log('Mangá já está na coleção.');
        return false;
      }
    } catch (error) {
      console.error('Erro ao adicionar mangá à coleção:', error);
    }
  };
  
  export const listCollections = async () => {
    try {
      // Buscar as coleções existentes
      const collectionNameToRemove = 'Completos';
      const collectionsJSON = await AsyncStorage.getItem('@mangas_collections');
      let existingCollections = collectionsJSON ? JSON.parse(collectionsJSON) : [];
      return existingCollections;
    } catch (error) {
      console.error('Erro ao listar coleções:', error);
      return [];
    }
  };
  

  export const listMangasInCollection = async (collectionName) => {
    try {
      const collectionsJSON = await AsyncStorage.getItem('@mangas_collections');
      const existingCollections = collectionsJSON ? JSON.parse(collectionsJSON) : [];
  
      const targetCollection = existingCollections.find(collection => collection.name === collectionName);
      if (!targetCollection) {
        console.error('Coleção não encontrada.');
        return [];
      }
  
      return targetCollection.mangas_ids;
    } catch (error) {
      console.error('Erro ao listar mangás da coleção:', error);
      return [];
    }
  };
  

 export const getCollection = async (collectionId) => {
    try {
      // Buscar as coleções existentes
      const collectionsJSON = await AsyncStorage.getItem('@mangas_collections');
      const existingCollections = collectionsJSON ? JSON.parse(collectionsJSON) : [];
  
      // Encontrar a coleção alvo
      const targetCollection = existingCollections.find(collection => collection.id === collectionId);
      if (!targetCollection) {
        console.error('Coleção não encontrada.');
        return null;
      }
      return targetCollection;
    } catch (error) {
      console.error('Erro ao obter dados da coleção:', error);
      return null;
    }
  };
  

export const editCollection = async (collectionId, updatedFields) => {
  try {
    // Buscar as coleções existentes
    const collectionsJSON = await AsyncStorage.getItem('@mangas_collections');
    const existingCollections = collectionsJSON ? JSON.parse(collectionsJSON) : [];

    // Encontrar a coleção pelo id
    const targetCollectionIndex = existingCollections.findIndex(collection => collection.id === collectionId);
    if (targetCollectionIndex === -1) {
    console.error('Coleção não encontrada.');
    return false;
    }

    // Atualizar os campos da coleção
    const targetCollection = existingCollections[targetCollectionIndex];
    Object.assign(targetCollection, updatedFields);

    // Salvar a lista atualizada no AsyncStorage
    await AsyncStorage.setItem('@mangas_collections', JSON.stringify(existingCollections));

    console.log('Coleção atualizada com sucesso.');
    return true;
  } catch (error) {
    console.error('Erro ao atualizar coleção:', error);
    return false;
  }
};


  export const removeCollection = async (collectionId) => {
    try {
      // Buscar as coleções existentes
      const collectionsJSON = await AsyncStorage.getItem('@mangas_collections');
      const existingCollections = collectionsJSON ? JSON.parse(collectionsJSON) : [];

      // Encontrar a coleção alvo
      const targetCollectionIndex = existingCollections.findIndex(collection => collection.id === collectionId);
      if (targetCollectionIndex === -1) {
        console.error('Coleção não encontrada.');
        return false;
      }

      // Remover a coleção da lista
      existingCollections.splice(targetCollectionIndex, 1);

      // Salvar a lista atualizada no AsyncStorage
      await AsyncStorage.setItem('@mangas_collections', JSON.stringify(existingCollections));

      console.log('Coleção removida com sucesso.');
      return true;
    } catch (error) {
      console.error('Erro ao remover coleção:', error);
      return false;
    }
  };


  export const isMangaInCollection = async (collectionName, mangaId) => {
    try {
      // Buscar as coleções existentes
      const collectionsJSON = await AsyncStorage.getItem('@mangas_collections');
      const existingCollections = collectionsJSON ? JSON.parse(collectionsJSON) : [];
  
      // Encontrar a coleção alvo
      const targetCollection = existingCollections.find(collection => collection.name === collectionName);
      if (!targetCollection) {
        console.error('Coleção não encontrada.');
        return false;
      }
  
      // Verificar se a mangaId está na coleção
      const isMangaPresent = targetCollection.mangas_ids.includes(mangaId);
      return isMangaPresent;
    } catch (error) {
      console.error('Erro ao verificar se o mangá está na coleção:', error);
      return false;
    }
  };
  

  export const removeMangaInCollection = async (collectionId, mangaId) => {
    try {
      // Buscar as coleções existentes
      const collectionsJSON = await AsyncStorage.getItem('@mangas_collections');
      const existingCollections = collectionsJSON ? JSON.parse(collectionsJSON) : [];
  
      // Encontrar a coleção alvo
      const targetCollectionIndex = existingCollections.findIndex(collection => collection.id === collectionId);
      if (targetCollectionIndex === -1) {
        console.error('Coleção não encontrada.');
        return false;
      }
  
      const targetCollection = existingCollections[targetCollectionIndex];
      console.log(targetCollection.mangas)

      const mangaIndex = targetCollection.mangas.findIndex(manga => manga.id === mangaId);

      if (mangaIndex !== -1) {
        targetCollection.mangas.splice(mangaIndex, 1);
  
        // Salvar a lista atualizada no AsyncStorage
        await AsyncStorage.setItem('@mangas_collections', JSON.stringify(existingCollections));
        console.log('Mangá removido da coleção com sucesso.');
        return true;
      } else {
        console.log('Mangá não encontrado na coleção.');
        return false;
      }
    } catch (error) {
      console.error('Erro ao remover mangá da coleção:', error);
      return false;
    }
  };

  export const removeAllCollections = async () => {
    try {
      // Limpar todas as coleções
      await AsyncStorage.removeItem('@mangas_collections');
      console.log('Todas as coleções foram removidas com sucesso.');
    } catch (error) {
      console.error('Erro ao remover todas as coleções:', error);
    }
  }
  