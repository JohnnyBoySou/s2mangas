import React, { useEffect, useRef, useState, useContext, useMemo } from 'react';
import { Column, Row, Title, Label, Scroll, Main, Button } from '@theme/global';
import { Image, TouchableOpacity, Dimensions, Pressable, ImageBackground, } from 'react-native';

//ICONS
import { AntDesign, Feather, Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';

//COMPONENTS
import { ThemeContext } from 'styled-components/native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { AnimatePresence, MotiImage, MotiView } from 'moti';
import LottieView from 'lottie-react-native';
import { Skeleton } from 'moti/skeleton';
import { LinearGradient } from 'expo-linear-gradient';

import Modal from '@components/modal/modal';
import ModalAddCollection from '@components/modal/collection';
import Check from '@components/check';

//HOOKS
import { listChaptersToManga } from '@hooks/progress';
import { addComplete, addFollow, addLike, removeComplete, removeFollow, removeLike, verifyComplete, verifyFollow, verifyLiked } from '@hooks/preferences';

//APIV2
import { getManga } from '@apiv2/getManga';
import { getChapters } from '@apiv2/getChapters';
import { getCovers } from '@apiv2/getCovers';


import { GestureHandlerRootView, GestureDetector, Gesture, FlatList } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    runOnJS,
    withTiming,
} from 'react-native-reanimated';
import { Bell, BellRing, BookMarked, Bookmark, GripVertical } from 'lucide-react-native';
import { addMarkToManga, listMarksToManga, removeMarkToManga, toggleMarkToManga, verifyMarkToManga } from '../../hooks/marks';

const { width, height } = Dimensions.get('window');

