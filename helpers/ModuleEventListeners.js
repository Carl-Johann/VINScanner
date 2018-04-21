import { isVINOrUnit, detailBoxesDurationTime } from './GlobalValues'
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
    Animated.timing(component.state.detailBoxesHeightOffset, animation ).start(() => {
        // component.setState({ shouldShowFirstDetailBox: true })
        // Animated.timing(component.state.detailBoxesHeightOffset, animations.showFirstDetailBox ).start()sa
    })
}





export const ShouldShowDataInFirstDetailBox = (component, response, animations) => {

    var JSONResponse = JSON.stringify(response, null, 2)
    JSONResponse = JSON.parse(JSONResponse)

    let shouldShowScannedCharacters = JSONResponse["ShouldShow"]
    let scannedCharacters = JSONResponse["CleanedCharacters"]

    component.setState({
        shouldShowFirstDetailBox: true,
        shouldShowScannedCharacters: shouldShowScannedCharacters,
        scannedCharacters: scannedCharacters,
    })


    if (isVINOrUnit(scannedCharacters)) {

        // If scannedCharacters are a VIN or UNIT
        component.animateDetailBoxesHeightOffset( animations.showBothDetailBoxes )
        // component.setState(state)
    } else {

        // Else we tell the user their scan wasn't successful
        Animated.parallel([
            Animated.timing( component.state.detailBoxesHeightOffset, animations.showFirstDetailBox ),
            Animated.timing( component.state.firstDetailBoxHeight, { toValue: firstDetailBoxTallDefaultHeight, duration: detailBoxesDurationTime }),
        ]).start()

    }
}





export const ShouldShowDataInSecondDetailBox = (component, response) => {
    var JSONResponse = JSON.stringify(response, null, 2)
    JSONResponse = JSON.parse(JSONResponse)
    let scannedStringDBData = JSONResponse["scannedStringDBData"]

    if (scannedStringDBData != null) {
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
        Animated.timing( component.state.secondDetailBoxHeight, { toValue: mediumSecondDetailBoxDefaultHeight }).start( () => {
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

    Animated.timing( component.state.detailBoxesHeightOffset, { toValue: detailBoxesDefaultHeightOffset }).start()

    Alert.alert(
        'VIN Not Returned From Your Scan',
        'Try to reposition the camera. If possible block any reflections from hitting the windshield.',
        [{ text: 'OK, Scan Again', onPress: () => component.checkScannedCharactersOrScanAgain(true) }],
        { cancelable: false }
    )
}





