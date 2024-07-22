import React, { useContext, useState, useEffect, } from 'react';
import {  PanResponder, View, StyleSheet } from 'react-native';
import { Main, Scroll, Column, Label, Title, Row } from '@theme/global';
import { ThemeContext } from 'styled-components/native';
import requestWeekend from '@api/manga/weekend';

import { Skeleton } from 'moti/skeleton'
import Card from '@components/lists/card';

import Animated, {
    useAnimatedScrollHandler,
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
} from 'react-native-reanimated';

import { Image } from 'expo-image';


import animatedLogo from '@imgs/stk6.png';
import refreshIcon from '@imgs/heart.png';

export default function WeekendSectionScreen({ navigation, }) {
    const { color, font, } = useContext(ThemeContext);

    const [data, setData] = useState([]);
    const [loading, setloading] = useState(true);

    const [refreshing, setRefreshing] = React.useState(false);
    useEffect(() => {
        const fecthData = async () => {
            setloading(true)
            try {
                const res = await requestWeekend();
                setData(res.mangas);
            } catch (error) {
                console.log(error)
            } finally {
                setloading(false);
            }
        }
        fecthData();
    }, [])


    const scrollPosition = useSharedValue(0);
    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollPosition.value = event.contentOffset.y;
        },
    });


    const onRefresh = (done) => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
            done()
        }, 1500);
    };

    const isReadyToRefresh = useSharedValue(false);
    const pullDownPosition = useSharedValue(0);
    const onPanRelease = () => {
        pullDownPosition.value = withTiming(isReadyToRefresh.value ? 75 : 0, {
            duration: 180,
        });
        const onRefreshComplete = () => {
            pullDownPosition.value = withTiming(0, { duration: 180 });
          };

          
        if (isReadyToRefresh.value) {
            isReadyToRefresh.value = false;
            onRefresh(onRefreshComplete);
        }
    };
    const panResponderRef = React.useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (event, gestureState) =>
                scrollPosition.value <= 0 && gestureState.dy >= 0,
            onPanResponderMove: (event, gestureState) => {
                const maxDistance = 150;
                pullDownPosition.value = Math.max(Math.min(maxDistance, gestureState.dy), 0);
                pullDownPosition.value = Math.max(gestureState.dy, 0);

                if (
                    pullDownPosition.value >= maxDistance / 2 &&
                    isReadyToRefresh.value === false
                ) {
                    isReadyToRefresh.value = true;
                    console.log('Ready to refresh');
                }

                if (
                    pullDownPosition.value < maxDistance / 2 &&
                    isReadyToRefresh.value === true
                ) {
                    isReadyToRefresh.value = false;
                    console.log('Will not refresh on release');
                }
            },
            onPanResponderRelease: onPanRelease,
            onPanResponderTerminate: onPanRelease,
        })
    );

    const pullDownStyles = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: pullDownPosition.value,
                },
            ],
        };
    });

    const refreshContainerStyles = useAnimatedStyle(() => {
        return {
            height: pullDownPosition.value,
        };
    });

    const refreshIconStyles = useAnimatedStyle(() => {
        const scale = Math.min(1, Math.max(0, pullDownPosition.value / 75));
      
        return {
          opacity: refreshing
            ? withDelay(100, withTiming(0, { duration: 20 }))
            : Math.max(0, pullDownPosition.value - 25) / 50,
          transform: [
            {
              scaleX: refreshing ? withTiming(0.15, { duration: 120 }) : scale,
            },
            {
              scaleY: scale,
            },
            {
              rotate: `${pullDownPosition.value * 3}deg`,
            },
          ],
        };
      }, [refreshing]);


    return (
        <View style={{ flex: 1, backgroundColor: '#171717', }} pointerEvents={refreshing ? 'none' : 'auto'}>
            <Animated.View style={[styles.refreshContainer, refreshContainerStyles]}>
                {refreshing && (
                    <Image
                        source={animatedLogo}
                        style={{ width: 140, height: 200, objectFit: 'cover' }}
                    />
                )}
                <Animated.Image
                    source={refreshIcon}
                    style={[styles.refreshIcon, refreshIconStyles]}
                />
            </Animated.View>

            <Animated.View style={pullDownStyles} {...panResponderRef.current.panHandlers}>

                {loading ? <Loading /> :
                    <Animated.FlatList
                        data={data}
                        onScroll={scrollHandler}
                        scrollEventThrottle={16}
                        columnWrapperStyle={{ columnGap: 12, justifyContent: 'center', }}
                        contentContainerStyle={{ rowGap: 12, paddingHorizontal: 12, }}
                        ListHeaderComponent={<Header />}
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
            </Animated.View>
        </View>
    )
}

const Header = () => {
    return (
        <Column style={{ justifyContent: 'center', alignItems: 'center', marginTop: 40, marginBottom: 12, }}>
            <Title>Em alta</Title>
            <Label>Mais lidos da semana</Label>
        </Column>
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

const styles = StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: '#ffabe7',
    },
    refreshContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    refreshIcon: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: 36,
      height: 36,
      marginTop: -18,
      marginLeft: -18,
      borderRadius: 18,
      objectFit: 'contain',
    },
  });
  