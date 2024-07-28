import React, { useEffect, useState } from 'react';
import { Row, Main, Title, Label, Column } from '@theme/global';
import { Pressable, FlatList, Dimensions, View, ActivityIndicator, } from 'react-native';
//components
import { MotiView, } from 'moti';
import { Image } from 'expo-image';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

//icons
import { ArrowLeft, ChevronFirst, ChevronLast } from 'lucide-react-native';

//hooks
import { getPages } from '@apiv2/getPages';
import { addChaptersToManga } from '@hooks/progress';

export default function MangaPages({ route, navigation }) {
    const itm = route?.params?.itm
    const chapter = route?.params?.chapter
    const id = route?.params?.id
    const lg = route?.params?.lg
    const [cid, setcid] = useState(id ? id : 'd950d8a3-6204-4094-8f42-8de4491a92b2');
    const [mid, setmid] = useState(itm?.id ? itm?.id : '58b09ce2-ea05-405e-8e1c-a9361df9bdd9');
    const [currentChapter, setcurrentChapter] = useState(chapter);

    const [loading, setLoading] = useState(true);
    const [nextChap, setnextChap] = useState();
    const [prevChap, setprevChap] = useState();
    const [pages, setpages] = useState();
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        const fecthData = async () => {
            try {
                await addChaptersToManga(itm, currentChapter)
                const res = await getPages(cid, mid, lg,)
                console.log(res)
                if(res?.pages?.length > 0) {
                    setpages(res.pages)
                    setprevChap(res.prev)
                    setnextChap(res.next)
                }else{
                    navigation.goBack()
                }
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        };
        fecthData()
    }, [cid])


    const handleNextChapter = () => {
        if (nextChap) {
            setLoading(true)
            setCurrentPage(0)
            setcid(nextChap?.id)
            setcurrentChapter(nextChap.chapter)
        }
    }
    const handlePrevChapter = () => {
        if (prevChap) {
            setLoading(true)
            setcid(prevChap?.id)
            setCurrentPage(0)
            setcurrentChapter(prevChap.chapter)
        }
    }

    return (
        <Main style={{ justifyContent: 'center', alignItems: 'center', }}>
            <Row style={{ position: 'absolute', top: 0, paddingTop: 40, paddingBottom: 20, zIndex: 9999, paddingHorizontal: 20, backgroundColor: '#202020', width: '100%', justifyContent: 'space-between', alignItems: 'center', }}>
                <Pressable onPress={() => navigation.goBack()} style={{}}>
                    <ArrowLeft size={30} stroke='#fff' />
                </Pressable>

                <Row>
                <Pressable onPress={handlePrevChapter} style={{ backgroundColor: '#fff', height: 40, width: 40, justifyContent: 'center', alignItems: 'center',  borderRadius: 16,  }}><ChevronFirst size={24} stroke='#000' /></Pressable>
                    <Column style={{ width: 12 }}></Column>
                <Pressable onPress={handleNextChapter} style={{ backgroundColor: '#fff', height: 40, width: 40, justifyContent: 'center', alignItems: 'center',  borderRadius: 16,  }}><ChevronLast size={24} stroke='#000' /></Pressable>
                </Row>
            </Row>
            {loading ? <Load /> :
            <FlatList  
                style={{ width: SCREEN_WIDTH, marginTop: 100,}}
                data={pages}
                windowSize={3}
                initialNumToRender={3}
                removeClippedSubviews
                maxToRenderPerBatch={3}
                updateCellsBatchingPeriod={100}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => <ImagesVertical url={item} />}
            />}
        </Main>
    )
}

const ImagesVertical = ({ url }) => {
    const [imageSize, setImageSize] = useState({ width: SCREEN_WIDTH, height: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    console.log(url)

    useEffect(() => {
        if (!url) return;

        const imageLoad = () => {
            setLoading(true);
            setError(false);

            Image.getSize(url, (width, height) => {
                const scaleFactor = SCREEN_WIDTH / width;
                const scaledHeight = height * scaleFactor;
                setImageSize({ width: SCREEN_WIDTH, height: scaledHeight });
                setLoading(false);
            }, (error) => {
                console.log(error);
                setError(true);
                setLoading(false);
            });
        };

        imageLoad();
    }, [url]);

    if (error) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Erro ao carregar imagem</Text>
            </View>
        );
    }

    if (loading) {
        return (
            <View style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#ED274A" />
            </View>
        );
    }

    return (
        <ExpoImage
            source={url}
            contentFit="contain"
            transition={100}
            style={{ width: imageSize.width, height: imageSize.height, backgroundColor: '#fff' }}
        />
    );
};


const Load = () => {
    return (
        <MotiView style={{ justifyContent: 'center', alignItems: 'center', width: SCREEN_WIDTH, }}>
            <Image source={{ uri: 'https://i.pinimg.com/564x/04/c5/0b/04c50bc74a55f80fa0755e5bf55a5ef2.jpg' }} style={{ width: 150, height: 250, margin: 10, objectFit: 'cover', borderRadius: 12, transform: [{ rotate: '12deg' }] }} />
            <Title>Gerando páginas</Title>
            <Label>Isso pode demorar um pouco...</Label>
        </MotiView>
    )
}
const Error = (error) => {
    return (
        <MotiView style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 200, }}>
            <Image blurRadius={40} source={{ uri: "https://i.pinimg.com/564x/db/d5/8d/dbd58dd3bee3763a0c34e73f6ed64b62.jpg" }} style={{ width: SCREEN_WIDTH, height: 1.2 * SCREEN_HEIGHT, opacity: 0.6, zIndex: -2, position: 'absolute', }} />
            <Image src='https://i.pinimg.com/564x/8f/83/a1/8f83a1f9c13373e854f4385974b1c8bd.jpg' style={{ width: 200, height: 300, margin: 10, marginTop: 200, objectFit: 'cover', borderRadius: 12, transform: [{ rotateX: '12deg' }] }} />
            <Title>Encontramos um problema</Title>
            <Label>{error}</Label>
        </MotiView>
    )
}

