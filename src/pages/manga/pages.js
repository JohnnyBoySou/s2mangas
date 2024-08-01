import React, { useContext, useEffect, useRef, useState } from 'react';
import { Row, Main, Title, Label, Column, Button, } from '@theme/global';
import { Pressable, Dimensions, Image, ActivityIndicator, View, } from 'react-native';
//components
import { MotiView, } from 'moti';
const { width, height } = Dimensions.get('window');

//icons
import { ArrowLeft, ChevronFirst, ChevronLast } from 'lucide-react-native';

//hooks
import { getPages } from '@apiv2/getPages';
import { addChaptersToManga } from '@hooks/progress';
import Modal from '@components/modal/modal';

import { GestureHandlerRootView, GestureDetector, Gesture, ScrollView, FlatList } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    runOnJS,
    withTiming,
} from 'react-native-reanimated';
import { ThemeContext } from 'styled-components/native';

export default function MangaPages({ route, navigation }) {


    const { color, font} = useContext(ThemeContext)
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
                if (res?.pages?.length > 0) {
                    setpages(res.pages)
                    setprevChap(res.prev)
                    setnextChap(res.next)
                } else {
                    navigation.goBack()
                }
            } catch (error) {
                console.log(error)
                navigation.goBack()
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


    const modalDetails = useRef(null);
    return (
        <Main style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 0, }}>
            {loading ? <Load /> :
                <FlatList
                    style={{ width: width, }}
                    data={pages}
                    ListHeaderComponent={<Column style={{ height: 40, }}></Column>}
                    initialNumToRender={3}
                    removeClippedSubviews
                    maxToRenderPerBatch={3}
                    updateCellsBatchingPeriod={100}
                    ListFooterComponent={<Column style={{ height: 90, }}></Column>}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => <ImagesVertical url={item} />}
                />}
            <Modal ref={modalDetails} snapPoints={[84, height]}>
                <Column>
                    <Row style={{ zIndex: 99, marginTop: 0, paddingHorizontal: 20, backgroundColor: '#202020', width: '100%', justifyContent: 'space-between', alignItems: 'center', }}>
                        <Button style={{ backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center',  borderRadius: 100, width: 42, height: 42, }} onPress={() => navigation.goBack()} >
                            <ArrowLeft size={24} stroke='#000' />
                        </Button>
                        <Row>
                            <Pressable onPress={handlePrevChapter} style={{ backgroundColor: prevChap ? '#FFF' : '#505050', justifyContent: 'center', alignItems: 'center', borderRadius: 16,  paddingHorizontal: 18, paddingVertical: 8,}}>
                                <Label style={{ fontFamily: font.bold, color: prevChap ? '#000' : '#FFF', letterSpacing: -1, }}>Anterior</Label>
                            </Pressable>
                            <Column style={{ width: 12 }}></Column>
                            <Pressable onPress={handleNextChapter} style={{ backgroundColor: nextChap ? '#FFF' : '#505050', justifyContent: 'center', alignItems: 'center', borderRadius: 16, paddingHorizontal: 18, paddingVertical: 8,}}>
                                <Label style={{ fontFamily: font.bold, color: nextChap ? '#000' : '#FFF', letterSpacing: -1, }}>Próximo</Label>
                            </Pressable>
                        </Row>
                    </Row>
                    
                </Column>
            </Modal>
        </Main>
    )
}


const ImagesVertical = ({ url }) => {
    const [imageDimensions, setImageDimensions] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Image.getSize(url, (width, height) => {
            const { width: newWidth, height: newHeight } = getProportionalDimensions(width, height);
            setImageDimensions({ width: newWidth, height: newHeight });
            setLoading(false)
        })
    }, [url]);

    const getProportionalDimensions = (originalWidth, originalHeight) => {
        const screenWidth = Dimensions.get('window').width;
        const screenHeight = Dimensions.get('window').height;
        const aspectRatio = originalWidth / originalHeight;
        let newWidth = screenWidth;
        let newHeight = screenWidth / aspectRatio;
        if (newHeight > screenHeight) {
            newHeight = screenHeight;
            newWidth = screenHeight * aspectRatio;
        }
        return { width: newWidth, height: newHeight };
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    return (
        <Animated.Image
            source={{ uri: url }}
            resizeMode='contain'
            style={[{
                width: imageDimensions.width,
                height: imageDimensions.height,
            }]}
        />
    );
};

const ListImage = ({ url }) => {
    const MAX_TRANSLATE_X = 140;
    const SWIPE_THRESHOLD = 120;
    const translateY = useSharedValue(0);

    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            translateY.value = Math.min(event.translationY, 0);
            
        }).onEnd(() => {
            if (translateY.value < SWIPE_THRESHOLD) {
                translateY.value = withTiming(0);
            } else {
                translateY.value = withTiming(MAX_TRANSLATE_X);
            }
        });


    const rStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));


    return (
        <GestureHandlerRootView>
            <GestureDetector gesture={panGesture}>
                <Animated.View style={[{ flexDirection: 'row' }, rStyle]}>
                    <Animated.Image
                        source={{ uri: url }}
                        resizeMode='contain'
                        style={[{
                            width: 120,
                            height: 180,
                            borderRadius: 12,
                        }]}
                    />
                </Animated.View>
            </GestureDetector>
        </GestureHandlerRootView>
    )
}

const Load = () => {
    return (
        <MotiView style={{ justifyContent: 'center', alignItems: 'center', flex: 1, }}>
            <Title>Gerando páginas...</Title>
        </MotiView>
    )
}

const Error = (error) => {
    return (
        <MotiView style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 200, }}>
            <Title>Encontramos um problema</Title>
        </MotiView>
    )
}
