import React, { Component } from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'
import SpinKit from './SpinKit'
import CheckVinOrScanAgainButton from './CheckVinOrScanAgainButton'
import CheckVINAndScanAgainButtons from './CheckVINAndScanAgainButtons'
import LineBreaker from './LineBreaker'

import {
    spinKitSize, defaultButtonHeight, lineBreakerMarginHeight,
    detailBoxesContentWidth, spinKitType, defaultGray,
    defaultFont, defaultFontSize, isVINOrUnit, detailTextStyle
} from './GlobalValues'

import {
    firstDetailBoxDefaultHeight, firstDetailBoxTallDefaultHeight,
    firstDetailBoxMediumDefaultHeight,
} from '../index'


const smallViewSizeHeightOffset = 0
const mediumViewSizeHeightOffset = 35
const tallViewSizeHeightOffset = 75
const remainingHeightForFailedScanText = spinKitSize + tallViewSizeHeightOffset - defaultButtonHeight - ( 2 * lineBreakerMarginHeight )


export default class FirstDetailBoxView extends Component {


    state = {
        fadeInOutValue: new Animated.Value(0)
    }

    shouldComponentUpdate( nextProps, nextState ) {
        if ((this.isEmpty(this.props.scannedStringDBData) == true) && (this.isEmpty(nextProps.scannedStringDBData) == false)) {
            Animated.timing( this.state.fadeInOutValue, { toValue: 1, duration: 500 }).start()
        }

        return true
    }

    componentWillUnmount() {
        this.setState({ fadeInOutValue: new Animated.Value(0) })
    }

    isEmpty = (obj) => {
        if (obj === null ||
            obj === undefined ||
            Array.isArray(obj) ||
            typeof obj !== 'object'
        ) {
            return true;
        }
        return Object.getOwnPropertyNames(obj).length === 0 ? true : false;
    }


    render() {
        const {
            scannedCharacters, shouldShowScannedCharacters,
            checkScannedCharactersOrScanAgain, firstDetailBoxHeight,
            scannedStringDBData,
        } = this.props

        const {
            fadeInOutValue
        } = this.state





        const interpolatedViewHeights = firstDetailBoxHeight.interpolate({
            inputRange: [
                firstDetailBoxDefaultHeight,
                firstDetailBoxMediumDefaultHeight,
                firstDetailBoxTallDefaultHeight
            ],

            outputRange: [
                spinKitSize + smallViewSizeHeightOffset,
                spinKitSize + mediumViewSizeHeightOffset,
                spinKitSize + tallViewSizeHeightOffset
            ]
        })

        const mediumHeightBasedOffOfAlpha = fadeInOutValue.interpolate({
            inputRange: [0, 1],

            outputRange: [
                lineBreakerMarginHeight,
                // Calculates the height of one textfield. So they are evenly spaced with "justifyContent: 'space-around'"
                spinKitSize + mediumViewSizeHeightOffset - defaultFontSize - lineBreakerMarginHeight
            ]
        })



        if (shouldShowScannedCharacters == null) {
        // If the views has been loaded, but no data recieved, a loading spinner will wait for data to be set in state.
            return (
                <Animated.View style={[ styles.spinKitHeightStyle, { height: interpolatedViewHeights } ]}>
                    <SpinKit
                        type={ spinKitType }
                        color={ defaultGray }
                        size={ spinKitSize }
                    />
                </Animated.View>
            )

        } else if (isVINOrUnit(scannedCharacters) == true) {
        // If the scan was succesfull

            return (
                <Animated.View style={{ justifyContent: 'space-around', height: interpolatedViewHeights }}>
                    <Text style={ detailTextStyle }>{
                        this.isEmpty(scannedStringDBData)
                            ? scannedCharacters
                            : scannedStringDBData['UNIT']
                    }</Text>

                    { this.isEmpty(scannedStringDBData) == false && (
                        <Animated.View style={{
                            justifyContent: 'space-around',
                            height: mediumHeightBasedOffOfAlpha
                        }}>

                            <LineBreaker margin={ lineBreakerMarginHeight } />
                            <Animated.Text style={[ detailTextStyle, { opacity: fadeInOutValue } ]}>
                                { scannedStringDBData['CHASSIS'] }
                            </Animated.Text>

                        </Animated.View>
                    )}
                </Animated.View>
            )

        } else {
        // We accept slightly messed up VINs as Google sometimes misses one or two characters.

            return (
                <Animated.View style={{
                    height: interpolatedViewHeights,
                    alignItems: 'center', width: detailBoxesContentWidth(),
                    justifyContent: 'space-between'
                }}>
                    <View style={[ styles.subviewStyle, { height: remainingHeightForFailedScanText } ]}>
                        <Text style={ detailTextStyle }>
                            Scanned { scannedCharacters.length }
                            { scannedCharacters.length == 1 ? ' character.' : ' characters.' }
                        </Text>
                    </View>


                    <View style={{ backgroundColor: 'transparent', width: detailBoxesContentWidth() }}>
                        <LineBreaker margin={ lineBreakerMarginHeight } />
                        <View style={ styles.buttonsStyleContainerStyle } >
                            <CheckVINAndScanAgainButtons
                                checkScannedCharactersOrScanAgain={
                                    (shouldScan) => checkScannedCharactersOrScanAgain(shouldScan)
                                }
                            />
                        </View>
                    </View>
                </Animated.View>
            )
        }
    }

}


const styles = StyleSheet.create({

    buttonsStyleContainerStyle: {
        justifyContent: 'space-between',
        width: detailBoxesContentWidth(),
        flexDirection: 'row',
    },

    subviewStyle: {
        alignItems: 'center',
        width: detailBoxesContentWidth(),
        justifyContent: 'center',
    },

    spinKitHeightStyle: {
        height: spinKitSize,
        alignItems: 'center',
        justifyContent: 'center'
    },

})