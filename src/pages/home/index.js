import React, { useState, useEffect, useRef, useContext} from 'react';
import { TouchableOpacity, Image,  } from 'react-native';
import {Column, Label, Title, Row, Main, Scroll, View} from '../../theme/global';
import { ThemeContext } from "styled-components/native";
import PopularComponent from '../../components/lists/popular';

export default function HomePage (){
    const { color, font } = useContext(ThemeContext);
    const hello = new Date().getHours() < 12  ? 'Bom dia' : new Date().getHours() < 18 ? 'Boa tarde'  : 'Boa noite';
    const user = {name: 'Khevi', avatar: 'https://i.pinimg.com/564x/4b/8e/60/4b8e60f3475cdf18cf6f916ef4220e82.jpg'}
    const [type, setType] = useState('Tudo');
    const [loading, setLoading] = useState(false);

    return(
        <Main >
            <Scroll style={{paddingHorizontal: 20,}}>
               
                <Column style={{position: 'relative', alignItems: 'center', justifyContent: 'center', marginTop: 80,}}>
                    <Image source={require('../../assets/imgs/blur1.png')}  style={{position: 'absolute', width: 400, height: 400, }}/>
                    <Image source={{uri: user.avatar}} style={{width: 150, height: 150, alignSelf: 'center', borderRadius: 100,}}/>
                </Column>

                <Title style={{fontSize: 46, marginVertical: 12, fontFamily: font.black,}}>{hello}, {"\n"}{user?.name}</Title>
                
                <Row>
                    <TouchableOpacity onPress={() => {setType('Tudo')}}  style={{paddingVertical: 10, paddingHorizontal: 24, backgroundColor: type === 'Tudo' ? color.light : color.off, borderRadius: 100,}}>
                        <Label style={{color: type === 'Tudo' ? color.off : color.title,  fontFamily: type === 'Tudo' ? font.bold : font.book,}}>Tudo</Label>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {setType('Mangas')}}  style={{paddingVertical: 10, marginHorizontal: 16, paddingHorizontal: 24, backgroundColor: type === 'Mangas' ? color.light : color.off, borderRadius: 100,}}>
                        <Label style={{color: type === 'Mangas' ? color.off : color.title,  fontFamily: type === 'Mangas' ? font.bold : font.book,}}>Mangás</Label>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {setType('Mangalist')}}  style={{paddingVertical: 10, paddingHorizontal: 24, backgroundColor: type === 'Mangalist' ? color.light : color.off, borderRadius: 100,}}>
                        <Label style={{color: type === 'Mangalist' ? color.off : color.title, fontFamily: type === 'Mangalist' ? font.bold : font.book,}}>Mangalist</Label>
                    </TouchableOpacity>
                </Row>


                <PopularComponent />
            </Scroll>
        </Main>
    )}