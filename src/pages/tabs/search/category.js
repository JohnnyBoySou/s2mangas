import React, { useState, useEffect, useContext } from 'react';
import { Column, Row, Main, Scroll, Title, Label, } from '@theme/global';
import { Pressable, FlatList, Image } from 'react-native';
import { getCategory } from '@apiv2/getCategory';
import { MotiView } from 'moti';
import { ActivityIndicator } from 'react-native-paper';
import { ThemeContext } from 'styled-components/native';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';

export default function CategoryPage({ navigation, route }) {
    const { color } = useContext(ThemeContext)
    const { category } = route.params;
    const [data, setData] = useState([]);
    const [loading, setloading] = useState();
    const [page, setpage] = useState(1);
    useEffect(() => {
        const fetchData = async () => {
            setloading(true);
            const response = await getCategory(category.id, page);
            setData(response);
            setloading(false);
        }
        fetchData()
    }
        , [page])

    return (
        <Main>
            <Scroll>
                <Column style={{ padding: 0, }}>
                    <Pressable onPress={() => { navigation.goBack() }} style={{ width: 90, height: 10, backgroundColor: '#303030', borderRadius: 100, alignSelf: 'center', marginBottom: -20, zIndex: 99, marginTop: 10, }} />
                    <Row style={{ justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20, paddingHorizontal: 20, marginTop: 12,}}>
                        <Column style={{  justifyContent: 'center', }}>
                            <Label style={{ marginTop: 20, marginBottom: -2, color: "#fff", fontSize: 16, }}>Categoria</Label>
                            <Title style={{ fontSize: 34,  letterSpacing: -2, color: "#fff", }}>{category?.name}</Title>
                        </Column>
                        <Row>
                            <Pressable onPress={() => { page >= 1 && setpage(page - 1) }} 
                            style={{  backgroundColor: "#303030", borderRadius: 100, height: 62, width: 62, justifyContent: 'center', alignItems: 'center', }}>
                               <ArrowLeft size={32} color="#fff"/>
                            </Pressable>
                            <Column style={{ width: 12, }} />
                            <Pressable onPress={() => setpage(page + 1)} 
                             style={{  backgroundColor: "#fff", borderRadius: 100, height: 62, width: 62, justifyContent: 'center', alignItems: 'center', }}>
                               <ArrowRight size={32} color="#000"/>
                            </Pressable>
                        </Row>
                    </Row>
                    {loading && <Column style={{ justifyContent: 'center', alignItems: 'center', marginTop: 40, borderRadius: 12, }}>
                            <ActivityIndicator color={color.primary} size={32} />
                        </Column>}


                    {!loading && <FlatList
                        data={data}
                        style={{ margin: 20, }}
                        columnWrapperStyle={{ justifyContent: 'space-between', }}
                        renderItem={({ item }) => (
                            <MotiView from={{ translateY: -30, opacity: 0, }} animate={{ translateY: 0, opacity: 1, width: '48%', marginBottom: 18, }}>
                                <Pressable onPress={() => navigation.navigate('MangaDetails', { id: item.id })} >
                                    <Column style={{ borderRadius: 8, backgroundColor: '#262626', overflow: 'hidden', }}>
                                        <Image source={{ uri: item.capa }} style={{ flexGrow: 1, height: 260, }} resizeMode='cover' />
                                        <Column style={{ height: 76, }}>
                                            <Title style={{ fontSize: 18, marginTop: 6, marginHorizontal: 12, }}>{item?.name?.slice(0, 24)}</Title>
                                            <Label style={{ fontSize: 12, marginHorizontal: 12, marginVertical: 4, }}>{item?.type} - {item?.year}</Label>
                                        </Column>
                                    </Column>
                                </Pressable>
                            </MotiView>
                        )}
                        ListEmptyComponent={<Column style={{ justifyContent: 'center', alignItems: 'center', marginTop: 40, borderRadius: 12, }}>
                            <ActivityIndicator color={color.primary} size={32} />
                        </Column>}

                        keyExtractor={item => item.id}
                        numColumns={2}
                        ListFooterComponent={() => (
                            <>
                                {!loading &&
                                    <Row style={{ marginBottom: 40, flexGrow: 1, }}>

                                        <Pressable onPress={() => { page >= 1 && setpage(page - 1) }} style={{ flexGrow: 1, marginVertical: 12, backgroundColor: "#303030", borderRadius: 6, height: 50, justifyContent: 'center', alignItems: 'center', }}>
                                            <Label style={{ fontSize: 18, fontFamily: 'Font_Medium', color: "#fff", }}>Anterior</Label>
                                        </Pressable>
                                        <Column style={{ width: 12, }} />
                                        <Pressable onPress={() => setpage(page + 1)} style={{ flexGrow: 1, marginVertical: 12, backgroundColor: "#fff", borderRadius: 6, height: 50, justifyContent: 'center', alignItems: 'center', }}>
                                            <Label style={{ fontSize: 18, fontFamily: 'Font_Medium', color: "#000", }}>Próximo</Label>
                                        </Pressable>
                                    </Row>}
                            </>
                        )}

                    />}
                </Column>
            </Scroll>
        </Main>
    )
}