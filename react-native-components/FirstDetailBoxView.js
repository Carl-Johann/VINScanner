import React, { Component } from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'
import SpinKit from './SpinKit'
import CheckVinOrScanAgainButton from './CheckVinOrScanAgainButton'
import CheckVINAndScanAgainButtons from './CheckVINAndScanAgainButtons'
import Dimensions from 'Dimensions'
import LineBreaker from './LineBreaker'

import { firstDetailBoxDefaultHeight, tallFirstDetailBoxDefaultHeight } from '../index'


const spinKitSize = 42
const smallViewSizeHeightOffset = 0
const tallViewSizeHeightOffset = 75
const buttonHeight = 55
const lineBreakerMargin = 7
const remainingHeightForFailedScanText = spinKitSize + tallViewSizeHeightOffset - buttonHeight - ( 2 * lineBreakerMargin )

const widthTimes075 = () => { return Dimensions.get('window').width * 0.75 }

export default class FirstDetailBoxView extends Component {


    state = {
        fadeInOutValue: new Animated.Value(1)
    }

    shouldComponentUpdate( nextProps, nextState ) {
        console.log("next", nextProps.shouldShowScannedCharacters)
        console.log("this", this.props.shouldShowScannedCharacters)
        // if ((nextProps.shouldShowScannedCharacters == true) || (nextProps.shouldShowScannedCharacters == false)) {
        //
        // }
        if (nextProps.scannedCharacters.length != 0) {
            Animated.timing( this.state.fadeInOutValue, { toValue: 0, duration: 1 }).start()
        } else if (nextProps.shouldShowScannedCharacters == null) {
            this.setState({
                fadeInOutValue: new Animated.Value(1)
            })
        } else {
            Animated.timing( this.state.fadeInOutValue, { toValue: 0, duration: 900 }).start()
        }

        return true
    }



    render() {
        const {
            scannedCharacters, shouldShowScannedCharacters,
            checkScannedCharactersOrScanAgain, firstDetailBoxHeight
        } = this.props

        const {
            fadeInOutValue
        } = this.state



        const invertedFadeInOutValue = fadeInOutValue.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0]
        })


        const interpolatedViewHeights = firstDetailBoxHeight.interpolate({
            inputRange: [
                firstDetailBoxDefaultHeight,
                tallFirstDetailBoxDefaultHeight
            ],

            outputRange: [
                spinKitSize + smallViewSizeHeightOffset,
                spinKitSize + tallViewSizeHeightOffset
            ],
        })

        if (shouldShowScannedCharacters == null) {
        // If the views has been loaded, but no data recieved, a loading spinner will wait for data to be set in state.
            return (
                <Animated.View style={[ styles.spinKitHeightStyle, { height: interpolatedViewHeights, opacity: 1} ]}>
                    <SpinKit
                        type={ 'Arc' }
                        color={ '#555555' }
                        size={ spinKitSize }
                    />
                </Animated.View>
            )

        } else if ( (scannedCharacters.length == 17) || (scannedCharacters.length == 6) || (scannedCharacters.length == 7) ) {
        // If the scan was succesfull

            return (
                <Animated.View style={[ styles.spinKitHeightStyle, { height: interpolatedViewHeights, opacity: 1 } ]}>
                    <Text style={ styles.detailText }>{ scannedCharacters }</Text>
                </Animated.View>
            )

        } else {
        // We accept slightly messed up VINs as Google sometimes misses one or two characters.

            return (
                <Animated.View style={{
                    height: interpolatedViewHeights, opacity: 1,
                    alignItems: 'center', backgroundColor: 'transparent', width: widthTimes075(),
                    justifyContent: 'space-between'
                }}>
                    <View style={{
                        backgroundColor: 'transparent', width: widthTimes075(), justifyContent: 'center',
                        height: remainingHeightForFailedScanText, alignItems: 'center'
                    }}>
                        <Text style={ styles.detailText }>Scanned { scannedCharacters.length }{ scannedCharacters.length == 1 ? ' character.' : ' characters.' }</Text>
                    </View>


                    <View style={{ backgroundColor: 'transparent', width: widthTimes075() }}>
                        <LineBreaker margin={ 7 } />
                        <View style={ styles.buttonsStyleContainerStyle } >
                            <CheckVINAndScanAgainButtons
                                checkScannedCharactersOrScanAgain={ (shouldScan) => checkScannedCharactersOrScanAgain(shouldScan) }
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
        width: widthTimes075(),
        flexDirection: 'row',
    },

    subviewStyle: {
        alignItems: 'center',
        width: widthTimes075(),
        justifyContent: 'center',
        backgroundColor: 'green'
    },

    spinKitHeightStyle: {
        height: spinKitSize,
        alignItems: 'center',
        justifyContent: 'center'
    },

    detailText: {
        fontFamily: 'AppleSDGothicNeo-SemiBold',
        color: '#555555',
        fontSize: 22,
        textAlign: 'center',
        // backgroundColor: 'green',

    },


})

// export default FirstDetailBoxView