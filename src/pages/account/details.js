import React, { useState, useRef, useEffect } from 'react';
import { Column, Main, Scroll, Row, Title, Label , } from '../../theme/global';
import { FlatList, Pressable, Dimensions, Animated } from 'react-native';
import { AntDesign, Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Modalize } from 'react-native-modalize';
import { ExpandingDot } from "react-native-animated-pagination-dots";
import { AnimatePresence, MotiImage, MotiView, useAnimationState } from 'moti';
import { Skeleton } from 'moti/skeleton';
import { requestCollectionsBackground } from '../../api/shop/collections';

const { width, height } = Dimensions.get('window');

export default function CollectionsDetailsPage({ navigation , route}) {

    const itma = {
        name: 'Curtidos',
        capa: 'https://i.pinimg.com/564x/35/d9/86/35d986ff686546bc4c505fc6e2c378ef.jpg',
        date: '22 de Jun, 2024',
        mangas: [{ "id": "radio-storm", "name": "Boruto: Naruto Next Generations", "capa": "https://i.pinimg.com/564x/f2/08/27/f208270bcd5f5dfeeba8f5872d314622.jpg", "rate": 4.5, "type": 'Mangá' }, { "rate": 4.5, "type": 'Mangá', "id": "black-clover", "name": "Black Clover", "capa": "https://img.lermanga.org/B/black-clover/capa.jpg" }, { "id": "worn-and-torn-newbie", "name": "Worn and Torn Newbie", "capa": "https://img.lermanga.org/W/worn-and-torn-newbie/capa.jpg" }, { "id": "niraikanai-harukanaru-ne-no-kuni", "name": "Niraikanai: Harukanaru Ne no Kuni", "capa": "https://img.lermanga.org/N/niraikanai-harukanaru-ne-no-kuni/capa.jpg" }, { "id": "dead-rock", "name": "Dead Rock", "capa": "https://img.lermanga.org/D/dead-rock/capa.jpg" }, { "id": "apotheosis", "name": "Apotheosis", "capa": "https://img.lermanga.org/A/apotheosis/capa.jpg" }, { "id": "even-the-captain-knight-miss-elf-wants-to-be-a-maiden-", "name": "Even the Captain Knight, Miss Elf, Wants to be a Maiden.", "capa": "https://img.lermanga.org/E/even-the-captain-knight-miss-elf-wants-to-be-a-maiden-/capa.jpg" }, { "id": "1-second", "name": "1 Second", "capa": "https://img.lermanga.org/0/1-second/capa.jpg" }, { "id": "jinzou-ningen-100", "name": "Jinzou Ningen 100", "capa": "https://img.lermanga.org/J/jinzou-ningen-100/capa.jpg" }, { "id": "tensei-shitara-dragon-no-tamago-datta-ibara-no-dragon-road", "name": "Tensei shitara Dragon no Tamago datta: Ibara no Dragon Road", "capa": "https://img.lermanga.org/T/tensei-shitara-dragon-no-tamago-datta-ibara-no-dragon-road/capa.jpg" }, { "id": "gantze", "name": "Gantz:E", "capa": "https://img.lermanga.org/G/gantze/capa.jpg" }]
    }

    const itm = route.params.item;
    const [item, setItem] = useState(itm);
    const [loading, setLoading] = useState(true);

    const [gridSelect, setGridSelect] = useState('grid1');
    const scrollX = React.useRef(new Animated.Value(0)).current;

    const modalSuggest = useRef(null);
    const openSuggest = () => {
        modalSuggest.current?.open();
    }

    const modalFilters = useRef(null);
    const openFilters = () => {
        modalFilters.current?.open();
    }

    const modalEdit = useRef(null);
    const openEdit = () => {
        modalEdit.current?.open();
    }

    const [capa, setCapa] = useState(item?.capa);
    const [unsetCapa, setUnsetCapa] = useState();
    const [filter, setFilter] = useState('Lasted');
    const [backgrounds, setBackgrounds] = useState();

    useEffect(() => {
        const fetchData = async ( ) => {
            setLoading(true);
            requestCollectionsBackground().then((res) => {
                setBackgrounds(res);
                setLoading(false);
            })
        }
        fetchData();
    }, []);


    if(loading){
        return <SkeletonBody />
    }

    return (
        <Main>
            <Scroll>
                

                <Row style={{ alignItems: 'center', marginTop: 50, }}>
                    <Pressable style={{ width: 42, height: 42, justifyContent: 'center', alignItems: 'center', }} onPress={() => navigation.goBack()} >
                        <AntDesign name="arrowleft" size={24} color="#fff" />
                    </Pressable>
                    <Row>

                        <MotiImage source={{ uri: item.capa }} resizeMode='cover' style={{ width: 68, marginRight: 14, height: 68, borderRadius: 10, objectFit: 'cover', }} />
                        <Column style={{ justifyContent: 'center', }}>
                            <Title style={{ fontSize: 24, }}>{item?.name}</Title>
                            <Label style={{ fontSize: 18, }}>{item?.mangas.length} mangás • {item?.date}</Label>
                        </Column>
                    </Row>
                </Row>

                <Row style={{ marginHorizontal: 20, marginVertical: 30, }}>
                    <Pressable style={{ paddingVertical: 10, paddingHorizontal: 20, backgroundColor: "#fff", borderRadius: 40, }}>
                        <Title style={{ color: "#000", fontSize: 18, }}>Recentes</Title>
                    </Pressable>
                    <Pressable onPress={openFilters} style={{ paddingVertical: 10, marginHorizontal: 12, paddingHorizontal: 20, backgroundColor: "#303030", borderRadius: 40, }}>
                        <Title style={{ color: "#d7d7d7", fontSize: 18, }}>Filtros</Title>
                    </Pressable>
                    <Pressable onPress={openEdit} style={{ paddingVertical: 10, paddingHorizontal: 20, backgroundColor: "#303030", borderRadius: 40, }}>
                        <Title style={{ color: "#d7d7d7", fontSize: 18, }}>Editar</Title>
                    </Pressable>
                </Row>

                <FlatList
                    data={item?.mangas.slice(0, 4)}
                    keyExtractor={item => item.id}
                    horizontal
                    style={{ paddingHorizontal: 20, }}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => <Cards item={item} />}
                />

                <Row style={{ marginTop: 30, marginBottom: 10, paddingHorizontal: 20, justifyContent: 'space-between', alignItems: 'center', }}>
                    <Title style={{ fontSize: 24, }}>Todos</Title>
                    <Row style={{ justifyContent: 'center', alignItems: 'center', }}>
                        <Pressable onPress={() => { setGridSelect('grid1') }} style={{ width: 32, height: 32, justifyContent: 'center', alignItems: 'center', borderRadius: 6, backgroundColor: gridSelect === 'grid1' ? '#404040' : 'transparent', }}>
                            <Ionicons name="grid-outline" size={24} color="#f7f7f7" />
                        </Pressable>
                        <Pressable onPress={() => { setGridSelect('grid2') }} style={{ width: 32, height: 32, justifyContent: 'center', alignItems: 'center', borderRadius: 6, backgroundColor: gridSelect === 'grid2' ? '#404040' : 'transparent', }}>
                            <AntDesign name="bars" size={24} color="#f7f7f7" />
                        </Pressable>
                        <Pressable onPress={() => { setGridSelect('grid3') }} style={{ width: 32, borderRadius: 6, backgroundColor: gridSelect === 'grid3' ? '#404040' : 'transparent', height: 32, justifyContent: 'center', alignItems: 'center', }}>
                            <SimpleLineIcons name="magic-wand" size={20} color="#fff" />
                        </Pressable>
                    </Row>
                </Row>

                <Column>
                    {gridSelect === 'grid1' && <FlatList
                        data={item?.mangas}
                        keyExtractor={item => item.id}
                        style={{ paddingHorizontal: 12, }}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => <Grid1 item={item} />}
                    />}
                    {gridSelect === 'grid2' && <FlatList
                        data={item?.mangas}
                        keyExtractor={item => item.id}
                        numColumns={2}
                        style={{ paddingHorizontal: 12, }}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => <Grid2 item={item} />}
                    />}
                    {gridSelect === 'grid3' && <Column style={{ width: width, height: 1.05 * height, }}>
                        <Pressable onPress={() => { setGridSelect('grid1') }} style={{ flexGrow: 1, padding: 12, position: 'absolute', top: 30, zIndex: 99, }}>
                            <AntDesign name="arrowleft" size={24} color="#fff" />
                        </Pressable>
                        <FlatList
                            data={item?.mangas}
                            keyExtractor={item => item.id}
                            horizontal
                            onScroll={Animated.event(
                                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                                {
                                    useNativeDriver: false,
                                }
                            )}
                            showsHorizontalScrollIndicator={false}
                            pagingEnabled
                            renderItem={({ item }) => <Grid3 item={item} />}
                        />
                        <ExpandingDot
                            data={item?.mangas}
                            expandingDotWidth={30}
                            scrollX={scrollX}
                            inActiveDotOpacity={0.4}
                            dotStyle={{
                                width: 10,
                                height: 10,
                                backgroundColor: '#f7f7f7',
                                borderRadius: 5,
                                marginHorizontal: 5
                            }}
                            containerStyle={{
                                bottom: 30,
                                alignSelf: 'flex-start',
                                marginLeft: 30,
                                backgroundColor: "#f7f7f780",
                                padding: 12,
                                borderRadius: 100,
                            }}
                        />
                    </Column>}

                </Column>


            </Scroll>

            <Action openSuggest={openSuggest} openFilters={openFilters} openEdit={openEdit} />
            <Modalize ref={modalSuggest} modalHeight={600} handlePosition="inside" handleStyle={{ backgroundColor: '#d7d7d790' }} modalStyle={{ backgroundColor: "#171717", borderTopLeftRadius: 20, borderTopRightRadius: 20, }} >
                <Column style={{ padding: 20, }}>
                    <Title style={{ fontSize: 28, marginBottom: 10, marginTop: 10, }}>Sugestões</Title>
                    <FlatList
                        data={item?.mangas}
                        keyExtractor={item => item.id}
                        numColumns={2}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => <Grid2 item={item} />}
                    />
                </Column>
            </Modalize>

            <Modalize ref={modalFilters} adjustToContentHeight handlePosition="inside" handleStyle={{ backgroundColor: '#d7d7d790' }} modalStyle={{ backgroundColor: "#171717", borderTopLeftRadius: 20, borderTopRightRadius: 20, }} >
                <Column style={{ padding: 20, }}>
                    <Title style={{ fontSize: 28, marginBottom: 10, marginTop: 10, }}>Filtros</Title>
                    <Title style={{ fontSize: 24, marginBottom: 10, marginTop: 10, }}>Mostrar primeiro</Title>
                    <Row style={{justifyContent: 'space-between', alignItems: 'center', }}>
                        <Label>Recém adicionados</Label>
                        <Pressable onPress={() => {setFilter('Lasted')}} >
                            <Row style={{backgroundColor: filter === "Lasted" ? '#ED274A' : "#303030", borderRadius: 100, width: 64, padding: 6, justifyContent: filter === "Lasted" ? 'flex-end' : 'flex-start' }}>
                                <Column style={{ justifyContent: 'center', alignItems: 'center', width: 24, height: 24, borderRadius: 100,  backgroundColor: filter === "Lasted" ? "#fff" : "#606060",  }}/>
                            </Row>
                        </Pressable>
                    </Row>

                    <Row style={{justifyContent: 'space-between', alignItems: 'center', marginVertical: 12,}}>
                        <Label>Melhor nota</Label>
                        <Pressable onPress={() => {setFilter('Rate')}} >
                            <Row style={{backgroundColor: filter === "Rate" ? '#ED274A' : "#303030", borderRadius: 100, width: 64, padding: 6, justifyContent: filter === "Rate" ? 'flex-end' : 'flex-start' }}>
                                <Column style={{ justifyContent: 'center', alignItems: 'center', width: 24, height: 24, borderRadius: 100,  backgroundColor: filter === "Rate" ? "#fff" : "#606060",  }}/>
                            </Row>
                        </Pressable>
                    </Row>

                    <Row style={{justifyContent: 'space-between', alignItems: 'center', }}>
                        <Label>Tipo</Label>
                        <Pressable onPress={() => {setFilter('Type')}} >
                            <Row style={{backgroundColor: filter === "Type" ? '#ED274A' : "#303030", borderRadius: 100, width: 64, padding: 6, justifyContent: filter === "Type" ? 'flex-end' : 'flex-start' }}>
                                <Column style={{ justifyContent: 'center', alignItems: 'center', width: 24, height: 24, borderRadius: 100,  backgroundColor: filter === "Type" ? "#fff" : "#606060",  }}/>
                            </Row>
                        </Pressable>
                    </Row>
                  
                </Column>
            </Modalize>

            <Modalize ref={modalEdit} adjustToContentHeight handlePosition="inside" handleStyle={{ backgroundColor: '#d7d7d790' }} modalStyle={{ backgroundColor: "#171717", borderTopLeftRadius: 20, borderTopRightRadius: 20, }} >
                <Column style={{ padding: 20, }}>
                    <MotiImage source={{ uri: capa }} style={{ width: 200, height: 200, borderRadius: 8, margin: 6, alignSelf: 'center',}} />
                    <Title style={{ fontSize: 28, marginBottom: 10, marginTop: 10, }}>Fundos</Title>

                    <FlatList 
                        data={backgrounds}
                        keyExtractor={item => item}
                        horizontal  
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => 
                        <Pressable onPress={() => {setUnsetCapa(item)}} >
                            <MotiImage source={{ uri: item }} style={{ width: 100, height: 100, borderRadius: 8, margin: 6, borderWidth: 4, borderColor: item === unsetCapa ? "#fff" : 'transparent', }} />
                        </Pressable>}
                    />
                    
                    <Row style={{justifyContent: 'space-between', alignItems: 'center', marginTop: 20,}}>
                        <Pressable style={{ paddingVertical: 10, paddingHorizontal: 20, backgroundColor: "#303030", borderRadius: 40, flexGrow: 1,}}>
                            <Label style={{color: "#fff", textAlign: 'center', }}>Reverter e Fechar</Label>
                        </Pressable>

                        <Pressable onPress={() => {setCapa(unsetCapa); modalEdit.current?.close()}}  style={{ paddingVertical: 10, paddingHorizontal: 20, backgroundColor: "#fff", borderRadius: 40, flexGrow: 3, marginLeft: 12,}}>
                            <Label style={{color: "#000", textAlign: 'center'}}>Pronto</Label>
                        </Pressable>
                    </Row>
                </Column>
            </Modalize>

        </Main>
    )
}


