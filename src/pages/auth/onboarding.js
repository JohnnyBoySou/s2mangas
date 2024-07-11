import React, { useState, useContext, useRef, useEffect } from 'react';
import { Image, Pressable, Animated, Dimensions, FlatList } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { Column, Title, Main, Row, Label, Button, Scroll } from '@theme/global';
import { ArrowRight, CircleAlert } from 'lucide-react-native';
import { ExpandingDot } from "react-native-animated-pagination-dots";
import { AnimatePresence, MotiImage, MotiView, useAnimationState } from 'moti';
import Select from '@components/select';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function OnboardingPage({ navigation, route, }) {
    const { color, font } = useContext(ThemeContext)
    const scrollX = useRef(new Animated.Value(0)).current;
    const screens = [<Screen1 />,  <Screen2 />]


    return (
        <Main style={{ paddingTop: 50, }}>

            <Row style={{ position: 'absolute', bottom: 40, zIndex: 99, justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingHorizontal: 30, marginBottom: 20, }}>
                <ExpandingDot
                    data={screens}
                    expandingDotWidth={25}
                    scrollX={scrollX}
                    containerStyle={{ position: 'relative', marginTop: 0, top: 0, }}
                    dotStyle={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        marginHorizontal: 2,
                    }}
                    activeDotColor={color.primary}
                    inActiveDotColor={color.primary + 50}
                />

            </Row>

            <Scroll horizontal pagingEnabled onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false, })} showsHorizontalScrollIndicator={false}>{screens}</Scroll>

        </Main>
    )
}



const Screen1 = ({ }) => {
    const [refresh, setrefresh] = useState(false);
    const { color} = useContext(ThemeContext)
    const scale = useAnimationState({
        from: {
            scale: 1.7,
        },
        to: {
            scale: 4.7,
        }
    })

    const toggle = () => {
        if(refresh){
            setrefresh(false)
            scale.transitionTo('from')
        }else{
            setrefresh(true)
            scale.transitionTo('to')
        }
    }

    useEffect(() => {
        scale.transitionTo('from')
    }, [])

    return (
        <MotiView style={{ width: width,overflow: 'hidden' }}>
            <Row style={{ justifyContent: 'center', alignItems: 'center', marginTop: 60, }}>
                <MotiImage source={{ uri: 'https://i.pinimg.com/564x/e0/b6/7a/e0b67a673882c4f727d2289689dd4c04.jpg' }} from={{ translateY: -300, rotate: '10deg', }} transition={{ duration: 12500, delay: 1000, }} animate={{ translateY: 90, rotate: '0deg' }} style={{ borderRadius: 12, width: 104, height: 150, backgroundColor: '#303030', position: 'absolute', }} />
                <MotiImage source={{ uri: 'https://i.pinimg.com/736x/91/a9/06/91a90649fc657370c6ab99388c91b468.jpg' }} from={{ translateY: -300, rotate: '-20deg', }} transition={{ duration: 12500, delay: 1500, }} animate={{ translateY: 80, rotate: '12deg' }} style={{ borderRadius: 12, width: 104, height: 150, left: 30, position: 'absolute', backgroundColor: '#303030', }} />
                <MotiImage source={{ uri: 'https://i.pinimg.com/736x/08/6a/76/086a768ffc51d78c753c5c7cdaad4167.jpg' }} from={{ translateY: -300, rotate: '-50deg', }} transition={{ duration: 12500, delay: 1200, }} animate={{ translateY: 70, rotate: '-20deg' }} style={{ borderRadius: 12, width: 104, height: 150, right: 30, position: 'absolute', backgroundColor: '#303030', }} />

                <MotiImage source={{ uri: 'https://i.pinimg.com/564x/64/ce/90/64ce9064bc86aa85f80b4766286bcff1.jpg' }} from={{ translateY: -300, rotate: '40deg', }} transition={{ duration: 12500, delay: 700, }} animate={{ translateY: 250, rotate: '20deg' }} style={{ borderRadius: 12, width: 104, left: 30, height: 150, position: 'absolute', backgroundColor: '#303030', }} />
                <MotiImage source={{ uri: 'https://i.pinimg.com/564x/13/4f/31/134f315dba6a843b718c0d2d33f16af0.jpg' }} from={{ translateY: -300, rotate: '40deg', }} transition={{ duration: 12500, delay: 700, }} animate={{ translateY: 250, rotate: '4deg' }} style={{ borderRadius: 12, width: 104, height: 150, position: 'absolute', backgroundColor: '#303030', }} />
                <MotiImage source={{ uri: 'https://i.pinimg.com/564x/b8/6c/45/b86c4516be31199f34e7dfbb837081ba.jpg' }} from={{ translateY: -300, rotate: '40deg', }} transition={{ duration: 12500, delay: 700, }} animate={{ translateY: 250, rotate: '-20deg' }} style={{ borderRadius: 12, width: 104, right: 30, height: 150, position: 'absolute', backgroundColor: '#303030', }} />

                <MotiImage source={{ uri: 'https://i.pinimg.com/736x/80/41/eb/8041eb348c18463a471f4d124ca8ced2.jpg' }} from={{ translateY: -300, rotate: '40deg', }} transition={{ duration: 12500, delay: 600, }} animate={{ translateY: 390, rotate: '-20deg' }} style={{ borderRadius: 12, width: 104, height: 150, left: 30, position: 'absolute', backgroundColor: '#303030', }} />
                <MotiImage source={{ uri: 'https://i.pinimg.com/736x/a1/e0/07/a1e0079cef2bdcb59eeeb436bf80a9ec.jpg' }} from={{ translateY: -300, rotate: '-50deg', }} transition={{ duration: 12500, delay: 1200, }} animate={{ translateY: 410, rotate: '20deg' }} style={{ borderRadius: 12, width: 104, height: 150, right: 20, position: 'absolute', backgroundColor: '#303030', }} />
                <MotiImage source={{ uri: 'https://i.pinimg.com/564x/1f/73/a3/1f73a32d9f57c7c6b96b767cb75d1ac9.jpg' }} from={{ translateY: -400, rotate: '-50deg', }} transition={{ duration: 12500, delay: 1200, }} animate={{ translateY: 400, rotate: '0deg' }} style={{ borderRadius: 12, width: 104, height: 150, position: 'absolute', backgroundColor: '#303030', }} />
            </Row>
            <Pressable onPress={toggle} style={{ position: 'absolute', alignSelf: 'center', bottom: -110, }}>
                <AnimatePresence>
                {refresh && <MotiView style={{ position: 'absolute', zIndex: 99, top: -220, backgroundColor: '#fff', borderRadius: 12, padding: 20, width: 300, alignSelf: 'center',}} from={{opacity: 0,}} animate={{opacity: 1,}} exit={{opacity: 0,}} transition={{ type: 'timing', duration: 200, }}>
                    <MotiImage source={require('@imgs/circle_logo.png')} style={{ width: 64, height: 64, alignSelf: 'center', }} />
                    <Title style={{ textAlign: 'center', color: "#000000", }}>Sua experiência {'\n'}melhor aqui!</Title>
                    <Label style={{ textAlign: 'center', color: "#00000090",}}>Personalize sua experiência. {'\n'}Ajuste o modo de leitura, crie listas personalizadas, aplique filtros e muito mais.</Label>
                    <Label style={{ textAlign: 'center', color: color.primary, fontFamily: 'Font_Bold',}}>arrasta pro lado</Label>
                </MotiView>}
                </AnimatePresence>

                <Column style={{ justifyContent: 'center', zIndex: 99, top: 50, }}>
                    <Title style={{ textAlign: 'center' }}>Bem vindo ao {'\n'}S2Mangás</Title>
                    <Label style={{ textAlign: 'center', color: color.title+99, }}>Clique aqui</Label>
                </Column>
                <MotiImage state={scale} from={{ rotate: '20deg', }} delay={200} animate={{ rotate: '-20deg' }} source={require('@imgs/circle.png')} style={{ width: 200, height: 200, borderRadius: 100, }} />
            </Pressable>
        </MotiView>
    )
}

