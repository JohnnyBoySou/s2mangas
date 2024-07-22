import React, { useContext, useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { Main, Scroll, Column, Label, Title, Row, Button } from '@theme/global';
import { ThemeContext } from 'styled-components/native';

import { useOAuth } from '@clerk/clerk-expo';

export default function LoginPage({ navigation, }) {
    const { color, font, } = useContext(ThemeContext);
    const [loading, setloading] = useState(false);
    const googleOAuth = useOAuth({ strategy: 'oauth_google' });

    async function onGoogleSignIn() {
        try {
            setloading(true)

            const oAuthFlow = await googleOAuth.startOAuthFlow();

            if (oAuthFlow.authSessionResult?.type === 'success') {
                if(oAuthFlow.setActive){
                    await oAuthFlow.setActive({ session: oAuthFlow.createdSessionId})
                }
            }else{
                setloading(false)
            }
        } catch (error) {
            console.log(error)
        } finally{
            setloading(false)
        }
    }
    return (
        <Main>
            <Scroll>

                <Column>
                    <Button onPress={onGoogleSignIn}>
                        <Label>Entrar com o Google</Label>
                    </Button>
                </Column>
            </Scroll>

        </Main>
    )
}