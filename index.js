import React, { Component } from 'react';
import { StyleSheet, Text, SafeAreaView, View, AppRegistry, requireNativeComponent, NativeEventEmitter, NativeModules, Animated, Alert, ActionSheetIOS, TouchableOpacity } from 'react-native';
import RNCameraView from './ios-native-components/RNCameraView'
import Dimensions from 'Dimensions'
import SpinKit from './react-native-components/SpinKit'
import DetailBoxesView from './react-native-components/DetailBoxesView'
import amYellow from './react-native-components/colors'


export let firstDetailBoxDefaultHeight = 105
export let tallFirstDetailBoxDefaultHeight = 170

export let secondDetailBoxDefaultHeight = 135
export let tallSecondDetailBoxDefaultHeight = 200

export let detailBoxesMarginToEdge = Dimensions.get('window').width * 0.05
export let detailBoxesDefaultHeightOffset = -firstDetailBoxDefaultHeight - secondDetailBoxDefaultHeight - ( 2 * detailBoxesMarginToEdge )
var isAnimating = false
class App extends Component {

    state = {
        shouldShowFirstDetailBox: false , // false
        shouldShowScannedCharacters: null, //null
        scannedCharacters: "", // ""

        doesScannedStringExistInDB: null, //null
        scannedStringDBData: {}, // {}

        secondDetailBoxHeight: new Animated.Value(secondDetailBoxDefaultHeight), // 135
        firstDetailBoxHeight: new Animated.Value(firstDetailBoxDefaultHeight), // 120
        detailBoxesHeightOffset: new Animated.Value(detailBoxesDefaultHeightOffset), // detailBoxesDefaultHeightOffset
    }


