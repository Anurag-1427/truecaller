/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import notifee from '@notifee/react-native';
import {findUser} from './src/service/authService';
import {storage} from './src/state/storage';

notifee.onForegroundEvent(({type, detail}) => {});
notifee.onBackgroundEvent(async ({type, detail}) => {});

async function onDisplayNotification(user) {
  await notifee.requestPermission();
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });
  await notifee.displayNotification({
    title: `Call From ${user?.name ?? 'Unknown'}`,
    body: `${user?.phoneNumber}`,
    android: {
      channelId,
    },
  });
}

const handleIncomingCall = async data => {
  console.log(`data in handleIncomingCall: `, data);
  const accessToken = storage.getString('accessToken');
  if (accessToken) {
    const phoneNumber = data?.phoneNumber;
    const cleanedNumber = phoneNumber.replace(/[^\d]/g, '');
    const last10Digits = cleanedNumber.slice(-10);
    const user = await findUser(last10Digits);
    onDisplayNotification(user);
  }
};

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerHeadlessTask(
  'CallBackgroundMessaging',
  () => handleIncomingCall,
);
