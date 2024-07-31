import React, { useState, useContext, useRef, useEffect } from 'react';
import { Image, View, Dimensions, FlatList } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { Column, Title, Main, Row, Label, Button, Scroll } from '@theme/global';
import { ArrowRight, CircleAlert } from 'lucide-react-native';
import { AnimatePresence, MotiImage, MotiView, } from 'moti';
import Select from '@components/select';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
import PagerView from 'react-native-pager-view';

import Animated, { useAnimatedStyle, withSpring, interpolate } from 'react-native-reanimated';

export default function OnboardingPage({ navigation, route, }) {
    const { color, font } = useContext(ThemeContext)

    const pagerRef = useRef();
    const handleScreen = (position) => {
        pagerRef.current.setPage(position);
        setCurrentIndex(position);
        console.log(position)
    }
    const [currentIndex, setCurrentIndex] = useState(0);
    const numberOfDots = 4;

    const goToNext = () => {
        let next = (currentIndex + 1) % numberOfDots;
        setCurrentIndex(next);
        pagerRef.current.setPage(next);
    };

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + numberOfDots) % numberOfDots);
    };

    return (
        <Main style={{}}>
            <MotiImage source={require('@imgs/logo_black.png')} style={{ width: 84, height: 84, zIndex: 99, objectFit: 'contain', marginTop: 30, marginBottom: -30, marginLeft: 20, }} />
            <PagerView style={{ flex: 1, }} initialPage={0} ref={pagerRef} onPageSelected={(event) => { handleScreen(event.nativeEvent.position) }}>
                <Screen0 />
                <Screen1 />
                <Screen2 />
                <Screen3 />
            </PagerView>
            <Row style={{ marginBottom: 30, width: width, zIndex: 99, paddingHorizontal: 30, justifyContent: 'space-between', }}>
                <PaginationDots
                    index={currentIndex}
                    numberOfDots={numberOfDots}
                    activityColor={color.primary}
                    disableColor="#303030" />


                {currentIndex == 3 && <Column style={{ width: 54, height: 54, borderRadius: 100, }}>
                </Column>}
                <AnimatePresence>
                    {currentIndex != 3 &&
                        <MotiView from={{ opacity: 0, scale: 0, }} animate={{ opacity: 1, scale: 1, }} exit={{ opacity: 0, scale: 0, }}>
                            <Button onPress={goToNext} style={{ width: 54, height: 54, borderRadius: 100, backgroundColor: color.primary, justifyContent: 'center', alignItems: 'center', }}>
                                <ArrowRight size={28} color="#fff" />
                            </Button>
                        </MotiView>
                    }
                </AnimatePresence>
            </Row>
        </Main>
    )
}
const Screen0 = ({ }) => {
    return (
        <Column style={{ flex: 1, marginHorizontal: 30, justifyContent: 'center', }}>
            <MotiImage from={{ opacity: 0, scale: 0, rotate: '12deg' }} animate={{ opacity: 1, scale: 1, rotate: '0deg' }} source={require('@imgs/onboarding_home.png')} style={{ width: '100%', height: 400, objectFit: 'contain', }} />
            <Title style={{ letterSpacing: -1, fontSize: 28, lineHeight: 32 }}>Bem-vindo ao S2Mangás!</Title>
            <Label style={{ letterSpacing: -0.5, fontSize: 18, lineHeight: 22, }}>Mergulhe em uma experiência única de leitura de mangás. Organize suas coleções, compartilhe com amigos e aproveite seu tempo lendo.</Label>
        </Column>

    )
}

const Screen1 = () => {
    return (
        <Column style={{ flex: 1, marginHorizontal: 30, justifyContent: 'center', }}>
            <MotiImage from={{ opacity: 0, scale: 0, rotate: '-12deg' }} animate={{ opacity: 1, scale: 1, rotate: '0deg' }} source={require('@imgs/onboarding_search.png')} style={{ width: '100%', height: 400, objectFit: 'contain', }} />
            <Title style={{ letterSpacing: -1, fontSize: 28, lineHeight: 32 }}>Explore Mangás</Title>
            <Label style={{ letterSpacing: -0.5, fontSize: 18, lineHeight: 22, }}>Descubra uma vasta seleção de mangás. Use nossa poderosa ferramenta de busca para encontrar seus títulos favoritos e novos lançamentos.</Label>
        </Column>
    )
}

const Screen2 = () => {
    return (
        <Column style={{ flex: 1, marginHorizontal: 30, justifyContent: 'center', }}>
            <MotiImage from={{ opacity: 0, scale: 0, rotate: '12deg' }} animate={{ opacity: 1, scale: 1, rotate: '0deg' }} source={require('@imgs/onboarding_collection.png')} style={{ width: '100%', height: 400, objectFit: 'contain', }} />
            <Title style={{ letterSpacing: -1, fontSize: 28, lineHeight: 32 }}>Organize do seu jeito!</Title>
            <Label style={{ letterSpacing: -0.5, fontSize: 18, lineHeight: 22, }}>Com nossas coleções, você pode organizar seus mangás do jeito que preferir e ainda compartilhá-los com seus amigos.</Label>
        </Column>
    )
}

