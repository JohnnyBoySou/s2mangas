import React, { useState, useEffect, } from 'react';
import { Column, Title, Label, } from '@theme/global';
import requestWeekend from '@api/manga/weekend';
import FlatComponent from '@components/flat/normal';

export default function WeekendComponent() {
    const [data, setData] = useState([]);
    const [loading, setloading] = useState(true);

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
                <Title>Em alta</Title>
                <Label>Mais lidos da semana</Label>
            </Column>
            <FlatComponent data={data} loading={loading} />
        </Column>
    );
}