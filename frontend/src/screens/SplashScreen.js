import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useFocusEffect } from "@react-navigation/native"

import SignIn from './SignIn';

const SplashScreen = () => {

    const navigation = useNavigation();
  
    const handleNavigation = React.useCallback(() => {
      const timer = setTimeout(() => {
        navigation.navigate("signup");
      }, 2000);
  
      return () => clearTimeout(timer);
    }, [navigation]); 
  
    useFocusEffect(handleNavigation)

    return (

        <LinearGradient colors={["#3085FF", "#212A75"]} style={styles.container}>
            <View style={styles.imageContainer}>
                <Image source={require('../../assets/LogoAdog.png')} style={styles.logo} />
            </View>
        </LinearGradient>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',   
    
      },
      imageContainer: {
        alignItems: 'center',
        justifyContent:   
     'center',
      },
    logo: {
        width: 200,
        height: 200,
    },

});

export default SplashScreen;