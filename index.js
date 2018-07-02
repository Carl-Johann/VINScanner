import React, { Component } from 'react';
// import { Icon } from 'react-native-elements'
import {
    StyleSheet, Text, SafeAreaView,
    View, AppRegistry, requireNativeComponent,
    NativeEventEmitter, NativeModules, Animated,
    Alert, ActionSheetIOS, TouchableOpacity, Switch, Image,
} from 'react-native';
import RNCameraView from './ios-native-components/RNCameraView'
import RNDataCorrectionView from './ios-native-components/RNDataCorrectionView'
import Dimensions from 'Dimensions'
import SpinKit from './react-native-components/SpinKit'
import DetailBoxesView from './react-native-components/DetailBoxesView'
import StockCountInfoButton from './react-native-components/StockCountInfoButton'
import EnterAndScanNowButtons from './react-native-components/EnterAndScanNowButtons'

import {
    ShouldShowCameraView,
    HideAndResetEverything,
    NoDataReturnedFromGoogle,
    ShouldShowFirstDetailBox,
    ShouldShowDataCorrectionView,
    ShouldShowDataInFirstDetailBox,
    ShouldShowDataInSecondDetailBox,
} from './helpers/ModuleEventListeners'


import {
    isVINOrUnit, AMDarkGray, detailBoxesDurationTime,
    detailBoxesContentWidth, detailBoxesMarginToEdge,
    lineBreakerMarginHeight, largerTextFontTextHeight,
    lineBreakerHeight, isIphoneX, defaultYellow, detailBoxesWidth,
    screenHeight, screenWidth,
} from './helpers/GlobalValues'



export const firstDetailBoxDefaultHeight = 45           // 45
export const firstDetailBoxMediumDefaultHeight = 90     // 90
export const firstDetailBoxTallDefaultHeight = 120      // 120

export const secondDetailBoxDefaultHeight = 60          // 60
export const mediumSecondDetailBoxDefaultHeight = 120   // 120
export const tallSecondDetailBoxDefaultHeight = 180     // 180

// These two constants calculate the total height of the detail boxes.
const wholeFirstDetailBoxHeight  = ( (2 * lineBreakerMarginHeight) + ( 2 * lineBreakerHeight) + firstDetailBoxDefaultHeight  + largerTextFontTextHeight + lineBreakerMarginHeight / 2 )
const wholeSecondDetailBoxHeight = ( (2 * lineBreakerMarginHeight) + ( 2 * lineBreakerHeight) + secondDetailBoxDefaultHeight + largerTextFontTextHeight + lineBreakerMarginHeight / 2 )

export const detailBoxesDefaultHeightOffset = -wholeFirstDetailBoxHeight - wholeSecondDetailBoxHeight - detailBoxesMarginToEdge




class App extends Component {

    state = {
        shouldTakePicture: false,
        enterDataManually: false,

        shouldShowCameraView: true,
        shouldShowDataCorrectionView: false,


        scannedCharacters: "",              // ""
        shouldShowFirstDetailBox: false ,   // false
        shouldShowScannedCharacters: null,  // null

        scannedStringDBData: {},            // {}
        doesScannedStringExistInDB: null,   // null


        firstDetailBoxHeight: new Animated.Value(firstDetailBoxDefaultHeight),
        secondDetailBoxHeight: new Animated.Value(secondDetailBoxDefaultHeight),
        detailBoxesHeightOffset: new Animated.Value(detailBoxesDefaultHeightOffset),



        imageAs64: "",
        takingStock: false,

        cameraViewOpacity: new Animated.Value(1),
        dataCorrectionOpacity: new Animated.Value(0),
    }



