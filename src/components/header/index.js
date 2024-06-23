import React, { useEffect, useState, memo, useContext } from 'react';
import { Pressable, Dimensions } from 'react-native';
import { Column, Row, Title, Spacer } from '../../theme/global'
import { MotiImage, MotiText, MotiView } from 'moti';
import { Feather } from '@expo/vector-icons';
import { getPreferences } from '../../api/user/preferences';
const { height, width } = Dimensions.get('window');
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from 'styled-components/native';
import TopSheet from '../topsheet';

function Header({ top }) {
    const { color, font } = useContext(ThemeContext);
    const [user, setUser] = useState();
    const navigation = useNavigation();
    const hello = new Date().getHours() < 12 ? 'Bom dia' : new Date().getHours() < 18 ? 'Boa tarde' : 'Boa noite';

    useEffect(() => {
        getPreferences().then(res => setUser(res))
    }, [])

    return (
        <TopSheet
            backgroundItem={
                <MotiImage blurRadius={40} source={{ uri: user?.capa }} style={{ width: width, opacity: 0.6, height: '100%', borderBottomLeftRadius: 32, borderBottomRightRadius: 32, zIndex: -2, position: 'absolute', }} />
            }
            min={
                <Column>
                    <Row style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: 40, }}>
                        <Row style={{}}>
                            <Pressable onPress={() => navigation.navigate('Account')} >
                                <MotiImage source={{ uri: user?.avatar }} style={{ width: 64, height: 64, borderRadius: 24, }} resizeMode='cover' transition={{ type: 'timing', duration: 300, }} />
                            </Pressable>
                            <MotiText transition={{ type: 'timing', duration: 300, }} style={{ fontSize: 24, textAlign: 'left', letterSpacing: -1, marginTop: 10, fontFamily: font.book, color: "#fff", marginLeft: 20, }}>{hello},{"\n"}{user?.name}</MotiText>
                        </Row>
                        <Row style={{}}>
                            <Pressable onPress={() => navigation.navigate('Novidades')} style={{ width: 46, height: 46, borderRadius: 100, zIndex: 99, justifyContent: 'center', alignItems: 'center', }}>
                                <Feather name="bell" size={24} color="#fff" />
                            </Pressable>
                            <Pressable onPress={() => navigation.navigate('Search')} style={{ width: 46, height: 46, borderRadius: 100, zIndex: 99, justifyContent: 'center', alignItems: 'center', }}>
                                <Feather name="search" size={24} color="#fff" />
                            </Pressable>
                        </Row>
                    </Row>
                </Column>
            }
            normal={<Column from={{ opacity: 0, }} animate={{ opacity: 1, }} exit={{ opacity: 0, }}>
                <Row style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: 40, }}>
                    <Row style={{}}>
                        <Pressable onPress={() => navigation.navigate('Account')} >
                            <MotiImage source={{ uri: user?.avatar }} style={{ width: 64, height: 64, borderRadius: 24, }} resizeMode='cover' transition={{ type: 'timing', duration: 300, }} />
                        </Pressable>
                        <MotiText transition={{ type: 'timing', duration: 300, }} style={{ fontSize: 24, textAlign: 'left', letterSpacing: -1, marginTop: 10, fontFamily: font.book, color: "#fff", marginLeft: 20, }}>{hello},{"\n"}{user?.name}</MotiText>
                    </Row>
                        <Row style={{}}>
                            <Pressable onPress={() => navigation.navigate('Novidades')} style={{ width: 46, height: 46, borderRadius: 100, zIndex: 99, justifyContent: 'center', alignItems: 'center', }}>
                                <Feather name="bell" size={24} color="#fff" />
                            </Pressable>
                            <Pressable onPress={() => navigation.navigate('Search')} style={{ width: 46, height: 46, borderRadius: 100, zIndex: 99, justifyContent: 'center', alignItems: 'center', }}>
                                <Feather name="search" size={24} color="#fff" />
                            </Pressable>
                        </Row> 
                </Row>
                <MotiView from={{ opacity: 0, translateY: 30, }} animate={{ opacity: 1, translateY: 0, }} exit={{ opacity: 0,  }}>
                    <Row style={{ justifyContent: 'space-between', alignItems: 'center', flexGrow: 1, marginBottom: 10, marginTop: 20, zIndex: 999, }}>
                        <Pressable onPress={() => { navigation.navigate('Account', { type: 'Like' }) }} style={{ backgroundColor: "#262626", borderRadius: 8, width: '49%', flexDirection: 'row', alignItems: 'center', }}>
                            <MotiImage source={require('../../assets/imgs/heart.png')} style={{ width: 64, height: 64, borderTopLeftRadius: 8, borderBottomLeftRadius: 8, backgroundColor: "#404040" }} />
                            <Title style={{ fontFamily: 'Font_Medium', fontSize: 16, marginLeft: 12, }}>Mangás {'\n'}Curtidos</Title>
                        </Pressable>
                        <Spacer width={8} />
                        <Pressable onPress={() => { navigation.navigate('Collections') }} style={{ backgroundColor: "#262626", borderRadius: 8, width: '49%', flexDirection: 'row', alignItems: 'center', }}>
                            <MotiImage source={require('../../assets/imgs/collection.png')} style={{ width: 64, height: 64, borderTopLeftRadius: 8, borderBottomLeftRadius: 8, backgroundColor: "#404040" }} />
                            <Title style={{ fontFamily: 'Font_Medium', fontSize: 16, marginLeft: 12, }}>Suas {'\n'}Coleções</Title>
                        </Pressable>
                    </Row>
                </MotiView>
            </Column>}
            max={<Column style={{  justifyContent: 'center', alignItems: 'center', marginTop: 60, }}>
                <Title>Próxima atualização</Title>
            </Column>}
        />
    )
}

export default memo(Header);

