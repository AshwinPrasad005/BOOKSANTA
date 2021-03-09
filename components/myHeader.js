import * as React from 'react';
import { Text , View , StyleSheet } from 'react-native';
import { Header , Icon , Badge } from 'react-native-elements';
import db from '../Config.js';
import firebase from 'firebase';

export default class AppHeader extends React.Component{
  
  constructor(props){
    super(props);
    this.state = {
      count : 0,
      userID : firebase.auth().currentUser.email,
    }
  }

  componentDidMount() {
    this.getNotificationCount();
  }

  getNotificationCount=()=>{
    db
    .collection('notifications')
    .where("notificationStatus","==","unread")
    .where("targetUserID","==",this.state.userID)
    .onSnapshot((snapshot)=>{
      var tempCount = 0;
      snapshot.docs.map((doc)=>{
        tempCount = tempCount + 1; 
      })
      this.setState({
        count : tempCount, 
      })
    })
  }

    render(){
        return(
            <Header leftComponent={<Icon name="bars" type="font-awesome" color="#696969" size={25} onPress={()=>{
              console.log(this.props.navigation);
              this.props.navigation.toggleDrawer();
            }}/>} centerComponent={{
              text:this.props.titles,
              style:{
                color: '#90A5A9', 
                fontSize:20,
                fontWeight:"bold"
              }
            }} 
            rightComponent={
            <View>
              <Icon name="bell" type="font-awesome" color="#696969" size={30} onPress={()=>{
                this.props.navigation.navigate('Notifications');
              }}/>
              <Badge value = {this.state.count} containerStyle = {{
                  position : "absolute",
                  top : - 4,
                  right : - 4,
                }} 
              />
            </View> 
            }
          />
        )
    }
}

const styles = StyleSheet.create({
    textContainer:{
      backgroundColor:"orange"
    },
    text:{
      color: 'white',
      padding: 20,
      fontSize: 22,
      fontWeight: 'bold',
      textAlign: 'center',
    }
  })