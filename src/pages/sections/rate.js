import React, { useContext, useState, useEffect, } from 'react';
import { PanResponder, View, Image } from 'react-native';
import { Main, Scroll, Column, Label, Title, Row, Button } from '@theme/global';
import { ThemeContext } from 'styled-components/native';
import { Skeleton } from 'moti/skeleton'
import Card from '@components/lists/card';

import Animated, {
    useAnimatedScrollHandler,
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    ZoomOut,
    FadeOut,
    FadeIn,
} from 'react-native-reanimated';

import animatedLogo from '@imgs/stk1.png';
import refreshIcon from '@imgs/refresh.png';
import { ArrowLeft, } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import  requestRate from '@apiv1/manga/rate';

export default function RateSectionScreen({ navigation, }) {
    const { color, font, } = useContext(ThemeContext);

    const [data, setData] = useState([]);
    const [loading, setloading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);
    useEffect(() => {
        const fecthData = async () => {
            setloading(true)
            try {
                const res = await requestRate();
                setData(res.mangas);
            } catch (error) {
                console.log(error)
            } finally {
                setloading(false);
                pullDownPosition.value = withTiming(0, { duration: 180 });
            }
        }
        fecthData();
    }, [refreshing])


    const scrollPosition = useSharedValue(0);
    const scrollHandler = useAnimatedScrollHandler({ onScroll: (event) => { scrollPosition.value = event.contentOffset.y; }, });

    const onRefresh = async () => {
        try {
            setRefreshing(true);
            const res = await requestWeekend();
            setData(res.mangas);
        } catch (error) {
            console.log(error)
        } finally {
            setRefreshing(false);
            pullDownPosition.value = withTiming(0, { duration: 180 });
        }
    };

    const isReadyToRefresh = useSharedValue(false);
    const pullDownPosition = useSharedValue(0);
    const onPanRelease = () => {
        pullDownPosition.value = withTiming(isReadyToRefresh.value ? 100 : 0, {
            duration: 180,
        });
        if (isReadyToRefresh.value) {
            isReadyToRefresh.value = false;
            onRefresh();
        }
    };
    const panResponderRef = React.useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (event, gestureState) =>
                scrollPosition.value <= 0 && gestureState.dy >= 0,
            onPanResponderMove: (event, gestureState) => {
                const maxDistance = 100;
                pullDownPosition.value = Math.max(Math.min(maxDistance, gestureState.dy), 0);
                pullDownPosition.value = Math.max(gestureState.dy, 0);

                if (
                    pullDownPosition.value >= maxDistance / 2 &&
                    isReadyToRefresh.value === false
                ) {
                    isReadyToRefresh.value = true;
                }

                if (
                    pullDownPosition.value < maxDistance / 2 &&
                    isReadyToRefresh.value === true
                ) {
                    isReadyToRefresh.value = false;
                }
            },
            onPanResponderRelease: onPanRelease,
            onPanResponderTerminate: onPanRelease,
        })
    );

    const refreshContainerStyles = useAnimatedStyle(() => {
        return {
            height: pullDownPosition.value,
        };
    });

    const refreshIconStyles = useAnimatedStyle(() => {
        const scale = Math.min(1, Math.max(0, pullDownPosition.value / 75));
        const rotateValue = Math.min(pullDownPosition.value * 3, 460);
        return {
            opacity: refreshing ? withDelay(100, withTiming(0, { duration: 20 })) : Math.max(0, pullDownPosition.value - 25) / 50,
            transform: [
                {
                    scaleX: refreshing ? withTiming(0.15, { duration: 120 }) : scale,
                },
                {
                    scaleY: scale,
                },
                {
                    rotate: `${rotateValue}deg`,
                },
            ],
        };
    }, [refreshing]);

    return (
        <Main pointerEvents={refreshing ? 'none' : 'auto'}>
            <Animated.View style={[{ justifyContent: 'center', alignItems: 'center', maxHeight: 200, }, refreshContainerStyles]}>
                {refreshing && <Animated.Image exiting={FadeOut} entering={FadeIn} source={animatedLogo} style={{ width: 100, height: 100, objectFit: 'cover', marginTop: 70, marginBottom: 45, }} />}
                <Animated.Image exiting={FadeOut} entering={FadeIn} source={refreshIcon} style={[{ width: 56, height: 56, borderRadius: 100, objectFit: 'contain', marginTop: 50, }, refreshIconStyles]} />
            </Animated.View>

            {loading ? <Loading /> :
                <Animated.FlatList
                    data={data}
                    onScroll={scrollHandler}
                    scrollEventThrottle={16}
                    columnWrapperStyle={{ columnGap: 12, justifyContent: 'center', }}
                    contentContainerStyle={{ rowGap: 12, paddingHorizontal: 12, }}
                    ListHeaderComponent={<Animated.View {...panResponderRef.current.panHandlers}><Header /></Animated.View>}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <Card item={item} right={true} />}
                    numColumns={2}
                    windowSize={6}
                    initialNumToRender={6}
                    removeClippedSubviews
                    maxToRenderPerBatch={6}
                    updateCellsBatchingPeriod={100}
                    showsHorizontalScrollIndicator={false}
                />}
        </Main>
    )
}

