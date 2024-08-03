import React, { useEffect, useRef, useState } from 'react';
import { Row, Main, Title, Label, Column, Button, } from '@theme/global';
import { Pressable, Dimensions, Image, ActivityIndicator, View, StyleSheet } from 'react-native';
//components
import { MotiImage, MotiView, } from 'moti';
const { width: SCREEN_WIDTH, height } = Dimensions.get('window');
import Check from '@components/check';
//icons
import { ArrowLeft, CircleX, ImageOff, Image as ImageOn, Newspaper } from 'lucide-react-native';

//hooks
import { getPages } from '@apiv2/getPages';
import { addChaptersToManga } from '@hooks/progress';
import Modal from '@components/modal/modal';

import { GestureHandlerRootView, GestureDetector, Gesture, FlatList } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    runOnJS,
    withTiming,
} from 'react-native-reanimated';
import { Image as ExpoImage } from 'expo-image';
import { BlurView } from 'expo-blur';
import { useTheme } from '@hooks/theme';
import Slider from '../../components/slider';

export default function MangaPages({ route, navigation }) {
    const { color, font } = useTheme()
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

    const [filter, setfilter] = useState('transparent');
    const [opacity, setopacity] = useState(60);
    const [blur, setblur] = useState(false);
    const [scrollEnabled, setScrollEnabled] = useState();



    const heightFilter = useSharedValue(80);
    const toggleFiler = () => {
        if (heightFilter.value === 80) {
            heightFilter.value = withTiming(220)
        } else {
            heightFilter.value = withTiming(80)
        }
    }

    const cardFilter = useAnimatedStyle(() => {
        return {
            height: heightFilter.value
        }
    })

    const opacityValues = ['0%', '30%', '50%', '70%', '90%',];

    return (
        <Main style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 0, }}>
            {loading ? <Load /> :
                <FlatList
                    data={pages}
                    ListHeaderComponent={<Column style={{ height: 40, }}></Column>}
                    initialNumToRender={3}
                    removeClippedSubviews
                    scrollEnabled={scrollEnabled}
                    maxToRenderPerBatch={3}
                    updateCellsBatchingPeriod={100}
                    ListFooterComponent={<Column style={{ height: 90, }}></Column>}
                    showsHorizontalScrollIndicator={false}
                    style={{ zIndex: -1, }}
                    renderItem={({ item }) => <ImagesVertical url={item} setScrollEnabled={setScrollEnabled} blur={blur} filter={filter} opacity={opacity} />}
                />}
            <Modal ref={modalDetails} snapPoints={[84, height]} style={{ zIndex: 99, }}>
                <Column>
                    <Row style={{ zIndex: 99, marginTop: 0, paddingHorizontal: 20, backgroundColor: '#202020', width: '100%', justifyContent: 'space-between', alignItems: 'center', }}>
                        <Button style={{ backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderRadius: 100, width: 42, height: 42, }} onPress={() => navigation.goBack()} >
                            <ArrowLeft size={24} stroke='#000' />
                        </Button>
                        <Row>
                            <Pressable onPress={handlePrevChapter} style={{ backgroundColor: prevChap ? '#FFF' : '#505050', justifyContent: 'center', alignItems: 'center', borderRadius: 16, paddingHorizontal: 18, paddingVertical: 8, }}>
                                <Label style={{ fontFamily: font.bold, color: prevChap ? '#000' : '#FFF', letterSpacing: -1, }}>Anterior</Label>
                            </Pressable>
                            <Column style={{ width: 12 }}></Column>
                            <Pressable onPress={handleNextChapter} style={{ backgroundColor: nextChap ? '#FFF' : '#505050', justifyContent: 'center', alignItems: 'center', borderRadius: 16, paddingHorizontal: 18, paddingVertical: 8, }}>
                                <Label style={{ fontFamily: font.bold, color: nextChap ? '#000' : '#FFF', letterSpacing: -1, }}>Próximo</Label>
                            </Pressable>
                        </Row>
                    </Row>

                    <Column style={{ paddingHorizontal: 20, paddingVertical: 20, }}>


                        <Animated.View style={[{
                            borderRadius: 26,
                            overflow: 'hidden',
                            backgroundColor: '#404040',
                        }, cardFilter]}>
                            <Button style={{
                                borderRadius: 26,
                                backgroundColor: color.off,
                                paddingVertical: 14,
                                paddingHorizontal: 16,
                            }} onPress={toggleFiler}>
                                <Row style={{ justifyContent: 'space-between', alignItems: 'center', }}>
                                    <Label style={{ color: color.light, textAlign: 'center', fontFamily: 'Font_Medium' }}>Filtros</Label>
                                    <Row>
                                        <Column style={{ width: 54, height: 54, borderRadius: 100, backgroundColor: "#3a86ff", justifyContent: 'center', alignItems: 'center', marginRight: -22, borderWidth: 4, borderColor: color.off, }} />
                                        <Column style={{ width: 54, height: 54, borderRadius: 100, backgroundColor: '#f4a261', justifyContent: 'center', alignItems: 'center', marginRight: -22, borderWidth: 4, borderColor: color.off, }} />
                                        <Column style={{ width: 54, height: 54, borderRadius: 100, backgroundColor: '#c8b6ff', justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: color.off, }} />
                                    </Row>
                                </Row>
                            </Button>

                            <Column style={{ paddingHorizontal: 20, }}>

                                <Row>
                                    <Button style={{ borderRadius: 100, borderWidth: 2, borderColor: filter === 'transparent' ? '#000' : '#404040', }} onPress={() => { setfilter('transparent'); setopacity('0'); }} >
                                        <Column style={{ width: 42, height: 42, borderRadius: 100, backgroundColor: '#FFF', }}></Column>
                                    </Button>
                                    <Button style={{ borderRadius: 100, borderWidth: 2, borderColor: filter === '#f4a261' ? '#FFFFFF' : '#404040', }} onPress={() => { setfilter('#f4a261') }} >
                                        <Column style={{ width: 42, height: 42, borderRadius: 100, backgroundColor: '#f4a261', }}></Column>
                                    </Button>
                                    <Button style={{ borderRadius: 100, borderWidth: 2, borderColor: filter === '#c8b6ff' ? '#FFFFFF' : '#404040', }} onPress={() => { setfilter('#c8b6ff') }} >
                                        <Column style={{ width: 42, height: 42, borderRadius: 100, backgroundColor: '#c8b6ff', }}></Column>
                                    </Button>
                                    <Button style={{ borderRadius: 100, borderWidth: 2, borderColor: filter === '#3a86ff' ? '#FFFFFF' : '#404040', }} onPress={() => { setfilter('#3a86ff') }} >
                                        <Column style={{ width: 42, height: 42, borderRadius: 100, backgroundColor: '#3a86ff', }}></Column>
                                    </Button>
                                </Row>

                                <Label>Opacidade</Label>
                                <Row style={{ justifyContent: 'space-between', marginTop: 8, alignItems: 'center', }}>
                                    {opacityValues.map((item, index) => (
                                        <Button key={index} style={{ borderRadius: 8, backgroundColor: opacity === item.slice(0, -1) ? '#FFFFFF' : '#505050', alignItems:'center', justifyContent: 'center', paddingVertical: 6, paddingHorizontal: 8, }} onPress={() => { setopacity(item.slice(0, -1)) }} >
                                                <Title style={{ fontSize: 18, color: opacity === item.slice(0, -1) ? '#000' : '#FFF', }}>{item}</Title>
                                        </Button>
                                    ))}
                                </Row>
                            </Column>

                        </Animated.View>





                        <Row style={{ columnGap: 20, marginVertical: 20, }}>
                            <Button onPress={() => { setblur(!blur) }} style={{
                                borderRadius: 18,
                                paddingVertical: 20,
                                paddingHorizontal: 20,
                                backgroundColor: blur ? color.primary + 20 : color.off,
                                flexGrow: 1,
                            }}>
                                <Column style={{}}>
                                    {blur ? <ImageOff size={32} color={color.primary} /> : <ImageOn size={32} color={color.light} />}
                                    <Row style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: 40, }}>
                                        <Label style={{ color: color.light, fontFamily: 'Font_Medium', letterSpacing: -1, fontSize: 24 }}>Efeito{'\n'}de Blur</Label>
                                        <Button style={{ borderRadius: 100, }} onPress={() => { setblur(!blur) }} >
                                            <Check status={blur} />
                                        </Button>
                                    </Row>
                                </Column>
                            </Button>

                            <Button onPress={() => { }}
                                style={{
                                    borderRadius: 18,
                                    paddingVertical: 20,
                                    paddingHorizontal: 20,
                                    backgroundColor: "#ffffff10",
                                    flexGrow: 1,
                                }}>
                                <Column>
                                    <Newspaper size={32} color={color.light} />
                                    <Label style={{ color: color.light, letterSpacing: -1, fontFamily: 'Font_Medium', fontSize: 24, marginTop: 40, }}>Adicionar {'\n'}ao Flow</Label>
                                </Column>
                            </Button>
                        </Row>

                        <Button style={{
                            borderRadius: 18,
                            paddingVertical: 14,
                            paddingHorizontal: 16,
                            backgroundColor: color.off,
                        }}>
                            <Label style={{ color: color.light, textAlign: 'center', fontFamily: 'Font_Medium' }}>Traduzir com IA (EM BREVE)</Label>
                        </Button>
                    </Column>
                </Column>
            </Modal>
        </Main>
    )
}


