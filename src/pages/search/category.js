import React, { useState, useEffect } from 'react';
import { Column, Row, Main, Scroll, Title, Label, } from '../../theme/global';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, FlatList , Image} from 'react-native';
import { getCategory } from '@apiv2/getCategory';
import { MotiView } from 'moti';

export default function CategoryPage({navigation, route}) {
    const { category } = route.params;
    const [data, setData] = useState([]);

    const [page, setpage] = useState(1);
    console.log(category.id)
    useEffect(() => {
        getCategory(category.id, page).then((response) => {
            setData(response)
        })
    }
    ,[page])


    return (
        <Main>
            <Scroll>
                <Column style={{ padding: 0, }}>
                    <Pressable onPress={() => {navigation.goBack()}}  style={{ width: 90, height: 10, backgroundColor: '#303030', borderRadius: 100, alignSelf: 'center', marginBottom: -20, zIndex: 99, marginTop: 10, }}/>
                    <Column style={{ paddingVertical: 20, paddingHorizontal: 20, borderRadius: 12, height: 140, marginBottom: 10, }}>
                        <Label style={{ marginTop: 20, marginBottom: -5, color: "#fff", textAlign: 'center' }}>Categoria</Label>
                        <Title style={{ fontSize: 52, letterSpacing: -2, zIndex: 99, color: "#fff", textAlign: 'center' }}>{category?.name}</Title>
                    </Column>
                    

                    <FlatList
                        data={data}
                        style={{ margin: 20,  }}
                        columnWrapperStyle={{ justifyContent: 'space-between', }}
                        renderItem={({ item }) => (
                            <MotiView from={{translateY: -30, opacity: 0, }} animate={{ translateY: 0, opacity: 1, width: '48%',  marginBottom: 18,  }}>
                            <Pressable onPress={() => navigation.navigate('MangaDetails', { id: item.id })} >
                                <Column style={{  borderRadius: 8,  backgroundColor: '#262626',  overflow: 'hidden',}}>
                                    <Image source={{ uri: item.capa }} style={{ flexGrow: 1, height: 260,   }} resizeMode='cover' />
                                    <Column style={{ height: 76, }}>
                                    <Title style={{ fontSize: 18, marginTop: 6, marginHorizontal: 12, }}>{item?.name?.slice(0, 24)}</Title>
                                    <Label style={{ fontSize: 12,  marginHorizontal: 12, marginVertical:4,}}>{item?.type} - {item?.year}</Label>
                                    </Column>
                                </Column>
                            </Pressable>
                            </MotiView>
                        )}
                        ListEmptyComponent={<Column style={{ justifyContent: 'center', alignItems: 'center', marginTop: 40, borderRadius: 12, backgroundColor: '#404040',   height: 600, width: '100%' }}>
                            <Label style={{ fontSize: 18, fontFamily: 'Font_Medium', color: "#fff",}}>Carregando mangás...</Label>
                        </Column>}

                        keyExtractor={item => item.id}
                        numColumns={2}
                        ListFooterComponent={() => (
                            <Row style={{marginBottom: 40, flexGrow: 1,}}>
                            <Pressable onPress={() => {page >= 1 && setpage(page - 1) } } style={{ flexGrow: 1, marginVertical: 12, backgroundColor: "#303030", borderRadius: 6, height: 50, justifyContent: 'center', alignItems: 'center', }}>
                                <Label style={{ fontSize: 18, fontFamily: 'Font_Medium', color: "#fff",}}>Anterior</Label>
                            </Pressable>
                            <Column style={{width: 12, }} />
                            <Pressable onPress={() => setpage(page + 1)} style={{ flexGrow: 1, marginVertical: 12, backgroundColor: "#fff", borderRadius: 6, height: 50, justifyContent: 'center', alignItems: 'center', }}>
                                <Label style={{ fontSize: 18, fontFamily: 'Font_Medium', color: "#000", }}>Próximo</Label>
                            </Pressable>
                            </Row>
                        )}

                />
                </Column>
            </Scroll>
        </Main>
    )
}