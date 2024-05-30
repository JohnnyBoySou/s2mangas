import React, { useEffect, useRef, useState, useContext, } from 'react';
import { Column, Row, Title, Label, Scroll, Main } from '@theme/global';
import { Image, TouchableOpacity, Dimensions, FlatList, Pressable, ImageBackground, } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, FontAwesome5, Feather, Ionicons, Fontisto, FontAwesome } from '@expo/vector-icons';
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
import Check from '@components/check';

export default function MangaDetailsPage({ route, navigation }) {
    const id = route.params.id;
    const [headerShown, setHeaderShown] = useState();
    const { color, font } = useContext(ThemeContext);
    const [item, setItem] = useState();
    const [chapters, setChapters] = useState([]);
    const [chaptersRead, setChaptersRead] = useState([]);
    const [similar, setSimilar] = useState();
    const [loading, setLoading] = useState(true);
    const [lidos, setlidos] = useState(false);
    const a = false;

    const itm = {
        name: item?.name,
        capa: item?.capa,
        rate: item?.rate,
        type: item?.type,
        id: item?.id,
        chapter: item?.chapters,
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                
              const mangaResponse = await getManga(id);
              setItem(mangaResponse);
      
              const chaptersResponse = await getChapters(id);
              setChapters(chaptersResponse);
      
            //  const similarResponse = await requestSimilar(id);
              //setSimilar(similarResponse.mangas);
      
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
    const handlePlay = () => {  navigation.navigate('MangaPages', { chapter: 1, id: id, }) }

    const cl = item?.type === 'MANGA' ? "#FFA8B7" : item?.type === 'MANHWA' ? "#BBD2FF" : item?.type === 'MANHUA' ? "#BFFFC6" : '#FFF';
    const reaction = item?.rate >= 4 ? 'Ótimo' : item?.rate >= 3 ? 'Bom' : item?.rate <= 2 ? 'Ruim' : 'Regular';

    const [type, setType] = useState('Capitulos');
    const modalAdd = useRef();
    const modalDesc = useRef();
    const scrollMain = useRef();
    const scrollTop = () => {scrollMain.current?.scrollTo({ x: 0, y: 0, animated: true });}
    const scrollY = useSharedValue(0);
    const imageStyle = useAnimatedStyle(() => {
        const scale = scrollY.value > 142 ? 1.3 - (scrollY.value - 142) / 200 : 1.3;
        return {
          opacity: scale,
          transform:[{ scale:scale }]
        };});

    if (loading) return <Main><Scroll><LinearGradient colors={['#404040', 'transparent']} style={{ width: '100%', height: 300, position: 'absolute', top: 0, left: 0, }} /><SkeletonBody /></Scroll></Main>
    return (
        <Main>
            <Scroll stickyHeaderIndices={[1]} onScroll={(event) => {
                const scrolling = event.nativeEvent.contentOffset.y;
                scrollY.value = scrolling;
                if (scrolling > 630) {
                    setHeaderShown(true);
                } else {
                    setHeaderShown(false);
                }
                }}
            scrollEventThrottle={16}
            ref={scrollMain}>

                <Column style={{  marginBottom: -20, zIndex: 98,}}>
                    <Pressable onPress={() => {navigation.goBack()}}  style={{ width: 90, height: 10, backgroundColor: '#30303090', borderRadius: 100, alignSelf: 'center', marginBottom: -20, zIndex: 99, marginTop: 10, }}/>
                    <ImageBackground blurRadius={40} source={{ uri: item?.capa }} style={{ height: 410,  flexGrow: 1,  justifyContent: 'center',   }} >
                        <Animated.Image source={{ uri: item?.capa }} style={[{ width: 170, height: 240, marginTop: 24,  alignSelf: 'center', borderRadius: 4, zIndex: 99, }, imageStyle]} />
                    </ImageBackground>

                    <LinearGradient colors={['transparent', '#171717']} style={{ width: '100%', height: 200,  marginTop: -198,}} />

                    <Title style={{ fontSize: 32, marginBottom: 5, marginTop: 10, fontFamily: 'Font_Bold', letterSpacing: -1, marginHorizontal: 20,}}>{item?.name}</Title>
                    <TouchableOpacity onPress={() => { modalDesc.current?.open() }}>
                        <Label style={{ fontSize: 18, lineHeight: 26, marginHorizontal: 20,}}>{item?.description.slice(0, 138)}...</Label>
                    </TouchableOpacity>

                    <Row style={{ alignItems: 'center', marginTop: 10, marginHorizontal: 20,}}>
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

                <Row style={{  justifyContent: 'space-between', flexGrow: 1,  backgroundColor: color.background, paddingTop: 16, marginTop: 20, paddingBottom: 10, marginBottom: -20,  paddingHorizontal: 24, zIndex: 98,}}>
                        <Row style={{  alignItems: 'center', }}>
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
                                <MotiView from={{ scale: 0, opacity: 0, }}  animate={{ scale: 1, opacity: 1, }} transition={{ type: 'spring', duration: 500,  }}>
                                    <Ionicons name='checkmark-done-circle' size={28} color="#27AE60" />
                                </MotiView> 
                                </AnimatePresence> :
                                <MotiView from={{ scale: 1.5, opacity: 0, }}  animate={{ scale: 1,  opacity: 1, }}  transition={{ type: 'timing', duration: 500,  }}>
                                    <Ionicons name='checkmark-done-circle-outline' size={28} color="#d4d4d4" />
                                </MotiView>}
                            </Pressable>
                            <Pressable onPress={handleFollow} style={{ width: 42, height: 42, justifyContent: 'center', alignItems: 'center', }}>
                                {follow ?
                                <AnimatePresence>
                                <MotiView from={{ scale: 0, rotate: '-45deg', opacity: 0, }}  animate={{ scale: 1, rotate: '0deg', opacity: 1, }} transition={{ type: 'spring', duration: 500,  }}>
                                    <FontAwesome name='bell' size={26} color="#719fdd" />
                                </MotiView> 
                                </AnimatePresence> :
                                <MotiView from={{ rotate: '45deg', opacity: 0, }}  animate={{ rotate: '0deg',  opacity: 1, }}  transition={{ type: 'timing', duration: 500,  }}>
                                    <FontAwesome name='bell-o' size={26} color="#d4d4d4" />
                                </MotiView>}
                            </Pressable>
                            <Pressable onPress={() => {modalAdd.current?.open()}}  style={{ width: 42, height: 42, justifyContent: 'center', alignItems: 'center', }}>
                                <Ionicons name="add-circle-outline" size={32} color="#d4d4d4" />
                            </Pressable>


                        </Row>
                        <Pressable onPress={handlePlay} style={{ backgroundColor: "#fff", width: 46, marginLeft: 10, height: 46, borderRadius: 100, justifyContent: 'center', alignItems: 'center', position: 'absolute', right: 0, }}>
                            <FontAwesome5 name="play" size={18} color="#ED274A" />
                        </Pressable>
                </Row>

                <Row style={{ paddingHorizontal: 10, marginTop: 40,}}>
                    <Pressable onPress={() => { setType('Capitulos') }} style={{ paddingVertical: 10, paddingHorizontal: 16, marginLeft: 10, backgroundColor: type === 'Capitulos' ? color.light : color.off, borderRadius: 100,  }}>
                        <Label style={{fontSize: 18, color: type === 'Capitulos' ? color.off : color.title, fontFamily: type === 'Capitulos' ? font.bold : font.book, }}>Capítulos</Label>
                    </Pressable>
                  {a && <Pressable onPress={() => { setType('Similares') }} style={{ paddingVertical: 10, paddingHorizontal: 16, marginLeft: 10, backgroundColor: type === 'Similares' ? color.light : color.off, borderRadius: 100, }}>
                        <Label style={{fontSize: 18, color: type === 'Similares' ? color.off : color.title, fontFamily: type === 'Similares' ? font.bold : font.book, }}>Similares</Label>
                    </Pressable>}
                    <Pressable onPress={() => { setType('Marcadores') }} style={{ paddingVertical: 10, paddingHorizontal: 16, marginLeft: 10, backgroundColor: type === 'Marcadores' ? color.light : color.off, borderRadius: 100,  }}>
                        <Label style={{fontSize: 18, color: type === 'Marcadores' ? color.off : color.title, fontFamily: type === 'Marcadores' ? font.bold : font.book, }}>Marcadores</Label>
                    </Pressable>
                </Row>

                {type == 'Similares' && <>
                <Column style={{ marginHorizontal: 20, marginTop: 10,}}>
                    <Title  style={{ fontSize: 24, marginTop: 8, }}>Similares</Title>
                    <Label>Mangás parecidos com esse</Label>
                    <FlatList
                        style={{ marginTop: 10, }}
                        data={similar}
                        numColumns={2}
                        columnWrapperStyle={{ justifyContent: 'space-between', }}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => <CardManga item={item} id={id} />}
                    />
                </Column>
                </>
                }
                {type == 'Marcadores' && <>
                <Column style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10, paddingVertical: 30, }}>
                    <Image source={{ uri: 'https://i.pinimg.com/736x/4e/e7/c9/4ee7c956df651885166f2af1e53b0988.jpg'}} style={{ width: 100, height: 150, borderRadius: 12, transform: [{rotate: '12deg',}]  }} />
                    <Title style={{ fontSize: 24, marginTop: 8, }}>Sem marcadores</Title>
                    <Label style={{ textAlign: 'center', }}>Adicione marcadores para facilitar a organização</Label>
                    <Pressable style={{ backgroundColor: "#fff", borderRadius: 100, paddingVertical: 10, paddingHorizontal: 16, marginTop: 15,}}>
                        <Label style={{ color: "#000" }}>Adicionar marcador</Label>
                    </Pressable>
                </Column>
                  </>
                  }
                {type == 'Capitulos' && <>
                <Column style={{ paddingHorizontal: 20, marginTop: 10,  borderRadius: 16, }}>
                    <Row style={{ justifyContent: 'space-between', alignItems: 'center',  }}>
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
                        renderItem={({ item }) => <Card item={item} id={id} itm={itm} />}
                    />
                </Column>
                <Column style={{ marginTop: 20, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 16,  marginBottom: 20, }}>
                    <Row style={{ justifyContent: 'space-between', alignItems: 'center',  }}>

                    <Column>
                    <Title style={{ fontSize: 24, marginTop: 8, }}>Todos ({chapters?.length})</Title>
                    <Label style={{}}>Confira todos capítulos</Label>
                    </Column>
                    <Column style={{ justifyContent: 'center', alignItems: 'center',  }}>
                        <Pressable onPress={() => {setlidos(!lidos)}} >
                            <Check status={lidos}/>
                        </Pressable>
                    </Column>
                    </Row>
                    <ListChapters chapters={chapters} id={id} itm={itm} chaptersRead={chaptersRead} lidos={lidos}/>
                </Column>
                </>}

            </Scroll>
            <AnimatePresence> {headerShown &&  <Pressable onPress={scrollTop} style={{  position: 'absolute', right: 30, bottom: 30, }}>
                <MotiImage 
                from={{opacity: 0, transform: [{scale: 0}, {rotate: '0deg'}], }} 
                animate={{opacity: 1, transform: [{scale: 1}, {rotate: '16deg'}],}} 
                exit={{opacity: 0, transform: [{scale: 0}, {rotate: '0deg'}],}} 
                exitTransition={{ type: 'spring',  duration: 300, }} source={{ uri: item?.capa }} style={{ width:50, height: 70, borderRadius: 4, marginLeft: 80,borderWidth: 1, borderColor: color.title,}} /></Pressable>}</AnimatePresence>

            <Modalize ref={modalAdd} adjustToContentHeight handlePosition="inside" handleStyle={{ backgroundColor: '#d7d7d790' }} modalStyle={{ backgroundColor: "#171717", borderTopLeftRadius: 20, borderTopRightRadius: 20, }} >
                <Column>
                    <ModalAddCollection item={itm}/>
                </Column>
            </Modalize>

            <Modalize ref={modalDesc} adjustToContentHeight handlePosition="inside" handleStyle={{ backgroundColor: '#d7d7d790' }} modalStyle={{ backgroundColor: "#171717", borderTopLeftRadius: 20, borderTopRightRadius: 20, }}>
               <Column style={{ padding: 20, }}>
                <Title>Descrição</Title>
                <Label style={{  fontSize: 18, lineHeight: 26, }}>{item?.description}</Label>

                <Pressable onPress={() => { modalDesc.current?.close() }} style={{ paddingVertical: 12, paddingHorizontal: 24, backgroundColor: color.light , borderRadius: 100, alignSelf: 'center', marginVertical: 20, }}>
                        <Label style={{fontSize: 18, color: color.off, fontFamily: font.medium, }}>Fechar</Label>
                    </Pressable>
               </Column>
            </Modalize>
        </Main>
    )
}


