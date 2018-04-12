import React, { Component } from 'react';
import { StyleSheet, Text, SafeAreaView, View, AppRegistry, requireNativeComponent, NativeEventEmitter, NativeModules, Animated, Alert, ActionSheetIOS, TouchableOpacity } from 'react-native';
import RNCameraView from './ios-native-components/RNCameraView'
import Dimensions from 'Dimensions'
import SpinKit from './react-native-components/SpinKit'
import VINDetailView from './react-native-components/VINDetailView'
import amYellow from './react-native-components/colors'


export let titleVINComponentHeight = 120
export let tallTitleVINComponentHeight = 195

export let VINComponentHeight = 135
export let tallDataFromVINComponentHeight = 200

export let marginToEdge = Dimensions.get('window').width * 0.05
export let hideAnimStartValue = -titleVINComponentHeight - VINComponentHeight - marginToEdge

// 1. shouldShowVINTitleDetail  false -> true | When the app is done scanning. BEFORE cropped image is sent to Google. Loading spinner going.
// 2. shouldShowVIN             false -> true | If Google could read a VIN. Else show a 'Scan Again' button
// 2.5                          ""    -> "VIN"| The VIN is set at the same time as 'shouldShowVIN'.
// 3. shouldShowVINDataDetail   false -> true | If 'shouldShowVIN' is true, we show the 'Car Details' box with a loading spinner in it.
// 4. DoesVINExist              false -> true | If the database returns data, a car exists, and we can show the user 'VINData'  by replacing the loading spinner.


class App extends Component {

    state = {
        shouldShowVINTitleDetail: false, // false
        shouldShowVIN: null, //null
        VIN: "", // ""


        shouldShowVINDataDetail: false, // false
        DoesVINExist: null, //null
        VINData: {}, // {}

        dataFromVINComponentHeight: new Animated.Value(VINComponentHeight), // 135
        VINTitleComponentHeight: new Animated.Value(titleVINComponentHeight),
        hideAnim: new Animated.Value(hideAnimStartValue),


        // shouldShowVINTitleDetail: true, // false
        // shouldShowVIN: null, //null
        // VIN: "W0LBD6EA0HG084887", // ""


        // shouldShowVINDataDetail: false, // false
        // DoesVINExist: null, //null
        // VINData: {"primary_key":1,"site":"HQ","chassis":"W0LBD6EA0HG084887","model":"ASTRA ENJOY 5D 1.0T 105HK MTA"}, // {}
        // // {"primary_key":1,"site":"HQ","chassis":"W0LBD6EA0HG084887","model":"ASTRA ENJOY 5D 1.0T 105HK MTA"}
        // dataFromVINComponentHeight: new Animated.Value(VINComponentHeight), // 135
        // VINTitleComponentHeight: new Animated.Value(titleVINComponentHeight),
        // hideAnim: new Animated.Value(hideAnimStartValue),
    }


