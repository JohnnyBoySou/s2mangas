import React, { useEffect, useState, memo, useContext } from 'react';
import {  Pressable, Dimensions } from 'react-native';
import { Column, Label, Row, Title, Spacer } from '../../theme/global'
import { AnimatePresence, MotiImage, MotiView, MotiText, useAnimationState } from 'moti';
import { Feather, FontAwesome5, Fontisto, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { getPreferences } from '../../api/user/preferences';
const { height, width } = Dimensions.get('window');
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from 'styled-components/native';

function Header({top}) {
    const {color, font } = useContext(ThemeContext);
    const [user, setUser] = useState();
    const navigation = useNavigation();
    const hello = new Date().getHours() < 12 ? 'Bom dia' : new Date().getHours() < 18 ? 'Boa tarde' : 'Boa noite';
    const [toggleIsOpen, setToggleIsOpen] = useState(false);
    const left = width / 2 - 100;
    const toggleAnimation = useAnimationState({
        close: {
            height: 170,
        },
        open: {
            height: 520,
        },
    });
    const toggleImage = useAnimationState({
        close: {
            height: 64,
            width: 64,
            translateY: -10,
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
            translateX: -34,
            translateY: -70,
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
      /*  toggleAnimation.transitionTo('close')
        toggleImage.transitionTo('close')
        toggleText.transitionTo('close')
        toggleTitle.transitionTo('close')
        setToggleIsOpen(false)
                */
    }, [])  

    return(
        <Column>
            <MotiImage blurRadius={40} source={{ uri: user?.capa }} style={{ width: width, opacity: 0.6, top: -60, height: 180, left: -20, borderRadius: 32, right: 10, zIndex: -2, position: 'absolute', }} />

            <Row style={{ justifyContent: 'space-between', alignItems: 'center',  marginTop: 40,}}>

                <Row style={{}}>
                    <Pressable onPress={() => navigation.navigate('Account')} >
                            <MotiImage state={toggleImage} source={{ uri: user?.avatar }} style={{ width: 64, height: 64, borderRadius: 24,}} resizeMode='cover' transition={{ type: 'timing', duration: 300,  }}/>
                    </Pressable>
                    <MotiText transition={{ type: 'timing', duration: 300,  }} style={{ fontSize: 24, textAlign: 'left', letterSpacing: -1, marginTop: 10, fontFamily: font.book, color: "#fff", marginLeft: 20, }}>{hello},{"\n"}{user?.name}</MotiText>
                </Row>
                <Row style={{ }}>
                    <Pressable onPress={() => navigation.navigate('Novidades')}  style={{width: 46, height: 46,  borderRadius: 100,zIndex: 99, justifyContent: 'center', alignItems: 'center',   }}>
                        <Feather name="bell" size={24} color="#fff" />
                    </Pressable>
                    <Pressable onPress={() => navigation.navigate('Search')}  style={{width: 46,  height: 46, borderRadius: 100,  zIndex: 99, justifyContent: 'center', alignItems: 'center',   }}>
                        <Feather name="search" size={24} color="#fff" />
                    </Pressable>
                </Row>
            </Row>
            <Row style={{justifyContent: 'space-between', alignItems: 'center', flexGrow: 1, marginBottom:10, marginTop: 35, zIndex: 999,}}>
                                    <Pressable onPress={() => {navigation.navigate('Account',{type: 'Like'})}} style={{ backgroundColor: "#262626", borderRadius: 8,  width: '49%', flexDirection: 'row',  alignItems: 'center', }}>
                                        <MotiImage source={require('../../assets/imgs/heart.png')} style={{ width:64, height: 64, borderTopLeftRadius: 8, borderBottomLeftRadius: 8, backgroundColor: "#404040" }}/>
                                        <Title style={{ fontFamily: 'Font_Medium', fontSize: 16, marginLeft: 8, }}>Mangás {'\n'}Curtidos</Title>
                                    </Pressable>
                                    <Spacer width={8} />
                                    <Pressable onPress={() => {navigation.navigate('Collections')}}  style={{ backgroundColor: "#262626", borderRadius: 8, width: '49%', flexDirection: 'row',  alignItems: 'center', }}>
                                        <MotiImage source={require('../../assets/imgs/collection.png')} style={{ width:64, height: 64, borderTopLeftRadius: 8, borderBottomLeftRadius: 8, backgroundColor: "#404040" }}/>
                                        <Title style={{ fontFamily: 'Font_Medium', fontSize: 16, marginLeft: 8, }}>Suas {'\n'}Coleções</Title>
                                    </Pressable>
                        </Row>

        </Column>
    )
}

export default memo(Header);


/**
 * <AnimatePresence>
            {toggleIsOpen && 
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
                }
                </AnimatePresence>
 */

/**<Row style={{justifyContent: 'space-between', alignItems: 'center', flexGrow: 1, marginTop: 8,}}>
                    <Pressable style={{ backgroundColor: "#262626", borderRadius: 8,  width: '49%', flexDirection: 'row',  alignItems: 'center', }}>
                        <MotiImage style={{ width:64, height: 64, borderTopLeftRadius: 8, borderBottomLeftRadius: 8, backgroundColor: "#404040" }}/>
                        <Title style={{ fontFamily: 'Font_Medium', fontSize: 16, marginLeft: 8, }}>Mangás Curtidos</Title>
                    </Pressable>
                    <Spacer width={8} />
                    <Pressable style={{ backgroundColor: "#262626", borderRadius: 8,  width: '49%', flexDirection: 'row',  alignItems: 'center', }}>
                        <MotiImage style={{ width:64, height: 64, borderTopLeftRadius: 8, borderBottomLeftRadius: 8, backgroundColor: "#404040" }}/>
                        <Title style={{ fontFamily: 'Font_Medium', fontSize: 16, marginLeft: 8, }}>Mangás Curtidos</Title>
                    </Pressable>
                </Row>
 * 
 *   <Pressable  onPress={toggleIsOpen ? handleCloseToggle : handleOpenToggle} style={{width: 42, height: 42, marginTop: -90,  zIndex: 99, backgroundColor: "#262626", borderRadius: 100, alignSelf: 'center', zIndex: 999, justifyContent: 'center', alignItems: 'center',  }}>
                <MaterialCommunityIcons name={toggleIsOpen ? "chevron-up" : "chevron-down"} size={36} color="#fff"/>
            </Pressable>
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