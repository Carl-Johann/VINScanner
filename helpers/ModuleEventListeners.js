import {
    isVINOrUnit, detailBoxesDurationTime, isIphoneX,
    detailBoxesMarginToEdge, isEmpty, lineBreakerMarginHeight,
    lineBreakerHeight, largerTextFontTextHeight, secondDetailBoxDefaultHeight
} from './GlobalValues'
import { Animated, Alert } from 'react-native'

import {
    firstDetailBoxHeight,
    firstDetailBoxDefaultHeight,
    detailBoxesDefaultHeightOffset,
    firstDetailBoxTallDefaultHeight,
    tallSecondDetailBoxDefaultHeight,
    firstDetailBoxMediumDefaultHeight,
    mediumSecondDetailBoxDefaultHeight,
} from '../react-native-components/Views/CameraView'


import {
    setScannedCharactersAction,
    setImageAs64Action,
    setScannedStringDBDataAction,
    doesScannedStringExistInDBAction,
} from '../redux/ScannedData/Actions'



export const ShouldShowFirstDetailBox = (component, response) => {
    Animated.timing(component.state.detailBoxesHeightOffset,
        { toValue: -wholeSecondDetailBoxHeight,
          duration: detailBoxesDurationTime } ).start()
}


export const ShouldShowDataInFirstDetailBox = (component, response) => {
    var JSONResponse = JSON.stringify(response, null, 2)
    JSONResponse = JSON.parse(JSONResponse)

    let scannedCharacters = JSONResponse["cleanedCharacters"]
    let imageAs64 = JSONResponse["imageAs64"]


    component.props.setScannedCharactersAction(scannedCharacters)
    component.props.setImageAs64Action(imageAs64)

    if (isVINOrUnit(scannedCharacters)) {
        // If scannedCharacters are a VIN or UNIT
        Animated.parallel([
            Animated.timing( component.state.cameraViewOpacity, { toValue: 0, duration: detailBoxesDurationTime }),
            Animated.timing( component.state.detailBoxesHeightOffset, animations.showBothDetailBoxes),
        ]).start()

    } else {
        console.log("Not VIN or Unit")
        // Else we tell the user their scan wasn't successful
        Animated.parallel([
            Animated.timing( component.state.detailBoxesHeightOffset, animations.showFirstDetailBox ),
            Animated.timing( component.state.firstDetailBoxHeight, { toValue: firstDetailBoxTallDefaultHeight, duration: detailBoxesDurationTime }),
        ]).start()
    }

}


export const ShouldShowDataInSecondDetailBox = (component, response) => {
    console.log("ShouldShowDataInSecondDetailBox")

    var JSONResponse = JSON.stringify(response, null, 2)
    JSONResponse = JSON.parse(JSONResponse)
    let scannedStringDBData = JSONResponse["scannedStringDBData"]
    if (isEmpty(scannedStringDBData) == false) {
    // if (isEmpty(scannedStringDBData) == true) {
    // Row exists in DB with corresponding data to what was scanned

        component.props.setScannedStringDBDataAction(scannedStringDBData)
        component.props.doesScannedStringExistInDBAction(true)


        Animated.parallel([
            Animated.timing( component.state.secondDetailBoxHeight, { toValue: tallSecondDetailBoxDefaultHeight, duration: detailBoxesDurationTime }),
            Animated.timing( component.state.firstDetailBoxHeight, { toValue: firstDetailBoxMediumDefaultHeight, duration: detailBoxesDurationTime }),
        ]).start()

    } else {
    // else if the scannedStringDBData wasn't in the database 'scannedStringDBData' is empty
        Animated.parallel([
            Animated.timing( component.state.secondDetailBoxHeight, { toValue: mediumSecondDetailBoxDefaultHeight, duration: detailBoxesDurationTime }),
            Animated.timing( component.state.detailBoxesHeightOffset, animations.showBothDetailBoxes),
        ]).start( () => {
            component.props.setScannedStringDBDataAction({})
            component.props.doesScannedStringExistInDBAction(false)
        })
    }
}


// These two constants calculate the total height of the detail boxes.
const wholeSecondDetailBoxHeight = ( (2 * lineBreakerMarginHeight) + ( 2 * lineBreakerHeight) + secondDetailBoxDefaultHeight + largerTextFontTextHeight + lineBreakerMarginHeight / 2 )

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






