import React, { useEffect, useState, memo } from 'react';
import { Image, Pressable, Dimensions } from 'react-native';
import { Column, Label, Row, Title } from '../../theme/global'
import { LinearGradient } from 'expo-linear-gradient';
import { AnimatePresence, MotiImage, MotiView, useAnimationState } from 'moti';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getPreferences } from '../../api/user/preferences';
const { height, width } = Dimensions.get('window');
import { useNavigation } from '@react-navigation/native';

function Header() {
    const [user, setUser] = useState();
    const navigation = useNavigation();
    const hello = new Date().getHours() < 12 ? 'Bom dia' : new Date().getHours() < 18 ? 'Boa tarde' : 'Boa noite';
    const [toggleIsOpen, setToggleIsOpen] = useState(false);
    const toggleAnimation = useAnimationState({
        close: {
            height: 0,
        },
        open: {
            height: 150,
        },
    });
    const handleOpenToggle = () => {
      toggleAnimation.transitionTo('open');
      setToggleIsOpen(true)
    }
    const handleCloseToggle = () => {
        toggleAnimation.transitionTo('close');
        setToggleIsOpen(false)
    }
    useEffect(() => {
        getPreferences().then(res => setUser(res))
    }, [])

    return(
        <Column>
            <MotiImage blurRadius={40} source={{ uri: user?.capa }} style={{ width: 0.99 * width, height: 500, opacity: 0.6, top: -100, left: -15, borderRadius: 32, right: 10, zIndex: -2, position: 'absolute', }} />
            <MotiView  from={{ opacity: 0, scale: 0.5, }} animate={{ opacity: 1, scale: 1, }} transition={{ type: 'timing', duration: 300, delay: 1000, }}>
                <Pressable onPress={() => {navigation.navigate('Account')}}  style={{ alignItems: 'center', justifyContent: 'center', marginTop: 80, }}>
                        <LinearGradient colors={['#ED274A', '#FF620A', '#E0CA3C']} style={{ width: 200, height: 200, position: 'absolute',  alignSelf: 'center', borderRadius: 100, }} />
                        <Image source={require('../../assets/imgs/blur1.png')} style={{ position: 'absolute', width: 400, height: 400, }} />
                        <MotiImage source={{ uri: user?.avatar }} style={{ width: 170, height: 170, alignSelf: 'center', borderRadius: 100, borderWidth: 6, borderColor: "#262626"}} 
                            resizeMode='cover'
                            from={{ opacity: 0, scale: 0.5, }} 
                            animate={{ opacity: 1, scale: 1, }} 
                            transition={{ type: 'timing', duration: 300, delay: 1200, }}
                        />
                </Pressable>
            </MotiView>

            <Title style={{ fontSize: 46, textAlign: 'center', fontFamily:'Font_Black', zIndex: 99, marginTop: 20,}}>{hello},</Title>
            <Title style={{ fontSize: 46, textAlign: 'center', fontFamily:'Font_Black', zIndex: 99, marginTop: -10, marginBottom: 50,}}>{user?.name}</Title>

            <Pressable  onPress={toggleIsOpen ? handleCloseToggle : handleOpenToggle} style={{width: 100, height: 14, backgroundColor: "#404040", borderRadius: 100, alignSelf: 'center', }}/>
            <AnimatePresence>
                <MotiView state={toggleAnimation} transition={{type: 'timing'}} style={{ width: '100%', height: 10, backgroundColor: '#262626', borderRadius: 12,  marginTop: 20, height: 0,}}>
                    <Column style={{padding: 12,}}>
                        <Title>Ações</Title>
                        <Row style={{marginTop: 12, justifyContent: 'space-between'}}>
                            <Pressable style={{flexDirection:'column', padding: 12, flexGrow: 1,  marginHorizontal: 6, borderRadius: 8, backgroundColor: "#404040", justifyContent: 'center', alignItems: 'center', }}>
                                <MaterialCommunityIcons name="shopping-outline" size={24} color="#fff" />
                                <Label>Lojinha</Label>
                            </Pressable>
                            <Pressable style={{flexDirection:'column', padding: 12,flexGrow: 1, borderRadius: 8, marginHorizontal: 6, backgroundColor: "#404040", justifyContent: 'center', alignItems: 'center', }}>
                                <MaterialCommunityIcons name="account-outline" size={24} color="#fff" />
                                <Label>Conta</Label>
                            </Pressable>
                            <Pressable style={{flexDirection:'column', padding: 12, flexGrow: 1, borderRadius: 8, marginHorizontal: 6, backgroundColor: "#404040", justifyContent: 'center', alignItems: 'center', }}>
                                <MaterialCommunityIcons name="cog-outline" size={24} color="#fff" />
                                <Label>Config</Label>
                            </Pressable>
                            <Pressable style={{flexDirection:'column', padding: 12, flexGrow: 1, marginHorizontal: 6, borderRadius: 8, backgroundColor: "#404040", justifyContent: 'center', alignItems: 'center', }}>
                                <MaterialCommunityIcons name="cards-outline" size={24} color="#fff" />
                                <Label>Cards</Label>
                            </Pressable>
                        </Row>
                    </Column>
                </MotiView>
            </AnimatePresence>
        </Column>
    )
}

export default memo(Header);