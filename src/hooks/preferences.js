import AsyncStorage from "@react-native-async-storage/async-storage";

async function getPreferences() {
  try {
    const preferences = JSON.parse(await AsyncStorage.getItem("@settings")) || [];
    return preferences;
  } catch (error) {
    console.error("Error getting preferences:", error);
    return [];
  }
}

async function createPreferences(preferences) {
  try {
    await AsyncStorage.setItem("@settings", JSON.stringify(preferences));
    return true;
  } catch (error) {
    console.error("Error creating preference:", error);
    return false;
  }
}


async function editPreferences(updatedPreferences) {
  try {
    const preferences = { ...getPreferences(), ...updatedPreferences };
    await AsyncStorage.setItem("@settings", JSON.stringify(preferences));
    return true;
  } catch (error) {
    console.error("Error editing preferences:", error);
    return false;
  }
}

async function excludePreferences() {
  try {
    await AsyncStorage.removeItem("@settings");
    return true;
  } catch (error) {
    console.error("Error excluding preference ", error);
    return false;
  }
}

async function addLike(array) {
  try {
    const preferences = await getPreferences();
    if (!preferences.likes) {
      preferences.likes = [];
    }
    preferences.likes = preferences.likes.concat(array);
    await editPreferences(preferences);
    return true;
  } catch (error) {
    console.error("Error adding likes array:", error);
    return false;
  }
}

async function verifyLiked(id) {
  try {
    const preferences = await getPreferences();
    console.log(preferences.likes && preferences.likes.some((manga) => manga.id === id))
    return preferences.likes && preferences.likes.some((manga) => manga.id === id);
  } catch (error) {
    console.error("Error verifying liked manga:", error);
    return false;
  }
}

async function removeLike(id) {
  try {
    const preferences = await getPreferences();
    if (!preferences.likes) {
      preferences.likes = [];
    }
    preferences.likes = preferences.likes.filter((manga) => manga.id !== id);
    await editPreferences(preferences);
    return true;
  } catch (error) {
    console.error("Error removing like:", error);
    return false;
  }
}



async function addComplete(manga) {
  try {
    const preferences = await getPreferences();
    if (!preferences.complete) {
      preferences.complete = [];
    }
    preferences.complete.push(manga);
    await editPreferences(preferences);
    return true;
  } catch (error) {
    console.error("Error adding complete manga:", error);
    return false;
  }
}

async function verifyComplete(id) {
  try {
    const preferences = await getPreferences();
    return  preferences.complete && preferences.complete.some((manga) => manga.id === id);
  } catch (error) {
    console.error("Error verifying complete manga:", error);
    return false;
  }
}

async function removeComplete(id) {
  try {
    const preferences = await getPreferences();
    if (!preferences.complete) {
      preferences.complete = [];
    }
    preferences.complete = preferences.complete.filter((manga) => manga.id !== id);
    await editPreferences(preferences);
    return true;
  } catch (error) {
    console.error("Error removing complete manga:", error);
    return false;
  }
}



async function addFollow(manga) {
  try {
    const preferences = await getPreferences();
    if (!preferences.follow) {
      preferences.follow = [];
    }
    preferences.follow.push(manga);
    await editPreferences(preferences);
    return true;
  } catch (error) {
    console.error("Error adding follow manga:", error);
    return false;
  }
}

async function verifyFollow(id) {
  try {
    const preferences = await getPreferences();
    return  preferences.follow && preferences.follow.some((manga) => manga.id === id);
  } catch (error) {
    console.error("Error verifying follow manga:", error);
    return false;
  }
}

async function removeFollow(id) {
  try {
    const preferences = await getPreferences();
    if (!preferences.follow) {
      preferences.follow = [];
    }
    preferences.follow = preferences.follow.filter((manga) => manga.id !== id);
    await editPreferences(preferences);
    return true;
  } catch (error) {
    console.error("Error removing follow manga:", error);
    return false;
  }
}



export {
  createPreferences,
  getPreferences,
  editPreferences,
  excludePreferences, 
  
  addLike,
  removeLike,
  verifyLiked,

  addComplete,
  removeComplete,
  verifyComplete,

  addFollow,
  removeFollow,
  verifyFollow, 
  
  addMark,
  removeMark,
  getMarks,
 
};






















































function likeManga(manga) {
  try {
    const preferences = getPreferences();
    if (!preferences.likes.some((item) => item.id === manga.id)) {
      preferences.likes.push(manga);
      editPreferences(preferences);
    }
    return true;
  } catch (error) {
    console.error("Error liking manga:", error);
    return false;
  }
}

function verifyLikedsd(id) {
  try {
    const preferences = getPreferences();
    return preferences.likes.some((manga) => manga.id === id);
  } catch (error) {
    console.error("Error verifying liked manga:", error);
    return false;
  }
}

function dislikeManga(id) {
  try {
    const preferences = getPreferences();
    preferences.likes = preferences.likes.filter((manga) => manga.id !== id);
    editPreferences(preferences);
    return true;
  } catch (error) {
    console.error("Error disliking manga:", error);
    return false;
  }
}

function dislikeAllManga() {
  try {
    const preferences = getPreferences();
    preferences.likes = [];
    editPreferences(preferences);
    return true;
  } catch (error) {
    console.error("Error disliking all manga:", error);
    return false;
  }
}

function addMark(manga, chapter) {
  try {
    const preferences = getPreferences();
    console.log(preferences.marks);
    if (!preferences.marks) {
      preferences.marks = [];
    }
    const existingMark = preferences.marks.find(
      (mark) => mark.manga.id === manga.id
    );
    if (existingMark) {
      if (!existingMark.chapters.includes(chapter)) {
        existingMark.chapters.push(chapter);
      }
    } else {
      // preferences.marks.push({ manga});
    }

    editPreferences(preferences);
    return true;
  } catch (error) {
    console.error("Error adding follow:", error);
    return false;
  }
}

function removeMark(manga, chapterToRemove) {
  try {
    const preferences = getPreferences();
    preferences.marks = preferences.marks.map((mark) => {
      if (mark.manga.id === manga.id) {
        mark.chapter = mark.chapter.filter(
          (chapter) => chapter !== chapterToRemove
        );
      }
      return mark;
    });
    editPreferences(preferences);
    return true;
  } catch (error) {
    console.error("Error removing follow:", error);
    return false;
  }
}

function getMarks(manga) {
  try {
    const preferences = getPreferences();
    const marks = preferences.marks.filter((mark) => mark.manga === manga);
    return marks.map((mark) => mark.chapter);
  } catch (error) {
    console.error("Error getting marks:", error);
    return [];
  }
}
