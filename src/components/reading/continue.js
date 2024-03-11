import React from 'react';
import { Column, Row, Title, Label, } from '../../theme/global';
import { Image, Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

export default function ContinueReading({navigation}) {
  const porcentage = 40;
  return (
    <Column style={{ paddingHorizontal: 20, marginBottom: 20, }}>
      <Title style={{ fontSize: 24, }}>Continue lendo</Title>
      <Label style={{ marginBottom: 12, }}>Seu mangá está esperando</Label>

      <Row>
      <Column style={{ backgroundColor: '#ffc2cd', padding: 12, borderRadius: 12, height: 200, width: '40%', overflow: 'hidden' }}>
        <Title style={{ fontSize: 24, marginBottom: 12, fontFamily: 'Font_Book', color: "#000",}}>Jujutsu Kaisen</Title>
        <Image source={{ uri: 'https://i.pinimg.com/564x/f5/14/36/f51436953be995afc6cb6f35fec266d7.jpg' }} style={{ width: 90, height: 130, borderRadius: 4, alignSelf: 'center', position: 'absolute', zIndex: 2, bottom: -20, transform: [{ rotate: '-12deg' }] }} />
      </Column>
      <Column style={{ width: 12 }} />

      <Column style={{ flexGrow: 1, }}>
        <Column style={{ backgroundColor: '#B5FFBC90', borderRadius: 12, flexGrow: 1, height: 90,}}>
          <Label style={{color: "#000", position: 'absolute', top: 24, left: 12, zIndex: 9, fontSize: 32, letterSpacing: -1,}}>{porcentage + '%'}</Label>
          <Label style={{color: "#000", position: 'absolute', top: 52, left: 12, zIndex: 9, fontSize: 24, letterSpacing: -1,}}>completo</Label>
          <Column style={{ height: '100%', borderRadius: 10, width: porcentage + '%', backgroundColor: '#B5FFBC' }} />
        </Column>

        <Column style={{ height: 12 }} />
        <Pressable onPress={() => navigation.navigate('Continue')} style={{ backgroundColor: '#F0E3BF', padding: 12, borderRadius: 12, height: 80, flexGrow: 1, justifyContent: 'center', overflow: 'hidden'}}>
          <Title style={{color: "#000", letterSpacing: -1,}}>Bora {"\n"}Continuar</Title>
          <Image source={{ uri: 'https://i.pinimg.com/564x/c5/c9/5c/c5c95c2bb5fe6643208c3650bc32abd6.jpg' }} style={{ width: 60, height: 80, borderRadius: 4, right: 20, position: 'absolute', bottom: 0, transform: [{ rotate: '-25deg' }] }} />
          <AntDesign name="arrowright" size={24} color="#000" />
        </Pressable>
      </Column>
    </Row>

    </Column>
  )
}