import * as React from 'react';
import { Text, View, StyleSheet , TextInput , TouchableOpacity , KeyboardAvoidingView , FlatList , TouchableHighlight } from 'react-native';
import AppHeader from '../components/myHeader';
import db from '../Config.js';
import * as firebase from 'firebase';
import { BookSearch } from 'react-native-google-books';

export default class Request extends React.Component{
    constructor(){
        super();
        this.state = {
            bookRequestActive:false,
            firstname : '',
            lastname : '',
            requestID:'',
            book:'',
            reason:'',
            status : '',
            docID : '',
            donorID : '',
            userID:firebase.auth().currentUser.email,
            bookList : [],
            showBook : false
        }
    }
    componentDidMount(){
        this.getBookRequest();
        this.getBookRequestActive();
    }
    getBookRequest=()=>{
        db
        .collection("request")
        .where("userID","==",this.state.userID)
        .where("status","==","requested")
        .onSnapshot((snapshot)=>{
            console.log(snapshot.docs.length,"@@",this.state.userID);
            snapshot.docs.map((doc)=>{
                var docData = doc.data();
                console.log(doc["id"]);
                this.setState({
                    book :  docData["book name"],
                    reason : docData["reason"],
                    status : docData["status"],
                    requestID : docData["requestID"],
                    docID : doc["id"]
                })
            })
        })
    }
    getBookRequestActive=()=>{
        db
        .collection("users")
        .where("email","==",this.state.userID)
        .get()
        .then((docList)=>{
            docList.docs.map((doc)=>{
                var docData = doc.data();
                this.setState({ bookRequestActive : docData["bookRequestActive"] })
            })
            console.log(this.state.bookRequestActive);
        })
    }
    createUniqueID=()=>{
        var a = Math.random()
        var b = a.toString(20)
        var c = b.substring(4)
        console.log(a,b,c)
        return Math
        .random()
        .toString(36)
        .substring(7)
    }
    addRequest=()=>{
        db
        .collection("request")
        .add({"book name":this.state.book,
              "fulfilled":false,
              "other":'',
              "reason":this.state.reason,
              "requestID":this.createUniqueID(),
              "status":"requested",
              "date":firebase.firestore.FieldValue.serverTimestamp(),
              "userID":this.state.userID
        })
        db
        .collection("users")
        .where("email","==",this.state.userID)
        .get()
        .then((snapshot)=>{
            snapshot.docs.map((doc)=>{
                var docID = doc["id"]
                db
                .collection("users")
                .doc(docID)
                .update({
                    bookRequestActive : true
                })
            })
        })
        this.setState({ bookRequestActive : true })
    }
    updateBookRequestStatus=()=>{
        db
        .collection("request")
        .doc(this.state.docID)
        .update({
            "fulfilled":true,
            "status" : "received",
        })
        db
        .collection("users")
        .where("email","==",this.state.userID)
        .get()
        .then((snapshot)=>{
            snapshot.docs.map((doc)=>{
                var docID = doc["id"];
                db
                .collection("users")
                .doc(docID)
                .update({
                    "bookRequestActive" : false,
                })
            })
        })
    }
    sentNotifications=()=>{
        db
        .collection("users")
        .where("email","==",this.state.userID)
        .get()
        .then((temp)=>{
            temp.docs.map((doc)=>{
                var docID = doc["id"];
                this.setState({
                    firstname : doc.data()["firstname"],
                    lastname : doc.data()["lastname"]
                })
                db
                .collection("notifications")
                .where("requestID","==",this.state.requestID)
                .get()
                .then((docList)=>{
                    docList.docs.map((doc)=>{
                        this.setState({ 
                            donorID : doc.data()["donorID"],
                            book : doc.data()["bookName"]
                        })
                        db
                        .collection("notification")
                        .add({
                            bookName : this.state.book,
                            date : firebase.firestore.FieldValue.serverTimestamp(),
                            donorID : this.state.donorID,
                            message : this.state.firstname + this.state.lastname + "received the " + this.state.book,
                            notificationStatus : "unread",
                            requestID : this.state.requestID,
                            targetUserID : this.state.donorID,
                        })
                    })
                })

            })
        })
    }
    googleBooksApi= async (booktext) => {
        if(bookName.length>2){
            var books = await BookSearch.searchbook(booktext,"AIzaSyCKjVHsA-kRZGiKlFLdGFr1CyLp62XjgFY")
            this.setState({ bookList : books , showBook : true })
            console.log(this.state.bookList);
        }
    }
    render(){
        if(this.state.bookRequestActive == false){
            return(
                <View style={{
                    flex:1
                }}>
                    <AppHeader titles="Request-Books" navigation={this.props.navigation}/>
                    <KeyboardAvoidingView style={styles.keyBoardStyle}>
                        <TextInput placeholder="book" 
                        value={this.state.book} 
                        onChangeText={(text)=>{
                            this.setState({book:text})
                            this.googleBooksApi(text);
                        }} 
                        style={styles.formTextInput}
                        onClear={()=>{
                            this.googleBooksApi("");
                        }}
                        />
                        <FlatList
                            keyExtractor = {(item,index)=>index.toString()}
                            data = {this.state.bookList}
                            renderItem={({item,i})=>(
                                <TouchableHighlight 
                                    activeOpacity = {0.6}
                                    underlayColor = "#dddddd"
                                    onPress = {(()=>{

                                    })}
                                >
                                    <Text></Text>
                                </TouchableHighlight>
                            )}
                        />
                        <TextInput placeholder="reason" value={this.state.reason} onChangeText={(text)=>{
                            this.setState({reason:text})
                        }} style={styles.formTextInput}/>
                        <TouchableOpacity style={styles.button} onPress={this.addRequest}>
                            <Text>Request</Text>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                </View>
            )
        }
        else{
            return(
                <View style={{
                    flex : 0.1
                }}>
                    <AppHeader titles="Book-Status" navigation={this.props.navigation}/>
                    <View>
                        <Text style={styles.buttonText}>Name of the Book :</Text>
                        <Text style={styles.buttonText}>{this.state.book}</Text>
                    </View>
                    <View>
                        <Text style={styles.buttonText}>Status :</Text>
                        <Text style={styles.buttonText}>{this.state.status}</Text>
                    </View>
                    <View>
                        <TouchableOpacity style = {styles.button} onPress={(()=>{
                            this.updateBookRequestStatus();
                            this.setState({
                                bookRequestActive : false,
                                book : '',
                                reason : '',
                            })
                        })}>
                            <Text style={styles.buttonText}>Book-Received</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
     keyBoardStyle : {
        flex:1, 
        alignItems:'center', 
        justifyContent:'center' 
    }, 
    formTextInput:{
        width:"75%", 
        height:35, 
        alignSelf:'center', 
        borderColor:'#ffab91', 
        borderRadius:10, 
        borderWidth:1, 
        marginTop:20, 
        padding:10, 
    }, 
    button:{ 
        width:"75%", 
        height:50, 
        justifyContent:'center', 
        alignItems:'center', 
        borderRadius:10, 
        backgroundColor:"#ff5722", 
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        }, 
        shadowOpacity: 0.44, 
        shadowRadius: 10.32, 
        elevation: 16, 
        marginTop:20 
    },
    buttonText : {
        textAlign : 'center',
        color : 'black'
    },         
})