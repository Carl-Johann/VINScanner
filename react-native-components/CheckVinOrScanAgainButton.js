import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'

import {
    defaultButtonHeight, detailTextStyle,
    detailBoxesContentWidth, defaultYellow,
} from '../helpers/GlobalValues'

const CheckVinOrScanAgainButton = ({ titleText, checkScannedCharactersOrScanAgain, shouldScan }) => {
    return (
            <TouchableOpacity
                style={ styles.buttonStyle }
                onPress={ () => { checkScannedCharactersOrScanAgain(shouldScan) }}
            >
                <Text style={ detailTextStyle } >{ titleText }</Text>
            </TouchableOpacity>
    )
}


const styles = StyleSheet.create({

    buttonStyle: {
        width: (detailBoxesContentWidth / 2) - 5,
        justifyContent: 'center',
        borderColor: defaultYellow,
        alignItems: 'center',
        borderRadius: 2,
        borderWidth: 1.5,
        height: defaultButtonHeight,
    },
})

export default CheckVinOrScanAgainButton