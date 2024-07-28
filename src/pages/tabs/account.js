import React, { useState, useEffect, useRef, useContext } from 'react';
import { Main, Button, Title, Label, Row, Column, } from '@theme/global';
import { Pressable, FlatList, Image, ScrollView, ImageBackground, ActivityIndicator, RefreshControl, useWindowDimensions, Dimensions } from 'react-native';

//hooks
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { getPreferences, removeComplete, removeFollow, removeLike } from '@hooks/preferences';
import { excludeMangaProgress } from '@hooks/progress';
import { ThemeContext } from 'styled-components/native';

//components
import Avatar from '@components/avatar';
import { TabView, TabBar } from 'react-native-tab-view';
import ModalAddCollection from '@components/modal/collection';

import { AnimatePresence, MotiImage, MotiView } from 'moti';
import { Skeleton } from 'moti/skeleton';
import Modal from '@components/modal/modal';
//icons
import { AntDesign } from '@expo/vector-icons';
import { ArrowLeft, ArrowRight, Combine, DotSquare, Trash } from 'lucide-react-native'

const { width, height } = Dimensions.get('window');

export default function AccountPage({ navigation, route }) {
    const { color, font } = useContext(ThemeContext)

    const modalAdd = useRef();
    const profileRef = useRef()

    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [complete, setComplete] = useState([]);
    const [progress, setProgress] = useState([]);
    const [like, setLike] = useState([]);
    const [follow, setFollow] = useState([]);
    const [user, setuser] = useState([]);
    const [cache, setcache] = useState();

    const LIMIT = 8;

    const fetchData = async () => {
        setLoading(true);
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
            const offset = (page - 1) * LIMIT;
            const newComplete = preferences.complete.slice(offset, offset + LIMIT);
            const newProgress = preferences.progress.slice(offset, offset + LIMIT);
            const newLike = preferences.likes.slice(offset, offset + LIMIT);
            const newFollow = preferences.follows.slice(offset, offset + LIMIT);

            setComplete(newComplete.reverse());
            setProgress(newProgress.reverse());
            setLike(newLike.reverse());
            setFollow(newFollow.reverse());
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (page > 1) {
            fetchData();
        }
    }, [page]);



    const FlatScene = React.memo(React.forwardRef(({ data, loading, type, }, ref) => {
        const getItem = React.useCallback(({ item, index }) => (
            <CollectionItem key={item.id} type={type} item={item} openModal={() => { setcache(item); mangaDetails.current?.expand(); console.log('aq'); console.log(item) }} index={index} />
        ), []);

        React.useImperativeHandle(ref, () => ({
            fetchData: () => setLoading(true),
            fetchData: () => null,
        }));


        const mangaDetails = useRef()
        const [cache, setcache] = useState();
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


        const [loadingExclude, setloadingExclude] = useState(false);



        const handleExclude = async () => {
            setloadingExclude(true)
            try {
                /*
            if (type === 'Progress') {
                await excludeMangaProgress(cache.id)
                await getPreferences().then(res => { setProgress(res.progress); setloadingExclude(false); })
                mangaDetails.current?.close()
            }
            else if (type === 'Like') {
                await removeLike(cache.id)
                await getPreferences().then(res => { setLike(res.likes); setloadingExclude(false); })
                mangaDetails.current?.close()
            } else if (type === 'Complete') {
                await removeComplete(cache.id)
                await getPreferences().then(res => { setComplete(res.complete); setloadingExclude(false); })
                mangaDetails.current?.close()
            } else if (type === 'Follow') {
                await removeFollow(cache.id)
                await getPreferences().then(res => { setFollow(res.follow); setloadingExclude(false); })
                mangaDetails.current?.close()
            }
            */
            } catch (error) {
                console.log(error)
            } finally {
                setloadingExclude(false)
            }


        }

        return (
            <Column>
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
                        <Title style={{ fontSize: 14, marginRight: 8 }}>Página {page}</Title>
                        {loading && <ActivityIndicator color={color.primary} size={24} />}
                    </Row>
                </Row>
                {!loading &&
                    <FlatList
                        data={data}
                        keyExtractor={item => item.id}
                        horizontal={false}
                        ListEmptyComponent={<CollectionEmpty />}
                        numColumns={2}
                        windowSize={8}
                        updateCellsBatchingPeriod={100}
                        maxToRenderPerBatch={4}
                        columnWrapperStyle={{ marginHorizontal: 20, justifyContent: 'center', marginTop: 2 }}
                        showsVerticalScrollIndicator={false}
                        renderItem={getItem}
                    />}

                <Modal ref={mangaDetails} snapPoints={[10, 400]}>
                    <Column style={{ marginHorizontal: 20, marginVertical: 30, }}>
                        <MotiImage from={{ opacity: 0, transform: [{ scale: .7, }, { rotate: '18deg' }] }} animate={{ opacity: 1, transform: [{ scale: 1, }, { rotate: '0deg' }] }} source={{ uri: cache?.capa }} style={{ width: 150, height: 210, borderRadius: 12, objectFit: 'contain', alignSelf: 'center', }} />
                        <Title style={{ textAlign: 'center', marginHorizontal: 30, marginTop: 16, }}>{cache?.name}</Title>
                        <Label style={{ textAlign: 'center', marginBottom: 20, }}>{cache?.rate} - {cache?.chapter} capítulos</Label>
                        <Pressable onPress={handleExclude} style={{ backgroundColor: '#303030', paddingVertical: 16, paddingHorizontal: 20, borderRadius: 6, }}>
                            <Row style={{ justifyContent: 'space-between', alignItems: 'center', }}>
                                <Title style={{ fontSize: 18, fontFamily: 'Font_Medium', }}>Excluir mangá</Title>
                                {loadingExclude ? <ActivityIndicator color={color.red} size={24} /> : <Trash color={color.red} size={18} />}
                            </Row>
                        </Pressable>
                        <Pressable onPress={() => modalAdd.current?.open()} style={{ backgroundColor: '#303030', paddingVertical: 16, paddingHorizontal: 20, borderRadius: 6, marginTop: 12, }}>
                            <Row style={{ justifyContent: 'space-between', alignItems: 'center', }}>
                                <Title style={{ fontSize: 18, fontFamily: 'Font_Medium', }}>Adicionar a uma coleção</Title>
                                <Combine color={color.blue} size={18} />
                            </Row>
                        </Pressable>
                    </Column>
                </Modal>
            </Column>
        );
    }));


    const renderScene = React.useCallback(({ route }) => {
        switch (route.key) {
            case 'progress':
                return <FlatScene ref={React.createRef()} data={progress} loading={loading} type="Progress" />;
            case 'like':
                return <FlatScene ref={React.createRef()} data={like} loading={loading} type="Like" />;
            case 'complete':
                return <FlatScene ref={React.createRef()} data={complete} loading={loading} type="Complete" />;
            case 'follow':
                return <FlatScene ref={React.createRef()} data={follow} loading={loading} type="Follow" />;
            default:
                return null;
        }
    }, [complete, like, progress, follow, loading,]);


    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'progress', title: 'Progresso' },
        { key: 'like', title: 'Curtidos' },
        { key: 'complete', title: 'Completo' },
        { key: 'follow', title: 'Seguindo' },
    ]);

    const renderTabBar = props => {
        return (
            <TabBar
                {...props}
                scrollEnabled
                renderIndicator={() => null}
                style={{ backgroundColor: 'transparent', width: width, elevation: 0, }}
                tabStyle={{ width: 'auto', paddingLeft: 20, marginRight: -12, }}
                renderLabel={({ route, focused, }) => (
                    <Label style={{ backgroundColor: focused ? '#fff' : '#303030', paddingHorizontal: 20, borderRadius: 100, paddingVertical: 8, color: focused ? '#000' : '#ffffff90', fontSize: 18, fontFamily: font.medium, letterSpacing: -1, textAlign: 'center', }}>{route.title}</Label>
                )}
            />
        )
    }


    const itm = {
        name: cache?.name,
        capa: cache?.capa,
        rate: cache?.rate,
        type: cache?.type,
        id: cache?.id,
        chapter: cache?.chapter,
    };



    return (
        <Main>
            <Row style={{ justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20, marginTop: 40, }}>
                <Title style={{ fontSize: 52, letterSpacing: -3, }}>Biblioteca</Title>
                <Pressable onPress={() => { profileRef.current?.open() }} >
                    <MotiImage source={{ uri: user?.avatar }} style={{ width: 54, height: 54, borderRadius: 100, }} />
                </Pressable>
            </Row>

            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                onTabPress={({ route, preventDefault }) => {
                    setPage(1);
                    preventDefault();
                }}
                sceneContainerStyle={{ backgroundColor: '#171717', }}
                initialLayout={{ width: width, }}
                renderTabBar={renderTabBar}
            />


            <Modal ref={profileRef} snapPoint={400} modalHeight={300} handlePosition="inside" handleStyle={{ backgroundColor: '#303030', width: 60, }} modalStyle={{ backgroundColor: '#171717', }} >
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


            <Modal ref={modalAdd} adjustToContentHeight handlePosition="inside" handleStyle={{ backgroundColor: '#d7d7d790' }} modalStyle={{ backgroundColor: "#171717", borderTopLeftRadius: 20, borderTopRightRadius: 20, }} >
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
    console.log(type)
    return (
        <MotiView from={{ opacity: 0, translateY: 20, }} animate={{ opacity: 1, translateY: 0, }} delay={index * 100} transition={{ type: 'timing' }}>
            <Button onPress={openModal} style={{ margin: 10, borderRadius: 8, }}>
                <DotSquare size={24} color="#fff" />
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


/**<FlatList
                    data={data}
                    keyExtractor={item => item.id}
                    ListHeaderComponent={<Column>
                        <Row style={{ justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20, marginTop: 40, }}>
                            <Title style={{ fontSize: 52, letterSpacing: -3, }}>Biblioteca</Title>
                            <Pressable onPress={() => { profileRef.current?.open() }} >
                                <MotiImage source={{ uri: user?.avatar }} style={{ width: 54, height: 54, borderRadius: 100, }} />
                            </Pressable>
                        </Row>
                        <ScrollView ref={ScrollButtons} horizontal showsHorizontalScrollIndicator={false}>
                            <Row style={{ marginHorizontal: 20, marginVertical: 20, justifyContent: 'center', alignItems: 'center', }}>
                                <Pressable onPress={() => { setType('Progress') }} style={{ paddingVertical: 10, paddingHorizontal: 18, marginRight: 12, backgroundColor: type === 'Progress' ? "#fff" : "#303030", borderRadius: 40, }}>
                                    <Title style={{ color: type === 'Progress' ? "#000" : "#d7d7d7", fontSize: 18, textAlign: 'center', fontFamily: type === 'Progress' ? 'Font_Bold' : 'Font_Book', }}>Em progresso</Title>
                                </Pressable>
                                <Pressable onPress={() => { setType('Like'); ScrollButtons.current.scrollTo({ x: 0, y: 0, animated: true }); }} style={{ paddingVertical: 10, marginRight: 12, paddingHorizontal: 18, backgroundColor: type === 'Like' ? "#fff" : "#303030", borderRadius: 40, }}>
                                    <Title style={{ color: type === 'Like' ? "#000" : "#d7d7d7", fontSize: 18, textAlign: 'center', fontFamily: type === 'Like' ? 'Font_Bold' : 'Font_Book', }}>Curtidos</Title>
                                </Pressable>
                                <Pressable onPress={() => { setType('Complete'); ScrollButtons.current.scrollToEnd({ animated: true }); }} style={{ paddingVertical: 10, marginRight: 12, paddingHorizontal: 18, backgroundColor: type === 'Complete' ? "#fff" : "#303030", borderRadius: 40, }}>
                                    <Title style={{ color: type === 'Complete' ? "#000" : "#d7d7d7", fontSize: 18, textAlign: 'center', fontFamily: type === 'Complete' ? 'Font_Bold' : 'Font_Book', }}>Completos</Title>
                                </Pressable>
                                <Pressable onPress={() => { setType('Follow') }} style={{ paddingVertical: 10, marginRight: 12, paddingHorizontal: 18, backgroundColor: type === 'Follow' ? "#fff" : "#303030", borderRadius: 40, }}>
                                    <Title style={{ color: type === 'Follow' ? "#000" : "#d7d7d7", fontSize: 18, textAlign: 'center', fontFamily: type === 'Follow' ? 'Font_Bold' : 'Font_Book', }}>Seguindo</Title>
                                </Pressable>
                            </Row>
                        </ScrollView>
                    </Column>}
                    horizontal={false}
                    numColumns={2}
                    onRefresh={fetchData}
                    refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} tintColor={color.primary} colors={[color.primary]} />}
                    refreshing={loading}
                    columnWrapperStyle={{ marginHorizontal: 20, justifyContent: 'center', marginTop: 2 }}
                    ref={ScrollMain} onScroll={(event) => { const scrolling = event.nativeEvent.contentOffset.y; if (scrolling > 230) { settop(true); } else { settop(false); } }} scrollEventThrottle={16}
                    ListEmptyComponent={<CollectionEmpty />}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => <CollectionItem item={item} openModal={openModal} {...additionalProps} index={index} />}
                /> */