import React, { useState, useEffect,  } from 'react';
import { Column, Row, Title, Label, } from '../../theme/global';
import { FlatList, Image, TouchableOpacity } from 'react-native';
import { Skeleton } from 'moti/skeleton'
import requestNews from '../../api/manga/news';
import { useNavigation } from '@react-navigation/native';

export default function NewsComponent() {
    const [data, setData] = useState([]);
    useEffect(() => {
        requestNews().then((res) => {
            setData(res?.mangas);
        })
    }, [])
    const snapOffsets = Array(data.length).map((x, i) => i * (300 - 40));

    return (
            <Column style={{ marginHorizontal: 20, }}>
                {data?.length === 0  ? <Skeleton colorMode='dark' width={200} height={26}  radius={4} /> :  <Column>
                <Title>Novos capítulos</Title>
                <Label>Última atualização à {data[0].release_date}</Label>
                </Column>}
                <FlatList
                    style={{ marginVertical: 16, marginHorizontal: -20, }}
                    data={data}
                    ListHeaderComponent={<Column style={{ width: 20, }} />}
                    ListEmptyComponent={<Loading/>}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <Card item={item} />}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    snapToOffsets={snapOffsets}
                    snapToAlignment='center'
                    scrollEventThrottle={16}
                    decelerationRate='fast'

                />
            </Column>
        );
}



const Card = React.memo(({ item }) => {
    
    const navigation = useNavigation();
    return (
        <TouchableOpacity onPress={() => { navigation.navigate('MangaDetails', {id: item.id });}} style={{marginRight: 16, flexDirection: 'row',}}>
            <Column style={{ backgroundColor: "#303030", borderRadius: 6,  padding: 12, justifyContent: 'center' }}>
                <Image source={{ uri: item.capa }} style={{ width: 86, height: 132, borderRadius: 6,}} />
            </Column>
            <Column style={{ backgroundColor: "#262626", borderTopRightRadius: 6, borderBottomRightRadius: 6, width: 182, padding: 12, alignSelf: 'center', }}>
                <Row style={{flexWrap: 'wrap'}}>
                    {item?.categories.map((chapter) => (
                    <Label key={chapter} style={{ fontSize: 12, }}>• {chapter} </Label>
                    ))}
                </Row>
                <Title style={{ fontSize: 18, marginVertical: 4, }}>{item?.name.slice(0,34)}</Title>
                <Row style={{flexWrap: 'wrap', marginBottom: 8,}}>
                    {item?.newchapters?.slice(0, 4)?.map((chapter) => (
                    <Label key={chapter} style={{ fontSize: 12, backgroundColor: "#525252", padding: 6, borderRadius: 4, marginRight: 4,}}>{chapter} </Label>
                    ))}
                </Row>
                <Label style={{ fontSize: 12, }}>Atualizado à {item?.release_date}</Label>
            </Column>
        </TouchableOpacity>
    )
});

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

