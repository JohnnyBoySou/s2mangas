import React, { useState, useEffect, useContext } from 'react';
import { Column, Row, Main, Scroll, Title, Label, } from '@theme/global';
import { Pressable, FlatList, Image } from 'react-native';
import { getCategory } from '@apiv2/getCategory';
import { ActivityIndicator } from 'react-native-paper';
import { ThemeContext } from 'styled-components/native';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import Card from '@components/lists/card';

export default function CategoryPage({ navigation, route }) {
    const { color } = useContext(ThemeContext)
    const { category } = route.params;
    const [data, setData] = useState([]);
    const [loading, setloading] = useState(true);
    const [page, setpage] = useState(1);
    useEffect(() => {
        const fetchData = async () => {
            try {
                setloading(true);
                const res = await getCategory(category.id, page);
                setData(res);
            } catch (error) {
                console.log(error)
            } finally {
                setloading(false);
            }
        }
        fetchData()
    }, [page])

    return (
        <Main>
            <Scroll>
                <Column style={{ padding: 0, }}>
                    <Pressable onPress={() => { navigation.goBack() }} style={{ width: 90, height: 10, backgroundColor: '#303030', borderRadius: 100, alignSelf: 'center', marginBottom: -20, zIndex: 99, marginTop: 10, }} />
                    <Row style={{ justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20, paddingHorizontal: 20, marginTop: 12, }}>
                        <Column style={{ justifyContent: 'center', }}>
                            <Label style={{  marginBottom: -2, color: "#fff", fontSize: 16, }}>Categoria</Label>
                            <Title style={{ fontSize: 34, letterSpacing: -2, color: "#fff", }}>{category?.name}</Title>
                        </Column>
                        <Row>
                            <Pressable onPress={() => { page >= 1 && setpage(page - 1) }}
                                style={{ backgroundColor: "#303030", borderRadius: 100, height: 62, width: 62, justifyContent: 'center', alignItems: 'center', }}>
                                <ArrowLeft size={32} color="#fff" />
                            </Pressable>
                            <Column style={{ width: 12, }} />
                            <Pressable onPress={() => setpage(page + 1)}
                                style={{ backgroundColor: "#fff", borderRadius: 100, height: 62, width: 62, justifyContent: 'center', alignItems: 'center', }}>
                                <ArrowRight size={32} color="#000" />
                            </Pressable>
                        </Row>
                    </Row>

                    {loading ? <Column style={{ justifyContent: 'center', alignItems: 'center', marginTop: 40, borderRadius: 12, }}><ActivityIndicator color={color.primary} size={32} /></Column>
                        : <FlatList
                            data={data}
                            contentContainerStyle={{ rowGap: 20, margin: 20, }}
                            columnWrapperStyle={{ justifyContent: 'space-between', }}
                            renderItem={({ item }) => <Card item={item} />}
                            keyExtractor={item => item.id}
                            numColumns={2}
                            windowSize={6}
                            initialNumToRender={6}
                            removeClippedSubviews={true}
                            maxToRenderPerBatch={6}
                            updateCellsBatchingPeriod={100}
                            showsVerticalScrollIndicator={false}
                        />}
                </Column>
            </Scroll>

            <Row style={{ position: 'absolute', bottom: 20, right: 20, }}>
                <Pressable onPress={() => { page >= 1 && setpage(page - 1) }}
                    style={{ backgroundColor: "#202020", borderRadius: 100, height: 42, width: 42, justifyContent: 'center', alignItems: 'center', }}>
                    <ArrowLeft size={24} color="#fff" />
                </Pressable>
                <Column style={{ width: 12, }} />
                <Pressable onPress={() => setpage(page + 1)}
                    style={{ backgroundColor: "#fff", borderRadius: 100, height: 42, width: 42, justifyContent: 'center', alignItems: 'center', }}>
                    <ArrowRight size={24} color="#000" />
                </Pressable>
            </Row>
        </Main>
    )
}