export default function MangaDetailsPage({ route, navigation }) {
    const id = route?.params?.id ? route.params.id : '03431565-8eff-4509-a32d-858e8a66c290'
    const [headerShown, setHeaderShown] = useState();
    const { color, font } = useContext(ThemeContext);

    const [item, setItem] = useState();
    const [chapters, setChapters] = useState([]);
    const [chaptersRead, setChaptersRead] = useState([]);
    const [loading, setLoading] = useState(true);
    const [covers, setCovers] = useState();
    const [lidos, setlidos] = useState(false);
    const [marks, setMarks] = useState([]);

    const [lg, setlg] = useState('pt-br');

    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const date = `${day}/${month}/${year}`

    const itm = {
        name: item?.name,
        capa: item?.capa,
        rate: item?.rate,
        type: item?.type,
        id: item?.id,
        chapter: chapters?.length,
        long: item?.long,
        date: date,
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const mangaResponse = await getManga(id);
                setItem(mangaResponse);

                const coversResponse = await getCovers(id);
                setCovers(coversResponse);

                const chaptersResponse = await getChapters(id, lg);
                setChapters(chaptersResponse);

                const likedResponse = await verifyLiked(id);
                setLiked(likedResponse);

                const completedResponse = await verifyComplete(id);
                setCompleted(completedResponse);

                const followResponse = await verifyFollow(id);
                setFollow(followResponse);

                const marksResponse = await listMarksToManga(id);
                setMarks(marksResponse);

                setLoading(false);
            } catch (error) {
                console.error('Erro ao buscar dados:', error.message);
                setLoading(false);
            }
        };

        fetchData();

    }, [])

    const isFocused = useIsFocused();
    useEffect(() => {
        const fetchData = async () => {
            const listChapters = await listChaptersToManga(id);
            setChaptersRead(listChapters)
        }
        fetchData();
    }, [isFocused])


    const [loadingChapters, setloadingChapters] = useState();
    useEffect(() => {
        const fetchData = async () => {
            setloadingChapters(true);
            try {
                const res = await getChapters(id, lg);
                setChapters(res);
            } catch (error) {
                console.error(error);
            } finally {
                setloadingChapters(false);
            }
        }
        fetchData();
    }, [lg])

    const [liked, setLiked] = useState();
    const handleLike = async () => {
        if (liked) {
            removeLike(id).then(
                res => setLiked(false)
            )
        } else {
            addLike(itm).then(
                res => setLiked(true)
            )
        }
    }
    const [completed, setCompleted] = useState();
    const handleComplete = () => {
        if (completed) {
            removeComplete(item?.id).then((r) => {
                if (r) setCompleted(false);
            });
        } else {
            addComplete(itm).then((r) => {
                if (r) setCompleted(true);
            });
        }
    };
    const [follow, setFollow] = useState();
    const handleFollow = () => {
        if (follow) {
            removeFollow(item?.id).then((r) => {
                if (r) setFollow(false);
            });
        } else {
            addFollow(itm).then((r) => {
                if (r) setFollow(true);
            });
        }
    };

    const cl = item?.type === 'MANGA' ? "#FFA8B7" : item?.type === 'MANHWA' ? "#BBD2FF" : item?.type === 'MANHUA' ? "#BFFFC6" : '#FFF';

    const [type, setType] = useState('Capitulos');

    const modalAdd = useRef();
    const modalDesc = useRef();
    const scrollMain = useRef();
    const modalTranslate = useRef();

    const scrollTop = () => { scrollMain.current?.scrollTo({ x: 0, y: 0, animated: true }); }
    const scrollY = useSharedValue(0);
    


    const bts = ['Capitulos', 'Marcadores', 'Capas'];

    if (loading) return <Main><Scroll><LinearGradient colors={['#404040', 'transparent']} style={{ width: '100%', height: 300, position: 'absolute', top: 0, left: 0, }} /><SkeletonBody /></Scroll></Main>
    return (
        <Main>
            <Scroll stickyHeaderIndices={[1]} onScroll={(event) => { const scrolling = event.nativeEvent.contentOffset.y; scrollY.value = scrolling; if (scrolling > 630) { setHeaderShown(true); } else { setHeaderShown(false); } }} scrollEventThrottle={16} ref={scrollMain}>
                <Column style={{ marginBottom: -20, zIndex: 98, }}>
                    <Pressable onPress={() => { navigation.goBack() }} style={{ width: 90, height: 10, backgroundColor: '#30303090', borderRadius: 100, alignSelf: 'center', marginBottom: -20, zIndex: 99, marginTop: 10, }} />
                    <ImageBackground blurRadius={40} source={{ uri: item?.capa }} style={{ height: 410, flexGrow: 1, justifyContent: 'center', }} >
                        <Animated.Image source={{ uri: item?.capa }} style={[{ width: 200, height: 280, marginTop: 24, alignSelf: 'center', borderRadius: 8, zIndex: 99, },]} />
                    </ImageBackground>

                    <LinearGradient colors={['transparent', '#171717']} style={{ width: '100%', height: 200, marginTop: -198, }} />


                    <Column style={{ marginHorizontal: 30, }}>
                        <Title style={{ fontSize: 32, marginBottom: 5,  fontFamily: 'Font_Bold', letterSpacing: -1, }}>{item?.name}</Title>
                        <Button onPress={() => { modalDesc.current?.expand() }} style={{ borderRadius: 12, paddingVertical: 8, paddingHorizontal: 10, marginHorizontal: -10,}}>
                            <Label style={{ fontSize: 16, lineHeight: 20, }}>{item?.description?.length > 200 ? item?.description?.slice(0, 200) + '...' : item?.description}</Label>
                        </Button>
                        <Row style={{ alignItems: 'center', marginTop: 20, }}>
                            <Label style={{ backgroundColor: cl, color: "#000", fontSize: 16, lineHeight: 20, borderRadius: 100, paddingVertical: 10, paddingHorizontal: 10, }}>✶ {item?.type} ✦</Label>
                            <Row style={{ backgroundColor: "#303030", borderRadius: 100, justifyContent: 'center', marginHorizontal: 10, alignItems: 'center', }}>
                                <AntDesign name="calendar" size={16} color="#fff" style={{ backgroundColor: "#505050", padding: 8, borderRadius: 100, margin: 6, }} />
                                <Label style={{ marginLeft: 2, fontFamily: 'Font_Medium', fontSize: 18, marginRight: 14, }}>{item?.year}</Label>
                            </Row>
                            <Row style={{ backgroundColor: "#303030", borderRadius: 100, justifyContent: 'center', alignItems: 'center', }}>
                                <AntDesign name="star" size={16} color="#fff" style={{ backgroundColor: "#505050", padding: 8, borderRadius: 100, margin: 6, }} />
                                <Label style={{ marginLeft: 2, fontFamily: 'Font_Medium', fontSize: 18, marginRight: 14, }}>{item?.rate === 'Rate this mangas' ? 'Sem nota' : item?.rate}</Label>
                            </Row>
                        </Row>
                    </Column>

                </Column>

                <Row style={{ backgroundColor: color.background, paddingTop: 42, marginTop: 10, paddingBottom: 16, marginBottom: -20, paddingHorizontal: 40, zIndex: 98, alignItems: 'center' }}>
                        <Button onPress={handleLike} style={{ width: 54, height: 54, justifyContent: 'center', alignItems: 'center', borderRadius: 8, backgroundColor: liked ? color.red+40 : '#303030',}}>
                            {liked ? <AnimatePresence>
                                <MotiView from={{ scale: 0, opacity: 0, }} animate={{ scale: 1, opacity: 1, }} transition={{ type: 'spring', duration: 500, }}>
                                    <AntDesign name='heart' size={26} color="#EB5757" />
                                </MotiView>
                            </AnimatePresence> :
                                <MotiView from={{ rotate: '-12deg', opacity: 0, }} animate={{ rotate: '0deg', opacity: 1, }} transition={{ type: 'timing', duration: 500, }}>
                                    <AntDesign name='hearto' size={26} color="#d4d4d4" />
                                </MotiView>}

                        </Button>
                        <Button onPress={handleComplete} style={{ width: 54, height: 54,marginHorizontal: 12, justifyContent: 'center', alignItems: 'center', borderRadius: 8, backgroundColor: completed ? color.green+40 : '#303030', }}>
                            {completed ?
                                <AnimatePresence>
                                    <MotiView from={{ scale: 0, opacity: 0, }} animate={{ scale: 1, opacity: 1, }} transition={{ type: 'spring', duration: 500, }}>
                                        <Ionicons name='checkmark-done-circle' size={28} color="#27AE60" />
                                    </MotiView>
                                </AnimatePresence> :
                                <MotiView from={{ scale: 1.5, opacity: 0, }} animate={{ scale: 1, opacity: 1, }} transition={{ type: 'timing', duration: 500, }}>
                                    <Ionicons name='checkmark-done-circle-outline' size={28} color="#d4d4d4" />
                                </MotiView>}
                        </Button>
                        <Button onPress={handleFollow} style={{ width: 54, height: 54, justifyContent: 'center', alignItems: 'center', borderRadius: 8, backgroundColor: follow ? color.blue+40 : '#303030', }}>
                            {follow ?
                                <AnimatePresence>
                                    <MotiView from={{ scale: 0, rotate: '-45deg', opacity: 0, }} animate={{ scale: 1, rotate: '0deg', opacity: 1, }} transition={{ type: 'spring', duration: 500, }}>
                                        <BellRing  size={26} color="#719fdd" />
                                    </MotiView>
                                </AnimatePresence> :
                                <MotiView from={{ rotate: '45deg', opacity: 0, }} animate={{ rotate: '0deg', opacity: 1, }} transition={{ type: 'timing', duration: 500, }}>
                                    <Bell size={26} color="#d4d4d4" />
                                </MotiView>}
                        </Button>
                        <Button onPress={() => { modalAdd.current?.expand() }} style={{ width: 54, height: 54,  marginHorizontal: 12, justifyContent: 'center', alignItems: 'center', borderRadius: 8, backgroundColor: '#303030',}}>
                            <Ionicons name="add-circle-outline" size={32} color="#d4d4d4" />
                        </Button>
                        <Button onPress={() => { modalTranslate.current?.expand() }} style={{ width: 54, height: 54, justifyContent: 'center', alignItems: 'center', borderRadius: 8, backgroundColor: '#303030',}}>
                            <MaterialIcons name="translate" size={28} color="#d4d4d4" />
                        </Button>
                </Row>

                <Row style={{ paddingHorizontal: 20, marginTop: 40, }}>
                    {bts.map((bt, index) => (
                        <Button key={index} onPress={() => setType(bt)} style={{ paddingVertical: 10, paddingHorizontal: 16, marginLeft: 10, backgroundColor: bt === type ? color.light : color.off, borderRadius: 100, }}>
                            <Label style={{ fontSize: 18, color: bt === type ? color.off : color.title, fontFamily: bt === type ? font.bold : font.book, letterSpacing: -0.6, }}>{bt}</Label>
                        </Button>
                    ))}
                </Row>
                {type == 'Marcadores' && <Marcadores marks={marks} id={id} setlidos={setlidos} lidos={lidos} loadingChapters={loadingChapters} />}
                {type == 'Capitulos' && <Capitulos chapters={chapters} itm={itm} id={id} lg={lg} chaptersRead={chaptersRead} lidos={lidos} setlidos={setlidos} loadingChapters={loadingChapters} />}
                {type == 'Capas' && <Capas covers={covers} />}

                <Column style={{ height: 30, }}></Column>
            </Scroll>

            <AnimatePresence>
                {headerShown &&
                    <MotiView
                        from={{ opacity: 0, transform: [{ scale: 0 }, { rotate: '0deg' }], }}
                        animate={{ opacity: 1, transform: [{ scale: 1 }, { rotate: '0deg' }], }}
                        exit={{ opacity: 0, transform: [{ scale: 0 }, { rotate: '0deg' }], }}
                        exitTransition={{ type: 'spring', duration: 300, }}
                        style={{ zIndex: 3, position: 'absolute', alignSelf: 'center', top: 100, }}>
                        <Pressable onPress={scrollTop} style={{ flexDirection: 'row' }}>
                            <Column style={{ width: 42, height: 42, borderRadius: 100, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', marginRight: -15, zIndex: 99, }}>
                                <AntDesign name='arrowup' size={24} color="#000" />
                            </Column>
                            <MotiImage
                                from={{ opacity: 0, transform: [{ scale: 0 },], }}
                                animate={{ opacity: 1, transform: [{ scale: 1 },], }}
                                exit={{ opacity: 0, transform: [{ scale: 0 },], }}
                                exitTransition={{ type: 'spring', duration: 300, }} source={{ uri: item?.capa }} style={{ width: 42, height: 42, borderRadius: 100, borderWidth: 3, borderColor: color.title, }} />
                        </Pressable>
                    </MotiView>}

            </AnimatePresence>




            <Modal ref={modalAdd} snapPoints={[0.1, 600]}>
                <ModalAddCollection item={itm} />
            </Modal>

            <Modal ref={modalDesc} snapPoints={[0.1, 600]}>
                <Column style={{ padding: 20, }}>
                    <Title>Descrição</Title>
                    <Label style={{ fontSize: 18, lineHeight: 24, marginTop: 12, marginBottom: 12, }}>{item?.description}</Label>
                    <Label style={{ fontSize: 14, lineHeight: 20, }}>Lançado em: {item?.create_date}</Label>
                    <Label style={{ fontSize: 14, lineHeight: 20, }}>Status: {item?.status}.</Label>
                    <Label style={{ fontSize: 14, lineHeight: 20, }}>Seguidores: {item?.followers}</Label>
                    <Label style={{ fontSize: 14, lineHeight: 20, }}>Tipo: {item?.type}</Label>
                    {item.categories?.length > 0 && <Label style={{ fontSize: 14, }}>Categorias: {item?.categories?.join(', ')}</Label>}


                    <Row style={{ flexWrap: 'wrap' }}>
                        <Label style={{ fontSize: 14, lineHeight: 20, }}>Idiomas: </Label>
                        {item.languages?.length > 0 && item.languages.map((lang, index) => (
                            <Label key={index} style={{ fontSize: 14, }}>- {lang.name} </Label>
                        ))}
                    </Row>



                    <Button onPress={() => { modalDesc.current?.close() }} style={{ paddingVertical: 12, paddingHorizontal: 24, backgroundColor: color.light, borderRadius: 100, alignSelf: 'center', marginVertical: 20, }}>
                        <Label style={{ fontSize: 18, color: color.off, fontFamily: font.medium, }}>Fechar</Label>
                    </Button>
                </Column>
            </Modal>

            <Modal ref={modalTranslate} snapPoints={[0.1, height]}>
                <Column style={{ paddingHorizontal: 20, }}>
                    <Title>Tradução</Title>
                    <Label>Esses são os idiomas disponíveis</Label>
                    <FlatList
                        style={{ marginTop: 10, backgroundColor: '#303030', height: 500, borderRadius: 16, overflow: 'hidden', }}
                        data={item?.languages}
                        contentContainerStyle={{ padding: 20, rowGap: 20, }}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => <Button onPress={() => { setlg(item.id); modalTranslate.current?.close() }} style={{
                            backgroundColor: item.id === lg ? color.light : "#505050",
                            borderRadius: 18,
                            paddingVertical: 14,
                            paddingHorizontal: 16,
                        }}>
                            <Label style={{ color: item.id === lg ? color.off : color.light, textAlign: 'center', fontFamily: lg === item.id ? 'Font_Bold' : 'Font_Medium' }}>{item?.name}</Label></Button>}
                    />
                    <Label style={{ textAlign: 'center', marginVertical: 12, fontSize: 14, }}>Selecione outro idioma para ver os capítulos traduzidos.</Label>



                    <Button onPress={() => { modalTranslate.current?.close() }} style={{ paddingVertical: 12, paddingHorizontal: 24, backgroundColor: color.light, borderRadius: 100, alignSelf: 'center', marginVertical: 20, }}>
                        <Label style={{ fontSize: 18, color: color.off, fontFamily: font.medium, }}>Fechar</Label>
                    </Button>
                </Column>
            </Modal>
        </Main>
    )
}

