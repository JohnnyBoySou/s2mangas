import React, { useState, useEffect } from "react";
import { AnimatePresence, MotiView } from "moti";
import { Row, Title } from "../../theme/global";
import { Ionicons } from '@expo/vector-icons';

const Toast = ({ name, color }) => {
    const [visible, setVisible] = useState(true);

    const toggleVisible = () => {
        setVisible(!visible);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence exitBeforeEnter>  
            {visible && 
            <MotiView
                from={{ opacity: 0, translateY: 50 }}
                animate={{ opacity: 1, translateY: 0 }}
                exit={{ opacity: 0, translateY: 50 }}
                transition={{ type: 'timing', duration: 300, delay: 500 }}
                style={{ marginHorizontal: 12, padding: 12, borderRadius: 6, backgroundColor: color, position: "absolute", bottom: 20, zIndex: 999, flexDirection: "row", justifyContent: "space-between" }} >
                <Row style={{ justifyContent: 'space-between', alignItems: 'center', flexGrow: 1 }}>
                    <Title style={{fontSize: 16,}}>{name}</Title>
                    <Ionicons name="close" size={24} color="#fff" onPress={toggleVisible} />
                </Row>
            </MotiView>}
        </AnimatePresence>
    );
};

export default Toast;
