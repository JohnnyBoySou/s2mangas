import React, { useState, useEffect, } from 'react';
import { Column, Title, Label, Row, Button, } from '@theme/global';
import requestRate from '@apiv1/manga/rate';
import FlatComponent from '@components/flat/normal';
import { ArrowUpRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export default function RateComponent() {
    const [data, setData] = useState([]);
    const [loading, setloading] = useState(true);
    const navigation = useNavigation()
    useEffect(() => {
        const fecthData = async () => {
            try {
                const res = await requestRate();
                setData(res.mangas.reverse());
            } catch (error) {
                console.log(error)
            }
            finally {
                setloading(false);
            }
        }
        fecthData();
    }, [])

    return (
        <Column>
            <Row style={{ justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20, }}>
                <Column>
                    <Title style={{ fontSize: 24, letterSpacing: -1, }}>Melhor nota</Title>
                    <Label style={{ fontSize: 16, letterSpacing: -1, }}>Mais bem avaliados</Label>
                </Column>
                <Button onPress={() => { navigation.navigate('Section', { type: 'rate'}) }} style={{ width: 46, height: 46, borderRadius: 100, backgroundColor: '#303030', justifyContent: 'center', alignItems: 'center', }}>
                    <ArrowUpRight size={28} color="#fff" />
                </Button>
            </Row>
            <FlatComponent data={data} loading={loading} />
        </Column>
    );
}
