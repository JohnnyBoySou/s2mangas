import React, { useContext } from 'react';
import { Column, Button, } from '@theme/global';
import { Dimensions, Image, } from 'react-native';
//icons
import { ArrowLeft } from 'lucide-react-native';

export default function MangaCapa({ route, navigation }) {
    const image = route.params?.img
    return(
        <Column style={{ flex: 1, backgroundColor: '#171717',}}>
            <Button onPress={() => navigation.goBack()} style={{ backgroundColor: '#fff', zIndex: 99, top: 20, position: 'absolute',  marginHorizontal: 20, width: 46, height: 46, borderRadius: 100, justifyContent: 'center', alignItems: 'center',  }}>
                <ArrowLeft color="#000" size={24} />
            </Button>
        <Image source={{uri: image}} style={{width: '100%', height: '100%', objectFit: 'contain', }}/>
        </Column>
    )}