
import React, { useState, useContext } from 'react'
import { Dimensions, Image, TouchableOpacity , TextInput, FlatList, ScrollView} from 'react-native'
import { AntDesign} from '@expo/vector-icons';

import { Wrapper, Title, 
Main,
Label,
VerAgora,
Spacing,
} from './styles'

import divided, { tags } from '../../api/request/divided';

import { ThemeContext } from 'styled-components/native'
import { Column, Row } from '../../theme/global'
import { requestFeedByCategories, requestPreferences } from '../../api/request/index'
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { geral } from '../../api/shop/avatars';
import { geralbg } from '../../api/shop/capas';
import { setCurrentAvatar, setCurrentCapa } from '../../api/auth/avatars';
import { Bars } from '../onboarding/bars';

export default function Preferences({ navigation, route, ...props }) {

  const { color, font } = useContext(ThemeContext)
  const [name, setName] = useState('');
  const [picture, setPicture] = useState();
  const [capa, setCapa] = useState();
  const [capaUrl, setCapaUrl] = useState();
  const [url, setUrl] = useState();
  const [bio, setBio] = useState('');

  const [step, setStep] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const handleItemClick = (item) => {
    const itemsCopy = [...selectedItems];
    const index = itemsCopy.findIndex(selectedItem => selectedItem.id === item.id);
    if (index > -1) {
      itemsCopy.splice(index, 1);
    } else if (selectedItems.length < 8) {
      itemsCopy.push(item);
    }
    setSelectedItems(itemsCopy);
  };
  const handleNext = () => { 
    if(step == 1){
      if(name.length > 2){
        setStep(2)
      }
    }
    else if(step == 2){
      if(picture){
        setStep(3)
      }
    }else if(step == 3){
      if(capa){
        setStep(4)
      }
    }
    else if(step == 4){
      if(selectedItems.length >= 1){
        const params = {"items": selectedItems, "name": name, "picture": picture, "capa": capa, "bio": bio}
        setCurrentAvatar(picture)
        setCurrentCapa(capa)
        requestFeedByCategories(params.items)
        requestPreferences('create', params).then(response => {
          navigation.navigate('Async')
        })
      }
    }
    }
    
  const handleBack = () => { 
    if(step == 1){
      navigation.goBack()
    }else if(step == 2){setStep(1)}
    else if(step == 3){setStep(2)}
    else if(step == 4){setStep(3)}
   }

return (
  <Main>
  <Wrapper >
    <Column style={{paddingHorizontal: 20, flex: 1, paddingTop: 50,}}>
      <Row style={{marginVertical: 12,}}>
        <Bars current={step - 1 } color={color}/>
      </Row>

  {step == 1 &&
    <Animated.View entering={FadeInUp}>
    <Column style={{justifyContent: 'center', marginTop: 50,}}>
      <Title style={{textAlign: 'left'}}>Qual seu nome?</Title>
      <Label style={{textAlign: 'left'}}>Pode ser apelido também</Label>
      <TextInput value={name} placeholderTextColor={color.title+70} placeholder='Ex.: Johnny' onChangeText={setName} style={{fontFamily: font.medium, height: 63, backgroundColor: color.off, marginTop: 10, paddingLeft: 20, borderRadius: 5, fontSize: 28, borderBottomColor: color.primary, borderBottomWidth: 2, color: color.title}}/>
      <Title style={{marginTop: 40, textAlign: 'left'}}>Um pouco sobre você...</Title>
      <Label style={{textAlign: 'left'}}>Escreva sua bio</Label>
      <TextInput value={bio} placeholderTextColor={color.title+70} placeholder='Ex.: Gosto de mangás de ação' onChangeText={setBio} style={{fontFamily: font.book, height: 63, backgroundColor: color.off, marginTop: 10, paddingLeft: 20, borderRadius: 5, fontSize: 24, borderBottomColor: color.primary, borderBottomWidth: 2, color: color.title}}/>
    </Column></Animated.View>
  }
  
  {step == 2 &&
  <Animated.View entering={FadeInUp}>
      <Column style={{marginTop: 20,}}>
      <Title>Escolha um avatar</Title>
      <Label>A sua representação no estilo Mangá</Label>
      <ScrollView style={{marginHorizontal: -24, alignSelf: 'center', }}>
        <Row style={{marginTop: 20,}}>
          <Column style={{width: 130, marginTop: 40,}}>
          {geral.slice(0, 6).map((pic, index) => (
            <TouchableOpacity key={index} onPress={() => {setPicture(pic); setUrl(pic)}} >
            <Animated.Image
              entering={FadeInDown.delay(index * 200)}
              source={{uri: pic}}
              style={{ flexGrow: 1, aspectRatio: 1, transform: [{scale: url === pic ? 1.2 : 1}], height: 124, marginBottom: 10, borderRadius: 100, borderWidth: 4, borderColor: url === pic ? color.primary : color.off, }}
              />
            </TouchableOpacity>
        ))}
        </Column>

        <Column style={{width: 130}}>
          {geral.slice(6, 12).map((pic, index) => (
            <TouchableOpacity key={index} onPress={() => {setPicture(pic); setUrl(pic)}} >
            <Animated.Image
              entering={FadeInDown.delay(index * 400)}
              source={{uri: pic}}
              style={{ flexGrow: 1, aspectRatio: 1, transform: [{scale: url === pic ? 1.2 : 1}], height: 124, marginBottom: 10, borderRadius: 100, borderWidth: 4, borderColor: url === pic ? color.primary : color.off, }}
              />
            </TouchableOpacity>
        ))}
        </Column>
        
        <Column style={{width: 130,  marginTop: 70,}}>
          {geral.slice(12, 20).map((pic, index) => (
            <TouchableOpacity key={index} onPress={() => {setPicture(pic); setUrl(pic)}} >
            <Animated.Image
              entering={FadeInDown.delay(index * 600)}
              source={{uri: pic}}
              style={{ flexGrow: 1, aspectRatio: 1, transform: [{scale: url === pic ? 1.2 : 1}], height: 124, marginBottom: 10, borderRadius: 100, borderWidth: 4, borderColor: url === pic ? color.primary : color.off, }}
              />
            </TouchableOpacity>
        ))}
        </Column>
        
        </Row>


        </ScrollView>
      </Column>
    </Animated.View>
  }

{step == 3 &&
  <Animated.View entering={FadeInUp}>
      <Column style={{marginTop: 20,}}>
        <Title>Escolha uma capa</Title>
        <Label>Ela ficara no fundo do seu perfil</Label>
        <ScrollView  showsHorizontalScrollIndicator={false} style={{marginHorizontal: -24, }}>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Column style={{width: 50,}}/>
        {geralbg.slice(0,5).map((pic, index) => (
          <TouchableOpacity key={index} onPress={() => {setCapa(pic); setCapaUrl(pic);}}>
          <Animated.Image
          entering={FadeInDown.delay(index * 200)}
          source={{uri: pic}}
          style={{ flexGrow: 1,width: 260, height: 180, margin: 10, borderRadius: 8, borderWidth: 4, borderColor: capaUrl === pic ? color.primary : color.off, }}
          />
        </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
         {geralbg.slice(5,10).map((pic, index) => (
          <TouchableOpacity key={index} onPress={() => {setCapa(pic); setCapaUrl(pic);}}>
          <Animated.Image
          entering={FadeInDown.delay(index * 200)}
            source={{uri: pic}}
            style={{ flexGrow: 1,width: 260, height: 180, margin: 10, borderRadius: 8, borderWidth: 4, borderColor: capaUrl === pic ? color.primary : color.off, }}
          />
        </TouchableOpacity>
        ))}
      </ScrollView>

      
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <Column style={{width: 20,}}/>
         {geralbg.slice(10,15).map((pic, index) => (
          <TouchableOpacity key={index} onPress={() => {setCapa(pic); setCapaUrl(pic);}}>
          <Animated.Image
          entering={FadeInDown.delay(index * 200)}
            source={{uri: pic}}
            style={{ flexGrow: 1,width: 260, height: 180, margin: 10, borderRadius: 8, borderWidth: 4, borderColor: capaUrl === pic ? color.primary : color.off, }}
          />
        </TouchableOpacity>
        ))}
      </ScrollView>
        
        </ScrollView>

      </Column>
    </Animated.View>
  }

  {step == 4 && 
  <Animated.View entering={FadeInUp}>
  <Column style={{marginTop: 20,}}>
    <Title>O que você quer ver?</Title>
    <Label>Escolha até {8 - Number(selectedItems.length)} opções</Label>
    
    <Spacing/>
    <Column>
      <Label style={{fontSize: 24, color: color.title, textAlign: 'left', marginBottom: 10,}}>Genêros</Label>
      <Row style={{justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: 50,}}>
      {tags.map((item, index) => 
            <TouchableOpacity key={index} onPress={() => handleItemClick(item)} style={{width:'48%', justifyContent: 'center', marginBottom: 12, borderRadius: 6, height: 100, backgroundColor: !selectedItems.some(selectedItem => selectedItem.id === item.id) ? item?.color : '#ED274A', overflow: 'hidden', borderWidth: !selectedItems.some(selectedItem => selectedItem.id === item.id) ? 0 : 3, borderColor: !selectedItems.some(selectedItem => selectedItem.id === item.id) ? '#000' : '#fff',}}>
            <Title style={{fontSize: 24, fontFamily: font.medium, zIndex: 999, marginHorizontal: 12, textAlign: 'left'}}>{item.name}</Title>
            <Image style={{width: 60, height: 80, borderRadius: 12, position: 'absolute', right: -10, bottom: -10, transform: [{rotateZ: '-24deg'}],}} source={{uri: item?.img}} />
          </TouchableOpacity>
      )} 
      </Row>

      </Column>
    </Column>
    </Animated.View>}


    </Column>

    </Wrapper>
    <Row style={{justifyContent: 'space-between', width: '88%', marginHorizontal: 24, position: 'absolute', bottom: 20,}}>
      <VerAgora style={{marginTop: 20, backgroundColor: color.off,}} onPress={handleBack}>
        <AntDesign name='arrowleft' size={24} color={color.title} />
      </VerAgora>
      <VerAgora style={{marginTop: 20,}} onPress={handleNext}>
        <AntDesign name='arrowright' size={24} color={color.title} />
      </VerAgora>
    </Row>
    
  </Main>
  )
}

/**
 * 
      <Label style={{fontSize: 24, color: color.title, textAlign: 'left', marginBottom: 10,}}>Estilos</Label>
      <FlatList data={divided.styles} horizontal style={{marginHorizontal: -12, marginBottom:20,}} showsHorizontalScrollIndicator={false} renderItem={({item}) => (
                <TouchableOpacity onPress={() => handleItemClick(item)} style={{width:'48%', marginLeft: 12, marginBottom: 12, borderRadius: 6, height: 160, width: 130, backgroundColor: !selectedItems.some(selectedItem => selectedItem.id === item.id) ? item?.color : '#ED274A', overflow: 'hidden', borderWidth: !selectedItems.some(selectedItem => selectedItem.id === item.id) ? 0 : 3, borderColor: !selectedItems.some(selectedItem => selectedItem.id === item.id) ? '#FFF' : '#9C1D34',}}>
                  <Title style={{fontSize: 26, fontFamily: font.medium, zIndex: 999, marginTop: 15, marginHorizontal: 12, textAlign: 'center'}}>{item.name}</Title>
                  <Image style={{width: 80, height: 110, borderRadius: 12, position: 'absolute', alignSelf: 'center', bottom: -10, }} source={{uri: item?.img}} />
                </TouchableOpacity>
              )}/>
 * 
 */