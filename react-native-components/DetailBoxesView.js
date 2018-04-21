import React, { Component } from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'
import FirstDetailBoxView from './FirstDetailBoxView'
import SecondDetailBoxView from './SecondDetailBoxView'
import Dimensions from 'Dimensions'
import LineBreaker from './LineBreaker'

import {
    largerTextFontSize, lineBreakerMarginHeight, detailTextStyle,
    isEmpty, detailBoxesContentWidth, detailBoxesMarginToEdge,
    detailBoxesWidth,
} from '../helpers/GlobalValues'



export default class DetailBoxesView extends Component {

    state = {
        fadeInOutValue: new Animated.Value(0),
    }

    shouldComponentUpdate( nextProps, nextState ) {

        // If the current scannedStringDBData is empty and the incomming scannedStringDBData is not.
        if ((isEmpty(this.props.scannedStringDBData) == true) && (isEmpty(nextProps.scannedStringDBData) == false)) {
            Animated.timing( this.state.fadeInOutValue, { toValue: 1 }).start()
        }

        return true
    }

    componentWillUnmount() {
        this.setState({ fadeInOutValue: new Animated.Value(0) })
    }

    render () {
        const {
            scannedCharacters, checkScannedCharactersOrScanAgain,
            detailBoxesHeightOffset, firstDetailBoxHeight,
            secondDetailBoxHeight, shouldShowScannedCharacters,
            scannedStringDBData, doesScannedStringExistInDB,

        } = this.props

        return (
            <Animated.View style={{}}>





                <View style={ styles.detailBoxesStyle }>
                    <View>
                        { isEmpty(scannedStringDBData) == true
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
                            shouldShowScannedCharacters={ shouldShowScannedCharacters }
                            firstDetailBoxHeight={ firstDetailBoxHeight }
                            scannedStringDBData={ scannedStringDBData }
                            scannedCharacters={ scannedCharacters }
                        />
                    <LineBreaker margin={ lineBreakerMarginHeight }/>
                </View>




                <View style={{ height: detailBoxesMarginToEdge }} />




                <View style={ styles.detailBoxesStyle } >
                    <Text style={[ detailTextStyle, { fontSize: largerTextFontSize } ]}>
                        Car Details
                    </Text>

                    <LineBreaker margin={ lineBreakerMarginHeight } />
                    <SecondDetailBoxView
                        checkScannedCharactersOrScanAgain={ (shouldScan) => checkScannedCharactersOrScanAgain(shouldScan) }
                        doesScannedStringExistInDB={ doesScannedStringExistInDB }
                        secondDetailBoxHeight={ secondDetailBoxHeight }
                        scannedStringDBData={ scannedStringDBData }
                        scannedCharacters={ scannedCharacters }
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
        backgroundColor: 'lightgray',
        paddingTop: lineBreakerMarginHeight / 2,
        // paddingBottom: lineBreakerMarginHeight / 2,
        width: detailBoxesWidth,


        shadowOffset: {
            width: 0,
            height: 3 },
        borderRadius: 2,
        shadowRadius: 5,
        shadowOpacity: 1.0,
        shadowColor: '#000000',
    },


})

