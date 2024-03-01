import { useEffect, useState } from "react";
import { Row } from "../../theme/global";
import Animated, { EasingNode } from "react-native-reanimated";

export function Bars({current, color}) { 
    const [widthAnimation1, setWidthAnimation1] = useState(new Animated.Value(60));
    const [widthAnimation2, setWidthAnimation2] = useState(new Animated.Value(20));
    const [widthAnimation3, setWidthAnimation3] = useState(new Animated.Value(20));
    const [widthAnimation4, setWidthAnimation4] = useState(new Animated.Value(20));

    const animatedBars = () => { 
        if(current === 0){
            Animated.timing(widthAnimation2, {
                  toValue: 20, // Valor final da largura
                  duration: 200, // Duração da animação em milissegundos
                  useNativeDriver: false, // Use o driver JS para animação
                }).start();
             
            Animated.timing(widthAnimation1, {
                    toValue: 40, // Valor final da largura
                    duration: 500, // Duração da animação em milissegundos
                    useNativeDriver: false, // Use o driver JS para animação
                  }).start();


        }
        else if(current === 1){
            Animated.timing(widthAnimation2, {
                  toValue: 40, // Valor final da largura
                  duration: 500, // Duração da animação em milissegundos
                  useNativeDriver: false, // Use o driver JS para animação
                }).start();
            Animated.timing(widthAnimation1, {
                    toValue: 20, // Valor final da largura
                    duration: 200, // Duração da animação em milissegundos
                    useNativeDriver: false, // Use o driver JS para animação
                  }).start();    

            Animated.timing(widthAnimation3, {
                    toValue: 20, // Valor final da largura
                    duration: 200, // Duração da animação em milissegundos
                    useNativeDriver: false, // Use o driver JS para animação
                  }).start();    

        }
        else if(current === 2){
            Animated.timing(widthAnimation2, {
                  toValue: 20, // Valor final da largura
                  duration: 200, // Duração da animação em milissegundos
                  useNativeDriver: false, // Use o driver JS para animação
                }).start();
            
            Animated.timing(widthAnimation3, {
                  toValue: 40, // Valor final da largura
                  duration: 500, // Duração da animação em milissegundos
                  useNativeDriver: false, // Use o driver JS para animação
                }).start();
        }
        else if(current === 3){
            Animated.timing(widthAnimation3, {
                  toValue: 20, // Valor final da largura
                  duration: 200, // Duração da animação em milissegundos
                  useNativeDriver: false, // Use o driver JS para animação
                }).start();
            
            Animated.timing(widthAnimation4, {
                  toValue: 40, // Valor final da largura
                  duration: 500, // Duração da animação em milissegundos
                  useNativeDriver: false, // Use o driver JS para animação
                }).start();
        }
     }

     useEffect(() => {
       animatedBars()
     }, [current])
     
    return(
        <Row style={{justifyContent: 'space-between', width: 130, alignItems: 'center',}}>
            <Animated.View style={{width: widthAnimation1, height: 8, backgroundColor: current === 0 ? color.off2 : color.off, borderRadius: 100,}}/>
            <Animated.View style={{width: widthAnimation2, height: 8, backgroundColor: current === 1 ? color.off2 : color.off, borderRadius: 100,}}/>
            <Animated.View style={{width: widthAnimation3, height: 8, backgroundColor: current === 2 ? color.off2 : color.off, borderRadius: 100,}}/>
            <Animated.View style={{width: widthAnimation4, height: 8, backgroundColor: current === 3 ? color.off2 : color.off, borderRadius: 100,}}/>
        </Row>
    )
 }