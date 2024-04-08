import React, { useState, useEffect,  } from 'react';
import { Column, Row, Title, Label, } from '../../theme/global';
import { FlatList,  } from 'react-native';
import { Skeleton } from 'moti/skeleton'
import requestLasted from '../../api/manga/lasted';

import Card from './card';

export default function LastedComponent() {
    const [data, setData] = useState([]);
    useEffect(() => {
        requestLasted().then((res) => {
            setData(res.mangas);
        })
    }, [])

   // const snapOffsets = Array(data.length).map((x, i) => i * (500 - 40));
        return (
            <Column style={{ marginHorizontal: 20, }}>
                {data?.length === 0  ? <Skeleton colorMode='dark' width={200} height={26}  radius={4} /> :  <Column>
                <Title>Recém adicionados</Title>
                <Label>Acabaram de entrar no catálogo</Label>
                </Column>}
                <FlatList
                    style={{ marginVertical: 16, marginHorizontal: -20, paddingLeft: 26,}}
                    data={data}
                    ListHeaderComponent={<Column style={{ width: 20, }} />}
                    ListEmptyComponent={<Loading/>}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <Card item={item} />}
                    horizontal
                    showsHorizontalScrollIndicator={false}
              //      snapToOffsets={snapOffsets}
                    snapToAlignment='start'
                    scrollEventThrottle={32}
                    decelerationRate='fast'
                />
            </Column>
        );
}


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

