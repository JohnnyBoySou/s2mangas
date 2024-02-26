import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Column, Row, Title, Label, } from '../../theme/global';

export default function PopularComponent (){
    //https://www.s2mangas.com/api/mangalist?page=1
    const [data, setData] = useState([]);
    useEffect(() => {
        axios.get('https://www.s2mangas.com/api/mangalist?page=1')
        .then(response => {
            console.log(response.data);
            setData(response.data);
        })
        .catch(error => {
            console.log(error);
        })
    }, [])

    const memoizedComponent = useMemo(() => {
        return (
            <Column>
                <Title>Mais lidos da semana</Title>
            </Column>
        );
    }, []);

    return memoizedComponent;
}


const Card = ({item}) => {
  return(
    <Column style={{backgroundColor: "#303030", borderRadius: 6, }}>
        <Title>{item.name}</Title>
        <Label>{item.desc}</Label>
    </Column>
  )
}
