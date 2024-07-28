import React, { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import { MotiImage } from 'moti';
import { getPreferences } from '@hooks/preferences';
import { useNavigation } from '@react-navigation/native';

export default function Avatar({ width = 64, height = 64, radius = 500, borderWidth = 2, borderColor = '#fff'}){
    const navigation = useNavigation();
    const [user, setUser] = useState();
    useEffect(() => {
      getPreferences().then(res => {
        setUser(res)
      })
    }, [])
    
    if(user?.avatar === undefined) {return null}
return(
    <Pressable onPress={() => {navigation.navigate('Account')}} >
        <MotiImage source={{ uri: user?.avatar}} style={{ width: width, height: height, borderRadius: radius, backgroundColor: "#303030", borderWidth: borderWidth, borderColor: borderColor,}}/>
    </Pressable>
    )}