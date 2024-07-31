import React, { useState, useEffect, useRef, useContext } from 'react';
import { Main, Button, Title, Label, Row, Column, Scroll } from '@theme/global';
import { Pressable, FlatList, Image, ScrollView, ImageBackground, ActivityIndicator, RefreshControl, useWindowDimensions, Dimensions } from 'react-native';

//hooks
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { getPreferences, removeComplete, removeFollow, removeLike } from '@hooks/preferences';
import { excludeMangaProgress } from '@hooks/progress';
import { ThemeContext } from 'styled-components/native';

//components
import Avatar from '@components/avatar';
import ModalAddCollection from '@components/modal/collection';

import { AnimatePresence, MotiImage, MotiView } from 'moti';
import { Skeleton } from 'moti/skeleton';
import Modal from '@components/modal/modal';
//icons
import { AntDesign } from '@expo/vector-icons';
import { ArrowLeft, ArrowRight, Combine, DotSquare, Ellipsis, Trash } from 'lucide-react-native'

const { width, height } = Dimensions.get('window');


import PagerView from 'react-native-pager-view';
import { LinearGradient } from 'expo-linear-gradient';

export default function AccountPage({ navigation, route }) {
    const { color, font } = useContext(ThemeContext)

    const modalAdd = useRef();
    const modalProfile = useRef()
    const modalDetails = useRef()

    const [user, setuser] = useState([]);
    const [cache, setcache] = useState();
    const [loadingUser, setloadingUser] = useState();

    const fetchUser = async () => {
        setloadingUser(true)
        try {
            const preferences = await getPreferences();
            setuser({
                name: preferences.name,
                avatar: preferences.avatar,
                capa: preferences.capa,
                bio: preferences.bio,
                coins: preferences.coins,
                diamonds: preferences.diamonds,
            });

        } catch (error) {
            console.log(error)
        } finally {
            setloadingUser(false)
        }
    };
    useEffect(() => {
        fetchUser();
    }, []);

    const [loadingExclude, setloadingExclude] = useState(false);
    const handleExclude = async () => {
        setloadingExclude(true)
        try {
            switch (type) {
                case 'Progress':
                    await excludeMangaProgress(cache.id)
                    await getPreferences().then(res => { setProgress(res.progress); setloadingExclude(false); })
                    modalDetails.current?.close()
                    break;
                case 'Like':
                    await removeLike(cache.id)
                    await getPreferences().then(res => { setLike(res.likes); setloadingExclude(false); })
                    modalDetails.current?.close()
                    break;
                case 'Complete':
                    await removeComplete(cache.id)
                    await getPreferences().then(res => { setComplete(res.complete); setloadingExclude(false); })
                    modalDetails.current?.close()
                    break;
                case 'Follow':
                    await removeFollow(cache.id)
                    await getPreferences().then(res => { setFollow(res.follow); setloadingExclude(false); })
                    modalDetails.current?.close()
                    break;
            }
        } catch (error) {
            console.log(error)
        } finally {
            setloadingExclude(false)
        }


    }
    const FlatScene = React.useMemo(() => ({ type }) => {
        const [page, setPage] = useState(1);
        const [data, setdata] = useState();
        const [loading, setLoading] = useState(true);
        const LIMIT = 8;

        const fetchData = async () => {
            setLoading(true);
            try {
                const preferences = await getPreferences();
                const offset = (page - 1) * LIMIT;

                if (type === 'Progress') {
                    setdata(preferences.progress.slice(offset, offset + LIMIT));
                } else if (type === 'Like') {
                    setdata(preferences.likes.slice(offset, offset + LIMIT));
                } else if (type === 'Complete') {
                    setdata(preferences.complete.slice(offset, offset + LIMIT));
                } else if (type === 'Follow') {
                    setdata(preferences.follows.slice(offset, offset + LIMIT));
                }

            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false);
            }
        };

        useEffect(() => {
            fetchData();
        }, [page]);

        const getItem = React.useCallback(({ item, index }) => (
            <CollectionItem key={item.id} type={type} item={item} openModal={() => { setcache(item); modalDetails.current?.expand(); console.log('aq'); console.log(item) }} index={index} />
        ), []);

        const handleNextPage = () => {
            if (data?.length < LIMIT) {
                return
            }
            setPage(prevPage => prevPage + 1);
        };

        const handlePrevPage = () => {
            if (page > 1) {
                setPage(prevPage => prevPage - 1);
            }
        };

        return (
            <Column style={{ flex: 1, }}>
                {(data?.length >= LIMIT) || (page > 1) ?
                <Row style={{ backgroundColor: '#303030', justifyContent: 'space-between', alignItems: 'center', zIndex: 99, marginHorizontal: 20, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, }}>
                    <Row>
                        <Button onPress={handlePrevPage} disabled={loading}
                            style={{ backgroundColor: "#fff", opacity: page === 1 ? 0.5 : 1, borderRadius: 100, height: 32, width: 32, justifyContent: 'center', alignItems: 'center', }}>
                            <ArrowLeft size={18} color="#000" />
                        </Button>
                        <Column style={{ width: 8, }} />
                        <Button onPress={handleNextPage} disabled={loading}
                            style={{ backgroundColor: "#fff", opacity: data?.length < LIMIT ? 0.5 : 1, borderRadius: 100, height: 32, width: 32, justifyContent: 'center', alignItems: 'center', }}>
                            <ArrowRight size={18} color="#000" />
                        </Button>
                    </Row>
                    <Row style={{ justifyContent: 'center', alignItems: 'center', }}>
                        <Title style={{ fontSize: 14, paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#ffffff30', borderRadius: 8, }}>Página {page}</Title>
                        {loading && <ActivityIndicator color={color.primary} size={24} />}
                    </Row>
                </Row> : null}

                {!loading &&
                    <FlatList
                        data={data}
                        keyExtractor={item => item.id}
                        horizontal={false}
                        ListEmptyComponent={<CollectionEmpty />}
                        numColumns={2}
                        refreshing={loading}
                        onRefresh={fetchData}
                        windowSize={8}
                        ListHeaderComponent={<Column style={{ height: 10, }}></Column>}
                        ListFooterComponent={<Column style={{ height: 30, }}></Column>}
                        updateCellsBatchingPeriod={100}
                        maxToRenderPerBatch={4}
                        columnWrapperStyle={{ marginHorizontal: 20, justifyContent: 'center', marginTop: 2 }}
                        showsVerticalScrollIndicator={false}
                        renderItem={getItem}
                    />}
            </Column>
        );
    }, [type]);

    const itm = {
        name: cache?.name,
        capa: cache?.capa,
        rate: cache?.rate,
        type: cache?.type,
        id: cache?.id,
        chapter: cache?.chapter,
    };
    const ScrollButtons = useRef();
    const [type, settype] = useState();
    const [index, setindex] = useState();
    const pagerRef = useRef();
    const handleScreen = (position) => {
        pagerRef.current.setPage(position);
        setindex(position);
        switch (position) {
            case 0:
                ScrollButtons.current?.scrollTo({ x: 0, y: 0, animated: true, });
                settype('Progress');
                break;
            case 1:
                ScrollButtons.current?.scrollTo({ x: 0, y: 0, animated: true, });
                settype('Like');
                break;
            case 2:
                ScrollButtons.current?.scrollToEnd({ animated: true, });
                settype('Complete');
                break;
            case 3:
                ScrollButtons.current?.scrollToEnd({ animated: true, });
                settype('Follow');
                break;
            default:
                break;
        }
        setindex(position);
    }


    if (loadingUser) { return <SkeletonBody /> }
    return (
        <Main>
            <Row style={{ justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20, marginTop: 40, }}>
                <Title style={{ fontSize: 52, letterSpacing: -3, }}>Biblioteca</Title>
                <Pressable onPress={() => { modalProfile.current?.expand() }} >
                    <MotiImage from={{ opacity: 0, scale: 0, }} animate={{ opacity: 1, scale: 1, }} source={{ uri: user?.avatar }} style={{ width: 54, height: 54, borderRadius: 100, }} />
                </Pressable>
            </Row>

            <Column style={{ marginBottom: 20, marginTop: 10, }}>
                <ScrollView ref={ScrollButtons} horizontal showsHorizontalScrollIndicator={false} style={{}}>
                    <Column style={{ width: 20, }} />
                    <Button onPress={() => { handleScreen(0); }} style={{ paddingVertical: 10, paddingHorizontal: 18, marginRight: 12, backgroundColor: type === 'Progress' ? "#fff" : "#303030", borderRadius: 40, }}>
                        <Title style={{ color: type === 'Progress' ? "#000" : "#d7d7d7", fontSize: 18, textAlign: 'center', fontFamily: type === 'Progress' ? 'Font_Bold' : 'Font_Book', }}>Em progresso</Title>
                    </Button>
                    <Button onPress={() => { handleScreen(1); }} style={{ paddingVertical: 10, marginRight: 12, paddingHorizontal: 18, backgroundColor: type === 'Like' ? "#fff" : "#303030", borderRadius: 40, }}>
                        <Title style={{ color: type === 'Like' ? "#000" : "#d7d7d7", fontSize: 18, textAlign: 'center', fontFamily: type === 'Like' ? 'Font_Bold' : 'Font_Book', }}>Curtidos</Title>
                    </Button>
                    <Button onPress={() => { handleScreen(2) }} style={{ paddingVertical: 10, marginRight: 12, paddingHorizontal: 18, backgroundColor: type === 'Complete' ? "#fff" : "#303030", borderRadius: 40, }}>
                        <Title style={{ color: type === 'Complete' ? "#000" : "#d7d7d7", fontSize: 18, textAlign: 'center', fontFamily: type === 'Complete' ? 'Font_Bold' : 'Font_Book', }}>Completos</Title>
                    </Button>
                    <Button onPress={() => { handleScreen(3) }} style={{ paddingVertical: 10, marginRight: 12, paddingHorizontal: 18, backgroundColor: type === 'Follow' ? "#fff" : "#303030", borderRadius: 40, }}>
                        <Title style={{ color: type === 'Follow' ? "#000" : "#d7d7d7", fontSize: 18, textAlign: 'center', fontFamily: type === 'Follow' ? 'Font_Bold' : 'Font_Book', }}>Seguindo</Title>
                    </Button>
                    <Column style={{ width: 20, }} />
                </ScrollView>
            </Column>


            <PagerView style={{ flex: 1, }} initialPage={0} ref={pagerRef} onPageSelected={(event) => { handleScreen(event.nativeEvent.position) }}>
                <FlatScene key={0} type="Progress" />
                <FlatScene key={1} type="Like" />
                <FlatScene key={2} type="Complete" />
                <FlatScene key={3} type="Follow" />
            </PagerView>


            <Modal ref={modalDetails} snapPoints={[0.1, 600]} >


                <ImageBackground blurRadius={40} source={{ uri: cache?.capa }} style={{  flexGrow: 1, justifyContent: 'center', marginHorizontal: 20, }} imageStyle={{ borderRadius: 20, opacity: .5,  }} >
                    <MotiImage from={{ opacity: 0, transform: [{ scale: .7, }, { rotate: '18deg' }] }} animate={{ opacity: 1, transform: [{ scale: 1, }, { rotate: '0deg' }] }} source={{ uri: cache?.capa }} 
                    style={{ width: 150, height: 210, borderRadius: 12, alignSelf: 'center', marginTop: 32, }} />
                    <Title style={{ textAlign: 'center', marginHorizontal: 30, marginTop: 10,  }}>{cache?.name}</Title>
                    <Label style={{ textAlign: 'center', marginBottom: 20, }}>{cache?.rate} - {cache?.chapter} capítulos</Label>
                </ImageBackground>
                   
                <Column style={{ marginHorizontal: 20, marginBottom: 30, marginTop: 12, }}>


                    <Column>
                    <Button onPress={() => navigation.navigate('MangaDetails', { id: cache?.id})} style={{ backgroundColor: '#303030', padding: 20, borderRadius: 20, marginBottom: 8, }}>
                            <Row style={{ justifyContent: 'space-between', alignItems: 'center', }}>
                                <Title style={{ fontSize: 18, fontFamily: 'Font_Medium', }}>Ver mangá</Title>
                                <ArrowRight color={color.green} size={22} />
                            </Row>
                        </Button>
                        <Button onPress={() => modalAdd.current?.expand()} style={{ backgroundColor: '#303030', padding: 20, borderRadius: 20, marginBottom: 8, }}>
                            <Row style={{ justifyContent: 'space-between', alignItems: 'center', }}>
                                <Title style={{ fontSize: 18, fontFamily: 'Font_Medium', }}>Adicionar a uma coleção</Title>
                                <Combine color={color.blue} size={22} />
                            </Row>
                        </Button>
                        <Button onPress={handleExclude} style={{ backgroundColor: color.red + 30, padding: 20, borderRadius: 20, }}>
                            <Row style={{ justifyContent: 'space-between', alignItems: 'center', }}>
                                <Title style={{ fontSize: 18, fontFamily: 'Font_Medium', color: color.red, }}>Remover mangá</Title>
                                {loadingExclude ? <ActivityIndicator color={color.red} size={24} /> : <Trash color={color.red} size={22} />}
                            </Row>
                        </Button>
                    </Column>

                </Column>
            </Modal>

            <Modal ref={modalProfile} snapPoints={[0.1, 300]} >
                <Column style={{}}>
                    <ImageBackground source={{ uri: user?.capa }} blurRadius={100} style={{ width: '100%', height: 300, borderRadius: 8, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', }} imageStyle={{ opacity: .6, }}>
                        <Column style={{ justifyContent: 'space-between', alignItems: 'center', }}>
                            <Avatar width={112} height={112} />
                            <Column style={{ justifyContent: 'center', alignItems: 'center', marginTop: 12, }}>
                                <Title style={{ fontSize: 24, }}>{user?.name}</Title>
                                <Label style={{ fontSize: 16, color: '#f7f7f7' }}>{user?.bio}</Label>
                            </Column>
                        </Column>
                    </ImageBackground>
                </Column>
            </Modal>


            <Modal ref={modalAdd} snapPoints={[0.1, 300]} >
                <Column>
                    <ModalAddCollection item={itm} />
                </Column>
            </Modal>

        </Main>
    )
}


const Spacer = ({ height = 16, width = 16, }) => <Column style={{ height, width }} />

const CollectionItem = ({ item, type, openModal, index }) => {
    const navigation = useNavigation();
    const chaptertTotal = item.chapter
    const chaptersRead = item.chapters?.length
    const progress = parseInt((chaptersRead / chaptertTotal) * 100)
    const progressColor = progress < 30 ? '#AB2346' : progress < 60 ? '#ff9900' : progress < 80 ? '#4FB286' : '#5158BB';
    return (
        <MotiView from={{ opacity: 0, translateY: 20, }} animate={{ opacity: 1, translateY: 0, }} delay={index * 100} transition={{ type: 'timing' }}>
            <Button onPress={openModal} style={{ padding: 8, borderRadius: 100, backgroundColor: '#303030', position: 'absolute', top: 12, right: 14, zIndex: 99, justifyContent: 'center', alignItems: 'center', }}>
                <Ellipsis size={18} color="#fff" />
            </Button>
            <Pressable onPress={() => { navigation.navigate('MangaDetails', { id: item?.id, }) }} style={{ margin: 10, borderRadius: 8, }} >
                <Image source={{ uri: item.capa }} style={{ width: 150, height: 190, borderTopLeftRadius: 8, borderTopRightRadius: 8, }} />
                <Column style={{ paddingVertical: 8, backgroundColor: '#262626', borderBottomLeftRadius: 6, borderBottomRightRadius: 6, paddingHorizontal: 6, }}>
                    <Title style={{ fontSize: 16, lineHeight: 16, width: 140, }}>{item?.name?.slice(0, 16)}</Title>
                    <Label style={{ fontSize: 12, marginTop: 2, }}>{item?.rate} • {item?.type}</Label>
                    {type === 'Complete' ?
                        <Label style={{ fontSize: 12, paddingVertical: 6, paddingHorizontal: 10, backgroundColor: '#4FB286', color: "#000", borderRadius: 4, marginTop: 6, marginBottom: -6, position: 'absolute', top: -180, left: -10, transform: [{ rotate: '90deg', }] }}>Completo</Label> :
                        <>
                            {progress > 0 ? <Row style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: 8, }}>
                                <Column style={{ width: 100, height: 10, backgroundColor: '#303030', borderRadius: 100, }}>
                                    <Column style={{ width: `${progress}%`, height: 10, backgroundColor: progressColor, borderRadius: 100, }} />
                                </Column>
                                <Label style={{ fontSize: 12, color: '#f7f7f7', }}>{progress}%</Label>
                            </Row> :
                                <Label style={{ fontSize: 12, marginTop: 6, color: '#fff', paddingVertical: 6, borderRadius: 4, paddingHorizontal: 10, backgroundColor: '#7B80CC', position: 'absolute', top: -175, transform: [{ rotate: '90deg', }], left: -15, }}>Não iniciado</Label>
                            }
                        </>
                    }

                    <Spacer height={4} />
                </Column>
            </Pressable>
        </MotiView>
    )
}

const SkeletonBody = () => {
    return (
        <Main>
            <Column style={{ marginVertical: 50, }}>
                <Row style={{ justifyContent: 'center', alignItems: 'center', }}>
                    <Column style={{ width: 160, height: 42, borderRadius: 100, backgroundColor: "#fff", marginRight: 20, }} />
                    <Skeleton width={160} height={42} radius={100} />
                </Row>


                <Row style={{ justifyContent: 'center', flexWrap: 'wrap', marginTop: 24, }}>
                    <Column>
                        <Skeleton width={160} height={200} radius={8} />
                        <Spacer height={16} />
                        <Skeleton width={160} height={32} radius={4} />
                        <Spacer height={8} />
                        <Skeleton width={120} height={24} radius={4} />
                    </Column>
                    <Spacer width={32} />
                    <Column>
                        <Skeleton width={160} height={200} radius={8} />
                        <Spacer height={16} />
                        <Skeleton width={160} height={32} radius={4} />
                        <Spacer height={8} />
                        <Skeleton width={120} height={24} radius={4} />
                    </Column>
                </Row>
                <Row style={{ justifyContent: 'center', flexWrap: 'wrap', marginTop: 24, }}>
                    <Column>
                        <Skeleton width={160} height={200} radius={8} />
                        <Spacer height={16} />
                        <Skeleton width={160} height={32} radius={4} />
                        <Spacer height={8} />
                        <Skeleton width={120} height={24} radius={4} />
                    </Column>
                    <Spacer width={32} />
                    <Column>
                        <Skeleton width={160} height={200} radius={8} />
                        <Spacer height={16} />
                        <Skeleton width={160} height={32} radius={4} />
                        <Spacer height={8} />
                        <Skeleton width={120} height={24} radius={4} />
                    </Column>
                </Row>
                <Row style={{ justifyContent: 'center', flexWrap: 'wrap', marginTop: 24, }}>
                    <Column>
                        <Skeleton width={160} height={200} radius={8} />
                        <Spacer height={16} />
                        <Skeleton width={160} height={32} radius={4} />
                        <Spacer height={8} />
                        <Skeleton width={120} height={24} radius={4} />
                    </Column>
                    <Spacer width={32} />
                    <Column>
                        <Skeleton width={160} height={200} radius={8} />
                        <Spacer height={16} />
                        <Skeleton width={160} height={32} radius={4} />
                        <Spacer height={8} />
                        <Skeleton width={120} height={24} radius={4} />
                    </Column>
                </Row>
            </Column>
        </Main>
    )
}

const CollectionEmpty = () => {
    return (
        <Column style={{ marginHorizontal: 20, }}>
            <Row style={{ marginVertical: 30, alignSelf: 'center', }}>
                <Column style={{ transform: [{ rotate: '-12deg', }], width: 120, height: 180, borderRadius: 16, backgroundColor: "#262626" }} />
                <Column style={{ transform: [{ rotate: '-12deg', }], borderWidth: 8, borderColor: "#171717", borderRadius: 16, marginHorizontal: -30, width: 120, height: 180, backgroundColor: "#262626" }} />
                <Column style={{ transform: [{ rotate: '-12deg', }], borderWidth: 8, borderColor: "#171717", borderRadius: 16, width: 120, height: 180, backgroundColor: "#262626" }} />
            </Row>
            <Title style={{ textAlign: 'center', }}>Sem nada por aqui, por enquanto </Title>
            <Label style={{ textAlign: 'center', }}>Comece a ler os mangás, que eles {"\n"}irão aparecer por aqui. </Label>
        </Column>
    )
}

