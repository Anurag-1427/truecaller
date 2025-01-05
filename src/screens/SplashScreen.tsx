import { View, Text, Image, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import { Colors } from '../utils/Constants'
import { resetAndNavigate } from '../utils/NavigationUtils'

const SplashScreen = () => {

    const tokenCheck = async () => {
        resetAndNavigate('AuthScreen')
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