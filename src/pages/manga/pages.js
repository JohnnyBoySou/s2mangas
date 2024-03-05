import React, { useEffect, useState } from 'react';
import { Row, Scroll, Main, Column, Title } from '../../theme/global';
import { Pressable, FlatList, Dimensions, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import requestPages from '../../api/manga/pages';
import { Image as Webp } from 'expo-image';
import { Skeleton } from 'moti/skeleton';


export default function MangaPages({ route, navigation }) {
    const {id, chapter} = route.params;
    const [item, setItem] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const requestData = async () => {
            requestPages(chapter, id).then((response) => {
                setItem(response)
                console.log(response)
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

    return (
        <Main>
            <Scroll >
                <Row style={{ marginTop: 50, paddingHorizontal: 20, marginBottom: 20, }}>
                    <Pressable onPress={() => navigation.goBack()}>
                        <AntDesign name="arrowleft" size={32} color="#fff" />
                    </Pressable>
                </Row>

                <Column>
                <Image src='https://www.s2mangas.com/_next/image?url=https%3A%2F%2Fi.pinimg.com%2F564x%2F1e%2F9b%2Fbc%2F1e9bbcd802874129776a08f548b39b65.jpg&w=384&q=75' style={{ width: 200, height: 300, margin: 10, objectFit: 'cover', borderRadius: 12, transform: [{rotateX: '12deg'}] }} />
                <Title>Gerando páginas</Title>
                    <Skeleton width={300} height={600} radius={6} /><Skeleton width={300} height={600} radius={6} />
                </Column>

                {loading ? <Column>
                <Title>Gerando páginas</Title>
                    <Skeleton width={300} height={600} radius={6} /><Skeleton width={300} height={600} radius={6} />
                </Column> :  <ListPages item={item} />}
                
            </Scroll>
        </Main>
    )
}

const Images = ({ item, format }) => {
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
        <Image source={{ uri: item }} resizeMode='cover' style={{ width: imageSize.width, height: imageSize.height, margin: 10 }} /> 
        </Column>
    );
}

const ListPages = ({ item }) => {
    const pages = item?.images
    const format = item?.format

    return (
            <FlatList
                style={{ marginTop: 20, }}
                data={pages}
                keyExtractor={(item) => item.toString()}
                renderItem={({ item }) => <Images format={format} item={item} />}
            />
    );
};