import React, { useContext, useState } from 'react';
import { Main, Scroll, Column, Label, Title, Row, Button } from '@theme/global';
import { ThemeContext } from 'styled-components/native';
import { MotiImage } from 'moti';

import { getManga } from '../api_v2/getManga';
import { getChapters } from '../api_v2/getChapters';
import { getPages } from '../api_v2/getPages';


export default function TestScreen({ navigation, }){
    const { color } = useContext(ThemeContext);
    const [item, setitem] = useState();
   
    const handleManga = () => {
        getManga().then((data) => {
            console.log(data)
            setitem(data)
    })}
    const handleChapters = () => {
        getChapters().then((data) => {
            console.log(data)
        })
    }
    const handlePages = () => {
        getPages().then((data) => {
            console.log(data)
        })
    }

    return (
        <Main>
            <Button onPress={handleManga}  style={{ backgrounColor: color.primary }}>
                <Label>getManga</Label>
            </Button>
            <Button onPress={handleChapters}  style={{ backgrounColor: color.primary }}>
                <Label>getChapters</Label>
            </Button>
            <Button onPress={handlePages}  style={{ backgrounColor: color.primary }}>
                <Label>getPages</Label>
            </Button>
            <MotiImage source={{uri: item?.capa}} style={{ width: 100, height: 100 }} />
            
        </Main>
    )
}