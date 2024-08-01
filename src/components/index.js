import React, { useState, useContext } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Column, Row, Title } from '@theme/global';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from 'styled-components/native';
import { Check } from 'lucide-react-native';
import { MotiView } from 'moti';

const Select = ({ status, name }) => {
    const { color } = useContext(ThemeContext);
    return (
        <Column style={{ width: 140,  borderWidth: 2, borderRadius: 10, borderColor: status ? color.primary : '#909090', backgroundColor: status ? color.primary + 50 : '#303030', paddingVertical: 12, paddingHorizontal: 12, }}>
            <Row style={{ justifyContent: 'space-between', alignItems: 'center', }}>
                <Title style={{ fontSize: 16, }}>{name}</Title>

                <Column style={{ width: 26, height: 26, borderRadius: 100, backgroundColor: status ? color.primary : '#90909020', borderWidth: 2, borderColor: status ? color.primary : '#909090', justifyContent: 'center', alignItems: 'center', }}>
                    {status &&
                        <MotiView from={{ opacity: 0, scale: 0, }} animate={{ opacity: 1, scale: 1, }} transition={{ type: 'timing', duration: 300 }}>
                            <Check size={18} color='#fff' />
                        </MotiView>}
                </Column>

            </Row>
        </Column>
    )
}

export default Select