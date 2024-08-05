import React, { useState, useContext, useEffect, useRef } from 'react';
import { Dimensions, ImageBackground, ScrollView } from 'react-native';
import { Column, Label, Row, Main, Scroll, Title, Button } from '@theme/global';

//Components
import { ThemeContext } from "styled-components/native";
import { MangalistLastedComponent, MangalistRateComponent, MangalistWeekendComponent } from '@components/lists/mangalist';
import LastedComponent from '@components/lists/lasted';
import RateComponent from '@components/lists/rate';
import WeekendComponent from '@components/lists/weekend';
import Header from '@components/header';
import CollectionsComponent from '@components/lists/collections';
import NovidadesPage from '@pages/novidades';
import ContinueSheet from '@components/continue';
import Avatar from '@components/avatar';

//Hooks
import { listLastManga } from '@hooks/progress';
import { MotiImage } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { BookMarked } from 'lucide-react-native';

//Icons

const { width, height } = Dimensions.get('window');

export default function HomePage({ navigation }) {
    const { color, font } = useContext(ThemeContext);
    const [type, setType] = useState('Tudo');
    const a = false;

    const scrollButtons = useRef(null);

    const [item, setitem] = useState();
    const [loading, setloading] = useState(true);

    useEffect(() => {
        const listChapter = async () => {
            setloading(true);
            try {
                const res = await listLastManga();
                setitem(res);
            } catch (error) {
                console.log(error)
            } finally {
                setloading(false);
            }
        }
        listChapter()
    }, [])
    return (
        <Main>
            <Scroll stickyHeaderIndices={[2]}  >
                <Header />
                <Column style={{ height: 95, }} />
                <Column style={{ zIndex: 999, }}>
                    <ScrollView ref={scrollButtons} horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 0, padding: 12, paddingTop: 50, backgroundColor: color.background, zIndex: -99, }}>
                        <Button onPress={() => { setType('Tudo'); scrollButtons.current?.scrollTo({ x: 0, y: 0, animated: true }) }} style={{ paddingVertical: 8, paddingHorizontal: 14, marginLeft: 10, backgroundColor: type === 'Tudo' ? color.light : color.off, borderRadius: 100, zIndex: 99, }}>
                            <Label style={{ color: type === 'Tudo' ? color.off : color.title, fontFamily: type === 'Tudo' ? font.bold : font.book, fontSize: 16, }}>Tudo</Label>
                        </Button>
                        <Button onPress={() => { setType('Mangas') }} style={{ paddingVertical: 8, marginHorizontal: 8, paddingHorizontal: 14, backgroundColor: type === 'Mangas' ? color.light : color.off, borderRadius: 100, zIndex: 99, }}>
                            <Label style={{ color: type === 'Mangas' ? color.off : color.title, fontFamily: type === 'Mangas' ? font.bold : font.book, fontSize: 16, }}>Mangás</Label>
                        </Button>
                        {a && <Button onPress={() => { setType('Mangalist') }} style={{ marginRight: 8, paddingVertical: 8, paddingHorizontal: 16, backgroundColor: type === 'Mangalist' ? color.light : color.off, borderRadius: 100, zIndex: 99, }}>
                            <Label style={{ color: type === 'Mangalist' ? color.off : color.title, fontFamily: type === 'Mangalist' ? font.bold : font.book, fontSize: 16, }}>Mangalist</Label>
                        </Button>}
                        <Button onPress={() => { navigation.navigate('Collections') }} style={{ marginRight: 8, paddingVertical: 8, paddingHorizontal: 14, backgroundColor: type === 'Collections' ? color.light : color.off, borderRadius: 100, zIndex: 99, }}>
                            <Label style={{ color: type === 'Collections' ? color.off : color.title, fontFamily: type === 'Collections' ? font.bold : font.book, fontSize: 16, }}>Coleções</Label>
                        </Button>
                        <Button onPress={() => { setType('Novidades'); scrollButtons.current?.scrollTo({ x: 200, y: 0, animated: true }) }} style={{ marginRight: 8, paddingVertical: 8, paddingHorizontal: 14, backgroundColor: type === 'Novidades' ? color.light : color.off, borderRadius: 100, zIndex: 99, }}>
                            <Label style={{ color: type === 'Novidades' ? color.off : color.title, fontFamily: type === 'Novidades' ? font.bold : font.book, fontSize: 16, }}>Novidades</Label>
                        </Button>
                        <Column style={{ width: 30, }}></Column>
                    </ScrollView>
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
                    {type === 'Novidades' && <NovidadesPage />}
                </>
                <Column style={{ height: 60, }} />
            </Scroll>
        </Main>
    )
}

