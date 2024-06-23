
import { GestureDetector, Gesture } from "react-native-gesture-handler"
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  interpolateColor,
  runOnJS,
} from "react-native-reanimated"

import { useState } from "react"
import { MotiImage, AnimatePresence, MotiView } from 'moti';
import { Column, Title } from '@theme/global';

    export default function TopSheet({ min, max, normal, backgroundItem }) {
    const height = useSharedValue(130); // Altura inicial do componente

    const MIN_HEIGHT = 130; // Altura mínima
    const NORMAL_HEIGHT = 230; // Altura normal
    const MAX_HEIGHT = 530; // Altura máxima

    const [currentStatus, setCurrentStatus] = useState('min');
    const pan = Gesture.Pan()
        .onChange((event) => {
        const offsetDelta = event.changeY + height.value
        height.value = offsetDelta 
        })
        .onEnd(() => {
        const currentHeight = height.value;
        let targetHeight;
        if (currentHeight < (MIN_HEIGHT + NORMAL_HEIGHT) / 2) {
            targetHeight = MIN_HEIGHT;
            runOnJS(setCurrentStatus)('min')
        } else if (currentHeight < (NORMAL_HEIGHT + MAX_HEIGHT) / 2) {
            targetHeight = NORMAL_HEIGHT;
            runOnJS(setCurrentStatus)('normal')
        } else {
            targetHeight = MAX_HEIGHT;
            runOnJS(setCurrentStatus)('max')
        }
        height.value = withSpring(targetHeight);
        });

    const animatedStyle = useAnimatedStyle(() => ({    
        height: height.value, 
    }));


    return (
        <Animated.View style={[{ width: '100%', top: 0, overflow: 'hidden', zIndex: 99, borderBottomLeftRadius: 32,  borderBottomRightRadius: 32, position: 'absolute', backgroundColor: '#171717' }, animatedStyle]} >
            {backgroundItem}
            <Column style={{ paddingHorizontal: 28,  }}>
                <AnimatePresence>
                    <MotiView from={{opacity: 0,}} animate={{opacity: 1, }} exit={{opacity: 0,}}>
                    {currentStatus === 'min' && min}
                    {currentStatus === 'normal' && normal}
                    {currentStatus === 'max' && max}
                    </MotiView>
                </AnimatePresence>
            </Column>
        <GestureDetector gesture={pan}>
            <Column style={{ padding: 20, position: 'absolute', bottom: -5, width: '100%',}}>
            <Column style={{ width: 80, height: 8, backgroundColor: currentStatus === 'max' ? "#30303070" : '#ffffff90', alignSelf: 'center', borderRadius: 100, }} />
            </Column>
        </GestureDetector>
        </Animated.View>
    )
    }