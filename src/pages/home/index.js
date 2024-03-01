import React, { useState, useEffect, useRef, useContext } from 'react';
import { Pressable, Image, ScrollView, } from 'react-native';
import { Column, Label, Title, Row, Main, Scroll, } from '../../theme/global';
import { ThemeContext } from "styled-components/native";
import { MangalistLastedComponent, MangalistRateComponent, MangalistWeekendComponent } from '../../components/lists/mangalist';
import NavBar from '../../components/navbar';
import NewsComponent from '../../components/lists/news';
import LastedComponent from './../../components/lists/lasted';
import RateComponent from '../../components/lists/rate';
import WeekendComponent from '../../components/lists/weekend';
import ContinueReading from '../../components/reading/continue';
import Header from '../../components/header';

export default function HomePage({ navigation }) {
    const { color, font } = useContext(ThemeContext);
    const user = { name: 'Khevi', avatar: 'https://i.pinimg.com/564x/4b/8e/60/4b8e60f3475cdf18cf6f916ef4220e82.jpg' }
    const [type, setType] = useState('Tudo');

    return (
        <Main>
            <Scroll stickyHeaderIndices={[1]}>
                {type === 'Mangas' && <Column style={{ width: 100, height: 50}}/>}
                {type === 'Mangalist' && <Column style={{ width: 100, height: 50}}/>}
                {type === 'Tudo' && <Column style={{ paddingHorizontal: 20, }}>
                        <NavBar/>
                        <Header/>
                        </Column>
                       }

                <Row style={{ marginBottom: 15,  backgroundColor: color.background, padding: 12, paddingTop: 40, marginTop: -20,}}>
                        <Pressable onPress={() => { setType('Tudo') }} style={{ paddingVertical: 10, paddingHorizontal: 24, marginLeft: 10, backgroundColor: type === 'Tudo' ? color.light : color.off, borderRadius: 100, }}>
                            <Label style={{ color: type === 'Tudo' ? color.off : color.title, fontFamily: type === 'Tudo' ? font.bold : font.book, }}>Tudo</Label>
                        </Pressable>
                        <Pressable onPress={() => { setType('Mangas') }} style={{ paddingVertical: 10, marginHorizontal: 12, paddingHorizontal: 24, backgroundColor: type === 'Mangas' ? color.light : color.off, borderRadius: 100, }}>
                            <Label style={{ color: type === 'Mangas' ? color.off : color.title, fontFamily: type === 'Mangas' ? font.bold : font.book, }}>Mangás</Label>
                        </Pressable>
                        <Pressable onPress={() => { setType('Mangalist') }} style={{marginRight: 12, paddingVertical: 10, paddingHorizontal: 24, backgroundColor: type === 'Mangalist' ? color.light : color.off, borderRadius: 100, }}>
                            <Label style={{ color: type === 'Mangalist' ? color.off : color.title, fontFamily: type === 'Mangalist' ? font.bold : font.book, }}>Mangalist</Label>
                        </Pressable>
                        <Pressable onPress={() => { setType('Mangalist') }} style={{ }}>
                            <Image source={{ uri: user.avatar }} style={{ width: 42, height: 42, alignSelf: 'center', borderRadius: 100, }} />
                        </Pressable>
                 </Row>
               {type === 'Tudo' && <Column>
                    <ContinueReading navigation={navigation}/>
                    <Spacer/>
                    <NewsComponent />
                    <Spacer/>
                    <LastedComponent />
                    <Spacer/>
                    <RateComponent />
                    <Spacer/>
                    <MangalistWeekendComponent />
                    <Spacer/>
                    <WeekendComponent/>
                    <Spacer/>
                </Column>}

                {type === 'Mangas' && <Column>
                    <WeekendComponent/>
                    <Spacer/>
                    <RateComponent />
                    <Spacer/>
                    <NewsComponent />
                    <Spacer/>
                    <LastedComponent />
                    <Spacer/>
                </Column>}

                {type === 'Mangalist' && <Column>
                    <Spacer/>
                    <MangalistLastedComponent />
                    <Spacer/>
                    <MangalistWeekendComponent />
                    <Spacer/>
                    <MangalistRateComponent/>
                    <Spacer/>
                </Column>}

            </Scroll>
        </Main>
    )
}


const Spacer = ({ height = 16, width = 16, }) => <Column style={{ height, width }} />