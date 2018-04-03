import React, { Component } from 'react';
import { StyleSheet, Text, SafeAreaView, View, AppRegistry, requireNativeComponent, NativeEventEmitter, NativeModules, Animated, Alert, TouchableOpacity } from 'react-native';
import RNCameraView from './ios-native-components/RNCameraView'
import Dimensions from 'Dimensions'
import SpinKit from './react-native-components/SpinKit'
import VINDetailView from './react-native-components/VINDetailView'

let amYellow = "#ffb307"
let hideAnimStartValue = -255 - (Dimensions.get('window').width * 0.05)

// 1. shouldShowVINTitleDetail  false -> true | When the app is done scanning. BEFORE cropped image is sent to Google. Loading spinner going.
// 2. shouldShowVIN             false -> true | If Google could read a VIN. Else show a 'Scan Again' button
// 2.5                          ""    -> "VIN"| The VIN is set at the same time as 'shouldShowVIN'.
// 3. shouldShowVINDataDetail   false -> true | If 'shouldShowVIN' is true, we show the 'Car Details' box with a loading spinner in it.
// 4. DoesVINExist              false -> true | If the database returns data, a car exists, and we can show the user 'VINData'  by replacing the loading spinner.
// Animated.timing( this.state.VINDetailHeight, { toValue: Dimensions.get('window').width * 0.075 }).start( )


class App extends Component {

    state = {
        shouldShowVINTitleDetail: false, // false
        shouldShowVIN: null, //null
        VIN: "", // ""


        shouldShowVINDataDetail: false, // false
        DoesVINExist: null, //null
        VINData: {}, // {}
        // {"primary_key":1,"site":"HQ","chassis":"W0LBD6EA0HG084887","model":"ASTRA ENJOY 5D 1.0T 105HK MTA"}
        dataFromVINComponentHeight: new Animated.Value(135), // 135
        VINDetailHeight: new Animated.Value(Dimensions.get('window').height * -1), // Dimensions.get('window').height * -1
        hideAnim: new Animated.Value(hideAnimStartValue),

        isAnimating: false,
    }


    componentDidMount() {
        const moduleEvent = new NativeEventEmitter(NativeModules.VINModul)
        var RNCameraViewSwiftManager = NativeModules.RNCameraViewSwift;

        // Animated.timing( this.state.VINDetailHeight, { toValue: Dimensions.get('window').width * 0.075 }).start()
        moduleEvent.addListener('RaiseMissingCoordinatesAlert', response => {
            console.log("Asked to raise ios native alert", JSON.stringify(response, null, 2))
            Alert.alert(
                "Scan Not Possible",
                "Looks like the whole VIN wasn't inside the rectangle",
                [{ text: "Try Again", onPress: () => { RNCameraViewSwiftManager.missingCoordinatesErrorFromJS(123) } }]
            )
        })

        // Animated.timing( this.state.VINDetailHeight, { toValue: Dimensions.get('window').width * 0.075 }).start()

        // 1. This is the first box
        moduleEvent.addListener('ShouldShowVinDetail', response => {
            // console.log("JAVASCRIPT0", JSON.st(response, null, 2))
            // Dimensions.get('window').width * 0.075
            console.log("showing")
            this.setState({
                shouldShowVINTitleDetail: true,
            })
            // if (this.isAnimating == false) {
            Animated.timing( this.state.hideAnim, { toValue: hideAnimStartValue + 120 + this.screenWidth() * 0.05 }).start()
            // }
        })

        // 2. This is the first box
        moduleEvent.addListener('VINIsAVIN', response => {
            var JSONResponse = JSON.stringify(response, null, 2)
            JSONResponse = JSON.parse(JSONResponse)
            // console.log("JAVASCRIPT1", JSONResponse)
            // console.log("JAVASCRIPT1.5", JSONResponse.VIN)

            if (JSONResponse["ShouldShow"] == false) {
            // If 'shouldShowVINDetail' = false, show 'Scan again' button
                this.setState({
                    shouldShowVINTitleDetail: true,
                    shouldShowVIN: false,
                })
                Animated.timing( this.state.hideAnim, { toValue: hideAnimStartValue + 120 + this.screenWidth() * 0.05 + 135 + this.screenWidth() * 0.05 }).start()
            } else {
            // else if 'shouldShowVINDetail' = true, show the VIN from this.state.VIN
                this.setState({
                    shouldShowVIN: true,
                    shouldShowVINTitleDetail: true,
                    VIN: JSONResponse["VIN"],
                    // isAnimating: true
                })
                Animated.timing( this.state.hideAnim, { toValue: hideAnimStartValue + 120 + this.screenWidth() * 0.05 + 135 + this.screenWidth() * 0.05 }).start()
            }
            // if (!this.isAnimating) {
                // Animated.timing( this.state.hideAnim, { toValue: hideAnimStartValue + 120 + this.screenWidth() * 0.05 + 135 + this.screenWidth() * 0.05 }).start()
            // }
        })

        // 3.
        moduleEvent.addListener('DoesVINExistInDatabase', response => {
            var JSONResponse = JSON.stringify(response, null, 2)
            JSONResponse = JSON.parse(JSONResponse)
            // console.log("JAVASCRIPT2", JSONResponse)
            // console.log("JAVASCRIPT2.5", JSONResponse.VINData)
            if (JSONResponse["VINData"] != "") {
            // If the VIN exists in the database, the database returns 'VINData'
                Animated.timing( this.state.dataFromVINComponentHeight, { toValue: 205 }).start(() => {
                    this.setState({
                        VINData: JSONResponse["VINData"],
                        DoesVINExist: true
                    })
                })
            } else {
            // else if the VIN wasnt in the database 'VINData' is empty
                // if (!this.state.isAnimating) {
                    Animated.timing( this.state.dataFromVINComponentHeight, { toValue: 205 }).start(() => {
                        this.setState({
                            VINData: JSONResponse["VINData"],
                            DoesVINExist: false,
                            // isAnimating
                        })
                    })
                // }
            }

        })

        // var subscription2 = moduleEvent.addListener('VINExists', response => {
        //     console.log("JAVASCRIPT2", JSON.stringify(response, null, 2))

        // })
    }