const Capas = ({ covers }) => {
    const navigation = useNavigation()
    return (
        <Column style={{ marginHorizontal: 20, marginTop: 10, }}>
            <Title style={{ fontSize: 24, marginTop: 8, }}>Capas</Title>
            <Label>Todas as capas dos volumes lançados</Label>
            <FlatList
                style={{ marginTop: 10, }}
                data={covers}
                numColumns={2}
                updateCellsBatchingPeriod={100}
                maxToRenderPerBatch={4}
                initialNumToRender={4}
                removeClippedSubviews
                showsVerticalScrollIndicator={false}
                columnWrapperStyle={{ justifyContent: 'space-between', }}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <Button style={{ flexGrow: 1, height: 220, margin: 8, borderRadius: 6, }} onPress={() => { navigation.navigate('MangaCapa', { img: item?.img }) }}><MotiImage source={{ uri: item?.img }} style={{ flexGrow: 1, height: 220, objectFit: 'cover', }} /></Button>}
            />
            <Column style={{ height: 50, }} />
        </Column>
    )
}

const Marcadores = ({ marks, id }) => {
    return (
        <>

            {marks?.length > 0 ? <>
                <Column style={{ paddingHorizontal: 40, marginTop: 20, borderRadius: 16, }}>
                    <Row style={{ justifyContent: 'space-between', alignItems: 'center', }}>
                        <Column>
                            <Title style={{ fontSize: 20, letterSpacing: -1, marginTop: 8, }}>Marcadores</Title>
                            <Label style={{ letterSpacing: -1, fontSize: 16, }}>Seus marcadores de capítulo</Label>
                        </Column>
                        <Button style={{ width: 42, height: 42, borderRadius: 100, backgroundColor: "#404040", justifyContent: 'center', alignItems: 'center', }}>
                            <Feather name="search" size={18} color="#fff" />
                        </Button>
                    </Row>
                </Column>
                <FlatList
                    style={{ marginTop: 20, }}
                    data={marks}
                    maxToRenderPerBatch={4}
                    initialNumToRender={4}
                    removeClippedSubviews
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => item.number}
                    ListFooterComponent={<Column style={{ height: 50, }} />}
                    renderItem={({ item }) => <Card item={item} id={id} />}
                />
            </> :
                <Column style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10, paddingVertical: 30, }}>
                    <Image source={{ uri: 'https://i.pinimg.com/736x/4e/e7/c9/4ee7c956df651885166f2af1e53b0988.jpg' }} style={{ width: 100, height: 150, borderRadius: 12, transform: [{ rotate: '12deg', }] }} />
                    <Title style={{ fontSize: 24, marginTop: 8, }}>Sem marcadores</Title>
                    <Label style={{ textAlign: 'center', }}>Adicione marcadores para facilitar a organização</Label>
                    <Button style={{ backgroundColor: "#fff", borderRadius: 100, paddingVertical: 10, paddingHorizontal: 16, marginTop: 15, }}>
                        <Label style={{ color: "#000" }}>Adicionar marcador</Label>
                    </Button>
                </Column>}
        </>
    )
}

