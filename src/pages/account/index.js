import React, { useState, useEffect, useRef } from 'react';
import { Main, Scroll, Title, Label, Row, Column, } from '../../theme/global';
import { Pressable, FlatList, Image, ScrollView, ImageBackground } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Skeleton } from 'moti/skeleton';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { getPreferences } from '../../api/user/preferences';
import Avatar from '../../components/avatar';
import { AnimatePresence, MotiImage, MotiView } from 'moti';
import { Modalize } from 'react-native-modalize';

export default function AccountPage({ navigation, route}) {
    const isFocused = useIsFocused()
    const typeRoute = route.params?.type ?? 'Progress';
    
    const [loading, setLoading] = useState();
    const [type, setType] = useState('Progress');
    if (loading) {
        return <SkeletonBody />
    }
    const [complete, setComplete] = useState([]);
    const [progress, setProgress] = useState([]);
    const [like, setLike] = useState([]);
    const [follow, setFollow] = useState([]);
    const [marks, setMarks] = useState([]);
    const [mangalists, setmangalists] = useState([]);
    const [user, setuser] = useState([]);
    const profileRef = useRef()

    useEffect(() => {
        const fetchData = () => {
            setLoading(true)
            getPreferences().then(res => {
                console.log(res)
                setuser(res)
                setComplete(res.complete)
                setProgress(res.progress)
                setLike(res.likes)
                setFollow(res.follow)
                setMarks(res.marks)
                setmangalists(res?.mangalists)
                if(typeRoute){
                    setType(typeRoute)
                }
            })
            setLoading(false)
        }
        fetchData();
    }, [loading, isFocused]);



    const ScrollButtons = useRef(null);
    const ScrollMain = useRef(null)
    const scrollToBottom = () => {
        ScrollButtons.current.scrollToEnd({ animated: true });
    }
    const scrollToStart = () => { 
        ScrollButtons.current.scrollTo({ x: 0, y: 0, animated: true });
     }

     const [top, settop] = useState();
     const scrollTop = () => { 
        ScrollMain.current?.scrollTo({ x: 0, y: 0, animated: true });
     }
    return (
        <Main>
            <Scroll ref={ScrollMain} onScroll={(event) => {
                const scrolling = event.nativeEvent.contentOffset.y;
                if (scrolling > 230) {
                    settop(true);
                } else {
                    settop(false);
                } }} scrollEventThrottle={16}>

                <Row style={{ justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20, marginTop: 40,}}>
                    <Title style={{ fontSize: 52, letterSpacing:-3,}}>Biblioteca</Title>
                    <Pressable onPress={() => {profileRef.current?.open()}} >
                        <MotiImage source={{uri: user?.avatar}}  style={{ width: 54, height: 54, borderRadius: 100, }}/>
                    </Pressable>
                </Row>

                <ScrollView ref={ScrollButtons} horizontal showsHorizontalScrollIndicator={false}>

                <Row style={{ marginHorizontal: 20, marginVertical: 20, justifyContent: 'center', alignItems: 'center', }}>
                    <Pressable onPress={() => { setType('Progress') }} style={{ paddingVertical: 10, paddingHorizontal: 18,  marginRight: 12, backgroundColor: type === 'Progress' ? "#fff" : "#303030", borderRadius: 40, }}>
                        <Title style={{ color: type === 'Progress' ? "#000" : "#d7d7d7", fontSize: 18, textAlign: 'center',  fontFamily: type === 'Progress' ? 'Font_Bold' : 'Font_Book', }}>Em progresso</Title>
                    </Pressable>
                    <Pressable onPress={() => { setType('Like'); scrollToStart() }} style={{ paddingVertical: 10, marginRight: 12, paddingHorizontal: 18, backgroundColor: type === 'Like' ? "#fff" : "#303030", borderRadius: 40, }}>
                        <Title style={{ color: type === 'Like' ? "#000" : "#d7d7d7", fontSize: 18, textAlign: 'center', fontFamily: type === 'Like' ? 'Font_Bold' : 'Font_Book', }}>Curtidos</Title>
                    </Pressable>
                    <Pressable onPress={() => { setType('Complete'); scrollToBottom() }} style={{ paddingVertical: 10, marginRight: 12, paddingHorizontal: 18, backgroundColor: type === 'Complete' ? "#fff" : "#303030", borderRadius: 40, }}>
                        <Title style={{ color: type === 'Complete' ? "#000" : "#d7d7d7", fontSize: 18, textAlign: 'center',  fontFamily: type === 'Complete' ? 'Font_Bold' : 'Font_Book',}}>Completos</Title>
                    </Pressable>
                    <Pressable onPress={() => { setType('Follow') }} style={{ paddingVertical: 10, marginRight: 12, paddingHorizontal: 18, backgroundColor: type === 'Follow' ? "#fff" : "#303030", borderRadius: 40, }}>
                        <Title style={{ color: type === 'Follow' ? "#000" : "#d7d7d7", fontSize: 18, textAlign: 'center', fontFamily: type === 'Follow' ? 'Font_Bold' : 'Font_Book', }}>Seguindo</Title>
                    </Pressable>
                </Row>
                </ScrollView>
 
               
                {!loading && 
                <Column>

                {type === 'Progress' && 
                    <FlatList
                        data={progress}
                        keyExtractor={item => item.id}
                        horizontal={false}
                        numColumns={2}
                        style={{alignSelf: 'center'}}
                        ListEmptyComponent={<CollectionEmpty />}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => <CollectionItem item={item} />}    
                        />
                    }
                    {type === 'Like' && 
                    <FlatList
                        data={like}
                        keyExtractor={item => item.id}
                        horizontal={false}
                        numColumns={2}
                        style={{alignSelf: 'center'}}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={<CollectionEmpty />}
                        renderItem={({ item }) => <CollectionItem item={item} />}    
                        />
                    }
                     {type === 'Complete' && 
                    <FlatList
                        data={complete}
                        keyExtractor={item => item.id}
                        horizontal={false}
                        numColumns={2}
                        ListEmptyComponent={<CollectionEmpty />}
                        style={{alignSelf: 'center'}}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => <CollectionItem item={item} />}    
                        />
                    }
                     {type === 'Follow' && 
                    <FlatList
                        data={follow}
                        keyExtractor={item => item.id}
                        horizontal={false}
                        numColumns={2}
                        ListEmptyComponent={<CollectionEmpty />}
                        style={{alignSelf: 'center'}}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => <CollectionItem item={item} />}    
                        />
                    }
                </Column>
                }
            </Scroll>
            <AnimatePresence> {top &&  
                <MotiView  style={{  position: 'absolute', right: 30, bottom: 30,  zIndex: 99,}}
                    from={{opacity: 0, transform: [{scale: 0}, {rotate: '45deg'}], }} 
                    animate={{opacity: 1, transform: [{scale: 1}, {rotate: '0deg'}],}} 
                    exit={{opacity: 0, transform: [{scale: 0}, {rotate: '45deg'}],}} 
                    exitTransition={{ type: 'spring',  duration: 300, }}>
                    <Pressable  onPress={scrollTop}  style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: "#fff", width: 50, height: 50, borderRadius: 100, }}>
                        <AntDesign name="arrowup" size={24} color="#000" />
                    </Pressable>
                </MotiView>}
            </AnimatePresence>

            <Modalize ref={profileRef} snapPoint={400} modalHeight={300} handlePosition="inside" handleStyle={{ backgroundColor: '#303030', width: 60,  }} modalStyle={{backgroundColor: '#171717',}} >
                <Column style={{ }}>
                    <ImageBackground source={{ uri: user?.capa }} blurRadius={100} style={{ width: '100%', height: 300,  borderRadius: 8, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', }} imageStyle={{opacity: .6,}}>
                        <Column style={{ justifyContent: 'space-between', alignItems: 'center', }}>
                            <Avatar width={112} height={112} />
                            <Column style={{ justifyContent: 'center', alignItems: 'center', marginTop: 12, }}>
                                <Title style={{ fontSize: 24, }}>{user?.name}</Title>
                                <Label style={{ fontSize: 16, color: '#f7f7f7' }}>{user?.bio}</Label>
                            </Column>
                        </Column>
                    </ImageBackground>

                </Column>
            </Modalize>
        </Main>
    )
}


