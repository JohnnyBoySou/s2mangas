import React, {useEffect, useState} from 'react';
import { FlatList, Pressable } from 'react-native';
import { Column, Row, Title, Label, ButtonOff, Main, Scroll} from '../../theme/global';
import axios from 'axios';

import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';
import BackButton from '../../components/back';

export default function NovidadesPage({navigation}){
    const [step, setStep] = useState(1);
    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://www.s2mangas.com/api/news');
                console.log(response.data)
                setData(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [])

    const UpadateItem = ({ item }) => {
    return(
      <Column style={{backgroundColor: "#202020", borderRadius: 6, marginVertical: 12,}}>
          <LinearGradient 
            colors={[item?.colors[0], item?.colors[1]]}
            start={{ x: 0, y: 0 }}
            style={{  height: 60, flexGrow: 1, borderTopLeftRadius: 6, borderTopRightRadius: 6, }}/>
        
        <Column style={{padding: 16, borderTopWidth: 3, borderTopColor: '#404040'}}>
        <Title style={{fontSize: 20, marginBottom: 6,}}>{item.title}</Title>
        <Label style={{fontSize: 15,}}>{item.description}</Label>
        <Column style={{width:60, height: 6, borderRadius: 100, alignSelf: 'center', backgroundColor: "#494949", marginTop: 10, marginBottom: -5,}}/>
        </Column>
      </Column>
    )
    }
    

    return(
    <Main>
        <Scroll style={{paddingHorizontal: 20, paddingVertical: 44}}>
            <BackButton/>
            <Column>
                <Title style={{fontSize: 42, marginBottom: 5, marginTop: 20,}}>Novidades</Title>
                <Label>Os últimos lançamentos dos mangás que você segue.</Label>
            </Column>

            <Row style={{marginVertical: 20,}}>
                <Pressable style={{backgroundColor: step === 1 ? '#fff' : '#404040',  paddingVertical: 12, paddingHorizontal: 16, borderRadius: 40, }} onPress={() => setStep(1)}>
                    <Label style={{color: step === 1 ? '#000' : '#f6f6f6',}}>Mangás</Label>
                    </Pressable>
                <Pressable style={{backgroundColor: step === 2 ? '#fff' : '#404040',  marginLeft: 15, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 40, }} onPress={() => setStep(2)}><Label style={{color: step === 2 ? '#000' : '#f6f6f6',}}>Atualizações</Label></Pressable>
            </Row>

            {step == 1 &&
            <Column style={{marginTop: 10, marginLeft: -44,}}>
            </Column>
            }
            {step == 2 &&
            <Row style={{flexWrap: 'wrap'}}>
                <FlatList
                    data={data}
                    renderItem={({ item }) => <UpadateItem item={item} />}
                    keyExtractor={(item) => item.id}
                />
            </Row>
            }
            </Scroll>
    </Main>
    )}
