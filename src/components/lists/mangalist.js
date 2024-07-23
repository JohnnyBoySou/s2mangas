import React, { useState, useEffect,  } from 'react';
import axios from 'axios';
import { Column, Row, Title, Label, } from '../../theme/global';
import { FlatList, Image, TouchableOpacity  } from 'react-native';
import { Skeleton } from 'moti/skeleton'
import { useNavigation } from '@react-navigation/native';


export function MangalistWeekendComponent() {
    const [data, setData] = useState([]);
    useEffect(() => {
        const fecthData = async () => {
            try {
                const res = await axios.get('https://www.s2mangas.com/api/mangalist?page=1&type=weekend')
                console.log(res.data)
                setData(res.data)
            } catch (error) {
                console.log(error)                
            }
        }
        fecthData()
    }, [])
        return (
            <Column style={{ marginHorizontal: 20, }}>
                {data.length === 0  ? <Skeleton colorMode='dark' width={200} height={26}  radius={4} /> : 
                <Column>
                    <Title>Galera está curtindo</Title>
                    <Label>só se fala disso lá na obra</Label>
                </Column>
                }
                <FlatList
                    style={{ marginVertical: 16, marginHorizontal: -20, }}
                    data={data}
                    ListHeaderComponent={<Column style={{ width: 20, }} />}
                    ListEmptyComponent={<Loading/>}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <Card item={item} />}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
            </Column>
        );
}



export function MangalistLastedComponent() {
    const [data, setData] = useState([]);
    useEffect(() => {
        const fecthData = async () => {
            try {
                const res = await axios.get('https://www.s2mangas.com/api/mangalist?page=1&type=lasted')
                console.log(res.data)
                setData(res.data)
            } catch (error) {
                console.log(error)                
            }
        }
        fecthData()
    }, [])

        return (
            <Column style={{ marginHorizontal: 20, }}>
                {data.length === 0  ? <Skeleton colorMode='dark' width={200} height={26}  radius={4} /> : 
                <Column>
                    <Title>Saiu do forno</Title>
                    <Label>foram adicionados agora a pouco</Label>
                </Column>
                }
                <FlatList
                    style={{ marginVertical: 16, marginHorizontal: -20, }}
                    data={data}
                    ListHeaderComponent={<Column style={{ width: 20, }} />}
                    ListEmptyComponent={<Loading/>}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <Card item={item} />}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
            </Column>
        );
}



export  function MangalistRateComponent() {
    const [data, setData] = useState([]);
    useEffect(() => {
        const fecthData = async () => {
            try {
                const res = await axios.get('https://www.s2mangas.com/api/mangalist?page=1&type=rate')
                console.log(res.data)
                setData(res.data)
            } catch (error) {
                console.log(error)                
            }
        }
        fecthData()
    }, [])

        return (
            <Column style={{ marginHorizontal: 20, }}>
                {data.length === 0  ? <Skeleton colorMode='dark' width={200} height={26}  radius={4} /> : 
                <Column>
                    <Title>Escolhido a dedo</Title>
                    <Label>ei isso aqui deu trabalho viu</Label>
                </Column>
                }
                <FlatList
                    style={{ marginVertical: 16, marginHorizontal: -20, }}
                    data={data}
                    ListHeaderComponent={<Column style={{ width: 20, }} />}
                    ListEmptyComponent={<Loading/>}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <Card item={item} />}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
            </Column>
        );
}



const Card = React.memo(({ item }) => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity onPress={() => { navigation.navigate('MangalistDetails', {
              item: item,
            });
          }} style={{ backgroundColor: "#303030", borderRadius: 6, width: 204, marginRight: 16, padding: 12, paddingBottom: 20, }}>
            <Image source={{ uri: item.capa }} style={{ width: 152, height: 152, borderRadius: 6, alignSelf: 'center', marginBottom: 6, }} />
            <Title style={{ fontSize: 18, }}>{item.name.slice(0, 22)}</Title>
            <Label style={{ fontSize: 14, }}>{item.desc.slice(0, 45)}...</Label>
        </TouchableOpacity>
    )
})

const Loading = () => {
    return (
        <Row>
            <Column style={{ backgroundColor: "#303030", borderRadius: 6, width: 204, marginRight: 16, padding: 12, paddingBottom: 20, alignItems: 'center', }}>
                <Skeleton colorMode='dark' width={152} height={152} style={{alignSelf:'center',}} radius={6} />
                <Spacer height={10}/>
                <Skeleton colorMode='dark' width={160} height={26}  radius={4} />
                <Spacer height={6}/>
                <Skeleton colorMode='dark' width={120} height={16}  radius={4} />
            </Column>
            <Column style={{ backgroundColor: "#303030", borderRadius: 6, width: 204, marginRight: 16, padding: 12, paddingBottom: 20, alignItems: 'center', }}>
                <Skeleton colorMode='dark' width={152} height={152} style={{alignSelf:'center',}} radius={6} />
                <Spacer height={10}/>
                <Skeleton colorMode='dark' width={160} height={26}  radius={4} />
                <Spacer height={6}/>
                <Skeleton colorMode='dark' width={120} height={16}  radius={4} />
            </Column>
            <Column style={{ backgroundColor: "#303030", borderRadius: 6, width: 204, marginRight: 16, padding: 12, paddingBottom: 20, alignItems: 'center', }}>
                <Skeleton colorMode='dark' width={152} height={152} style={{alignSelf:'center',}} radius={6} />
                <Spacer height={10}/>
                <Skeleton colorMode='dark' width={160} height={26}  radius={4} />
                <Spacer height={6}/>
                <Skeleton colorMode='dark' width={120} height={16}  radius={4} />
            </Column>
        </Row>
    )
}
const Spacer = ({ height = 16 }) => <Column style={{ height }} />



//import { FontAwesome5 } from '@expo/vector-icons';
/**
 * <TouchableOpacity style={{backgroundColor: item.color, width: 42, height: 42, borderRadius: 100, alignSelf: 'flex-end', justifyContent: 'center', alignItems: 'center', }}>
            <FontAwesome5 name="play" size={16} color="#fff" />
        </TouchableOpacity>
 */