const Capitulos = ({ chapters, itm, id, lg, chaptersRead, lidos, setlidos, loadingChapters }) => {
    return (
        <>
            {chapters?.length > 0 ? <>
                <Column style={{ paddingHorizontal:30, marginTop: 20, borderRadius: 16, }}>
                    <Row style={{ justifyContent: 'space-between', alignItems: 'center', }}>
                        <Column>
                            <Title style={{ fontSize: 20, letterSpacing: -1, marginTop: 8, }}>Recentes</Title>
                            <Label style={{ letterSpacing: -1, fontSize: 16, }}>Confira os últimos capítulos</Label>
                        </Column>
                        <Button style={{ width: 42, height: 42, borderRadius: 100, backgroundColor: "#404040", justifyContent: 'center', alignItems: 'center', }}>
                            <Feather name="search" size={18} color="#fff" />
                        </Button>
                    </Row>
                </Column>
                <FlatList
                    style={{ marginTop: 20, }}
                    data={chapters?.slice(0, 5)}
                    keyExtractor={(item) => item.number}
                    maxToRenderPerBatch={5}
                    initialNumToRender={5}
                    removeClippedSubviews
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => <Card item={item} id={id} itm={itm} lg={lg} />}
                />
                <Column style={{ marginTop: 20, paddingHorizontal: 30, }}>
                    <Row style={{ justifyContent: 'space-between', alignItems: 'center', }}>
                        <Column>
                            <Title style={{ fontSize: 20, letterSpacing: -1, marginTop: 8, }}>Todos ({chapters?.length})</Title>
                            <Label style={{ letterSpacing: -1, fontSize: 16, }}>Confira todos capítulos</Label>
                        </Column>
                        <Column style={{ justifyContent: 'center', alignItems: 'center', }}>
                            <Button onPress={() => { setlidos(!lidos) }} style={{ borderRadius: 100, }}>
                                <Check status={lidos} />
                            </Button>
                        </Column>
                    </Row>
                </Column>
                <ListChapters chapters={chapters} id={id} itm={itm} chaptersRead={chaptersRead} lidos={lidos} lg={lg} />
            </> :
                <Column style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 40, marginHorizontal: 32, }}>
                    <Title style={{ textAlign: 'center', fontSize: 24, lineHeight: 26, fontFamily: 'Font_Medium' }}>Não encontramos nenhum capítulo traduzido para o idioma brasileiro.</Title>
                    <Row style={{ justifyContent: 'center', alignItems: 'center', borderRadius: 100, backgroundColor: '#d4d4d4', marginVertical: 12, }}>
                        <Button onPress={() => { modalTranslate.current?.expand() }} style={{ width: 42, height: 42, borderRadius: 100, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', }}>
                            <MaterialIcons name="translate" size={28} color="#000" />
                        </Button>
                        <Title style={{ fontSize: 18, fontFamily: 'Font_Medium', marginHorizontal: 12, color: "#00000099", marginRight: 14, }}>Alterar idioma</Title>
                    </Row>
                    <Label style={{ textAlign: 'center', }}>Selecione outro idioma para ver os capítulos traduzidos.</Label>
                </Column>
            }
        </>
    )
}

