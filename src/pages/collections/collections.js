import React, { useState, useRef, useEffect, useContext } from 'react';
import { Main, Scroll, Title, Label, Row, Column, Button } from '@theme/global';
import { Pressable, TextInput, Image, Dimensions, Animated as RNAnimated } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

//components
import { MotiImage, MotiView } from 'moti';
import { Skeleton } from 'moti/skeleton';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Modal from '@components/modal/modal';
//hooks
import { createCollection, listCollections, requestCollectionsBackground } from '@hooks/collections';
import { ThemeContext } from 'styled-components/native';

import { FlatList, ScrollView } from 'react-native-gesture-handler'
import { ExpandingDot } from "react-native-animated-pagination-dots";
import { X } from 'lucide-react-native'
import { tags } from '@hooks/tags';


const { width, height } = Dimensions.get('window');

export default function CollectionsPage({ navigation }) {
    const { color, font } = useContext(ThemeContext)


    const [capa, setCapa] = useState();
    const [name, setName] = useState();
    const [focusName, setfocusName] = useState(false);

    const [type, setType] = useState('Lasted');

    const [loadingCreate, setLoadingCreate] = useState(false);
    const [backgrounds, setBackgrounds] = useState([]);
    const [loading, setLoading] = useState();
    const [collections, setCollections] = useState([]);
    const [error, setError] = useState('');

    if (loading) {
        return <SkeletonBody />
    }

    const modalCreate = useRef(null);
    const [isOpen, setisOpen] = useState(false);
    useEffect(() => {
        const fetchBack = async () => {
            setLoading(true)
            try {
                const res = await requestCollectionsBackground();
                setBackgrounds(res);
                setCapa(res[0]);
            } catch (error) {
                console.log(error);
            } finally { setLoading(false) }
        }
        fetchBack();
    }, []);

    function formatarData(data) { const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']; const dia = data.getDate(); const mes = meses[data.getMonth()]; const ano = data.getFullYear(); return `${dia} de ${mes}, ${ano}`; }


    const create = async () => {
        setLoadingCreate(true)
        setError('');
        let coll = {
            id: Math.random().toString(36).substring(7),
            name: name,
            capa: capa,
            genres: selectedItems,
            mangas: [],
            date: formatarData(new Date()),
        }
        if (name?.length < 2 && capa?.length < 2) {
            setError('Preencha o nome e a capa.');
            setLoadingCreate(false);
            return;
        } else {
            createCollection(coll).then(res => {
                setLoadingCreate(false);
                modalCreate.current?.close();
            });
        }
    }

    useEffect(() => {
        const fetchData = () => {
            setLoading(true)
            listCollections().then(res => {
                setCollections(res)
            })
            setLoading(false)
        }
        fetchData();
    }, [loadingCreate]);

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

    const scrollX = React.useRef(new RNAnimated.Value(0)).current;
    return (
        <Main>
            <Scroll>
                <Row style={{ marginTop: 20, justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20, }}>
                    <Button style={{ width: 42, height: 42, backgroundColor: '#fff', borderRadius: 100, justifyContent: 'center', alignItems: 'center', }} onPress={() => navigation.goBack()} >
                        <AntDesign name="arrowleft" size={20} color="#000" />
                    </Button>
                    <Title style={{ fontSize: 32, }}>Coleções</Title>
                    <Column style={{ width: 42, height: 42, justifyContent: 'center', alignItems: 'center', }} onPress={() => navigation.goBack()} >
                    </Column>
                </Row>

                <Row style={{ marginHorizontal: 20, marginVertical: 20, justifyContent: 'center', alignItems: 'center', }}>
                    <Button onPress={() => { setType('Lasted') }} style={{ paddingVertical: 10, paddingHorizontal: 32, backgroundColor: type === 'Lasted' ? "#fff" : "#303030", borderRadius: 40, }}>
                        <Title style={{ color: type === 'Lasted' ? "#000" : "#d7d7d7", fontSize: 18, textAlign: 'center', }}>Recentes</Title>
                    </Button>
                    <Button onPress={() => { setType('All') }} style={{ paddingVertical: 10, marginHorizontal: 12, paddingHorizontal: 32, backgroundColor: type === 'All' ? "#fff" : "#303030", borderRadius: 40, }}>
                        <Title style={{ color: type === 'All' ? "#000" : "#d7d7d7", fontSize: 18, textAlign: 'center', }}>Todos</Title>
                    </Button>
                </Row>


                {collections?.length === 0 &&
                    <Column style={{ justifyContent: 'center', alignItems: 'center', }}>
                        <Row style={{ marginVertical: 30, }}>
                            <Column style={{ transform: [{ rotate: '-12deg', }] }}><MotiImage source={{ uri: 'https://i.pinimg.com/564x/d3/86/3a/d3863a8d0ff7930aeecd8377fd912b1a.jpg' }} style={{ width: 120, height: 180, borderRadius: 8, }} /></Column>
                            <Column style={{ transform: [{ rotate: '-12deg', }], borderWidth: 8, borderColor: "#171717", borderRadius: 16, marginHorizontal: -30, }}><MotiImage source={{ uri: 'https://i.pinimg.com/236x/67/a1/3c/67a13cf926bfab690a113c2d3eac779e.jpg' }} style={{ width: 120, height: 180, borderRadius: 8, }} /></Column>
                            <Column style={{ transform: [{ rotate: '-12deg', }], borderWidth: 8, borderColor: "#171717", borderRadius: 16, }}><MotiImage source={{ uri: 'https://i.pinimg.com/564x/9c/93/8f/9c938f6ffd7510629bc36ebec7a1e5c6.jpg' }} style={{ width: 120, height: 180, borderRadius: 8, }} /></Column>
                        </Row>
                        <Title>Suas coleções em um único lugar</Title>
                        <Label>Crie, gerencie e compartilhe.</Label>
                        <Spacer height={12} />
                        <Button onPress={() => modalCreate.current?.expand()} style={{ paddingVertical: 10, marginHorizontal: 12, paddingHorizontal: 32, backgroundColor: "#fff", borderRadius: 40, }}>
                            <Title style={{ color: "#000", fontSize: 18, textAlign: 'center', }}>Criar</Title>
                        </Button>
                    </Column>}

                {loading &&
                    <Column style={{ justifyContent: 'center', alignItems: 'center', }}>
                        <Row style={{ marginVertical: 10, }}>
                            <Column style={{ transform: [{ rotate: '-12deg', }] }}><Skeleton width={120} height={180} radius={8} /></Column>
                            <Column style={{ transform: [{ rotate: '-12deg', }], borderWidth: 8, borderColor: "#171717", borderRadius: 16, marginHorizontal: -30, }}><Skeleton width={120} height={180} radius={8} /></Column>
                            <Column style={{ transform: [{ rotate: '-12deg', }], borderWidth: 8, borderColor: "#171717", borderRadius: 16, }}><Skeleton width={120} height={180} radius={8} /></Column>
                        </Row>
                        <Skeleton width={320} height={46} radius={8} />
                        <Spacer height={8} />
                        <Skeleton width={200} height={32} radius={4} />
                        <Column style={{ width: 170, height: 46, backgroundColor: "#fff", borderRadius: 100, marginTop: 20, }} />
                    </Column>
                }
                {collections.length > 0 &&
                    <Column>
                        {type === 'Lasted' &&
                            <FlatList
                                data={collections.slice(0, 6)}
                                keyExtractor={item => item.id}
                                horizontal={false}
                                numColumns={2}
                                style={{ alignSelf: 'center' }}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item }) => <CollectionItem item={item} />}
                            />
                        }
                        {type === 'All' &&
                            <FlatList
                                data={collections}
                                keyExtractor={item => item.id}
                                horizontal={false}
                                numColumns={2}
                                style={{ alignSelf: 'center' }}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item }) => <CollectionItem item={item} />}
                            />
                        }
                    </Column>
                }
            </Scroll>

            <Modal ref={modalCreate} snapPoints={[0.1, height]}>
                {isOpen &&
                    <Column style={{}}>
                        <Row style={{ justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, }}>
                            <Button onPress={() => { modalCreate.current?.close(); setisOpen(false); }} style={{ width: 42, height: 42, backgroundColor: '#fff', borderRadius: 100, justifyContent: 'center', alignItems: 'center', }} >
                                <X name="arrowleft" size={20} color="#000" />
                            </Button>
                            <Title style={{ fontSize: 28, textAlign: 'center', }}>Criar coleção</Title>
                            <Column style={{ width: 42, height: 42, }} />
                        </Row>

                        <MotiImage from={{ opacity: 0, scale: 0, rotate: '30deg' }} animate={{ opacity: 1, scale: 1, rotate: '0deg', }} transition={{ type: 'timing', duration: 300, }} source={{ uri: capa }}
                            style={{ width: 160, height: 160, borderRadius: 8, marginVertical: 12, borderWidth: 4, backgroundColor: '#303030', alignSelf: 'center', }} />

                        {error.length > 1 && <MotiView from={{ opacity: 0, }} animate={{ opacity: 1, }} transition={{ type: 'timing', duration: 300, delay: 200 }}>
                            <Title style={{ fontSize: 28, textAlign: 'center', backgroundColor: "#EB575730", color: "#EB5757", borderRadius: 6, fontSize: 18, paddingVertical: 8, }}>{error}</Title>
                        </MotiView>}

                        <Column style={{ paddingHorizontal: 20, }}>
                            <Title style={{ fontSize: 22, letterSpacing: -0.6, marginTop: 10, }}>Nome *</Title>
                            <TextInput onFocus={() => setfocusName(true)} onBlur={() => setfocusName(false)} value={name} placeholderTextColor="#f7f7f770" placeholder='Ex.: Meu Top 10' onChangeText={setName} style={{ fontFamily: 'Font_Book', height: 52, backgroundColor: "#303030", marginTop: 10, paddingLeft: 20, borderRadius: 5, fontSize: 20, borderBottomColor: focusName ? color.primary : "#FFFFFF90", borderBottomWidth: 2, color: "#fff" }} />

                            <Row style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, marginTop: 20, }}>
                                <Title style={{ fontSize: 22, letterSpacing: -0.6, }}>Fundos *</Title>
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

                        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}  onScroll={RNAnimated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false, })}>
                            <Column style={{ width: width, paddingHorizontal: 20, }}>
                                <FlatList
                                    data={backgrounds.slice(0, 9)}
                                    keyExtractor={item => item}
                                    numColumns={3}
                                    columnWrapperStyle={{ justifyContent: 'space-between', columnGap: 12, }}
                                    contentContainerStyle={{ rowGap: 12, }}
                                    showsHorizontalScrollIndicator={false}
                                    renderItem={({ item }) =>
                                        <Pressable onPress={() => { setCapa(item) }} style={{ flexGrow: 1, }}>
                                            <MotiImage source={{ uri: item }} style={{ width: '100%', height: 100, borderRadius: 8, borderWidth: 4, borderColor: item === capa ? "#fff" : 'transparent', }} />
                                        </Pressable>}
                                />
                            </Column>
                            <Column style={{ width: width, paddingHorizontal: 20, }}>
                                <FlatList
                                    data={backgrounds.slice(9, 18)}
                                    keyExtractor={item => item}
                                    numColumns={3}
                                    columnWrapperStyle={{ justifyContent: 'space-between', columnGap: 12, }}
                                    contentContainerStyle={{ rowGap: 12, }}
                                    showsHorizontalScrollIndicator={false}
                                    renderItem={({ item }) =>
                                        <Pressable onPress={() => { setCapa(item) }} style={{ flexGrow: 1, }}>
                                            <MotiImage source={{ uri: item }} style={{ width: '100%', height: 100, borderRadius: 8, borderWidth: 4, borderColor: item === capa ? "#fff" : 'transparent', }} />
                                        </Pressable>}
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
                            contentContainerStyle={{  columnGap: 12, }}
                            renderItem={({ item }) => <Button onPress={() => handleItemClick(item)} style={{ justifyContent: 'center', paddingHorizontal: 12, paddingVertical: 10,  borderRadius: 100, backgroundColor: !selectedItems.some(selectedItem => selectedItem.id === item.id) ? "#303030" : '#ED274A', }}>
                                <Title style={{ fontSize: 18, fontFamily: font.book, zIndex: 999, marginHorizontal: 10, textAlign: 'left' }}>{item?.name}</Title>
                            </Button>}
                        />


                        <Button onPress={create} style={{ paddingVertical: 10, paddingHorizontal: 40, alignSelf: 'center', backgroundColor: color.primary, borderRadius: 40, marginTop: 20, marginBottom: 30,  }}>
                            <Label style={{ color: "#fff", letterSpacing: -0.6, textAlign: 'center', fontFamily: font.bold, }}>Pronto</Label>
                        </Button>
                    </Column>}
            </Modal>
            <Button onPress={() => { modalCreate.current?.expand(); setisOpen(true); }} style={{ zIndex: 99, position: 'absolute', bottom: 30, right: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: "#fff", width: 50, height: 50, borderRadius: 100, }}>
                <AntDesign name="plus" size={24} color="#000" />
            </Button>
        </Main>
    )
}