const Screen3 = ({ }) => {
    const { color, font } = useContext(ThemeContext)
    const navigation = useNavigation();
    const [languagesSelect, setlanguagesSelect] = useState(['pt-br']);
    const languages = [
        { type: 'pt-br', name: 'Português' },
        { type: 'en', name: 'Inglês' },
        { type: 'es', name: 'Espanhol' },
        { type: 'ja', name: 'Japonês' },
        { type: 'ko', name: 'Coreano' },
        { type: 'zh', name: 'Chinês' },
    ]

    const toggleLanguage = (type) => {
        setlanguagesSelect((prev) => {
            // Verifica se o tipo já está na lista
            const isSelected = prev.includes(type);
    
            // Se o tipo está na lista e há mais de um item, remove o tipo
            if (isSelected && prev.length > 1) {
                return prev.filter(item => item !== type);
            }
            // Se o tipo não está na lista, adiciona o tipo
            if (!isSelected) {
                return [...prev, type];
            }
            // Caso contrário, retorna a lista inalterada
            return prev;
        });
    };


    return (
        <Column style={{  marginHorizontal: 30, marginTop: 0, justifyContent: 'center', }}>
            <MotiImage from={{ opacity: 0, scale: 0, rotate: '12deg' }} animate={{ opacity: 1, scale: 1, rotate: '0deg' }} source={require('@imgs/onboarding_translate.png')} style={{ width: '100%', height:250, objectFit: 'contain', }} />
            <Title style={{ letterSpacing: -1, fontSize: 28, lineHeight: 32 }}>Selecione os idiomas que deseja ler:</Title>
        
            <FlatList
                data={languages}
                style={{ alignSelf: 'center', }}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between', columnGap: 12, }}
                renderItem={({ item }) => (
                    <Button
                        onPress={() => toggleLanguage(item.type)}
                        style={{ borderRadius: 8, marginTop: 12,  }}
                    >
                        <Select status={languagesSelect.includes(item.type)} name={item.name} />
                    </Button>
                )}
                keyExtractor={(item) => item.type}
            />


            <Button onPress={() => {navigation.navigate('Preferences', {lg: languagesSelect})}}  style={{ paddingHorizontal: 52, marginTop: 20, alignSelf: 'center', paddingVertical: 12, borderRadius: 100, backgroundColor: color.primary, justifyContent: 'center', alignItems: 'center',  }}>
                <Title style={{ fontFamily: font.medium, fontSize: 20, letterSpacing: -1, }}>Pronto</Title>
            </Button>

        </Column>
    )
}

const PaginationDots = ({ index, numberOfDots, activityColor, disableColor }) => {
    // Animated styles
    const dotStyle = (dotIndex) => {
        return useAnimatedStyle(() => {

            // Animated width
            const width = withSpring(index === dotIndex ? 45 : 20);

            return {
                backgroundColor: index === dotIndex ? activityColor : disableColor,
                width,
            };
        });
    };

    return (
        <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 10,
        }}>

            {Array.from({ length: numberOfDots }).map((_, dotIndex) => (
                <Animated.View
                    key={dotIndex}
                    style={[{
                        height: 20,
                        borderRadius: 100,
                        margin: 5,
                    }, dotStyle(dotIndex)]}
                />
            ))}
        </View>
    );
};


/* 


            <Row style={{ alignSelf: 'center', }}>
                <AnimatePresence>
                    {languagesSelect?.map((item) => <MotiView from={{ opacity: 0, scale: 0, }} animate={{ opacity: 1, scale: 1, }} exit={{ opacity: 0, scale: 0, }} transition={{ type: 'spring', duration: 300 }}><Label key={item} style={{ color: color.off, marginHorizontal: 6, backgroundColor: '#fff', paddingHorizontal: 6, paddingVertical: 4, borderRadius: 5, textAlign: 'center', fontFamily: 'Font_Bold', textTransform: 'uppercase', }}>{item}</Label></MotiView>)}
                </AnimatePresence>
            </Row>

const Screen1 = ({ }) => {
    const [refresh, setrefresh] = useState(false);
    const { color } = useContext(ThemeContext)
    const scale = useAnimationState({
        from: {
            scale: 1.7,
        },
        to: {
            scale: 4.7,
        }
    })

    const toggle = () => {
        if (refresh) {
            setrefresh(false)
            scale.transitionTo('from')
        } else {
            setrefresh(true)
            scale.transitionTo('to')
        }
    }

    useEffect(() => {
        scale.transitionTo('from')
    }, [])

    return (
        <MotiView style={{ width: width, overflow: 'hidden' }}>
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
                    {refresh && <MotiView style={{ position: 'absolute', zIndex: 99, top: -220, backgroundColor: '#fff', borderRadius: 12, padding: 20, width: 300, alignSelf: 'center', }} from={{ opacity: 0, }} animate={{ opacity: 1, }} exit={{ opacity: 0, }} transition={{ type: 'timing', duration: 200, }}>
                        <MotiImage source={require('@imgs/circle_logo.png')} style={{ width: 64, height: 64, alignSelf: 'center', }} />
                        <Title style={{ textAlign: 'center', color: "#000000", }}>Sua experiência {'\n'}melhor aqui!</Title>
                        <Label style={{ textAlign: 'center', color: "#00000090", }}>Personalize sua experiência. {'\n'}Ajuste o modo de leitura, crie listas personalizadas, aplique filtros e muito mais.</Label>
                        <Label style={{ textAlign: 'center', color: color.primary, fontFamily: 'Font_Bold', }}>arrasta pro lado</Label>
                    </MotiView>}
                </AnimatePresence>

                <Column style={{ justifyContent: 'center', zIndex: 99, top: 50, }}>
                    <Title style={{ textAlign: 'center' }}>Bem vindo ao {'\n'}S2Mangás</Title>
                    <Label style={{ textAlign: 'center', color: color.title + 99, }}>Clique aqui</Label>
                </Column>
                <MotiImage state={scale} from={{ rotate: '20deg', }} delay={200} animate={{ rotate: '-20deg' }} source={require('@imgs/circle.png')} style={{ width: 200, height: 200, borderRadius: 100, }} />
            </Pressable>
        </MotiView>
    )
}*/