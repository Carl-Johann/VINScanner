import { connect } from 'react-redux'
import React, { Component } from 'react'

import {
    StyleSheet, Text, View, Animated,
    NativeEventEmitter, NativeModules,
    TouchableOpacity, Modal,
} from 'react-native'


import {
    setImageAs64Action,
    setScannedCharactersAction,
    setScannedStringDBDataAction,
    doesScannedStringExistInDBAction,
    resetScannedCharactersReduxStateAction,
} from '../../redux/ScannedData/Actions'

import {
    shouldShowFirstDetailBoxAction,
    resetDetailBoxesReduxStateAction,
} from '../../redux/DetailBoxes/Actions.js'

import {
    setShouldShowModalAction,
    setStockCountPostStatusCodeAction,
} from '../../redux/StockCount/Actions.js'

import {
    StockCountUpdateVehicleStockInfoApiRequest
} from '../../Api/ApiCalls.js'

import {
    setShouldScanAction,
    resetViewsReduxStateAction,
    setEnterDataManuallyAction,
    setShouldTakePictureAction,
} from '../../redux/Views/Actions.js'

import StockCountModal from './StockCountModal'
import DetailBoxesView from './DetailBoxesView'
import SpinKit from '../ViewAccessories/SpinKit'
import StockCountInfoButton from '../Buttons/StockCountInfoButton'
import RNCameraView from '../../ios-native-components/RNCameraView'
// import EnterAndScanNowButtons from '../Buttons/EnterAndScanNowButtons'

import {
    ShouldShowCameraView,
    HideAndResetEverything,
    NoDataReturnedFromGoogle,
    ShouldShowFirstDetailBox,
    ShouldShowDataCorrectionView,
    ShouldShowDataInFirstDetailBox,
    ShouldShowDataInSecondDetailBox,
} from '../../helpers/ModuleEventListeners.js'


import {
    defaultBorderRadius, defaultYellow,
    lineBreakerMarginHeight, isIphoneX,
    lineBreakerHeight, detailBoxesWidth,
    isVINOrUnit, detailBoxesDurationTime,
    largerTextFontTextHeight, screenWidth,
    detailBoxesMarginToEdge, screenHeight,
    spinKitType, spinKitSize, defaultGray,
} from '../../helpers/GlobalValues.js'



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




class CameraView extends Component {

    state = {
        cameraViewOpacity: new Animated.Value(1),
        firstDetailBoxHeight: new Animated.Value(firstDetailBoxDefaultHeight),
        secondDetailBoxHeight: new Animated.Value(secondDetailBoxDefaultHeight),
        detailBoxesHeightOffset: new Animated.Value(detailBoxesDefaultHeightOffset),
    }