    componentDidMount() {
        const moduleEvent = new NativeEventEmitter(NativeModules.VINModul)
        var RNCameraViewSwiftManager = NativeModules.RNCameraViewSwift;
        // this.animateDetailBoxesHeightOffset(detailBoxesDefaultHeightOffset + firstDetailBoxDefaultHeight + detailBoxesMarginToEdge)
        // setTimeout(() => {
        //     if (isAnimating == false) {
        //         // this.animateDetailBoxesHeightOffset(detailBoxesDefaultHeightOffset + firstDetailBoxDefaultHeight + detailBoxesMarginToEdge)
        //     }

        //     // Animated.timing( this.state.detailBoxesHeightOffset, { toValue:  detailBoxesDefaultHeightOffset + firstDetailBoxDefaultHeight + detailBoxesMarginToEdge, duration: 850}).start( () => {
        //         // console.log("4.1. Ending ShouldShowDataInFirstDetailBox")
        //         this.setState({
        //         //     // shouldShowFirstDetailBox: true,
        //         //     shouldShowScannedCharacters: null,
        //         //     scannedCharacters: "123456",
        //         })
        //     // })
        // }, 800)

        // setTimeout(() => {
        //     let lort = detailBoxesDefaultHeightOffset + firstDetailBoxDefaultHeight + secondDetailBoxDefaultHeight + ( 2 * detailBoxesMarginToEdge )
        //     this.setState({
        //             shouldShowFirstDetailBox: true,
        //             shouldShowScannedCharacters: true,
        //             scannedCharacters: "123456",
        //         })
        //     this.animateDetailBoxesHeightOffset(lort)
        // }, 1000)
        // this.setState({ shouldShowFirstDetailBox: true })
        // this.animateDetailBoxesHeightOffset(  detailBoxesDefaultHeightOffset + firstDetailBoxDefaultHeight + detailBoxesMarginToEdge )

        // Life cycle of data boxes
        // 1. This is the first box.    Shows it with a loading icon.
        moduleEvent.addListener('ShouldShowFirstDetailBox', response => {

            // console.log("1. Starting ShouldShowFirstDetailBox")
            // Animated.timing( this.state.detailBoxesHeightOffset, { toValue: detailBoxesDefaultHeightOffset + firstDetailBoxDefaultHeight + detailBoxesMarginToEdge }).start()
            this.setState({ shouldShowFirstDetailBox: true })
            this.animateDetailBoxesHeightOffset(  detailBoxesDefaultHeightOffset + firstDetailBoxDefaultHeight + detailBoxesMarginToEdge )

        })

        // 2. This is the first AND second box.    Shows the second box with loading icon if successful.
        moduleEvent.addListener('ShouldShowDataInFirstDetailBox', response => {
            var JSONResponse = JSON.stringify(response, null, 2)
            JSONResponse = JSON.parse(JSONResponse)
            console.log("ShouldShowDataInFirstDetailBox:", JSONResponse["ShouldShow"])

            this.setState({
                    shouldShowFirstDetailBox: true,
                    shouldShowScannedCharacters: JSONResponse["ShouldShow"],
                    scannedCharacters: JSONResponse["CleanedCharacters"],
                })

            if (JSONResponse["ShouldShow"] == false) {
            // If 'shouldShowVINDetail' = false, show 'Scan again' button

                // console.log("3.1. Starting ShouldShowDataInFirstDetailBox")
                Animated.parallel([
                    Animated.timing( this.state.detailBoxesHeightOffset, { toValue:  detailBoxesDefaultHeightOffset + firstDetailBoxDefaultHeight + detailBoxesMarginToEdge, duration: 850}),
                    Animated.timing( this.state.firstDetailBoxHeight, { toValue: tallFirstDetailBoxDefaultHeight }),
                ]).start( () => {
                    // console.log("4.1. Ending ShouldShowDataInFirstDetailBox")
                    // this.setState({
                    //     shouldShowFirstDetailBox: true,
                    //     shouldShowScannedCharacters: false,
                    //     scannedCharacters: JSONResponse["CleanedCharacters"],
                    // })
                })

            } else if (
                (String(JSONResponse["CleanedCharacters"]).length == 17)
                || (String(JSONResponse["CleanedCharacters"]).length == 6)
                || (String(JSONResponse["CleanedCharacters"]).length == 7)
            ) {
            // else if 'shouldShowVINDetail' = true, show the VIN from this.state.VIN
                // this.setState({
                //     shouldShowFirstDetailBox: true,
                //     shouldShowScannedCharacters: true,
                //     scannedCharacters: JSONResponse["CleanedCharacters"],
                // })
                // Animated.timing( this.state.detailBoxesHeightOffset, { toValue: detailBoxesDefaultHeightOffset + firstDetailBoxDefaultHeight + secondDetailBoxDefaultHeight + ( 2 * detailBoxesMarginToEdge ) }).start()
                    let lort = detailBoxesDefaultHeightOffset + firstDetailBoxDefaultHeight + secondDetailBoxDefaultHeight + ( 2 * detailBoxesMarginToEdge )
                    this.animateDetailBoxesHeightOffset(lort)
                    // if (this.animateDetailBoxesHeightOffset(lort) == false) {
                    //     setTimeout( () => {

                    //     }, 50 )
                    // }
                }
            // }
        })

        // 3. This is the second box.   This either shows an error or fills it with data.
        moduleEvent.addListener('ShouldShowDataInSecondDetailBox', response => {
            var JSONResponse = JSON.stringify(response, null, 2)
            JSONResponse = JSON.parse(JSONResponse)
            console.log(123, JSONResponse)

            if (JSONResponse["scannedStringDBData"] != "") {
            // If the VIN exists in the database, the database returns 'scannedStringDBData'
                Animated.timing( this.state.secondDetailBoxHeight, { toValue: tallSecondDetailBoxDefaultHeight }).start(() => {
                    this.setState({
                        scannedStringDBData: JSONResponse["scannedStringDBData"],
                        doesScannedStringExistInDB: true
                    })
                })
            } else {
            // else if the VIN wasnt in the database 'scannedStringDBData' is empty
                Animated.timing( this.state.secondDetailBoxHeight, { toValue: tallSecondDetailBoxDefaultHeight }).start(() => {
                    this.setState({
                        scannedStringDBData: JSONResponse["scannedStringDBData"],
                        doesScannedStringExistInDB: false,
                    })
                })
            }

        })
        // End of succesful life cycle of data boxes




        // These are error
        moduleEvent.addListener('hideAndResetEverything', response => {
            // 'checkScannedCharactersOrScanAgain' also works by hiding everything, showing the cameraView in swift and then resets state.
            // Also what we need here, so we reuse it
            Alert.alert(
                "An Error occured",
                "Something that shouldn't happen, happend",
                [{ text: "OK", onPress: () => { this.checkScannedCharactersOrScanAgain(true) } }]
            )
        })

        moduleEvent.addListener('NoDataReturnedFromGoogle', response => {
            // 'checkScannedCharactersOrScanAgain' also works by hiding everything, showing the cameraView in swift and then resets state.
            // Also what we need here, so we reuse it

            ActionSheetIOS.showActionSheetWithOptions({
                options: ['Scan Again'],
                title: "VIN Not Returned From Your Scan",
                message: "Try to reposition the camera, and if necessary block any sun reflections from hitting the windshield.",
                scanAgainButtonIndex: 0,
            },
                (buttonIndex) => {
                    if (buttonIndex === 0) { this.checkScannedCharactersOrScanAgain(true) }
                }
            );
        })
        // End of errors
    }


