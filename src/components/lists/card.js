import React, { memo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Image, Pressable } from 'react-native';
import { Label, Title, Column } from '@theme/global';
import { LinearGradient } from 'expo-linear-gradient';

const Card = memo(({ item }) => {
    const navigation = useNavigation();
    return (
        <Pressable onPress={() => { navigation.navigate('MangaDetails', {id: item.id });}} style={{ backgroundColor: "#303030", borderRadius: 6, width: 162, marginRight: 16, justifyContent: 'center', }}>
            <Image source={{ uri: item.capa }} style={{ width: 102, height: 152, borderRadius: 6, alignSelf: 'center', marginBottom: 0, marginTop: 15, zIndex: 99,}} />
            <Image blurRadius={80} source={{ uri: item.capa }} style={{ width: 162, height: 182, borderTopLeftRadius: 6, borderTopRightRadius: 6, alignSelf: 'center',  position: 'absolute', top: 0, }} />
            <LinearGradient colors={['transparent', '#303030']} style={{ flexGrow: 1, height: 60,  marginTop: -35,}} />
            <Column style={{ padding: 12, }}>
                <Title style={{ fontSize: 16, marginTop: -15,}}>{item?.name.slice(0,40)}</Title>
                <Label style={{ fontSize: 12, }}>{item?.score} • {item?.type}</Label>
            </Column>
        </Pressable>
    )
})


export default Card;