    componentDidMount() {
        const moduleEvent = new NativeEventEmitter(NativeModules.VINModul)
        let RNCameraViewSwiftManager = NativeModules.RNCameraViewSwift;

        // Working UNIT(7) and VIN
        // W0LZS8GB3J101924
        // 5911537
        // this.debugDetailBoxes(true, true, '5911537', true)




        // Life cycle of data boxes //
        // 1. This is the first box. Shows it with a loading icon.
        moduleEvent.addListener('ShouldShowFirstDetailBox', response => {
            ShouldShowFirstDetailBox(this, response, animations)
        })


        // 2. This is the first AND second box. Shows the second box with loading icon if successful.
        moduleEvent.addListener('ShouldShowDataInFirstDetailBox', response => {
            ShouldShowDataInFirstDetailBox(this, response, animations)
        })


        // 3. This is the second box.This either shows an error or fills it with data.
        moduleEvent.addListener('ShouldShowDataInSecondDetailBox', response => {
            ShouldShowDataInSecondDetailBox(this, response, animations)
        })
        // End of succesful life cycle of data boxes //




        // Hide and Show different views
        moduleEvent.addListener('ShouldShowCameraView', response => {
            var JSONResponse = JSON.stringify(response, null, 2)
            JSONResponse = JSON.parse(JSONResponse)
            ShouldShowCameraView(this, JSONResponse['shouldShow'])
        })

        moduleEvent.addListener('shouldShowDataCorrectionView', response => {
            var JSONResponse = JSON.stringify(response, null, 2)
            JSONResponse = JSON.parse(JSONResponse)
            ShouldShowDataCorrectionView(this, JSONResponse['shouldShow'], JSONResponse['imageAs64'])
        })

        //




        // These are errors //
        moduleEvent.addListener('hideAndResetEverything', response => {
            // 'checkScannedCharactersOrScanAgain' also works by hiding everything, showing the cameraView in swift and then resets state.
            // Also what we need here, so we reuse it
            HideAndResetEverything(this)
        })

        moduleEvent.addListener('NoDataReturnedFromGoogle', response => {
            // 'checkScannedCharactersOrScanAgain' also works by hiding everything, showing the cameraView in swift and then resets state.
            // Also what we need here, so we reuse it
            NoDataReturnedFromGoogle(this)
        })
        // End of errors //

    }


    animateDetailBoxesHeightOffset = (animation) => {
        Animated.timing( this.state.detailBoxesHeightOffset, animation ).start()
    }

    // Also called as an error function for resetting the whole view. (moduleEvent.addListener('hideAndResetEverything'))
    checkScannedCharactersOrScanAgain = (ShouldScan) => {
        let distance = detailBoxesDefaultHeightOffset - 70
        // NativeModules.RNCameraViewSwift2.shouldShowCameraView(ShouldScan)
        console.log('Resetting...', ShouldScan)
        console.log('shouldShowCameraView', this.state.shouldShowCameraView)
        // We should show the CameraView again if the user wants to scan.
        Animated.parallel([
            Animated.timing( this.state.cameraViewOpacity, { toValue: ShouldScan ? 1 : 0, duration: detailBoxesDurationTime }),
            Animated.timing( this.state.dataCorrectionOpacity, { toValue: ShouldScan ? 0 : 1, duration: detailBoxesDurationTime }),
            Animated.timing( this.state.detailBoxesHeightOffset, { toValue: -700, duration: detailBoxesDurationTime })
        ]).start(() => {

            this.setState({
                shouldTakePicture: false,
                enterDataManually: false,

                shouldShowCameraView: ShouldScan,
                shouldShowDataCorrectionView: !ShouldScan,


                scannedCharacters: ShouldScan ? "" : this.state.scannedCharacters,              // ""
                imageAs64: ShouldScan ? "" : this.state.imageAs64,


                shouldShowFirstDetailBox: false ,   // false
                shouldShowScannedCharacters: null,  // null

                scannedStringDBData: {},            // {}
                doesScannedStringExistInDB: null,   // null

                takingStock: false,

                firstDetailBoxHeight: new Animated.Value(firstDetailBoxDefaultHeight),
                secondDetailBoxHeight: new Animated.Value(secondDetailBoxDefaultHeight),
                detailBoxesHeightOffset: new Animated.Value(detailBoxesDefaultHeightOffset),

                cameraViewOpacity: new Animated.Value(ShouldScan ? 1 : 0),
                dataCorrectionOpacity: new Animated.Value(ShouldScan ? 0 : 1),
            })
        })

    }


