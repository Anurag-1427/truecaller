import { FC, useEffect, useRef, useState } from "react";
import { Animated, Image, Linking, NativeEventEmitter, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { findUser, reportSpam } from "../../service/authService";
import { getAbbrName } from "../../utils/miscUtils";
import UserAvatar from "../ui/UserAvatar";
import { Colors, formatPhoneNumber } from "../../utils/Constants";
import { UserCircleIcon, XMarkIcon } from "react-native-heroicons/solid";
import { navigate } from "../../utils/NavigationUtils";
import { ChatBubbleOvalLeftEllipsisIcon, NoSymbolIcon, PhoneIcon } from "react-native-heroicons/outline";

const callScreeningEvents = new NativeEventEmitter();

const withIncomingCall = <P extends object>(WrappedComponent: React.ComponentType<P>): FC<P> => {
    const WithIncomingCallComponent: FC<P> = (props) => {

        const [incomingNumber, setIncomingNumber] = useState<string | undefined>();
        const [userInfo, setUserInfo] = useState<any>();
        const slideAnim = useRef(new Animated.Value(300)).current;
        const backdropAnim = useRef(new Animated.Value(300)).current;

        useEffect(() => {
            const subscriptions = callScreeningEvents.addListener("CallScreeningEvent", (phoneNumber) => {
                console.log(`phoneNumber in subscriptions: `, phoneNumber);
                const cleanedNumber = phoneNumber.replace(/[^\d]/g, '');
                const last10Digits = cleanedNumber.slice(-10);
                setIncomingNumber(last10Digits);
                slideUp(last10Digits);
            })
            return () => {
                subscriptions.remove();
            }
        }, [incomingNumber]);

        const slideUp = async (phoneNumber: string) => {
            try {
                const data = await findUser(phoneNumber);
                setUserInfo(data);
            } catch (error) {
                setUserInfo({
                    phoneNumber: phoneNumber,
                    name: "Unknown",
                    isSpam: false,
                })
                console.error(`Error in slide up: `, error);
            }
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 1200,
                    useNativeDriver: true,
                }),
                Animated.timing(backdropAnim, {
                    toValue: 0.9,
                    duration: 1200,
                    useNativeDriver: true
                }),
            ]).start();
        };

        const slideDown = async () => {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 300,
                    duration: 1200,
                    useNativeDriver: true,
                }),
                Animated.timing(backdropAnim, {
                    toValue: 0,
                    duration: 1200,
                    useNativeDriver: true
                }),
            ]).start(() => {
                setIncomingNumber(undefined);
                setUserInfo(undefined);
            })
        };

        let abbrName = userInfo?.name ? getAbbrName(userInfo?.name) : "UN";

        return (
            <View style={styles.container}>
                <WrappedComponent {...props} />
                {incomingNumber && <Animated.View style={[styles.backdrop, { opacity: backdropAnim }]} />}
                {
                    incomingNumber && (
                        <Animated.View style={[styles.subContainer, { transform: [{ translateY: slideAnim }] }]}>
                            <Image source={require('../../assets/logo_text.png')} className="w-20 my-2 h-4" tintColor='white' />

                            <View className="bg-[#202124] rounded-lg overflow-hidden">
                                <View className={`${userInfo?.isSpam ? "bg-error" : "bg-primary"}`}>
                                    <View className="flex-row justify-between p-4">
                                        <View className="flex-row items-center space-x-2">
                                            <UserAvatar isSpam={userInfo?.isSpam} text={abbrName} onPress={() => { }} />

                                            <View>
                                                <Text className="text-md font-semibold text-white">Incoming Call...</Text>
                                                <Text className="text-lg font-semibold text-white">{userInfo?.name || 'Unknown'}</Text>
                                                <Text className="text-md font-semibold text-white">{formatPhoneNumber(incomingNumber?.slice(-10)) || ''}</Text>
                                            </View>

                                        </View>
                                        <TouchableOpacity
                                            className="p-1 items-center justify-center self-start rounded-full bg-white"
                                            onPress={slideDown}
                                        >
                                            <XMarkIcon size={16} color={Colors.primary} />
                                        </TouchableOpacity>
                                    </View>
                                    <TouchableOpacity
                                        style={{ backgroundColor: 'rgba(255,255,255,0.3)' }}
                                        className="rounded-md flex-row items-center space-x-2 justify-center p-2 m-2"
                                        onPress={() => {
                                            navigate('CallerScreen', { item: userInfo });
                                            slideDown();
                                        }}
                                    >
                                        <UserCircleIcon color={'#fff'} size={22} />
                                        <Text className="font-semibold text-white text-lg">View Profile</Text>
                                    </TouchableOpacity>
                                </View>
                                <View className="flex-row items-center w-full">
                                    <TouchableOpacity
                                        className="items-center p-4 justify-center w-1/3"
                                        onPress={() => Linking.openURL(`tel:${userInfo?.phoneNumber}`)}
                                    >
                                        <PhoneIcon color={'#eee'} size={22} />
                                        <Text className="text-gray-300 text-md font-bold text-center">CALL</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        className="items-center p-4 justify-center w-1/3"
                                        onPress={() => Linking.openURL(`sms:${userInfo?.phoneNumber}`)}
                                    >
                                        <ChatBubbleOvalLeftEllipsisIcon color={'#eee'} size={22} />
                                        <Text className="text-gray-300 text-md font-bold text-center">MESSAGE</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        className="items-center p-4 justify-center w-1/3"
                                        onPress={async () => {
                                            try {
                                                await reportSpam(userInfo?.phoneNumber)
                                            } catch (error) {
                                                console.log(`WithIncomingCall report spam error: `, error);
                                            }
                                        }}
                                    >
                                        <NoSymbolIcon color={'#eee'} size={22} />
                                        <Text className="text-gray-300 text-md font-bold text-center">SPAM</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <Text className="font-extrabold text-md text-center my-2 mt-8 text-teal-200">ADVERTISEMENT</Text>
                            {/* <Image source={require('../../assets/images/banner.jpeg')} className='rounded-lg self-center m-2 w-full h-24' /> */}
                        </Animated.View>
                    )
                }
            </View>
        )
    }
    return WithIncomingCallComponent
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.9)',
        zIndex: 1
    },
    subContainer: {
        position: 'absolute',
        bottom: '10%',
        width: '100%',
        padding: 10,
        zIndex: 2
    }
})

export default withIncomingCall;