const Spacer = ({ height = 16, width = 16, }) => <Column style={{ height, width }} />


const CollectionItem = ({ item }) => {
    const navigation = useNavigation();
    return (
        <Pressable onPress={() => { navigation.navigate('CollectionDetails', { item: item, }) }} style={{ margin: 10, borderRadius: 8, }}>
            <Image source={{ uri: item.capa }} style={{ width: 150, height: 190, borderRadius: 8, }} />
            <Column style={{ paddingHorizontal: 10, paddingVertical: 8, backgroundColor: '#262626', marginHorizontal: 6, borderBottomLeftRadius: 6, borderBottomRightRadius: 6, }}>
                <Title style={{ fontSize: 18, }}>{item.name}</Title>
                <Label style={{ fontSize: 12, marginTop: 2, }}>{item.mangas.length} • {item.date}</Label>
                <Spacer height={4} />
            </Column>
        </Pressable>
    )
}


const SkeletonBody = () => {
    return (
        <Main>
            <Column style={{ marginVertical: 50, }}>
                <Row style={{ justifyContent: 'center', alignItems: 'center', }}>
                    <Column style={{ width: 160, height: 42, borderRadius: 100, backgroundColor: "#fff", marginRight: 20, }} />
                    <Skeleton width={160} height={42} radius={100} />
                </Row>


                <Row style={{ justifyContent: 'center', flexWrap: 'wrap', marginTop: 24, }}>
                    <Column>
                        <Skeleton width={160} height={200} radius={8} />
                        <Spacer height={16} />
                        <Skeleton width={160} height={32} radius={4} />
                        <Spacer height={8} />
                        <Skeleton width={120} height={24} radius={4} />
                    </Column>
                    <Spacer width={32} />
                    <Column>
                        <Skeleton width={160} height={200} radius={8} />
                        <Spacer height={16} />
                        <Skeleton width={160} height={32} radius={4} />
                        <Spacer height={8} />
                        <Skeleton width={120} height={24} radius={4} />
                    </Column>
                </Row>
                <Row style={{ justifyContent: 'center', flexWrap: 'wrap', marginTop: 24, }}>
                    <Column>
                        <Skeleton width={160} height={200} radius={8} />
                        <Spacer height={16} />
                        <Skeleton width={160} height={32} radius={4} />
                        <Spacer height={8} />
                        <Skeleton width={120} height={24} radius={4} />
                    </Column>
                    <Spacer width={32} />
                    <Column>
                        <Skeleton width={160} height={200} radius={8} />
                        <Spacer height={16} />
                        <Skeleton width={160} height={32} radius={4} />
                        <Spacer height={8} />
                        <Skeleton width={120} height={24} radius={4} />
                    </Column>
                </Row>
                <Row style={{ justifyContent: 'center', flexWrap: 'wrap', marginTop: 24, }}>
                    <Column>
                        <Skeleton width={160} height={200} radius={8} />
                        <Spacer height={16} />
                        <Skeleton width={160} height={32} radius={4} />
                        <Spacer height={8} />
                        <Skeleton width={120} height={24} radius={4} />
                    </Column>
                    <Spacer width={32} />
                    <Column>
                        <Skeleton width={160} height={200} radius={8} />
                        <Spacer height={16} />
                        <Skeleton width={160} height={32} radius={4} />
                        <Spacer height={8} />
                        <Skeleton width={120} height={24} radius={4} />
                    </Column>
                </Row>
            </Column>
        </Main>
    )
}
