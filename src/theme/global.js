import { useContext } from "react";
import {  TouchableRipple } from 'react-native-paper';
import  styled , { ThemeContext } from "styled-components/native";

export const useTheme = () => {
    const { color, font, margin } = useContext(ThemeContext);
    return { color, font, margin };
}


export const Main = styled.SafeAreaView`
  flex: 1;
  background: ${props => props.theme.background};
`
export const Scroll = styled.ScrollView`
  flex: 1;
`

export const View = styled.View`

`
export const Row = styled.View`
  flex-direction: row;
  display: flex;
`

export const Column = styled.View`
  flex-direction: column;
  display: flex;
`

export const Spacer = ({ height = 16, width = 16, }) => <Column style={{ height, width }} />


export const Button = styled(TouchableRipple).attrs(() => ({
  borderless: true, 
  rippleColor: "#FFFFFF90",
}))`
`


export const ButtonLabel = styled.Text`
  color: ${props => props.theme.color.light};
  font-size: 18px;
  text-align: center;
  margin-top: 8px;
  flex-grow: 2;
  font-family: ${props => props.theme.font.medium};
`;

export const ButtonIcon = styled.View`
  width: 50px;
  border-left-color: #FFF;
  border-left-width: 2px;
  margin-top: -20px;
  margin-bottom: -20px;
`

export const Spacing = styled.View`
  width: 20px;
  height: 20px;
`

export const Label = styled.Text`
  color: ${props => props.theme.color.label};
  font-size: 18px;
  font-family: ${props => props.theme.font.book};
`;

export const Title = styled.Text`
  color: ${props => props.theme.color.title};
  letter-spacing: -.5px;
  font-size: 24px;
  font-family: ${props => props.theme.font.bold};
`;

export const AuthorLabel = styled.Text`
  color: ${props => props.theme.color.secundary};
  font-size: 18px;
  font-family: ${props => props.theme.font.medium};
`;



export const BtCircle = styled(TouchableRipple).attrs(() => ({
  borderless: true, 
  rippleColor: "#FFFFFF90",
}))`
  background: ${props => props.theme.color.primary};
  border-radius: 100px;
  align-items: center;
  text-align: center;
  justify-content: center;
  `


  export const HeadTitle = styled.Text`
  color: ${props => props.theme.color.title};
  font-size: 22px;
  font-family: ${props => props.theme.font.medium};
`


