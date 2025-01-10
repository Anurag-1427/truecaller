import React, { useEffect } from 'react'
import Navigation from './src/navigation/Navigation'
import { NativeModules } from 'react-native'
import { checkPermissions } from './src/utils/PhoneService';

const { CallScreeningModule } = NativeModules;

const App = () => {

  useEffect(() => {
    checkPermissions(CallScreeningModule);
  }, [])

  return (
    <Navigation />
  )
}

export default App