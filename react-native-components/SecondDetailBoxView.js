import React, { Component } from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'

import CheckVinOrScanAgainButton from './CheckVinOrScanAgainButton'
import CheckVINAndScanAgainButtons from './CheckVINAndScanAgainButtons'

import { secondDetailBoxDefaultHeight, tallSecondDetailBoxDefaultHeight } from '../index'

import LineBreaker from './LineBreaker'
import SpinKit from './SpinKit'
import Dimensions from 'Dimensions'

import {
    spinKitSize, defaultButtonHeight, lineBreakerMarginHeight,
    detailBoxesContentWidth, spinKitType, defaultGray,
    defaultFont, defaultFontSize, isVINOrUnit, detailTextStyle
} from './GlobalValues'

const smallViewSizeHeightOffset = 50
const tallViewSizeHeightOffset = 140

const SecondDetailBoxView = ({ doesScannedStringExistInDB, checkScannedCharactersOrScanAgain, scannedStringDBData, secondDetailBoxHeight, scannedCharacters }) => {

    var interpolatedViewHeights = secondDetailBoxHeight.interpolate({
        inputRange: [
            secondDetailBoxDefaultHeight,
            tallSecondDetailBoxDefaultHeight
        ],
        outputRange: [
            spinKitSize + smallViewSizeHeightOffset,
            spinKitSize + tallViewSizeHeightOffset
        ],
    })

    if (doesScannedStringExistInDB == null) {
        // If the views has been loaded, but no data recieved, a loading spinner will wait for data to be set in state.
        return (
            <Animated.View style={[ styles.subviewStyle, { height: interpolatedViewHeights } ]}>

                    <SpinKit
                        type={ spinKitType }
                        color={ defaultGray }
                        size={ spinKitSize }
                    />

            </Animated.View>
        )


    } else if (doesScannedStringExistInDB == true) {

        // If the VIN exists in the database { height: secondDetailBoxHeight }
        return (
            <Animated.View style={[ styles.subviewStyle, { height: interpolatedViewHeights } ]}>
                <Text style={ detailTextStyle }>Site: { scannedStringDBData['SITE'] }</Text>
                <Text style={ detailTextStyle }>ECC: { scannedStringDBData['ECC'] }</Text>
                <Text style={ detailTextStyle }>
                    { scannedStringDBData['MAKE'].toUpperCase() } { scannedStringDBData['MODEL'].replace(/ .*/,'') }
                </Text>
                {/*
                    The first word in 'MODEL' is the model name 'INSIGNIA' fx. The rest is more detailed information
                    Replaces the first word with ''. Above we get the first word.
                */}
                <Text numberOfLines={ 1 } style={ detailTextStyle }>
                    { scannedStringDBData['MODEL'].replace(scannedStringDBData['MODEL'].replace(/ .*/,''),'') }
                </Text>
                <LineBreaker margin={ lineBreakerMarginHeight } />

                <Animated.View style={{  }}>
                    <CheckVinOrScanAgainButton
                        titleText={ 'Scan Again' }
                        checkScannedCharactersOrScanAgain={ (shouldScan) => checkScannedCharactersOrScanAgain(shouldScan) }
                        shouldScan={ true }
                    />

                </Animated.View>

            </Animated.View>
        )

    } else if (doesScannedStringExistInDB == false) {

        // If the VIN is 17 long, but it doesn't exist in the database. Let them manually change it (compareVINCharachtersWithRetrieved() from VINCorrection.swift)
        return (
            <View style={ styles.subviewStyle }>
                <Text allowFontScaling={true} style={detailTextStyle }>
                    Data is incorrect or doesn't exist in the database
                </Text>

                <LineBreaker margin={ lineBreakerMarginHeight } />
                <View style={ styles.subviewStyle } >
                    <CheckVINAndScanAgainButtons
                        checkScannedCharactersOrScanAgain={ (shouldScan) => checkScannedCharactersOrScanAgain(shouldScan) }
                    />
                </View>
            </View>
        )

    }
}


const styles = StyleSheet.create({
    subviewStyle: {
        alignItems: 'center',
        width: detailBoxesContentWidth(),
        justifyContent: 'space-around',

    },



})

export default SecondDetailBoxView