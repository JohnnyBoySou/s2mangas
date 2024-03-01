import React, { useState, useEffect, useRef, useContext } from 'react';
import { TouchableOpacity, Image, ScrollView, } from 'react-native';
import { Column, Label, Title, Row, Main, Scroll, } from '../../theme/global';
import { ThemeContext } from "styled-components/native";
import { MangalistLastedComponent, MangalistRateComponent, MangalistWeekendComponent } from '../../components/lists/mangalist';
import { LinearGradient } from 'expo-linear-gradient';

import NavBar from '../../components/navbar';
import NewsComponent from '../../components/lists/news';
import LastedComponent from './../../components/lists/lasted';
import RateComponent from '../../components/lists/rate';
import WeekendComponent from '../../components/lists/weekend';
import ContinueReading from '../../components/reading/continue';

export default function HomePage() {
    const { color, font } = useContext(ThemeContext);
    const hello = new Date().getHours() < 12 ? 'Bom dia' : new Date().getHours() < 18 ? 'Boa tarde' : 'Boa noite';
    const user = { name: 'Khevi', avatar: 'https://i.pinimg.com/564x/4b/8e/60/4b8e60f3475cdf18cf6f916ef4220e82.jpg' }
    const [type, setType] = useState('Tudo');

    return (
        <Main>
            <Scroll stickyHeaderIndices={[1]}>
                {type === 'Mangas' && <Column style={{ width: 100, height: 50}}/>}
                {type === 'Mangalist' && <Column style={{ width: 100, height: 50}}/>}
                {type === 'Tudo' &&  <Column style={{ paddingHorizontal: 20, }}>
                        <NavBar/>
                        <Column style={{ position: 'relative', alignItems: 'center', justifyContent: 'center', marginTop: 80, }}>
                            <LinearGradient colors={['#ED274A', '#FF620A', '#E0CA3C']} style={{ width: 200, height: 200, position: 'absolute',  alignSelf: 'center', borderRadius: 100, }} />
               
                            <Image source={require('../../assets/imgs/blur1.png')} style={{ position: 'absolute', width: 400, height: 400, }} />
                            <Image source={{ uri: user.avatar }} style={{ width: 170, height: 170, alignSelf: 'center', borderRadius: 100, borderWidth: 6, borderColor: "#262626"}} />
                        </Column>
                        <Title style={{ fontSize: 46, textAlign: 'center', fontFamily: font.black, zIndex: 99, marginTop: 20,}}>{hello},</Title>
                        <Title style={{ fontSize: 46, textAlign: 'center', fontFamily: font.black, zIndex: 99,}}>{user?.name}</Title>
                    </Column>}

                <Row style={{ marginBottom: 15,  backgroundColor: color.background, padding: 12, paddingTop: 40, marginTop: -20,}}>
                        <TouchableOpacity onPress={() => { setType('Tudo') }} style={{ paddingVertical: 10, paddingHorizontal: 24, marginLeft: 10, backgroundColor: type === 'Tudo' ? color.light : color.off, borderRadius: 100, }}>
                            <Label style={{ color: type === 'Tudo' ? color.off : color.title, fontFamily: type === 'Tudo' ? font.bold : font.book, }}>Tudo</Label>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { setType('Mangas') }} style={{ paddingVertical: 10, marginHorizontal: 12, paddingHorizontal: 24, backgroundColor: type === 'Mangas' ? color.light : color.off, borderRadius: 100, }}>
                            <Label style={{ color: type === 'Mangas' ? color.off : color.title, fontFamily: type === 'Mangas' ? font.bold : font.book, }}>Mangás</Label>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { setType('Mangalist') }} style={{marginRight: 12, paddingVertical: 10, paddingHorizontal: 24, backgroundColor: type === 'Mangalist' ? color.light : color.off, borderRadius: 100, }}>
                            <Label style={{ color: type === 'Mangalist' ? color.off : color.title, fontFamily: type === 'Mangalist' ? font.bold : font.book, }}>Mangalist</Label>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { setType('Mangalist') }} style={{ }}>
                            <Image source={{ uri: user.avatar }} style={{ width: 42, height: 42, alignSelf: 'center', borderRadius: 100, }} />
                        </TouchableOpacity>
                 </Row>
               {type === 'Tudo' && <Column>
                    <ContinueReading />
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