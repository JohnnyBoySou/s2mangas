import React, { useCallback, useImperativeHandle , useRef} from 'react';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolate, Extrapolation,  withSpring } from 'react-native-reanimated';
import { StyleSheet, View, Dimensions } from 'react-native';

const { width, height: SCREEN_HEIGHT } = Dimensions.get('window'); 


const Bottom = React.forwardRef( ({ children }, ref) => {
    const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50;

    const translateY = useSharedValue(0);
    const active = useSharedValue(false);

    const scrollTo = useCallback((destination) => {
      'worklet';
      active.value = destination !== 0;

      translateY.value = withSpring(destination, { damping: 50 });
    }, []);

    const isActive = useCallback(() => {
      return active.value;
    }, []);

    useImperativeHandle(ref, () => ({ scrollTo, isActive }), [
      scrollTo,
      isActive,
    ]);

    const context = useSharedValue({y: 0});
    const gesture = Gesture.Pan()
        .onStart(() => {
            context.value = { y: translateY.value};
        })
        .onUpdate((event) => {
            translateY.value = event.translationY + context.value.y;
            translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
        })
        .onEnd(() => {
            if (translateY.value > -SCREEN_HEIGHT / 3) {
                if(translateY.value.toFixed(0) < 0) {
                    scrollTo(0);
                }
                else if(translateY.value.toFixed(0), (SCREEN_HEIGHT / 3 ) - 80){
                    scrollTo(300);
                }
            } 
            else if (translateY.value < -SCREEN_HEIGHT / 1.5) {
                scrollTo(MAX_TRANSLATE_Y);
            }
          });



    const rBottomSheetStyle = useAnimatedStyle(() => {
        const borderRadius = interpolate(
            translateY.value,
            [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],
            [25, 5],
            Extrapolation.CLAMP
        )
        return {
            borderRadius,
            transform: [{ translateY: translateY.value }]
        }
    })

   

return(
    <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle]}>
            <View style={styles.line}/>
            {children}
        </Animated.View>
    </GestureDetector>
)});


const styles = StyleSheet.create({
    bottomSheetContainer: {
        height: SCREEN_HEIGHT,
        width: width,
        borderRadius: 25,
        top: SCREEN_HEIGHT / 1.5,
        position: 'absolute',
        zIndex: 100,
    },
    line: {
        width: 75,
        height: 6,
        backgroundColor: '#ccc',
        borderRadius: 4,
        alignSelf: 'center',
        marginVertical: 10,
    }

})

export default Bottom;