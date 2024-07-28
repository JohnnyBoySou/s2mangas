import React, { useEffect} from 'react';
import { getPreferences } from '@hooks/preferences';
import { Main} from '@theme/global';
import { useWindowDimensions, StyleSheet,  } from 'react-native';
import Animated, { useSharedValue, withSequence, withTiming, useAnimatedStyle, runOnJS, withSpring } from 'react-native-reanimated';

const AsyncStatic = ({navigation}) => {
    async function onEndSplash(){
            const user = await getPreferences()
            setTimeout(() => {
                if (user?.name) {
                  navigation.replace('Tabs')
                }
                else{
                   navigation.navigate('Onboarding')
                }
            }, 1300);
        }
    const logoScale = useSharedValue(1);
    const logoPosY = useSharedValue(0);
    const logoRotate = useSharedValue(0);
    const dimensions = useWindowDimensions()
    const logoAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { scale: logoScale.value },
                { translateY: logoPosY.value },
                { rotateY: logoRotate.value + 'deg' },
            ]
        }
    })
    function logoAnimation() {
      logoScale.value = withSequence(
          withTiming(0.7),
          withTiming(1.3),
          withTiming(1, undefined, (isFinished) => {
              if (isFinished) {
                  logoPosY.value = withSequence(
                      withSpring(20, {  duration: 2500, }),
                      withTiming(-dimensions.height, { duration: 1500 })
                  )
              }
              runOnJS(onEndSplash)();
          }
          )
      );
      logoRotate.value = withSequence(
          withTiming(0),
          withTiming(360, { duration: 1000 }),
          withTiming(-360, { duration: 1200 })
      )
  }
    const randomNumber = Math.floor(Math.random() * 5) + 1;
    const imgs = [require('@assets/imgs/stk1.png'), require('@assets/imgs/stk2.png'), require('@assets/imgs/stk3.png'), require('@assets/imgs/stk4.png'), require('@assets/imgs/stk5.png')] 
    useEffect(() => {
        logoAnimation();
    }, [])
    return(
        <Main style={{ justifyContent: 'center', alignItems: 'center',  }}>
          <Animated.Image source={imgs[randomNumber]} style={[styles.logo, logoAnimatedStyle]} />
        </Main>
    )
}

export default AsyncStatic;
const styles = StyleSheet.create({
  logo: {
      width: 200,
      height: 160,
      objectFit: 'contain',
  }
})