const Cards = ({ item }) => {
    const navigation = useNavigation();
    return (
        <Pressable onPress={() => { navigation.navigate('MangaDetails', { id: item.id }); }} style={{ backgroundColor: "#303030", borderRadius: 6, width: 162, marginRight: 16, padding: 12, paddingBottom: 20, }}>
            <MotiImage source={{ uri: item.capa }} style={{ width: 102, height: 152, borderRadius: 6, alignSelf: 'center', marginBottom: 6, }} />
            <Title style={{ fontSize: 18, }}>{item?.name.slice(0, 12)}</Title>
            <Label style={{ fontSize: 14, }}>{item?.rate} • {item?.type}</Label>
        </Pressable>
    )
}


const Grid2 = ({ item }) => {
    const navigation = useNavigation();
    return (
        <Pressable onPress={() => { navigation.navigate('MangaDetails', { id: item.id }); }} style={{ backgroundColor: "#303030", borderRadius: 6, flexGrow: 1, margin: 8, padding: 12, paddingBottom: 20, }}>
            <MotiImage source={{ uri: item.capa }} style={{ width: 102, height: 152, borderRadius: 6, alignSelf: 'center', marginBottom: 6, }} />
            <Title style={{ fontSize: 18, }}>{item?.name.slice(0, 12)}</Title>
            <Label style={{ fontSize: 14, }}>{item?.rate} • {item?.type}</Label>
        </Pressable>
    )
}