    checkVINOrScanAgain = (ShouldScan) => {
        var distance = hideAnimStartValue - 70
        // if (!this.state.DoesVINExist) { distance = hideAnimStartValue - 70 }


        Animated.timing( this.state.hideAnim, { toValue: distance }).start( () => {
            NativeModules.RNCameraViewSwift.checkVINOrScanAgain(ShouldScan)
            this.setState({
                shouldShowVINTitleDetail: false,
                shouldShowVINDataDetail: false,
                shouldShowVIN: null,
                DoesVINExist: null,
                VINData: {},
                VIN: "",
                dataFromVINComponentHeight: new Animated.Value(135),
                hideAnim: new Animated.Value(hideAnimStartValue)
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
            VINDetailHeight, dataFromVINComponentHeight, hideAnim
        } = this.state

        const {
            screenWidth, screenHeight, widthTimes075,
            checkVINOrScanAgain,
        } = this

        const VINTitle = () => {
            let spinKitSize = 42

            if (shouldShowVIN == null) {
                return (
                    <View style={{ height: spinKitSize, alignItems: 'center', justifyContent: 'center' }}>
                        <SpinKit
                            type={'Arc'}
                            color={'#555555'}
                            size={spinKitSize}
                        />
                    </View>
                )
            } else if (shouldShowVIN == true && VIN.length == 17)  {
                // Animated.timing( this.state.VINDetailHeight, { toValue: Dimensions.get('window').width * 0.075 }).start()
                return (
                    <View style={{ height: spinKitSize, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={ styles.detailText }>{ VIN }</Text>
                    </View>
                )
            } else if (shouldShowVIN == true && VIN.length > 15) {
                // Animated.timing( this.state.VINDetailHeight, { toValue: Dimensions.get('window').width * 0.075  }).start()
                return (
                <View style={{ flexDirection: 'row',  justifyContent: 'space-between', width: widthTimes075() }} >

                    <TouchableOpacity
                        style={{ width: (widthTimes075() / 2) - 5, height: 55, alignItems: 'center', justifyContent: 'center', borderColor: amYellow, borderWidth: 2, borderRadius: 4 }}
                        onPress={ () => { checkVINOrScanAgain(false) }}
                    >
                        <Text style={ styles.detailText } >Check VIN</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{ width: (widthTimes075() / 2) - 5, height: 55, alignItems: 'center', justifyContent: 'center', borderColor: amYellow, borderWidth: 2, borderRadius: 4 }}
                        onPress={ () => { checkVINOrScanAgain(true) }}
                    >
                        <Text style={ styles.detailText }>Scan Again</Text>
                    </TouchableOpacity>

                </View>
                )
            } else if (shouldShowVIN == false)  {
                return (
                   <TouchableOpacity
                        style={{ width: (widthTimes075()), height: 55, alignItems: 'center', justifyContent: 'center', borderColor: amYellow, borderWidth: 2, borderRadius: 4 }}
                        onPress={ () => { checkVINOrScanAgain(true) }}
                    ><Text style={ styles.detailText }>Scan Again</Text>
                    </TouchableOpacity>
                )
            }
        }

        const DataFromVIN = () => {
            let spinKitSize = 42
            if (DoesVINExist == null) {
                return (
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ height: 1.5, width: widthTimes075(), backgroundColor: amYellow, margin: 7, alignItems: 'center', justifyContent: 'center' }} />
                        <SpinKit
                            type={'Arc'}
                            color={'#555555'}
                            size={spinKitSize}
                        />
                        <View style={{ height: 1.5, width: widthTimes075(), backgroundColor: amYellow, margin: 7 }} />
                    </View>
                )
            } else if (DoesVINExist == true) {
                // If the VIN exists in the database
                    // console.log("VINData", VINData)
                    return (
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ height: 1.5, width: widthTimes075(), backgroundColor: amYellow, margin: 7 }} />
                            <Text style={ styles.detailText }> Site: { VINData['site'] }</Text>
                            <Text style={ styles.detailText }> Model: { VINData['model'].replace(/ .*/,'') }</Text>4
                            <TouchableOpacity
                                style={{ width: widthTimes075(), height: 55, alignItems: 'center', justifyContent: 'center', borderColor: amYellow, borderWidth: 2, borderRadius: 4 }}
                                onPress={ () => { checkVINOrScanAgain(true) }}
                            >
                                <Text style={ styles.detailText }>Scan Again</Text>
                            </TouchableOpacity>
                            <View style={{ height: 1.5, width: widthTimes075(), backgroundColor: amYellow, margin: 10 }} />
                        </View>
                    )
                // If the VIN is 17 long, but it doesn't exist in the database. Let them manually change it (compareVINCharachtersWithRetrieved() from VINCorrection.swift)
            } else if (DoesVINExist == false) {
                return (
                    <View style={[{ alignItems: 'center', justifyContent: 'center', width: widthTimes075() }]}>
                        <View style={{ height: 1.5, width: widthTimes075(), backgroundColor: amYellow, margin: 7 }} />
                        <Text style={[ styles.detailText, { textAlign: 'center' }]}>VIN is incorrect or doesn't exist in the database</Text>
                        <View style={{ height: 1.5, width: widthTimes075(), backgroundColor: amYellow, margin: 10 }} />
                        <View style={{ flexDirection: 'row',  justifyContent: 'space-between', width: widthTimes075() }} >

                            <TouchableOpacity
                                style={{ width: (widthTimes075() / 2) - 5, height: 55, alignItems: 'center', justifyContent: 'center', borderColor: amYellow, borderWidth: 2, borderRadius: 4 }}
                                onPress={ () => {checkVINOrScanAgain(false) }}
                            >
                                <Text style={ styles.detailText } >Check VIN</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{ width: (widthTimes075() / 2) - 5, height: 55, alignItems: 'center', justifyContent: 'center', borderColor: amYellow, borderWidth: 2, borderRadius: 4 }}
                                onPress={ () => { checkVINOrScanAgain(true) }}
                            >
                                <Text style={ styles.detailText }>Scan Again</Text>
                            </TouchableOpacity>

                        </View>
                        <View style={{ height: 1.5, width: widthTimes075(), backgroundColor: amYellow, margin: 10 }} />
                    </View>
                )
            }
        }






