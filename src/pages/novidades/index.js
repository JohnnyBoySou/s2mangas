import React, { useContext, useEffect, useState, useRef } from 'react';
import { FlatList, Pressable } from 'react-native';
import { Column, Row, Title, Label, Main, Button } from '@theme/global';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiImage } from 'moti';
import { ThemeContext } from 'styled-components/native';

export default function NovidadesPage({ navigation }) {
    const { font, color } = useContext(ThemeContext);

    const [data, setData] = useState([]);
    const [loading, setloading] = useState();
    useEffect(() => {
        const fetchData = async () => {
            setloading(true);
            try {
                const response = await axios.get('https://www.s2mangas.com/api/news');
                setData(response.data);
            } catch (error) {
                console.log(error);
            } finally {
                setloading(false);
            }
        };

        //fetchData();
    }, [])

    const a = false;
    const CardThread = ({ item }) => {
        const { name, label, imgs, author, date } = item
        return (
            <Column style={{ backgroundColor: "#202020", marginBottom: 12, paddingBottom: 24, marginHorizontal: 20, borderRadius: 12, }}>
                <Row style={{ padding: 16, }}>
                    <MotiImage source={{ uri: author?.img }} style={{ width: 46, height: 46, borderRadius: 100, objectFit: 'cover', backgroundColor: '#303030', }} />
                    <Column style={{ flexGrow: 1, width: '80%', marginLeft: 12, }}>
                        <Row style={{ justifyContent: 'space-between', alignItems: 'center', marginRight: 20, }}>
                            <Label style={{ fontSize: 16, fontFamily: font.book, }}>@{author?.username}</Label>
                            <Label style={{ fontSize: 12, }}>{date}</Label>
                        </Row>
                        <Title style={{ fontSize: 18, marginBottom: 6, marginTop: 6, }}>{name}</Title>
                        <Label style={{ fontSize: 14, }}>{label}</Label>

                    </Column>
                </Row>
                <FlatList
                    data={imgs}
                    horizontal
                    ListHeaderComponent={<Column style={{ width: 77, }} />}
                    ListFooterComponent={<Column style={{ width: 30, }} />}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => <MotiImage source={{ uri: item }} style={{ width: 180, height: 220, borderRadius: 12, marginRight: 8, }} />}
                    keyExtractor={(item) => item}
                />
            </Column>
        )
    }
    const flatListRef = useRef(null);
    return (
        <Main>
            <FlatList
                data={threads}
                windowSize={3}
                showsVerticalScrollIndicator={false}
                updateCellsBatchingPeriod={100}
                maxToRenderPerBatch={3}
                initialNumToRender={3}
                
                ListFooterComponent={<Column style={{ padding: 16, justifyContent: 'center', alignItems: 'center', }}>
                    <Column style={{ width: 82, height: 82, justifyContent: 'center', alignItems: 'center', backgroundColor: '#303030', borderRadius: 100, marginVertical: 12, }}><Title>🚀</Title></Column>
                    <Title style={{ fontSize: 22, }}>Você chegou ao fim da lista!</Title>
                    <Label>Mas será mesmo que é o fim?</Label>
                    <Column style={{ height: 70, }}></Column>
                </Column>}
                renderItem={({ item }) => <CardThread item={item} />}
                keyExtractor={(item) => item.id}
                ref={flatListRef}
            />
        </Main>
    )
}
/**
 * 
 * ListHeaderComponent={
                    <Column style={{ paddingVertical: 30, paddingHorizontal: 20, justifyContent: 'center', alignItems: 'center',  }}>
                        <Title>Novidades por aqui!</Title>
                        <Label>Veja as novidades mais recentes</Label>
                    </Column>
                }<Button onPress={() => { flatListRef.current?.scrollToOffset({ offset: 0, animated: true }) }} style={{ backgroundColor: '#fff', paddingVertical: 8, marginVertical: 12, paddingHorizontal: 12, borderRadius: 100, }}>
                        <Label style={{ color: color.primary, fontFamily: font.bold, fontSize: 14,}}>Voltar ao topo</Label>
                    </Button>
 */

const threads = [
    {
        id: 1,
        name: 'Novos mangás adicionadossss',
        label: 'Alguns dos mangás mais cotados do momento estão disponíveis agora no S2 Mangas. Segue o fio 🧶',
        imgs: ['https://i.pinimg.com/564x/ea/f9/a3/eaf9a3432b9ee7cf4c6385d57d71a001.jpg', 'https://i.pinimg.com/564x/ec/c3/cc/ecc3cc16fad1ac417a7ba4e089615408.jpg', 'https://i.pinimg.com/736x/c5/be/9b/c5be9bee5236315b8541ba323807981b.jpg'],
        date: '2h',
        author: {
            name: 'S2 Mangás',
            username: 's2mangas',
            img: 'https://i.pinimg.com/564x/6b/e4/de/6be4debbc896fefcdba64f361e1430b0.jpg',
            verified: true,
        }
    },
    {
        id: 2,
        date: '1 sem',
        name: 'Novos Decks chegando!',
        label: 'Passando para avisar que estamos com novos decks disponíveis na lojinha. Corre para pegar o seu! 🎮',
        imgs: ['https://i.pinimg.com/564x/1d/53/51/1d5351961991f409b92bfdfb09e2d61b.jpg', 'https://i.pinimg.com/564x/98/64/bd/9864bd2443b3e1f06136a4c197ae5178.jpg', 'https://i.pinimg.com/564x/ff/19/1b/ff191bd277d67a205e6f66ecd6127818.jpg'],
        author: {
            name: 'S2 Mangás',
            username: 's2mangas',
            img: 'https://i.pinimg.com/564x/6b/e4/de/6be4debbc896fefcdba64f361e1430b0.jpg',
            verified: true,
        }
    },
    {
        id: 3,
        date: '2 sem',
        name: 'Biblioteca com cara nova!',
        label: 'Agora a sua biblioteca está com muitas novidades e funcionalidades maravilhosas. Corre para ver 🎉',
        imgs: ['https://i.pinimg.com/564x/37/52/5b/37525ba5cd896157270df0a7cc1f30be.jpg', 'https://i.pinimg.com/564x/88/0d/46/880d4665d0b38aa479f392fd2c17068f.jpg', 'https://i.pinimg.com/564x/ff/58/9a/ff589a3be442f3228670d12afe69d727.jpg'],
        author: {
            name: 'S2 Mangás',
            username: 's2mangas',
            img: 'https://i.pinimg.com/564x/6b/e4/de/6be4debbc896fefcdba64f361e1430b0.jpg',
            verified: true,
        }
    },
]