const ListChapters = ({ chapters, id, itm, chaptersRead, lidos }) => {

    /*
     "pages": 35, 
     "volume": 8}, 
     */

     
    

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
                {pageNumbers.map((number) => (
                    <TouchableOpacity
                        key={number}
                        onPress={() => paginate(number)}
                        style={{ width: 42, height: 42, backgroundColor: number === currentPage ? '#FFF' : '#505050', borderRadius: 100, marginHorizontal: 10, justifyContent: 'center', alignItems: 'center', }}>
                        <Label style={{ color: number === currentPage ? '#000' : '#fff', fontSize: 24, fontFamily: 'Font_Medium', marginTop: -4, marginRight: -4, }}>{number} </Label>
                    </TouchableOpacity>
                ))}
            </Row>
        );
    };


    return (
        <Column style={{}}>
            <FlatList
                style={{ marginTop: 20, }}
                data={currentItems}
                keyExtractor={(item) => item.number}
                renderItem={({ item }) => <Card item={item} id={id} itm={itm} chaptersRead={chaptersRead} lidos={lidos} total={chapters}/>}
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

const Card = ({ item, id, itm, chaptersRead, lidos, total}) => {
    const { color, font } = useContext(ThemeContext);
    const read = chaptersRead?.includes(item.chapter);
    const navigation = useNavigation();
    if(lidos && read) return null;
    return (
        <Row style={{ backgroundColor: "#202020", paddingVertical: 10, justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, borderRadius: 6, opacity: read ? 0.4 : 1, }}>
            {read && <Title style={{ fontSize: 12, backgroundColor: color.green, paddingVertical: 4, paddingHorizontal: 8, borderBottomRightRadius: 6, borderTopLeftRadius: 6, position: 'absolute', top: 0, left: 0,  }}>Lido</Title>}
            <Row style={{ justifyContent: 'center', alignItems: 'center',  }}>
            <Title style={{ fontSize: 22, marginLeft: 20, }}>#{item?.chapter}</Title>

            <Column style={{ marginLeft: 20, }}>
                <Title style={{ fontSize: 16, }}>{item?.title} </Title>
                <Label style={{ fontSize: 12, }}>{item?.publish_date}</Label>
            </Column>
            </Row>
            <TouchableOpacity onPress={() => navigation.navigate('MangaPages', { chapter: item.chapter, id: item.id, itm: itm, total: total, })} style={{ backgroundColor: '#303030', padding: 12, borderRadius: 100, marginRight: 10, }} >
                <AntDesign name="arrowright" size={24} color="#fff" />
            </TouchableOpacity>
        </Row>
    )}

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
                <Column style={{width: 42, height: 42, backgroundColor: "#fff", borderRadius: 100,}}/>
            </Row>

            <Row style={{ marginTop: 20, }}>
                <Column style={{width: 100, height: 42, backgroundColor: "#fff", borderRadius: 100,}}/>
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


const Reaction = ({ reaction, }) => { return(
    <Row style={{ alignItems: 'center', justifyContent: 'space-between', padding: 12, backgroundColor: reaction_color, marginTop: 20, borderRadius: 12, }}>
    <Column style={{ marginRight: 14,  }}>
        <Image source={{ uri: reaction_image }} alt='reaction manga' width={44} height={44} />
    </Column>
    <Column style={{ flexGrow: 1, }}>
        <Title style={{ color: "#000", fontFamily: 'Font_Bold', letterSpacing: -1}}>{reaction}</Title>
        <Label style={{ color: "#303030", width: 170, fontSize: 14, }}>{reaction_desc}</Label>
    </Column>
    <Row style={{ backgroundColor: "#ffffff50", justifyContent: 'center', alignItems: 'center', borderRadius: 100, paddingHorizontal: 14, paddingVertical: 8, }}>
        <AntDesign name="staro" size={16} color="#000" />
        <Label style={{ fontFamily: 'Font_Medium', fontSize: 24, color: "#000", marginLeft: 6, }}>{item?.rate === 'Rate this mangas' ? 'Sem nota' : item?.rate}</Label>
    </Row>
</Row>

) }


const CardManga = React.memo(({ item }) => {
    const navigation = useNavigation();
    return (
        <Pressable onPress={() => { navigation.navigate('MangaDetails', {id: item.id });}} style={{ backgroundColor: "#303030", borderRadius: 6, width: 162, margin: 8, padding: 12, paddingBottom: 10, }}>
            <Image source={{ uri: item.capa }} style={{ width: 102, height: 152, borderRadius: 6, alignSelf: 'center', marginBottom: 6, }} />
            <Title style={{ fontSize: 16, textAlign: 'center', fontFamily: 'Font_Book', lineHeight: 18,}}>{item?.name.slice(0,50)}</Title>
        </Pressable>
    )
})
