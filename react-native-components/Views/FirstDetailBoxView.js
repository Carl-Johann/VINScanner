import { connect } from 'react-redux'
import React, { Component } from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'

import SpinKit from '../ViewAccessories/SpinKit'
import LineBreaker from '../ViewAccessories/LineBreaker'
import CheckVinOrScanAgainButton from '../Buttons/CheckVinOrScanAgainButton'
import CheckVINAndScanAgainButtons from '../Buttons/CheckVINAndScanAgainButtons'

import {
    spinKitSize, defaultButtonHeight, lineBreakerMarginHeight,
    detailBoxesContentWidth, spinKitType, defaultGray,
    defaultFont, defaultFontSize, isVINOrUnit, detailTextStyle,
    VINLength, isEmpty,
} from '../../helpers/GlobalValues'

import {
    firstDetailBoxDefaultHeight, firstDetailBoxTallDefaultHeight,
    firstDetailBoxMediumDefaultHeight,
} from './CameraView.js'




class FirstDetailBoxView extends Component {


    state = {
        fadeInOutValue: new Animated.Value(0),
    }

    shouldComponentUpdate( nextProps, nextState ) {

        // If the current scannedStringDBData is empty and the incomming scannedStringDBData is not.
        if ((isEmpty(this.props.scannedStringDBData) == true) && (isEmpty(nextProps.scannedStringDBData) == false)) {
            Animated.timing( this.state.fadeInOutValue, { toValue: 1, duration: 500 }).start()
        } else if (nextProps.shouldShowScannedCharacters == false ) {
            Animated.timing( this.state.fadeInOutValue, { toValue: 1, duration: 500 }).start()
        }
        return true
    }


    render() {
        const {
            scannedCharacters, shouldShowScannedCharacters,
            checkScannedCharactersOrScanAgain, firstDetailBoxHeight,
            scannedStringDBData,
        } = this.props

        const { fadeInOutValue } = this.state



        const doubleDeckerHeight = (firstDetailBoxMediumDefaultHeight - lineBreakerMarginHeight) / 2
        const errorTextHeight = firstDetailBoxTallDefaultHeight - defaultButtonHeight - lineBreakerMarginHeight

        // This makes the scanned characters 'stick' to top op the detail box
        // to make space for the other data from scannedStringDBData
        const textHeight = firstDetailBoxHeight.interpolate({
            inputRange: [ firstDetailBoxDefaultHeight, firstDetailBoxMediumDefaultHeight ],
            outputRange: [ firstDetailBoxDefaultHeight, doubleDeckerHeight ]
        })



        if (scannedCharacters == null) {
        // If the view has been loaded, but no data recieved, a loading spinner will wait for data to be set in state.

            return (
                <Animated.View style={[ styles.spinKitHeightStyle, { height: firstDetailBoxHeight } ]}>
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
                <Animated.View style={{ width: detailBoxesContentWidth, height: firstDetailBoxHeight }}>

                    <Animated.View style={{ height: textHeight, justifyContent: 'center' }}>

                        <Text style={ detailTextStyle }>
                            { isEmpty(scannedStringDBData)
                                ? scannedCharacters
                                : scannedCharacters.length == VINLength ? scannedStringDBData['CHASSIS'] : scannedStringDBData['UNIT'] }
                        </Text>

                    </Animated.View>


                    { isEmpty(scannedStringDBData) == false && (
                        <Animated.View style={{ opacity: fadeInOutValue }}>

                            <LineBreaker margin={ lineBreakerMarginHeight } />
                            <View style={{ height: doubleDeckerHeight, justifyContent: 'center' }}>
                                <Text style={ detailTextStyle }>
                                    { scannedCharacters.length == VINLength ? scannedStringDBData['UNIT'] : scannedStringDBData['CHASSIS'] }
                                </Text>
                            </View>
                        </Animated.View>
                    )}

                </Animated.View>
            )

        } else {
        // We accept slightly wrong VINS and UNITs as Google sometimes misses one or two characters.

            return (
                <Animated.View style={{
                    height: firstDetailBoxHeight, justifyContent: 'center',
                    alignItems: 'center', width: detailBoxesContentWidth,
                }}>
                    <View style={[ styles.subviewStyle, { height: errorTextHeight } ]}>
                        <Text style={ detailTextStyle }>
                            Scanned { scannedCharacters.length }
                            { scannedCharacters.length == 1 ? ' character.' : ' characters.' }
                        </Text>
                    </View>


                    <View>
                        <LineBreaker margin={ lineBreakerMarginHeight } />
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
        width: detailBoxesContentWidth,
        flexDirection: 'row',
    },

    subviewStyle: {
        alignItems: 'center',
        width: detailBoxesContentWidth,
        justifyContent: 'center',
    },

    spinKitHeightStyle: {
        height: spinKitSize,
        alignItems: 'center',
        justifyContent: 'center'
    },

})

const mapStateToProps = (state) => {
    return {
        scannedCharacters: state.ScannedDataReducer.scannedCharacters,
        scannedStringDBData: state.ScannedDataReducer.scannedStringDBData,
    }
}


const mapDispatchToProps = (dispatch) => {
  return { }
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FirstDetailBoxView)