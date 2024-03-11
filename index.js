//import { AppRegistry, Platform } from "react-native";
import { registerRootComponent } from "expo";
import App from "./App";
//import { name as appName } from "./app.json";
//import "@expo/metro-runtime";
registerRootComponent(App);

/**
 * 
if (Platform.OS == 'android') {
  registerRootComponent(App);
}
else if (Platform.OS === 'web') {
  global._frameTimestamp = null
}
else {
  AppRegistry.registerComponent(appName, () => App);
}
 */