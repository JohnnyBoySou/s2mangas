import React, { useState, useEffect,  } from 'react';
import { Column, Title, Label, } from '@theme/global';
import requestLasted from '@api/manga/lasted';
import FlatComponent from '@components/flat/normal';

export default function LastedComponent() {
    const [data, setData] = useState([]);
    const [loading, setloading] = useState(true);
    useEffect(() => {
        const fecthData = async () => {
            try {
                const res = await requestLasted();
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
                <Title>Recém adicionados</Title>
                <Label>Acabaram de entrar no catálogo</Label>
            </Column>
            <FlatComponent data={data} loading={loading} />
        </Column>
        );
}