const Grid1 = ({ item }) => {
    const navigation = useNavigation();
    return (
        <Pressable onPress={() => { navigation.navigate('MangaDetails', { id: item.id }); }} style={{ flexDirection: 'row', flexGrow: 1, padding: 12, borderBottomColor: '#303030', borderBottomWidth: 2, }}>
            <MotiImage source={{ uri: item.capa }} style={{ width: 56, height: 82, borderRadius: 6, alignSelf: 'center', marginBottom: 6, }} />
            <Column style={{ justifyContent: 'center', marginLeft: 20, }}>
                <Title style={{ fontSize: 22, }}>{item?.name.slice(0, 32)}</Title>
                <Label style={{ fontSize: 16, }}>{item?.rate} • {item?.type}</Label>
            </Column>
        </Pressable>
    )
}


const Grid3 = ({ item }) => {
    const navigation = useNavigation();
    return (
        <Column style={{ width: width, paddingVertical: 120 }}>
            <MotiImage blurRadius={100} source={{ uri: item.capa }} style={{ width: width, height: 1.1 * height, position: 'absolute', top: 0, left: 0, }} />

            <MotiImage source={{ uri: item.capa }} style={{ width: 242, height: 358, transform: [{ rotate: '-6deg' }], borderRadius: 6, alignSelf: 'center', marginBottom: 6, }} />
            <Title style={{ fontSize: 60, letterSpacing: -2, marginHorizontal: 32, lineHeight: 56, marginTop: 40, }}>{item?.name.slice(0, 52)}</Title>
            <Label style={{ fontSize: 32, marginHorizontal: 32, color: "#fff", textAlign: 'right', marginTop: 10, marginBottom: -10, }}>{item?.rate} • {item?.type}</Label>

            <Pressable onPress={() => { navigation.navigate('MangaDetails', { id: item.id }); }} style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', flexGrow: 1, padding: 12, }}>
                <Column style={{ justifyContent: 'center', marginLeft: 20, flexGrow: 1, height: 2, backgroundColor: "#fff", marginRight: -10, }} />
                <AntDesign name="arrowright" size={24} color="#fff" />
            </Pressable>
        </Column>
    )
}

