import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'

import {
    defaultButtonHeight, detailTextStyle,
    detailBoxesContentWidth, defaultYellow,
    defaultBorderRadius, screenWidth, defaultGray
} from '../helpers/GlobalValues'



const EnterAndScanNowButtons = ({ scanNowMethod, enterNowMethod }) => {
    const buttonWidth = ((screenWidth * 0.75) /2 ) - 5

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <TouchableOpacity
                style={ styles.buttonStyle }
                onPress={() => { scanNowMethod() }}
            >
                <Text style={ detailTextStyle } >Scan Now</Text>
            </TouchableOpacity>

            <View style={{ width: 10 }} />

            <TouchableOpacity
                style={ styles.buttonStyle }
                onPress={() => { enterNowMethod() }}
            >
                <Text style={ detailTextStyle } >Enter Now</Text>
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({

    buttonStyle: {
        width: ((screenWidth * 0.75) /2 ) - 5,

        justifyContent: 'center',
        borderColor: defaultYellow,
        backgroundColor: defaultYellow,
        alignItems: 'center',
        borderRadius: defaultBorderRadius,
        borderWidth: 2,
        height: defaultButtonHeight,
    },
})

export default EnterAndScanNowButtons