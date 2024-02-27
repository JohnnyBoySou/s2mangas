import React, { useEffect, useRef, useState } from 'react';
import { Column, Row, Title, Label, Scroll, Main } from '../../theme/global';
import { Image, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, FontAwesome5, Feather } from '@expo/vector-icons';
import requestManga from '../../api/manga/details';
import requestChapters from '../../api/manga/chapters';
import requestSimilar from '../../api/manga/similar';

export default function MangaDetailsPage({ route, navigation }) {
    const id = route.params.id;
    const [item, setItem] = useState();
    const [chapters, setChapters] = useState([]);
    const [similar, setSimilar] = useState();
    const [loading, setLoading] = useState(false);

    const [shortDesc, setShortDesc] = useState(false);


    useEffect(() => {
        const requestData = async () => {
            requestManga(id).then((response) => {
                setItem(response.manga)
                setLoading(false);
            })
            requestChapters(id).then((response) => {
                setChapters(response)
            })
            requestSimilar(id).then((response) => {
                setSimilar(response.mangas)
            })
        };
        requestData()

    }, [])
    const handleLike = () => {
    }
    const handlePlay = () => {
    }

    const cl = item?.type === 'MANGA' ? "#FFA8B7" : item?.type === 'MANHWA' ? "#BBD2FF" : item?.type === 'MANHUA' ? "#BFFFC6" : '#FFF';
    const rl = item?.status === 'Finalizado' ? '#BFFFC6' : '#FFC7A8'

    return (
        <Main>
            <Scroll >
                <LinearGradient colors={['#404040', 'transparent']} style={{ width: '100%', height: 300, position: 'absolute', top: 0, left: 0, }} />
                <Row style={{ marginTop: 50, paddingHorizontal: 20, marginBottom: 20, }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <AntDesign name="arrowleft" size={32} color="#fff" />
                    </TouchableOpacity>
                </Row>

                <Column style={{ paddingHorizontal: 20, }}>
                    <Image source={{ uri: item?.capa }} style={{ width: 160, height: 250, alignSelf: 'center', borderRadius: 4, }} />
                    <Title style={{ fontSize: 32, marginBottom: 5, marginTop: 20, fontFamily: 'Font_Bold', }}>{item?.name}</Title>

                    <TouchableOpacity onPress={() => { setShortDesc(!shortDesc) }}>
                        {shortDesc ? <Label style={{ fontSize: 18, lineHeight: 26, }}>{item?.description}</Label> : <Label style={{ fontSize: 18, lineHeight: 26, }}>{item?.description.slice(0, 150)}...</Label>}
                    </TouchableOpacity>

                    <Row style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: 10, }}>

                        <Label style={{ backgroundColor: cl, color: "#000", fontSize: 16, borderRadius: 100, paddingVertical: 10, paddingHorizontal: 10, }}>✶ {item?.type} ✦</Label>
                        <Row style={{ backgroundColor: "#303030", borderRadius: 100, justifyContent: 'center', alignItems: 'center', }}>
                            <AntDesign name="calendar" size={16} color="#fff" style={{ backgroundColor: "#505050", padding: 8, borderRadius: 100, margin: 6, }} />
                            <Label style={{ marginLeft: 2, fontFamily: 'Font_Medium', fontSize: 18, marginRight: 14, }}>{item?.date}</Label>
                        </Row>
                        <Row style={{ backgroundColor: "#303030", borderRadius: 100, justifyContent: 'center', alignItems: 'center', }}>
                            <AntDesign name="star" size={16} color="#fff" style={{ backgroundColor: "#505050", padding: 8, borderRadius: 100, margin: 6, }} />
                            <Label style={{ marginLeft: 2, fontFamily: 'Font_Medium', fontSize: 18, marginRight: 14, }}>{item?.rate === 'Rate this mangas' ? 'Sem nota' : item?.rate}</Label>
                        </Row>
                    </Row>



                    <Row style={{ alignItems: 'center', justifyContent: 'space-between', marginTop: 15, }}>
                        <Row style={{ justifyContent: 'center', alignItems: 'center', }}>
                            <TouchableOpacity onPress={handleLike} style={{ width: 42, height: 42, justifyContent: 'center', alignItems: 'center', }}>
                                <AntDesign name="hearto" size={24} color="#d4d4d4" />
                            </TouchableOpacity>
                        </Row>
                        <Row style={{ justifyContent: 'center', alignItems: 'center', }}>
                            <TouchableOpacity onPress={handlePlay} style={{ backgroundColor: "#ED274A", width: 52, marginLeft: 10, height: 52, borderRadius: 100, justifyContent: 'center', alignItems: 'center', }}>
                                <FontAwesome5 name="play" size={18} color="#fff" />
                            </TouchableOpacity>
                        </Row>
                    </Row>
                </Column>

                <Column style={{ marginTop: 20, paddingHorizontal: 12, paddingVertical: 12, borderRadius: 8, marginHorizontal: 20, backgroundColor: "#262626", }}>
                    <Title style={{ fontSize: 24, marginTop: 8, }}>Recentes</Title>
                    <Label style={{}}>Confira os últimos capítulos</Label>
                    <FlatList
                        style={{ marginTop: 20, }}
                        data={chapters?.slice(0, 5)}
                        keyExtractor={(item) => item.number}
                        renderItem={({ item }) => <Card item={item} />}
                    />
                </Column>
                <Column style={{ marginTop: 20, paddingHorizontal: 12, paddingVertical: 12, borderRadius: 8, marginHorizontal: 20, backgroundColor: "#262626", marginBottom: 20, }}>
                    <Title style={{ fontSize: 24, marginTop: 8, }}>Todos ({item?.chapters})</Title>
                    <Label style={{}}>Confira todos capítulos</Label>
                   <ListChapters chapters={chapters}/>
                </Column>
            </Scroll>
        </Main>
    )
}

