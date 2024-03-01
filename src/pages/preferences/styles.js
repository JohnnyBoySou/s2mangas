import styled from 'styled-components/native';
import {
    Surface,
    TouchableRipple
} from 'react-native-paper';


import {
    ImageBackground
} from 'react-native';

export const Main = styled.SafeAreaView`
  flex: 1;
  background: ${props => props.theme.background};

`

const BackgroundImage = styled.ImageBackground`
  flex: 1;
  width: 100%;
  height: 100%;
`;


export const Wrapper = styled.ScrollView`
  background: ${props => props.theme.color.background};
`;

export const Title = styled.Text`
  color: ${props => props.theme.color.title};
  font-size: 28px;
  text-align: center;
  font-family: ${props => props.theme.font.bold};
  `;


  
export const Subtitle = styled.Text`
  color: ${props => props.theme.color.title};
  font-size: 20px;
  text-align: center;
  font-family: ${props => props.theme.font.medium};
  margin-bottom: 10px;
  margin-top: 20px;
`;

export const Back = styled(TouchableRipple).attrs(() => ({
    borderless: true,
    rippleColor: "#FFFFFF90",
}))
    `
  background: ${props => props.theme.color.off};
  border-radius: 100px;
  padding: 12px;
  align-self: flex-start;
  margin-left: 0px;
  margin-bottom: 20px;
`

export const Label = styled.Text`
  color: ${props => props.theme.color.label};
  font-size: 16px;
  font-family: ${props => props.theme.font.book};
  margin-top: 5px;
  text-align:center;
`


export const Line = styled.View`
  width: 120%;
  height: 2px;
  margin: 0px -25px;
  background: ${props => props.theme.opacity.dois};
`
export const Logo = styled.Image`
  width: 48px;
  height: 48px;
  margin-left: -20px;
  border-radius: 6px;
`


export const Spacing = styled.View`
  width: 20px;
  height: 20px;
`





export const CloseLabel = styled.Text`
  color: ${props => props.theme.color.light};
  font-size: 18px;
  font-family: ${props => props.theme.font.medium};
`


export const Buttons = styled.View`
  flex-direction: row;
  margin-right: 20px;
  padding-top: 10px;
`



export const Button = styled(TouchableRipple).attrs(() => ({
    borderless: true,
    rippleColor: "#FFFFFF90",
}))
    `
  background: ${props => props.off ? "#EB5757" : "#5B72F2"};
  border-radius: 6px;
  padding-left: 16px;
  padding-top: 12px;
  padding-bottom: 12px;
  margin-top: 20px;
  align-content: center;
  flex-direction: row;
  justify-content: space-between;

`




export const ButtonLabel = styled.Text`
  color: ${props => props.theme.color.light};
  font-size: 20px;
  text-align: center;
  margin-top: 2px;
  flex-grow: 2;
  font-family: ${props => props.theme.font.medium};
`;

export const ButtonIcon = styled.View`
  width: 60px;
  border-left-color: #FFF;
  border-left-width: 2px;
  margin-top: -20px;
  margin-bottom: -20px;
`




export const Select = styled(TouchableRipple).attrs(() => ({
  borderless: true, 
  rippleColor: "#FFFFFF90",
}))`
  border-radius: 6px;
  padding-top: 8px;
  padding-bottom: 10px;
  padding-left: 12px;
  padding-right: 12px;
  margin-bottom: 10px;
  margin-right: 10px;
  flex-grow: 1;
`

export const SelectLabel = styled.Text`
  font-size: 16px;
  font-family: ${props => props.theme.font.medium};
  text-align: center;
`;


export const VerAgora = styled(TouchableRipple).attrs(() => ({
  borderless: true, 
  rippleColor: "#33333330"
}))`
  background: ${props => props.theme.color.primary};
  border-radius: 100px;
  justify-content: center;
  align-items: center;
  width: 54px;
  height: 54px;
  `
export const VerAgoraLabel = styled.Text`
  color: #fff;
  font-size: 18px;
  font-family: ${props => props.theme.font.medium};
  text-align: center;
`



export const Select2 = styled(TouchableRipple).attrs(() => ({
  borderless: true, 
  rippleColor: "#FFFFFF90",
}))`
  border-radius: 6px;
  background: ${props => props.activity ? "#ED274A" : "#421A21"};
  padding-top: 10px;
  padding-bottom: 12px;
  padding-left: 16px;
  padding-right: 16px;
  margin-bottom: 10px;
  margin-right: 10px;
  flex-grow: 1;
`

export const SelectLabel2 = styled.Text`
  font-size: 18px;
  color: ${props => props.activity ? "#FFF" : "#ED274A"};
  font-family: ${props => props.activity ? "Font_Bold" : "Font_Medium"};
  text-align: center;
`;