    animateDetailBoxesHeightOffset = (animation) => {
        if (isAnimating == true) {
            setTimeout( () => {
                this.animateDetailBoxesHeightOffset(animation)
            }, 1)


            // return false
        } else {
            isAnimating = true
            Animated.timing( this.state.detailBoxesHeightOffset, { toValue: animation, duration: 800 } ).start(() => { isAnimating = false })
            // return true
        }
    }

    // Also called as an error function for resetting the whole view. (moduleEvent.addListener('hideAndResetEverything'))
    checkScannedCharactersOrScanAgain = (ShouldScan) => {
        var distance = detailBoxesDefaultHeightOffset - 70

        Animated.timing( this.state.detailBoxesHeightOffset, { toValue: distance }).start( () => {
            NativeModules.RNCameraViewSwift.CheckDataOrScanAgain(ShouldScan)
            this.setState({
                detailBoxesHeightOffset: new Animated.Value(detailBoxesDefaultHeightOffset),
                secondDetailBoxHeight: new Animated.Value(secondDetailBoxDefaultHeight),
                firstDetailBoxHeight: new Animated.Value(firstDetailBoxDefaultHeight),
                shouldShowScannedCharacters: null,
                doesScannedStringExistInDB: null,
                shouldShowFirstDetailBox: false,
                scannedStringDBData: {},
                scannedCharacters: "",
            })
        })

    }


    screenWidth = () => { return Dimensions.get('window').width }
    screenHeight = () => { return Dimensions.get('window').height }
    widthTimes075 = () => { return this.screenWidth() * 0.75 }

    render() {
        const {
            shouldShowFirstDetailBox, shouldShowScannedCharacters, scannedCharacters,
            scannedStringDBData, doesScannedStringExistInDB, secondDetailBoxHeight,
            detailBoxesHeightOffset, firstDetailBoxHeight,
        } = this.state

        const {
            screenWidth, screenHeight, widthTimes075,
            checkScannedCharactersOrScanAgain,
        } = this



        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#282828' }}>
                <View style={ styles.container }>
                    <RNCameraView
                        style={ styles.camera }
                    />

                    { shouldShowFirstDetailBox && (
                        <Animated.View style={{ bottom: detailBoxesHeightOffset, marginBottom: detailBoxesMarginToEdge }}>
                            <DetailBoxesView
                                checkScannedCharactersOrScanAgain={ (shouldScan) => {
                                    checkScannedCharactersOrScanAgain(shouldScan)
                                }}
                                scannedCharacters={ scannedCharacters }
                                scannedStringDBData={ scannedStringDBData }

                                shouldShowScannedCharacters={ shouldShowScannedCharacters }
                                doesScannedStringExistInDB={ doesScannedStringExistInDB }

                                detailBoxesHeightOffset={ detailBoxesHeightOffset }
                                secondDetailBoxHeight={ secondDetailBoxHeight }
                                firstDetailBoxHeight={ firstDetailBoxHeight }
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
