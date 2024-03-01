import React, { useState, useContext, useEffect } from 'react'
import { Image, Pressable, } from 'react-native'
import { ThemeContext } from 'styled-components/native'
import { Column, Title, Main, Row, Label, } from '../../theme/global';
import { Svg, Path, Defs, Stop, LinearGradient } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { FadeInRight, FadeInLeft, FadeInDown, FadeOutLeft } from 'react-native-reanimated';

export default function Onboarding({ navigation, route, }) {
    const { color, font } = useContext(ThemeContext)
    const [current, setCurrent] = useState(0);
    const [first, setFirst] = useState(true);

    useEffect(() => {
    }, [])

    const Screen4 = ({ }) => {
        return (
            <Animated.View entering={FadeInRight.delay(400)} exiting={FadeOutLeft}>
                <Column style={{ alignSelf: 'center', width: '100%', }}>
                    <Animated.View entering={FadeInDown.delay(150)}>
                        <Image source={require('./img4.png')} style={{
                            width: 200, height: 256, position: 'absolute', zIndex: 2, borderRadius: 16,
                            alignSelf: 'center', top: 130,
                        }} />
                    </Animated.View>
                    <Svg width={311} style={{ alignSelf: 'center', zIndex: -99, }} height={470} viewBox="0 0 181 310" fill="none"><Path opacity={0.9} d="M88.407 11C116.314 58.8983 15.719 59.4356 29.6806 97.964C46.2816 143.776 119.141 55.5102 154.161 89.3925C201.032 134.742 -14.5972 145.737 26.1568 196.655C46.443 222 118.674 156.585 140.443 196.655C164.724 241.346 27.9349 234.488 41.4433 282C48.4924 306.793 139.161 261.5 147.443 302" stroke="url(#paint0_linear_911_85)" strokeWidth={40} /><Defs><LinearGradient id="paint0_linear_911_85" x1={64.3995} y1={216.618} x2={138.204} y2={252.312} gradientUnits="userSpaceOnUse"><Stop stopColor="#FFA826" /><Stop offset={1} stopColor="#FF81AE" /></LinearGradient></Defs></Svg>
                    <Row style={{ position: 'absolute', top: 100, alignSelf: 'center', }}>
                        <Animated.View entering={FadeInLeft.delay(300)} style={{ position: 'absolute', top: 220, left: -140, }}>
                            <Pressable style={{ paddingVertical: 10, borderRadius: 100, alignSelf: 'center', paddingHorizontal: 16, backgroundColor: "#E977A0", }}>
                                <Title style={{ color: "#000" }}>CARDS</Title>
                            </Pressable>
                        </Animated.View>
                        <Animated.View entering={FadeInRight.delay(500)} style={{ position: 'absolute', top: 50, right: -140, }}>
                            <Pressable style={{ paddingVertical: 10, borderRadius: 100, alignSelf: 'center', paddingHorizontal: 16, backgroundColor: "#E99B26", }}>
                                <Title style={{ color: "#000" }}>COLEÇÕES</Title>
                            </Pressable>
                        </Animated.View>
                    </Row>

                    <Title style={{ fontSize: 38, textAlign: 'center', fontFamily: 'Font_Book', marginTop: 20, }}>E muuuuito {'\n'}mais!</Title>
                    <Label style={{ fontSize: 16, textAlign: 'center', marginTop: 2, }}>Novas funções e atualizações frequentemente.</Label>

                </Column>
            </Animated.View>
        )
    }


    const Screen0 = ({ }) => {
        return (
            <Animated.View entering={FadeInRight.delay(400)} exiting={FadeOutLeft}>
                <Svg width={311} style={{ zIndex: -99, position: 'absolute', transform: [{ rotate: '45deg' }], top: -200, left: -150, }} height={470} viewBox="0 0 181 310" fill="none"><Path opacity={0.9} d="M88.407 11C116.314 58.8983 15.719 59.4356 29.6806 97.964C46.2816 143.776 119.141 55.5102 154.161 89.3925C201.032 134.742 -14.5972 145.737 26.1568 196.655C46.443 222 118.674 156.585 140.443 196.655C164.724 241.346 27.9349 234.488 41.4433 282C48.4924 306.793 139.161 261.5 147.443 302" stroke="url(#paint0_linear_898_30)" strokeWidth={40} /><Defs><LinearGradient id="paint0_linear_898_30" x1={64.3995} y1={216.618} x2={138.204} y2={252.312} gradientUnits="userSpaceOnUse"><Stop stopColor="#7D53DE" /><Stop offset={1} stopColor="#51D6FF" /></LinearGradient></Defs></Svg>
                <Svg width={311} style={{ transform: [{ rotate: '45deg' }], bottom: -400, right: -150, position: 'absolute', zIndex: -99, }} height={470} viewBox="0 0 181 310" fill="none" xmlns="http://www.w3.org/2000/svg"><Path opacity={0.9} d="M88.407 11C116.314 58.8983 15.719 59.4356 29.6806 97.964C46.2816 143.776 119.141 55.5102 154.161 89.3925C201.032 134.742 -14.5972 145.737 26.1568 196.655C46.443 222 118.674 156.585 140.443 196.655C164.724 241.346 27.9349 234.488 41.4433 282C48.4924 306.793 139.161 261.5 147.443 302" stroke="url(#paint0_linear_897_3)" strokeWidth={40} /><Defs><LinearGradient id="paint0_linear_897_3" x1={64.3995} y1={216.618} x2={138.204} y2={252.312} gradientUnits="userSpaceOnUse"><Stop stopColor="#ED274A" /><Stop offset={1} stopColor="#FF620A" /></LinearGradient></Defs></Svg>
                <Svg width={311} style={{ zIndex: -99, position: 'absolute', transform: [{ rotate: '145deg' }], top: -200, right: -150, }} height={470} viewBox="0 0 181 310" fill="none"><Path opacity={0.9} d="M88.407 11C116.314 58.8983 15.719 59.4356 29.6806 97.964C46.2816 143.776 119.141 55.5102 154.161 89.3925C201.032 134.742 -14.5972 145.737 26.1568 196.655C46.443 222 118.674 156.585 140.443 196.655C164.724 241.346 27.9349 234.488 41.4433 282C48.4924 306.793 139.161 261.5 147.443 302" stroke="url(#paint0_linear_898_44)" strokeWidth={40} /><Defs><LinearGradient id="paint0_linear_898_44" x1={64.3995} y1={216.618} x2={138.204} y2={252.312} gradientUnits="userSpaceOnUse"><Stop stopColor="#52C4A2" /><Stop offset={1} stopColor="#FFF50A" /></LinearGradient></Defs></Svg>
                <Svg width={311} style={{ zIndex: -99, position: 'absolute', transform: [{ rotate: '140deg' }], bottom: -400, left: -150, }} height={470} viewBox="0 0 181 310" fill="none"><Path opacity={0.9} d="M88.407 11C116.314 58.8983 15.719 59.4356 29.6806 97.964C46.2816 143.776 119.141 55.5102 154.161 89.3925C201.032 134.742 -14.5972 145.737 26.1568 196.655C46.443 222 118.674 156.585 140.443 196.655C164.724 241.346 27.9349 234.488 41.4433 282C48.4924 306.793 139.161 261.5 147.443 302" stroke="url(#paint0_linear_911_85)" strokeWidth={40} /><Defs><LinearGradient id="paint0_linear_911_85" x1={64.3995} y1={216.618} x2={138.204} y2={252.312} gradientUnits="userSpaceOnUse"><Stop stopColor="#FFA826" /><Stop offset={1} stopColor="#FF81AE" /></LinearGradient></Defs></Svg>

                <Column style={{ alignSelf: 'center', width: '100%', marginTop: 50, }}>
                    <Title style={{ fontSize: 28, textAlign: 'center', fontFamily: 'Font_Book', marginTop: 20, }}>Explore o Mundo {'\n'}dos Mangás!</Title>
                    <Label style={{ fontSize: 18, lineHeight: 22, width: 300, textAlign: 'center', marginTop: 10, alignSelf: 'center', }}>  Bem-vindo ao aplicativo! Descubra mangás incríveis, mergulhe em histórias emocionantes e faça parte de uma comunidade de fãs apaixonados. Comece sua jornada agora!</Label>

                    <Row style={{ position: 'absolute', bottom: -100, flexGrow: 1, alignSelf: 'center', marginHorizontal: 30, justifyContent: 'space-between', }}>
                        <Pressable rippleColor='#ffffff90' borderless onPress={() => setFirst(false)} style={{ backgroundColor: "#fff", alignSelf: 'center', borderRadius: 100, paddingVertical: 12, paddingHorizontal: 24, }}>
                            <Title style={{ fontSize: 18, color: "#000" }}>Conheçer</Title>
                        </Pressable>
                    </Row>
                </Column>
            </Animated.View>
        )
    }


    const Screen1 = ({ }) => {
        return (
            <Animated.View entering={FadeInRight.delay(400)} exiting={FadeOutLeft}>
                <Column style={{ alignSelf: 'center', width: '100%', }}>
                    <Animated.View entering={FadeInDown.delay(150)}>
                        <Image source={require('./img1.png')} style={{
                            width: 200, height: 256, position: 'absolute', zIndex: 2, borderRadius: 16,
                            alignSelf: 'center', top: 130,
                        }} />
                    </Animated.View>
                    <Svg width={311} style={{ alignSelf: 'center', zIndex: -99, }} height={470} viewBox="0 0 181 310" fill="none"><Path opacity={0.9} d="M88.407 11C116.314 58.8983 15.719 59.4356 29.6806 97.964C46.2816 143.776 119.141 55.5102 154.161 89.3925C201.032 134.742 -14.5972 145.737 26.1568 196.655C46.443 222 118.674 156.585 140.443 196.655C164.724 241.346 27.9349 234.488 41.4433 282C48.4924 306.793 139.161 261.5 147.443 302" stroke="url(#paint0_linear_898_30)" strokeWidth={40} /><Defs><LinearGradient id="paint0_linear_898_30" x1={64.3995} y1={216.618} x2={138.204} y2={252.312} gradientUnits="userSpaceOnUse"><Stop stopColor="#7D53DE" /><Stop offset={1} stopColor="#51D6FF" /></LinearGradient></Defs></Svg>
                    <Row style={{ position: 'absolute', top: 100, alignSelf: 'center', }}>
                        <Animated.View entering={FadeInLeft.delay(300)} style={{ position: 'absolute', top: 10, left: -160, }}>
                            <Pressable style={{ paddingVertical: 10, borderRadius: 100, alignSelf: 'center', paddingHorizontal: 16, backgroundColor: "#4EC0E8", }}>
                                <Title style={{ color: "#000" }}>NEW WEEK</Title>
                            </Pressable>
                        </Animated.View>
                        <Animated.View entering={FadeInRight.delay(500)} style={{ position: 'absolute', bottom: -300, right: -150, }}>
                            <Pressable style={{ paddingVertical: 10, borderRadius: 100, alignSelf: 'center', paddingHorizontal: 16, backgroundColor: "#9E7CEC", }}>
                                <Title style={{ color: "#000" }}>PARA VOCÊ</Title>
                            </Pressable>
                        </Animated.View>
                    </Row>
                    <Title style={{ fontSize: 38, textAlign: 'center', fontFamily: 'Font_Book', marginTop: 10, }}>Seu Feed {'\n'}personalizado!</Title>
                    <Label style={{ fontSize: 16, textAlign: 'center', marginTop: 2, }}>Conforme você lê, novas recomendações!</Label>
                </Column>
            </Animated.View>
        )
    }

    const Screen2 = ({ }) => {
        return (
            <Animated.View entering={FadeInRight.delay(400)} exiting={FadeOutLeft}>
                <Column style={{ alignSelf: 'center', width: '100%', }}>
                    <Animated.View entering={FadeInDown.delay(150)}>
                        <Image source={require('./img2.png')} style={{ width: 200, height: 256, position: 'absolute', zIndex: 2, borderRadius: 16, alignSelf: 'center', top: 130, }} />
                    </Animated.View>
                    <Svg width={311} style={{ alignSelf: 'center', zIndex: -99, }} height={470} viewBox="0 0 181 310" fill="none" xmlns="http://www.w3.org/2000/svg"><Path opacity={0.9} d="M88.407 11C116.314 58.8983 15.719 59.4356 29.6806 97.964C46.2816 143.776 119.141 55.5102 154.161 89.3925C201.032 134.742 -14.5972 145.737 26.1568 196.655C46.443 222 118.674 156.585 140.443 196.655C164.724 241.346 27.9349 234.488 41.4433 282C48.4924 306.793 139.161 261.5 147.443 302" stroke="url(#paint0_linear_897_3)" strokeWidth={40} /><Defs><LinearGradient id="paint0_linear_897_3" x1={64.3995} y1={216.618} x2={138.204} y2={252.312} gradientUnits="userSpaceOnUse"><Stop stopColor="#ED274A" /><Stop offset={1} stopColor="#FF620A" /></LinearGradient></Defs></Svg>
                    <Row style={{ position: 'absolute', top: 100, alignSelf: 'center', }}>
                        <Animated.View entering={FadeInLeft.delay(300)} style={{ position: 'absolute', top: 235, left: -160, zIndex: 99, }}>
                            <Pressable style={{ paddingVertical: 10, borderRadius: 100, alignSelf: 'center', paddingHorizontal: 16, backgroundColor: "#E95C0D", }}>
                                <Title style={{ color: "#fff" }}>IMPORTE</Title>
                            </Pressable>
                        </Animated.View>
                        <Animated.View entering={FadeInRight.delay(500)} style={{ position: 'absolute', top: 40, right: -170, zIndex: 99, }}>
                            <Pressable style={{ paddingVertical: 10, borderRadius: 100, alignSelf: 'center', paddingHorizontal: 16, backgroundColor: "#D92646", }}>
                                <Title style={{ color: "#fff" }}>ORGANIZADO? SOU</Title>
                            </Pressable>
                        </Animated.View>
                    </Row>

                    <Title style={{ fontSize: 38, textAlign: 'center', fontFamily: 'Font_Book', marginTop: 10, }}>Salve na sua {'\n'}Coleção</Title>
                    <Label style={{ fontSize: 16, textAlign: 'center', marginTop: 2, }}>Organize como preferir seus favoritos!</Label>

                </Column>
            </Animated.View>
        )
    }

    const Screen3 = ({ }) => {
        return (
            <Animated.View entering={FadeInRight.delay(400)} exiting={FadeOutLeft}>
                <Column style={{ alignSelf: 'center', width: '100%', }}>
                    <Animated.View entering={FadeInDown.delay(150)}>
                        <Image source={require('./img3.png')} style={{
                            width: 200, height: 256, position: 'absolute', zIndex: 2, borderRadius: 16,
                            alignSelf: 'center', top: 130,
                        }} />
                    </Animated.View>
                    <Svg width={311} style={{ alignSelf: 'center', zIndex: -99, }} height={470} viewBox="0 0 181 310" fill="none"><Path opacity={0.9} d="M88.407 11C116.314 58.8983 15.719 59.4356 29.6806 97.964C46.2816 143.776 119.141 55.5102 154.161 89.3925C201.032 134.742 -14.5972 145.737 26.1568 196.655C46.443 222 118.674 156.585 140.443 196.655C164.724 241.346 27.9349 234.488 41.4433 282C48.4924 306.793 139.161 261.5 147.443 302" stroke="url(#paint0_linear_898_44)" strokeWidth={40} /><Defs><LinearGradient id="paint0_linear_898_44" x1={64.3995} y1={216.618} x2={138.204} y2={252.312} gradientUnits="userSpaceOnUse"><Stop stopColor="#52C4A2" /><Stop offset={1} stopColor="#FFF50A" /></LinearGradient></Defs></Svg>
                    <Row style={{ position: 'absolute', top: 100, alignSelf: 'center', }}>
                        <Animated.View entering={FadeInLeft.delay(300)} style={{ position: 'absolute', top: 220, left: -140, }}>
                            <Pressable style={{ paddingVertical: 10, borderRadius: 100, alignSelf: 'center', paddingHorizontal: 16, backgroundColor: "#E9E00D", }}>
                                <Title style={{ color: "#000" }}>FILTROS</Title>
                            </Pressable>
                        </Animated.View>
                        <Animated.View entering={FadeInRight.delay(500)} style={{ position: 'absolute', top: 50, right: -140, }}>
                            <Pressable style={{ paddingVertical: 10, borderRadius: 100, alignSelf: 'center', paddingHorizontal: 16, backgroundColor: "#52C4A2", }}>
                                <Title style={{ color: "#000" }}>ZOOOM!</Title>
                            </Pressable>
                        </Animated.View>
                    </Row>
                    <Title style={{ fontSize: 38, textAlign: 'center', fontFamily: 'Font_Book', marginTop: 10, }}>Ferramentas {'\n'}para leitura!</Title>
                    <Label style={{ fontSize: 16, textAlign: 'center', marginTop: 2, }}>Filtros, zoom, paginação e muito mais...</Label>

                </Column>
            </Animated.View>
        )
    }
    
    const screens = [<Screen1 />, <Screen2 />, <Screen3 />, <Screen4 />]

    return (
        <Main style={{ paddingTop: 50, flex: 1, }}>
            
            <Column style={{ paddingHorizontal: 30, marginBottom: 20, }}>
                {!first &&
                    <Row style={{ justifyContent: 'space-between', alignItems: 'center', }}>
                        <Pressable rippleColor='#ffffff90' borderless onPress={() => navigation.navigate('Preferences')} style={{ paddingHorizontal: 20, backgroundColor: color.off, paddingVertical: 10, borderRadius: 100, }}>
                            <Label>Pular</Label>
                        </Pressable>
                    </Row>
                }
            </Column>



            {first ? <Screen0 /> : <>{screens[current]}</>}
            {!first && current < 3 && <>
                    <Row style={{ position: 'absolute', bottom: 50, flexGrow: 1, width: '80%', alignSelf: 'center', marginHorizontal: 30, justifyContent: 'space-between', }}>
                        <Pressable rippleColor='#ffffff90' borderless disabled={current === 0} onPress={() => setCurrent(current - 1)} style={{ backgroundColor: color.off, marginRight: 20, borderRadius: 100, paddingVertical: 12, paddingHorizontal: 24, }}>
                            <Title style={{ fontSize: 18, }}>Anterior</Title>
                        </Pressable>
                        <Pressable rippleColor='#ffffff90' borderless disabled={current === 3} onPress={() => setCurrent(current + 1)} style={{ backgroundColor: color.primary, borderRadius: 100, paddingVertical: 12, paddingHorizontal: 24, }}>
                            <Title style={{ fontSize: 18, }}>Próximo</Title>
                        </Pressable>
                    </Row>
            </>}

            {current === 3 && <Row style={{ position: 'absolute', bottom: 50, flexGrow: 1, alignSelf: 'center', marginHorizontal: 30, justifyContent: 'space-between', }}>
                        <Pressable rippleColor='#ffffff90' borderless onPress={() => navigation.navigate('Preferences')}
                            style={{ backgroundColor: color.primary, alignSelf: 'center', borderRadius: 100, paddingVertical: 12, paddingHorizontal: 24, }}>
                            <Title style={{ fontSize: 18, }}>Continuar</Title>
                        </Pressable>
                    </Row>}
        </Main>
    )
}


