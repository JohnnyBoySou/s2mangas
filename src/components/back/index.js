import { AntDesign } from "@expo/vector-icons"
import { Pressable } from "react-native"
import { useNavigation } from "@react-navigation/native"

const BackButton = () => {
    const navigation = useNavigation()
    return (
        <Pressable onPress={() => navigation.goBack()} style={{width: 46, height: 46, borderRadius: 100, backgroundColor: "#303030", justifyContent: 'center', alignItems: 'center', }}>
            <AntDesign name="arrowleft" size={28} color="#fff" />
        </Pressable>
    )
}
export default BackButton;