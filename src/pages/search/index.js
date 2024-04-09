import React, { useContext, useState, useEffect, useRef} from 'react';
import { Column, Row, Title, Label, Main, Scroll, } from '../../theme/global';
import { FlatList, Pressable, TextInput, Image } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { AntDesign, Feather } from '@expo/vector-icons';
import { MotiImage, MotiView, useAnimationState } from 'moti';
import requestSearch from '../../api/manga/search';
import { saveWord, listWords, excludeWords, excludeWord } from '../../api/history';
import {tags} from '../../api/tags';
import Avatar from '../../components/avatar';
import { Skeleton } from 'moti/skeleton';
import { Spacing } from '../preferences/styles';
import { getPreferences } from '../../api/user/preferences'; 
import { useNavigation } from '@react-navigation/native';

export default function SearchPage({navigation}){
    const { color , font } = useContext(ThemeContext)
    const [name, setname] = useState('');
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [openSearch, setopenSearch] = useState(false);
    const [user, setUser] = useState();

    const getData = async () => {
        if(name === '') { setData([]);  return;}
        if(!history.includes(name)){
            saveWord(name);
        }
        setLoading(true);
        requestSearch(name).then(res => {
            setData(res)
            setLoading(false)
        })
    };

    const cleanHistory = () => {
        excludeWords()
        setHistory([])
    }

    useEffect(() => {
        const requestHistory = async () => {
            try {
                const response = await listWords();
                const prefer = await getPreferences()
                setUser(prefer)
                setHistory(response)
            } catch (error) {
                console.log(error)
            }
        }
        requestHistory()
    }, [loading])

    useEffect(() => {
        toggleAnimation.transitionTo('close')
        setopenSearch(false);
    },[])

    const ScrollMain = useRef();
    const toggleAnimation = useAnimationState({
        close: {
            height: 180,
        },
        open: {
            height: 280,
        },
    });
    return(
    <Main>
        <Scroll ref={ScrollMain}>
            <Column style={{ paddingHorizontal: 20, }}>
                <MotiView state={toggleAnimation} transition={{type: 'timing', duration: 300,}} style={{ marginHorizontal: -20, paddingHorizontal: 20,paddingBottom: 20, borderRadius: 16,}}>
                    <Row style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: 16, }}>
                        <Title style={{ fontSize: 52, marginVertical: 24, letterSpacing:-3,}}>Buscar</Title>
                    </Row>

                    <Row style={{}}>
                        <TextInput onFocus={() => {setopenSearch(true); toggleAnimation.transitionTo('open')}} onBlur={() => {if(name?.length == 0 ) {setopenSearch(false); toggleAnimation.transitionTo('close')}}} value={name} placeholderTextColor={color.title + 70} placeholder='Ex.: One Piece' onChangeText={setname} style={{ fontFamily: font.book, paddingVertical: 12, flexGrow: 1, backgroundColor: openSearch ? "#f7f7f7" : '#303030',  paddingHorizontal: 20, borderRadius: 12, fontSize: 20, borderColor: name.length > 2 ? color.green : "transparent", borderWidth: 2, color: "#000", borderTopRightRadius: 0, borderBottomRightRadius: 0, }} />
                        <Pressable disabled={loading} onPress={getData} style={{ backgroundColor: color.primary, borderTopRightRadius: 12, borderBottomRightRadius: 12, width: 58,  justifyContent: 'center', alignItems: 'center',  }}>
                            <Feather name="search" size={24} color="#fff" />
                        </Pressable>
                    </Row>
                    {openSearch && <>
                        {history.length > 0 && <MotiView from={{translateX: -30, opacity: 0, }} animate={{ translateX: 0, opacity: 1, }} transition={{type: 'timing', duration: 300,}}>
                            <Row style={{ justifyContent: 'space-between', alignItems: 'center',  marginTop: 20, marginBottom: 6,}}>
                                <Title style={{ fontSize: 24, }}>Buscas recentes</Title>
                                <Pressable onPress={() => {excludeWords(); setLoading(!loading); setHistory([]);}} >
                                    <Feather name="trash" size={16} color={color.red} />
                                </Pressable>
                            </Row>

                            <FlatList style={{ marginHorizontal: -20, paddingHorizontal: 16, }} horizontal showsHorizontalScrollIndicator={false} data={history} renderItem={({item}) => <Pressable onPress={() => {setname(item); setLoading(!loading); console.log('pressiou')}} onLongPress={() => {excludeWord(item); setLoading(!loading);} } style={{ paddingHorizontal: 22, paddingVertical: 12, borderRadius: 100, backgroundColor: '#303030', margin: 6, }}><Label style={{ fontSize: 18, }}>{item}</Label></Pressable>} keyExtractor={(item) => item}/>
                        </MotiView>}
                        {history.length === 0 && <MotiView from={{translateX: -30, opacity: 0, }} animate={{ translateX: 0, opacity: 1, }} transition={{type: 'timing', duration: 300,}}>
                            <Row style={{ justifyContent: 'space-between', alignItems: 'center',  marginTop: 20, marginBottom: 6,}}>
                                <Title style={{ fontSize: 24, }}>Buscas recentes</Title>
                            </Row>
                            <Label>Sem nenhuma busca no histórico</Label>
                        </MotiView>}
                        </>}
                </MotiView>


                {loading && <SkeletonBody />}

                {data?.length === 0 && 
                <Column>
                    <Title style={{ fontSize: 24, marginBottom: 6, marginTop: 20,}}>Suas categorias favoritas</Title>
                    <FlatList data={user?.items} numColumns={2} style={{ marginHorizontal: -8, }} renderItem={({item}) => <Category item={item}/>} keyExtractor={(item) => item.id}/>
                    <Title style={{ fontSize: 24, marginBottom: 6, marginTop: 20,}}>Navegue por categorias</Title>
                    <FlatList data={tags} numColumns={2} style={{ marginHorizontal: -8, }} renderItem={({item}) => <Category item={item}/>} keyExtractor={(item) => item.id}/>
                </Column>}
                
                {data?.length > 0 &&
                <Column>
                    <Title style={{ fontSize: 24, marginBottom: 10, marginTop: 20,}}>Mais Relevante</Title>
                    <FlatList data={data.slice(0,1)} style={{ alignSelf: 'center' }} renderItem={({item}) => <RelevantResult item={item}/>} keyExtractor={(item) => item.id}/> 
                    <Title style={{ fontSize: 24, marginTop: 20, marginBottom: 4}}>Todos</Title>
                    <FlatList data={data.slice(1,)} numColumns={2} style={{ alignSelf: 'center', marginHorizontal: -8, }} renderItem={({item}) => <Result item={item}/>} keyExtractor={(item) => item.id}/>
                </Column>}

               </Column>
        </Scroll>
    </Main>
    )}

    const Category = ({item}) => { 
        const navigation = useNavigation()
        return(
            <Pressable style={{ width: '46%', flexGrow: 1, }} onPress={() => {navigation.navigate('Category', { 'category' : item })}} >
               <Column  style={{cursor: 'pointer', margin: 8, borderRadius: 12,  backgroundColor: item?.color, overflow: 'hidden', padding: 6, height: 84,}}>
                <Title style={{fontSize: 20, margin: 10, flexWrap:'wrap'}}>{item.name}</Title>
              </Column>
            </Pressable>
        )
     }
     //<MotiImage source={{uri: item?.img}} style={{ width: 50, height: 80, position: 'absolute', right: -8, bottom: -10, transform: [{rotate: '24deg',}], borderRadius: 6, backgroundColor: '#303030', }} />

     const RelevantResult = ({item}) => {
        return(
          <Row style={{ justifyContent: 'center', alignItems: 'center',  }}>
              <Image source={{uri: item?.capa}}  style={{objectFit: 'cover', borderRadius: 8, width: 120, height: 180, zIndex: 2,}} />
              <Column style={{ backgroundColor: "#303030", paddingHorizontal: 20, paddingLeft: 30, paddingVertical: 12, borderRadius: 12, marginVertical: 10, marginLeft: -10,}}>
                <Title style={{color: "#f6f6f6", fontSize: 24, width: 150, marginTop: 8,}}>{item?.name.slice(0,32)}</Title>
                <Label style={{fontSize: 18, marginTop: 4, marginBottom: 10,    }}>{item?.rate} • {item?.typename}</Label>
                <Row style={{ justifyContent: 'space-between', alignItems: 'center',  }}>
                    <Pressable>
                        <AntDesign name="pluscircleo" size={24} color="#d7d7d7" />
                    </Pressable>
                    <Pressable>
                        <AntDesign name="playcircleo" size={24} color="#d7d7d7" />
                    </Pressable>
                </Row>
              </Column>
          </Row>
      
        )
      }
      
      const Result = ({item}) => {
        return(
          <Column style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#262626', width: '48%', borderRadius: 6, margin: 4,  }}>
                <Image source={{uri: item?.capa}}  style={{objectFit: 'cover', marginTop: 24, borderRadius: 8, width: 120, height: 180, zIndex: 2,}} />
                <Title style={{color: "#f6f6f6", fontSize: 18, marginTop: 8,marginHorizontal: 20, }}>{item?.name.slice(0,28)}</Title>
                <Label style={{fontSize: 14, marginTop: 4, marginBottom: 14,    }}>{item?.rate} • {item?.typename}</Label>
          </Column>
      
        )
      }


      const SkeletonBody = () => { 
        return(
            <Column style={{ marginTop: 30, }}>
                <Skeleton width={210} height={42} />
                <Spacing height={12} />
                <Skeleton width={'100%'} height={160} />
                <Spacing height={40} />
                <Skeleton width={150} height={42} />
                <Spacing height={12} />

                <Row style={{ justifyContent: 'space-between', alignItems: 'center',  }}>
                    <Skeleton width={165} height={200} />
                    <Skeleton width={165} height={200} />
                </Row>
                <Row style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: 20,}}>
                    <Skeleton width={165} height={200} />
                    <Skeleton width={165} height={200} />
                </Row>
                <Spacing height={20} />
            </Column>
        )
      }