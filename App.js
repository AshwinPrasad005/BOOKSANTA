import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import LoginScreen from './Screens/LoginScreen.js';
import { TabNavigator } from './components/TabNavigator.js';
import { DrawerNav } from './components/AppDrawerNav';
import { createAppContainer , createSwitchNavigator } from 'react-navigation';

export default class App extends React.Component{
  render(){
    return(
        <AppContainer/>
    )
  }
}

const SwitchNavigator = createSwitchNavigator({
  Login:LoginScreen,
  Draw:DrawerNav,
})

const AppContainer = createAppContainer(SwitchNavigator)