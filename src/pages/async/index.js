import React, { useState, useEffect, useContext} from 'react';
import { getPreferences } from '../../api/user/preferences';
import { Main } from '../../theme/global';

const AsyncStatic = ({navigation}) => {
    useEffect(() =>{
        const fechtData = async () => {
            getPreferences().then(
              res => {
                if(res?.name){
                  navigation.navigate('Home')
                }else{
                  navigation.navigate('Onboarding')
                }
              }
            )
          }
          fechtData()
    }, [])
    return(
        <Main>
        </Main>
    )
}
export default AsyncStatic;