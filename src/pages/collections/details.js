import React, { useState, useRef, useEffect, useContext, useMemo } from 'react';
import { Column, Main, Scroll, Row, Title, Label, Button } from '@theme/global';
import { Pressable, Dimensions, Animated as RAnimated, TextInput, Animated as RNAnimated } from 'react-native';

import { Image } from 'expo-image'
//icons
import { AntDesign, Feather, Ionicons, } from '@expo/vector-icons';

//components
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { ExpandingDot } from "react-native-animated-pagination-dots";
import { AnimatePresence, MotiImage, MotiView, useAnimationState } from 'moti';
import { Skeleton } from 'moti/skeleton';

import Modal from '@components/modal/modal';
//hooks
import { editCollection, getCollection, removeCollection, removeMangaInCollection, requestCollectionsBackground } from '@hooks/collections';
import { ThemeContext } from 'styled-components/native';

import { GestureHandlerRootView, GestureDetector, Gesture, ScrollView, FlatList } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    runOnJS,
} from 'react-native-reanimated';
import { ArrowRight, Trash, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { tags } from '@hooks/tags';
import Check from '@components/check';

const { width, height } = Dimensions.get('window');

export default function CollectionsDetailsPage({ navigation, route }) {
    const itm = route.params?.item
    const [item, setItem] = useState(itm);
    const [loading, setLoading] = useState(true);

    const { color, font } = useContext(ThemeContext)
    const [capa, setCapa] = useState();
    const [name, setName] = useState();
    const [focusName, setfocusName] = useState(false);

    const scrollX = useRef(new RAnimated.Value(0)).current;

    const modalFilters = useRef(null);
    const modalEdit = useRef(null);
    const [confirm, setConfirm] = useState(false);
    const [filter, setFilter] = useState(false);
    const [backgrounds, setBackgrounds] = useState();
    const [selectedItems, setSelectedItems] = useState([]);
    const handleItemClick = (item) => {
        const itemsCopy = [...selectedItems];
        const index = itemsCopy.findIndex(selectedItem => selectedItem.id === item.id);
        if (index > -1) {
            itemsCopy.splice(index, 1);
        } else if (selectedItems.length < 4) {
            itemsCopy.push(item);
        }
        setSelectedItems(itemsCopy);
    };


    const excludeCollection = async () => {
        try {
            const res = await removeCollection(item.id)
            navigation.goBack()
        } catch (error) {
            console.log(error)
        }
    }

    const updateCollection = async () => {
        try {
            const res = await editCollection(item.id, { capa: capa, name: name, mangas: item.mangas, date: item.date, genres: selectedItems })
            modalEdit.current?.close();
            fetchData();
        } catch (error) {
            console.log(error)
        }
    }

    const [rate, setrate] = useState();
    const [lasted, setlasted] = useState();

    const fetchData = async () => {
        setLoading(true)
        try {
            const res = await requestCollectionsBackground()
            const col = await getCollection(itm.id);
            setItem(col);
            setCapa(col?.capa)
            setName(col?.name)
            setSelectedItems(col?.genres)
            const rates = col?.mangas.sort((a, b) => parseFloat(b.rate) - parseFloat(a.rate));
            setrate(rates)
            setBackgrounds(res);
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const isFocused = useIsFocused();
    useEffect(() => {
        fetchData();
    }, [isFocused])

    const renderItem = useMemo(
        () => ({ item }) => <Grid item={item} collection={itm?.id} />,
        [itm?.id]
    );

    const keyExtractor = useMemo(
        () => (item) => item.id.toString(),
        []
    );

    if (loading) { return <SkeletonBody /> }

    return (
        <Main>
            <Scroll>
                <Column style={{ paddingHorizontal: 20, }}>
                    <Row style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: 20, }}>
                        <Button style={{ width: 42, height: 42, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderRadius: 100, }} onPress={() => navigation.goBack()} >
                            <AntDesign name="arrowleft" size={24} color="#000" />
                        </Button>
                        <Button onPress={() => { modalEdit.current?.expand() }} style={{ paddingVertical: 10, paddingHorizontal: 16, backgroundColor: "#303030", borderRadius: 40, }}>
                            <Title style={{ color: "#fff", fontSize: 16, }}>Editar</Title>
                        </Button>
                    </Row>
                    <Column style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: -2, }}>
                        <Image blurRadius={40} source={{ uri: item?.capa }} style={{ height: 300, flexGrow: 1, justifyContent: 'center', }} />
                        <LinearGradient colors={['transparent', '#171717']} style={{ width: '100%', height: 200, marginTop: -198, }} />
                    </Column>
                    <Column style={{ overflow: 'hidden', borderRadius: 12, marginVertical: 12, }}>
                        <DraggableImage source={{ uri: item?.capa }} />
                    </Column>

                    <Column style={{ justifyContent: 'center', }}>
                        <Title style={{ fontSize: 22, letterSpacing: -1, }}>{item?.name}</Title>
                        <Label style={{ fontSize: 16, marginVertical: 4, letterSpacing: -1, }}>{item?.mangas?.length} mangás • {item?.date}</Label>
                    </Column>
                </Column>

                <Row style={{ marginTop: 20, marginBottom: 10, paddingHorizontal: 20, justifyContent: 'space-between', alignItems: 'center', }}>
                    <Title style={{ fontSize: 24, }}>Todos</Title>
                    <Button onPress={() => { modalFilters.current?.expand() }} style={{ paddingVertical: 8, paddingHorizontal: 16, backgroundColor: "#303030", borderRadius: 40, }}>
                        <Title style={{ color: "#fff", fontSize: 16, }}>Filtros</Title>
                    </Button>
                </Row>
                <FlatList
                    data={filter ? rate : item?.mangas}
                    keyExtractor={keyExtractor}
                    windowSize={5}
                    getItemLayout={(data, index) => ({
                        length: 80,
                        offset: 80 * index,
                        index,
                    })}
                    showsHorizontalScrollIndicator={false}
                    removeClippedSubviews
                    maxToRenderPerBatch={5}
                    initialNumToRender={5}
                    updateCellsBatchingPeriod={100}
                    ListFooterComponent={<Column style={{ height: 30, }}></Column>}
                    ListEmptyComponent={<EmptyList />}
                    renderItem={renderItem}
                />
            </Scroll>

            <Modal ref={modalFilters} snapPoints={[0.1, 260]} >
                <Column style={{ paddingHorizontal: 20, }}>
                    <Title style={{ fontSize: 24, marginBottom: 10, letterSpacing: -1, }}>Mostrar primeiro</Title>

                    <Row style={{ justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20, paddingHorizontal: 20, backgroundColor: '#303030', borderRadius: 20, marginVertical: 12, }}>
                        <Title style={{ fontSize: 18, color: "#fff", }}>Recém adicionados</Title>
                        <Button onPress={() => { setFilter(true) }} style={{ borderRadius: 100, }}>
                            <Check status={filter} />
                        </Button>
                    </Row>
                    <Row style={{ justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20, paddingHorizontal: 20, backgroundColor: '#303030', borderRadius: 20, }}>
                        <Title style={{ fontSize: 18, color: "#fff", }}>Melhor nota</Title>
                        <Button onPress={() => { setFilter(false) }} style={{ borderRadius: 100, }}>
                            <Check status={!filter} />
                        </Button>
                    </Row>

                </Column>
            </Modal>

            <Modal ref={modalEdit} snapPoints={[0.1, height]}>
                <Column style={{}}>
                    <Row style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: -10, paddingHorizontal: 20, }}>
                        <Button onPress={() => { modalCreate.current?.close(); setisOpen(false); }} style={{ width: 42, height: 42, backgroundColor: '#fff', borderRadius: 100, justifyContent: 'center', alignItems: 'center', }} >
                            <X name="arrowleft" size={20} color="#000" />
                        </Button>
                        <Title style={{ fontSize: 20, letterSpacing: -1, textAlign: 'center', }}>Editar coleção</Title>
                        <Pressable onPress={() => setConfirm(true)} style={{ paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#EB575730', borderRadius: 100, alignSelf: 'flex-end', marginVertical: 12, }}>
                            <Row style={{ justifyContent: 'center', alignItems: 'center', }}>
                                <Feather name="trash-2" size={24} color="#EB5757" />
                                <Pressable onPress={excludeCollection}>
                                    {confirm && <Label style={{ color: "#EB5757", marginLeft: 10, }}>Confirme</Label>}
                                </Pressable>
                            </Row>
                        </Pressable>
                    </Row>

                    <Column style={{ paddingHorizontal: 20, }}>
                        <Title style={{ fontSize: 20, letterSpacing: -0.6, marginTop: 10, }}>Nome *</Title>
                        <TextInput onFocus={() => setfocusName(true)} onBlur={() => setfocusName(false)} value={name} placeholderTextColor="#f7f7f770" placeholder='Ex.: Meu Top 10' onChangeText={setName} style={{ fontFamily: 'Font_Book', height: 42, backgroundColor: "#303030", marginTop: 10, paddingLeft: 20, borderRadius: 5, fontSize: 18, borderBottomColor: focusName ? color.primary : "#FFFFFF90", borderBottomWidth: 2, color: "#fff" }} />

                        <Row style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, marginTop: 20, }}>
                            <Title style={{ fontSize: 20, letterSpacing: -0.6, }}>Fundos *</Title>
                            <ExpandingDot
                                data={[1, 2]}
                                expandingDotWidth={30}
                                scrollX={scrollX}
                                inActiveDotColor="#707070"
                                activeDotColor={color.primary}
                                dotStyle={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: 100,
                                }}
                                containerStyle={{
                                    position: 'relative',
                                    top: 0,
                                }}
                            />
                        </Row>
                    </Column>

                    <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} onScroll={RNAnimated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false, })}>
                        <Column style={{ width: width, paddingHorizontal: 20, }}>
                            <FlatList
                                data={backgrounds?.slice(0, 9)}
                                keyExtractor={item => item}
                                numColumns={3}
                                columnWrapperStyle={{ justifyContent: 'space-between', columnGap: 12, }}
                                contentContainerStyle={{ rowGap: 12, }}
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item }) =>
                                    <Button onPress={() => { setCapa(item) }} style={{ flexGrow: 1, borderRadius: 16, }}>
                                        <MotiImage source={{ uri: item }} style={{ width: '100%', height: 100, borderRadius: 16, borderWidth: 4, borderColor: item === capa ? "#fff" : 'transparent', }} />
                                    </Button>}
                            />
                        </Column>
                        <Column style={{ width: width, paddingHorizontal: 20, }}>
                            <FlatList
                                data={backgrounds?.slice(9, 18)}
                                keyExtractor={item => item}
                                numColumns={3}
                                columnWrapperStyle={{ justifyContent: 'space-between', columnGap: 12, }}
                                contentContainerStyle={{ rowGap: 12, }}
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item }) =>
                                    <Button onPress={() => { setCapa(item) }} style={{ flexGrow: 1, borderRadius: 16, }}>
                                        <MotiImage source={{ uri: item }} style={{ width: '100%', height: 100, borderRadius: 16, borderWidth: 4, borderColor: item === capa ? "#fff" : 'transparent', }} />
                                    </Button>}
                            />
                        </Column>
                    </ScrollView>

                    <Title style={{ fontSize: 22, letterSpacing: -0.6, marginTop: 20, marginHorizontal: 20, marginVertical: 10, }}>Gênero</Title>
                    <FlatList
                        horizontal
                        data={tags}
                        ListHeaderComponent={<Column style={{ width: 8, }} />}
                        ListFooterComponent={<Column style={{ width: 0, }} />}
                        keyExtractor={item => item.id}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ columnGap: 12, }}
                        renderItem={({ item }) => <Button onPress={() => handleItemClick(item)} style={{ justifyContent: 'center', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 100, backgroundColor: !selectedItems?.some(selectedItem => selectedItem.id === item.id) ? "#303030" : '#ED274A', }}>
                            <Title style={{ fontSize: 18, fontFamily: font.book, zIndex: 999, marginHorizontal: 10, textAlign: 'left' }}>{item?.name}</Title>
                        </Button>}
                    />

                    <Button onPress={updateCollection} style={{ paddingVertical: 10, paddingHorizontal: 40, alignSelf: 'center', backgroundColor: color.primary, borderRadius: 40, marginTop: 20, marginBottom: 30, }}>
                        <Label style={{ color: "#fff", letterSpacing: -0.6, textAlign: 'center', fontFamily: font.bold, }}>Pronto</Label>
                    </Button>
                </Column>
            </Modal>

        </Main>
    )
}


