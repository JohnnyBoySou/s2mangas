import React, { useState, useEffect, useRef, useContext } from 'react';
import { TouchableOpacity, Image, } from 'react-native';
import { Column, Label, Title, Row, Main, Scroll, View } from '../../theme/global';
import { ThemeContext } from "styled-components/native";
import MangalistComponent, { MangalistLastedComponent, MangalistRateComponent, MangalistWeekendComponent } from '../../components/lists/mangalist';
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
        <Main >
            <Scroll stickyHeaderIndices={[1]}>
                {type === 'Mangas' && <Column style={{ width: 100, height: 50}}/>}
                {type === 'Mangalist' && <Column style={{ width: 100, height: 50}}/>}
                {type === 'Tudo' &&  <Column style={{ paddingHorizontal: 20, }}>
                        <NavBar/>
                        <Column style={{ position: 'relative', alignItems: 'center', justifyContent: 'center', marginTop: 80, }}>
                            <Image source={require('../../assets/imgs/blur1.png')} style={{ position: 'absolute', width: 400, height: 400, }} />
                            <Image source={{ uri: user.avatar }} style={{ width: 150, height: 150, alignSelf: 'center', borderRadius: 100, }} />
                        </Column>
                        <Title style={{ fontSize: 46, marginVertical: 12, textAlign: 'center', fontFamily: font.black, zIndex: 99,}}>{hello}, {"\n"}{user?.name}</Title>
                    </Column>}

                <Row style={{ marginBottom: 15,  backgroundColor: color.background, padding: 12, paddingTop: 40, marginTop: -40,}}>
                        <TouchableOpacity onPress={() => { setType('Tudo') }} style={{ paddingVertical: 10, paddingHorizontal: 24, marginLeft: 10, backgroundColor: type === 'Tudo' ? color.light : color.off, borderRadius: 100, }}>
                            <Label style={{ color: type === 'Tudo' ? color.off : color.title, fontFamily: type === 'Tudo' ? font.bold : font.book, }}>Tudo</Label>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { setType('Mangas') }} style={{ paddingVertical: 10, marginHorizontal: 12, paddingHorizontal: 24, backgroundColor: type === 'Mangas' ? color.light : color.off, borderRadius: 100, }}>
                            <Label style={{ color: type === 'Mangas' ? color.off : color.title, fontFamily: type === 'Mangas' ? font.bold : font.book, }}>Mangás</Label>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { setType('Mangalist') }} style={{ paddingVertical: 10, paddingHorizontal: 24, backgroundColor: type === 'Mangalist' ? color.light : color.off, borderRadius: 100, }}>
                            <Label style={{ color: type === 'Mangalist' ? color.off : color.title, fontFamily: type === 'Mangalist' ? font.bold : font.book, }}>Mangalist</Label>
                        </TouchableOpacity>
                 </Row>

               {type === 'Tudo' && <Column>
                    <ContinueReading />
                    <NewsComponent />
                    <LastedComponent />
                    <RateComponent />
                    <MangalistWeekendComponent />
                    <WeekendComponent/>
                </Column>}

                {type === 'Mangas' && <Column>
                    <WeekendComponent/>
                    <RateComponent />
                    <NewsComponent />
                    <LastedComponent />
                </Column>}

                {type === 'Mangalist' && <Column>
                    <MangalistLastedComponent />
                    <MangalistWeekendComponent />
                    <MangalistRateComponent/>
                </Column>}

            </Scroll>
        </Main>
    )
}