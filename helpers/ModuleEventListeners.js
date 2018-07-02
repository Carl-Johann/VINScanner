import {
    isVINOrUnit, detailBoxesDurationTime, isIphoneX,
    detailBoxesMarginToEdge, isEmpty,
} from './GlobalValues'
import { Animated, Alert } from 'react-native';

import {
    firstDetailBoxHeight,
    detailBoxesDefaultHeightOffset,
    firstDetailBoxTallDefaultHeight,
    tallSecondDetailBoxDefaultHeight,
    firstDetailBoxMediumDefaultHeight,
    mediumSecondDetailBoxDefaultHeight,
} from '../index.js'





export const ShouldShowFirstDetailBox = (component, response, animations) => {
    component.setState({ shouldShowFirstDetailBox: true })
    let animation = animations.showFirstDetailBox
    // animation['toValue'] *= 0.5
    // console.log(123)
    Animated.timing(component.state.detailBoxesHeightOffset, animations.showFirstDetailBox ).start(() => {
        // component.setState({ shouldShowFirstDetailBox: true })
        // Animated.timing(component.state.detailBoxesHeightOffset, animations.showFirstDetailBox ).start()sa
    })
}





export const ShouldShowDataInFirstDetailBox = (component, response, animations) => {
    console.log("ShouldShowDataInFirstDetailBox")
    var JSONResponse = JSON.stringify(response, null, 2)
    JSONResponse = JSON.parse(JSONResponse)

    let shouldShowScannedCharacters = JSONResponse["ShouldShow"]
    let scannedCharacters = JSONResponse["CleanedCharacters"]
    let imageAs64 = JSONResponse["imageAs64"]
    // console.log(1)
    component.setState({
        shouldShowFirstDetailBox: true,
        shouldShowScannedCharacters,
        scannedCharacters,
        imageAs64
    })
    // console.log(2)
    // console.log("scannedCharacters", scannedCharacters)

    if (isVINOrUnit(scannedCharacters)) {
        // console.log(3)
        // If scannedCharacters are a VIN or UNIT
        Animated.parallel([
            Animated.timing( component.state.cameraViewOpacity, { toValue: 0, duration: detailBoxesDurationTime }),
            Animated.timing( component.state.dataCorrectionOpacity, { toValue: 0, duration: detailBoxesDurationTime })
        ]).start(() => {
            component.setState({
                shouldShowCameraView: false,
                shouldShowDataCorrectionView: false
            })
        })
        component.animateDetailBoxesHeightOffset( animations.showBothDetailBoxes )
        // console.log(4)
        // component.setState(state)
    } else {

        // Else we tell the user their scan wasn't successful
        Animated.parallel([
            Animated.timing( component.state.detailBoxesHeightOffset, animations.showFirstDetailBox ),
            Animated.timing( component.state.firstDetailBoxHeight, { toValue: firstDetailBoxTallDefaultHeight, duration: detailBoxesDurationTime }),
        ]).start()

    }
}





export const ShouldShowDataInSecondDetailBox = (component, response, animations) => {
    var JSONResponse = JSON.stringify(response, null, 2)
    JSONResponse = JSON.parse(JSONResponse)
    let scannedStringDBData = JSONResponse["scannedStringDBData"]

    if (isEmpty(scannedStringDBData) == false) {
    // Row exists in DB with corresponding data to what was scanned
        component.setState({
                scannedStringDBData,
                doesScannedStringExistInDB: true,
            })
        Animated.parallel([
            Animated.timing( component.state.secondDetailBoxHeight, { toValue: tallSecondDetailBoxDefaultHeight, duration: detailBoxesDurationTime }),
            Animated.timing( component.state.firstDetailBoxHeight, { toValue: firstDetailBoxMediumDefaultHeight, duration: detailBoxesDurationTime }),
        ]).start( () => {

        })

    } else {
    // else if the scannedStringDBData wasn't in the database 'scannedStringDBData' is empty
        Animated.parallel([
            Animated.timing( component.state.secondDetailBoxHeight, { toValue: mediumSecondDetailBoxDefaultHeight, duration: detailBoxesDurationTime }),
            Animated.timing( component.state.detailBoxesHeightOffset, animations.showBothDetailBoxes),
        ]).start( () => {
            component.setState({
                scannedStringDBData: {},
                doesScannedStringExistInDB: false,
            })
        })
    }
}





export const HideAndResetEverything = (component) => {
    // 'checkScannedCharactersOrScanAgain' also works by hiding everything, showing the cameraView in swift and then resets state.
    // Also what we need here, so we reuse it
    Alert.alert(
        "An Error occured",
        "Something that shouldn't happen, happend",
        [{ text: "OK", onPress: () => { component.checkScannedCharactersOrScanAgain(true) } }]
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
    Animated.parallel([
        Animated.timing( component.state.cameraViewOpacity, { toValue: shouldShow ? 1 : 0, duration: detailBoxesDurationTime  } ),
        Animated.timing( component.state.dataCorrectionOpacity, { toValue: shouldShow ? 0 : 1, duration: detailBoxesDurationTime  } )
    ]).start(() => {
        console.log("shouldShow in ShouldShowCameraView", shouldShow)
        component.checkScannedCharactersOrScanAgain(shouldShow)
    })
    // Animated.timing( component.state.cameraViewOpacity, { toValue: shouldShow ? 1 : 0, duration: detailBoxesDurationTime  } ).start(() => {
    //     // component.setState({ shouldShowCameraView : shouldShow })
    //     component.checkScannedCharactersOrScanAgain(shouldShow)
    // })
}


export const ShouldShowDataCorrectionView = (component, shouldShow, imageAs64) => {
    component.setState({
        // shouldShowDataCorrectionView : shouldShow,
        imageAs64
    })

    Animated.parallel([
        Animated.timing( component.state.cameraViewOpacity, { toValue: shouldShow ? 0 : 1, duration: detailBoxesDurationTime  } ),
        Animated.timing( component.state.dataCorrectionOpacity, { toValue: shouldShow ? 1 : 0, duration: detailBoxesDurationTime  } )
    ]).start()

    // Animated.timing( component.state.dataCorrectionOpacity, { toValue: shouldShow ? 1 : 0, duration: detailBoxesDurationTime  }).start(() => {
    //     if ( shouldShow == false ) { component.setState({ dataCorrectionOpacity: new Animated.Value(0) }) }
    // })
}