const AddMangas = () => {
    return (
        <Column>
            <Scroll pagingEnabled>
                <FlatList style={{ flex: 1, backgroundColor: 'red', }} />
                <FlatList style={{ flex: 1, backgroundColor: 'blue', }} />
                <FlatList style={{ flex: 1, backgroundColor: 'green', }} />
            </Scroll>
        </Column>
    )
}


const Grid = ({ item, collection }) => {
    const navigation = useNavigation();

    // Memorize constants with useMemo
    const SWIPE_THRESHOLD = useMemo(() => -115, []);
    const MAX_TRANSLATE_X = useMemo(() => -130, []);

    const { color } = useContext(ThemeContext);
    const [remove, setremove] = useState(false);
    const translateX = useSharedValue(0);
    const heightTam = useSharedValue(80);
    const opacityVal = useSharedValue(1);

    const removeManga = async () => {
        try {
            await removeMangaInCollection(collection, item?.id);
        } catch (error) {
            console.log(error);
        }
    };

    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            translateX.value = Math.min(event.translationX, 0);
            if (translateX.value < MAX_TRANSLATE_X) {
                translateX.value = MAX_TRANSLATE_X;
            }
            if (translateX.value < -80) {
                runOnJS(setremove)(true);
            } else {
                runOnJS(setremove)(false);
            }
        })
        .onEnd(() => {
            if (translateX.value < SWIPE_THRESHOLD) {
                translateX.value = withSpring(0, { stiffness: 150, damping: 25 });
                opacityVal.value = withSpring(0, { stiffness: 150, damping: 25 }, () => {
                    heightTam.value = withSpring(0, { stiffness: 150, damping: 25 });
                    runOnJS(removeManga)();
                });
            } else {
                runOnJS(setremove)(false);
                translateX.value = withSpring(0);
            }
        });

    const rStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
        height: heightTam.value,
        opacity: opacityVal.value,
    }));

    return (
        <GestureHandlerRootView>
            <GestureDetector gesture={panGesture}>
                <Animated.View style={[{ flexDirection: 'row' }, rStyle]}>
                    <Row style={{ justifyContent: 'space-between', alignItems: 'center', width: width, paddingHorizontal: 20 }}>
                        <Row>
                            <Image source={{ uri: item.capa }} style={{ width: 54, height: 66, borderRadius: 6 }} />
                            <Column style={{ justifyContent: 'center', marginLeft: 12 }}>
                                <Title style={{ fontSize: 18, letterSpacing: -1 }}>{item?.name.length > 24 ? item?.name?.slice(0, 24) + '...' : item?.name}</Title>
                                <Label style={{ fontSize: 14, letterSpacing: -0.5 }}>{item?.rate} • {item?.type}</Label>
                            </Column>
                        </Row>
                        <Button style={{ width: 32, height: 32, borderRadius: 100, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }} onPress={() => { navigation.navigate('MangaDetails', { id: item.id }); }}>
                            <ArrowRight size={18} color="#000" />
                        </Button>
                    </Row>
                    <Column style={{ height: 1, backgroundColor: remove ? color.red : '#303030', width: 200, height: 80, borderRadius: 12, justifyContent: 'center', paddingLeft: 24 }}>
                        <Trash size={24} color={remove ? "#fff" : color.red} />
                    </Column>
                </Animated.View>
            </GestureDetector>
        </GestureHandlerRootView>
    );
};

