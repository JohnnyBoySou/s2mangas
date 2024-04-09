import React, { useState, useEffect } from 'react';
import { Column, Row, Main, Scroll, Title, Label, } from '../../theme/global';

export default function CategoryPage({navigation, route}) {
    const { category } = route.params;
    const [data, setData] = useState([]);
    console.log(category)
    return (
        <Main>
            <Scroll>
                <Column style={{ padding: 20, }}>
                    <Title style={{ fontSize: 32, }}>{category?.name}</Title>
                </Column>
            </Scroll>
        </Main>
    )
}