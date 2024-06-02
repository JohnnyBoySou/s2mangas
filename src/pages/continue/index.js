import React, { useEffect, useState, memo, useRef} from 'react';
import { Pressable, Dimensions, FlatList, Image } from 'react-native';
import { Column, Row, Title, Label, Main, Scroll } from '../../theme/global';
import { Ionicons, MaterialCommunityIcons, AntDesign, FontAwesome5, SimpleLineIcons } from '@expo/vector-icons';
import { MotiImage, MotiView, AnimatePresence, useAnimationState, } from 'moti';
import requestSimilar from '../../api/manga/similar';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Modalize } from 'react-native-modalize';
import { addComplete, addLike, getPreferences, removeComplete, removeLike, verifyLiked } from '../../api/user/preferences';
import Toast from '../../components/toast';
import { listLastManga } from '../../api/user/progress';
import ModalAddCollection from '../../components/modal/collection';

import { Audio, Video } from 'expo-av';

const { width, height } = Dimensions.get('window');

export default function ContinuePage({ navigation }) {
  
  const [step, setStep] = useState(1);
  const [item, setItem] = useState([]);
  const cache = {
    capa: 'https://i.pinimg.com/736x/5d/00/0a/5d000ae8c44687a0603c6671d48c1c06.jpg',
    name: 'Sousou no Frieren',
    chapter: 130,
    chapters: [1,2,3,4,5,6,7,8,9,10],
    video: 'https://v1.pinimg.com/videos/mc/720p/1c/4a/69/1c4a692ecb051c3d6404fec569aaf643.mp4',
    explict: true,
    desc: 'The adventure is over but life goes on for an elf mage just beginning to learn what living is all about. Elf mage Frieren and her courageous fellow adventurers have defeated the Demon King and brought peace to the land. With the great struggle over, they all go their separate ways to live a quiet life. But as an elf, Frieren, nearly immortal, will long outlive the rest of her former party. How will she come to terms with the mortality of her friends? How can she find fulfillment in her own life, and can she learn to understand what life means to the humans around her? Frieren begins a new journey to find the answer.'
} 
  const [similar, setSimilar] = useState([]);
  const [liked, setLiked] = useState(false);
  const [marks, setMarks] = useState([]);
  const [completed, setCompleted] = useState(false);

  const modalRead = useRef(null);
  const modalAdd = useRef(null);
 
  useEffect(() => {
    const getManga = async () => {
      await listLastManga().then((manga) => {
       setItem(manga)
      })

     // const res = await requestSimilar(item?.id)
      //setSimilar(res?.mangas)
      
      const likedResponse = await verifyLiked(item?.id);
      setLiked(true);
      
      //const mark = await getPreferences()
      // const marks = mark?.find((m) => m.id === item?.id)
      //   setMarks(marks)
    }
    getManga()
  },[])

  const chaptertTotal = item.chapter
  const chaptersRead = item.chapters?.length
  const progresse = parseInt((chaptersRead / chaptertTotal) * 100)
  const progress = progresse

  const handleLike = async () => {
    if (liked) {
        removeLike(item.id).then(
            res => setLiked(false)
        )
    } else {
        addLike(item).then(
            res => setLiked(true)
        )
    }
  }

  const handleComplete = () => {
    if(completed){
      let r = removeComplete(item?.id)
      if(r) setCompleted(false)
    }else{
      let r = addComplete(item)
      if(r) setCompleted(true)
    }
  }
  const handlePlay = (params) => {
  }
  const TostLike = () => { return  liked ? <Toast name="Adicionado aos favoritos" color="#ED274A" /> : <Toast name="Removido dos favoritos" color="#000000" /> }
  const TostComplete = () => { return completed ? <Toast name="Marcado como completo" color="#27AE60" /> : <Toast name="Removida a marcação de completo" color="#000000" /> }


  const [showvideo, setshowvideo] = useState(false);
  const a = false

  const openIn = useAnimationState({
    close: {
      translateY: 90,
    },
    open: {
      translateY: 0,
    },
  });

  const handleOpen = () => {
    if(item.video){
      if (showvideo) {
        openIn.transitionTo('open');
        setshowvideo(false);
      } else{
      openIn.transitionTo('close');
      setshowvideo(true);
    }
    }
  };

  const wall = useRef()
  const [play, setplay] = useState();
  const handleStop = () => {
    if (play) {
      wall.current?.pauseAsync()
      setplay(false)
    } else {
      wall.current?.playAsync()
      setplay(true)
    }
  }
  return (
    <>
    <Main>
        {!item.video && <MotiImage blurRadius={100} source={{ uri: item.capa }} style={{ width: width, height: 1.1 *  height, opacity: 0.6, position: 'absolute', top: 0, left: 0, }} />}
        <Scroll style={{ marginTop: -30,  }} 
        //onScroll={(event) => { const scrolling = event.nativeEvent.contentOffset.y; if (scrolling > 100) {openIn.transitionTo('open'); setshowvideo(false);} else if (scrolling < 100){openIn.transitionTo('close');setshowvideo(true); }}}
        >
        {item?.video &&  <Video source={{ uri: item.video }} ref={wall}  rate={1.0}  volume={0.0} isMuted={true}  resizeMode="cover" shouldPlay isLooping style={{ width: width, height: 910, borderRadius: 24, position: 'absolute', top: 0, left: 0, }}/>}
        <Column style={{  paddingVertical: 22, zIndex: 999,  }}>
          <Row style={{ justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20, paddingTop: 20,  }}>
            <Pressable onPress={() => { navigation.goBack() }}>
            <Ionicons name="chevron-down" size={24} color="#fff" />
            </Pressable>
            <Column style={{ justifyContent: 'center', alignItems: 'center',  }}>
              <Label style={{ fontSize: 12, letterSpacing: 1, }}>MOSTRANDO DE</Label>
              <Title style={{ fontSize: 24, marginTop: -2, }}>Em progresso</Title>
            </Column>
            <Pressable onPress={handleStop} >
              {play ? <Ionicons name="pause" size={24} color="#fff" /> : <Ionicons name="play" size={24} color="#fff" />}
            </Pressable>
          </Row>

          <Pressable style={{ marginTop: 50, marginBottom: 30, height: 0.54 * height, }}  onPress={handleOpen}  // onPressOut={() => { setshowvideo(false) }} //onPress={() => { navigation.navigate('MangaDetails', {id: item.id });}}
  >
          {!item.video ? <MotiImage
              source={{ uri: item.capa }}
              style={{
                objectFit: 'contain',
                width: 300,
                height: 520,
                borderRadius: 6,
                alignSelf: 'center',
              }}
              from={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'timing', duration: 300, delay: 200 }}
              />:
              <MotiView style={{ 
                width: 300,
                height: 520, }}/>
              }
          </Pressable>

          <Column style={{  height: 200, zIndex: 999,  }}>
             
              <MotiView state={openIn} transition={{ type: 'timing', duration: 500, }}>
                <Row style={{ justifyContent: 'space-between', alignItems: 'center', zIndex: 99, marginHorizontal: 24, }}>
                    <Row>
                      {item?.video && <MotiImage from={{opacity: 0, scale: 0,}} animate={{opacity:1, scale: 1,}} source={{ uri: item?.capa}} style={{ width: 54, height: 54, marginRight: 12, borderRadius: 8, }}/>}
                      <Column>
                        <Title style={{ fontSize: 24, }}>{item?.name}</Title>
                        <Row style={{  alignItems: 'center',  }}>
                          {item?.explict && <Label style={{ color: "#000", backgroundColor: '#fff', fontFamily: 'Font_Medium', borderRadius: 4, width: 20, fontSize: 14, marginRight: 6, height: 20, textAlign: 'center',  }}>E</Label>}
                          <Label style={{ color: "#d4d4d4",  }}>{item?.chapter} capítulos</Label>
                        </Row>
                      </Column>
                    </Row>

                    <Pressable onPress={handleLike} style={{ width: 42, height: 42, justifyContent: 'center', alignItems: 'center', }}>
                      {liked ? <AnimatePresence>
                          <MotiView from={{ scale: 0, opacity: 0, }}  animate={{ scale: 1, opacity: 1, }} transition={{ type: 'spring', duration: 500,  }}>
                            <AntDesign name='heart' size={32} color="#EB5757"/>
                          </MotiView> 
                        </AnimatePresence> :
                        <MotiView from={{rotation: -45, opacity: 0, }}  animate={{ rotation: 0, opacity: 1, }}  transition={{ type: 'timing', duration: 500,  }}>
                          <AntDesign name='hearto' size={32} color="#d4d4d4"/>
                        </MotiView> }
                      </Pressable>
                </Row>
                {progress >= 0 &&
          <Row style={{ backgroundColor: "#ffffff30", marginHorizontal: 20, zIndex: 99, borderRadius: 100, marginTop: 20,  justifyContent: 'space-between', alignItems: 'center', }}>
            <MotiView style={{ height: 30, backgroundColor: "#fff", borderRadius: 100, width: '5%', }}   from={{ width: '5%', }}  animate={{ width: `${progress}%`, }}  transition={{ type: 'timing', duration: 1500, delay: 1000, }}/>
            <Title style={{marginRight: 12, }}>{progress}%</Title>
          </Row>
        }
              </MotiView>

              <AnimatePresence>
              {!showvideo &&

              <MotiView  from={{  translateY: 60, opacity: 0,}} animate={{ translateY: 0, opacity: 1,}} exit={{ translateY: 60, opacity:0,}} transition={{type:'timing'}}>
                <Row style={{ alignItems: 'center', justifyContent: 'center', marginTop: -10, }}>
                  <Pressable  style={{ width: 42, height: 32, marginRight: 20, justifyContent: 'center', alignItems: 'center', }}>
              <AntDesign name="sharealt" size={32} color="#d4d4d4" />
            </Pressable>

          
          <Pressable onPress={() => {modalAdd.current?.open()}}  style={{ width: 42, height: 42, justifyContent: 'center', alignItems: 'center', }}>
            <Ionicons name="add-circle-outline" size={32} color="#d4d4d4" />
          </Pressable>
        
          <Pressable onPress={handlePlay} style={{ backgroundColor: "#ED274A", width: 64, marginHorizontal: 30, height: 64, borderRadius: 100, justifyContent: 'center', alignItems: 'center', }}>
            <FontAwesome5 name="play" size={26} color="#fff" />
          </Pressable>
          
          <Pressable onPress={handleComplete} style={{ width: 52, height: 142, justifyContent: 'center', alignItems: 'center', }}>
              {completed ?
              <AnimatePresence>
                <MotiView from={{ scale: 0, opacity: 0, }}  animate={{ scale: 1, opacity: 1, }} transition={{ type: 'spring', duration: 500,  }}>
                  <Ionicons name='checkmark-done-circle' size={32} color="#27AE60" />
                </MotiView> 
              </AnimatePresence> :
                <MotiView from={{ scale: 1.5, opacity: 0, }}  animate={{ scale: 1,  opacity: 1, }}  transition={{ type: 'timing', duration: 500,  }}>
                  <Ionicons name='checkmark-done-circle-outline' size={32} color="#d4d4d4" />
                </MotiView>}
          </Pressable>

          <Pressable onPress={() => modalRead.current?.open()} style={{ width: 42, height: 32, marginLeft: 20,  justifyContent: 'center', alignItems: 'center', }}>
              <Ionicons name="albums-outline" size={32} color="#d4d4d4" />
            </Pressable>

                </Row>
              </MotiView>
              }
            </AnimatePresence>

           
          </Column>

          {showvideo &&  <MotiView from={{opacity: 0, translateY: 50}} animate={{opacity: 1, translateY: 0,}} exit={{opacity: 0, translateY: 50}}>
              <LinearGradient colors={["transparent",  '#171717']} style={{ width: '100%',  height: 170,  zIndex: 99, marginTop: -140,  }} />
          </MotiView> }

          <Column style={{  height: 200, zIndex: 999, backgroundColor: '#303030', marginHorizontal: 20, marginTop: 50, borderRadius: 16,  }}>
          </Column>

        

        {similar.length > 0 && <MotiView from={{ translateY: 60, opacity: 0,  }}  animate={{ opacity: 1, translateY: 0, }} transition={{ type: 'timing', duration: 300, delay: 1000, }} >
          <Column style={{ paddingHorizontal: 16, paddingVertical: 24, borderRadius: 16, marginVertical: 20, backgroundColor: "#17171760", }}>
            <Title style={{ fontSize: 18,  }}>Similares</Title>
            <FlatList
              style={{ marginVertical: 16, marginHorizontal: -20, }}
              data={similar}
              horizontal
              ListHeaderComponent={<Column style={{ width: 20, }} />}
              keyExtractor={item => item.id}
              renderItem={({ item }) => <Card item={item} />}
              showsHorizontalScrollIndicator={false}
            />
          </Column>
        </MotiView>}

        {marks.length > 0 &&  <Column style={{ paddingHorizontal: 16, paddingVertical: 24,  backgroundColor: "#252525", borderRadius: 16, }}>
          <Row style={{justifyContent: 'space-between', alignItems: 'center', marginBottom: 10,}}>
            <Title>Marcadores</Title>
            <Row style={{paddingVertical: 8, paddingHorizontal: 12, backgroundColor: "#303030", borderRadius: 100, justifyContent: 'center', alignItems: 'center', }}>
              <Ionicons name="bookmarks" size={16} color="#f9f9f9" />
              <Label style={{color: "#f9f9f9", fontSize: 14, marginLeft:10,}}>Meus marcadores</Label>
            </Row>
          </Row>
          <ListMarkers markers={item?.chapters?.markers} />
        </Column>}

        <Column style={{height: 60,}}/>
        </Column>
        </Scroll>

    </Main>

      <Modalize ref={modalRead} adjustToContentHeight={true} modalStyle={{backgroundColor: "#171717", }} handlePosition='inside' handleStyle={{backgroundColor: "#505050"}}>
        <ListReads current={item}/>
      </Modalize>


      <Modalize ref={modalAdd} adjustToContentHeight handlePosition="inside" handleStyle={{ backgroundColor: '#d7d7d790' }} modalStyle={{ backgroundColor: "#171717", borderTopLeftRadius: 20, borderTopRightRadius: 20, }} >
        <ModalAddCollection item={item}/>
      </Modalize>
  </>
  )
}


