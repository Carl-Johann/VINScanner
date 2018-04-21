import { View, StyleSheet } from 'react-native'
import React from 'react'
import CheckVinOrScanAgainButton from './CheckVinOrScanAgainButton'

import {
    detailBoxesContentWidth
} from '../helpers/GlobalValues'

const CheckVINAndScanAgainButtons = ({ checkScannedCharactersOrScanAgain }) => {

    return (
        <View style={ styles.buttonsStyleContainerStyle }>
            <CheckVinOrScanAgainButton
                titleText={ 'Check VIN' }
                checkScannedCharactersOrScanAgain={ (shouldScan) => checkScannedCharactersOrScanAgain(shouldScan) }
                shouldScan={ false }
            />

            <CheckVinOrScanAgainButton
                titleText={ 'Scan Again' }
                checkScannedCharactersOrScanAgain={ (shouldScan) => checkScannedCharactersOrScanAgain(shouldScan) }
                shouldScan={ true }
            />
        </View>
    )

}

const styles = StyleSheet.create({
    buttonsStyleContainerStyle: {
        justifyContent: 'space-between',
        width: detailBoxesContentWidth,
        flexDirection: 'row',
    },
})

export default CheckVINAndScanAgainButtons