    debugDetailBoxes = (shouldShowFirstDetailBox, shouldShowScannedCharacters, scannedCharacters, doesScannedStringExistInDB) => {
        setTimeout(() => {
            this.setState({ shouldShowFirstDetailBox: shouldShowFirstDetailBox })
            this.animateDetailBoxesHeightOffset( animations.showFirstDetailBox )

            setTimeout(() => {
                this.setState({
                    shouldShowFirstDetailBox: true,
                    shouldShowScannedCharacters,
                    scannedCharacters,
                })

                if (isVINOrUnit(scannedCharacters) == true) {
                // else if 'shouldShowVINDetail' = true, show the VIN from this.state.VIN
                    this.animateDetailBoxesHeightOffset( animations.showBothDetailBoxes )

                } else {
                    Animated.parallel([
                        Animated.timing( this.state.detailBoxesHeightOffset, animations.showFirstDetailBox ),
                        Animated.timing( this.state.firstDetailBoxHeight, { toValue: firstDetailBoxTallDefaultHeight, duration: detailBoxesDurationTime }),
                    ]).start()
                }

                setTimeout(() => {
                    // this.animateDetailBoxesHeightOffset( animations.showBothDetailBoxes )


                    if (doesScannedStringExistInDB == true) {
                        setTimeout(() => {

                            Animated.parallel([
                                Animated.timing( this.state.secondDetailBoxHeight, { toValue: tallSecondDetailBoxDefaultHeight, duration: detailBoxesDurationTime }),
                                Animated.timing( this.state.firstDetailBoxHeight, { toValue: firstDetailBoxMediumDefaultHeight, duration: detailBoxesDurationTime }),
                                Animated.timing( this.state.detailBoxesHeightOffset, animations.showBothDetailBoxes ),
                            ]).start(() => {
                                this.setState({
                                    scannedStringDBData:
                                        {
                                            UNIT: '5911537',
                                            ECC: '41',
                                            MODEL: 'INSIGNIA ST DYN 1.5 65HK/M6',
                                            MAKE: 'Opel',
                                            SITE: 'Greve',
                                            CHASSIS: 'W0LZS8GB3J1019224',
                                            ECC_TXT: 'På lager (41)',
                                            primary_key: 241
                                        },
                                    doesScannedStringExistInDB,
                                })
                            })
                        }, 450)
                    } else {
                        setTimeout(() => {
                            // else if the scannedStringDBData wasn't in the database 'scannedStringDBData' is empty
                            Animated.parallel([
                                Animated.timing( this.state.secondDetailBoxHeight, { toValue: mediumSecondDetailBoxDefaultHeight, duration: detailBoxesDurationTime }),
                                Animated.timing( this.state.detailBoxesHeightOffset, animations.showBothDetailBoxes ),
                            ]).start(() => {
                                this.setState({
                                    scannedStringDBData: {},
                                    doesScannedStringExistInDB,
                                })
                            })
                        }, 4500)
                    }
                }, 2500)
            }, 1000)
        }, 400)
    }