const SkeletonBody = () => {
    return (
        <Main>
            <Column style={{ paddingHorizontal: 20, paddingVertical: 50, }}>
                <Row style={{ justifyContent: 'center', alignItems: 'center', }}>
                    <Skeleton width={158} height={158} />
                </Row>

                <Spacer width={24} height={24} />
                <Skeleton colorMode='light' width={230} height={42} radius={100} />
                <Spacer width={24} height={12} />
                <Skeleton width={120} height={32} radius={8} />
                <Spacer width={24} height={34} />

                <Row style={{ justifyContent: 'space-between', alignItems: 'center', }}>
                    <Skeleton width={90} height={32} radius={8} />
                    <Skeleton width={100} height={32} radius={8} />
                </Row>
                <Spacer width={24} height={14} />
                <Column>
                    <Row style={{ marginTop: 12, }}>
                        <Skeleton width={64} height={64} radius={12} />
                        <Spacer width={16} height={10} />
                        <Column style={{ justifyContent: 'center', }}>
                            <Skeleton width={164} height={24} radius={4} />
                            <Spacer width={16} height={10} />
                            <Skeleton width={124} height={14} radius={4} />
                        </Column>
                    </Row>
                    <Row style={{ marginTop: 20, }}>
                        <Skeleton width={64} height={64} radius={12} />
                        <Spacer width={16} height={10} />
                        <Column style={{ justifyContent: 'center', }}>
                            <Skeleton width={164} height={24} radius={4} />
                            <Spacer width={16} height={10} />
                            <Skeleton width={124} height={14} radius={4} />
                        </Column>
                    </Row>
                    <Row style={{ marginTop: 20, }}>
                        <Skeleton width={64} height={64} radius={12} />
                        <Spacer width={16} height={10} />
                        <Column style={{ justifyContent: 'center', }}>
                            <Skeleton width={164} height={24} radius={4} />
                            <Spacer width={16} height={10} />
                            <Skeleton width={124} height={14} radius={4} />
                        </Column>
                    </Row>
                    <Row style={{ marginTop: 20, }}>
                        <Skeleton width={64} height={64} radius={12} />
                        <Spacer width={16} height={10} />
                        <Column style={{ justifyContent: 'center', }}>
                            <Skeleton width={164} height={24} radius={4} />
                            <Spacer width={16} height={10} />
                            <Skeleton width={124} height={14} radius={4} />
                        </Column>
                    </Row>
                    <Row style={{ marginTop: 20, }}>
                        <Skeleton width={64} height={64} radius={12} />
                        <Spacer width={16} height={10} />
                        <Column style={{ justifyContent: 'center', }}>
                            <Skeleton width={164} height={24} radius={4} />
                            <Spacer width={16} height={10} />
                            <Skeleton width={124} height={14} radius={4} />
                        </Column>
                    </Row>
                    <Row style={{ marginTop: 20, }}>
                        <Skeleton width={64} height={64} radius={12} />
                        <Spacer width={16} height={10} />
                        <Column style={{ justifyContent: 'center', }}>
                            <Skeleton width={164} height={24} radius={4} />
                            <Spacer width={16} height={10} />
                            <Skeleton width={124} height={14} radius={4} />
                        </Column>
                    </Row>
                </Column>

            </Column>
        </Main>
    )
}