    componentDidMount() {
        const moduleEvent = new NativeEventEmitter(NativeModules.VINModul)
        var RNCameraViewSwiftManager = NativeModules.RNCameraViewSwift;
        // Animated.timing( this.state.hideAnim, { toValue: hideAnimStartValue + 300 + this.screenWidth() * 0.05 }).start()

        // Call a function in swift
        moduleEvent.addListener('RaiseMissingCoordinatesAlert', response => {
            // console.log("Asked to raise ios native alert", JSON.stringify(response, null, 2))
            Alert.alert(
                "Scan Not Possible",
                "Looks like the whole VIN wasn't inside the rectangle",
                [{ text: "Try Again", onPress: () => { RNCameraViewSwiftManager.missingCoordinatesErrorFromJS(123) } }]
            )
        })

            // Animated.timing( this.state.hideAnim, { toValue: hideAnimStartValue + titleVINComponentHeight + marginToEdge  }).start()
        // 1. This is the first box
        moduleEvent.addListener('ShouldShowVinDetail', response => {
            this.setState({ shouldShowVINTitleDetail: true })

            Animated.timing( this.state.hideAnim, { toValue: hideAnimStartValue + titleVINComponentHeight + marginToEdge  }).start()
        })

        this.state.hideAnim.is
        // 2. This is the first box
        moduleEvent.addListener('VINIsAVIN', response => {
            var JSONResponse = JSON.stringify(response, null, 2)
            JSONResponse = JSON.parse(JSONResponse)


            if (JSONResponse["ShouldShow"] == false) {
            // If 'shouldShowVINDetail' = false, show 'Scan again' button

                this.setState({
                    shouldShowVINTitleDetail: true,
                    shouldShowVIN: false,
                    VIN: JSONResponse["VIN"],
                })
                Animated.parallel([
                    Animated.timing( this.state.hideAnim, { toValue: hideAnimStartValue + titleVINComponentHeight + marginToEdge }),
                    Animated.timing( this.state.VINTitleComponentHeight, { toValue: tallTitleVINComponentHeight }),
                ]).start()

            } else {
            // else if 'shouldShowVINDetail' = true, show the VIN from this.state.VIN

                if (String(JSONResponse["VIN"]).length == 17) {

                    this.setState({
                        shouldShowVINTitleDetail: true,
                        shouldShowVIN: true,
                        VIN: JSONResponse["VIN"],
                    })
                    Animated.timing( this.state.hideAnim, { toValue: hideAnimStartValue + titleVINComponentHeight + VINComponentHeight + ( 2 * marginToEdge ) }).start()
                } else if (String(JSONResponse["VIN"]).length >= 15) {


                    Animated.timing( this.state.VINTitleComponentHeight, { toValue: tallTitleVINComponentHeight }).start( () => {
                        this.setState({
                            shouldShowVINTitleDetail: true,
                            shouldShowVIN: true,
                            VIN: JSONResponse["VIN"],
                        })
                    })
                }
                // else {

                //     this.setState({
                //         shouldShowVINTitleDetail: true,
                //         shouldShowVIN: true,
                //         VIN: JSONResponse["VIN"],
                //     })
                //     Animated.timing( this.state.hideAnim, { toValue: hideAnimStartValue + titleVINComponentHeight + VINComponentHeight + ( 2 * marginToEdge ) }).start()
                // }

            }
        })


        // 3. This is the third box
        moduleEvent.addListener('DoesVINExistInDatabase', response => {
            var JSONResponse = JSON.stringify(response, null, 2)
            JSONResponse = JSON.parse(JSONResponse)


            if (JSONResponse["VINData"] != "") {
            // If the VIN exists in the database, the database returns 'VINData'
                Animated.timing( this.state.dataFromVINComponentHeight, { toValue: tallDataFromVINComponentHeight }).start(() => {
                    this.setState({
                        VINData: JSONResponse["VINData"],
                        DoesVINExist: true
                    })
                })
            } else {
            // else if the VIN wasnt in the database 'VINData' is empty
                Animated.timing( this.state.dataFromVINComponentHeight, { toValue: tallDataFromVINComponentHeight }).start(() => {
                    this.setState({
                        VINData: JSONResponse["VINData"],
                        DoesVINExist: false,
                    })
                })
            }

        })


        moduleEvent.addListener('hideAndResetEverything', response => {
            // 'checkVINOrScanAgain' also works by hiding everything, showing the cameraView in swift and then resets state.
            // Also what we need here, so we reuse it
            Alert.alert(
                "An Error occured",
                "Something that shouldn't happen, happend",
                [{ text: "OK", onPress: () => { this.checkVINOrScanAgain(true) } }]
            )
        })

        moduleEvent.addListener('VINNotReturned', response => {
            // 'checkVINOrScanAgain' also works by hiding everything, showing the cameraView in swift and then resets state.
            // Also what we need here, so we reuse it

            ActionSheetIOS.showActionSheetWithOptions({
                options: ['Scan Again'],
                title: "VIN Not Returned From Your Scan",
                message: "Try to reposition the camera, and if necessary block any sun reflections from hitting the windshield.",
                scanAgainButtonIndex: 0,
            },
                (buttonIndex) => {
                    if (buttonIndex === 0) { this.checkVINOrScanAgain(true) }
                }
            );
        })
    }


    // Also called as an error function for resetting the whole view. (moduleEvent.addListener('hideAndResetEverything'))
    checkVINOrScanAgain = (ShouldScan) => {
        var distance = hideAnimStartValue - 70


        Animated.timing( this.state.hideAnim, { toValue: distance }).start( () => {
            NativeModules.RNCameraViewSwift.checkVINOrScanAgain(ShouldScan)
            this.setState({
                VINTitleComponentHeight: new Animated.Value(titleVINComponentHeight),
                dataFromVINComponentHeight: new Animated.Value(VINComponentHeight),
                hideAnim: new Animated.Value(hideAnimStartValue),
                shouldShowVINTitleDetail: false,
                shouldShowVINDataDetail: false,
                shouldShowVIN: null,
                DoesVINExist: null,
                VINData: {},
                VIN: "",
            })
        })

    }


    screenWidth = () => { return Dimensions.get('window').width }
    screenHeight = () => { return Dimensions.get('window').height }
    widthTimes075 = () => { return this.screenWidth() * 0.75 }

    render() {
        const {
            shouldShowVINTitleDetail, shouldShowVIN, VIN,
            shouldShowVINDataDetail, VINData, DoesVINExist,
            dataFromVINComponentHeight, hideAnim, VINTitleComponentHeight
        } = this.state

        const {
            screenWidth, screenHeight, widthTimes075,
            checkVINOrScanAgain,
        } = this



        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
                <View style={ styles.container }>
                    {/*<View style={{ flex: 1, bottom: 0, height: 667, width: 100, backgroundColor: 'orange' }} />*/}
                    <RNCameraView
                        style={ styles.camera }
                        locations={[0, .5, 1.0]}
                        colors={['#5ED2A0', 'red', '#339CB1']}
                    />

                    { shouldShowVINTitleDetail && (
                        <Animated.View>
                            <VINDetailView
                                bottom={ hideAnim }
                                checkVINOrScanAgain={ (shouldScan) => { checkVINOrScanAgain(shouldScan) }}
                                VIN={ VIN }
                                VINData={ VINData }

                                shouldShowVIN={ shouldShowVIN }
                                DoesVINExist={ DoesVINExist }

                                hideAnim={ hideAnim }
                                dataFromVINComponentHeight={ dataFromVINComponentHeight }
                                VINTitleComponentHeight={ VINTitleComponentHeight }
                            />
                        </Animated.View>
                    ) }
                </View>
            </SafeAreaView>
        )
  }
}



const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,
        justifyContent :'flex-end',
        // backgroundColor: '#282828'
    },

    camera: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        flex: 1,
        // backgroundColor: '#282828'
    }
})

AppRegistry.registerComponent('VINScanner', () => App);
