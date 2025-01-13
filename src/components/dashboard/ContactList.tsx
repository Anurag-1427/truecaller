import { View, Text, Platform, PermissionsAndroid, FlatList } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import CallerItem from '../ui/CallerItem';
import Contacts from 'react-native-contacts'
import { addMultipleContacts } from '../../service/authService';
import { Colors } from '../../utils/Constants';
import { MagnifyingGlassIcon, UserCircleIcon, UserIcon } from 'react-native-heroicons/outline';

const ContactList: FC<{ isRefresh: boolean }> = ({ isRefresh }) => {
    const [contacts, setContacts] = useState<any>([]);

    const renderCallers = ({ item }: any) => {
        return <CallerItem isContacts item={item} />
    }

    const fetchContacts = () => {
        Contacts.getAll().then(async contacts => {
            const contactSet = new Set();
            const formattedContacts = contacts.map(contact => {
                return contact.phoneNumbers.map((phone, index) => {
                    const cleanedNumber = phone.number.replace(/[^\d]/g, '')
                    const last10Digits = cleanedNumber.slice(-10);

                    if (!contactSet.has(last10Digits)) {
                        contactSet.add(last10Digits)
                        return {
                            index: index,
                            phoneNumber: last10Digits,
                            name: contact?.givenName + " " + (contact?.familyName || ""),
                            isSpam: false,
                            fraudCount: 0
                        }
                    }
                    return null;
                }).filter(Boolean)
            }).flat();

            setContacts(formattedContacts);
            await addMultipleContacts(formattedContacts);

        })
    }

    const fetchContactsPermission = async () => {
        if (Platform.OS === 'android') {
            const permission = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_CONTACTS
            )
            if (permission === PermissionsAndroid.RESULTS.GRANTED) {
                fetchContacts();
            }
            else {
                console.log(`Permission Denied`);
            }
        } else {
            const permission = await Contacts.requestPermission();
            if (permission === 'authorized') {
                fetchContacts();
            }
            else {
                console.log(`Permission Denied`);
            }
        }
    }

    useEffect(() => {
        fetchContactsPermission();
    }, [isRefresh])

    return (
        <View>
            <Text className='my-4 text-base text-text font-semibold'>Contacts</Text>
            <FlatList
                initialNumToRender={5}
                windowSize={5}
                data={contacts?.slice(0, 10) || []}
                keyExtractor={(item: any) => item.phoneNumber}
                renderItem={renderCallers}
                ListEmptyComponent={
                    <View className='mt-5 items-center'>
                        <View className='rounded-full bg-backgroundLight self-center p-5'>
                            <UserIcon size={26} color={Colors.text} />
                        </View>
                        <Text className='mt-2 font-medium text-gray-500'>No Contacts</Text>
                    </View>
                }
            />
        </View>
    )
}

export default ContactList