import React, { useEffect, useRef, useState, useContext, } from 'react';
import { Column, Row, Title, Label, Scroll, Main } from '@theme/global';
import { Image, TouchableOpacity, Dimensions, FlatList, Pressable, ImageBackground, } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, FontAwesome5, Feather, Ionicons, Fontisto, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { ThemeContext } from 'styled-components/native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Skeleton } from 'moti/skeleton';
import { AnimatePresence, MotiImage, MotiView } from 'moti';
import { addComplete, addFollow, addLike, removeComplete, removeFollow, removeLike, verifyComplete, verifyFollow, verifyLiked } from '@api/user/preferences';
import ModalAddCollection from '@components/modal/collection';
import { Modalize } from 'react-native-modalize';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { listChaptersToManga } from '@api/user/progress';
import { getManga } from '@apiv2/getManga';
import { getChapters } from '@apiv2/getChapters';
import { getCovers } from '@apiv2/getCovers';
import Check from '@components/check';
import LottieView from 'lottie-react-native';

export default function MangaDetailsPage({ route, navigation }) {
    const id = route?.params?.id ? route.params.id : '58b09ce2-ea05-405e-8e1c-a9361df9bdd9'
    const [headerShown, setHeaderShown] = useState();
    const { color, font } = useContext(ThemeContext);
    const [item, setItem] = useState();
    const [chapters, setChapters] = useState([]);
    const [chaptersRead, setChaptersRead] = useState([]);
    const [loading, setLoading] = useState(true);
    const [covers, setCovers] = useState();
    const [lidos, setlidos] = useState(false);
    const a = false;

    const [lg, setlg] = useState('pt-br');

    const itm = {
        name: item?.name,
        capa: item?.capa,
        rate: item?.rate,
        type: item?.type,
        id: item?.id,
        chapter: chapters?.length,
        long: item?.long,
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const mangaResponse = await getManga(id);
                setItem(mangaResponse);
                
                const coversResponse = await getCovers(id);
                setCovers(coversResponse);
                console.log(coversResponse)

                const chaptersResponse = await getChapters(id, lg);
                setChapters(chaptersResponse);

                const likedResponse = await verifyLiked(id);
                setLiked(likedResponse);

                const completedResponse = await verifyComplete(id);
                setCompleted(completedResponse);

                const followResponse = await verifyFollow(id);
                setFollow(followResponse);

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

    useEffect(() => {
        const fetchData = async () => {
            const chaptersResponse = await getChapters(id, lg);
            setChapters(chaptersResponse);
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
    

    if (loading) return <Main><Scroll><LinearGradient colors={['#404040', 'transparent']} style={{ width: '100%', height: 300, position: 'absolute', top: 0, left: 0, }} /><SkeletonBody /></Scroll></Main>
    return (
        <Main>
            <Scroll stickyHeaderIndices={[1]} onScroll={(event) => {const scrolling = event.nativeEvent.contentOffset.y;scrollY.value = scrolling;if (scrolling > 630) {setHeaderShown(true);} else {setHeaderShown(false);}}} scrollEventThrottle={16} ref={scrollMain}>

                <Column style={{ marginBottom: -20, zIndex: 98, }}>
                    <Pressable onPress={() => { navigation.goBack() }} style={{ width: 90, height: 10, backgroundColor: '#30303090', borderRadius: 100, alignSelf: 'center', marginBottom: -20, zIndex: 99, marginTop: 10, }} />
                    <ImageBackground blurRadius={40} source={{ uri: item?.capa }} style={{ height: 410, flexGrow: 1, justifyContent: 'center', }} >
                        <Animated.Image source={{ uri: item?.capa }} style={[{ width: 200, height: 280, marginTop: 24, alignSelf: 'center', borderRadius: 8, zIndex: 99, },]} />
                    </ImageBackground>

                    <LinearGradient colors={['transparent', '#171717']} style={{ width: '100%', height: 200, marginTop: -198, }} />

                    <Title style={{ fontSize: 32, marginBottom: 5, marginTop: 10, fontFamily: 'Font_Bold', letterSpacing: -1, marginHorizontal: 20, }}>{item?.name}</Title>
                    <TouchableOpacity onPress={() => { modalDesc.current?.open() }}>
                        <Label style={{ fontSize: 18, lineHeight: 26, marginHorizontal: 20, }}>{item?.description?.slice(0, 138)}...</Label>
                    </TouchableOpacity>

                    <Row style={{ alignItems: 'center', marginTop: 10, marginHorizontal: 20, }}>
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

                <Row style={{ justifyContent: 'space-between', flexGrow: 1, backgroundColor: color.background, paddingTop: 32, marginTop: 10, paddingBottom: 10, marginBottom: -20, paddingHorizontal: 24, zIndex: 98, }}>
                    <Row style={{ alignItems: 'center', }}>
                        <Pressable onPress={handleLike} style={{ width: 42, height: 42, justifyContent: 'center', alignItems: 'center', }}>
                            {liked ? <AnimatePresence>
                                <MotiView from={{ scale: 0, opacity: 0, }} animate={{ scale: 1, opacity: 1, }} transition={{ type: 'spring', duration: 500, }}>
                                    <AntDesign name='heart' size={26} color="#EB5757" />
                                </MotiView>
                            </AnimatePresence> :
                                <MotiView from={{ rotation: -45, opacity: 0, }} animate={{ rotation: 0, opacity: 1, }} transition={{ type: 'timing', duration: 500, }}>
                                    <AntDesign name='hearto' size={26} color="#d4d4d4" />
                                </MotiView>}

                        </Pressable>
                        <Pressable onPress={handleComplete} style={{ width: 42, height: 42, justifyContent: 'center', alignItems: 'center', }}>
                            {completed ?
                                <AnimatePresence>
                                    <MotiView from={{ scale: 0, opacity: 0, }} animate={{ scale: 1, opacity: 1, }} transition={{ type: 'spring', duration: 500, }}>
                                        <Ionicons name='checkmark-done-circle' size={28} color="#27AE60" />
                                    </MotiView>
                                </AnimatePresence> :
                                <MotiView from={{ scale: 1.5, opacity: 0, }} animate={{ scale: 1, opacity: 1, }} transition={{ type: 'timing', duration: 500, }}>
                                    <Ionicons name='checkmark-done-circle-outline' size={28} color="#d4d4d4" />
                                </MotiView>}
                        </Pressable>
                        <Pressable onPress={handleFollow} style={{ width: 42, height: 42, justifyContent: 'center', alignItems: 'center', }}>
                            {follow ?
                                <AnimatePresence>
                                    <MotiView from={{ scale: 0, rotate: '-45deg', opacity: 0, }} animate={{ scale: 1, rotate: '0deg', opacity: 1, }} transition={{ type: 'spring', duration: 500, }}>
                                        <FontAwesome name='bell' size={26} color="#719fdd" />
                                    </MotiView>
                                </AnimatePresence> :
                                <MotiView from={{ rotate: '45deg', opacity: 0, }} animate={{ rotate: '0deg', opacity: 1, }} transition={{ type: 'timing', duration: 500, }}>
                                    <FontAwesome name='bell-o' size={26} color="#d4d4d4" />
                                </MotiView>}
                        </Pressable>
                        <Pressable onPress={() => { modalAdd.current?.open() }} style={{ width: 42, height: 42, justifyContent: 'center', alignItems: 'center', }}>
                            <Ionicons name="add-circle-outline" size={32} color="#d4d4d4" />
                        </Pressable>
                        <Pressable onPress={() => { modalTranslate.current?.open() }} style={{ width: 42, height: 42, justifyContent: 'center', alignItems: 'center', }}>
                            <MaterialIcons name="translate" size={28} color="#d4d4d4" />
                        </Pressable>
                    </Row>
                </Row>

                <Row style={{ paddingHorizontal: 10, marginTop: 40, }}>
                    <Pressable onPress={() => { setType('Capitulos') }} style={{ paddingVertical: 10, paddingHorizontal: 16, marginLeft: 10, backgroundColor: type === 'Capitulos' ? color.light : color.off, borderRadius: 100, }}>
                        <Label style={{ fontSize: 18, color: type === 'Capitulos' ? color.off : color.title, fontFamily: type === 'Capitulos' ? font.bold : font.book, }}>Capítulos</Label>
                    </Pressable>
                    <Pressable onPress={() => { setType('Marcadores') }} style={{ paddingVertical: 10, paddingHorizontal: 16, marginLeft: 10, backgroundColor: type === 'Marcadores' ? color.light : color.off, borderRadius: 100, }}>
                        <Label style={{ fontSize: 18, color: type === 'Marcadores' ? color.off : color.title, fontFamily: type === 'Marcadores' ? font.bold : font.book, }}>Marcadores</Label>
                    </Pressable>
                    <Pressable onPress={() => { setType('Capas') }} style={{ paddingVertical: 10, paddingHorizontal: 16, marginLeft: 10, backgroundColor: type === 'Capas' ? color.light : color.off, borderRadius: 100, }}>
                        <Label style={{ fontSize: 18, color: type === 'Capas' ? color.off : color.title, fontFamily: type === 'Capas' ? font.bold : font.book, }}>Capas</Label>
                    </Pressable>
                </Row>
                
                {type == 'Marcadores' && <>
                    <Column style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10, paddingVertical: 30, }}>
                        <Image source={{ uri: 'https://i.pinimg.com/736x/4e/e7/c9/4ee7c956df651885166f2af1e53b0988.jpg' }} style={{ width: 100, height: 150, borderRadius: 12, transform: [{ rotate: '12deg', }] }} />
                        <Title style={{ fontSize: 24, marginTop: 8, }}>Sem marcadores</Title>
                        <Label style={{ textAlign: 'center', }}>Adicione marcadores para facilitar a organização</Label>
                        <Pressable style={{ backgroundColor: "#fff", borderRadius: 100, paddingVertical: 10, paddingHorizontal: 16, marginTop: 15, }}>
                            <Label style={{ color: "#000" }}>Adicionar marcador</Label>
                        </Pressable>
                    </Column>
                </>
                }
                {type == 'Capitulos' && <>
                   {chapters?.length > 0 ? <>
                    <Column style={{ paddingHorizontal: 20, marginTop: 10, borderRadius: 16, }}>
                        <Row style={{ justifyContent: 'space-between', alignItems: 'center', }}>
                            <Column>
                                <Title style={{ fontSize: 24, marginTop: 8, }}>Recentes</Title>
                                <Label style={{}}>Confira os últimos capítulos</Label>
                            </Column>
                            <Pressable style={{ width: 42, height: 42, borderRadius: 100, backgroundColor: "#404040", justifyContent: 'center', alignItems: 'center', }}>
                                <Feather name="search" size={18} color="#fff" />
                            </Pressable>
                        </Row>
                        <FlatList
                            style={{ marginTop: 20, }}
                            data={chapters?.slice(0, 5)}
                            keyExtractor={(item) => item.number}
                            renderItem={({ item }) => <Card item={item} id={id} itm={itm} lg={lg} />}
                        />
                    </Column>
                    <Column style={{ marginTop: 20, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 16, marginBottom: 20, }}>
                        <Row style={{ justifyContent: 'space-between', alignItems: 'center', }}>

                            <Column>
                                <Title style={{ fontSize: 24, marginTop: 8, }}>Todos ({chapters?.length})</Title>
                                <Label style={{}}>Confira todos capítulos</Label>
                            </Column>
                            <Column style={{ justifyContent: 'center', alignItems: 'center', }}>
                                <Pressable onPress={() => { setlidos(!lidos) }} >
                                    <Check status={lidos} />
                                </Pressable>
                            </Column>
                        </Row>
                        <ListChapters chapters={chapters} id={id} itm={itm} chaptersRead={chaptersRead} lidos={lidos} lg={lg} />
                    </Column>
                    </> :
                    <Column style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 40, marginHorizontal: 32, }}>
                        <Title style={{ textAlign: 'center', fontSize: 24, lineHeight: 26, fontFamily: 'Font_Medium' }}>Não encontramos nenhum capítulo traduzido para o idioma brasileiro.</Title>
                        <Row style={{ justifyContent: 'center', alignItems: 'center', borderRadius: 100, backgroundColor: '#d4d4d4', marginVertical: 12,}}>
                        <Pressable onPress={() => { modalTranslate.current?.open() }} style={{ width: 42, height: 42, borderRadius: 100, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', }}>
                            <MaterialIcons name="translate" size={28} color="#000" />
                        </Pressable>
                        <Title style={{ fontSize: 18, fontFamily: 'Font_Medium', marginHorizontal: 12, color: "#00000099", marginRight: 14,}}>Alterar idioma</Title>
                        </Row>
                        <Label style={{ textAlign: 'center', }}>Selecione outro idioma para ver os capítulos traduzidos.</Label>
                    </Column>
                    }

                </>}
                {type == 'Capas' && <>
                    <Column style={{ marginHorizontal: 20, marginTop: 10, }}>
                        <Title style={{ fontSize: 24, marginTop: 8, }}>Capas</Title>
                        <Label>Todas as capas dos volumes lançados</Label>
                        <FlatList
                            style={{ marginTop: 10, }}
                            data={covers}
                            numColumns={2}
                            columnWrapperStyle={{ justifyContent: 'space-between', }}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => <MotiImage source={{uri: item?.img}} style={{ flexGrow: 1, height: 220, margin: 8, borderRadius: 6, objectFit: 'cover', }} />}
                        />
                        <Column style={{height: 50, }} />
                    </Column>
                </>
                }
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
                            <Column style={{ width: 42, height: 42, borderRadius: 100, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', marginRight: -15,  zIndex: 99,}}>
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

            <Modalize ref={modalAdd} adjustToContentHeight handlePosition="inside" handleStyle={{ backgroundColor: '#d7d7d790' }} modalStyle={{ backgroundColor: "#171717", borderTopLeftRadius: 20, borderTopRightRadius: 20, }} >
                <Column>
                    <ModalAddCollection item={itm} />
                </Column>
            </Modalize>

            <Modalize ref={modalDesc} adjustToContentHeight handlePosition="inside" handleStyle={{ backgroundColor: '#d7d7d790' }} modalStyle={{ backgroundColor: "#171717", borderTopLeftRadius: 20, borderTopRightRadius: 20, }}>
                <Column style={{ padding: 20, }}>
                    <Title>Descrição</Title>
                    <Label style={{ fontSize: 18, lineHeight: 24, marginTop: 12,  marginBottom: 12,}}>{item?.description}</Label>
                    <Label style={{ fontSize: 14, lineHeight: 20, }}>Lançado em: {item?.create_date}</Label>
                    <Label style={{ fontSize: 14, lineHeight: 20,}}>Status: {item?.status}.</Label>
                    <Label style={{ fontSize: 14, lineHeight: 20, }}>Seguidores: {item?.followers}</Label>
                    <Label style={{ fontSize: 14, lineHeight: 20, }}>Tipo: {item?.type}</Label>
                    {item.categories?.length > 0 && <Label style={{ fontSize: 14, }}>Categorias: {item?.categories?.join(', ')}</Label>}

                    
                    <Row>
                    <Label style={{ fontSize: 14, lineHeight: 20, }}>Idiomas: </Label>
                    {item.languages?.length > 0 && item.languages.map((lang, index) => (
                        <Label key={index} style={{ fontSize: 14, }}>- {lang.name} </Label>
                        ))}
                    </Row>



                    <Pressable onPress={() => { modalDesc.current?.close() }} style={{ paddingVertical: 12, paddingHorizontal: 24, backgroundColor: color.light, borderRadius: 100, alignSelf: 'center', marginVertical: 20, }}>
                        <Label style={{ fontSize: 18, color: color.off, fontFamily: font.medium, }}>Fechar</Label>
                    </Pressable>
                </Column>
            </Modalize>

            <Modalize ref={modalTranslate} adjustToContentHeight handlePosition="inside" handleStyle={{ backgroundColor: '#d7d7d790' }} modalStyle={{ backgroundColor: "#171717", borderTopLeftRadius: 20, borderTopRightRadius: 20, }}>
                <Column style={{ padding: 20, }}>
                    <Title>Tradução</Title>
                    <Label>Esses são os idiomas disponíveis</Label>
                        <FlatList
                            style={{ marginTop: 10, }}
                            data={item?.languages}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => <Pressable onPress={() => {setlg(item.id); modalTranslate.current?.close()}}  style={{ 
                                backgroundColor: item.id === lg ? color.light : color.off,
                                borderRadius: 18, 
                                paddingVertical: 14, 
                                paddingHorizontal: 16, 
                                marginTop: 15, 
                             }}>
                                <Label style={{ color: item.id === lg ? color.off : color.light, textAlign: 'center', fontFamily: lg === item.id ? 'Font_Bold' : 'Font_Medium' }}>{item?.name}</Label></Pressable>}
                        />
                        <Label style={{ textAlign: 'center', marginVertical: 12, fontSize: 14, }}>Selecione outro idioma para ver os capítulos traduzidos.</Label>



                    <Pressable onPress={() => { modalTranslate.current?.close() }} style={{ paddingVertical: 12, paddingHorizontal: 24, backgroundColor: color.light, borderRadius: 100, alignSelf: 'center', marginVertical: 20, }}>
                        <Label style={{ fontSize: 18, color: color.off, fontFamily: font.medium, }}>Fechar</Label>
                    </Pressable>
                </Column>
            </Modalize>
        </Main>
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
                renderItem={({ item }) => <Card item={item} id={id} itm={itm} chaptersRead={chaptersRead} lidos={lidos} total={chapters}  lg={lg}/>}
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
    if (lidos && read) return null;
    return (
        <Row style={{ backgroundColor: "#202020", paddingVertical: 10, justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, borderRadius: 16, opacity: read ? 0.4 : 1, }}>
            {read && <Title style={{ fontSize: 12, backgroundColor: color.green, paddingVertical: 4, paddingHorizontal: 8, borderBottomRightRadius: 6, borderTopLeftRadius: 6, position: 'absolute', top: 0, left: 0, }}>Lido</Title>}
            <Row style={{ justifyContent: 'center', alignItems: 'center', }}>
                <Title style={{ fontSize: 22, marginLeft: 20,  }}>#{item?.chapter}</Title>

                <Column style={{ marginLeft: 20, }}>
                    <Title style={{ fontSize: 14, fontFamily: 'Font_Medium', letterSpacing: -0.5, textTransform: 'lowercase' }}>{item?.title?.length > 23 ? item?.title?.slice(0, 23) + '...' : item?.title} </Title>
                    <Label style={{ fontSize: 10, }}>{item?.publish_date}</Label>
                </Column>
            </Row>
            <TouchableOpacity onPress={() => navigation.navigate('MangaPages', { chapter: item.chapter, id: item.id, itm: itm, total: total, lg: lg, })} style={{ backgroundColor: '#303030', padding: 12, borderRadius: 100, marginRight: 10, }} >
                <AntDesign name="arrowright" size={24} color="#fff" />
            </TouchableOpacity>
        </Row>
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

