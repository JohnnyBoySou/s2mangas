import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    Easing,
    runOnJS
} from 'react-native-reanimated';

export default function ProgressBar({ color = '#6200ee', bg = '#FFFFFFF30', value }) {
    const progress = useSharedValue(value !== undefined ? value : 0);
    const infiniteAnimation = useSharedValue(0);

    useEffect(() => {
      if (value !== undefined) {
        progress.value = withTiming(value, { duration: 500 });
      } else {
        // Animação infinita de progresso
        const startInfiniteAnimation = () => {
          infiniteAnimation.value = 0;
          infiniteAnimation.value = withTiming(1, {
            duration: 1500,
            easing: Easing.linear,
          }, () => {
            runOnJS(startInfiniteAnimation)();
          });
        };
  
        startInfiniteAnimation();
      }
    }, [value]);
  
    const animatedStyle = useAnimatedStyle(() => {
      const width = value !== undefined
        ? `${progress.value * 100}%`
        : `${infiniteAnimation.value * 100}%`;
  
      return {
        width,
        backgroundColor: color,
        height: 10,
        borderRadius: 5,
      };
    });

    return (
        <View style={{ width: '100%', backgroundColor: bg, borderRadius: 100, }}>
            <Animated.View style={animatedStyle} />
        </View>
    );
}
