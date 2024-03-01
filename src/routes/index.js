
import React, { useState, useEffect, useContext} from 'react';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { createStackNavigator, TransitionPresets, } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import HomePage from '../pages/home';
import MangalistDetailsPage from '../pages/mangalists/details';
import MangaDetailsPage from '../pages/manga/details';
import MangaPages from '../pages/manga/pages';
import NovidadesPage from '../pages/novidades';
import Onboarding from '../pages/onboarding/index';
import ContinuePage from '../pages/continue';
import PreferencesPage from './../pages/preferences/index';

SplashScreen.preventAutoHideAsync();
const Stack = createStackNavigator();

export default function Router() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  useEffect(() => {
    async function loadFonts() {
      try{
        await Font.loadAsync({
          Font_Book: require('../assets/fonts/Circular_Book.ttf'),
          Font_Medium: require('../assets/fonts/Circular_Medium.ttf'),
          Font_Bold: require('../assets/fonts/Circular_Bold.ttf'),
          Font_Black: require('../assets/fonts/Circular_Black.ttf'),
        });}
      catch(e){console.log(e)}
      finally{setFontsLoaded(true)}
    }
    loadFonts();
  }, []);

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {
    });
  }, []);

  if (!fontsLoaded) {
    return null;
  }
  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown: false,}} >
            <Stack.Screen name="Home" component={HomePage} options={{...TransitionPresets.ModalSlideFromBottomIOS  , }}/>
            <Stack.Screen name="Novidades" component={NovidadesPage} options={{...TransitionPresets.ModalSlideFromBottomIOS  , }}/>
            <Stack.Screen name="MangalistDetails" component={MangalistDetailsPage} options={{...TransitionPresets.SlideFromRightIOS   , }}/>
            <Stack.Screen name="MangaDetails" component={MangaDetailsPage} options={{...TransitionPresets.SlideFromRightIOS   , }}/>
            <Stack.Screen name="MangaPages" component={MangaPages} options={{...TransitionPresets.SlideFromRightIOS   , }}/>
            <Stack.Screen name="Onboarding" component={Onboarding} options={{...TransitionPresets.ModalSlideFromBottomIOS  , }}/>
            <Stack.Screen name="Continue" component={ContinuePage} options={{...TransitionPresets.ModalSlideFromBottomIOS  , }}/>
            <Stack.Screen name="Preferences" component={PreferencesPage} options={{...TransitionPresets.ModalSlideFromBottomIOS  , }}/>

        </Stack.Navigator>
    </NavigationContainer>
   );
}