const ListChapters = ({ chapters, id, itm, chaptersRead, lidos, lg }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = chapters?.slice(indexOfFirstItem, indexOfLastItem);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const Pagination = ({ itemsPerPage, totalItems, paginate }) => {
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) { pageNumbers.push(i); }
        return (
            <Row style={{ justifyContent: 'center', marginTop: 6, flexWrap: 'wrap' }}>
                {pageNumbers?.map((number, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => paginate(number)}
                        style={{ width: 42, height: 42, backgroundColor: number === currentPage ? '#FFF' : '#505050', borderRadius: 100, marginHorizontal: 10, justifyContent: 'center', alignItems: 'center', }}>
                        <Label style={{ color: number === currentPage ? '#000' : '#fff', fontSize: 24, fontFamily: 'Font_Medium', marginTop: -4, marginRight: -4, }}>{number} </Label>
                    </TouchableOpacity>
                ))}
            </Row>
        );
    };

    const setChaptersToRemove = new Set(chaptersRead);
    const filteredItems = currentItems.filter(item => !setChaptersToRemove.has(item.chapter));

    return (
        <Column>
            <FlatList
                style={{ marginTop: 20, }}
                data={lidos ? filteredItems : currentItems}
                ListEmptyComponent={<Column style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 50, }}>
                    <LottieView autoPlay style={{ width: 200, height: 200, marginVertical: -30, }} source={require('@imgs/book.json')}
                    />
                    <Title style={{ textAlign: 'center' }}>Todos os capítulos foram lidos</Title>
                    <Label style={{ fontSize: 18, textAlign: 'center' }}>Pule para a próxima pagina clicando nos números abaixo</Label>
                </Column>}
                keyExtractor={(item) => item.number}
                maxToRenderPerBatch={8}
                removeClippedSubviews
                initialNumToRender={8}
                windowSize={10}
                renderItem={({ item }) => <Card item={item} id={id} itm={itm} chaptersRead={chaptersRead} lidos={lidos} total={chapters} lg={lg} />}
            />

            <Pagination
                itemsPerPage={itemsPerPage}
                totalItems={chapters?.length}
                currentPage={currentPage}
                paginate={paginate}
            />

        </Column>
    );
};