const ImagesVertical = ({ url, setScrollEnabled, filter, opacity, blur }) => {


    const [imageSize, setImageSize] = useState({ width: SCREEN_WIDTH, height: 600 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchImage = () => {
            Image.getSize(url, (width, height) => {
                const scaleFactor = SCREEN_WIDTH / width;
                const scaledHeight = height * scaleFactor;
                setImageSize({ width: SCREEN_WIDTH, height: scaledHeight });
                setLoading(false);
                setError(false);
            },
                (error) => {
                    console.error('Error loading image:', error);
                    setError(true);
                    setLoading(false);
                }
            );
        };

        fetchImage();
    }, [url]);

    const scale = useSharedValue(1);
    const offsetX = useSharedValue(0);
    const offsetY = useSharedValue(0);
    const focalX = useSharedValue(0);
    const focalY = useSharedValue(0);
    const lastScale = useSharedValue(1);

    const pinchGesture = Gesture.Pinch()
        .onStart(() => {
            runOnJS(setScrollEnabled)(false);
        })
        .onUpdate((event) => {
            const adjustedScale = lastScale.value * event.scale;
            scale.value = Math.max(1, adjustedScale); // Limitar o mínimo a 1
            focalX.value = event.focalX;
            focalY.value = event.focalY;
        })
        .onEnd(() => {
            if (scale.value < 1) {
                scale.value = withSpring(1);
            }
            lastScale.value = scale.value;
            runOnJS(setScrollEnabled)(true);
        });

    const doubleTapGesture = Gesture.Tap().numberOfTaps(2)

        .onEnd((event) => {
            // Alterna entre o fator de zoom padrão e o fator de zoom duplo
            if (scale.value === 1) {
                scale.value = withTiming(2);
                focalX.value = event.absoluteX;
                focalY.value = event.absoluteY;
                runOnJS(setScrollEnabled)(false);
            } else {
                scale.value = withTiming(1);
                runOnJS(setScrollEnabled)(true);
            }
        });

    const combinedGesture = Gesture.Race(pinchGesture, doubleTapGesture);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: offsetX.value },
            { translateY: offsetY.value },
            { scale: scale.value },
        ],
    }));


    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <CircleX size={40} color='#fff' />
                <Title style={{ color: '#fff' }}>Erro ao carregar imagem</Title>
            </View>
        );
    }



    return (
        <GestureDetector gesture={combinedGesture}>
            <Animated.View style={[animatedStyle, { flex: 1, width: imageSize.width, height: imageSize.height, }]}>
                <Column style={{ width: imageSize.width, height: imageSize.height, backgroundColor: filter + opacity, zIndex: 2, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
                <ExpoImage
                    source={url}
                    blurRadius={blur ? 5 : 0}

                    contentFit="contain"
                    transition={500}
                    style={{ width: imageSize.width, height: imageSize.height, backgroundColor: '#fff' }}
                    decodeFormat='argb'
                    priority='high'
                />

            </Animated.View>
        </GestureDetector>
    )
};



const Load = () => {
    const { color } = useTheme()
    return (
        <MotiView style={{ justifyContent: 'center', alignItems: 'center', flex: 1, }}>
            <Row>
                <MotiImage source={require('@imgs/load1.png')} style={{ width: 68, height: 68, borderRadius: 100, }} from={{ translateY: -80, }} animate={{ translateY: 30, }} transition={{ type: 'spring', loop: true, delay: 600, duration: 1200, damping: 10, }} />
                <MotiImage source={require('@imgs/load2.png')} style={{ width: 68, marginHorizontal: 6, height: 68, borderRadius: 100, }} from={{ translateY: -60, }} animate={{ translateY: 30, }} transition={{ type: 'spring', delay: 200, duration: 1200, damping: 10, loop: true, }} />
                <MotiImage source={require('@imgs/load3.png')} style={{ width: 68, height: 68, borderRadius: 100, marginLeft: 4, }} from={{ translateY: -40, }} animate={{ translateY: 30, }} transition={{ type: 'spring', delay: 400, loop: true, duration: 1200, damping: 20, }} />
            </Row>
            <Title style={{ marginTop: 40, }}>Gerando páginas...</Title>
            <Label style={{ fontSize: 16, marginTop: 0, marginHorizontal: 40, textAlign: 'center', }}>Aguarde um momento enquanto a imagem é gerada.</Label>
        </MotiView>
    )
}




/*
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

*/