import * as React from 'react';
import { Text, View, StyleSheet , TextInput , TouchableOpacity , KeyboardAvoidingView , FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';
import AppHeader from '../components/myHeader';
import db from '../Config.js';
import * as firebase from 'firebase';
import { List } from 'react-native-paper';
import SwipeableFlatList from '../components/SwipeableFlatList';

export default class Nofications extends React.Component{

    constructor(){
        super();
        this.state = {
            targetUserID:firebase.auth().currentUser.email,
            notificationList:[],
        }
    }

    componentDidMount(){
        this.getNotifications();
    }
    
    getNotifications=()=>{
        db
        .collection('notifications')
        .where("targetUserID","==",this.state.targetUserID)
        .where("notificationStatus","==","unread")
        .onSnapshot((snapshot)=>{
            console.log(snapshot)
            var temp = []
            snapshot.docs.map((doc)=>{
                var tempData = doc.data();
                tempData["docID"]=doc.id
                temp.push(tempData)
            })
            this.setState({notificationList:temp});
            console.log(this.state.notificationList)
        })
    }
    
    render(){
        return(
            <View style={styles.cointainer}>
                <View style = {{
                    flex : 0.1
                }}>
                <AppHeader titles="Notifications" navigation={this.props.navigation}/>
                </View>
                <View style = {{
                    flex :0.9
                }}>
                {(
                    this.state.notificationList.length == 0
                )?(<View style = {{
                    flex:1,
                    justifyContent:"center",
                    alignItems:"center",
                }}>
                        <Text style={{
                            fontSize:25,
                        }}>No Notification</Text>
                    </View>
                ):(
                    <SwipeableFlatList notifications = {this.state.notificationList}/>
                )}    
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({ 
    container : { 
        flex : 1 
    } 
})