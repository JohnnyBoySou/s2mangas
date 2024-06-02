import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Row, Scroll, Main, Column, Title, Label } from '../../theme/global';
import { Pressable, FlatList, Dimensions, Image, View, ActivityIndicator, StatusBar,  } from 'react-native';
import { addChaptersToManga } from '../../api/user/progress';
import { AnimatePresence, MotiView,  } from 'moti';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { Album, ArrowLeft, ArrowRight } from 'lucide-react-native';
import { getPages } from '../../api_v2/getPages';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function MangaPages({ route, navigation }) {
    const {id, chapter, itm } = route.params;

    const [uid, setuid] = useState(id);
    const [currentChapter, setcurrentChapter] = useState(chapter);
   
    const [loading, setLoading] = useState(false);
    const [nextChap, setnextChap] = useState();
    const [prevChap, setprevChap] = useState();
    const [pages, setpages] = useState();

    useEffect(() => {
        const requestData = async () => {
            addChaptersToManga(itm, currentChapter)  
            getPages(uid, itm?.id).then((response) => {
                setpages(response.pages)
                setprevChap(response.prev)
                setnextChap(response.next)
                setLoading(false)
            })
        };
        requestData()
    }, [uid])


    const handleNextChapter = () => {
        if (nextChap) {
            setLoading(true)
            setCurrentPage(0)
            setuid(nextChap.id)
            setcurrentChapter(nextChap.chapter)
        }
    }
    const handlePrevChapter = () => {
        if (prevChap) {
            setLoading(true)
            setuid(prevChap.id)
            setCurrentPage(0)
            setcurrentChapter(prevChap.chapter)
        }
    }
    const flatListRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(0);

    const handleNext = () => {
        if (currentPage < pages.length - 1) {
            setCurrentPage(currentPage + 1);
            flatListRef.current.scrollToIndex({ animated: true, index: currentPage + 1 });
        }
    };

    const handlePrevious = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
            flatListRef.current.scrollToIndex({ animated: true, index: currentPage - 1 });
        }
    };
    const handleSelectPage = (page) => {
        setCurrentPage(page);
        flatListRef.current.scrollToIndex({ animated: true, index: page });
    }

    return (
        <Main style={{ justifyContent: 'center', alignItems: 'center', }}>
            <StatusBar hidden />
            <Row style={{ position: 'absolute', top: 20, zIndex: 9999, left: 20, right: 20, justifyContent: 'space-between', alignItems: 'center',  }}>
                <Pressable onPress={() => navigation.goBack()} style={{  }}>
                    <ArrowLeft size={30} stroke='#fff' />
                </Pressable>
                <Title>{currentPage + 1}/{pages?.length}</Title>
            </Row>
            <Row style={{ position: 'absolute', zIndex: 99, top: 0, }}>
                <Pressable style={{ width: SCREEN_WIDTH / 2, height: SCREEN_HEIGHT,  }} onPress={handlePrevious} onLongPress={handlePrevChapter} delayLongPress={1000}/>
                <Pressable style={{ width: SCREEN_WIDTH / 2, height: SCREEN_HEIGHT, }} onPress={handleNext} onLongPress={handleNextChapter} delayLongPress={1000}/>
            </Row>

            {loading ? <Load />: 
            <FlatList
                style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, backgroundColor: '#202020', flex: 1, }}
                data={pages}
                showsHorizontalScrollIndicator={false}
                ref={flatListRef}
                keyExtractor={(item, index) => item?.chapter}
                horizontal={true}
                ListEmptyComponent={<Load/>}
                pagingEnabled={true} contentContainerStyle={{ alignItems: 'center' }}
                renderItem={({ item }) => <Images url={item} />}
                getItemLayout={(data, index) => ({
                    length: SCREEN_WIDTH,
                    offset: SCREEN_WIDTH * index,
                    index,
                })}
                onMomentumScrollEnd={(event) => {
                    setCurrentPage(Math.floor(event.nativeEvent.contentOffset.x / SCREEN_WIDTH));
                }}
            />}
            
            {!loading && <Column style={{ position: 'absolute', bottom: 20, zIndex: 999,}}>
            <AnimatePresence>
                {currentPage < 2 &&
                <MotiView from={{opacity:0, translateY: 40, }} animate={{opacity: 1, translateY: 0, }} exit={{opacity:0, translateY: 40,}}>
                   <Pressable onPress={handlePrevChapter} style={{ backgroundColor: '#fff', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 6,  }}><Label style={{ color:'#000', }}>Capítulo anterior</Label></Pressable>
                </MotiView>
                   }
                   {currentPage >= pages?.length -2 && nextChap &&
                <MotiView from={{opacity:0, translateY: 40, }} animate={{opacity: 1, translateY: 0, }} exit={{opacity:0, translateY: 40,}}>
                   <Pressable onPress={handleNextChapter} style={{ backgroundColor: '#fff', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 6,  }}><Label style={{ color:'#000', }}>Próximo capítulo</Label></Pressable>
                </MotiView>
                   }
            </AnimatePresence>
                   </Column>}
        </Main>
    )
}
//<Pagination currentIndex={currentPage} pages={pages} handleSelectPage={handleSelectPage} />
/* 
const Pagination = ({ currentIndex, pages, handleSelectPage }) => {
    return (
        <Column  style={{ position: 'absolute', bottom: 50, zIndex: 999, }}>
        <Row style={{ justifyContent: 'center', alignItems: 'center',  }}>
            {pages?.map((_, index) => (
                <Pressable onPress={() => handleSelectPage(index)} key={index} style={{ width: '4%', marginHorizontal: 4, height: 10, borderRadius: 100, backgroundColor: index === currentIndex ? 'red' : '#303030', }} />
                ))}
        </Row>
    </Column>
    )
}
*/

