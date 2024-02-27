import React, { useState, useEffect,  } from 'react';
import { Column, Row, Title, Label, } from '../../theme/global';
import { FlatList, Image,  } from 'react-native';
import { Skeleton } from 'moti/skeleton'
import requestRate from '../../api/manga/rate';


export default function RateComponent() {
    const [data, setData] = useState([]);
    useEffect(() => {
        requestRate().then((res) => {
            setData(res.mangas);
        })
    }, [])

        return (
            <Column style={{ marginHorizontal: 20, }}>
                {data.length === 0  ? <Skeleton colorMode='dark' width={200} height={26}  radius={4} /> :  <Column>
                <Title>Melhores notas</Title>
                <Label>Os mais bem avaliados</Label>
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
                />
            </Column>
        );
}


const Card = React.memo(({ item }) => {
    return (
        <Column style={{ backgroundColor: "#303030", borderRadius: 6, width: 162, marginRight: 16, padding: 12, }}>
            <Image source={{ uri: item.capa }} style={{ width: 102, height: 152, borderRadius: 6, alignSelf: 'center', marginBottom: 6, }} />
            <Title style={{ fontSize: 18, }}>{item?.name.slice(0,26)}</Title>
            <Label style={{ fontSize: 14, }}>{item?.score} • {item?.type}</Label>
        </Column>
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

