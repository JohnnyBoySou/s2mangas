import React, { useState, useEffect } from 'react';
import { Main, Scroll, Title, Label, Row, Column, } from '../../theme/global';
import { Pressable, FlatList, Image, ScrollView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Skeleton } from 'moti/skeleton';
import { useNavigation } from '@react-navigation/native';
import { getPreferences } from '../../api/user/preferences';

export default function AccountPage({ navigation }) {
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

    useEffect(() => {
        const fetchData = () => {
            setLoading(true)
            getPreferences().then(res => {
                setComplete(res.complete)
                setProgress(res.progress)
                setLike(res.likes)
                setFollow(res.follow)
                setMarks(res.marks)
            })
            setLoading(false)
        }
        fetchData();
    }, [loading]);


    return (
        <Main>
            <Scroll>
                <Row style={{ marginTop: 50, justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20, }}>
                    <Pressable style={{ width: 42, height: 42, justifyContent: 'center', alignItems: 'center', }} onPress={() => navigation.goBack()} >
                        <AntDesign name="arrowleft" size={32} color="#fff" />
                    </Pressable>
                    <Title style={{ fontSize: 32, }}>Conta</Title>
                    <Pressable style={{ width: 42, height: 42, justifyContent: 'center', alignItems: 'center', }} onPress={() => navigation.goBack()} >
                    </Pressable>
                </Row>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>

                <Row style={{ marginHorizontal: 20, marginVertical: 20, justifyContent: 'center', alignItems: 'center', }}>
                    <Pressable onPress={() => { setType('Progress') }} style={{ paddingVertical: 10, paddingHorizontal: 18,  marginRight: 12, backgroundColor: type === 'Progress' ? "#fff" : "#303030", borderRadius: 40, }}>
                        <Title style={{ color: type === 'Progress' ? "#000" : "#d7d7d7", fontSize: 18, textAlign: 'center', }}>Em progresso</Title>
                    </Pressable>
                    <Pressable onPress={() => { setType('Like') }} style={{ paddingVertical: 10, marginRight: 12, paddingHorizontal: 18, backgroundColor: type === 'Like' ? "#fff" : "#303030", borderRadius: 40, }}>
                        <Title style={{ color: type === 'Like' ? "#000" : "#d7d7d7", fontSize: 18, textAlign: 'center', }}>Curtidos</Title>
                    </Pressable>
                    <Pressable onPress={() => { setType('Complete') }} style={{ paddingVertical: 10, marginRight: 12, paddingHorizontal: 18, backgroundColor: type === 'Complete' ? "#fff" : "#303030", borderRadius: 40, }}>
                        <Title style={{ color: type === 'Complete' ? "#000" : "#d7d7d7", fontSize: 18, textAlign: 'center', }}>Completos</Title>
                    </Pressable>
                    <Pressable onPress={() => { setType('Follow') }} style={{ paddingVertical: 10, marginRight: 12, paddingHorizontal: 18, backgroundColor: type === 'Follow' ? "#fff" : "#303030", borderRadius: 40, }}>
                        <Title style={{ color: type === 'Follow' ? "#000" : "#d7d7d7", fontSize: 18, textAlign: 'center', }}>Seguindo</Title>
                    </Pressable>
                </Row>
                </ScrollView>


                {loading && <Column style={{marginHorizontal: 20,}}>
                    <Row style={{ marginVertical: 30, alignSelf: 'center',}}>
                            <Column style={{ transform: [{ rotate: '-12deg', }],  width: 120, height: 180, borderRadius: 16, backgroundColor: "#262626"}} />
                            <Column style={{ transform: [{ rotate: '-12deg', }], borderWidth: 8, borderColor: "#171717", borderRadius: 16, marginHorizontal: -30,  width: 120, height: 180,  backgroundColor: "#262626" }}/>
                            <Column style={{ transform: [{ rotate: '-12deg', }], borderWidth: 8, borderColor: "#171717", borderRadius: 16,  width: 120, height: 180, backgroundColor: "#262626"}}/>
                    </Row>
                    <Title style={{textAlign: 'center',}}>Sem nada por aqui, por enquanto </Title>
                    <Label style={{textAlign: 'center',}}>Comece a ler os mangás,que eles {"\n"}irão aparecer por aqui. </Label>
                </Column>}

               
                {!loading && 
                <Column>

                {type === 'Progress' && 
                    <FlatList
                        data={progress}
                        keyExtractor={item => item.id}
                        horizontal={false}
                        numColumns={2}
                        style={{alignSelf: 'center'}}
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
                        renderItem={({ item }) => <CollectionItem item={item} />}    
                        />
                    }
                     {type === 'Complete' && 
                    <FlatList
                        data={complete}
                        keyExtractor={item => item.id}
                        horizontal={false}
                        numColumns={2}
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
                        style={{alignSelf: 'center'}}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => <CollectionItem item={item} />}    
                        />
                    }
                </Column>
                }
            </Scroll>

            <Pressable   style={{ zIndex: 99, position: 'absolute', bottom: 30, right: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: "#fff", width: 50, height: 50, borderRadius: 100, }}>
                <AntDesign name="arrowup" size={24} color="#000" />
            </Pressable>
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