const Action = ({ openSuggest, openFilters, openEdit }) => {
    const [toggleIsOpen, setToggleIsOpen] = useState(false);
    const toggleAnimation = useAnimationState({
        close: {
            width: 60,
        },
        open: {
            width: 380,
        },
    });
    const handleOpenToggle = () => {
        toggleAnimation.transitionTo('open');
        setToggleIsOpen(true)
    }
    const handleCloseToggle = () => {
        toggleAnimation.transitionTo('close');
        setToggleIsOpen(false)
    }
    return (
        <Row style={{ zIndex: 99, position: 'absolute', bottom: 15, right: 15, justifyContent: 'center', alignItems: 'center', }}>
            <AnimatePresence>
                <MotiView state={toggleAnimation} transition={{ type: 'timing', }} style={{ width: 0, height: 60, backgroundColor: '#303030', borderRadius: 100, marginRight: -51, }}>
                    {toggleIsOpen &&
                        <MotiView from={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1, }} transition={{ type: 'timing', duration: 300, }}>
                            <Row style={{ paddingHorizontal: 12, alignItems: 'center', height: 60, }}>
                                <Pressable onPress={openSuggest} style={{ paddingVertical: 10, paddingHorizontal: 20, backgroundColor: "#fff", borderRadius: 40, }}>
                                    <Title style={{ color: "#000", fontSize: 18, letterSpacing: 0, }}>Sugestões</Title>
                                </Pressable>
                                <Pressable onPress={openFilters} style={{ paddingVertical: 10, marginHorizontal: 12, paddingHorizontal: 20, backgroundColor: "#505050", borderRadius: 40, }}>
                                    <Title style={{ color: "#FFF", fontSize: 18, letterSpacing: 0, }}>Filtros</Title>
                                </Pressable>
                                <Pressable onPress={openEdit} style={{ paddingVertical: 10, paddingHorizontal: 20, backgroundColor: "#505050", borderRadius: 40, }}>
                                    <Title style={{ color: "#FFF", fontSize: 18, letterSpacing: 0, }}>Editar</Title>
                                </Pressable>
                            </Row>
                        </MotiView>}
                </MotiView>
            </AnimatePresence>

            <Pressable style={{ width: 42, height: 42, justifyContent: 'center', alignItems: 'center', borderRadius: 100, backgroundColor: "#ED274A" }} onPress={toggleIsOpen ? handleCloseToggle : handleOpenToggle} >

                {toggleIsOpen ? <MotiView from={{ scale: 1, rotate: '3deg', }} animate={{ scale: 1.3, rotate: '45deg' }} transition={{ type: 'timing', duration: 300, }}>
                    <AntDesign name="plus" size={24} color="#fff" />
                </MotiView> : <MotiView from={{ scale: 1, rotate: '45deg', }} animate={{ scale: 1.2, rotate: '0deg', }} transition={{ type: 'timing', duration: 300, }}>
                    <AntDesign name="plus" size={24} color="#fff" />
                </MotiView>}

            </Pressable>


        </Row>
    )
}


