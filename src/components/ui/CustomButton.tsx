import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { FC } from 'react'

interface CustomButtonProps {
    title: string;
    loading: boolean;
    onPress: () => void;
}

const CustomButton: FC<CustomButtonProps> = ({
    title, loading, onPress
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={loading}
            activeOpacity={0.8}
            className='p-3 h-14 rounded-lg bg-primary justify-center items-center'
        >
            {
                loading ? <ActivityIndicator color='#fff' size='small' /> :
                    <Text className='text-lg font-semibold text-white'>{title}</Text>
            }
        </TouchableOpacity>
    )
}

export default CustomButton