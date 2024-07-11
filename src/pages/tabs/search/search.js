import React, { useContext, useState, useEffect, useRef } from 'react';
import { Column, Row, Title, Label, Main, Scroll, } from '@theme/global';
import { Pressable, TextInput, Image } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { AntDesign, Feather } from '@expo/vector-icons';
import { AnimatePresence, MotiImage, MotiView, useAnimationState } from 'moti';
import { saveWord, listWords, excludeWords, excludeWord } from '@api/history';
import { tags } from '@api/tags';
import { Skeleton } from 'moti/skeleton';
import { getPreferences } from '@api/user/preferences';
import { useNavigation } from '@react-navigation/native';
import { getSearch, } from '@apiv2/getSearch';
import { Modalize } from 'react-native-modalize';
import { FlatList, } from 'react-native-gesture-handler';
import { X } from 'lucide-react-native';

export default function SearchPage({ navigation }) {
    const { color, font } = useContext(ThemeContext)
    const [name, setname] = useState('');
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [openSearch, setopenSearch] = useState(false);
    const [user, setUser] = useState();
    const filtersModal = useRef(null);


    const getData = async () => {
        if (name === '') { setData([]); return; }
        if (!history.includes(name)) { saveWord(name); }
        setLoading(true);
        getSearch(name, publicoSelect, statusSelect, classificacaoSelect).then(res => {
            setData(res)
            setLoading(false)
        })
    };


    const cleanHistory = () => {
        excludeWords()
        setHistory([])
    }
    useEffect(() => {
        const requestHistory = async () => {
            try {
                const response = await listWords();
                const prefer = await getPreferences()
                setUser(prefer)
                setHistory(response)
            } catch (error) {
                console.log(error)
            }
        }
        requestHistory()
    }, [loading])
    useEffect(() => {
        toggleAnimation.transitionTo('close')
        setopenSearch(false);
    }, [])
    const ScrollMain = useRef();
    const toggleAnimation = useAnimationState({
        close: {
            height: 180,
        },
        open: {
            height: 280,
        },
    });
    const publico = [
        { value: 'shounen', name: 'Masculino adolescente' },
        { value: 'shoujo', name: 'Feminino adolescente' },
        { value: 'seinen', name: 'Masculino adulto' },
        { value: 'josei', name: 'Feminino adulto' },
        { value: 'none', name: 'Nenhum' },
    ]
    const status = [
        {
            value: 'ongoing',
            name: 'Em andamento',
        },
        {
            value: 'completed',
            name: 'Completo',
        },
        {
            value: 'hiatus',
            name: 'Hiato',
        },
        {
            value: 'cancelled',
            name: 'Cancelado',
        },
        {
            value: 'none',
            name: 'Nenhum',
        }
    ]
    const classificacao = [
        {
            value: 'safe',
            name: 'Seguro'
        },
        {
            value: 'suggestive',
            name: 'Sugestivo'
        },
        {
            value: 'erotica',
            name: 'Erótico'
        },
        {
            value: 'pornographic',
            name: 'Pornográfico',
        },
    ]
    const [publicoSelect, setpublicoSelect] = useState();
    const [statusSelect, setstatusSelect] = useState();
    const [classificacaoSelect, setclassificacaoSelect] = useState();
    const a = false;

    return (
        <Main>
            <Scroll ref={ScrollMain}>
                <Column style={{ paddingHorizontal: 20, }}>
                    <MotiView state={toggleAnimation} transition={{ type: 'timing', duration: 300, }} style={{ marginHorizontal: -20, paddingHorizontal: 20, paddingBottom: 20, borderRadius: 16, }}>
                        <Row style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: 16, }}>
                            <Title style={{ fontSize: 52, marginVertical: 24, letterSpacing: -3, }}>Buscar</Title>
                            <Pressable onPress={() => { filtersModal.current.open() }} >
                                <AntDesign name="filter" size={24} color={color.title} />
                            </Pressable>
                        </Row>

                        <Row>
                            <TextInput onFocus={() => { setopenSearch(true); toggleAnimation.transitionTo('open') }} onBlur={() => { if (name?.length == 0) { setopenSearch(false); toggleAnimation.transitionTo('close') } }} value={name} placeholderTextColor={color.title + 70} placeholder='Ex.: One Piece' onChangeText={setname} style={{ fontFamily: font.book, paddingVertical: 12, flexGrow: 1, backgroundColor: openSearch ? "#f7f7f7" : '#303030', paddingHorizontal: 20, borderRadius: 12, fontSize: 20, borderColor: name.length > 2 ? color.green : "transparent", borderWidth: 2, color: "#000", borderTopRightRadius: 0, borderBottomRightRadius: 0, }} />
                            <Pressable onPress={getData} style={{ backgroundColor: color.primary, borderTopRightRadius: 12, borderBottomRightRadius: 12, width: 58, justifyContent: 'center', alignItems: 'center', }}>
                                <Feather name="search" size={24} color="#fff" />
                            </Pressable>
                        </Row>

                        <AnimatePresence>
                            {openSearch && <>
                                {history.length > 0 &&
                                    <MotiView from={{ translateX: -30, opacity: 0, }} animate={{ translateX: 0, opacity: 1, }} exit={{ translateX: -30, opacity: 0, }} transition={{ type: 'timing', duration: 300, }} >
                                        <Row style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 6, }}>
                                            <Title style={{ fontSize: 24, }}>Buscas recentes</Title>
                                            <Pressable onPress={cleanHistory} style={{ width: 32, height: 32, }}>
                                                <Feather name="trash" size={16} color={color.red} />
                                            </Pressable>
                                        </Row>
                                        <FlatList style={{ marginHorizontal: -20, paddingHorizontal: 16, }} horizontal showsHorizontalScrollIndicator={false} data={history} renderItem={({ item }) => <Pressable onPress={() => { setname(item); setLoading(!loading); console.log('pressiou') }} onLongPress={() => { excludeWord(item); setLoading(!loading); }} style={{ paddingHorizontal: 22, paddingVertical: 12, borderRadius: 100, backgroundColor: '#303030', margin: 6, }}><Label style={{ fontSize: 18, }}>{item}</Label></Pressable>} keyExtractor={(item) => item} />
                                    </MotiView>}

                                {history.length === 0 && <MotiView from={{ translateX: -30, opacity: 0, }} animate={{ translateX: 0, opacity: 1, }} transition={{ type: 'timing', duration: 300, }}>
                                    <Row style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 6, }}>
                                        <Title style={{ fontSize: 24, }}>Buscas recentes</Title>
                                    </Row>
                                    <Label>Sem nenhuma busca no histórico</Label>
                                </MotiView>}
                            </>}
                        </AnimatePresence>

                    </MotiView>


                    {loading && <SkeletonBody />}

                    {data?.length === 0 &&
                        <Column>
                            <Title style={{ fontSize: 24, marginBottom: 6, marginTop: 20, }}>Navegue por categorias</Title>
                            <FlatList data={tags} numColumns={2} style={{ marginHorizontal: -8, }} renderItem={({ item }) => <Category item={item} />} keyExtractor={(item) => item.id} />
                            <NSFW />
                        </Column>}

                    {data?.length > 0 &&
                        <List data={data} />
                    }

                </Column>
            </Scroll>


            <Modalize ref={filtersModal} modalStyle={{ backgroundColor: '#171717', }} adjustToContentHeight childrenStyle={{ height: 460 }} >
                <Column style={{ paddingHorizontal: 20, paddingVertical: 20, }}>
                    <Title >Filtros avançados</Title>
                    <Column style={{ marginVertical: 10, marginTop: 20, }}>
                        <Title style={{ fontSize: 18, }}>Público ({publicoSelect})</Title>
                        <FlatList data={publico} style={{ marginTop: 10, marginHorizontal: -20, paddingHorizontal: 20, }} ListFooterComponent={<Column style={{ width: 30, }} />} horizontal showsHorizontalScrollIndicator={false} renderItem={({ item }) => <Pressable onPress={() => setpublicoSelect(item.value)} style={{ backgroundColor: publicoSelect === item.value ? color.primary : '#303030', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 100, marginRight: 8, }}><Label style={{ color: '#f6f6f6', fontSize: 14, }}>{item.name}</Label></Pressable>} keyExtractor={(item) => item.value} />
                    </Column>
                    <Column style={{ flexGrow: 1, height: 2, backgroundColor: '#303030', marginVertical: 6, }} />
                    <Column style={{ marginVertical: 10, }}>
                        <Title style={{ fontSize: 18, }}>Status</Title>
                        <FlatList data={status} style={{ marginTop: 10, marginHorizontal: -20, paddingHorizontal: 20, }} ListFooterComponent={<Column style={{ width: 30, }} />} horizontal showsHorizontalScrollIndicator={false} renderItem={({ item }) => <Pressable onPress={() => setstatusSelect(item.value)} style={{ backgroundColor: statusSelect === item.value ? color.primary : '#303030', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 100, marginRight: 8, }}><Label style={{ color: '#f6f6f6', fontSize: 14, }}>{item.name}</Label></Pressable>} keyExtractor={(item) => item.value} />
                    </Column>
                    <Column style={{ flexGrow: 1, height: 2, backgroundColor: '#303030', marginVertical: 6, }} />
                    <Column style={{ marginVertical: 10, }}>
                        <Title style={{ fontSize: 18, }}>Classificação</Title>
                        <FlatList data={classificacao} style={{ marginTop: 10, marginHorizontal: -20, paddingHorizontal: 20, }} ListFooterComponent={<Column style={{ width: 30, }} />} horizontal showsHorizontalScrollIndicator={false} renderItem={({ item }) => <Pressable onPress={() => setclassificacaoSelect(item.value)} style={{ backgroundColor: classificacaoSelect === item.value ? color.primary : '#303030', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 100, marginRight: 8, }}><Label style={{ color: '#f6f6f6', fontSize: 14, }}>{item.name}</Label></Pressable>} keyExtractor={(item) => item.value} />
                    </Column>
                    <Column style={{ flexGrow: 1, height: 2, backgroundColor: '#303030', marginVertical: 6, }} />
                    <Pressable onPress={() => { filtersModal.current?.close() }} style={{ paddingVertical: 12, paddingHorizontal: 30, borderRadius: 100, marginTop: 20, backgroundColor: color.primary, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', }}>
                        <Title style={{ fontSize: 18, }}>Pesquisar</Title>
                    </Pressable>
                </Column>
            </Modalize>

        </Main>
    )
}


