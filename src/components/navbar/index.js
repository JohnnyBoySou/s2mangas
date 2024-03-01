import React, { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Column, Row } from '../../theme/global';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function NavBar() {
    const navigation = useNavigation();
    return (
        <Row style={{marginTop: 50, alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 12,}}>
            <Column></Column>
            <TouchableOpacity onPress={() => navigation.navigate('Novidades')}  style={{width: 52, height: 52,borderRadius: 100, backgroundColor: "#303030", justifyContent: 'center', alignItems: 'center', }}>
                <MaterialCommunityIcons name="bell-badge-outline" size={24} color="#fff" />
            </TouchableOpacity>
        </Row>
    )
}