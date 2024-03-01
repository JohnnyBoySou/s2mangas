import React, {useEffect, useState} from 'react';
import { Pressable } from 'react-native';
import { Column, Row, Title, Label, ButtonOff, Main, Scroll} from '../../theme/global';

export default function NovidadesPage(){
    const [step, setStep] = useState(1);
    const [data, setData] = useState([]);

    const UpadateItem = ({ item }) => {
      return(
        <Column >
              <Column style={{  height: 30, flexGrow: 1,
                background: `linear-gradient(45deg, ${item?.colors[0]} 20.91%, ${item?.colors[1]} 80.92%)`,
            }}/>
            <Column style={{padding: 16, borderTop: '3px solid #404040'}}>
            <Title style={{fontSize: 20, marginBottom: 6,}}>{item.title}</Title>
            <Label style={{fontSize: 15,}}>{item.description}</Label>
            <Column style={{width:60, height: 6, borderRadius: 100, alignSelf: 'center', backgroundColor: "#494949", marginTop: 10, marginBottom: -5,}}/>
            </Column>
        </Column>
      )
    }
    

    return(
    <Main style={{paddingHorizontal: 20, paddingVertical: 44,}}>
        <Scroll>
            <Row style={{justifyContent: 'space-between', alignItems: 'center', }}>
                <Column>
                <Title style={{fontSize: 42, marginBottom: 5,}}>Novidades</Title>
                <Label>Os últimos lançamentos dos mangás que você segue.</Label>
                </Column>
            </Row>
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
            </Row>
            }
            </Scroll>
    </Main>
    )}
