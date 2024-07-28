import React, { useEffect, useState} from "react";
import { Column, Row, Title, Label } from "@theme/global";
import { FlatList, Pressable } from "react-native";
import { addMangasToCollection, listCollections } from "@hooks/collections";
import { MotiImage, MotiView } from "moti";
import { useNavigation } from "@react-navigation/native";
import { Feather, Ionicons } from "@expo/vector-icons";

export default function ModalAddCollection({ item}) {
  const navigation = useNavigation();
  const manga = item;
  const [data, setData] = useState([]);
    useEffect(() => {
        listCollections().then((res) => {
            setData(res);
        })
    }, [])

  return (
    <Column style={{ padding: 20, position: 'relative'}}>
      <Row style={{ justifyContent: 'space-between', alignItems: 'center', marginVertical: 12, }}>
        <Title>Minhas coleções</Title>
          <Pressable onPress={() => {navigation.navigate('Collections')}}  style={{ paddingHorizontal: 24, paddingVertical: 10, borderRadius: 100, backgroundColor: "#f6f6f6", }}>
            <Title style={{ color: "#000", fontSize: 18, }}>Criar nova</Title>
          </Pressable>
      </Row>
     
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        numColumns={2}
        style={{ alignSelf: "center" }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <CollectionItem item={item} manga={manga}/>}
      />
    
    </Column>
  );
}



const CollectionItem = ({item, manga}) => {
  const [sucess, setsucess] = useState();
  const [disabled, setdisabled] = useState();
  const [select, setSelect] = useState();
  const addManga = () => { 
    addMangasToCollection(select, manga).then(res => {
      if(res){
        setsucess(true)
        setdisabled(true)
      }else{
        setsucess(false)
        setdisabled(true)
      }
    })
   }


  if(item.id === select){
    const cl = sucess === true ? "#27AE60" : sucess === false ? "#EB5757" : "#f6f6f6";
    return(
     
        <Pressable disabled={disabled} onPress={addManga} style={{ backgroundColor: cl, borderRadius: 6,  width: 150, height: 190, margin:10, justifyContent: 'center', alignItems: 'center', }}>
         
          {sucess === true && 
          <MotiView style={{ justifyContent: 'center', alignItems: 'center',  }} from={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}  transition={{type: 'spring',duration: 350,}}>
            <Feather name="check" size={54} color="#fff" />
            <Label style={{color: "#fff", fontSize: 18, marginTop: 6, textAlign: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 100, backgroundColor: '#ffffff30' }}>Salvo</Label>
          </MotiView> }
          {sucess === false && <MotiView style={{ justifyContent: 'center', alignItems: 'center',  }} from={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}  transition={{type: 'spring',duration: 350,}}>
          <Feather name="x" size={54} color="#fff" />
          <Label style={{color: "#fff", fontSize: 18, marginTop: 6, textAlign: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 100, backgroundColor: '#ffffff30'}}>Já está aqui</Label>
          </MotiView> }



          {sucess === undefined &&  <MotiView from={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}  transition={{type: 'spring',duration: 350,}}>
          <Ionicons name="add-outline" size={54} color="#27AE60" />
          </MotiView>}
        </Pressable>
    )
  }
  else{
return(
  <Pressable onPress={() => {setSelect(item.id)}}  style={{ margin: 10, borderRadius: 8, }}>
      <MotiImage source={{ uri: item.capa }} style={{ width: 150, height: 190, borderRadius: 8, }} />
      <Column style={{ paddingHorizontal: 10, paddingVertical: 8, backgroundColor: '#262626', marginHorizontal: 6, borderBottomLeftRadius: 6, borderBottomRightRadius: 6,}}>
          <Title style={{fontSize: 18,}}>{item.name}</Title>
          <Label style={{fontSize: 12, marginTop:2, }}>{item.mangas.length} • {item.date}</Label>
      </Column>
  </Pressable>
)
}}