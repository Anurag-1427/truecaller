import { MMKV } from 'react-native-mmkv';

// type Listener = (key: string) => void;

// export class MMKVFaker {
//     private data: { [key: string]: string | undefined } = {};
//     private listeners: Listener[] = [];

//     getString(key: string): string | undefined {
//         return this.data[key];
//     }

//     set(key: string, value: string): void {
//         this.data[key] = value;
//         this.notifyListeners(key);
//     }

//     delete(key: string): void {
//         delete this.data[key];
//         this.notifyListeners(key);
//     }

//     clearAll(): void {
//         this.data = {};
//         Object.keys(this.data).forEach(key => this.notifyListeners(key));
//     }

//     addOnValueChangedListener(listener: Listener): () => void {
//         this.listeners.push(listener);
//         return () => {
//             const index = this.listeners.indexOf(listener);
//             if (index > -1) {
//                 this.listeners.splice(index, 1);
//             }
//         }
//     }

//     private notifyListeners(key: string): void {
//         this.listeners.forEach(listener => listener(key));
//     }
// }

// export const storage = __DEV__ ? new MMKVFaker() : new MMKV({
//     id: 'my-app-storage',
//     encryptionKey: 'some_secret_key'
// });

export const storage = new MMKV({
    id: 'my-app-storage',
    encryptionKey: 'some_secret_key'
})

export const mmkvStorage = {
    setItem: (key: string, value: string) => {
        storage.set(key, value)
    },
    getItem: (key: string) => {
        const value = storage.getString(key);
        return value ?? null;
    },
    removeItem: (key: string) => {
        storage.delete(key);
    }
}