import { View, Text, KeyboardAvoidingView, Image } from 'react-native'
import React, { FC, useState } from 'react'
import CustomSafeAreaView from '../components/global/CustomSafeAreaView';
import CustomInput from '../components/ui/CustomInput';
import CustomButton from '../components/ui/CustomButton';

const AuthScreen: FC = () => {
    const [phone, setPhone] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleAuth = async () => { }

    return (
        <KeyboardAvoidingView
            className='flex-1'
            keyboardVerticalOffset={10}
            behavior='padding'
        >
            <CustomSafeAreaView classStyle='py-2 px-2'>
                <Image source={require('../assets/logo_text.png')}
                    className='h-6 w-32 resize self-center'
                />

                <Text className='mt-6 font-semibold text-lg text-text'>Enter your phone number</Text>
                <Text className='mb-8 mt-2 text-md text-text'>Truecaller will send you a one-time password via SMS to verify your phone number.</Text>

                <CustomInput
                    label='Phone number (+91)'
                    value={phone}
                    maxLength={10}
                    keyboardType='number-pad'
                    placeholder='Your phone number'
                    onChangeText={setPhone}
                />

                <View className='bottom-1 absolute w-full self-center'>
                    <CustomButton
                        title='Continue'
                        onPress={handleAuth}
                        loading={loading}
                    />
                </View>
            </CustomSafeAreaView>
        </KeyboardAvoidingView>
    )
}

export default AuthScreen