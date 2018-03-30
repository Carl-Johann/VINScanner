import React, { Component } from 'react';
import { StyleSheet, Text, View, AppRegistry, requireNativeComponent, NativeEventEmitter, NativeModules, Animated, Alert } from 'react-native';
import RNCameraView from './ios-native-components/RNCameraView'
class App extends Component {

    state = {
        shouldShowVINDetail : false
    }


    componentDidMount() {
        console.log("")
        console.log("App Successfully Loaded!")
        const moduleEvent = new NativeEventEmitter(NativeModules.VINModul)

        // var subscription2 = moduleEvent.addListener('EventToJS', response => {
        //     console.log("JAVASCRIPT", JSON.stringify(response, null, 2))
        // })

        var RNCameraViewSwiftManager = NativeModules.RNCameraViewSwift;
        // RNCameraViewSwiftManager.alertFunction(2);

        moduleEvent.addListener('missingCoordinatesErrorFromJS', response => {
            console.log("Asked to raise ios native alert", JSON.stringify(response, null, 2))
            Alert.alert(
                "Scan Not Possible",
                "Looks like the whole VIN wasn't inside the rectangle",
                [
                    {text: "Try Again", onPress: () => RNCameraViewSwiftManager.alertFunction() }
                ]
            )

        })

        var subscription = moduleEvent.addListener('ReturnVIN', response => {
            console.log("JAVASCRIPT2", JSON.stringify(response, null, 2))
            this.setState({ shouldShowVINDetail: true })
        })
    }


  render() {
    const { shouldShowVINDetail } = this.state

    return (
        <View style={ styles.container }>
            <RNCameraView
                style={styles.gradient}
                locations={[0, .5, 1.0]}
                colors={['#5ED2A0', 'red', '#339CB1']}
            />
            { shouldShowVINDetail && (
                <Text>Showing detail</Text>
            ) }
        </View>
    )
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