const Card = ({ item }) => {
    return (
        <Row style={{ backgroundColor: "#363636", paddingVertical: 10, justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, borderRadius: 6, }}>
            <Title style={{ fontSize: 22, marginLeft: 20, }}>#{item?.number}</Title>
            <Label>{item?.date}</Label>
            <TouchableOpacity style={{ backgroundColor: '#303030', padding: 12, borderRadius: 100, marginRight: 10, }} onPress={() => navigation.navigate('MangaDetails', { id: item.id })}>
                <Feather name="bookmark" size={24} color="#fff" />
            </TouchableOpacity>
        </Row>
    )
}

const ListChapters = ({ chapters }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = chapters?.slice(indexOfFirstItem, indexOfLastItem);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const Pagination = ({ itemsPerPage, totalItems,  paginate }) => {
        const pageNumbers = [];
        for (i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {  pageNumbers.push(i); }
        return (
            <Row style={{ justifyContent: 'center', marginTop: 6, flexWrap: 'wrap' }}>
                {pageNumbers.map((number) => (
                    <TouchableOpacity
                        key={number}
                        onPress={() => paginate(number)}
                        style={{ width: 42, height: 42, backgroundColor: number === currentPage ? '#FFF' : '#505050', borderRadius: 100, marginHorizontal: 10, justifyContent: 'center', alignItems: 'center', }}>
                       <Label style={{color: number === currentPage ? '#000' : '#fff', fontSize: 24, fontFamily: 'Font_Medium', marginTop: -4, marginRight: -4,}}>{number} </Label> 
                    </TouchableOpacity>
                ))}
            </Row>
        );
    };


    return (
        <Column style={{ }}>
            <FlatList
                style={{ marginTop: 20, }}
                data={currentItems}
                keyExtractor={(item) => item.number}
                renderItem={({ item }) => <Card item={item} />}
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