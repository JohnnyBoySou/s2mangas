import React from 'react';
import { Column, Row, Title, Label, } from '../../theme/global';
export default function ContinueReading (){
return(
    <Column style={{paddingHorizontal: 20, marginBottom: 20,}}>
        
        
        <Title style={{ fontSize: 24, }}>Continue lendo</Title>
        <Label style={{marginBottom: 12,}}>Seu mangá está esperando</Label>



        <Card/>
    </Column>
)}


const Card = ({item}) => {
  return(
    <Row>
        <Column style={{backgroundColor: '#303030', padding: 12, borderRadius:12, height: 200, width: '60%'}}>
        </Column>
        <Column style={{width: 12}} />
        <Column style={{flexGrow: 1,}}>
            <Column style={{backgroundColor: '#303030', padding: 12, borderRadius:12, height: 80,flexGrow: 1,}}>
            </Column>
            <Column style={{height: 12}} />
            <Column style={{backgroundColor: '#303030', padding: 12, borderRadius:12, height: 80,flexGrow: 1,}}>
            </Column>
        </Column>
    </Row>
  )
}