const EmptyList = () => {
    const { color } = useContext(ThemeContext)
    return (
        <Column style={{ justifyContent: 'center', alignItems: 'center', flexGrow: 1, marginHorizontal: 10, paddingVertical: 50, paddingHorizontal: 20, borderRadius: 12, }}>

            <Row>
                <Column style={{ width: 100, height: 140, backgroundColor: '#303030', borderRadius: 12, }} />
                <Column style={{ width: 100, height: 140, justifyContent: 'center', alignItems: 'center', marginHorizontal: 12, backgroundColor: '#202020', borderRadius: 12, }} >
                    <Column style={{ backgroundColor: '#fff', borderRadius: 100, width: 56, height: 56, justifyContent: 'center', alignItems: 'center', }}><Ionicons name="add" size={42} color={color.primary} /></Column>
                </Column>
                <Column style={{ width: 100, height: 140, backgroundColor: '#303030', borderRadius: 12, }} />
            </Row>

            <Column style={{ marginLeft: 12, }}>
                <Title style={{ fontSize: 22, letterSpacing: -1, textAlign: 'center', marginTop: 12, }}>Nenhum mangá por aqui...</Title>
                <Label style={{ fontSize: 18, letterSpacing: -1, textAlign: 'center', marginTop: 6, }}>Escolha o mangá e clique no ícone de + e salve aqui.</Label>
            </Column>
        </Column>
    )
}

