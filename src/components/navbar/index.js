import React, { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Column, Row, Title, Label, } from '../../theme/global';
import { TouchableOpacity } from 'react-native';
export default function NavBar() {
    return (
        <Row style={{marginTop: 40, alignItems: 'center', justifyContent: 'space-between',}}>
            <Column></Column>
            <TouchableOpacity style={{width: 46, height: 46,borderRadius: 100, backgroundColor: "#303030", justifyContent: 'center', alignItems: 'center', }}>
                <MaterialCommunityIcons name="bell-badge-outline" size={24} color="#fff" />
            </TouchableOpacity>
        </Row>
    )
}