const Card = memo(({ item }) => {
  const navigation = useNavigation();
  return (
      <Pressable  onPress={() => { navigation.navigate('MangaDetails', {id: item.id });}} style={{  borderRadius: 6, width: 144, margin: 8,  }}>
        <Image source={{ uri: item.capa }} style={{ width: 144, height: 182, borderRadius: 6, alignSelf: 'center', marginBottom: 6, }} />
        <Title style={{ fontSize: 16, marginTop: 0, zIndex: 99, marginLeft: 2,}}>{item?.name.slice(0,16)}</Title>
      </Pressable>
  )
})
//<LinearGradient colors={["transparent", '#000']} style={{ width: '100%', height: 90, position: 'absolute', bottom: -8, left: 0, borderBottomRightRadius: 6, borderBottomLeftRadius: 6,}} />

const ListReads = ({ current }) => {
  const nexts = [
    {
      name: 'Jujutsu Kaisen',
      capa: 'https://i.pinimg.com/564x/af/d7/21/afd72193707a60a37ba36cc0c415fb0b.jpg',
      chapters: 12,
      id: 'jujutsu-kaisen',
    },
    {
      name: 'Naruto',
      capa: 'https://i.pinimg.com/564x/51/d1/fe/51d1fe3fe3183efd1de6051400f80e9b.jpg',
      chapters: 42,
      id: 'naruto',
    },
    {
      name: 'One Piece',
      capa: 'https://i.pinimg.com/564x/09/17/67/091767c5f602cc255c5040d477dfb623.jpg',
      chapters: 1090,
      id: 'one-piece',
    }
  ]

  const Card = ({ item }) => {
    const navigation = useNavigation();
    return (
        <Pressable  onPress={() => { navigation.navigate('MangaDetails', {id: item.id });}} style={{flexDirection: 'row', flexGrow: 1, marginBottom: 16, backgroundColor: "#303030", borderRadius: 6, justifyContent: 'space-between', alignItems: 'center', }}>
          <Row>
            <Image source={{ uri: item?.capa }} style={{ width: 56, height: 70, borderRadius: 6, alignSelf: 'center', marginRight: 16, }} />
            <Column style={{justifyContent: 'center', }}>
              <Title style={{fontSize: 18,}}>{item?.name}</Title>
              <Label style={{fontSize: 16,}}>Capítulos {item?.chapters}</Label>
            </Column>
          </Row>
          <AntDesign name="close" size={24} color="#ffffff90" style={{marginRight: 20,}}/>
        </Pressable>
    )
  }
  return(
    <Column style={{padding: 24,}}>
        <Title>Lendo agora</Title>

          <Row style={{justifyContent: 'space-between', alignItems: 'center', marginVertical: 16, backgroundColor: "#262626", borderRadius: 6, overflow: 'hidden', }}>
            <Row>
              <Image source={{ uri: 'https://i.pinimg.com/564x/34/8b/14/348b14140d2a4d35d8c687d811c23a43.jpg' }} style={{ width: 56, height: 70, borderRadius: 6, alignSelf: 'center', marginRight: 16, }} />
              <Column style={{justifyContent: 'center', }}>
                <Title>{current?.name}</Title>
                <Label>Capítulos {current?.chapters?.total}</Label>
              </Column>
            </Row>
              <Image source={{ uri: 'https://i.pinimg.com/564x/2b/84/55/2b845506362a9c280ceec68df978ca84.jpg'}} style={{width: 42, height: 52, marginTop: 20, transform: [{rotate: '-20deg'}], borderRadius: 6,}} />
          </Row>


        <Title>Próximos</Title>
        <FlatList
          style={{ marginVertical: 16 }}
          data={nexts}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <Card item={item} />}
        />
    </Column>
  )
  
}

