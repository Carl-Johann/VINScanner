import React, { Component } from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'
import CheckVinOrScanAgainButton from './CheckVinOrScanAgainButton'
import CheckVINAndScanAgainButtons from './CheckVINAndScanAgainButtons'
import amYellow from './colors'
import LineBreaker from './LineBreaker'
import SpinKit from './SpinKit'
import Dimensions from 'Dimensions'

const widthTimes075 = () => { return Dimensions.get('window').width * 0.75 }

const SecondDetailBoxView = ({ doesScannedStringExistInDB, checkScannedCharactersOrScanAgain, scannedStringDBData, secondDetailBoxHeight }) => {
    let spinKitSize = 42

    var lort = secondDetailBoxHeight.interpolate({
        inputRange: [135, 200],
        outputRange: [spinKitSize + 15, spinKitSize + 80],
    })

    if (doesScannedStringExistInDB == null) {



        // If the views has been loaded, but no data recieved, a loading spinner will wait for data to be set in state.
        return (
            <Animated.View style={[ styles.subviewStyle,  ]}>
                {/*<LineBreaker margin={ 7 } />*/}
                <Animated.View style={{ height: lort, alignItems: 'center', justifyContent: 'center' }}>
                    <SpinKit
                        type={ 'Arc' }
                        color={ '#555555' }
                        size={ spinKitSize }
                    />
                </Animated.View>
                {/*<LineBreaker margin={ 7 } />*/}
            </Animated.View>
        )

    } else if (doesScannedStringExistInDB == true) {

        // If the VIN exists in the database { height: secondDetailBoxHeight }
        return (
            <Animated.View style={[ styles.subviewStyle, { height: lort } ]}>
                {/*<LineBreaker margin={ 7 } />*/}
                <Text style={ styles.detailText }>Site: { scannedStringDBData['site'] }</Text>
                <Text style={ styles.detailText }>Model: { scannedStringDBData['model'].replace(/ .*/,'') }</Text>
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
                <Text allowFontScaling={true} style={ styles.detailText }>VIN is incorrect or doesn't exist in the database</Text>

                <LineBreaker margin={ 7 } />
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
        width: widthTimes075(),
        justifyContent: 'center',

    },

    detailText: {
        fontFamily: 'AppleSDGothicNeo-SemiBold',
        textAlign: 'center',
        color: '#555555',
        fontSize: 22,
    },


})

export default SecondDetailBoxView