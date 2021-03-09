import * as React from 'react';
import { Text, View, StyleSheet , TextInput , FlatList, TouchableOpacity } from 'react-native';
import { ListItem , Icon } from 'react-native-elements';
import db from '../Config.js';
import firebase from 'firebase';
import AppHeader from '../components/myHeader';

export default class MyDonation extends React.Component{
    constructor(){
        super();
        this.state = {
            userID:firebase.auth().currentUser.email,
            userName : '',
            donationList:[],
        }
    }
    render(){
        return(
            <View style = {{flex:1}}>
                <AppHeader title = "My Donations" navigation={this.props.navigation}/>
                <View style = {{flex:1}}>
                <FlatList
                    keyExtractor = {(item,index)=>index.toString()}
                    data = {this.state.donationList}
                    renderItem = {({item,i})=>(
                        <ListItem
                            key = {i}
                            title = {item["bookName"]}
                            subtitle = {"requested by : "+item["requestBy"]+" status : "+item["requestStatus"]}
                            titleStyle={{
                                color:"black",
                                fontWeight:"bold"
                            }}
                            rightElement = {
                                <TouchableOpacity onPress={()=>{
                                    this.sendBook(item);
                                }} style = {styles.Button}>
                                    <Text style={styles.buttonText}>{item["requestStatus"]
                                    =="Donor Interested"
                                    ?"Send Book"
                                    :"Book Sent"
                                }</Text>
                                </TouchableOpacity>
                            }
                            leftElement = {
                                <Icon name = "book" type="font-awesome" color ='#696969'/>
                            }
                        />
                    )}
                />
                </View>
            </View>
        )
    }
    componentDidMount() {
        this.getMyDonations();
        this.fetchLoginedUser();
    }
    getMyDonations=()=>{
        db
        .collection("donations")
        .where("donorID","==",this.state.userID)
        .onSnapshot((snapshot)=>{
            var temp = []
            snapshot.docs.map((doc)=>{
                var data = doc.data();
                data["docID"]=doc["id"]
                temp.push(data)
            })
            this.setState({
                donationList:temp
            })
        })
    }
    sendBook=(donationDetails)=>{
        console.log(donationDetails);
        if(donationDetails["requestStatus"]=="Donor Interested"){
            db
            .collection("donations")
            .doc(donationDetails["docID"])
            .update({
                requestStatus : "Book Sent"
            })
            this.sendNotification(donationDetails,"Book Sent");
        }
        else{
            db
            .collection("donations")
            .doc(donationDetails["docID"])
            .update({
                requestStatus : "Donor Interested"
            })
            this.sendNotification(donationDetails,"Donor Interested")
        }
    }
    sendNotification=(donationDetails,status)=>{
        db
        .collection("notifications")
        .where("donorID","==",donationDetails["donorID"])
        .where("requestID","==",donationDetails["requestID"])
        .get()
        .then((snapshot)=>{
            snapshot.docs.map((doc)=>{
                var message = "";
                if(status == "Donor Interested"){
                    message = this.state.userName + " has shown interest in donating the book"
                }
                else{
                    message = this.state.userName + " sent you the book";
                }
                db
                .collection("notifications")
                .doc(doc["id"])
                .update({
                    date : firebase.firestore.FieldValue.serverTimestamp(),
                    message : message,
                    notificationStatus : "unread"
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
}

const styles = StyleSheet.create({
    Button : {
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