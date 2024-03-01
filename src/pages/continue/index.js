import React, { useEffect, useState, memo } from 'react';
import { Pressable, Dimensions, FlatList, Image } from 'react-native';
import { Column, Row, Title, Label, Main, Scroll } from '../../theme/global';
import { Ionicons, MaterialCommunityIcons, AntDesign, FontAwesome5, SimpleLineIcons } from '@expo/vector-icons';
import { MotiImage, MotiView } from 'moti';
import requestSimilar from '../../api/manga/similar';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function ContinuePage({ navigation }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState([]);
  const [similar, setSimilar] = useState([]);

  const item = {
    id: 'jujutsu-kaisen',
    name: 'Jujutsu Kaisen',
    capa: 'https://i.pinimg.com/564x/34/8b/14/348b14140d2a4d35d8c687d811c23a43.jpg',
    chapters: {
      total: 12,
      read: [1, 2, 3, 4, 8, 6, 8, 9, 10],
      markers: [3, 2, 1,]
    },
  }

  const progress = ((item?.chapters?.read.length / item?.chapters?.total) * 100).toFixed(0)

  useEffect(() => {
    const fetchData = async () => {
      const res = await requestSimilar(item?.id)
      setSimilar(res?.mangas)
    }
    fetchData()
  }, [])


  const handleLike = () => {
  }
  const handleRemix = (params) => {
  }
  const handleRandom = (params) => {
  }
  const handlePlay = (params) => {
  }

  return (
    <Main>
      <MotiImage blurRadius={100} source={{ uri: item.capa }} style={{ width: width, height: 1.1 *  height, opacity: 0.6, position: 'absolute', top: 0, left: 0, }} />
      <Scroll style={{ paddingHorizontal: 20, paddingVertical: 44, }}>
        <Row style={{ justifyContent: 'space-between', alignItems: 'center', }}>
          <Pressable onPress={() => { navigation.goBack() }} >
            <Ionicons name="chevron-down" size={32} color="#fff" />
          </Pressable>
          <Title style={{ fontSize: 28, }}>Continue</Title>
          <Pressable>
            <MaterialCommunityIcons name="dots-vertical" size={32} color="#fff" />
          </Pressable>
        </Row>
        <Column style={{ marginTop: 50, marginBottom: 30, }}>
          <MotiImage source={{ uri: item.capa }} style={{ objectFit: 'cover', width: 200, height: 320, borderRadius: 6, alignSelf: 'center', }}
            from={{ opacity: 0, scale: 0.5, }}
            animate={{ opacity: 1, scale: 1, }}
            transition={{ type: 'timing', duration: 300, delay: 200, }} />
        </Column>
        <Row style={{ justifyContent: 'space-between', alignItems: 'center', }}>
          <Column>
            <Title>{item?.name}</Title>
            <Label style={{ marginTop: 4, }}>Capítulo {item?.chapters?.read.pop()}</Label>
          </Column>
          <Pressable>
            <Ionicons name="checkmark-circle" size={42} color="#ED274A" />
          </Pressable>
        </Row>

        <Row style={{ backgroundColor: "#ffffff30", borderRadius: 100, marginTop: 20, marginBottom: 10, justifyContent: 'space-between', alignItems: 'center', }}>
          <MotiView style={{ height: 50, backgroundColor: "#fff", borderRadius: 100, width: '5%', }}   from={{ width: '5%', }}  animate={{ width: progress+"%", }}  transition={{ type: 'timing', duration: 1500, delay: 1000, }}/>
          <Title style={{marginRight: 10, }}>{progress}%</Title>
        </Row>



        <Row style={{ alignItems: 'center', justifyContent: 'space-between', marginTop: 15, }}>
          <Pressable onPress={handleLike} style={{ width: 42, height: 42, justifyContent: 'center', alignItems: 'center', }}>
            <AntDesign name="hearto" size={32} color="#d4d4d4" />
          </Pressable>
          <Pressable onPress={handleLike} style={{ width: 42, height: 42, justifyContent: 'center', alignItems: 'center', }}>
            <AntDesign name="arrowleft" size={32} color="#d4d4d4" />
          </Pressable>
          <Pressable onPress={handlePlay} style={{ backgroundColor: "#ED274A", width: 72, marginLeft: 10, height: 72, borderRadius: 100, justifyContent: 'center', alignItems: 'center', }}>
            <FontAwesome5 name="play" size={32} color="#fff" />
          </Pressable>
          <Pressable onPress={handleLike} style={{ width: 42, height: 42, justifyContent: 'center', alignItems: 'center', }}>
            <AntDesign name="arrowright" size={32} color="#d4d4d4" />
          </Pressable>
          <Pressable onPress={handleLike} style={{ width: 42, height: 42, justifyContent: 'center', alignItems: 'center', }}>
            <Ionicons name="checkmark-done-circle-outline" size={32} color="#d4d4d4" />
          </Pressable>
        </Row>

        <Row style={{ alignItems: 'center', justifyContent: 'space-between', marginTop: 15, }}>
          <Row style={{justifyContent: 'center', alignItems: 'center', }}>
            <SimpleLineIcons name="screen-smartphone" size={24} color="#ED274A" />
            <Label style={{ color: "#ED274A", marginLeft: 5, }}>Esse telefone</Label>
          </Row>
          <Row>
            <Pressable onPress={handleLike} style={{ width: 32, height: 32, marginRight: 20, justifyContent: 'center', alignItems: 'center', }}>
              <AntDesign name="sharealt" size={24} color="#d4d4d4" />
            </Pressable>
            <Pressable onPress={handleLike} style={{ width: 32, height: 32, justifyContent: 'center', alignItems: 'center', }}>
              <Ionicons name="albums-outline" size={24} color="#d4d4d4" />
            </Pressable>
          </Row>
        </Row>
        <MotiView from={{ translateY: 60, opacity: 0,  }}  animate={{ opacity: 1, translateY: 0, }} transition={{ type: 'timing', duration: 300, delay: 1000, }} >
          <Column style={{ paddingHorizontal: 16, paddingVertical: 32, borderRadius: 16, marginVertical: 20, backgroundColor: "#171717", }}>
            <Title>Similares</Title>
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
        </MotiView>
        <Column style={{height: 60,}}/>
      </Scroll>
    </Main>
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