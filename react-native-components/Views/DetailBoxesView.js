import { connect } from 'react-redux'
import React, { Component } from 'react'
import Dimensions from 'Dimensions'

import {
    View, Text, StyleSheet, Animated,
    NativeEventEmitter, NativeModules
} from 'react-native'

import LineBreaker from '../ViewAccessories/LineBreaker'
import FirstDetailBoxView from './FirstDetailBoxView'
import SecondDetailBoxView from './SecondDetailBoxView'

import {
    firstDetailBoxDefaultHeight,
    secondDetailBoxDefaultHeight,
} from '../Views/CameraView'


// These two constants calculate the total height of the detail boxes.
const wholeFirstDetailBoxHeight  = ( (2 * lineBreakerMarginHeight) + ( 2 * lineBreakerHeight) + firstDetailBoxDefaultHeight  + largerTextFontTextHeight + lineBreakerMarginHeight / 2 )
const wholeSecondDetailBoxHeight = ( (2 * lineBreakerMarginHeight) + ( 2 * lineBreakerHeight) + secondDetailBoxDefaultHeight + largerTextFontTextHeight + lineBreakerMarginHeight / 2 )

const animations = {
    showBothDetailBoxes: {
        toValue: detailBoxesMarginToEdge + (isIphoneX() ? 2.5 * detailBoxesMarginToEdge : 0),
        duration: detailBoxesDurationTime
    },

    showFirstDetailBox: {
        toValue: -wholeSecondDetailBoxHeight,
        duration: detailBoxesDurationTime
    },
}


import {
    ShouldShowDataInFirstDetailBox,
    ShouldShowDataInSecondDetailBox,
} from '../../helpers/ModuleEventListeners.js'

import {
    largerTextFontSize, lineBreakerMarginHeight, detailTextStyle,
    isEmpty, detailBoxesContentWidth, detailBoxesMarginToEdge,
    detailBoxesWidth, defaultBorderRadius, isIphoneX,
    detailBoxesDurationTime, isVINOrUnit, lineBreakerHeight,
    largerTextFontTextHeight,
} from '../../helpers/GlobalValues'


class DetailBoxesView extends Component {

    state = {
        fadeInOutValue: new Animated.Value(0),
        iPhoneXMargin:  new Animated.Value(25),
    }


    shouldComponentUpdate( nextProps, nextState ) {

        // If the current scannedStringDBData is empty and the incomming scannedStringDBData is not.
        if ((isEmpty(nextProps.scannedStringDBData) == false)) {
            Animated.timing( this.state.fadeInOutValue, { toValue: 1 }).start()
        }

        // On iPhoneX extra margin is needed to make sure the edges aren't clipped by the views bottom right and left corner radius.
        // This creates the extra margin, and removes is when not needed
        if (
            (isIphoneX()) &&
            (nextProps.doesScannedStringExistInDB != null)
        ) {
            Animated.timing( this.state.iPhoneXMargin, { toValue: detailBoxesMarginToEdge, duration: detailBoxesDurationTime }).start()
        }

        return true
    }


    componentWillUnmount() {
        this.setState({
            fadeInOutValue: new Animated.Value(0),
            iPhoneXMargin:  new Animated.Value(25)
        })
    }




    render () {

        const {
            checkScannedCharactersOrScanAgain,
            firstDetailBoxHeight, secondDetailBoxHeight,
            scannedStringDBData,
        } = this.props


        return (
            <Animated.View>

                <Animated.View style={[ styles.detailBoxesStyle,
                    { marginBottom: isIphoneX() ? this.state.iPhoneXMargin : detailBoxesMarginToEdge } ]}
                >
                    <View>
                        { isEmpty(scannedStringDBData)
                        ?
                            <Text style={[ detailTextStyle, { fontSize: largerTextFontSize } ]}>
                                Scanned Text
                            </Text>
                        :
                            <Animated.Text style={[ detailTextStyle, { opacity: this.state.fadeInOutValue } ]}>
                                VIN & UNIT
                            </Animated.Text>
                        }
                    </View>


                    <LineBreaker margin={ lineBreakerMarginHeight } />
                        <FirstDetailBoxView
                            checkScannedCharactersOrScanAgain={ (shouldScan) => checkScannedCharactersOrScanAgain(shouldScan) }
                            firstDetailBoxHeight={ firstDetailBoxHeight }
                        />
                    <LineBreaker margin={ lineBreakerMarginHeight }/>
                </Animated.View>




                <View style={ styles.detailBoxesStyle } >
                    <Text style={[ detailTextStyle, { fontSize: largerTextFontSize } ]}>
                        Car Details
                    </Text>


                    <LineBreaker margin={ lineBreakerMarginHeight } />
                    <SecondDetailBoxView
                        checkScannedCharactersOrScanAgain={ (shouldScan) => checkScannedCharactersOrScanAgain(shouldScan) }
                        secondDetailBoxHeight={ secondDetailBoxHeight }
                    />
                    <LineBreaker margin={ lineBreakerMarginHeight } />
                </View>

            </Animated.View>
        )
    }
}



const styles = StyleSheet.create({

    secondDetailBoxStyle: {
        width: detailBoxesWidth,
    },

    firstDetailBoxStyle: {
        width: detailBoxesWidth
    },


    detailBoxesStyle: {
        alignItems: 'center',
        width: detailBoxesWidth,
        backgroundColor: 'lightgray',
        borderRadius: defaultBorderRadius,
        paddingTop: lineBreakerMarginHeight / 2,


        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowRadius: 5,
        shadowOpacity: 1.0,
        shadowColor: '#000000',
    },


})

const mapStateToProps = (state) => {
    return {
        scannedCharacters: state.ScannedDataReducer.scannedCharacters,
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
)(DetailBoxesView)