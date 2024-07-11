import React, { useEffect} from 'react';
import { getPreferences } from '../../api/user/preferences';
import { Main} from '../../theme/global';
import { useWindowDimensions, StyleSheet, Image } from 'react-native';
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
    const imgs = [require('../../assets/imgs/stk1.png'), require('../../assets/imgs/stk2.png'), require('../../assets/imgs/stk3.png'), require('../../assets/imgs/stk4.png'), require('../../assets/imgs/stk5.png')] 
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



/**
 *  <Pressable onPress={() => {setanimation(!animation)}} style={{ position: 'absolute', bottom: 40, right: 50, zIndex: 99, }}>
            <AntDesign name='play' size={32} color='#fff' style={{ padding: 12, borderRadius: 100, backgroundColor: 'red' }}/>
          </Pressable>
         
        {animation &&
          <Row style={{ justifyContent: 'center', alignItems: 'flex-end', marginBottom: -100,  }}>
             <MotiImage 
              source={require('../../assets/imgs/logo_grainy.png')} 
              style={{ width: 100, height: 100, borderRadius: 100, position: 'absolute', alignSelf: 'center', top: '40%', zIndex: 99, }}
              from={{opacity: 0, scale: 0.5,}}
              animate={{opacity: 1, scale: 1.5,}}
              transition={{
                type: 'spring',
                duration: 2000,
                delay: 2000,
              }}
              />
            <MotiImage 
              source={require('../../assets/imgs/bar1.png')}
              style={{ width: 120, height: 200, borderRadius: 100, backgroundColor: '#303030' }} 
              from={{height: 70, opacity: .6,}} 
              animate={{height: 1000, opacity: 1,}} 
              transition={{
                type: 'spring',
                duration: 18000,
                delay: 500,
              }}
            />
             <MotiImage 
              source={require('../../assets/imgs/bar3.png')}
              style={{ width: 150, height: 200, borderRadius: 100, backgroundColor: '#303030' }} 
              from={{height: 70, opacity: .6,}} 
              animate={{height: 1000, opacity: 1}} 
              transition={{
                type: 'spring',
                duration: 20000,
                delay: 300,
              }}
            />
             <MotiImage 
              source={require('../../assets/imgs/bar2.png')}
              style={{ width: 120, height: 200, borderRadius: 100, backgroundColor: '#303030' }} 
              from={{height: 70, opacity: .6,}} 
              animate={{height: 1000, opacity: 1,}} 
              transition={{
                type: 'spring',
                duration: 14000,
                delay: 500,
              }}
              />
            
          </Row>
        }
 */