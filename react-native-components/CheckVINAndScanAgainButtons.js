import { View, StyleSheet } from 'react-native'
import React from 'react'
import CheckVinOrScanAgainButton from './CheckVinOrScanAgainButton'
import Dimensions from 'Dimensions'

const widthTimes075 = () => { return Dimensions.get('window').width * 0.75 }

const CheckVINAndScanAgainButtons = ({ checkVINOrScanAgain }) => {

    return (
        <View style={ styles.buttonsStyleContainerStyle }>
            <CheckVinOrScanAgainButton
                titleText={ 'Check VIN' }
                checkVINOrScanAgain={ (shouldScan) => checkVINOrScanAgain(shouldScan) }
                shouldScan={ false }
            />

            <CheckVinOrScanAgainButton
                titleText={ 'Scan Again' }
                checkVINOrScanAgain={ (shouldScan) => checkVINOrScanAgain(shouldScan) }
                shouldScan={ true }
            />
        </View>
    )

}

const styles = StyleSheet.create({
    buttonsStyleContainerStyle: {
        justifyContent: 'space-between',
        width: Dimensions.get('window').width * 0.75,
        flexDirection: 'row',
    },
})

export default CheckVINAndScanAgainButtons