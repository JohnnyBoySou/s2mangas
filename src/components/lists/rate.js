import React, { useState, useEffect, } from 'react';
import { Column, Title, Label, } from '@theme/global';
import requestRate from '@api/manga/rate';
import FlatComponent from '@components/flat/normal';

export default function RateComponent() {
    const [data, setData] = useState([]);
    const [loading, setloading] = useState(true);
    useEffect(() => {
        const fecthData = async () => {
            try {
                const res = await requestRate();
                setData(res.mangas);
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
            <Column style={{ marginHorizontal: 20, }}>
                <Title>Melhor nota</Title>
                <Label>Mais bem avaliados</Label>
            </Column>
            <FlatComponent data={data} loading={loading} />
        </Column>
    );
}
