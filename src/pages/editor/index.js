import React, { useState, useContext } from 'react';
import { Pressable, Dimensions} from 'react-native';
import { Label, Row, Main, Scroll, Title} from '../../theme/global';
import { ThemeContext } from "styled-components/native";
const { width, height } = Dimensions.get('window');

export default function EditorPage({ navigation }) {
    const { color, font } = useContext(ThemeContext);
    const [type, setType] = useState('Tudo');
    const [headerShown, setHeaderShown] = useState(false);

    return (
        <Main>
            <Scroll stickyHeaderIndices={[1]} onScroll={(event) => {
                const scrolling = event.nativeEvent.contentOffset.y;
                if (scrolling > 330) {
                    setHeaderShown(true);
                } else {
                    setHeaderShown(false);
                }
                }}>

                <Row style={{ marginBottom: 0, backgroundColor: color.background, padding: 12, paddingTop: 40, marginTop: -20, zIndex: 99, }}>
                    <Pressable onPress={() => { setType('Salvos') }} style={{ paddingVertical: 10, paddingHorizontal: 16, marginLeft: 10, backgroundColor: type === 'Salvos' ? color.light : color.off, borderRadius: 100, zIndex: 99,}}>
                        <Label style={{ color: type === 'Salvos' ? color.off : color.title, fontFamily: type === 'Salvos' ? font.bold : font.book, }}>Salvos</Label>
                    </Pressable>
                    <Pressable onPress={() => { setType('Curtidos') }} style={{ paddingVertical: 10, marginHorizontal: 8, paddingHorizontal: 16, backgroundColor: type === 'Curtidos' ? color.light : color.off, borderRadius: 100, zIndex: 99, }}>
                        <Label style={{ color: type === 'Curtidos' ? color.off : color.title, fontFamily: type === 'Curtidos' ? font.bold : font.book, }}>Curtidos</Label>
                    </Pressable>
                  
                </Row>

                <Title>Editor</Title>

            </Scroll> 
        </Main>
    )
}

 