const Spacer = ({ height = 16, width = 16, }) => <Column style={{ height, width }} />


const Continue = ({ item }) => {
    const { color, font } = useContext(ThemeContext);
    const { name, chapter, rate, type, id, capa } = item;
    return (
        <Column>
            <LinearGradient colors={['#171717', 'transparent']} style={{ width: '100%', height: 50, marginBottom: -50, zIndex: 99 }} />
            <ImageBackground source={{ uri: capa }} style={{ flexGrow: 1, justifyContent: 'center', }} imageStyle={{ zIndex: -3,}} >
                <Column style={{height: 250, }} />
                <Column style={{ marginHorizontal: 20, }}>
                    <Avatar width={100} height={100}/>
                    <Title style={{ marginTop: 10, marginBottom: 10, fontSize: 28, }}>{name}</Title>

                    <Row style={{alignItems: 'center',  }}>
                        <Label style={{ paddingVertical: 8, lineHeight: 20, paddingBottom: 4, fontSize: 16, borderWidth: 2, borderColor: "#ffffff90", color: "#fff", backgroundColor: "#ffffff50",  paddingHorizontal: 16,borderRadius: 100,  fontFamily: font.bold, }}>{type}</Label>
                        <Label style={{ lineHeight: 20, marginLeft: 12,  paddingVertical: 8, paddingBottom: 4, fontSize: 16, borderWidth: 2,   paddingHorizontal: 16, borderColor: "#ffffff90", color: "#fff", backgroundColor: "#ffffff50", borderRadius: 100,   fontFamily: font.bold,  }}>{rate}</Label>
                    </Row>
                    <Label style={{ fontFamily: font.bold, color: '#fff',marginTop: 10, }}>Sobre</Label>
                    <Label style={{ marginVertical: 4, fontSize: 16, }}>Sobre</Label>
                </Column>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <Column style={{width: 20, }} />
                    <Row style={{ backgroundColor: '#232323', borderRadius: 8, padding: 12, marginTop: 10, width: 200, justifyContent: 'center', alignItems: 'center',  }}>
                        <Column style={{ width: 42, height: 42, borderRadius: 100, justifyContent: 'center', alignItems: 'center', backgroundColor: color.primary+30, }}>
                            <BookMarked size={20} color={color.primary} />
                        </Column>
                        <Column style={{ marginLeft: 12, }}>
                            <Title style={{ fontSize: 14, }}>Sem marcadores</Title>
                            <Label style={{ fontSize: 10, width: 130, }}>Adicione marcadores no mangá para revisitá-los mais tarde.</Label>
                        </Column>
                    </Row>
                    <Column style={{width: 20, }} />
                    <Row style={{ backgroundColor: '#232323', borderRadius: 8, padding: 12, marginTop: 10, width: 200, justifyContent: 'center', alignItems: 'center',  }}>
                        <Column style={{ width: 42, height: 42, borderRadius: 100, justifyContent: 'center', alignItems: 'center', backgroundColor: color.primary+30, }}>
                            <BookMarked size={20} color={color.primary} />
                        </Column>
                        <Column style={{ marginLeft: 12, }}>
                            <Title style={{ fontSize: 14, }}>Sem marcadores</Title>
                            <Label style={{ fontSize: 10, width: 130, }}>Adicione marcadores no mangá para revisitá-los mais tarde.</Label>
                        </Column>
                    </Row>
                    <Column style={{width: 20, }} />
                </ScrollView>
                <LinearGradient colors={['transparent', '#171717']} style={{ width: '100%', height: 450, position: 'absolute', bottom: 0, zIndex: -2, }} />

            </ImageBackground>

        </Column>
    )
}
//<Label>•</Label>
//<LinearGradient colors={['#171717', 'transparent']} style={{ width: '100%', height: 50, marginBottom: -50, zIndex: 99 }} />
//<LinearGradient colors={['transparent', '#171717']} style={{ width: '100%', height: 50, marginTop: -50, }} />
// <MotiImage from={{ opacity: 0, transform: [{ scale: .7, }, { rotate: '18deg' }] }} animate={{ opacity: 1, transform: [{ scale: 1, }, { rotate: '0deg' }] }} source={{ uri: capa }} style={{ width: 150, height: 210, borderRadius: 12, alignSelf: 'center', marginTop: 32, }} />