const Header = () => {
    const navigation = useNavigation();
    return (
        <Row style={{ justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20, marginTop: 40, marginBottom: 12, }}>
            <Button onPress={() => { navigation.goBack() }} style={{ width: 46, height: 46, borderRadius: 100, backgroundColor: '#303030', justifyContent: 'center', alignItems: 'center', }}>
                <ArrowLeft size={28} color="#fff" />
            </Button>
            <Column style={{ justifyContent: 'center', alignItems: 'center', }}>
                <Title style={{ fontSize: 22, }}>Melhor nota</Title>
                <Label style={{ fontSize: 16, }}>Mais bem avaliados</Label>
            </Column>
            <Column style={{ width: 56, }} />
        </Row>
    )
}

const Loading = () => {
    return (
        <Column style={{ paddingHorizontal: 10, marginTop: 40, }}>
            <Column style={{ justifyContent: 'center', alignItems: 'center', }}>
                <Skeleton colorMode='dark' width={142} height={40} style={{ alignSelf: 'center', }} radius={6} />
                <Spacer height={10} />
                <Skeleton colorMode='dark' width={170} height={30} radius={4} />
                <Spacer height={6} />
            </Column>
            <Row style={{ marginBottom: 16, marginTop: 16, justifyContent: 'space-between', alignItems: 'center', }}>
                <Column style={{ backgroundColor: "#303030", borderRadius: 6, padding: 12, paddingBottom: 20, alignItems: 'center', }}>
                    <Skeleton colorMode='dark' width={142} height={142} style={{ alignSelf: 'center', }} radius={6} />
                    <Spacer height={10} />
                    <Skeleton colorMode='dark' width={140} height={26} radius={4} />
                    <Spacer height={6} />
                    <Skeleton colorMode='dark' width={100} height={16} radius={4} />
                </Column>
                <Column style={{ backgroundColor: "#303030", borderRadius: 6, padding: 12, paddingBottom: 20, alignItems: 'center', }}>
                    <Skeleton colorMode='dark' width={142} height={142} style={{ alignSelf: 'center', }} radius={6} />
                    <Spacer height={10} />
                    <Skeleton colorMode='dark' width={140} height={26} radius={4} />
                    <Spacer height={6} />
                    <Skeleton colorMode='dark' width={100} height={16} radius={4} />
                </Column>
            </Row>
            <Row style={{ marginBottom: 16, justifyContent: 'space-between', alignItems: 'center', }}>
                <Column style={{ backgroundColor: "#303030", borderRadius: 6, padding: 12, paddingBottom: 20, alignItems: 'center', }}>
                    <Skeleton colorMode='dark' width={142} height={142} style={{ alignSelf: 'center', }} radius={6} />
                    <Spacer height={10} />
                    <Skeleton colorMode='dark' width={140} height={26} radius={4} />
                    <Spacer height={6} />
                    <Skeleton colorMode='dark' width={100} height={16} radius={4} />
                </Column>
                <Column style={{ backgroundColor: "#303030", borderRadius: 6, padding: 12, paddingBottom: 20, alignItems: 'center', }}>
                    <Skeleton colorMode='dark' width={142} height={142} style={{ alignSelf: 'center', }} radius={6} />
                    <Spacer height={10} />
                    <Skeleton colorMode='dark' width={140} height={26} radius={4} />
                    <Spacer height={6} />
                    <Skeleton colorMode='dark' width={100} height={16} radius={4} />
                </Column>
            </Row>
            <Row style={{ marginBottom: 16, justifyContent: 'space-between', alignItems: 'center', }}>
                <Column style={{ backgroundColor: "#303030", borderRadius: 6, padding: 12, paddingBottom: 20, alignItems: 'center', }}>
                    <Skeleton colorMode='dark' width={142} height={142} style={{ alignSelf: 'center', }} radius={6} />
                    <Spacer height={10} />
                    <Skeleton colorMode='dark' width={140} height={26} radius={4} />
                    <Spacer height={6} />
                    <Skeleton colorMode='dark' width={100} height={16} radius={4} />
                </Column>
                <Column style={{ backgroundColor: "#303030", borderRadius: 6, padding: 12, paddingBottom: 20, alignItems: 'center', }}>
                    <Skeleton colorMode='dark' width={142} height={142} style={{ alignSelf: 'center', }} radius={6} />
                    <Spacer height={10} />
                    <Skeleton colorMode='dark' width={140} height={26} radius={4} />
                    <Spacer height={6} />
                    <Skeleton colorMode='dark' width={100} height={16} radius={4} />
                </Column>
            </Row>
        </Column>
    )
}
const Spacer = ({ height = 16 }) => <Column style={{ height }} />
