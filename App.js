import 'react-native-gesture-handler';
import 'react-native-reanimated';
import "@expo/metro-runtime";
import React from 'react';
import { ThemeProvider } from 'styled-components/native';
import Router from './src/routes/index';
import dark from './src/theme/dark';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <ThemeProvider theme={dark}>
      <StatusBar style="light" />
      <Router />
    </ThemeProvider>
  );
}