const Spacer = ({ height = 16, width = 16, }) => <Column style={{ height, width }} />


const DraggableImage = ({ source }) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            translateX.value = event.translationX;
            translateY.value = event.translationY;
        })
        .onEnd(() => {
            translateX.value = withSpring(0, { damping: 10 });
            translateY.value = withSpring(0, { damping: 10 });
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value }
        ],
    }));

    return (
        <GestureHandlerRootView>
            <GestureDetector gesture={panGesture}>
                <Animated.Image
                    source={{ uri: source.uri }}
                    resizeMode="cover"
                    style={[
                        {
                            width: 168,
                            height: 168,
                            borderRadius: 12,
                            alignSelf: 'center',
                            zIndex: 99,
                            marginTop: 20,
                            marginBottom: 20,
                        },
                        animatedStyle,
                    ]}
                />
            </GestureDetector>
        </GestureHandlerRootView>
    );
};

/* 

const Grid2 = ({ item }) => {
    const navigation = useNavigation();
    return (
        <Pressable onPress={() => { navigation.navigate('MangaDetails', { id: item.id }); }} style={{ backgroundColor: "#303030", borderRadius: 6, flexGrow: 1, margin: 8, padding: 12, paddingBottom: 20, }}>
            <MotiImage source={{ uri: item.capa }} style={{ width: 102, height: 152, borderRadius: 6, alignSelf: 'center', marginBottom: 6, }} />
            <Title style={{ fontSize: 18, }}>{item?.name?.slice(0, 12)}</Title>
            <Label style={{ fontSize: 14, }}>{item?.rate} • {item?.type}</Label>
        </Pressable>
    )
}
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
const Grid3 = ({ item }) => {
    const navigation = useNavigation();
    return (
        <Column style={{ width: width, paddingVertical: 120 }}>
            <MotiImage blurRadius={100} source={{ uri: item.capa }} style={{ width: width, height: 1.1 * height, position: 'absolute', top: 0, left: 0, }} />

            <MotiImage source={{ uri: item.capa }} style={{ width: 242, height: 358, transform: [{ rotate: '-6deg' }], borderRadius: 6, alignSelf: 'center', marginBottom: 6, }} />
            <Title style={{ fontSize: 60, letterSpacing: -2, marginHorizontal: 32, lineHeight: 56, marginTop: 40, }}>{item?.name?.slice(0, 52)}</Title>
            <Label style={{ fontSize: 32, marginHorizontal: 32, color: "#fff", textAlign: 'right', marginTop: 10, marginBottom: -10, }}>{item?.rate} • {item?.type}</Label>

            <Pressable onPress={() => { navigation.navigate('MangaDetails', { id: item.id }); }} style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', flexGrow: 1, padding: 12, }}>
                <Column style={{ justifyContent: 'center', marginLeft: 20, flexGrow: 1, height: 2, backgroundColor: "#fff", marginRight: -10, }} />
                <AntDesign name="arrowright" size={24} color="#fff" />
            </Pressable>
        </Column>
    )
}
 */