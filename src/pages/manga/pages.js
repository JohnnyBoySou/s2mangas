import React, { useEffect, useState } from 'react';
import { Row, Scroll, Main, Column } from '../../theme/global';
import { Pressable, FlatList, Dimensions } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import requestPages from '../../api/manga/pages';
import { Image } from 'expo-image';


export default function MangaPages({ route, navigation }) {
    const {id, chapter} = route.params;
    const [item, setItem] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const requestData = async () => {
            requestPages(chapter, id).then((response) => {
                setItem(response)
                setLoading(false);
            })
        };
        requestData()
    }, [])
    const handleSavePage = () => {
    }
    const handleNext = () => {
        setLoading(true);
    }

    const cl = item?.type === 'MANGA' ? "#FFA8B7" : item?.type === 'MANHWA' ? "#BBD2FF" : item?.type === 'MANHUA' ? "#BFFFC6" : '#FFF';
    const rl = item?.status === 'Finalizado' ? '#BFFFC6' : '#FFC7A8'

    return (
        <Main>
            <Scroll >
                <Row style={{ marginTop: 50, paddingHorizontal: 20, marginBottom: 20, }}>
                    <Pressable onPress={() => navigation.goBack()}>
                        <AntDesign name="arrowleft" size={32} color="#fff" />
                    </Pressable>
                </Row>

            <ListPages pages={item?.images} />
            </Scroll>
        </Main>
    )
}

const Images = ({ item }) => {
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        Image.getSize(item, (width, height) => {
            const screenWidth = Dimensions.get('window').width;
            const scaleFactor = screenWidth / width;
            const scaledHeight = height * scaleFactor;
            setImageSize({ width: screenWidth, height: scaledHeight });
        }, (error) => {
            console.log("Error loading image:", error);
        });
    }, [item]);

    return (
        <Column>
            <Image source={{ uri: item }} resizeMode='contain' style={{ width: imageSize.width, height: imageSize.height, margin: 10 }} contentFit="cover" transition={1000}/>
        </Column>
    );
}

const ListPages = ({ pages }) => {1
    return (
            <FlatList
                style={{ marginTop: 20, }}
                data={pages}
                keyExtractor={(item) => item.toString()}
                renderItem={({ item }) => <Images item={item} />}
            />
    );
};