import React, { useState, useEffect, useContext } from 'react';
import { Column, Row, Main, Scroll, Title, Label, Button, } from '@theme/global';
import { Pressable, FlatList, Image, } from 'react-native';
import { getCategory } from '@apiv2/getCategory';
import { ActivityIndicator } from 'react-native-paper';
import { ThemeContext } from 'styled-components/native';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import Card from '@components/lists/card';
import { LinearGradient } from 'expo-linear-gradient';

import Animated, { FadeIn, FadeInUp, FadeOut } from 'react-native-reanimated'

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

    const [txt, settxt] = useState(false);

    return (
        <Main>
            <Scroll stickyHeaderIndices={[0]} onScroll={(event) => { event.nativeEvent.contentOffset.y > 60 ? settxt(true) : settxt(false) }}>
                <Row style={{ justifyContent: 'space-between', backgroundColor: category.color, paddingHorizontal: 20, paddingVertical: 12, flexGrow: 1, }}>
                    <Row style={{ justifyContent: 'center', alignItems: 'center', }}>
                        <Button style={{ width: 42, height: 42, borderRadius: 100, justifyContent: 'center', alignItems: 'center', }} onPress={() => { navigation.goBack() }} >
                            <ArrowLeft size={32} color="#fff" />
                        </Button>
                        {txt &&
                            <Animated.View entering={FadeIn} exiting={FadeOut}>
                                <Title style={{ fontSize: 24, letterSpacing: -1, color: "#fff", marginLeft: 12, }}>{category?.name}</Title>
                            </Animated.View>}
                    </Row>
                    <Row style={{ justifyContent: 'center', alignItems: 'center', position: 'absolute', right: 0, }}>
                        
                        <Button onPress={() => { page >= 1 && setpage(page - 1) }}
                            style={{ backgroundColor: "#FFF", borderRadius: 12, height: 42, width: 42, justifyContent: 'center', alignItems: 'center', }}>
                            <ArrowLeft size={24} color="#000" />
                        </Button>
                        <Button onPress={() => { page >= 1 && setpage(page - 1) }}
                            style={{  borderRadius: 12, height: 42, width: 42, justifyContent: 'center', alignItems: 'center', }}>
                           <Title>{page}</Title>
                        </Button>
                        <Button onPress={() => setpage(page + 1)}
                            style={{ backgroundColor: "#FFF", borderRadius: 12, height: 42, width: 42, justifyContent: 'center', alignItems: 'center', }}>
                            <ArrowRight size={24} color="#000" />
                        </Button>
                    </Row>
                </Row>
                <Column>
                    <Row style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: -50, }}>
                        <LinearGradient colors={[category?.color, "transparent"]} style={{ flexGrow: 1, height: 140, borderBottomRightRadius: 6, borderBottomLeftRadius: 6, }} >
                            <Title style={{ fontSize: 42, letterSpacing: -2, color: "#fff", marginLeft: 20, }}>{category?.name}</Title>
                        </LinearGradient>
                    </Row>

                    {loading ? <Column style={{ justifyContent: 'center', alignItems: 'center', marginTop: 40, borderRadius: 12, }}><ActivityIndicator color={color.primary} size={32} /></Column>
                        : <FlatList
                            data={data}
                            contentContainerStyle={{ rowGap: 20, marginHorizontal: 20, }}
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
                            ListFooterComponent={<Column style={{ height: 20, }} />}
                        />}
                </Column>
            </Scroll>
        </Main>
    )
}