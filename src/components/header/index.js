import React, { useEffect, useState, memo, useContext } from 'react';
import { Image, Pressable, Dimensions } from 'react-native';
import { Column, Label, Row, Title } from '../../theme/global'
import { LinearGradient } from 'expo-linear-gradient';
import { AnimatePresence, MotiImage, MotiView, MotiText, useAnimationState } from 'moti';
import { Feather, FontAwesome5, Fontisto, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { getPreferences } from '../../api/user/preferences';
const { height, width } = Dimensions.get('window');
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from 'styled-components/native';

function Header() {
    const {color, font } = useContext(ThemeContext);
    const [user, setUser] = useState();
    const navigation = useNavigation();
    const hello = new Date().getHours() < 12 ? 'Bom dia' : new Date().getHours() < 18 ? 'Boa tarde' : 'Boa noite';
    const [toggleIsOpen, setToggleIsOpen] = useState(false);
    const left = width / 2 - 100;
    const toggleAnimation = useAnimationState({
        close: {
            height: 160,
        },
        open: {
            height: 520,
        },
    });
    const toggleImage = useAnimationState({
        close: {
            height: 64,
            width: 64,
            translateY: -20,
            translateX: 0,
        },
        open: {
            height: 160,
            width: 160,
            translateY: 0,
            translateX: left,
        },
    });
    const toggleText = useAnimationState({
        close: {
            fontSize: 24,
            translateY: -140,
        },
        open: {
            translateY: 30,
        },
    });
    const toggleTitle = useAnimationState({
        close: {
            fontSize: 28,
            translateX: -46,
            translateY: -80,
        },
        open: {
            fontSize: 46,
            translateX: 0,
            translateY: 10,
        
        },
    });
    const handleOpenToggle = () => {
      toggleAnimation.transitionTo('open');
      toggleImage.transitionTo('open');
      toggleText.transitionTo('open');
      toggleTitle.transitionTo('open');
      setToggleIsOpen(true)
    }
    const handleCloseToggle = () => {
        toggleAnimation.transitionTo('close');
        toggleImage.transitionTo('close');
        toggleText.transitionTo('close');
        toggleTitle.transitionTo('close');
        setToggleIsOpen(false)
    }
    useEffect(() => {
        getPreferences().then(res => setUser(res))
        toggleAnimation.transitionTo('open')
        toggleImage.transitionTo('open')
        toggleText.transitionTo('open')
        toggleTitle.transitionTo('open')
        setToggleIsOpen(true)
    }, [])  

    return(
        <Column>
            <Row style={{ alignSelf: 'flex-end' }}>
                <Pressable onPress={() => navigation.navigate('Novidades')}  style={{width: 46, height: 46, top: 40, borderRadius: 100,zIndex: 99, justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-end', }}>
                    <MaterialCommunityIcons name="bell-badge-outline" size={24} color="#fff" />
                </Pressable>
                <Pressable onPress={() => navigation.navigate('Search')}  style={{width: 46,  height: 46, top: 40, borderRadius: 100,  zIndex: 99, justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-end', }}>
                    <Feather name="search" size={24} color="#fff" />
                </Pressable>
            </Row>
            <MotiView state={toggleAnimation} transition={{type: 'timing', duration: 300,}}>
                <MotiImage blurRadius={40} source={{ uri: user?.capa }} style={{ width: 0.99 * width, height: '100%', opacity: 0.6, top: -100, left: -15, borderRadius: 32, right: 10, zIndex: -2, position: 'absolute', }} />
                <Pressable onPress={() => navigation.navigate('Account')} >
                    <MotiImage state={toggleImage} source={{ uri: user?.avatar }} style={{ width: 170, height: 170, borderRadius: 100,}} resizeMode='cover' transition={{ type: 'timing', duration: 300,  }}/>
                </Pressable>
                <MotiText state={toggleTitle} transition={{ type: 'timing', duration: 300,  }} style={{ fontSize: 46, textAlign: toggleIsOpen ? 'center' : 'left', letterSpacing: -2, fontFamily: toggleIsOpen ? font.bold : font.book, color: "#fff", alignSelf: 'center',}}>{hello},{"\n"}{user?.name}</MotiText>
            
            {toggleIsOpen && 
                <AnimatePresence>
                    <MotiView from={{translateY: -20, opacity: 0,}} animate={{ translateY: 0, opacity:1,}} transition={{type: 'timing', duration: 300,}}>
                        <Row style={{ justifyContent: 'space-between', alignItems: 'center',  marginTop: 30,}}>
                            <Pressable style={{ flexDirection: 'row', width: '46%', alignItems: 'center', backgroundColor: "#202020", borderRadius: 6, }}>
                                <Column style={{ width: 50, height: 50, backgroundColor: '#303030', justifyContent: 'center', alignItems: 'center',  borderRadius: 6, }}>
                                    <MaterialCommunityIcons name="cog-outline" size={24} color="#fff" />
                                </Column>
                                <Label style={{ fontSize: 20, marginHorizontal: 10, letterSpacing: -1, }}>Shop</Label>
                            </Pressable>
                            <Pressable style={{ flexDirection: 'row', width: '46%', alignItems: 'center', backgroundColor: "#202020", borderRadius: 6, }}>
                                <Column style={{ width: 50, height: 50, backgroundColor: '#303030', justifyContent: 'center', alignItems: 'center',  borderRadius: 6, }}>
                                    <MaterialCommunityIcons name="cog-outline" size={24} color="#fff" />
                                </Column>
                                <Label style={{ fontSize: 20, marginHorizontal: 10, letterSpacing: -1, }}>Cards</Label>
                            </Pressable>
                        </Row>
                        <Row style={{ justifyContent: 'space-between', alignItems: 'center',  marginTop: 10,}}>
                            <Pressable style={{ flexDirection: 'row',  alignItems: 'center', backgroundColor: "#202020", borderRadius: 6,  width: '46%', }}>
                                <Column style={{ width: 50, height: 50, backgroundColor: '#303030', justifyContent: 'center', alignItems: 'center',  borderRadius: 6, }}>
                                    <MaterialCommunityIcons name="cog-outline" size={24} color="#fff" />
                                </Column>
                                <Label style={{ fontSize: 20, marginHorizontal: 10, letterSpacing: -1, }}>Progresso</Label>
                            </Pressable>
                            <Pressable style={{ flexDirection: 'row',  width: '46%',alignItems: 'center', backgroundColor: "#202020", borderRadius: 6, }}>
                                <Column style={{ width: 50, height: 50, backgroundColor: '#303030', justifyContent: 'center', alignItems: 'center',  borderRadius: 6, }}>
                                    <MaterialCommunityIcons name="cog-outline" size={24} color="#fff" />
                                </Column>
                                <Label style={{ fontSize: 20, marginHorizontal: 10, letterSpacing: -1, }}>Ajustes</Label>
                            </Pressable>
                        </Row>

                    </MotiView>
                </AnimatePresence>
                }
            
            
            </MotiView>


            <Pressable  onPress={toggleIsOpen ? handleCloseToggle : handleOpenToggle} style={{width: 42, height: 42, marginTop: -90,  zIndex: 99, backgroundColor: "#262626", borderRadius: 100, alignSelf: 'center', zIndex: 999, justifyContent: 'center', alignItems: 'center',  }}>
                <MaterialCommunityIcons name={toggleIsOpen ? "chevron-up" : "chevron-down"} size={36} color="#fff"/>
            </Pressable>
        </Column>
    )
}

export default memo(Header);

/**
 * 
                        <LinearGradient colors={['#ED274A', '#FF620A', '#E0CA3C']} style={{ width: 200, height: 200, position: 'absolute',  alignSelf: 'center', borderRadius: 100, }} />
            
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
 */