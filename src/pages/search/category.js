import React, { useState, useEffect } from 'react';
import { Column, Row, Main, Scroll, Title, Label, } from '../../theme/global';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, FlatList , Image} from 'react-native';
import requestGenre from '../../api/manga/genres';

export default function CategoryPage({navigation, route}) {
    const { category } = route.params;
    const [data, setData] = useState([]);

    const [page, setpage] = useState(1);

    useEffect(() => {
        requestGenre(category.id, page).then((response) => {
            setData([...data, ...response.mangas])
        })
    }
    ,[page])


    return (
        <Main>
            <Scroll>
                <Column style={{ padding: 0, }}>
                    <Pressable onPress={() => {navigation.goBack()}}  style={{ width: 90, height: 10, backgroundColor: '#303030', borderRadius: 100, alignSelf: 'center', marginBottom: -20, zIndex: 99, marginTop: 10, }}/>
                    <Column style={{ backgroundColor: category.color, paddingVertical: 20, paddingHorizontal: 20, borderRadius: 12, height: 140, marginBottom: 10, }}>
                        <Label style={{ marginTop: 20, marginBottom: -5, color: "#fff", textAlign: 'center' }}>Categoria</Label>
                        <Title style={{ fontSize: 52, letterSpacing: -2, zIndex: 99, color: "#fff", textAlign: 'center' }}>{category?.name}</Title>
                    </Column>
                    

                    <FlatList
                        data={data}
                        style={{alignSelf: 'center', margin: 10,  }}
                        columnWrapperStyle={{ justifyContent: 'space-between', }}
                        renderItem={({ item }) => (
                            <Pressable onPress={() => navigation.navigate('MangaDetails', { id: item.id })} style={{ width: '48%', marginBottom: 18, }}>
                                <Column style={{  borderRadius: 6,  backgroundColor: '#262626', overflow: 'hidden', }}>
                                    <Image source={{ uri: item.capa }} style={{ flexGrow: 1, height: 260,  }} resizeMode='cover' />
                                    <Title style={{ fontSize: 18, marginTop: 6, marginHorizontal: 12,}}>{item.name.slice(0, 24)}</Title>
                                    <Label style={{ fontSize: 12,  marginHorizontal: 12, marginVertical: 6,}}>{item.score}</Label>
                                </Column>
                            </Pressable>
                        )}
                        keyExtractor={item => item.id}
                        numColumns={2}
                        ListFooterComponent={() => (
                            <Pressable onPress={() => setpage(page + 1)} style={{ flexGrow: 1, marginVertical: 12, backgroundColor: "#fff", borderRadius: 6, height: 50, justifyContent: 'center', alignItems: 'center', }}>
                                <Label style={{ fontSize: 18, fontFamily: 'Font_Medium', color: "#000", }}>Carregar mais</Label>
                            </Pressable>
                        )}

                />
                </Column>
            </Scroll>
        </Main>
    )
}