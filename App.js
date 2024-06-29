import 'react-native-gesture-handler';
import 'react-native-reanimated';
import React, { useCallback, useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components/native';
import Router from './src/routes/index';
import dark from './src/theme/dark';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { View, LogBox } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    LogBox.ignoreAllLogs(true)
    async function prepare() {
      try{
        await Font.loadAsync({
          Font_Book: require('./src/assets/fonts/Circular_Book.ttf'),
          Font_Medium: require('./src/assets/fonts/Circular_Medium.ttf'),
          Font_Bold: require('./src/assets/fonts/Circular_Bold.ttf'),
          Font_Black: require('./src/assets/fonts/Circular_Black.ttf'),
        });
      }catch (e) {
        console.warn(e);
      }finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }
  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <ThemeProvider theme={dark}>
        <StatusBar style="light" />
        <Router />
      </ThemeProvider>
    </View>
  );
}