const Screen2 = ({ }) => {
    const { color } = useContext(ThemeContext)
    const navigation = useNavigation();
    const [languagesSelect, setlanguagesSelect] = useState(['pt-br']);
    const languages = [
        { type: 'pt-br', name: 'Português Brasileiro' },
        { type: 'en', name: 'Inglês' },
        { type: 'es', name: 'Espanhol' },
        { type: 'ja', name: 'Japonês' },
        { type: 'ko', name: 'Coreano' },
        { type: 'zh', name: 'Chinês' },
    ]

    const toggleLanguage = (type) => {
        setlanguagesSelect((prev) =>
            prev.includes(type)
                ? prev.filter(item => item !== type)
                : [...prev, type]
        );
    };


    return (
        <MotiView style={{ width: width, justifyContent: 'center', alignItems: 'center', padding: 30, }}>
            <Title style={{ textAlign: 'center', }}>Selecione as linguagens que deseja ler</Title>
            <AnimatePresence>
                <Row style={{ marginTop: 10, }}>
                    {languagesSelect?.map((item) => <MotiView from={{ opacity: 0, scale: 0, }} animate={{ opacity: 1, scale: 1, }} exit={{ opacity: 0, scale: 0, }} transition={{ type: 'spring', duration: 300 }}><Label key={item} style={{ color: color.off, marginHorizontal: 6, backgroundColor: '#fff', paddingHorizontal: 6, paddingVertical: 4, borderRadius: 5, textAlign: 'center', fontFamily: 'Font_Bold', textTransform: 'uppercase', }}>{item}</Label></MotiView>)}
                </Row>
            </AnimatePresence>
            <FlatList
                data={languages}
                renderItem={({ item }) => (
                    <Button
                        onPress={() => toggleLanguage(item.type)}
                        style={{ borderRadius: 8, marginTop: 16 }}
                    >
                        <Select status={languagesSelect.includes(item.type)} name={item.name} />
                    </Button>
                )}
                keyExtractor={(item) => item.type}
            />



            <Row style={{ top: -25, }}>
                <CircleAlert size={24} color={color.primary} />
                <Label style={{ color: color.primary, marginLeft: 6, }}>Selecione pelo menos uma</Label>
            </Row>
            
            <Button disabled={languagesSelect.length < 1} onPress={() => {navigation.navigate('Preferences', {lg: languagesSelect})}}  style={{ zIndex: 99, backgroundColor: color.primary, borderRadius: 100, justifyContent: 'center', alignItems: 'center', width: 52, height: 52, }}>
                    <ArrowRight size={28} color="#fff" />
                </Button>
        </MotiView>
    )
}