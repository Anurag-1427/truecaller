import { View, Text, Image } from 'react-native'
import React, { FC } from 'react'
import { useUserStore } from '../state/userStore'
import CustomSafeAreaView from '../components/global/CustomSafeAreaView';
import { getAbbrName } from '../utils/miscUtils';
import UserAvatar from '../components/ui/UserAvatar';

const DashboardScreen: FC = () => {
    const { user } = useUserStore();
    console.log(user);
    return (
        <CustomSafeAreaView classStyle='px-2 py-1'>
            <View className='flex-row items-center justify-between'>
                <Image
                    source={require('../assets/images/logo_text.png')}
                    className='h-6 w-32 resize self-center'
                />
                <UserAvatar onPress={() => { }} text={getAbbrName(user?.name) || "UN"} />
            </View>
        </CustomSafeAreaView>
    )
}

export default DashboardScreen