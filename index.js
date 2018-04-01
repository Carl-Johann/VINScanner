import React, { Component } from 'react';
import { StyleSheet, Text, View, AppRegistry, requireNativeComponent, NativeEventEmitter, NativeModules, Animated, Alert } from 'react-native';
import RNCameraView from './ios-native-components/RNCameraView'
import Dimensions from 'Dimensions'

class App extends Component {


    state = {
        shouldShowVINDetail: false,
        VINDetailHeight: new Animated.Value(Dimensions.get('window').height * -1)
    }
// Dimensions.get('window').height * -0.6

    componentDidMount() {
        console.log("")
        console.log("App Successfully Loaded!")
        const moduleEvent = new NativeEventEmitter(NativeModules.VINModul)

        // var subscription2 = moduleEvent.addListener('EventToJS', response => {
        //     console.log("JAVASCRIPT", JSON.stringify(response, null, 2))
        // })


        var RNCameraViewSwiftManager = NativeModules.RNCameraViewSwift;
        // RNCameraViewSwiftManager.alertFunction(2);

        moduleEvent.addListener('RaiseMissingCoordinatesAlert', response => {
            console.log("Asked to raise ios native alert", JSON.stringify(response, null, 2))
            Alert.alert(
                "Scan Not Possible",
                "Looks like the whole VIN wasn't inside the rectangle",
                [{ text: "Try Again", onPress: () => { console.log(123, RNCameraViewSwiftManager); RNCameraViewSwiftManager.missingCoordinatesErrorFromJS(123) }}]
            )
        })

        var subscription = moduleEvent.addListener('ShouldShowVinDetail', response => {
            console.log("JAVASCRIPT2", JSON.stringify(response, null, 2))
            this.setState({ shouldShowVINDetail: true })
            Animated.timing( this.state.VINDetailHeight, { toValue: Dimensions.get('window').width * 0.075 }).start()
        })

        var subscription2 = moduleEvent.addListener('VINExists', response => {
            console.log("JAVASCRIPT2", JSON.stringify(response, null, 2))

        })
    }


  render() {
    const { shouldShowVINDetail, VINDetailHeight } = this.state

    return (
        <View style={ styles.container }>
            <RNCameraView
                style={styles.gradient}
                locations={[0, .5, 1.0]}
                colors={['#5ED2A0', 'red', '#339CB1']}
            />
            { shouldShowVINDetail && (
                /*Dimensions.get('window').width * 0.075*/
                <Animated.View style={[ styles.VINDetailStyle, { bottom: VINDetailHeight, height: Dimensions.get('window').height * 0.6, width: Dimensions.get('window').width * 0.85,  }]} >
                    <Text style={styles.detailText}>VIN DETAIL</Text>

                </Animated.View>
            ) }
        </View>
    )
  }
}

const styles = StyleSheet.create({
    container: {
        // justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        justifyContent :'flex-end',
        backgroundColor: '#E5E5E5'
    },

    detailText: {
        fontFamily: 'AppleSDGothicNeo-SemiBold',
        color: '#555555',
        fontSize: 28,
    },

    VINDetailStyle: {
        backgroundColor: 'lightgray',

        borderRadius: 8,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 1.0,
        alignItems: 'center',
    },

    gradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: '#E5E5E5'
    }
})

AppRegistry.registerComponent('VINScanner', () => App);
