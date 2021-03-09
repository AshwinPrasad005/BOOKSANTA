import * as React from 'react';
import { Text, View, StyleSheet , TextInput , TouchableOpacity } from 'react-native';
import { Header , Card , Icon } from 'react-native-elements';
import db from '../Config.js';
import firebase from 'firebase';

export default class Receiver extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            userID:firebase.auth().currentUser.email,
            userName:'',
            recieverID:this.props.navigation.getParam('data')['userID'], 
            requestID:this.props.navigation.getParam('data')['requestID'], 
            bookName:this.props.navigation.getParam('data')['book name'], 
            reason_for_requesting:this.props.navigation.getParam('data')['reason'], 
            recieverName : '', 
            recieverContact : '', 
            recieverAddress : '', 
            recieverRequestDocID: ''
        }
    }

    componentDidMount(){
        console.log(this.props.navigation.getParam('data'));
        this.getReceiverInformation();
        this.fetchLoginedUser();
    }

    getReceiverInformation(){
        console.log(this.state.recieverID)
        db
        .collection('users')
        .where("email","==",this.state.recieverID)
        .onSnapshot((snapshot)=>{
            console.log(snapshot)
            snapshot.docs.map((doc)=>{
                var temp =  doc.data();
                console.log(temp)
                this.setState({
                    recieverAddress:temp["postalAddress"],
                    recieverContact:temp["contactnumber"],
                    recieverName:temp["firstname"]+" "+temp["lastname"]
                })
            })
        })
    }

    fetchLoginedUser(){
        db
        .collection('users')
        .where("email","==",this.state.userID)
        .onSnapshot((snapshot)=>{
            snapshot.docs.map((doc)=>{
                 var temp = doc.data();
                 this.setState({
                    userName:temp["firstname"]+" "+temp["lastname"]
                 })
            })
        })
    }

    updateBookStatus(){
        db
        .collection('donations')
        .add({
            bookName:this.state.bookName,
            requestID:this.state.requestID,
            requestBy:this.state.recieverID,
            donorID:this.state.userID,
            requestStatus:"Donor Interested",
        })
    }

    addNotifications(){
        db
        .collection("notifications")
        .add({
            requestID:this.state.requestID,
            targetUserID:this.state.recieverID,
            donorID:this.state.userID,
            bookName:this.state.bookName,
            date:firebase.firestore.FieldValue.serverTimestamp(),
            notificationStatus:"unread",
            message:this.state.userName + " has shown interest in donating the book"
        })
    }

    render(){
        return(
            <View>
                <View>
                    <Header 
                    leftComponent={<Icon name="arrow-left" type="font-awesome" color="#696969" size={25} onPress={()=>{
                        console.log(this.props.navigation);
                        this.props.navigation.goBack();
                      }}/>}
                    centerComponent = {{
                        text: 'Donate Books' ,
                        style:{
                            color:"#90a5a9",
                            fontSize:20,
                            fontWeight:'bold',
                        }
                }}
                    backgroundColor = "#eaf8fe"
                    />
                </View>
                <View>
                    <Card title={"Book Information"}>
                        <Card>
                            <Text>{this.state.bookName}</Text>
                        </Card>
                        <Card>
                            <Text>{this.state.reason_for_requesting}</Text>
                        </Card>
                    </Card>
                </View>
                <View>
                <Card title={"Receiver Information"}>
                        <Card>
                            <Text>{this.state.recieverID}</Text>
                        </Card>
                        <Card>
                            <Text>{this.state.recieverContact}</Text>
                        </Card>
                        <Card>
                            <Text>{this.state.recieverAddress}</Text>
                        </Card>
                    </Card>
                </View>
                <View>
                    {   
                        this.state.userID == this.state.recieverID
                        ?null
                        :(
                        <TouchableOpacity style = {styles.DonateButton} onPress={()=>{
                            this.addNotifications();
                            this.updateBookStatus();
                            this.props.navigation.navigate('MyDonations');
                        }}>
                            <Text style={styles.buttonText}>I Want To Donate</Text>
                        </TouchableOpacity>
                        )
                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    DonateButton : {
        backgroundColor: 'orange',
        justifyContent : 'center',
        alignSelf : 'center',
        borderWidth : 2,
        borderRadius : 15,
        marginTop:5,
        width : 200,
        height:50,
      },
      buttonText : {
        textAlign : 'center',
        color : 'white'
      },
})