        return (
            <SafeAreaView style={{ flex: 1 }}>
            <View style={ styles.container }>
                <RNCameraView
                    style={ styles.gradient }
                    locations={[0, .5, 1.0]}
                    colors={['#5ED2A0', 'red', '#339CB1']}
                />
                {/*<Animated.View style={{ position: 'absolute', bottom: dataFromVINComponentHeight }}>*/}
                    { shouldShowVINTitleDetail && (
                        /*<Animated.View>
                            <VINDetailView
                                bottom={hideAnim}
                                checkVINOrScanAgain={ (shouldScan) => checkVINOrScanAgain(shouldScan) }
                                VIN={VIN}
                            />
                        </Animated.View>*/

                        <Animated.View style={{ bottom: hideAnim }}>
                            <Animated.View style={[ styles.VINDetailStyle, { height: 120, width: screenWidth() * 0.85, alignItems: 'center', justifyContent: 'center' }]} >
                                <Text style={[ styles.detailText, { fontSize: 24 } ]}>VIN</Text>
                                <View style={{ height: 1.5, width: widthTimes075(), backgroundColor: amYellow, margin: 7 }} />
                                <VINTitle />
                                <View style={{ height: 1.5, width: widthTimes075(), backgroundColor: amYellow, margin: 7 }} />
                            </Animated.View>

                            <Animated.View style={[ styles.VINDetailStyle, { height: dataFromVINComponentHeight, width: screenWidth() * 0.85, marginTop: screenWidth() * 0.05 }]} >
                                <Text style={[ styles.detailText, { fontSize: 24 } ]}>Car Details</Text>
                                <Animated.View >
                                    <DataFromVIN />
                                </Animated.View>
                            </Animated.View>
                        </Animated.View>
                    ) }
                {/*</Animated.View>*/}

            </View>
            </SafeAreaView>
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
        fontSize: 22,

    },

    VINDetailStyle: {
        backgroundColor: 'lightgray',
        padding: 7,
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
