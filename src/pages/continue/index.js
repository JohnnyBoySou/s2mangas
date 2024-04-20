import React, { useEffect, useState, memo, useRef} from 'react';
import { Pressable, Dimensions, FlatList, Image } from 'react-native';
import { Column, Row, Title, Label, Main, Scroll } from '../../theme/global';
import { Ionicons, MaterialCommunityIcons, AntDesign, FontAwesome5, SimpleLineIcons } from '@expo/vector-icons';
import { MotiImage, MotiView, AnimatePresence, } from 'moti';
import requestSimilar from '../../api/manga/similar';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Modalize } from 'react-native-modalize';
import { addComplete, addLike, getPreferences, removeComplete, removeLike, verifyLiked } from '../../api/user/preferences';
import Toast from '../../components/toast';
import { listLastManga } from '../../api/user/progress';
import ModalAddCollection from '../../components/modal/collection';

const { width, height } = Dimensions.get('window');

export default function ContinuePage({ navigation }) {
  
  const [step, setStep] = useState(1);
  const [item, setItem] = useState([]);
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

      const res = await requestSimilar(item?.id)
      setSimilar(res?.mangas)
      
      const likedResponse = await verifyLiked(item?.id);
      setLiked(likedResponse);
      
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

  const handleRemix = (params) => {
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


  const a = false

  return (
    <>
    <Main>
      <MotiImage blurRadius={100} source={{ uri: item.capa }} style={{ width: width, height: 1.1 *  height, opacity: 0.6, position: 'absolute', top: 0, left: 0, }} />
      <Scroll style={{ paddingHorizontal: 20, paddingVertical: 22, }}>
        <Row style={{ justifyContent: 'space-between', alignItems: 'center', }}>
            <Pressable onPress={() => { navigation.goBack() }}>
            <Ionicons name="chevron-down" size={32} color="#fff" />
            </Pressable>
            <Title style={{ fontSize: 28 }}>Em progresso</Title>
            <Pressable>
            <MaterialCommunityIcons name="dots-vertical" size={32} color="#fff" />
            </Pressable>
          </Row>
          <Column style={{ marginTop: 50, marginBottom: 30 }}>
            <MotiImage
            source={{ uri: item.capa }}
            style={{
              objectFit: 'cover',
              width: 200,
              height: 320,
              borderRadius: 6,
              alignSelf: 'center',
            }}
            from={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', duration: 300, delay: 200 }}
            />
          </Column>

          
        <Row style={{ justifyContent: 'space-between', alignItems: 'center', }}>
          <Column>
            <Title style={{ fontSize: 24, }}>{item?.name}</Title>
            <Label style={{ color: "#d4d4d4",  }}>{item?.chapter} capítulos</Label>
          </Column>
          <Pressable onPress={() => {modalAdd.current?.open()}}  style={{ width: 42, height: 42, justifyContent: 'center', alignItems: 'center', }}>
              <Ionicons name="add-circle-outline" size={32} color="#d4d4d4" />
          </Pressable>
        </Row>
      
        {progress >= 0 &&
          <Row style={{ backgroundColor: "#ffffff30", borderRadius: 100, marginTop: 20,  justifyContent: 'space-between', alignItems: 'center', }}>
            <MotiView style={{ height: 40, backgroundColor: "#fff", borderRadius: 100, width: '5%', }}   from={{ width: '5%', }}  animate={{ width: `${progress}%`, }}  transition={{ type: 'timing', duration: 1500, delay: 1000, }}/>
            <Title style={{marginRight: 12, }}>{progress}%</Title>
          </Row>
        }

      


        <Row style={{ alignItems: 'center', justifyContent: 'center', marginTop: -10, }}>
          <Pressable onPress={handleLike} style={{ width: 42, height: 32, marginRight: 20, justifyContent: 'center', alignItems: 'center', }}>
              <AntDesign name="sharealt" size={32} color="#d4d4d4" />
            </Pressable>

          <Pressable onPress={handleLike} style={{ width: 52, height: 142, justifyContent: 'center', alignItems: 'center', }}>
           {liked ? <AnimatePresence>
              <MotiView from={{ scale: 0, opacity: 0, }}  animate={{ scale: 1, opacity: 1, }} transition={{ type: 'spring', duration: 500,  }}>
                <AntDesign name='heart' size={32} color="#EB5757"/>
              </MotiView> 
            </AnimatePresence> :
            <MotiView from={{rotation: -45, opacity: 0, }}  animate={{ rotation: 0, opacity: 1, }}  transition={{ type: 'timing', duration: 500,  }}>
              <AntDesign name='hearto' size={32} color="#d4d4d4"/>
            </MotiView> }

          </Pressable>
        
          <Pressable onPress={handlePlay} style={{ backgroundColor: "#ED274A", width: 72, marginHorizontal: 30, height: 72, borderRadius: 100, justifyContent: 'center', alignItems: 'center', }}>
            <FontAwesome5 name="play" size={32} color="#fff" />
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

        {a &&  <Row style={{ alignItems: 'center', justifyContent: 'space-between', marginTop: 15, }}>
         
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
        </Row> }

        {similar.length > 0 && <MotiView from={{ translateY: 60, opacity: 0,  }}  animate={{ opacity: 1, translateY: 0, }} transition={{ type: 'timing', duration: 300, delay: 1000, }} >
          <Column style={{ paddingHorizontal: 16, paddingVertical: 24, borderRadius: 16, marginVertical: 20, backgroundColor: "#171717", }}>
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
      <Pressable  onPress={() => { navigation.navigate('MangaDetails', {id: item.id });}} style={{ backgroundColor: "#303030", borderRadius: 6, width: 144, margin: 8,  }}>
        <Image source={{ uri: item.capa }} style={{ width: 144, height: 182, borderRadius: 6, alignSelf: 'center', marginBottom: 6, }} />
        <Title style={{ fontSize: 16, marginTop: -30, zIndex: 99, marginLeft: 4,}}>{item?.name.slice(0,16)}</Title>
        <LinearGradient colors={["transparent", '#000']} style={{ width: '100%', height: 90, position: 'absolute', bottom: -8, left: 0, borderBottomRightRadius: 6, borderBottomLeftRadius: 6,}} />
      </Pressable>
  )
})

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