const ListMarkers = ({ markers }) => {
  const Marker = ({item}) => {
    return(
      <Row style={{justifyContent: 'space-between', alignItems: 'center',  backgroundColor: "#404040", flexGrow: 1, padding: 12, borderRadius: 4,  margin: 6,  }}>
        <Title style={{fontSize: 18, }}>{item}</Title>
        <Ionicons name="bookmark-outline" size={18} color="#fff" />
      </Row>
    )
  }
  
  return(
    <Column>
      
      <FlatList 
        data={markers}
        numColumns={2}
        keyExtractor={item => item}
        renderItem={({ item }) => <Marker item={item} />}
      />
    </Column>
  )
}


/**
 *  <Row style={{ alignItems: 'center', justifyContent: 'space-between', marginTop: 15, }}>
         <Row style={{justifyContent: 'center', alignItems: 'center', }}>
            <SimpleLineIcons name="screen-smartphone" size={24} color="#ED274A" />
            <Label style={{ color: "#ED274A", marginLeft: 5, }}>Este telefone</Label>
          </Row>
          <Row>
            <Pressable onPress={handleLike} style={{ width: 32, height: 32, marginRight: 20, justifyContent: 'center', alignItems: 'center', }}>
              <AntDesign name="sharealt" size={24} color="#d4d4d4" />
            </Pressable>
            <Pressable onPress={() => modalRead.current?.open()} style={{ width: 32, height: 32, justifyContent: 'center', alignItems: 'center', }}>
              <Ionicons name="albums-outline" size={24} color="#d4d4d4" />
            </Pressable>
          </Row>
        </Row> 
 */