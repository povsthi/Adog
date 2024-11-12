import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from 'expo-router';
import { getUserId } from './storage';

const SplashScreen = () => {
    const router = useRouter();
  
    useEffect(() => {
        const fetchUserId = async () => {
            const id = await getUserId();
            console.log("ID do usuário: " + id);
            //setIdUsuario(id);
            if(id){
              router.replace('/dashboard');
            }
          };
          fetchUserId();
        const timer = setTimeout(() => {
            router.replace('/signin'); 
        }, 2000);
    
        return () => clearTimeout(timer);
    }, [router]);

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
        justifyContent: 'center',
    },
    logo: {
        width: 200,
        height: 200,
    },
});

export default SplashScreen;
