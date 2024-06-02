import React, { useState, useEffect, useRef, useContext } from 'react';
import { Main, Scroll, Title, Label, Row, Column, } from '../../theme/global';
import { Pressable, FlatList, Image, ScrollView, ImageBackground, ActivityIndicator } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Skeleton } from 'moti/skeleton';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { getPreferences, removeComplete, removeFollow, removeLike } from '../../api/user/preferences';
import Avatar from '../../components/avatar';
import { AnimatePresence, MotiImage, MotiView } from 'moti';
import { Modalize } from 'react-native-modalize';
import { Combine, Trash } from 'lucide-react-native'
import { ThemeContext } from 'styled-components/native';
import { excludeMangaProgress } from '../../api/user/progress';
import ModalAddCollection from '@components/modal/collection';


export default function AccountPage({ navigation, route}) {
    const {color, font} = useContext(ThemeContext)
    const isFocused = useIsFocused()
    const typeRoute = route.params?.type ?? 'Progress';
    
    const modalAdd = useRef();
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
    const [user, setuser] = useState([]);
    const profileRef = useRef()
    const mangaDetails = useRef()
    const [cache, setcache] = useState();

    useEffect(() => {
        const fetchData = () => {
            setLoading(true)
            getPreferences().then(res => {
                setuser(res)
                setComplete(res.complete)
                setProgress(res.progress)
                console.log(res.progress)
                setLike(res.likes)
                setFollow(res.follow)
                setMarks(res.marks)
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
    const [top, settop] = useState();

    const openModal = (value) => {
        mangaDetails.current?.open()
        setcache(value)}

    const data = type === 'Progress' ? progress :
        type === 'Like' ? like :
        type === 'Complete' ? complete :
        type === 'Follow' ? follow : [];
    const additionalProps = type === 'Complete' ? { type: 'complete' } : {};

    const [loadingExclude, setloadingExclude] = useState(false);
    const handleExclude = async () => {
        setloadingExclude(true)
        if(type === 'Progress'){
            await excludeMangaProgress(cache.id) 
            await getPreferences().then(res => {setProgress(res.progress); setloadingExclude(false);})
            mangaDetails.current?.close()
        }
        else if(type === 'Like'){
            await removeLike(cache.id)
            await getPreferences().then(res => {setLike(res.likes); setloadingExclude(false);})
            mangaDetails.current?.close()
        }else if(type === 'Complete'){
            await removeComplete(cache.id) 
            await getPreferences().then(res => {setComplete(res.complete); setloadingExclude(false);})
            mangaDetails.current?.close()
        }else if(type === 'Follow'){
           await removeFollow(cache.id)
           await getPreferences().then(res => {setFollow(res.follow); setloadingExclude(false);})
           mangaDetails.current?.close()
        }
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

           <FlatList
                    data={data}
                    keyExtractor={item => item.id}
                    ListHeaderComponent={<Column>
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
                                <Pressable onPress={() => { setType('Like'); ScrollButtons.current.scrollTo({ x: 0, y: 0, animated: true }); }} style={{ paddingVertical: 10, marginRight: 12, paddingHorizontal: 18, backgroundColor: type === 'Like' ? "#fff" : "#303030", borderRadius: 40, }}>
                                    <Title style={{ color: type === 'Like' ? "#000" : "#d7d7d7", fontSize: 18, textAlign: 'center', fontFamily: type === 'Like' ? 'Font_Bold' : 'Font_Book', }}>Curtidos</Title>
                                </Pressable>
                                <Pressable onPress={() => { setType('Complete'); ScrollButtons.current.scrollToEnd({ animated: true }); }} style={{ paddingVertical: 10, marginRight: 12, paddingHorizontal: 18, backgroundColor: type === 'Complete' ? "#fff" : "#303030", borderRadius: 40, }}>
                                    <Title style={{ color: type === 'Complete' ? "#000" : "#d7d7d7", fontSize: 18, textAlign: 'center',  fontFamily: type === 'Complete' ? 'Font_Bold' : 'Font_Book',}}>Completos</Title>
                                </Pressable>
                                <Pressable onPress={() => { setType('Follow') }} style={{ paddingVertical: 10, marginRight: 12, paddingHorizontal: 18, backgroundColor: type === 'Follow' ? "#fff" : "#303030", borderRadius: 40, }}>
                                    <Title style={{ color: type === 'Follow' ? "#000" : "#d7d7d7", fontSize: 18, textAlign: 'center', fontFamily: type === 'Follow' ? 'Font_Bold' : 'Font_Book', }}>Seguindo</Title>
                                </Pressable>
                            </Row>
                        </ScrollView>
                    </Column>}
                    horizontal={false}
                    numColumns={2}
                    columnWrapperStyle={{  marginHorizontal: 20, justifyContent: 'center', marginTop: 2}}
                    ListEmptyComponent={<CollectionEmpty />}
                    showsVerticalScrollIndicator={false}
                    ref={ScrollMain} onScroll={(event) => {  const scrolling = event.nativeEvent.contentOffset.y;   if (scrolling > 230) {  settop(true);  } else { settop(false);  } }} scrollEventThrottle={16}
                    renderItem={({ item, index }) => <CollectionItem item={item} openModal={openModal} {...additionalProps} index={index}/>}
               />  

            <AnimatePresence> {top &&  
                <MotiView  style={{  position: 'absolute', right: 30, bottom: 30,  zIndex: 99,}}
                    from={{opacity: 0, transform: [{scale: 0}, {rotate: '45deg'}], }} 
                    animate={{opacity: 1, transform: [{scale: 1}, {rotate: '0deg'}],}} 
                    exit={{opacity: 0, transform: [{scale: 0}, {rotate: '45deg'}],}} 
                    exitTransition={{ type: 'spring',  duration: 300, }}>
                    <Pressable  onPress={() => { ScrollMain.current?.scrollTo({ x: 0, y: 0, animated: true });}}  style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: "#fff", width: 50, height: 50, borderRadius: 100, }}>
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

            <Modalize ref={mangaDetails}  adjustToContentHeight handlePosition="inside" handleStyle={{ backgroundColor: '#303030', width: 60,  }} modalStyle={{backgroundColor: '#171717',}} style={{height: 400,}} >
                <Column style={{ marginHorizontal: 20, marginVertical: 30, }}>
                    <MotiImage from={{opacity: 0, transform: [{scale: .7,}, {rotate: '18deg'}]}} animate={{opacity: 1, transform: [{scale: 1,}, {rotate: '0deg'}]}} source={{ uri: cache?.capa }} style={{ width: 150, height: 210, borderRadius: 12,  objectFit: 'contain', alignSelf:'center',  }}/>
                    <Title style={{ textAlign: 'center', marginHorizontal: 30, marginTop: 16, }}>{cache?.name}</Title>
                    <Label style={{ textAlign: 'center', marginBottom: 20, }}>{cache?.rate} - {cache?.chapter} capítulos</Label>
                    
                    
                    
                    <Pressable onPress={handleExclude} style={{  backgroundColor: '#303030', paddingVertical: 16, paddingHorizontal: 20, borderRadius: 6,  }}>
                          <Row style={{ justifyContent: 'space-between', alignItems: 'center',  }}>
                            <Title style={{ fontSize: 18, fontFamily: 'Font_Medium', }}>Excluir mangá</Title>
                            {loadingExclude ? <ActivityIndicator color={color.red} size={24} /> :  <Trash color={color.red} size={18}/>}
                          </Row>
                    </Pressable>
                    <Pressable onPress={() => modalAdd.current?.open()} style={{  backgroundColor: '#303030', paddingVertical: 16, paddingHorizontal: 20, borderRadius: 6, marginTop: 12, }}>
                          <Row style={{ justifyContent: 'space-between', alignItems: 'center',  }}>
                            <Title style={{ fontSize: 18, fontFamily: 'Font_Medium', }}>Adicionar a uma coleção</Title>
                            <Combine color={color.blue} size={18}/>
                          </Row>
                    </Pressable>
                </Column>
            </Modalize>
            <Modalize ref={modalAdd} adjustToContentHeight handlePosition="inside" handleStyle={{ backgroundColor: '#d7d7d790' }} modalStyle={{ backgroundColor: "#171717", borderTopLeftRadius: 20, borderTopRightRadius: 20, }} >
                <Column>
                    <ModalAddCollection item={itm}/>
                </Column>
            </Modalize>

            
        </Main>
    )
}


const Spacer = ({ height = 16, width = 16, }) => <Column style={{ height, width }} />

const CollectionItem = ({item, type, openModal, index}) => {
    const navigation = useNavigation();
    const chaptertTotal = item.chapter
    const chaptersRead = item.chapters?.length
    const progress = parseInt((chaptersRead / chaptertTotal) * 100)
    const progressColor = progress < 30 ? '#d7d7d7' : progress < 60 ? '#ff9900' : progress < 80 ? 'green' : 'blue';

  return(
    <MotiView from={{opacity: 0, translateY: 20,}} animate={{opacity: 1, translateY: 0,}} delay={index * 100} transition={{type: 'timing'}}>

    <Pressable onPress={() => {navigation.navigate('MangaDetails', { id: item?.id, })}}  style={{ margin: 10, borderRadius: 8,}} onLongPress={() => openModal(item)}>
        <Image source={{ uri: item.capa }} style={{ width: 150, height: 190, borderTopLeftRadius: 8, borderTopRightRadius: 8, }} />
        <Column style={{ paddingVertical: 6, backgroundColor: '#262626',  borderBottomLeftRadius: 6, borderBottomRightRadius: 6,  paddingHorizontal: 6,}}>
            <Title style={{fontSize: 18,}}>{item?.name?.slice(0, 16)}</Title>
            <Label style={{fontSize: 12, marginTop:2, }}>{item?.rate} • {item?.type}</Label>
            {type === 'complete' ? <Label style={{fontSize: 12, paddingVertical: 6, paddingHorizontal: 10, backgroundColor: 'green', color: "#fff", borderRadius: 4, flexGrow: 1,marginTop: 6, marginBottom: -6, }}>Completo</Label> :
            <>
            {progress > 0 ? <Row style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: 8, }}>
                <Column style={{ width: 100, height: 10, backgroundColor: '#303030', borderRadius: 100, }}>
                    <Column style={{ width: `${progress}%`, height: 10, backgroundColor: progressColor, borderRadius: 100, }} />
                </Column>
                <Label style={{fontSize: 12, color: '#f7f7f7', }}>{progress}%</Label>
            </Row> : 
                <Label style={{fontSize: 14, marginTop: 6, color: '#d7d7d7', }}>Não iniciado</Label>
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


