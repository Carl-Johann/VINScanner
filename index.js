import React, { Component } from 'react';
import { StyleSheet, Text, View, AppRegistry, requireNativeComponent } from 'react-native';
import RNCameraView from './ios-native-components/RNCameraView'
class App extends Component {

  componentDidMount() {
    console.log("")
    console.log("App Successfully Loaded!")
    // console.log("height", Dimensions.get('window').height)
    // console.log("width", Dimensions.get('window').width)
  }


  render() {
    return  <RNCameraView
              style={styles.gradient}
              locations={[0, .5, 1.0]}
              colors={['#5ED2A0', 'red', '#339CB1']}
            />
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },

   gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  }
})

AppRegistry.registerComponent('VINScanner', () => App);
