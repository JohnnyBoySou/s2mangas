import React, { useEffect, useState, useCallback, useRef} from 'react';
import { Row, Scroll, Main, Column, Title, Label } from '../../theme/global';
import { Pressable, FlatList, Dimensions, Image , View, } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import requestPages from '../../api/manga/pages';
import { addChaptersToManga } from '../../api/user/progress';
import { MotiView } from 'moti';

import Bottom from './bottom';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Album } from 'lucide-react-native';




const { width, height: SCREEN_HEIGHT } = Dimensions.get('window'); 


export default function MangaPages({ route, navigation }) {
    //const {id, chapter, itm } = route.params;
    const a = false;
    const [item, setItem] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    useEffect(() => {
        const requestData = async () => {
            setLoading(true)
          //addChaptersToManga(itm, chapter)  
          requestPages(chapter, id).then((response) => {
               setItem(response)
                setLoading(false);
                if(response.images.length === 0) {
                    setError('Não foi possível carregar as páginas')
                }
            })
        };


    }, [])
    const handleSavePage = () => {
    }
    const handleNext = () => {
        setLoading(true);
    }



    const bottom = useRef(null);
    const openBottom = useCallback(() => {
        const isActive = bottom?.current?.isActive();
        if (isActive) {
            bottom?.current?.scrollTo(0);
        } else {
            bottom?.current?.scrollTo(300);
        }
      }, []);

      const pages = ['https://i.pinimg.com/564x/6a/50/5f/6a505f6b1837787e9e7f28c8f5a20988.jpg',]



    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
        <Main>

            {a && <>
              {loading && <MotiView style={{ justifyContent: 'center', alignItems: 'center',  paddingBottom: 200,}}>
                    <Image blurRadius={40} source={{ uri: "https://i.pinimg.com/564x/db/d5/8d/dbd58dd3bee3763a0c34e73f6ed64b62.jpg" }} style={{ width: width, height: 1.1 * SCREEN_HEIGHT, opacity: 0.6,   zIndex: -2, position: 'absolute', }} />
                    <Image src='https://i.pinimg.com/564x/ae/87/1a/ae871a9d054cd5f966b49a3c734ae8bc.jpg' style={{ width: 200, height: 300, margin: 10, marginTop: 200, objectFit: 'cover', borderRadius: 12, transform: [{rotateX: '12deg'}] }} />
                    <Title>Gerando páginas</Title>
                    <Label>Isso pode demorar um pouco...</Label>
                </MotiView> }
                {!loading && error && <MotiView style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 200,}}>
                    <Image blurRadius={40} source={{ uri: "https://i.pinimg.com/564x/db/d5/8d/dbd58dd3bee3763a0c34e73f6ed64b62.jpg" }} style={{ width: width, height: 1.2 * SCREEN_HEIGHT, opacity: 0.6,   zIndex: -2, position: 'absolute', }} />
                    <Image src='https://i.pinimg.com/564x/8f/83/a1/8f83a1f9c13373e854f4385974b1c8bd.jpg' style={{ width: 200, height: 300, margin: 10, marginTop: 200, objectFit: 'cover', borderRadius: 12, transform: [{rotateX: '12deg'}] }} />
                    <Title>Encontramos um problema</Title>
                    <Label>{error}</Label>
                </MotiView>}
                </>}

            <Scroll>
                {!loading && <ListPages item={item} />}
            </Scroll>

            <Bottom ref={bottom}>
                <Column style={{ flex: 1, backgroundColor: '#202020', borderRadius: 24, paddingHorizontal: 20, paddingVertical: 20, }} >
                    <Row style={{ marginBottom: 20,justifyContent: 'space-between', alignItems: 'center',  }}>
                        <Pressable onPress={() => navigation.goBack()}>
                            <AntDesign name="arrowleft" size={32} color="#fff" />
                        </Pressable>
                        <Title>Opções</Title>
                        <Pressable onPress={() => navigation.goBack()}>
                            <AntDesign name="arrowleft" size={32} color="#fff" />
                        </Pressable>
                    </Row>


                    <Pressable style={{ flexDirection: 'row', borderRadius: 8, backgroundColor: "#303030", padding: 12, marginBottom: 12, }}>
                        <Album color="#fff" size={24}/>
                        <Label style={{ color: "#fff", marginLeft: 10, }}>Adicionar marcador</Label>
                    </Pressable>
                    <Pressable style={{ flexDirection: 'row', borderRadius: 8, backgroundColor: "#303030", padding: 12, marginBottom: 12, }}>
                        <Album color="#fff" size={24}/>
                        <Label style={{ color: "#fff", marginLeft: 10, }}>Adicionar marcador</Label>
                    </Pressable>
                    <Pressable style={{ flexDirection: 'row', borderRadius: 8, backgroundColor: "#303030", padding: 12, marginBottom: 12, }}>
                        <Album color="#fff" size={24}/>
                        <Label style={{ color: "#fff", marginLeft: 10, }}>Adicionar marcador</Label>
                    </Pressable>
                </Column>
            </Bottom>

        </Main>
        </GestureHandlerRootView>
    )
}



const Images = ({ item, format }) => {
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        Image.getSize(item, (width, height) => {
            const screenWidth = Dimensions.get('window').width;
            const scaleFactor = screenWidth / width;
            const scaledHeight = height * scaleFactor;
            setImageSize({ width: screenWidth, height: scaledHeight });
        }, (error) => {
            console.log("Error loading image:", error);
        });
    }, [item]);

    return (
        <Column>
        <Image source={{ uri: item }} resizeMode='cover' style={{ width: imageSize.width, height: imageSize.height, margin: 10 }} /> 
        </Column>
    );
}

const ListPages = ({ item }) => {
    const pages = item?.images
    const format = item?.format

    return (
            <FlatList
                style={{ marginTop: 20, }}
                data={pages}
                keyExtractor={(item) => item.toString()}
                renderItem={({ item }) => <Images format={format} item={item} />}
            />
    );
};