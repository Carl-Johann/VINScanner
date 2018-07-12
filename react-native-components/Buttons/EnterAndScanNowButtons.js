import React from 'react'

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

import {
    defaultButtonHeight, detailTextStyle,
    detailBoxesContentWidth, defaultYellow,
    defaultBorderRadius, screenWidth, defaultGray
} from '../../helpers/GlobalValues'



const EnterAndScanNowButtons = ({ scanNowMethod, enterNowMethod }) => {
    const buttonWidth = ((screenWidth * 0.75) /2 ) - 5

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', backgroundColor: 'transparent', padding: 10 }}>
            <TouchableOpacity
                style={ styles.buttonStyle }
                onPress={() => { scanNowMethod() }}
                hitSlop={{ top: 10, left: 10, bottom: 10, right: 5 }}
            >
                <Text style={ detailTextStyle } >Scan Now</Text>
            </TouchableOpacity>

            <View style={{ width: 10 }} />

            <TouchableOpacity
                style={ styles.buttonStyle }
                onPress={() => { enterNowMethod() }}
                hitSlop={{ top: 10, left: 5, bottom: 10, right: 10 }}
            >
                <Text style={ detailTextStyle } >Enter Now</Text>
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({

    buttonStyle: {
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: defaultYellow,
        height: defaultButtonHeight,
        backgroundColor: defaultYellow,
        borderRadius: defaultBorderRadius,
        width: ((screenWidth * 0.75) / 2 ) - 5,
    },
})

export default EnterAndScanNowButtons