const NSFW = () => {
    const { color } = useContext(ThemeContext)
    const navigation = useNavigation();
    return (
        <Pressable style={{ width: '52%', flexGrow: 1, marginHorizontal: -6, marginBottom: 20, }} onPress={() => { navigation.navigate('NSFW') }} >
            <Column style={{ cursor: 'pointer', margin: 8, borderRadius: 12, backgroundColor: color.primary, overflow: 'hidden', padding: 6, height: 84, }}>
                <Title style={{ fontSize: 20, margin: 10, flexWrap: 'wrap' }}>+18</Title>
            </Column>
        </Pressable>
    )
}


const List = ({ data }) => {
    const { color } = useContext(ThemeContext)
    return (
        <Column>
            <Row style={{ marginTop: 30, marginBottom: 10, justifyContent: 'space-between', alignItems: 'center', }}>
                <Title style={{ fontSize: 24, }}>Todos</Title>
                <Pressable onPress={() => { setData([]) }} >
                    <X size={24} color={color.red} />
                </Pressable>
            </Row>
            <FlatList data={data} numColumns={2} style={{ alignSelf: 'center', marginHorizontal: -8, }} renderItem={({ item }) => <Result item={item} />} keyExtractor={(item) => item.id} />
        </Column>
    )
}

const Category = ({ item }) => {
    const navigation = useNavigation()
    return (
        <Pressable style={{ width: '46%', flexGrow: 1, }} onPress={() => { navigation.navigate('Category', { 'category': item }) }} >
            <Column style={{ cursor: 'pointer', margin: 8, borderRadius: 12, backgroundColor: item?.color, overflow: 'hidden', padding: 6, height: 84, }}>
                <Title style={{ fontSize: 20, margin: 10, flexWrap: 'wrap' }}>{item.name}</Title>
            </Column>
        </Pressable>
    )
}