const SkeletonBody = () => {
  return(
    <Main>
        <Column style={{paddingHorizontal: 20, paddingVertical: 50,}}>
            <Row>
                <Skeleton width={58} height={58}/>
                <Column style={{marginLeft: 20,}}>
                    <Skeleton width={180} height={28} radius={4}/>
                    <Spacer width={0} height={8}/>
                    <Skeleton width={232} height={20} radius={4}/>
                </Column>
            </Row>

            <Row style={{justifyContent: 'space-between', alignItems: 'center', marginTop: 20,}}>
                <Column style={{width: 144, height: 38, borderRadius: 100, backgroundColor: "#fff", }}/>
                <Spacer width={16} height={10} />
                <Skeleton width={144} height={38} radius={100} />
                <Spacer width={16} height={10} />
                <Skeleton width={124} height={38} radius={100} />
            </Row>

            <Spacer width={24} height={24} />
            <Row>
                <Skeleton width={164} height={184} radius={8} />
                <Spacer width={16} height={10} />
                <Skeleton width={164} height={184} radius={8} />
                <Spacer width={16} height={10} />
                <Skeleton width={164} height={184} radius={8} />
            </Row>

            <Spacer width={24} height={24} />
            <Row style={{justifyContent: 'space-between', alignItems: 'center', }}>
                <Skeleton width={90} height={32} radius={4} />
                <Skeleton width={100} height={32} radius={4} />
            </Row>
            <Spacer width={24} height={14} />
            <Column>
                <Row style={{borderBottomColor: '#303030', borderBottomWidth: 2, paddingBottom: 20, marginTop: 12,}}>
                    <Skeleton width={64} height={84} radius={6} />
                    <Spacer width={16} height={10} />
                    <Column style={{justifyContent: 'center',  }}>
                        <Skeleton width={164} height={34} radius={4} />
                        <Spacer width={16} height={10} />
                        <Skeleton width={124} height={24} radius={4} />
                    </Column>
                </Row>
                <Row style={{borderBottomColor: '#303030', borderBottomWidth: 2, paddingBottom: 20, marginTop: 20,}}>
                    <Skeleton width={64} height={84} radius={6} />
                    <Spacer width={16} height={10} />
                    <Column style={{justifyContent: 'center',  }}>
                        <Skeleton width={164} height={34} radius={4} />
                        <Spacer width={16} height={10} />
                        <Skeleton width={124} height={24} radius={4} />
                    </Column>
                </Row>
                <Row style={{borderBottomColor: '#303030', borderBottomWidth: 2, paddingBottom: 20, marginTop: 20,}}>
                    <Skeleton width={64} height={84} radius={6} />
                    <Spacer width={16} height={10} />
                    <Column style={{justifyContent: 'center',  }}>
                        <Skeleton width={164} height={34} radius={4} />
                        <Spacer width={16} height={10} />
                        <Skeleton width={124} height={24} radius={4} />
                    </Column>
                </Row>
                <Row style={{borderBottomColor: '#303030', borderBottomWidth: 2, paddingBottom: 20, marginTop: 20,}}>
                    <Skeleton width={64} height={84} radius={6} />
                    <Spacer width={16} height={10} />
                    <Column style={{justifyContent: 'center',  }}>
                        <Skeleton width={164} height={34} radius={4} />
                        <Spacer width={16} height={10} />
                        <Skeleton width={124} height={24} radius={4} />
                    </Column>
                </Row>
            </Column>

        </Column>
    </Main>
  )
}



const Spacer = ({ height = 16, width = 16, }) => <Column style={{ height, width }} />