import React, { useEffect, useState} from "react";
import { Column, Row, Title, Label } from "../../theme/global";
import { FlatList, Pressable } from "react-native";
import { listCollections } from "../../api/collections";
import { MotiImage } from "moti";

export default function ModalAddCollection() {
  const [data, setData] = useState([]);
    useEffect(() => {
        listCollections().then((res) => {
            setData(res);
        })
    }, [])
  return (
    <Column>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        numColumns={2}
        style={{ alignSelf: "center" }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <CollectionItem item={item} />}
      />
    </Column>
  );
}




const CollectionItem = ({item}) => {
return(
  <Pressable   style={{ margin: 10, borderRadius: 8,}}>
      <MotiImage source={{ uri: item.capa }} style={{ width: 150, height: 190, borderRadius: 8, }} />
      <Column style={{ paddingHorizontal: 10, paddingVertical: 8, backgroundColor: '#262626', marginHorizontal: 6, borderBottomLeftRadius: 6, borderBottomRightRadius: 6,}}>
          <Title style={{fontSize: 18,}}>{item.name}</Title>
          <Label style={{fontSize: 12, marginTop:2, }}>{item.mangas.length} • {item.date}</Label>
          <Spacer height={4} />
      </Column>
  </Pressable>
)
}