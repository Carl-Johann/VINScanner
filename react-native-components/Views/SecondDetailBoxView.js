import { connect } from 'react-redux'
import React, { Component } from 'react'

import { View, Text, StyleSheet, Animated } from 'react-native'
import { secondDetailBoxDefaultHeight, tallSecondDetailBoxDefaultHeight } from './CameraView'

import CheckVinOrScanAgainButton from '../Buttons/CheckVinOrScanAgainButton'
import CheckVINAndScanAgainButtons from '../Buttons/CheckVINAndScanAgainButtons'

import SpinKit from '../ViewAccessories/SpinKit'
import Dimensions from 'Dimensions'
import LineBreaker from '../ViewAccessories/LineBreaker'

import {
    spinKitSize, defaultButtonHeight, lineBreakerMarginHeight,
    detailBoxesContentWidth, spinKitType, defaultGray,
    defaultFont, defaultFontSize, isVINOrUnit, detailTextStyle,
    isEmpty,
} from '../../helpers/GlobalValues'





class SecondDetailBoxView extends Component {

    state = {
        fadeInOutValue: new Animated.Value(0),
    }

    shouldComponentUpdate( nextProps, nextState ) {
        // If the current scannedStringDBData is empty and the incomming scannedStringDBData is not.
        if ((isEmpty(this.props.scannedStringDBData) == true) && (isEmpty(nextProps.scannedStringDBData) == false)) {
            Animated.timing( this.state.fadeInOutValue, { toValue: 1, duration: 500 }).start()
        }

        return true
    }


    componentWillUnmount() {
        this.setState({ fadeInOutValue: new Animated.Value(0) })
    }




    render() {

        const {
            doesScannedStringExistInDB, checkScannedCharactersOrScanAgain,
            scannedStringDBData, secondDetailBoxHeight,
        } = this.props


        if (doesScannedStringExistInDB == null) {
            // If the views has been loaded, but no data recieved, a loading spinner will wait for data to be set in state.
            return (
                <Animated.View style={[ styles.subviewStyle, { height: secondDetailBoxHeight } ]}>
                    <SpinKit
                        type={ spinKitType }
                        size={ spinKitSize }
                        color={ defaultGray }
                    />
                </Animated.View>
            )


        } else if (doesScannedStringExistInDB == true) {

            // If the VIN exists in the database { height: secondDetailBoxHeight }
            return (
                <Animated.View style={[ styles.subviewStyle, { height: secondDetailBoxHeight, opacity: this.state.fadeInOutValue } ]}>
                    <Text style={ detailTextStyle }>Site: { scannedStringDBData['SITE'] }</Text>
                    <Text style={ detailTextStyle }>ECC: { scannedStringDBData['ECC'] }</Text>
                    <Text style={ detailTextStyle } numberOfLines={ 1 }>
                        { scannedStringDBData['MAKE'].toUpperCase() } { scannedStringDBData['MODEL'].replace(/ .*/,'') }
                    </Text>
                    {/*
                        The first word in 'MODEL' is the model name 'INSIGNIA' fx. The rest is more detailed information
                        Replaces the first word with ''. Above we get the first word.
                    */}
                    <Text style={ detailTextStyle } numberOfLines={ 1 } >
                        { scannedStringDBData['MODEL'].replace(scannedStringDBData['MODEL'].replace(/ .*/,''),'') }
                    </Text>
                    <LineBreaker margin={ lineBreakerMarginHeight } />


                    <CheckVinOrScanAgainButton
                        titleText={ 'Scan Again' }
                        checkScannedCharactersOrScanAgain={ (shouldScan) => checkScannedCharactersOrScanAgain(shouldScan) }
                        shouldScan={ true }
                    />
                </Animated.View>
            )

        } else if (doesScannedStringExistInDB == false) {

            // If the VIN is 17 long, but it doesn't exist in the database. Let them manually change it (compareVINCharachtersWithRetrieved() from VINCorrection.swift)
            return (
                <Animated.View style={[ styles.subviewStyle, { height: secondDetailBoxHeight } ]}>
                    <Text allowFontScaling={ true } style={ detailTextStyle }>
                        Data is incorrect or doesn't exist in the database
                    </Text>

                    <View style={ {
                            alignItems: 'center',
                            width: detailBoxesContentWidth,
                            justifyContent: 'flex-end',
                        }}
                    >
                        <LineBreaker margin={ lineBreakerMarginHeight } />
                        <CheckVINAndScanAgainButtons
                            checkScannedCharactersOrScanAgain={ (shouldScan) => checkScannedCharactersOrScanAgain(shouldScan) }
                        />
                    </View>
                </Animated.View>
            )

        }
    }
}


const styles = StyleSheet.create({
    subviewStyle: {
        alignItems: 'center',
        width: detailBoxesContentWidth,
        justifyContent: 'space-around',
    },



})

const mapStateToProps = (state) => {
    return {
        scannedStringDBData: state.ScannedDataReducer.scannedStringDBData,
        doesScannedStringExistInDB: state.ScannedDataReducer.doesScannedStringExistInDB,
    }
}

const mapDispatchToProps = (dispatch) => {
  return { }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SecondDetailBoxView)