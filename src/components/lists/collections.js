import React, { useState, useEffect, memo } from 'react';
import { Column, Row, Title, Label, Button, } from '@theme/global';
import { FlatList, Pressable, Image } from 'react-native';
import { listCollections } from '@hooks/collections';
import { useNavigation } from '@react-navigation/native';
import { MotiImage } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';

export default function CollectionsComponent() {
    const navigation = useNavigation();
    const [data, setData] = useState([]);
    useEffect(() => {
        listCollections().then((res) => {
            setData(res);
        })
    }, [])
        return (
            <Column style={{ marginHorizontal: 20, }}>
                {data.length === 0  ? <Column>
                <Title>Você ainda não tem coleções</Title>
                <Label>Salve suas coleções para ver aqui</Label>
                <Row style={{ marginVertical: 30, alignSelf: 'center',}}>
                        <Column style={{ transform: [{ rotate: '12deg', }] }}><MotiImage source={{ uri: 'https://i.pinimg.com/564x/d3/86/3a/d3863a8d0ff7930aeecd8377fd912b1a.jpg' }} style={{ width: 120, height: 180, borderRadius: 8, }} /></Column>
                        <Column style={{ transform: [{ rotate: '0deg', }], borderWidth: 8, borderColor: "#171717", borderRadius: 16, marginHorizontal: -30, }}><MotiImage source={{ uri: 'https://i.pinimg.com/236x/67/a1/3c/67a13cf926bfab690a113c2d3eac779e.jpg' }} style={{ width: 120, height: 180, borderRadius: 8, }} /></Column>
                        <Column style={{ transform: [{ rotate: '-12deg', }], borderWidth: 8, borderColor: "#171717", borderRadius: 16, }}><MotiImage source={{ uri: 'https://i.pinimg.com/564x/9c/93/8f/9c938f6ffd7510629bc36ebec7a1e5c6.jpg' }} style={{ width: 120, height: 180, borderRadius: 8, }} /></Column>
                    </Row>

                <Button onPress={() => navigation.navigate('Collections')} style={{ padding: 12, backgroundColor: "#fff", borderRadius: 100, paddingHorizontal: 20, alignSelf:'center',  }}>
                    <Label style={{ color: "#000", fontFamily: 'Font_Medium' }}>Criar coleção</Label>
                </Button>
                </Column> : 
                <Column>
                <Title style={{ fontSize: 22, letterSpacing: -1, }}>Suas coleções</Title>
                <Label style={{ fontSize: 16, letterSpacing: -1, }}>Veja o que você salvou</Label>
                </Column>}
                <FlatList
                    style={{ marginVertical: 16, marginHorizontal: -20, }}
                    data={data}
                    ListHeaderComponent={<Column style={{ width: 20, }} />}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <Card item={item} />}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
            </Column>
        );
}

const Card = memo(({ item }) => {
    const navigation = useNavigation();
    return (
        <Button onPress={() => { navigation.navigate('CollectionDetails', {item: item });}} style={{ backgroundColor: "#303030", borderRadius: 6, width: 162, marginRight: 16,  }}>
            <Column style={{ paddingVertical: 12,  }}>
            <Image transition={200} contentFit='cover' blurRadius={80} source={{ uri: item.capa }} style={{ width: 162, height: 164, borderTopLeftRadius: 6, borderTopRightRadius: 6, alignSelf: 'center', position: 'absolute', top: 0, }} />
            <Image source={{ uri: item.capa }} style={{ width: 132, height: 132, borderRadius: 12, alignSelf: 'center', marginBottom: 6, }} />
            <LinearGradient colors={['transparent', '#303030']} style={{ flexGrow: 1, height: 70, marginTop: -55, marginBottom: -12, }} />
            <Title style={{ fontSize: 16, paddingHorizontal: 12, letterSpacing: -1, textAlign: 'center',}}>{item?.name?.slice(0,12)}</Title>
            <Label style={{ fontSize: 12, paddingHorizontal: 12, textAlign: 'center', }}>{item?.mangas?.length} • {item?.date}</Label>
            </Column>
        </Button>
    )
})