import 'react-native-gesture-handler';
import "@expo/metro-runtime";
import React from 'react';
import { ThemeProvider } from 'styled-components/native';
import Router from './src/routes/index';
import dark from './src/theme/dark';

export default function App() {
 return (
    <ThemeProvider theme={dark}>
      <Router />
    </ThemeProvider>
  );
}
