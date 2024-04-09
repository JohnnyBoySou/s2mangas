import React, { useState, useContext, useEffect,useCallback } from 'react';
import { Pressable, Dimensions} from 'react-native';
import { Column, Label, Row, Main, Scroll, Title, } from '../../theme/global';
import { ThemeContext } from "styled-components/native";
import { MangalistLastedComponent, MangalistRateComponent, MangalistWeekendComponent } from '../../components/lists/mangalist';
import NewsComponent from '../../components/lists/news';
import LastedComponent from './../../components/lists/lasted';
import RateComponent from '../../components/lists/rate';
import WeekendComponent from '../../components/lists/weekend';
import Header from '../../components/header';
import { getPreferences } from '../../api/user/preferences';
import CollectionsComponent from '../../components/lists/collections';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { MotiImage } from 'moti';
import axios from 'axios'
import { Space } from 'lucide-react-native';
const { width, height } = Dimensions.get('window');


export default function HomePage({ navigation }) {
    const { color, font } = useContext(ThemeContext);
    const [type, setType] = useState('Tudo');
    const [user, setUser] = useState();
    useEffect(() =>{
        const fechtData = async () => {
            getPreferences().then(user => {
                    if(user?.name){
                        setUser(user)
                    }else{
                      navigation.navigate('Onboarding')
                    }
                }
            )
          }
          fechtData()
    }, [])


 

    return (
        <Main>
            <Scroll stickyHeaderIndices={[1]}>
                {type === 'Mangas' && <Column style={{ width: 100, height: 50 }} />}
                {type === 'Mangalist' && <Column style={{ width: 100, height: 50 }} />}
                {type === 'Tudo' && <Column style={{ paddingHorizontal: 20, }}><Header/></Column>}

 

                <Row style={{ marginBottom: 0, backgroundColor: color.background, padding: 12, paddingTop: 40, marginTop: -20, zIndex: 99, }}>
                    <Pressable onPress={() => { setType('Tudo') }} style={{ paddingVertical: 10, paddingHorizontal: 16, marginLeft: 10, backgroundColor: type === 'Tudo' ? color.light : color.off, borderRadius: 100, zIndex: 99,}}>
                        <Label style={{ color: type === 'Tudo' ? color.off : color.title, fontFamily: type === 'Tudo' ? font.bold : font.book, }}>Tudo</Label>
                    </Pressable>
                    <Pressable onPress={() => { setType('Mangas') }} style={{ paddingVertical: 10, marginHorizontal: 8, paddingHorizontal: 16, backgroundColor: type === 'Mangas' ? color.light : color.off, borderRadius: 100, zIndex: 99, }}>
                        <Label style={{ color: type === 'Mangas' ? color.off : color.title, fontFamily: type === 'Mangas' ? font.bold : font.book, }}>Mangás</Label>
                    </Pressable>
                    <Pressable onPress={() => { setType('Mangalist') }} style={{ marginRight: 8, paddingVertical: 10, paddingHorizontal: 16, backgroundColor: type === 'Mangalist' ? color.light : color.off, borderRadius: 100, zIndex: 99,}}>
                        <Label style={{ color: type === 'Mangalist' ? color.off : color.title, fontFamily: type === 'Mangalist' ? font.bold : font.book, }}>Mangalist</Label>
                    </Pressable>
                    <Pressable onPress={() => { navigation.navigate('Collections') }} style={{ marginRight: 8, paddingVertical: 10, paddingHorizontal: 16, backgroundColor: type === 'Collections' ? color.light : color.off, borderRadius: 100, zIndex: 99,}}>
                        <Label style={{ color: type === 'Collections' ? color.off : color.title, fontFamily: type === 'Collections' ? font.bold : font.book, }}>Coleções</Label>
                    </Pressable>
                </Row>

                
                {type === 'Tudo' && <Column>
                    <ForYou />
                    <Spacer height={30} />
                    <NewsComponent />
                    <Spacer />
                    <CollectionsComponent />
                    <Spacer />
                    <LastedComponent />
                    <Spacer />
                    <RateComponent />
                    <Spacer />
                    <MangalistWeekendComponent />
                    <Spacer />
                    <WeekendComponent />
                    <Spacer />
                </Column>}
                {type === 'Mangas' && <Column >
                    <WeekendComponent />
                    <Spacer />
                    <RateComponent />
                    <Spacer />
                    <NewsComponent />
                    <Spacer />
                    <LastedComponent />
                    <Spacer />
                </Column>}
                {type === 'Mangalist' && <Column>
                    <Spacer />
                    <MangalistLastedComponent />
                    <Spacer />
                    <MangalistWeekendComponent />
                    <Spacer />
                    <MangalistRateComponent />
                    <Spacer />
                </Column>}
            </Scroll>
        </Main>
    )
}


const Spacer = ({ height = 16, width = 16, }) => <Column style={{ height, width }} />

const ForYou = () => { 
    const [data, setData] = useState([]);
    useEffect(() => {
        axios.get('https://www.s2mangas.com/api/mangalist?page=1')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.log(error);
            })
    }, [])

    
    const Card = React.memo(({ item }) => {
        const navigation = useNavigation();
        return (
            <Pressable onPress={() => { navigation.navigate('MangalistDetails', {
                item: item,
                });
            }} style={{ backgroundColor: "#303030", borderRadius: 10, flexGrow: 1, marginTop: 12, flexDirection: 'row' }}>
                <MotiImage source={{ uri: item?.capa }} style={{ width: 152, height: 152, borderRadius: 10,  }} />
                <Column style={{ marginLeft: 24, flexGrow: 1, justifyContent: 'center',  }}>
                    <Label style={{ fontSize: 16,color: "#ED274A", fontFamily: 'Font_Medium', width: 100, }}>Mangalist</Label>
                    <Title style={{ fontSize: 20, marginTop: 5, lineHeight: 26, width:150,}}>{item?.name}</Title>
                    <Label style={{ fontSize: 14, width: 160, }}>{item?.desc.slice(0, 62)}...</Label>
                </Column>
            </Pressable>
        )
    })

    return(
            <Column style={{  marginHorizontal: 20, marginTop: 10, }}> 
                <Title>Escolhido para você</Title>
               <Card item={data[3]} />
            </Column>
    )
 }
