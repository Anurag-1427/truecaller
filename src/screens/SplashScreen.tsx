import { View, Text, Image, ActivityIndicator } from 'react-native'
import React, { FC, useEffect } from 'react'
import { Colors } from '../utils/Constants'
import { resetAndNavigate } from '../utils/NavigationUtils'
import { storage } from '../state/storage'
import { jwtDecode } from 'jwt-decode'

interface DecodedToken {
    exp: number
}

const SplashScreen: FC = () => {

    const tokenCheck = async () => {
        const accessToken = storage.getString('accessToken') as string
        if (accessToken) {
            const decodedAccessToken = jwtDecode<DecodedToken>(accessToken);
            const currentTime = Date.now() / 1000;
            if (decodedAccessToken?.exp >= currentTime) {
                resetAndNavigate('DashboardScreen');
                return;
            }
        }
        resetAndNavigate('AuthScreen');
    }

    useEffect(() => {
        setTimeout(() => {
            tokenCheck()
        }, 1000)
    }, [])

    return (
        <View className='bg-white justify-center items-center flex-1'>
            <Image source={require('../assets/logo.png')} className='h-40 w-40 rounded-full' />
            <View className='absolute bottom-20'>
                <ActivityIndicator size='large' color={Colors.primary} />
            </View>
            <Text>SplashScreen</Text>
        </View>
    )
}

export default SplashScreen