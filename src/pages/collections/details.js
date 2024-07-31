import React, { useState, useRef, useEffect } from 'react';
import { Column, Main, Scroll, Row, Title, Label , } from '@theme/global';
import { FlatList, Pressable, Dimensions, Animated, TextInput } from 'react-native';

//icons
import { AntDesign, Feather, Ionicons, SimpleLineIcons } from '@expo/vector-icons';

//components
import { useNavigation } from '@react-navigation/native';
import { ExpandingDot } from "react-native-animated-pagination-dots";
import { AnimatePresence, MotiImage, MotiView, useAnimationState } from 'moti';
import { Skeleton } from 'moti/skeleton';
import SwipeableItem, { useSwipeableItemParams } from 'react-native-swipeable-item';

import Modal from '@components/modal/modal';
//hooks
import { editCollection, getCollection, removeCollection, removeMangaInCollection, requestCollectionsBackground } from '@hooks/collections';

const { width, height } = Dimensions.get('window');

export default function CollectionsDetailsPage({ navigation , route}) {
    const itm = route.params.item;
    const [item, setItem] = useState(itm);
    const [loading, setLoading] = useState(true);

    const [gridSelect, setGridSelect] = useState('grid1');
    const scrollX = useRef(new Animated.Value(0)).current;

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
    const [name, setName] = useState(item?.name);
    const [filter, setFilter] = useState('Lasted');
    const [backgrounds, setBackgrounds] = useState();

    const [confirm, setConfirm] = useState(false);
    const excludeCollection = async () => {   removeCollection(item.id).then((res) => {  if(res){ navigation.goBack();  } } ) }
    const updateCollection  = async () => { 
         editCollection(item.id, { capa: capa, name: name, mangas: item.mangas, date: item.date }).then((res) => {  if(res){ navigation.goBack();  } } )
     }


    useEffect(() => {
        const fetchData = async ( ) => {
            requestCollectionsBackground().then((res) => {
                setBackgrounds(res);
            })
        }
        fetchData();
    }, []);

    const refresh = () => { 
        setLoading(!loading)
    }
     
    useEffect(() => {
       const fetchData = () => { 
            setLoading(true);
            getCollection(itm.id).then((res) => {
                setItem(res);
            })
            setLoading(false);
        }
        fetchData();
       
     }, [ loading ])
     


    if(loading){
        return <SkeletonBody />
    }

    return (
        <Main>
            <Scroll>
                <MotiView 
                from={{ opacity: 0, translateY: -60, }}
                animate={{ opacity: 1, translateY: 0, }}
                transition={{ type: 'timing', duration: 300, delay: 500, }}
                >
                    <Row style={{ alignItems: 'center', marginTop: 20, }}>
                        <Pressable style={{ width: 42, height: 42, justifyContent: 'center', alignItems: 'center', }} onPress={() => navigation.goBack()} >
                            <AntDesign name="arrowleft" size={24} color="#fff" />
                        </Pressable>
                        <Row>

                            <MotiImage from={{opacity: 1,  scale: 0.3,  }}  animate={{ scale: 1,  }} transition={{ type: 'spring', duration: 500, delay: 700, }} source={{ uri: item.capa }} resizeMode='cover' style={{ width: 68, marginRight: 14, height: 68, borderRadius: 10, objectFit: 'cover', }} />
                            <Column style={{ justifyContent: 'center', }}>
                                <Title style={{ fontSize: 24, }}>{item?.name}</Title>
                                <Label style={{ fontSize: 18, }}>{item?.mangas.length} mangás • {item?.date}</Label>
                            </Column>
                        </Row>
                    </Row>
                </MotiView>

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

                {loading && <SkeletonList2 />}
                <FlatList
                    data={item?.mangas.slice(0, 4)}
                    keyExtractor={item => item.id}
                    horizontal
                    ListEmptyComponent={<EmptyList2 />}
                    style={{ paddingHorizontal: 20, }}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => <Cards item={item} />}
                />

                <Row style={{ marginTop: 30, marginBottom: 10, paddingHorizontal: 20, justifyContent: 'space-between', alignItems: 'center', }}>
                    <Title style={{ fontSize: 24, }}>Todos</Title>
                    <Row style={{ justifyContent: 'center', alignItems: 'center', }}>
                        <Pressable onPress={() => { setGridSelect('grid1') }} style={{ width: 32, height: 32, justifyContent: 'center', alignItems: 'center', borderRadius: 6, backgroundColor: gridSelect === 'grid1' ? '#404040' : 'transparent', }}>
                            <Ionicons name="grid-outline" size={18} color="#f7f7f7" />
                        </Pressable>
                        <Pressable onPress={() => { setGridSelect('grid2') }} style={{ width: 32, height: 32, justifyContent: 'center', alignItems: 'center', borderRadius: 6, backgroundColor: gridSelect === 'grid2' ? '#404040' : 'transparent', }}>
                            <AntDesign name="bars" size={18} color="#f7f7f7" />
                        </Pressable>
                        <Pressable onPress={() => { setGridSelect('grid3') }} style={{ width: 32, borderRadius: 6, backgroundColor: gridSelect === 'grid3' ? '#404040' : 'transparent', height: 32, justifyContent: 'center', alignItems: 'center', }}>
                            <SimpleLineIcons name="magic-wand" size={16} color="#fff" />
                        </Pressable>
                    </Row>
                </Row>

                <Column>
                    {gridSelect === 'grid1' && <FlatList
                        data={item?.mangas}
                        keyExtractor={item => item.id}
                        style={{ paddingHorizontal: 12, }}

                        showsHorizontalScrollIndicator={false}
                        ListEmptyComponent={<EmptyList1 />}
                        renderItem={({ item }) => <Grid1 item={item} collection={itm?.id} refresh={refresh}/>}
                    />}
                    {gridSelect === 'grid2' && <FlatList
                        data={item?.mangas}
                        keyExtractor={item => item.id}
                        numColumns={2}
                        style={{ paddingHorizontal: 12, }}
                        ListEmptyComponent={<EmptyList1 />}
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
            <Modal ref={modalSuggest} modalHeight={600} handlePosition="inside" handleStyle={{ backgroundColor: '#d7d7d790' }} modalStyle={{ backgroundColor: "#171717", borderTopLeftRadius: 20, borderTopRightRadius: 20, }} >
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
            </Modal>

            <Modal ref={modalFilters} adjustToContentHeight handlePosition="inside" handleStyle={{ backgroundColor: '#d7d7d790' }} modalStyle={{ backgroundColor: "#171717", borderTopLeftRadius: 20, borderTopRightRadius: 20, }} >
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
            </Modal>

            <Modal ref={modalEdit} adjustToContentHeight handlePosition="inside" handleStyle={{ backgroundColor: '#d7d7d790' }} modalStyle={{ backgroundColor: "#171717", borderTopLeftRadius: 20, borderTopRightRadius: 20, }} >
                <Column style={{ padding: 20, }}>
                    <Pressable onPress={() => setConfirm(true)} style={{ paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#EB575730',  borderRadius: 100, alignSelf: 'flex-end', marginVertical: 12,}}>
                        <Row style={{ justifyContent: 'center', alignItems: 'center',  }}>
                            <Feather name="trash-2" size={24} color="#EB5757" />
                            <Pressable onPress={excludeCollection}>
                                {confirm && <Label style={{ color: "#EB5757", marginLeft: 10, }}>Tem certeza disso?</Label>}
                            </Pressable>
                        </Row>
                    </Pressable>
                    
                    <MotiImage source={{ uri: capa }} style={{ width: 200, height: 200, borderRadius: 8, margin: 6, alignSelf: 'center',}} />
                    
                    
                    <Title style={{ fontSize: 28, marginTop: 10, }}>Nome</Title>
                    <TextInput value={name} placeholderTextColor="#f7f7f770" placeholder='Ex.: Meu Top 10' onChangeText={setName} style={{ fontFamily: 'Font_Book', height: 52, backgroundColor: "#303030", marginTop: 10, paddingLeft: 20, borderRadius: 5, fontSize: 24, borderBottomColor: "#FFFFFF90", borderBottomWidth: 2, color: "#fff" }} />
                  
                    <Title style={{ fontSize: 28, marginBottom: 10, marginTop: 10, }}>Fundos</Title>

                    <FlatList 
                        data={backgrounds}
                        keyExtractor={item => item}
                        horizontal  
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => 
                        <Pressable onPress={() => {setCapa(item)}} >
                            <MotiImage source={{ uri: item }} style={{ width: 100, height: 100, borderRadius: 8, margin: 6, borderWidth: 4, borderColor: item === capa ? "#fff" : 'transparent', }} />
                        </Pressable>}
                    />
                    
                    <Row style={{justifyContent: 'space-between', alignItems: 'center', marginTop: 20,}}>
                        <Pressable style={{ paddingVertical: 10, paddingHorizontal: 20, backgroundColor: "#303030", borderRadius: 40, flexGrow: 1,}}>
                            <Label style={{color: "#fff", textAlign: 'center', }}>Reverter e Fechar</Label>
                        </Pressable>

                        <Pressable onPress={updateCollection}  style={{ paddingVertical: 10, paddingHorizontal: 20, backgroundColor: "#fff", borderRadius: 40, flexGrow: 3, marginLeft: 12,}}>
                            <Label style={{color: "#000", textAlign: 'center'}}>Pronto</Label>
                        </Pressable>
                    </Row>
                </Column>
            </Modal>

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

const Grid1 = ({ item, collection, refresh }) => {
    const navigation = useNavigation();
    return (
        <SwipeableItem
        item={item}
        renderUnderlayLeft={() => <UnderlayLeft collection={collection} manga={item.id} refresh={refresh} />}
        snapPointsLeft={[150]}>
        <Pressable onPress={() => { navigation.navigate('MangaDetails', { id: item.id }); }} style={{ flexDirection: 'row', flexGrow: 1, padding: 12, borderBottomColor: '#303030', borderBottomWidth: 2, }}>
            <MotiImage source={{ uri: item.capa }} style={{ width: 56, height: 82, borderRadius: 6, alignSelf: 'center', marginBottom: 6, }} />
            <Column style={{ justifyContent: 'center', marginLeft: 20, }}>
                <Title style={{ fontSize: 22, }}>{item?.name.slice(0, 32)}</Title>
                <Label style={{ fontSize: 16, }}>{item?.rate} • {item?.type}</Label>
            </Column>
        </Pressable>
        </SwipeableItem>
    )
}

const UnderlayLeft = ({manga, collection, refresh}) => {
    const { close } = useSwipeableItemParams();
    const removeManga = () => { 
        removeMangaInCollection(collection, manga).then((res) => {  if(res){ close(); refresh()} } )
     }
    return (
      <Row style={{ backgroundColor: "#505050", position: 'absolute', right: 20, justifyContent: 'flex-end', alignItems: 'center',  }}>
        <Pressable onPress={removeManga}>
          <Title>CLOSE</Title>
        </Pressable>
      </Row>
    );
  };

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

 const SkeletonList2 = () => { 
    return(
         <Row>
                <Skeleton width={164} height={184} radius={8} />
                <Spacer width={16} height={10} />
                <Skeleton width={164} height={184} radius={8} />
                <Spacer width={16} height={10} />
                <Skeleton width={164} height={184} radius={8} />
            </Row>
    )
 }

 const EmptyList2 = () => { 
    return(
        <Row style={{ justifyContent: 'center', alignItems: 'center', backgroundColor:'#303030', flexGrow: 1, padding: 12, borderRadius: 12, }}>
            <Ionicons name="add-circle-outline" size={32} color="#d4d4d4" />
            <Column style={{ marginLeft: 12, }}>
                <Title style={{ fontSize: 18, }}>Nenhum mangá adicionado ainda</Title>
                <Label style={{ fontSize: 16, }}>Escolha o mangá e clique no ícone de + e  {'\n'}salve aqui.</Label>
            </Column>
        </Row>
        )
 }

 
 const EmptyList1 = () => { 
    return(
        <Column style={{ justifyContent: 'center', alignItems: 'center', backgroundColor:'#303030', flexGrow: 1, marginHorizontal: 10,  paddingVertical: 50, paddingHorizontal: 20, borderRadius: 12, }}>
            <Ionicons name="add-circle-outline" size={102} color="#d4d4d4" />
            <Column style={{ marginLeft: 12, }}>
                <Title style={{ fontSize: 22, textAlign: 'center',  marginTop: 12,}}>Nenhum mangá adicionado ainda</Title>
                <Label style={{ fontSize: 18, textAlign: 'center', marginTop: 6, }}>Escolha o mangá e clique no ícone de + e salve aqui.</Label>
            </Column>
        </Column>
        )
 }

const Spacer = ({ height = 16, width = 16, }) => <Column style={{ height, width }} />