const Result = ({ item }) => {
    const navigation = useNavigation()
    return (
        <Pressable onPress={() => navigation.navigate('MangaDetails', { id: item.id })} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#262626', width: '48%', borderRadius: 6, margin: 4, }}>
            <Image source={{ uri: item?.capa }} style={{ objectFit: 'cover', marginTop: 24, borderRadius: 6, width: 120, height: 180, zIndex: 2, marginBottom: 6, }} />
            <Title style={{ color: "#f6f6f6", fontSize: 16, marginTop: 8, marginHorizontal: 20, textAlign: 'center', }}>{item?.name.slice(0, 32)}</Title>
            <Label style={{ fontSize: 12, marginTop: 4, marginBottom: 14, }}>{item?.type}</Label>
        </Pressable>

    )
}


const SkeletonBody = () => {
    return (
        <Column style={{ marginTop: 30, }}>
            <Skeleton width={210} height={42} />
            <Spacing height={12} />
            <Skeleton width={'100%'} height={160} />
            <Spacing height={40} />
            <Skeleton width={150} height={42} />
            <Spacing height={12} />

            <Row style={{ justifyContent: 'space-between', alignItems: 'center', }}>
                <Skeleton width={165} height={200} />
                <Skeleton width={165} height={200} />
            </Row>
            <Row style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: 20, }}>
                <Skeleton width={165} height={200} />
                <Skeleton width={165} height={200} />
            </Row>
            <Spacing height={20} />
        </Column>
    )
}