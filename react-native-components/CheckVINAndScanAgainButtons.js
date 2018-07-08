import { View, StyleSheet, Animated } from 'react-native'
import React from 'react'
import CheckVinOrScanAgainButton from './CheckVinOrScanAgainButton'

import { ShouldShowDataCorrectionView } from '../helpers/ModuleEventListeners'

import {
    detailBoxesContentWidth, detailBoxesDurationTime
} from '../helpers/GlobalValues'

const CheckVINAndScanAgainButtons = ({ checkScannedCharactersOrScanAgain, component }) => {

    return (
        <View style={ styles.buttonsStyleContainerStyle }>
            <CheckVinOrScanAgainButton
                shouldScan={ false }
                titleText={ 'Check VIN' }
                checkScannedCharactersOrScanAgain={ (shouldScan) => {
                    checkScannedCharactersOrScanAgain(shouldScan)
                } }
            />

            <CheckVinOrScanAgainButton
                shouldScan={ true }
                titleText={ 'Scan Again' }
                checkScannedCharactersOrScanAgain={ (shouldScan) => {
                    checkScannedCharactersOrScanAgain(shouldScan)
                } }
            />
        </View>
    )

}

const styles = StyleSheet.create({
    buttonsStyleContainerStyle: {
        flexDirection: 'row',
        width: detailBoxesContentWidth,
        justifyContent: 'space-between',
    },
})

export default CheckVINAndScanAgainButtons