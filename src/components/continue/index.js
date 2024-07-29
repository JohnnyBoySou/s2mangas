
import { GestureDetector, Gesture } from "react-native-gesture-handler"
import Animated, {
    useSharedValue,
    withSpring,
    useAnimatedStyle,
    interpolateColor,
    runOnJS,
    withTiming,
} from "react-native-reanimated"

import { useContext, useState } from "react"
import { MotiImage, AnimatePresence, MotiView } from 'moti';
import { Column, Title, Row, Label, Button } from '@theme/global';
import { ArrowUpRight } from "lucide-react-native";
import { ThemeContext } from "styled-components/native";
import { useNavigation } from '@react-navigation/native';

export default function ContinueSheet({ min, max, valueMin, valueMax, item }) {
    const height = useSharedValue(valueMin); // Altura inicial do componente
    const width = useSharedValue('88%');
    const bottom = useSharedValue(20);
    const radius = useSharedValue(12);
    const { color } = useContext(ThemeContext)
    const navigation = useNavigation()

    const MIN_HEIGHT = valueMin// Altura mínima
    const MAX_HEIGHT = valueMax; // Altura máxima
    const [currentStatus, setCurrentStatus] = useState('min');
    const pan = Gesture.Pan()
        .onChange((event) => {
            const offsetDelta = - event.changeY + height.value
            height.value = offsetDelta
        })
        .onEnd(() => {
            const currentHeight = height.value;
            let targetHeight;
            let targetWidth;
            let targetBottom;
            let targetRadius;
            if (currentHeight < (MIN_HEIGHT + MAX_HEIGHT) / 3) {
                targetWidth = '88%'
                targetRadius = 12
                targetBottom = 20
                targetHeight = MIN_HEIGHT;
                runOnJS(setCurrentStatus)('min')
            } else {
                targetHeight = MAX_HEIGHT;
                targetWidth = '100%';
                targetRadius = 0
                targetBottom = 0
                runOnJS(setCurrentStatus)('max')
            }
            radius.value = withSpring(targetRadius);
            bottom.value = withTiming(targetBottom);
            width.value = withTiming(targetWidth);
            height.value = withTiming(targetHeight);
        });

    const animatedStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            height.value,
            [MIN_HEIGHT, MAX_HEIGHT],
            ['#FFF', '#171717',]
        );
        return {
            height: height.value,
            width: width.value,
            borderRadius: radius.value,
            bottom: bottom.value,
            backgroundColor,
            alignSelf: 'center',
        };
    });

    return (
        <Animated.View style={[{ bottom: 10, zIndex: 2, position: 'absolute', overflow: 'hidden', }, animatedStyle]} >
            <GestureDetector gesture={pan}>
                <Column style={{ paddingTop: 8, paddingBottom: 14, zIndex: 2, width: '100%', }}>
                    <Column style={{ width: 50, height: 6, backgroundColor: currentStatus === 'min' ? '#00000050' : '#ffffff90', alignSelf: 'center', borderRadius: 100, }} />
                  {currentStatus === 'min' &&  <Row style={{ marginHorizontal: currentStatus === 'min' ? 12 : 20,  alignItems: 'center', marginTop: currentStatus === 'min' ? -2 : 12, justifyContent: 'space-between', }}>
                        <Row style={{ justifyContent: 'center', alignItems: 'center', }}>
                            <MotiImage source={{ uri: item?.capa }} style={{ width: 48, height: 48, borderRadius: 5, }} />
                            <Column style={{ marginLeft: 16, justifyContent: 'center', }}>
                                <Title style={{ fontSize: 16, color: currentStatus === 'min' ? "#303030" : "#fff", }}>{item?.name?.length >= 20 ? item?.name?.slice(0, 24) + '...' : item?.name}</Title>
                                <Label style={{ fontFamily: 'Font_Book', color: currentStatus === 'min' ? "#505050" : "#f7f7f7", fontSize: 12, marginTop: -2, }}>{item?.chapter - item?.chapters?.length} capítulos restantes</Label>
                            </Column>
                        </Row>

                        <Button onPress={() => { navigation.navigate('MangaDetails', { id: item?.id }) }} style={{ backgroundColor: currentStatus === 'min' ? color.primary : '#fff', borderRadius: 100, width: 32, height: 32, justifyContent: 'center', alignItems: 'center', }}>
                            <ArrowUpRight size={18} color={currentStatus === 'min' ? '#fff' : color.primary} />
                        </Button>
                    </Row>}
                    {currentStatus === 'max' && <Column style={{ height: 40, marginBottom: -40, }}></Column>}
                </Column>
            </GestureDetector>
            <Column style={{  marginTop: -20, }}>
                {currentStatus === 'max' && max}
            </Column>
        </Animated.View>
    )
}