    render() {
        const {
            shouldShowFirstDetailBox, shouldShowScannedCharacters, scannedCharacters,
            scannedStringDBData, doesScannedStringExistInDB, secondDetailBoxHeight,
            detailBoxesHeightOffset, firstDetailBoxHeight,

            shouldShowCameraView, shouldShowDataCorrectionView,
            cameraViewOpacity, dataCorrectionOpacity,
            shouldScan, imageAs64, dataFromScan, takingStock,
            shouldTakePicture, enterDataManually
        } = this.state

        return (
            <View style={ styles.container }>



            {/*
                We have to keep RNCameraView loaded all the time,
                because the transition back, when a re-render is needed is not smooth
            */}
                <Animated.View
                    style={[ { flex: 1, opacity: cameraViewOpacity} ]}
                    /*pointerEvents={ shouldShowCameraView ? 'auto' : 'none' }*/
                >
                    <View stye={{ flex: 1, backgroundColor: 'green' }}>
                        <RNCameraView
                            style={{ flex: 1 }}
                            shouldScan={ shouldShowCameraView }
                            takingStock={ takingStock }
                            shouldTakePicture={ shouldTakePicture }
                            enterDataManually={ enterDataManually }
                        />
                    </View>

                    <View
                        style={{
                            //backgroundColor: 'green',
                            width: '100%',
                            //height: 100,
                            alignItems: 'flex-end'
                        }}
                    >
                        <StockCountInfoButton
                            style={{  }}
                            changeStockStatus={ () => { this.setState({ takingStock: !this.state.takingStock }) }}
                        />


                    </View>

                     <View style={{
                         flex: 1, top: screenHeight * 0.65 - (isIphoneX ? 0 : 40),
                         left: ((screenWidth / 2) - ((screenWidth * 0.75) /2 )),
                         height: 55, justifyContent: 'center', alignItems: 'center',
                         position: 'absolute',
                        }}>
                        <EnterAndScanNowButtons
                            scanNowMethod={() => { this.setState({ shouldTakePicture: true }) }}
                            enterNowMethod={() => { this.setState({ enterDataManually: true }) }}
                        />
                    </View>
                </Animated.View>






                {/*{ shouldShowDataCorrectionView && (*/}
                    <Animated.View
                        style={[ styles.camera, { opacity: dataCorrectionOpacity } ]}
                        pointerEvents={ shouldShowCameraView ? 'none' : 'auto' }
                    >
                        <RNDataCorrectionView
                            imageAs64AndDataFromScan={{
                                imageAs64: imageAs64,
                                dataFromScan: scannedCharacters
                            }}
                            style={ styles.camera }
                        />
                    </Animated.View>
                {/*) }*/}


                { shouldShowFirstDetailBox && (
                    <Animated.View style={{ bottom: detailBoxesHeightOffset, left: detailBoxesMarginToEdge }} >
                        <DetailBoxesView
                            checkScannedCharactersOrScanAgain={ (shouldScan) => {
                                this.checkScannedCharactersOrScanAgain(shouldScan)
                            }}

                            scannedStringDBData={ scannedStringDBData }
                            scannedCharacters={ scannedCharacters }

                            shouldShowScannedCharacters={ shouldShowScannedCharacters }
                            doesScannedStringExistInDB={ doesScannedStringExistInDB }

                            indexComponent={ this }

                            detailBoxesHeightOffset={ detailBoxesHeightOffset }
                            secondDetailBoxHeight={ secondDetailBoxHeight }
                            firstDetailBoxHeight={ firstDetailBoxHeight }
                        />
                    </Animated.View>
                ) }

            </View>
        )
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'flex-end',
        // justifyContent: 'flex-end',
        // backgroundColor: '#282828',
    },

    camera: {
        top: 0,
        flex: 1,
        left: 0,
        right: 0,
        bottom: 0,
        position: 'absolute',
        // alignItems: 'flex-end',
        // justifyContent: 'flex-end',
        backgroundColor: '#282828',
    }
})

const animations = {

    showBothDetailBoxes: {
        toValue: detailBoxesMarginToEdge + (isIphoneX() ? 2.5 * detailBoxesMarginToEdge : 0),
        duration: detailBoxesDurationTime
    },

    showFirstDetailBox: {
        toValue: -wholeSecondDetailBoxHeight,
        duration: detailBoxesDurationTime
    },
}

AppRegistry.registerComponent('VINScanner', () => App);