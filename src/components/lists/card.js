import React, { memo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Image, TouchableOpacity } from 'react-native';
import { Label, Title } from '../../theme/global';

const Card = memo(({ item }) => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity onPress={() => { navigation.navigate('MangaDetails', {id: item.id });}} style={{ backgroundColor: "#303030", borderRadius: 6, width: 162, marginRight: 16, padding: 12, paddingBottom: 20, }}>
            <Image source={{ uri: item.capa }} style={{ width: 102, height: 152, borderRadius: 6, alignSelf: 'center', marginBottom: 6, }} />
            <Title style={{ fontSize: 18, }}>{item?.name.slice(0,12)}</Title>
            <Label style={{ fontSize: 14, }}>{item?.score} • {item?.type}</Label>
        </TouchableOpacity>
    )
})

export default Card;