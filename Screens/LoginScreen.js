import * as React from 'react';
import { StyleSheet, Text, View , TextInput , TouchableOpacity, Alert , Modal , KeyboardAvoidingView } from 'react-native';
import db from '../Config.js';
import firebase from 'firebase';
import  { ScrollView } from 'react-native-gesture-handler';
// import SantaView from '../components/lottieView.js';

export default class loginScreen extends React.Component{

  constructor(){
    super();
    this.state = {
      email:'',
      password:'',
      modalVisible:true,
      firstname:'',
      lastname:'',
      contactnumber:'',
      postalAddress:'',
      confirmPassword:'',
    }
  }

  showModal=()=>{
    return(
      <Modal animationType="fade" transparent={true} visible={this.state.modalVisible}>
        
          <View style={styles.modalContainer}>
            <ScrollView style={{
              width:"100%"
              }}>
              <KeyboardAvoidingView>
                <Text style={styles.buttonText}>RESGISTRATION</Text>
                <TextInput placeholder="firstname" value={this.state.firstname} onChangeText={(text)=>{
                  this.setState({firstname:text})
                }} style={styles.textInput}/>
                <TextInput placeholder="lastname" value={this.state.lastname} onChangeText={(text)=>{
                  this.setState({lastname:text})
                }} style={styles.textInput}/>
                <TextInput placeholder="contactnumber" value={this.state.contactnumber} onChangeText={(text)=>{
                  this.setState({contactnumber:text})
                }} style={styles.textInput}/>
                <TextInput placeholder="postalAddress" value={this.state.postalAddress} onChangeText={(text)=>{
                  this.setState({postalAddress:text})
                }} style={styles.textInput}/>
                <TextInput placeholder="email" value={this.state.email} onChangeText={(text)=>{
                  this.setState({email:text})
                }} style={styles.textInput}/>
                <TextInput placeholder="password" value={this.state.password} onChangeText={(text)=>{
                  this.setState({password:text})
                }} style={styles.textInput}/>
                <TextInput placeholder="confirmPassword" value={this.state.confirmPassword} onChangeText={(text)=>{
                  this.setState({confirmPassword:text})
                }} style={styles.textInput}/>
                <TouchableOpacity onPress={this.signUpButton} style={styles.saveButton}>
                  <Text style={styles.buttonText}>RESGISTER</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{
                  this.setState({modalVisible:false})
                }} style={styles.saveButton}>
                  <Text style={styles.buttonText}>CANCEL</Text>
                </TouchableOpacity>
              </KeyboardAvoidingView>
            </ScrollView>
          </View>
      </Modal>
    )
  }

  signUpButton = async () =>{
    if(this.state.email && this.state.password){
        firebase.auth().createUserWithEmailAndPassword(this.state.email,this.state.password)
        .then((response)=>{
          console.log("aswin");
          db
          .collection("users")
          .add({
            "firstname":this.state.firstname,
            "lastname":this.state.lastname,
            "contactnumber":this.state.contactnumber,
            "postalAddress":this.state.postalAddress,
            "email":this.state.email,
            "password":this.state.password,
            "confirmPassword":this.state.confirmPassword,
            "bookRequestActive":false
          })
          return Alert.alert("User added successfully","User will be directed to the login screen",[{text:"ok",onPress:()=>this.setState({modalVisible:false})}])
        })
        .catch((error)=>{
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorMessage,error)
          return Alert.alert(errorCode+":"+errorMessage)
        })
    }
    else{
      Alert.alert("Enter Users details");
    }
  }

  loginButton = async () => {
    if(this.state.email && this.state.password){
      try{
        const response = await firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email,this.state.password)
        if(response){
            this.props.navigation.navigate('Req')
        }
      }
      catch(error){
        console.log(error,"Host");
        switch(error.code){
          case "auth/users-not-found":Alert.alert("User does not exist");break;
          case "auth/invalid-email":Alert.alert("Incorrect E-mail/PassWord");break;
          default:Alert.alert("Error");break;
        }
      }
    }
  }

 render(){
    return(
        <View style={styles.container}>
          {this.showModal()}
          {/* <View>
            <SantaView/>
          </View> */}
          <View style={styles.inputView}>
            <TextInput placeholder="e-mail" style={styles.textInput} onChangeText={(text)=>{
              this.setState({email:text})
            }}/>
          </View>
          <View style={styles.inputView}>
            <TextInput placeholder="password" style={styles.textInput} onChangeText={(text)=>{
              this.setState({password:text})
            }}/>
          </View>
          <TouchableOpacity style={styles.saveButton} onPress={this.loginButton}>
              <Text style={styles.buttonText}>LOGIN</Text>
            </TouchableOpacity> 
        </View>
    )
 }
}

const styles=StyleSheet.create({
    textInput : {
        backgroundColor:"rgba(11,11,11,0.1)",
        borderRadius:15,
        borderColor:"black",
        width:200,
        justifyContent:"center",
      },
      buttonText : {
        textAlign : 'center',
        color : 'white'
      },
      saveButton: {
        backgroundColor: 'orange',
        justifyContent : 'center',
        alignSelf : 'center',
        borderWidth : 2,
        borderRadius : 15,
        marginTop:5,
        width : 200,
        height:50,
      },
      modalContainer:{ 
        flex:1, 
        borderRadius:20, 
        justifyContent:'center', 
        alignItems:'center', 
        backgroundColor:"#f0000f", 
        marginRight:30, 
        marginLeft : 30, 
        marginTop:80, 
        marginBottom:80, 
      },
      container: {
        flex:1,
        backgroundColor: '#fff', 
        alignItems: 'center', 
        justifyContent: 'center', 
      }, 
      inputView:{ 
        marginTop:10, 
        backgroundColor:"rgba(11,11,11,0.1)" 
      }, 
      submitButton:{ 
        backgroundColor:"red" , 
        justifyContent:"center", 
        padding:10, 
        marginTop:20, 
        marginLeft:0 
      },
})