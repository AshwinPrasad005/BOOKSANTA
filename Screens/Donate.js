import * as React from 'react';
import { Text, View, StyleSheet , TouchableOpacity , FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';
import db from '../Config.js';
import AppHeader from '../components/myHeader';
import firebase from 'firebase';

export default class Donate extends React.Component{
    constructor(){
        super();
        this.state = {
            requestList:[],
        }
    }
    componentDidMount() {
        this.getRequest();
    }
    getRequest(){
        db
        .collection("request")
        .onSnapshot((datafromdb)=>{
            console.log(datafromdb)
            var temp = [];
            datafromdb.docs.map((map)=>{
               temp.push(map.data())
            })
            this.setState({requestList:temp})
        })
    }
    render(){
        return(
            <View>
                <AppHeader titles="Donate-Books" navigation={this.props.navigation}/>
                <FlatList 
                keyExtractor = {(item,index)=>index.toString()}
                data = {this.state.requestList}
                renderItem={({item,i})=>(
                    <ListItem
                    key={i}
                    title={item["book name"]}
                    subtitle={item.reason}
                    titleStyle={{
                        color:"black",
                        fontWeight:"bold"
                    }}
                    rightElement={
                        <TouchableOpacity style={styles.button} onPress={()=>{
                            console.log('book')
                            this.props.navigation.navigate('Rec',{data:item});
                        }}>
                            <Text style={{color:"white"}}>View</Text>
                        </TouchableOpacity>
                    }
                    />
                )}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    subContainer:{
        flex:1, 
        fontSize: 20, 
        justifyContent:'center', 
        alignItems:'center' 
    }, 
    button:{ 
        width:100, 
        height:30, 
        justifyContent:'center', 
        alignItems:'center', 
        backgroundColor:"#ff5722", 
        shadowColor: "#000", 
        shadowOffset: { 
            width: 0, 
            height: 8 
        } 
    } 
})