export const HideAndResetEverything = (component) => {
    // 'checkScannedCharactersOrScanAgain' also works by hiding everything, showing the cameraView in swift and then resets state.
    // Also what we need here, so we reuse it
    Alert.alert(
        "An Error occured",
        "Something that shouldn't happen, happend",
        [{ text: "OK", onPress: () => component.checkScannedCharactersOrScanAgain(true) }]
    )
}





export const NoDataReturnedFromGoogle = (component) => {
    // 'checkScannedCharactersOrScanAgain' also works by hiding everything, showing the cameraView in swift and then resets state.
    // Also what we need here, so we reuse it

    Animated.timing(component.state.detailBoxesHeightOffset, { toValue: -500 }).start()

    Alert.alert(
        'Nothing Returned From Your Scan',
        'Try to reposition the camera. If possible, block any reflections that might be hitting the windshield.',
        [{ text: 'OK, Scan Again', onPress: () => component.checkScannedCharactersOrScanAgain(true) }],
        { cancelable: false }
    )
}





export const ShouldShowCameraView = (component, shouldShow) => {
    component.checkScannedCharactersOrScanAgain(shouldShow)
    component.props.navigation.navigate('CameraView')
}


export const ShouldShowDataCorrectionView = (component) => {
    component.props.navigation.navigate('DataCorrectionView')
}


























    // debugDetailBoxes = (shouldShowFirstDetailBox, shouldShowScannedCharacters, scannedCharacters, doesScannedStringExistInDB) => {
    //     setTimeout(() => {
    //         this.setState({ shouldShowFirstDetailBox: shouldShowFirstDetailBox })
    //         this.animateDetailBoxesHeightOffset( animations.showFirstDetailBox )

    //         setTimeout(() => {
    //             this.setState({
    //                 shouldShowFirstDetailBox: true,
    //                 shouldShowScannedCharacters,
    //                 scannedCharacters,
    //             })

    //             if (isVINOrUnit(scannedCharacters) == true) {
    //             // else if 'shouldShowVINDetail' = true, show the VIN from this.state.VIN
    //                 this.animateDetailBoxesHeightOffset( animations.showBothDetailBoxes )

    //             } else {
    //                 Animated.parallel([
    //                     Animated.timing( this.state.detailBoxesHeightOffset, animations.showFirstDetailBox ),
    //                     Animated.timing( this.state.firstDetailBoxHeight, { toValue: firstDetailBoxTallDefaultHeight, duration: detailBoxesDurationTime }),
    //                 ]).start()
    //             }

    //             setTimeout(() => {
    //                 // this.animateDetailBoxesHeightOffset( animations.showBothDetailBoxes )


    //                 if (doesScannedStringExistInDB == true) {
    //                     setTimeout(() => {

    //                         Animated.parallel([
    //                             Animated.timing( this.state.secondDetailBoxHeight, { toValue: tallSecondDetailBoxDefaultHeight, duration: detailBoxesDurationTime }),
    //                             Animated.timing( this.state.firstDetailBoxHeight, { toValue: firstDetailBoxMediumDefaultHeight, duration: detailBoxesDurationTime }),
    //                             Animated.timing( this.state.detailBoxesHeightOffset, animations.showBothDetailBoxes ),
    //                         ]).start(() => {
    //                             this.setState({
    //                                 scannedStringDBData:
    //                                     {
    //                                         UNIT: '5911537',
    //                                         ECC: '41',
    //                                         MODEL: 'INSIGNIA ST DYN 1.5 65HK/M6',
    //                                         MAKE: 'Opel',
    //                                         SITE: 'Greve',
    //                                         CHASSIS: 'W0LZS8GB3J1019224',
    //                                         ECC_TXT: 'På lager (41)',
    //                                         primary_key: 241
    //                                     },
    //                                 doesScannedStringExistInDB,
    //                             })
    //                         })
    //                     }, 450)
    //                 } else {
    //                     setTimeout(() => {
    //                         // else if the scannedStringDBData wasn't in the database 'scannedStringDBData' is empty
    //                         Animated.parallel([
    //                             Animated.timing( this.state.secondDetailBoxHeight, { toValue: mediumSecondDetailBoxDefaultHeight, duration: detailBoxesDurationTime }),
    //                             Animated.timing( this.state.detailBoxesHeightOffset, animations.showBothDetailBoxes ),
    //                         ]).start(() => {
    //                             this.setState({
    //                                 scannedStringDBData: {},
    //                                 doesScannedStringExistInDB,
    //                             })
    //                         })
    //                     }, 4500)
    //                 }
    //             }, 2500)
    //         }, 1000)
    //     }, 400)
    // }