const Card = ({ item, id, itm, chaptersRead, lidos, total, lg }) => {
    const { color, font } = useContext(ThemeContext);
    const read = chaptersRead?.includes(item.chapter);
    const navigation = useNavigation();

    const MAX_TRANSLATE_X = useMemo(() => 50, []);
    const translateX = useSharedValue(0);
    const scale = useSharedValue(-50)

    useEffect(() => {

        const verify = async () => {
            try {
                const res = await verifyMarkToManga(id, item.id)
                if (res) {
                    scale.value = withSpring(-25, { stiffness: 150, damping: 25 });
                } else {
                    scale.value = withSpring(-50, { stiffness: 150, damping: 25 });
                }
            } catch (error) {
                console.log(error)
            }
        }
        verify()
    }, [id])

    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            translateX.value = Math.min(Math.max(event.translationX, -MAX_TRANSLATE_X), MAX_TRANSLATE_X);

            if (translateX.value > MAX_TRANSLATE_X) {
                scale.value = withSpring(-25, { stiffness: 150, damping: 25 });
            }
        })
        .onEnd(() => {
            if (translateX.value < -10) {
                runOnJS(removeMarkToManga)(id, item.id);
                scale.value = withSpring(-50, { stiffness: 150, damping: 25 });
                translateX.value = withSpring(0, { stiffness: 150, damping: 25 });
            } else {
                runOnJS(addMarkToManga)(id, item);
                scale.value = withSpring(-25, { stiffness: 150, damping: 25 });
                translateX.value = withSpring(0, { stiffness: 150, damping: 25 });
            }
        });

    const rStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    const rButton = useAnimatedStyle(() => ({
        transform: [{ translateX: scale.value }],
    }));


    if (lidos && read) return null;
    return (
        <GestureHandlerRootView>
            <Row>
                <Animated.View style={[{ justifyContent: 'center', alignItems: 'flex-end', paddingRight: 8, width: 46, zIndex: 99, borderRadius: 12, top: 0, bottom: 10, position: 'absolute', backgroundColor: color.blue, }, rButton]}>
                    <Bookmark size={18} color="#fff" />
                </Animated.View>
                <Animated.View style={[{ flexDirection: 'row', marginHorizontal: 30, flexGrow: 2, }, rStyle]}>
                    <Row style={{ backgroundColor: "#202020", flexGrow: 2, paddingVertical: 10, justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, borderRadius: 16, opacity: read ? 0.4 : 1, }}>
                        {read && <Title style={{ fontSize: 12, backgroundColor: color.green, paddingVertical: 4, paddingHorizontal: 8, borderBottomRightRadius: 6, borderTopLeftRadius: 6, position: 'absolute', top: 0, left: 0, zIndex: 99, }}>Lido</Title>}

                        <Row>
                            <GestureDetector gesture={panGesture} >
                                <Column style={{ backgroundColor: '#303030', height: 70, borderTopLeftRadius: 12, borderTopRightRadius: 6, borderBottomRightRadius: 6, borderBottomLeftRadius: 12, width: 32, marginVertical: -12, justifyContent: 'center', alignItems: 'center', }}>
                                    <GripVertical size={24} color="#fff" />
                                </Column>
                            </GestureDetector>
                            <Row style={{ justifyContent: 'center', marginLeft: 12, alignItems: 'center', }}>
                                <Title style={{ fontSize: 22, }}>#{item?.chapter}</Title>
                                <Column style={{ marginLeft: 12, }}>
                                    <Title style={{ fontSize: 14, fontFamily: 'Font_Medium', letterSpacing: -0.5, textTransform: 'lowercase' }}>{item?.title?.length > 23 ? item?.title?.slice(0, 23) + '...' : item?.title} </Title>
                                    <Label style={{ fontSize: 10, }}>{item?.publish_date}</Label>
                                </Column>
                            </Row>
                        </Row>

                        <TouchableOpacity onPress={() => navigation.navigate('MangaPages', { chapter: item.chapter, id: item.id, itm: itm, total: total, lg: lg, })} style={{ backgroundColor: '#303030', padding: 12, borderRadius: 100, marginRight: 10, }} >
                            <AntDesign name="arrowright" size={24} color="#fff" />
                        </TouchableOpacity>
                    </Row>
                </Animated.View>
            </Row>
        </GestureHandlerRootView>
    )
}

