import React, { useState } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  interpolate,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

export default function Slider({ min = 0, max = 100, onValueChange, color = '#6200ee' }) {
  const [sliderWidth, setSliderWidth] = useState(0);
  const [currentValue, setCurrentValue] = useState(min);

  const translateX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onChange((event) => {
      translateX.value = Math.max(0, Math.min(sliderWidth, translateX.value + event.translationX));
    })
    .onEnd(() => {
      // Calculate the final value based on the position
      const percentage = translateX.value / sliderWidth;
      const value = Math.max(min, Math.min(max, min + percentage * (max - min)));
      runOnJS(setCurrentValue)(value);
      runOnJS(onValueChange)(value);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handleLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    setSliderWidth(width);
  };

  return (
    <View
      onLayout={handleLayout}
      style={{
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
      }}
    >
      <View
        style={{
          height: 10,
          flex: 1,
          backgroundColor: '#E0E0E0',
          borderRadius: 5,
          overflow: 'hidden',
        }}
      >
        <Animated.View
          style={[
            {
              height: 10,
              backgroundColor: color,
              borderRadius: 5,
            },
            useAnimatedStyle(() => ({
              width: translateX.value,
            })),
          ]}
        />
      </View>

      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            {
              position: 'absolute',
              width: 30,
              height: 30,
              borderRadius: 15,
              backgroundColor: color,
              alignItems: 'center',
              justifyContent: 'center',
              transform: [{ translateX: -15 }], // Centraliza o botão em relação à barra
            },
            animatedStyle,
          ]}
        >
          <Text style={{ color: '#fff' }}>{Math.round(currentValue)}</Text>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
