import * as React from 'react';
import { Text, View, StyleSheet , TextInput } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import firebase from 'firebase';
import { Dimensions , Animated } from 'react-native';
import { ListItem , Icon } from 'react-native-elements';
import db from '../Config.js';

export default class SwipeableFlatList extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            allNotifications : this.props.notifications,
            userID : firebase.auth().currentUser.email,
        }
    }
    componentDidMount(){
        console.log(this.state.allNotifications)
    }
    render(){
        return(
            <View style={styles.container}>
                <SwipeListView 
                    disableRightSwipe
                    data = {this.state.allNotifications}
                    renderItem = {this.renderItem}
                    renderHiddenItem = {this.renderHiddenItem}
                    rightOpenValue = {-Dimensions.get("window").width}
                    previewRowKey = {"0"}
                    previewOpenValue = {-40}
                    previewOpenDelay = {3000}
                    onSwipeValueChange = {this.onSwipeValueChange}
                    keyExtractor = {(item,index)=>index.toString()}
                />
            </View>
        )
    }
    renderItem=(data)=>{
        console.log(data);
        return(
            <Animated.View>
                <ListItem
                    title = {data["item"]["bookName"]}
                    subtitle = {data.item["message"]}
                    titleStyle = {{
                        color:"black",
                        fontWeight:'bold'
                    }}
                    leftElement = {<Icon name = "book" type = "font-awesome" color = "#696969" />}
                    bottomDivider
                />
            </Animated.View>
        )
    }
    renderHiddenItem=()=>{
        return(
            <View style = {styles.rowBack}>
                <View style = {[styles.backRightBtn,styles.backRightBtnRight]}>
                    <Text style = {styles.backTextWhite}>mark as read</Text>
                </View>
            </View>
        )
    }
    onSwipeValueChange=(data)=>{
        const {key,value} = data;
        if(value < -Dimensions.get("window").width){
            const newData = [...this.state.allNotifications]
            this.updateMarkAsRead(this.state.allNotifications[key]);
            newData.splice(key,1);
            this.setState({
                allNotifications:newData
            })
        }
    }
    updateMarkAsRead=(data)=>{
        console.log(data)
        db
        .collection("notifications")
        .doc(data["docID"])
        .update({
            'notificationStatus':"read"
        })
    }
}

const styles = StyleSheet.create({ 
    container: { 
        backgroundColor: "white", 
        flex: 1 
    }, 
    backTextWhite: { 
        color: "#FFF", 
        fontWeight: "bold", 
        fontSize: 15, 
        textAlign: "center", 
        alignSelf: "flex-start" 
    }, 
    rowBack: {
        alignItems: "center", 
        backgroundColor: "#29b6f6", 
        flex: 1, 
        flexDirection: "row", 
        justifyContent: "space-between", 
        paddingLeft: 15 
    }, 
    backRightBtn: { 
        alignItems: "center", 
        bottom: 0, 
        justifyContent: "center", 
        position: "absolute", 
        top: 0, width: 100 
    }, 
    backRightBtnRight: { 
        backgroundColor: "#29b6f6", 
        right: 0 
    } 
});