import axios from 'axios';
import { Platform } from 'react-native';

// FOR EMULATOR OR SIMULATOR
export const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000/user' : 'http://localhost:3000/user';

// FOR PHYSICAL DEVICE
// export const BASE_URL = 'http://192.168.29.88:300/user' // IP Address