const Spacer = ({ height = 16, width = 16, }) => <Column style={{ height, width }} />

const CollectionItem = ({item}) => {
    const navigation = useNavigation();
  return(
    <Pressable onPress={() => {navigation.navigate('MangaDetails', { id: item?.id, })}}  style={{ margin: 10, borderRadius: 8,}}>
        <Image source={{ uri: item.capa }} style={{ width: 150, height: 190, borderTopLeftRadius: 8, borderTopRightRadius: 8, }} />
        <Column style={{ paddingVertical: 6, backgroundColor: '#262626',  borderBottomLeftRadius: 6, borderBottomRightRadius: 6,  paddingHorizontal: 6,}}>
            <Title style={{fontSize: 18,}}>{item?.name?.slice(0, 16)}</Title>
            <Label style={{fontSize: 12, marginTop:2, }}>{item?.rate} • {item?.type}</Label>
            <Spacer height={4} />
        </Column>
    </Pressable>
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
    return(
        <Column style={{marginHorizontal: 20,}}>
                    <Row style={{ marginVertical: 30, alignSelf: 'center',}}>
                            <Column style={{ transform: [{ rotate: '-12deg', }],  width: 120, height: 180, borderRadius: 16, backgroundColor: "#262626"}} />
                            <Column style={{ transform: [{ rotate: '-12deg', }], borderWidth: 8, borderColor: "#171717", borderRadius: 16, marginHorizontal: -30,  width: 120, height: 180,  backgroundColor: "#262626" }}/>
                            <Column style={{ transform: [{ rotate: '-12deg', }], borderWidth: 8, borderColor: "#171717", borderRadius: 16,  width: 120, height: 180, backgroundColor: "#262626"}}/>
                    </Row>
                    <Title style={{textAlign: 'center',}}>Sem nada por aqui, por enquanto </Title>
                    <Label style={{textAlign: 'center',}}>Comece a ler os mangás, que eles {"\n"}irão aparecer por aqui. </Label>
                </Column>
    )
 }
