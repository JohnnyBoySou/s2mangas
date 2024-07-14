import React, { useState, useContext, useEffect } from 'react';
import { Pressable } from 'react-native';
import { Column, Label, Row, Main, Scroll, Title, } from '@theme/global';
import { ThemeContext } from "styled-components/native";
import { MangalistLastedComponent, MangalistRateComponent, MangalistWeekendComponent } from '@components/lists/mangalist';
import LastedComponent from '@components/lists/lasted';
import RateComponent from '@components/lists/rate';
import WeekendComponent from '@components/lists/weekend';
import Header from '@components/header';
import CollectionsComponent from '@components/lists/collections';
import { AnimatePresence, MotiImage, MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { listLastManga } from '@api/user/progress';

export default function HomePage({ navigation }) {
    const { color, font } = useContext(ThemeContext);
    const [type, setType] = useState('Tudo');
    const a = false;
    const [headerShown, setHeaderShown] = useState(false);
    return (
        <Main>
            <Scroll stickyHeaderIndices={[2]} onScroll={(event) => {  const scrolling = event.nativeEvent.contentOffset.y;  if (scrolling > 330) {  setHeaderShown(true);  } else { setHeaderShown(false); } }} >
                <Header />
                <Column style={{ height: 95, }} />
                <Column style={{ zIndex: 999,  }}>
                    <Row style={{ marginBottom: 0, padding: 12, paddingTop: 50, backgroundColor: color.background, zIndex: -99, }}>
                        <Pressable onPress={() => { setType('Tudo') }} style={{ paddingVertical: 10, paddingHorizontal: 16, marginLeft: 10, backgroundColor: type === 'Tudo' ? color.light : color.off, borderRadius: 100, zIndex: 99, }}>
                            <Label style={{ color: type === 'Tudo' ? color.off : color.title, fontFamily: type === 'Tudo' ? font.bold : font.book, }}>Tudo</Label>
                        </Pressable>
                        <Pressable onPress={() => { setType('Mangas') }} style={{ paddingVertical: 10, marginHorizontal: 8, paddingHorizontal: 16, backgroundColor: type === 'Mangas' ? color.light : color.off, borderRadius: 100, zIndex: 99, }}>
                            <Label style={{ color: type === 'Mangas' ? color.off : color.title, fontFamily: type === 'Mangas' ? font.bold : font.book, }}>Mangás</Label>
                        </Pressable>
                       {a && <Pressable onPress={() => { setType('Mangalist') }} style={{ marginRight: 8, paddingVertical: 10, paddingHorizontal: 16, backgroundColor: type === 'Mangalist' ? color.light : color.off, borderRadius: 100, zIndex: 99, }}>
                            <Label style={{ color: type === 'Mangalist' ? color.off : color.title, fontFamily: type === 'Mangalist' ? font.bold : font.book, }}>Mangalist</Label>
                        </Pressable>}
                        <Pressable onPress={() => { navigation.navigate('Collections') }} style={{ marginRight: 8, paddingVertical: 10, paddingHorizontal: 16, backgroundColor: type === 'Collections' ? color.light : color.off, borderRadius: 100, zIndex: 99, }}>
                            <Label style={{ color: type === 'Collections' ? color.off : color.title, fontFamily: type === 'Collections' ? font.bold : font.book, }}>Coleções</Label>
                        </Pressable>
                    </Row>
                </Column>
                <>
                {type === 'Tudo' && <Column>
                    <WeekendComponent />
                    <Spacer height={10} />
                    <CollectionsComponent />
                    <Spacer />
                    <RateComponent />
                    <Spacer />
                    <LastedComponent />
                </Column>}
                {type === 'Mangas' && <Column >
                    <WeekendComponent />
                    <Spacer />
                    <RateComponent />
                    <Spacer />
                    <LastedComponent />
                    <Spacer />
                </Column>}
                {type === 'Mangalist' && <Column>
                    <Spacer />
                    <MangalistLastedComponent />
                    <Spacer />
                    <MangalistWeekendComponent />
                    <Spacer />
                    <MangalistRateComponent />
                    <Spacer />
                </Column>}
                </>
                <Column style={{ height: 60, }} />
            </Scroll>
            <AnimatePresence>{headerShown && <ContinueBar navigation={navigation} />}</AnimatePresence>
        </Main>
    )
}

const Spacer = ({ height = 16, width = 16, }) => <Column style={{ height, width }} />

const ContinueBar = ({ navigation }) => {
    const [item, setitem] = useState();
    useEffect(() => {
        const listChapter = () => {
            listLastManga().then(data => {
                setitem(data)
            })
        }
        listChapter()
    }, [])

    //

    if (!item) return null;
    return (
        <Pressable style={{ position: 'absolute', bottom: 10, width: '100%', }} onPress={() => { navigation.navigate('Continue') }} >
            <MotiView
                from={{ opacity: 0, transform: [{ translateY: 50, }], }}
                animate={{ opacity: 1, transform: [{ translateY: 0, }], }}
                exit={{ opacity: 0, transform: [{ translateY: 50, }], }}
                exitTransition={{ type: 'timing', duration: 300, }}
                style={{ height: 60, borderRadius: 6, marginHorizontal: 20, backgroundColor: "#FFF", }} >
                <Row style={{ marginHorizontal: 8, alignItems: 'center', marginTop: 8, justifyContent: 'space-between', }}>
                    <Row>
                        <MotiImage source={{ uri: item?.capa }} style={{ width: 40, height: 40, borderRadius: 5, }} />
                        <Column style={{ marginLeft: 16, justifyContent: 'center', }}>
                            <Title style={{ fontSize: 18, color: "#171717" }}>{item.name.length >= 30 ? item?.name.slice(0, 30) + '...' : item.name}</Title>
                            <Label style={{ fontFamily: 'Font_Book', color: "#505050", fontSize: 14, marginTop: -2, }}>{item?.chapter - item?.chapters.length} capítulos restantes</Label>
                        </Column>
                    </Row>

                    <Row>

                        <Pressable style={{ marginRight: 10, }}>
                            <Ionicons name="play-outline" size={28} color="#000" />
                        </Pressable>
                    </Row>
                </Row>

            </MotiView>
        </Pressable>
    )
}

