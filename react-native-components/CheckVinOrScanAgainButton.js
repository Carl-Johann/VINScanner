import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import amYellow from './colors'
import Dimensions from 'Dimensions'

const widthTimes075 = () => { return Dimensions.get('window').width * 0.75 }

const CheckVinOrScanAgainButton = ({ titleText, checkVINOrScanAgain, shouldScan }) => {
    return (
            <TouchableOpacity
                style={ styles.buttonStyle }
                onPress={ () => { checkVINOrScanAgain(shouldScan) }}
            >
                <Text style={ styles.detailText } >{ titleText }</Text>
            </TouchableOpacity>
    )
}


const styles = StyleSheet.create({

    detailText: {
        fontFamily: 'AppleSDGothicNeo-SemiBold',
        color: '#555555',
        fontSize: 22,
    },

    buttonStyle: {
        width: ((widthTimes075() / 2) - 5),
        justifyContent: 'center',
        borderColor: amYellow,
        alignItems: 'center',
        borderRadius: 4,
        borderWidth: 2,
        height: 55,
    },
})

export default CheckVinOrScanAgainButton