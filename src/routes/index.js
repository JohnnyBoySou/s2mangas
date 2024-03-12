import React, { useState, useEffect, } from 'react';
import { createStackNavigator, TransitionPresets, } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomePage from '../pages/home';
import MangalistDetailsPage from '../pages/mangalists/details';
import MangaDetailsPage from '../pages/manga/details';
import MangaPages from '../pages/manga/pages';
import NovidadesPage from '../pages/novidades';
import ContinuePage from '../pages/continue';
import PreferencesPage from './../pages/preferences/index';
import OnboardingPage from '../pages/onboarding/index';
import AsyncStatic from '../pages/async';
import CollectionsPage from './../pages/collections/index';
import CollectionDetailsPage from './../pages/collections/details';
import AccountPage from '../pages/account';
import SearchPage from '../pages/search';

const Stack = createStackNavigator();

export default function Router() {
  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName="HomePage" screenOptions={{headerShown: false,}} >
            <Stack.Screen name="Home" component={HomePage} options={{...TransitionPresets.ModalSlideFromBottomIOS  , }}/>
            <Stack.Screen name="Novidades" component={NovidadesPage} options={{...TransitionPresets.ModalSlideFromBottomIOS  , }}/>
            <Stack.Screen name="MangalistDetails" component={MangalistDetailsPage} options={{...TransitionPresets.SlideFromRightIOS   , }}/>
            <Stack.Screen name="MangaDetails" component={MangaDetailsPage} options={{...TransitionPresets.SlideFromRightIOS   , }}/>
            <Stack.Screen name="MangaPages" component={MangaPages} options={{...TransitionPresets.SlideFromRightIOS   , }}/>
            <Stack.Screen name="Onboarding" component={OnboardingPage} options={{...TransitionPresets.ModalSlideFromBottomIOS  , }}/>
            <Stack.Screen name="Continue" component={ContinuePage} options={{...TransitionPresets.ModalPresentationIOS   , }}/>
            <Stack.Screen name="Preferences" component={PreferencesPage} options={{...TransitionPresets.ModalSlideFromBottomIOS  , }}/>
            <Stack.Screen name="AsyncStatic" component={AsyncStatic} options={{...TransitionPresets.ModalSlideFromBottomIOS  , }}/>
            <Stack.Screen name="Collections" component={CollectionsPage} options={{...TransitionPresets.ModalPresentationIOS   , }}/>
            <Stack.Screen name="CollectionDetails" component={CollectionDetailsPage} options={{...TransitionPresets.ModalPresentationIOS   , }}/>
            <Stack.Screen name="Account" component={AccountPage} options={{...TransitionPresets.ModalPresentationIOS   , }}/>
            <Stack.Screen name="Search" component={SearchPage} options={{...TransitionPresets.ModalPresentationIOS   , }}/>
        </Stack.Navigator>
    </NavigationContainer>
   );
}
