import React, { useState, useRef, useEffect } from 'react';
import { Main, Scroll, Title, Label, Row, Column, } from '../../theme/global';
import { Pressable, FlatList, TextInput, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { MotiImage, MotiView } from 'moti';
import { Skeleton } from 'moti/skeleton';
import { Modalize } from 'react-native-modalize';
import { requestCollectionsBackground } from '../../api/shop/collections';
import { createCollection, listCollections, removeAllCollections } from './../../api/collections/index';
import { useNavigation } from '@react-navigation/native';

export default function CollectionsPage({ navigation }) {
    const [loading, setLoading] = useState();
    const [loadingCreate, setLoadingCreate] = useState(false);
    const [type, setType] = useState('Lasted');
    const [backgrounds, setBackgrounds] = useState([]);
    const [error, setError] = useState('');
    const [collections, setCollections] = useState([]);
    if (loading) {
        return <SkeletonBody />
    }
    const modalCreate = useRef(null);
    const openCreate = () => { modalCreate.current?.open(); }
    useEffect(() => {
        const fetchBack = async () => {
            requestCollectionsBackground().then(res => {
                setBackgrounds(res);
            })
        }
        fetchBack();
    }, []);

    function formatarData(data) {  const meses = [  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez' ];  const dia = data.getDate();const mes = meses[data.getMonth()];const ano = data.getFullYear();  return `${dia} de ${mes}, ${ano}`;}

    const [capa, setCapa] = useState('');
    const [name, setName] = useState('');

    const create = async () => {
        setLoadingCreate(true)
        let coll = {
            id: Math.random().toString(36).substring(7),
            name: name,
            capa: capa,
            mangas: [{ "id": "radio-storm", "name": "Boruto: Naruto Next Generations", "capa": "https://i.pinimg.com/564x/f2/08/27/f208270bcd5f5dfeeba8f5872d314622.jpg", "rate": 4.5, "type": 'Mangá' }, { "rate": 4.5, "type": 'Mangá', "id": "black-clover", "name": "Black Clover", "capa": "https://img.lermanga.org/B/black-clover/capa.jpg" },],
            date: formatarData(new Date()),
        }
        if(name?.length < 1 && capa?.length < 1) {
            setError('Preencha o nome e a capa.')
            return setLoadingCreate(false);}
        else{
            createCollection(coll).then(res => {
                setLoadingCreate(false)
                modalCreate.current?.close();
            })
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


    return (
        <Main>
            <Scroll>
                <Row style={{ marginTop: 50, justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20, }}>
                    <Pressable style={{ width: 42, height: 42, justifyContent: 'center', alignItems: 'center', }} onPress={() => navigation.goBack()} >
                        <AntDesign name="arrowleft" size={32} color="#fff" />
                    </Pressable>
                    <Title style={{ fontSize: 32, }}>Coleções</Title>
                    <Pressable style={{ width: 42, height: 42, justifyContent: 'center', alignItems: 'center', }} onPress={() => navigation.goBack()} >
                    </Pressable>
                </Row>

                <Row style={{ marginHorizontal: 20, marginVertical: 20, justifyContent: 'center', alignItems: 'center', }}>
                    <Pressable onPress={() => { setType('Lasted') }} style={{ paddingVertical: 10, paddingHorizontal: 32, backgroundColor: type === 'Lasted' ? "#fff" : "#303030", borderRadius: 40, }}>
                        <Title style={{ color: type === 'Lasted' ? "#000" : "#d7d7d7", fontSize: 18, textAlign: 'center', }}>Recentes</Title>
                    </Pressable>
                    <Pressable onPress={() => { setType('All') }} style={{ paddingVertical: 10, marginHorizontal: 12, paddingHorizontal: 32, backgroundColor: type === 'All' ? "#fff" : "#303030", borderRadius: 40, }}>
                        <Title style={{ color: type === 'All' ? "#000" : "#d7d7d7", fontSize: 18, textAlign: 'center', }}>Todos</Title>
                    </Pressable>
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
                    <Pressable onPress={openCreate} style={{ paddingVertical: 10, marginHorizontal: 12, paddingHorizontal: 32, backgroundColor: "#fff", borderRadius: 40, }}>
                        <Title style={{ color: "#000", fontSize: 18, textAlign: 'center', }}>Criar</Title>
                    </Pressable>
                </Column>}

                {loading &&
                    <Column style={{ justifyContent: 'center', alignItems: 'center', }}>
                        <Row style={{ marginVertical: 30, }}>
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
                        style={{alignSelf: 'center'}}
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
                        style={{alignSelf: 'center'}}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => <CollectionItem item={item} />}    
                        />
                    }
                </Column>
                }
            </Scroll>

            <Modalize ref={modalCreate} adjustToContentHeight handlePosition="inside" handleStyle={{ backgroundColor: '#d7d7d790' }} modalStyle={{ backgroundColor: "#171717", borderTopLeftRadius: 20, borderTopRightRadius: 20, }} >
                <Column style={{ padding: 20, }}>
                    <Title style={{ fontSize: 28, marginTop: 10, marginBottom: 10, textAlign: 'center', }}>Criar coleção</Title>

                    {error.length > 1 && <MotiView  from={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'timing', duration: 300, delay: 200 }}>
                        <Title style={{ fontSize: 28,  textAlign: 'center', backgroundColor: "#EB575730", color: "#EB5757", borderRadius: 6, fontSize: 18, paddingVertical: 8, }}>{error}</Title>
                    </MotiView>}

                    <Title style={{ fontSize: 28, marginTop: 10, }}>Nome</Title>
                    <TextInput value={name} placeholderTextColor="#f7f7f770" placeholder='Ex.: Meu Top 10' onChangeText={setName} style={{ fontFamily: 'Font_Book', height: 52, backgroundColor: "#303030", marginTop: 10, paddingLeft: 20, borderRadius: 5, fontSize: 24, borderBottomColor: "#FFFFFF90", borderBottomWidth: 2, color: "#fff" }} />
                    <Title style={{ fontSize: 28, marginBottom: 10, marginTop: 20, }}>Fundos</Title>
                    <FlatList
                        data={backgrounds}
                        keyExtractor={item => item}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) =>
                            <Pressable onPress={() => { setCapa(item) }} >
                                <MotiImage source={{ uri: item }} style={{ width: 100, height: 100, borderRadius: 8, margin: 6, borderWidth: 4, borderColor: item === capa ? "#fff" : 'transparent', }} />
                            </Pressable>}
                    />

                    <Row style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: 20, }}>
                        <Pressable style={{ paddingVertical: 10, paddingHorizontal: 20, backgroundColor: "#303030", borderRadius: 40, flexGrow: 1, }}>
                            <Label style={{ color: "#fff", textAlign: 'center', }}>Fechar</Label>
                        </Pressable>
                        <Pressable onPress={create} style={{ paddingVertical: 10, paddingHorizontal: 20, backgroundColor: "#fff", borderRadius: 40, flexGrow: 3, marginLeft: 12, }}>
                            <Label style={{ color: "#000", textAlign: 'center' }}>Pronto</Label>
                        </Pressable>
                    </Row>
                </Column>
            </Modalize>
            <Pressable onPress={() => {modalCreate.current?.open()}}  style={{ zIndex: 99, position: 'absolute', bottom: 30, right: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: "#fff", width: 50, height: 50, borderRadius: 100, }}>
                <AntDesign name="plus" size={24} color="#000" />
            </Pressable>
        </Main>
    )
}


const Spacer = ({ height = 16, width = 16, }) => <Column style={{ height, width }} />


const CollectionItem = ({item}) => {
    const navigation = useNavigation();
  return(
    <Pressable onPress={() => {navigation.navigate('CollectionDetails', {item: item, })}}  style={{ margin: 10, borderRadius: 8,}}>
        <Image source={{ uri: item.capa }} style={{ width: 150, height: 190, borderRadius: 8, }} />
        <Column style={{ paddingHorizontal: 10, paddingVertical: 8, backgroundColor: '#262626', marginHorizontal: 6, borderBottomLeftRadius: 6, borderBottomRightRadius: 6,}}>
            <Title style={{fontSize: 18,}}>{item.name}</Title>
            <Label style={{fontSize: 12, marginTop:2, }}>{item.mangas.length} • {item.date}</Label>
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
