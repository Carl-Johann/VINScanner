import React, { Component } from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'
import FirstDetailBoxView from './FirstDetailBoxView'
import SecondDetailBoxView from './SecondDetailBoxView'
import Dimensions from 'Dimensions'
import LineBreaker from './LineBreaker'

import {
    largerTextFontSize, lineBreakerMarginHeight, detailTextStyle
} from './GlobalValues'



const DetailBoxesView = ({
            scannedCharacters, checkScannedCharactersOrScanAgain, hideAnim,
            firstDetailBoxHeight, secondDetailBoxHeight, shouldShowScannedCharacters,
            scannedStringDBData, doesScannedStringExistInDB
                        }) => {


    return (
        <Animated.View style={{ bottom: hideAnim }}>

            <View style={[ styles.VINDetailStyle, styles.VINTitleBoxDetail ]}>
                <Text style={[ detailTextStyle, { fontSize: largerTextFontSize } ]}>
                    { scannedCharacters.length > 7 ? 'VIN' : 'UNIT' }
                </Text>

                <LineBreaker margin={ lineBreakerMarginHeight } />
                    <FirstDetailBoxView
                        checkScannedCharactersOrScanAgain={ (shouldScan) => checkScannedCharactersOrScanAgain(shouldScan) }
                        shouldShowScannedCharacters={ shouldShowScannedCharacters }
                        firstDetailBoxHeight={ firstDetailBoxHeight }
                        scannedStringDBData={ scannedStringDBData }
                        scannedCharacters={ scannedCharacters }
                    />
                <LineBreaker margin={ lineBreakerMarginHeight } />
            </View>



            <View style={[ styles.VINDetailStyle, styles.DataFromVINViewStyle ]} >
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



const styles = StyleSheet.create({

    DataFromVINViewStyle: {
        width: Dimensions.get('window').width * 0.85,
        marginTop: Dimensions.get('window').width * 0.05
    },

    VINTitleBoxDetail: {
        width: Dimensions.get('window').width * 0.85,
    },


    VINDetailStyle: {
        backgroundColor: 'lightgray',
        padding: lineBreakerMarginHeight,
        borderRadius: 8,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 1.0,
        alignItems: 'center',
    },


})

export default DetailBoxesView