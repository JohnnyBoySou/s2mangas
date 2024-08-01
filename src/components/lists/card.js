import React, { memo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Label, Title, Column, Button } from '@theme/global';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image'

const Card = memo(({ item, right, color = '#252525' }) => {
    const navigation = useNavigation();
    const [long, setlong] = useState(false);
    return (
        <Button onLongPress={() => setlong(!long)} onPress={() => { navigation.navigate('MangaDetails', { id: item.id }); }} style={{ backgroundColor: color, borderRadius: 6, width: 162, marginRight: right ? 0 : 16, justifyContent: 'center', }}>
            <>
                {!long ? <Column>
                    <Image transition={400} contentFit='cover' source={{ uri: item?.capa }} style={{ width: 102, height: 152, borderRadius: 6, alignSelf: 'center', marginBottom: 0, marginTop: 15, zIndex: 99, }} />
                    <Image transition={200} contentFit='cover' blurRadius={80} source={{ uri: item.capa }} style={{ width: 162, height: 182, borderTopLeftRadius: 6, borderTopRightRadius: 6, alignSelf: 'center', position: 'absolute', top: 0, }} />
                    <LinearGradient colors={['transparent', color]} style={{ flexGrow: 1, height: 70, marginTop: -55, marginBottom: 6, }} />
                    <Column style={{ padding: 12, alignItens: 'center', marginBottom: 6, }}>
                        <Title style={{ fontSize: 16, marginTop: -18, textAlign: 'center', }}>{item?.name?.length > 16 ? item?.name?.slice(0, 16) + '...' : item?.name}</Title>
                        <Label style={{ fontSize: 12, textAlign: 'center', }}>{item?.score?.length > 0 ? item?.score + ' •' : null} {item?.type}</Label>
                    </Column>
                </Column> :
                    <Column style={{ backgroundColor: 'blue', flex: 1, borderRadius: 8, }}></Column>}
            </>
        </Button>
    )
})


export default Card;