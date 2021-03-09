import * as React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import Donate from '../Screens/Donate.js';
import Receiver from '../Screens/Receiver.js';

export const StackNav = createStackNavigator({
    Don:{
        screen:Donate,
        navigationOptions:{
            headerShown:false
        }
    },
    Rec:{
        screen:Receiver,
        navigationOptions:{
            headerShown:false,
        }
    }
},{
    initialRouteName:"Don"
}) 
