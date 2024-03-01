import React, { useRef, useState } from 'react';
import { Column, Row, Title, Label, Scroll, Main } from '../../theme/global';
import { Image, TouchableOpacity , Dimensions, FlatList} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, FontAwesome5, Entypo, FontAwesome, Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';

const { width, height } = Dimensions.get('window');	

export default function MangalistDetailsPage({ route, navigation }) {
    const item = route.params.item;
    const handleLike = () => {

    }
    const handleRemix = (params) => {

    }
    const handleRandom = (params) => {

    }
    const handlePlay = (params) => {

    }
    const [story, setStory] = useState(false);

    return (
        <Main>
           {story && <Story setStory={setStory} item={item} handlePlay={handlePlay} handleLike={handleLike} handleRandom={handleRandom} handleRemix={handleRemix} /> }
            <Scroll >
                <LinearGradient colors={[item?.color, 'transparent']} style={{ width: '100%', height: 300, position: 'absolute', top: 0, left: 0, }} />
                <Row style={{ marginTop: 50, paddingHorizontal: 20, }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <AntDesign name="arrowleft" size={32} color="#fff" />
                    </TouchableOpacity>
                </Row>
                <Column style={{ paddingHorizontal: 20, }}>
                    <Image source={{ uri: item?.capa }} style={{ width: 200, height: 200, alignSelf: 'center', borderRadius: 4, }} />
                    <Title style={{ fontSize: 24, marginBottom: 5, marginTop: 20, }}>{item?.name}</Title>
                    <Label style={{ fontSize: 18, lineHeight: 22 }}>{item.desc}</Label>
                    <Label style={{ marginTop: 10, }}>{item.mangas_ids.length} mangás • Verificado</Label>
                    <Row style={{ alignItems: 'center', justifyContent: 'space-between', marginTop: 15,}}>
                        <Row style={{justifyContent: 'center', alignItems: 'center', }}>
                            <TouchableOpacity onPress={() => setStory(!story)} style={{ borderColor: "#606060", borderWidth: 1, borderRadius: 8, marginRight: 10, justifyContent: 'center', alignItems: 'center', }}>
                                <Image source={{ uri: item?.capa }} style={{ width: 30, height: 46,  margin: 4,  borderRadius: 4,}} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleLike} style={{ width: 42, height: 42, justifyContent: 'center', alignItems: 'center', }}>
                                <AntDesign name="hearto" size={24} color="#d4d4d4" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleRemix} style={{ width: 42, height: 42, justifyContent: 'center', alignItems: 'center', }}>
                                <Ionicons name="add-circle-outline" size={24} color="#d4d4d4" />
                            </TouchableOpacity>
                        </Row>

                        <Row style={{ justifyContent: 'center', alignItems: 'center', }}>
                            <TouchableOpacity onPress={handleRandom} style={{ width: 42, height: 42, justifyContent: 'center', alignItems: 'center', }}>
                                <FontAwesome name="random" size={24} color="#d4d4d4" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handlePlay} style={{ backgroundColor: "#ED274A", width: 52, marginLeft: 10, height: 52, borderRadius: 100, justifyContent: 'center', alignItems: 'center', }}>
                                <FontAwesome5 name="play" size={18} color="#fff" />
                            </TouchableOpacity>
                        </Row>
                    </Row>
                </Column>
                <FlatList 
                    style={{marginTop: 20,}}
                    data={item.mangas_ids}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <Card navigation={navigation} item={item} />}
                />
            </Scroll>
        </Main>
    )
}


const Card = ({ item, navigation }) => {
  return(
    <Row style={{borderTopColor: "#303030", borderTopWidth: 2,  paddingVertical: 10, marginHorizontal: 20, justifyContent: 'space-between',  alignItems: 'center',}}>
        <Row style={{width: '70%', alignItems: 'center',}}>
            <Image source={{ uri: item.capa}} style={{width: 60, height: 80, borderRadius: 6,}}/>
            <Title style={{fontSize: 22, marginLeft: 20, }}>{item.name.slice(0, 60)}</Title>
        </Row>

        <TouchableOpacity style={{backgroundColor: '#303030', padding: 12, borderRadius: 100, marginLeft: 20,}} onPress={() => navigation.navigate('MangaDetails', {id: item.id})}>
            <AntDesign name="arrowright" size={24} color="#fff" />
        </TouchableOpacity>
    </Row>
  )
}



const Story = ({item, handleLike, setStory, handleRandom, handleRemix, }) => {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState();

    const handlePlayPause = async () => {
        if (isPlaying) {
            await videoRef.current.pauseAsync();
        } else {
            await videoRef.current.playAsync();
        }
        setIsPlaying(!isPlaying);
    };
    return (
        <Column style={{height: 1.1 * height, paddingTop:40, backgroundColor: "#171717"}}>
            <Video ref={videoRef}
                source={{ uri: item?.video }}
                resizeMode='cover'
                style={{ width: width, height: 0.88 * height, zIndex: 80, borderRadius: 24,}} 
            />
                <Row style={{ alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 14,}}>
                        <Row>
                        <TouchableOpacity onPress={() => setStory(false)} style={{ width: 42, height: 42, justifyContent: 'center', alignItems: 'center', }}>
                                <AntDesign name="arrowleft" size={24} color="#d4d4d4" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleLike} style={{ width: 42, height: 42, justifyContent: 'center', alignItems: 'center', }}>
                                <AntDesign name="hearto" size={24} color="#d4d4d4" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleRemix} style={{ width: 42, height: 42, justifyContent: 'center', alignItems: 'center', }}>
                                <Ionicons name="add-circle-outline" size={24} color="#d4d4d4" />
                            </TouchableOpacity>
                        </Row>

                        <Row style={{ justifyContent: 'center', alignItems: 'center', }}>
                            <TouchableOpacity onPress={handleRandom} style={{ width: 42, height: 42, justifyContent: 'center', alignItems: 'center', }}>
                                <FontAwesome name="random" size={24} color="#d4d4d4" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handlePlayPause} style={{ backgroundColor: "#ED274A", width: 52, marginLeft: 10, height: 52, borderRadius: 100, justifyContent: 'center', alignItems: 'center', }}>
                            <Entypo name={isPlaying ? 'controller-paus' : 'controller-play'} size={32} color="#fff" />
                            </TouchableOpacity>
                        </Row>
            </Row>
        </Column>

    )
}