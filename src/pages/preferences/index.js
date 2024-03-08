
import React, { useState, useContext, useEffect } from 'react'
import { Dimensions, Image, TouchableOpacity, TextInput, FlatList, ScrollView } from 'react-native'
import { AntDesign } from '@expo/vector-icons';
import {
  Wrapper, Title,
  Main,
  Label,
  VerAgora,
  Spacing,
} from './styles'
import { tags } from '../../api/tags/index';
import { ThemeContext } from 'styled-components/native'
import { Column, Row } from '../../theme/global'
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import axios from 'axios';
import { createPreferences } from '../../api/user/preferences';

export default function PreferencesPage({ navigation, route, }) {
  const [geral, setGeral] = useState();
  const [geralbg, setGeralbg] = useState();
  useEffect(() => {
    const fecthData = async () => {
      const ga = await axios.get('https://www.s2mangas.com/api/shop/avatar')
      setGeral(ga.data[4].geral)
      const gc = await axios.get('https://www.s2mangas.com/api/shop/capa')
      setGeralbg(gc.data[3].geralbg)
      }
    fecthData()
  }, [])


  const { color, font } = useContext(ThemeContext)
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState();
  const [capa, setCapa] = useState();
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
    if (step == 1) {
      if (name.length > 2) {
        setStep(2)
      }
    }
    else if (step == 2) {
      if (avatar) {
        setStep(3)
      }
    } else if (step == 3) {
      if (capa) {
        setStep(4)
      }
    }
    else if (step == 4) {
      if (selectedItems.length >= 1) {
        const params = {
          "items": selectedItems, 
          "name": name, 
          "avatar": avatar, 
          "capa": capa, 
          "bio": bio,  
          "progress": [],
          "complete": [],
          "likes": [],
          "follows": [],
          "marks": [],
          "history": [],
          "coins": 100,
          "diamonds": 5,
        }
        createPreferences(params).then(res => {
          if(res){
            navigation.navigate('Home')
          }
        })
      }
    }
  }

  const handleBack = () => {
    if (step == 1) {
      navigation.goBack()
    } else if (step == 2) { setStep(1) }
    else if (step == 3) { setStep(2) }
    else if (step == 4) { setStep(3) }
  }

  return (
    <Main>
      <Wrapper >
        <Column style={{ paddingHorizontal: 20, flex: 1, paddingTop: 50, }}>

          {step == 1 &&
            <Animated.View entering={FadeInUp}>
              <Column style={{ justifyContent: 'center', marginTop: 50, }}>
                <Title style={{ textAlign: 'left' }}>Qual seu nome?</Title>
                <Label style={{ textAlign: 'left' }}>Pode ser apelido também</Label>
                <TextInput value={name} placeholderTextColor={color.title + 70} placeholder='Ex.: Johnny' onChangeText={setName} style={{ fontFamily: font.medium, height: 63, backgroundColor: color.off, marginTop: 10, paddingLeft: 20, borderRadius: 5, fontSize: 28, borderBottomColor: color.primary, borderBottomWidth: 2, color: color.title }} />
                <Title style={{ marginTop: 40, textAlign: 'left' }}>Um pouco sobre você...</Title>
                <Label style={{ textAlign: 'left' }}>Escreva sua bio</Label>
                <TextInput value={bio} placeholderTextColor={color.title + 70} placeholder='Ex.: Gosto de mangás de ação' onChangeText={setBio} style={{ fontFamily: font.book, height: 63, backgroundColor: color.off, marginTop: 10, paddingLeft: 20, borderRadius: 5, fontSize: 24, borderBottomColor: color.primary, borderBottomWidth: 2, color: color.title }} />
              </Column></Animated.View>
          }

          {step == 2 &&
            <Animated.View entering={FadeInUp}>
              <Column style={{ marginTop: 20, }}>
                <Title>Escolha um avatar</Title>
                <Label>A sua representação no estilo Mangá</Label>
                <ScrollView style={{ marginHorizontal: -24, alignSelf: 'center', }}>
                  <Row style={{ marginTop: 20, flexWrap: 'wrap',  justifyContent: 'center',}}>
                      {geral?.map((pic, index) => (
                        <TouchableOpacity key={index} onPress={() => {  setAvatar(pic) }} >
                          <Image
                            source={{ uri: pic }}
                            style={{ aspectRatio: 1, transform: [{ scale: avatar === pic ? 1.2 : 1 }], height: 100, margin: 6, borderRadius: 100, borderWidth: 4, borderColor: avatar === pic ? color.primary : color.off, }}
                          />
                        </TouchableOpacity>
                      ))}
                  </Row>


                </ScrollView>
              </Column>
            </Animated.View>
          }

          {step == 3 &&
            <Animated.View entering={FadeInUp}>
              <Column style={{ marginTop: 20, }}>
                <Title>Escolha uma capa</Title>
                <Label>Ela ficara no fundo do seu perfil</Label>
                <ScrollView showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -24, }}>

                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <Column style={{ width: 50, }} />
                    {geralbg?.slice(0, 5).map((pic, index) => (
                      <TouchableOpacity key={index} onPress={() => {  setCapa(pic); }}>
                        <Image
                          source={{ uri: pic }}
                          style={{ flexGrow: 1, width: 260, height: 180, margin: 10, borderRadius: 8, borderWidth: 4, borderColor: capa === pic ? color.primary : color.off, }}
                        />
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {geralbg?.slice(5, 10).map((pic, index) => (
                      <TouchableOpacity key={index} onPress={() => { setCapa(pic);  }}>
                        <Image
                          source={{ uri: pic }}
                          style={{ flexGrow: 1, width: 260, height: 180, margin: 10, borderRadius: 8, borderWidth: 4, borderColor: capa === pic ? color.primary : color.off, }}
                        />
                      </TouchableOpacity>
                    ))}
                  </ScrollView>


                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <Column style={{ width: 20, }} />
                    {geralbg?.slice(10, 15).map((pic, index) => (
                      <TouchableOpacity key={index} onPress={() => { setCapa(pic);  }}>
                        <Image
                          source={{ uri: pic }}
                          style={{ flexGrow: 1, width: 260, height: 180, margin: 10, borderRadius: 8, borderWidth: 4, borderColor: capa === pic ? color.primary : color.off, }}
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
              <Column style={{ marginTop: 20, }}>
                <Title>O que você quer ver?</Title>
                <Label>Restam {8 - Number(selectedItems.length)} opções</Label>
                <Spacing />
                <Column>
                  <Row style={{flexWrap: 'wrap', marginBottom: 50, justifyContent: 'center' }}>
                    {tags?.map((item, index) =>
                      <TouchableOpacity key={index} onPress={() => handleItemClick(item)} style={{justifyContent: 'center', paddingHorizontal: 12, paddingVertical: 10, marginBottom: 12, marginRight: 8, borderRadius: 100,  backgroundColor: !selectedItems.some(selectedItem => selectedItem.id === item.id) ? "#303030" : '#ED274A', }}>
                        <Title style={{ fontSize: 18, fontFamily: font.book, zIndex: 999, marginHorizontal: 10, textAlign: 'left' }}>{item?.name}</Title>
                      </TouchableOpacity>
                    )}
                  </Row>
                </Column>
              </Column>
            </Animated.View>}


        </Column>

      </Wrapper>
      <Row style={{ justifyContent: 'space-between', width: '88%', marginHorizontal: 24, position: 'absolute', bottom: 20, }}>
        <VerAgora style={{ marginTop: 20, backgroundColor: color.off, }} onPress={handleBack}>
          <AntDesign name='arrowleft' size={24} color={color.title} />
        </VerAgora>
        <VerAgora style={{ marginTop: 20, }} onPress={handleNext}>
          <AntDesign name='arrowright' size={24} color={color.title} />
        </VerAgora>
      </Row>

    </Main>
  )
}
