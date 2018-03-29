import React, { Component } from 'react';
import { StyleSheet, Text, View, AppRegistry, requireNativeComponent, NativeEventEmitter, NativeModules } from 'react-native';
import RNCameraView from './ios-native-components/RNCameraView'
class App extends Component {

  componentDidMount() {
    console.log("")
    console.log("App Successfully Loaded!")
    console.log("native m", NativeModules)
    const moduleEvent = new NativeEventEmitter(NativeModules.VINModul)
    var subscription = moduleEvent.addListener('EventToJS', response => {
        console.log(123123123123)
        console.log(123123123123)
        console.log(123123123123)
        console.log(123123123123)
        console.log("JAVASCRIPT", JSON.stringify(response, null, 2))
    })
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
