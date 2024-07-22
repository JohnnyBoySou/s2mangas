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

import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo"
import * as SecureStore from 'expo-secure-store';

SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
if (!publishableKey) {
  throw new Error('Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env');
}

const tokenCache = {
  async getToken(key) {
    try {
      const item = await SecureStore.getItemAsync(key);
      if (item) {
        console.log(`${key} was used 🔐 \n`);
      } else {
        console.log("No values stored under key: " + key);
      }
      return item;
    } catch (error) {
      console.error("SecureStore get item error: ", error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};


export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    LogBox.ignoreAllLogs(true)
    async function prepare() {
      try {
        await Font.loadAsync({
          Font_Book: require('./src/assets/fonts/Circular_Book.ttf'),
          Font_Medium: require('./src/assets/fonts/Circular_Medium.ttf'),
          Font_Bold: require('./src/assets/fonts/Circular_Bold.ttf'),
          Font_Black: require('./src/assets/fonts/Circular_Black.ttf'),
        });
      } catch (e) {
        console.warn(e);
      } finally {
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
      <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
        <ClerkLoaded>
          <ThemeProvider theme={dark}>
            <StatusBar style="light" />
            <Router />
          </ThemeProvider>
        </ClerkLoaded>
      </ClerkProvider>
    </View>
  );
}