const Images = ({ url }) => {
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!url) return;

        const imageLoad = () => {
            setLoading(true);
            setError(false);

            Image.getSize(url, (width, height) => {
                const scaleFactor = SCREEN_WIDTH / width;
                const scaledHeight = height * scaleFactor;
                setImageSize({ width: SCREEN_WIDTH, height: scaledHeight });
                setLoading(false);
            }, (error) => {
                console.log("Error loading image:", error);
                setError(true);
                setLoading(false);
            });
        };

        imageLoad();

    }, [url]);

    if (loading) {
        return (
            <Load />
        );
    }

    if (error) {
        return (
            <Error />
        );
    }

    return (
        <Image
            source={{ uri: url }}
            resizeMode='cover'
            style={{ width: imageSize.width, height: imageSize.height, backgroundColor: '#fff', }}
        />
    );
};

const Load = () => {
    return (
        <MotiView style={{ justifyContent: 'center', alignItems: 'center', width: SCREEN_WIDTH,  }}>
            <Image src='https://i.pinimg.com/564x/ae/87/1a/ae871a9d054cd5f966b49a3c734ae8bc.jpg' style={{ width: 200, height: 300, margin: 10,  objectFit: 'cover', borderRadius: 12, transform: [{ rotateX: '12deg' }] }} />
            <Title>Gerando páginas</Title>
            <Label>Isso pode demorar um pouco...</Label>
        </MotiView>
    )
}
const Error = (error) => {
    return (
        <MotiView style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 200, }}>
            <Image blurRadius={40} source={{ uri: "https://i.pinimg.com/564x/db/d5/8d/dbd58dd3bee3763a0c34e73f6ed64b62.jpg" }} style={{ width: SCREEN_WIDTH, height: 1.2 * SCREEN_HEIGHT, opacity: 0.6, zIndex: -2, position: 'absolute', }} />
            <Image src='https://i.pinimg.com/564x/8f/83/a1/8f83a1f9c13373e854f4385974b1c8bd.jpg' style={{ width: 200, height: 300, margin: 10, marginTop: 200, objectFit: 'cover', borderRadius: 12, transform: [{ rotateX: '12deg' }] }} />
            <Title>Encontramos um problema</Title>
            <Label>{error}</Label>
        </MotiView>
    )
}