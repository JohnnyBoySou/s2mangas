import React, { useState, useEffect, } from 'react';
import { Column, Title, Label, Button , Row} from '@theme/global';
import requestWeekend from '@apiv1/manga/weekend';
import FlatComponent from '@components/flat/normal';
import { ArrowUp, ArrowUpRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export default function WeekendComponent() {
    const [data, setData] = useState([]);
    const [loading, setloading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        const fecthData = async () => {
            try {
                const res = await requestWeekend();
                setData(res.mangas);
            } catch (error) {
                console.log(error)
            } finally {
                setloading(false);
            }
        }
        fecthData();
    }, [])

    return (
        <Column>
            <Column style={{ marginHorizontal: 20, }}>
                <Row style={{ justifyContent: 'space-between', alignItems: 'center',  }}>
                    <Column>
                        <Title style={{ fontSize: 24, letterSpacing: -1, }}>Em alta</Title>
                        <Label style={{ fontSize: 16, letterSpacing: -1, }}>Mais lidos da semana</Label>
                    </Column>
                    <Button onPress={() => {navigation.navigate('Weekend')}}  style={{ width: 46, height: 46, borderRadius: 100, backgroundColor: '#303030', justifyContent: 'center', alignItems: 'center',  }}>
                        <ArrowUpRight size={28} color="#fff" />
                    </Button>
                </Row>
            </Column>
            <FlatComponent data={data} loading={loading} />
        </Column>
    );
}