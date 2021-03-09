import * as React from 'react';
import { Text, View, StyleSheet , TouchableOpacity } from 'react-native';
import { DrawerItems } from 'react-navigation-drawer';
import firebase from 'firebase';
import db from '../Config.js';
import { Avatar } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';

export default class Drawer extends React.Component{
    constructor(){
        super();
        this.state = {
            userID : firebase.auth().currentUser.email,
            image : "#",
            name : ""
        }
    }
    componentDidMount(){
        this.fetchImage();
        this.fetchLoginedUser();
    }
    fetchLoginedUser=()=>{
        db
        .collection('users')
        .where("email","==",this.state.userID)
        .onSnapshot((snapshot)=>{
            snapshot.docs.map((doc)=>{
                 var temp = doc.data();
                 this.setState({
                    name:temp["firstname"]+" "+temp["lastname"]
                 })
            })
        })
    }
    fetchImage=()=>{
        firebase.storage().ref().child("userProfile/"+this.state.userID).getDownloadURL()
        .then((url)=>{
            this.setState({
                image : url
            })
            console.log(url);
        })
    }
    uploadImage = async (imgPath) => {
        var response = await fetch(imgPath);
        var blob = await response.blob();
        return firebase.storage().ref().child("userProfile/"+this.state.userID)
        .put(blob).then((response)=>{
            this.fetchImage();
        })
    }
    selectPicture = async () => {
        const {cancelled,uri} = await ImagePicker.launchImageLibraryAsync({
            mediaTypes : ImagePicker.MediaTypeOptions.All,
            allowEditing : true,
            aspect : [4,3],
            quality : 1
        })
        if(cancelled !== true){
            this.uploadImage(uri);
        }
    }
    render(){
        return(
            <View style={styles.container}>
                <View style={{ 
                    flex : 0.5,
                    alignItems : "center",
                    backgroundColor : "orange"
                    }}>
                    <Avatar 
                        rounded
                        source = {{
                            uri : this.state.image
                        }}
                        size = "medium"
                        onPress = {(()=>{
                            this.selectPicture();
                        })}
                        showEditButton
                        containerStyle = {styles.imageContainer}
                    />
                    <Text style = {{ fontWeight : 100 , fontSize : 20 , paddingTop : 10 }}>{this.state.name}</Text>
                </View>
                <View style={styles.drawerItemsContainer}>
                    <DrawerItems {...this.props}/>
                </View>
                <View style={styles.logOutContainer}>
                    <TouchableOpacity style={styles.logOutButton} onPress={()=>{
                        this.props.navigation.navigate('Login')
                        firebase
                        .auth()
                        .signOut()
                    }}>
                        <Text style={styles.logOutText}>logout</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

var styles = StyleSheet.create({
    container : { 
        flex:1 
    }, 
    drawerItemsContainer:{ 
        // marginTop:100, 
        flex:0.8 
    }, 
    logOutContainer : { 
        flex:0.2, 
        justifyContent:'flex-end', 
        paddingBottom:30 
    }, 
    logOutButton : { 
        height:30, 
        width:'100%', 
        justifyContent:'center', 
        padding:10 
    }, 
    logOutText:{ 
        fontSize: 30, 
        fontWeight:'bold' 
    },
    imageContainer: { 
        flex: 0.75, 
        width: "40%", 
        height: "20%", 
        marginLeft: 15, 
        marginTop: 30, 
        borderRadius: 40, 
    }
})