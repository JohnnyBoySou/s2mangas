import { Column, Row } from '@theme/global';
import { MotiView, useAnimationState } from 'moti';
import { useContext, useEffect } from 'react';
import { ThemeContext } from 'styled-components/native';

const Check = ({status}) => {
    const { color, font, margin } = useContext(ThemeContext);
    const animationState = useAnimationState({
        closed: {
          translateX: 0,
        },
        open: {
          translateX: 20,
        },
      })

      useEffect(() => {
        animationState.transitionTo(status ? 'open' : 'closed')
      }, [status])
     

    return(
            <Row style={{ backgroundColor: status ? color.primary : "#505050", width: 50, borderRadius: 100, padding: 6, }}>
                <MotiView state={animationState} style={{ width: 18, height: 18, borderRadius: 100, backgroundColor: status ?  "#fff" : '#909090' }} />
            </Row>
)}
export default Check;