const SkeletonBody = () => {
    return (
        <Column style={{ marginTop: 30, marginHorizontal: 20, }}>
            <Column style={{ justifyContent: 'center', alignItems: 'center', marginTop: 40, marginBottom: 20, }}>
                <Skeleton width={190} height={260} radius={8} />
            </Column>
            <Skeleton width={260} height={40} radius={4} />
            <Spacer height={24} />
            <Skeleton width={300} height={24} radius={4} />
            <Spacer height={6} />
            <Skeleton width={280} height={24} radius={4} />
            <Spacer height={6} />
            <Skeleton width={120} height={24} radius={4} />
            <Spacer height={6} />
            <Row style={{ marginTop: 10, }}>
                <Skeleton width={120} height={32} radius={100} />
                <Spacer height={6} width={12} />
                <Skeleton width={90} height={32} radius={100} />
                <Spacer height={6} width={12} />
                <Skeleton width={110} height={32} radius={100} />
            </Row>

            <Row style={{ marginTop: 20, justifyContent: 'space-between', alignItems: 'center', }}>
                <Row>
                    <Skeleton width={42} height={42} radius={100} />
                    <Spacer height={6} width={12} />
                    <Skeleton width={42} height={42} radius={100} />
                    <Spacer height={6} width={12} />
                    <Skeleton width={42} height={42} radius={100} />
                </Row>
                <Column style={{ width: 42, height: 42, backgroundColor: "#fff", borderRadius: 100, }} />
            </Row>

            <Row style={{ marginTop: 20, }}>
                <Column style={{ width: 100, height: 42, backgroundColor: "#fff", borderRadius: 100, }} />
                <Spacer height={6} width={12} />
                <Skeleton width={110} height={42} radius={100} />
                <Spacer height={6} width={12} />
                <Skeleton width={110} height={42} radius={100} />
            </Row>

            <Spacer height={26} />
            <Skeleton width={260} height={40} radius={4} />

            <Spacer height={18} width={12} />
            <Skeleton width={'100%'} height={70} radius={4} />
            <Spacer height={12} width={12} />
            <Skeleton width={'100%'} height={70} radius={4} />
            <Spacer height={12} width={12} />
            <Skeleton width={'100%'} height={70} radius={4} />
            <Spacer height={12} width={12} />
            <Skeleton width={'100%'} height={70} radius={4} />
            <Spacer height={12} width={12} />
        </Column>
    )
}

const Spacer = ({ height = 16, width = 16, }) => <Column style={{ height, width }} />