    componentDidMount() {
        const moduleEvent = new NativeEventEmitter(NativeModules.VINModul)

        // // Life cycle of data boxes //
        // // 1. This is the first box. Shows it with a loading icon.
        moduleEvent.addListener('ShouldShowFirstDetailBox', response => {

            this.props.setShouldScanAction(false)
            this.props.shouldShowFirstDetailBoxAction(true)
            Animated.timing(this.state.detailBoxesHeightOffset, animations.showFirstDetailBox ).start()
        })

        // Animated.timing(this.state.detailBoxesHeightOffset, animations.showFirstDetailBox ).start(() => {})
        // // 2. This is the first AND second box. Shows the second box with loading icon if successful.
        moduleEvent.addListener('ShouldShowDataInFirstDetailBox', response => {
            // ShouldShowDataInFirstDetailBox(this, response)
            var JSONResponse = JSON.stringify(response, null, 2)
            JSONResponse = JSON.parse(JSONResponse)

            let scannedCharacters = JSONResponse["cleanedCharacters"]
            let imageAs64 = JSONResponse["imageAs64"]


            this.props.setScannedCharactersAction(scannedCharacters)
            this.props.setImageAs64Action(imageAs64)

            if (isVINOrUnit(scannedCharacters)) {
                // If scannedCharacters are a VIN or UNIT
                Animated.parallel([
                    Animated.timing( this.state.cameraViewOpacity, { toValue: 0, duration: detailBoxesDurationTime }),
                    Animated.timing( this.state.detailBoxesHeightOffset, animations.showBothDetailBoxes),
                ]).start()

            } else {
                // console.log("Not VIN or Unit")
                // Else we tell the user their scan wasn't successful
                Animated.parallel([
                    Animated.timing( this.state.detailBoxesHeightOffset, animations.showFirstDetailBox ),
                    Animated.timing( this.state.cameraViewOpacity, { toValue: 0, duration: detailBoxesDurationTime }),
                    Animated.timing( this.state.firstDetailBoxHeight, { toValue: firstDetailBoxTallDefaultHeight, duration: detailBoxesDurationTime }),
                ]).start()
            }
        })


        // // 3. This is the second box.This either shows an error or fills it with data.
        moduleEvent.addListener('ShouldShowDataInSecondDetailBox', response => {
            ShouldShowDataInSecondDetailBox(this, response)
        })
        // // End of succesful life cycle of data boxes //



        // Hide and Show different views
        moduleEvent.addListener('ShouldShowCameraView', response => {
            var JSONResponse = JSON.stringify(response, null, 2)
            JSONResponse = JSON.parse(JSONResponse)
            ShouldShowCameraView(this, JSONResponse['shouldShow'])
        })

        moduleEvent.addListener('shouldShowDataCorrectionView', response => {
            var JSONResponse = JSON.stringify(response, null, 2)
            JSONResponse = JSON.parse(JSONResponse)
            this.props.setImageAs64Action(JSONResponse['imageAs64'])
            this.props.navigation.navigate('DataCorrectionView')

            // ShouldShowDataCorrectionView(this)
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



        // Stockcounting
        moduleEvent.addListener('charactersFromBarcode', response => {
            var JSONResponse = JSON.stringify(response, null, 2)
            JSONResponse = JSON.parse(JSONResponse)

            StockCountUpdateVehicleStockInfoApiRequest(
                JSONResponse['characters'],
                (statusCode) => { this.props.setStockCountPostStatusCodeAction(statusCode) }
            )

            this.props.setShouldScanAction(false)
            this.props.setShouldShowModalAction(true)
            // console.log(123, this.props.modalVisible)
            this.props.setScannedCharactersAction(JSONResponse['characters'])

            // this.setState({ modalVisible: true })
        })

        // End of stockcounting

    }


    // Also called as an error function for resetting the whole view.
    checkScannedCharactersOrScanAgain = (ShouldScan) => {
        let distance = detailBoxesDefaultHeightOffset - 70

        // We should show the CameraView again if the user wants to scan.
        Animated.parallel([
            Animated.timing( this.state.cameraViewOpacity, { toValue: ShouldScan ? 1 : 0, duration: detailBoxesDurationTime }),
            Animated.timing( this.state.detailBoxesHeightOffset, { toValue: -700, duration: detailBoxesDurationTime })
        ]).start(() => {

            this.setState({
                cameraViewOpacity: new Animated.Value(ShouldScan ? 1 : 0),
                firstDetailBoxHeight: new Animated.Value(firstDetailBoxDefaultHeight),
                secondDetailBoxHeight: new Animated.Value(secondDetailBoxDefaultHeight),
                detailBoxesHeightOffset: new Animated.Value(detailBoxesDefaultHeightOffset),
            })

            this.props.resetViewsReduxStateAction()
            this.props.resetDetailBoxesReduxStateAction()
            if (ShouldScan == false) {
                this.props.navigation.navigate('DataCorrectionView')
                const didBlurSubscription = this.props.navigation.addListener('didBlur', payload => {
                    this.setState({ cameraViewOpacity: new Animated.Value(1) })
                    didBlurSubscription.remove();
                })
            } else {
                this.props.resetScannedCharactersReduxStateAction()
            }

        })

    }



    render() {


        const {
            secondDetailBoxHeight, cameraViewOpacity,
            detailBoxesHeightOffset, firstDetailBoxHeight,
        } = this.state

        const {
            scannedCharacters, shouldShowFirstDetailBox,
            setEnterDataManuallyAction, enterDataManually,
            setShouldTakePictureAction, shouldScan,
        } = this.props



        return (
            <View style={{ flex: 1 }}>



                <Animated.View
                    style={{ flex: 1, opacity: cameraViewOpacity }}
                    pointerEvents={ shouldScan ? 'auto' : 'none' }
                >
                    <View stye={{ flex: 1 }}>
                        <RNCameraView />
                    </View>

                    <View style={{ width: '100%', alignItems: 'flex-end', top: 40, flex: 1 }}>
                        <StockCountInfoButton
                            changeStockStatus={ () => {} } // this.setState({ takingStock: !this.state.takingStock
                        />
                    </View>
                </Animated.View>


                     {/*<View style={ styles.enterAndScanNowButtonsStyle }>*/}

                        {/*<EnterAndScanNowButtons
                            scanNowMethod={() => { setShouldTakePictureAction(true) }}
                            enterNowMethod={() => { setEnterDataManuallyAction(true) }}
                        />*/}

                    {/*</View>*/}

                { shouldShowFirstDetailBox && (
                    <Animated.View style={{ bottom: detailBoxesHeightOffset, left: detailBoxesMarginToEdge }} >
                        <DetailBoxesView
                            firstDetailBoxHeight={ firstDetailBoxHeight }
                            secondDetailBoxHeight={ secondDetailBoxHeight }
                            checkScannedCharactersOrScanAgain={ (shouldScan) => this.checkScannedCharactersOrScanAgain(shouldScan) }
                        />
                    </Animated.View>
                ) }

                <StockCountModal />


            </View>
        )
    }
}




const styles = StyleSheet.create({
    enterAndScanNowButtonsStyle: {
        flex: 1,
        height: 55,
        alignItems:'center',
        position: 'absolute',
        justifyContent: 'center',
        top: screenHeight * 0.65 - (isIphoneX ? 0 : 40),
        left: ((screenWidth / 2) - (((screenWidth * 0.75) / 2 ) + 10 )),
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



const mapStateToProps = (state) => {
    return {
        shouldScan: state.ViewsReducer.shouldScan,
        modalVisible: state.StockCountReducer.modalVisible,
        scannedCharacters: state.ScannedDataReducer.scannedCharacters,
        shouldShowFirstDetailBox: state.DetailBoxesReducer.shouldShowFirstDetailBox,
    }
}

// Some of these actions get used in another file
const mapDispatchToProps = (dispatch) => {
  return {
    resetViewsReduxStateAction: () => dispatch(resetViewsReduxStateAction()),
    setImageAs64Action: (imageAs64) => dispatch(setImageAs64Action(imageAs64)),
    setShouldScanAction: (shouldScan) => dispatch(setShouldScanAction(shouldScan)),
    resetDetailBoxesReduxStateAction: () => dispatch(resetDetailBoxesReduxStateAction()),
    setShouldShowModalAction: (shouldShow) => dispatch(setShouldShowModalAction(shouldShow)),
    setScannedCharactersAction: (characters) => dispatch(setScannedCharactersAction(characters)),
    resetScannedCharactersReduxStateAction: () => dispatch(resetScannedCharactersReduxStateAction()),
    shouldShowFirstDetailBoxAction: (shouldShow) => dispatch(shouldShowFirstDetailBoxAction(shouldShow)),
    setShouldTakePictureAction: (shouldTakePicture) => dispatch(setShouldTakePictureAction(shouldTakePicture)),
    setEnterDataManuallyAction: (enterDataManually) => dispatch(setEnterDataManuallyAction(enterDataManually)),
    setStockCountPostStatusCodeAction: (statusCode) => dispatch(setStockCountPostStatusCodeAction(statusCode)),
    setScannedStringDBDataAction: (scannedStringDBData) => dispatch(setScannedStringDBDataAction(scannedStringDBData)),
    doesScannedStringExistInDBAction: (doesScannedStringExistInDB) => dispatch(doesScannedStringExistInDBAction(doesScannedStringExistInDB)),
  }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CameraView)