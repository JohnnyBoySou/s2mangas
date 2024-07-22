import React from 'react';
import { createStackNavigator, TransitionPresets, } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, getFocusedRouteNameFromRoute, useRoute  } from '@react-navigation/native';
import { Home, Library, Search } from 'lucide-react-native';

import HomePage from '@pages/tabs/home';
import SearchPage from '@pages/tabs/search/search';
import AccountPage from '@pages/tabs/account';
import ContinuePage from '@pages/tabs/continue';
import CategoryPage from '@pages/tabs/search/category';
import NSFWPage from '@pages/tabs/search/nsfw';

import MangalistDetailsPage from '@pages/mangalists/details';
import MangaDetailsPage from '@pages/manga/details';
import MangaPages from '@pages/manga/pages';
import NovidadesPage from '@pages/novidades';

import PreferencesPage from '@pages/auth/preferences';
import OnboardingPage from '@pages/auth/onboarding';
import AsyncStatic from '@pages/auth/async';

import CollectionsPage from '@pages/collections/collections';
import CollectionDetailsPage from '@pages/collections/details';

import WeekendSectionScreen from '@pages/sections/weekend';

import LoginPage from '@pages/auth/login';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function Router() {
  return (
    <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false,}} initialRouteName='Weekend'>
            <Stack.Screen name="Tabs" component={Tabs} options={{...TransitionPresets.SlideFromRightIOS   , }}/>
            <Stack.Screen name="Home" component={HomePage} options={{...TransitionPresets.ModalSlideFromBottomIOS ,  backBehavior: 'none',}}/>
            <Stack.Screen name="Novidades" component={NovidadesPage} options={{...TransitionPresets.ModalSlideFromBottomIOS  , }}/>
            <Stack.Screen name="MangalistDetails" component={MangalistDetailsPage} options={{...TransitionPresets.SlideFromRightIOS   , }}/>
            <Stack.Screen name="MangaDetails" component={MangaDetailsPage} options={{...TransitionPresets.ModalSlideFromBottomIOS   , }}/>
            <Stack.Screen name="MangaPages" component={MangaPages} options={{...TransitionPresets.SlideFromRightIOS   , }}/>
            <Stack.Screen name="Onboarding" component={OnboardingPage} options={{...TransitionPresets.ModalSlideFromBottomIOS  , }}/>
            <Stack.Screen name="Continue" component={ContinuePage} options={{...TransitionPresets.ModalPresentationIOS   , }}/>
            <Stack.Screen name="Preferences" component={PreferencesPage} options={{...TransitionPresets.ModalSlideFromBottomIOS  , }}/>
            <Stack.Screen name="AsyncStatic" component={AsyncStatic} options={{...TransitionPresets.ModalSlideFromBottomIOS  , }}/>
            <Stack.Screen name="Collections" component={CollectionsPage} options={{...TransitionPresets.ModalPresentationIOS   , }}/>
            <Stack.Screen name="CollectionDetails" component={CollectionDetailsPage} options={{...TransitionPresets.ModalPresentationIOS    , }}/>
            <Stack.Screen name="Account" component={AccountPage} options={{...TransitionPresets.ModalPresentationIOS   , }}/>
            <Stack.Screen name="Search" component={SearchPage} options={{...TransitionPresets.ModalPresentationIOS   , }}/>
            <Stack.Screen name="Category" component={CategoryPage} options={{...TransitionPresets.ModalPresentationIOS   , }}/>
            <Stack.Screen name="NSFW" component={NSFWPage} options={{...TransitionPresets.ModalPresentationIOS   , }}/>
            <Stack.Screen name="Login" component={LoginPage} options={{...TransitionPresets.ModalPresentationIOS   , }}/>
            <Stack.Screen name="Weekend" component={WeekendSectionScreen} options={{...TransitionPresets.SlideFromRightIOS   , }}/>
        </Stack.Navigator>
    </NavigationContainer>
   );
}

function Tabs (){
  const route = useRoute();
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home'
    return (
        <Tab.Navigator initialRouteName="Home" 
            screenOptions={{
              headerShown: false,
              backBehavior: 'none',
              tabBarActiveTintColor: '#fff',
              tabBarInactiveTintColor: 'gray',
              tabBarStyle: {
                backgroundColor: '#202020',
                borderTopWidth:0,
                height: 68,
                paddingBottom: 12,
                paddingTop: 10,
              },
            }}
            
            
            >
            <Tab.Screen name="Home" component={HomePage} options={{
            backBehavior: 'initialRoute',
            tabBarLabel: 'Início',
            tabBarLabelStyle: {
              fontFamily: routeName === 'Home' ? 'Font_Bold' : 'Font_Book',
            },
            tabBarIcon: ({ color, size }) => (
              <Home color={color} size={size} />
            ),
        }}/>
           
            <Tab.Screen name="Search" component={SearchPage}  options={{
            tabBarLabel: 'Buscar',
            tabBarLabelStyle: {
              fontFamily: routeName === 'Search' ? 'Font_Bold' : 'Font_Book',
            },
            tabBarIcon: ({ color, size }) => (
              <Search  color={color} size={size} />
            ),
        }}/>
         <Tab.Screen name="Account" component={AccountPage}  
            options={{
            tabBarLabel: 'Biblioteca',
            tabBarLabelStyle: {
              fontFamily: routeName === 'Account' ? 'Font_Bold' : 'Font_Book',
            },
            tabBarIcon: ({ color, size }) => (
              <Library  color={color} size={size} />
            ),
        }}/>
        </Tab.Navigator>
    )
}
