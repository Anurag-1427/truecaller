import { View, Text, Image, FlatList, RefreshControl } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import { useUserStore } from '../state/userStore'
import CustomSafeAreaView from '../components/global/CustomSafeAreaView';
import { getAbbrName } from '../utils/miscUtils';
import UserAvatar from '../components/ui/UserAvatar';
import CallLogs from '../utils/CallLogs';
import { MagnifyingGlassIcon } from 'react-native-heroicons/outline'
import { Colors } from '../utils/Constants';
import CallerItem from '../components/ui/CallerItem';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import ContactList from '../components/dashboard/ContactList';

const DashboardScreen: FC = () => {
    const { user } = useUserStore();
    const [callLogs, setCallLogs] = useState([]);
    const [isRefresh, setIsRefresh] = useState<boolean>(false);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

    const fetchRecentLogs = () => {
        CallLogs.getRecentLogs().then((logs: any) => {
            setCallLogs(logs);
            setIsRefreshing(false);
        }).catch((err) => {
            console.log(`Fetch recent callLogs error:`, err);
        })
    }

    useEffect(() => {
        fetchRecentLogs();
    }, [])

    const refreshHandler = async () => {
        setIsRefreshing(true);
        setIsRefresh(!isRefresh);
        fetchRecentLogs();
    }

    const renderCallers = ({ item }: any) => {
        console.log(`renderCaller: `, item)
        return (
            <CallerItem item={item} />
        )
    }


    console.log(`User data: `, user);
    console.log(`Call Logs: `, callLogs);
    return (
        <CustomSafeAreaView classStyle='px-2 py-1'>
            <View className='flex-row items-center justify-between'>
                <Image
                    source={require('../assets/images/logo_text.png')}
                    className='h-6 w-32 resize self-center'
                />
                <UserAvatar onPress={() => { }} text={getAbbrName(user?.name) || "UN"} />
            </View>

            <FlatList
                keyExtractor={(item: any) => item.id}
                renderItem={renderCallers}
                data={callLogs}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={refreshHandler} />
                }
                initialNumToRender={5}
                ListEmptyComponent={
                    <View className='mt-5 items-center'>
                        <View className='rounded-full bg-backgroundLight self-center p-5'>
                            <MagnifyingGlassIcon size={26} color={Colors.text} />
                        </View>
                        <Text className='mt-2 font-medium text-gray-500'>No Recent Call Logs</Text>
                    </View>
                }
                ListHeaderComponent={<DashboardHeader />}
                ListFooterComponent={<ContactList isRefresh={isRefresh} />}
                windowSize={5}
                showsVerticalScrollIndicator={false}
            />
        </CustomSafeAreaView>
    )
}

export default DashboardScreen