import React, { Component } from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'
import FirstDetailBoxView from './FirstDetailBoxView'
import SecondDetailBoxView from './SecondDetailBoxView'

import amYellow from './colors'
import Dimensions from 'Dimensions'
import LineBreaker from './LineBreaker'

const screenWidth = () => { return Dimensions.get('window').width }


const DetailBoxesView = ({ scannedCharacters, checkScannedCharactersOrScanAgain, hideAnim, firstDetailBoxHeight, secondDetailBoxHeight, shouldShowScannedCharacters, scannedStringDBData, doesScannedStringExistInDB }) => {

    return (
        <Animated.View style={{ bottom: hideAnim }}>

            <View style={[ styles.VINDetailStyle, styles.VINTitleBoxDetail ]}>
                <Text style={[ styles.detailText, { fontSize: 24 } ]}>{ scannedCharacters.length > 7 ? 'VIN' : 'Window Label' }</Text>

                <LineBreaker margin={ 7 } />
                <FirstDetailBoxView
                    scannedCharacters={ scannedCharacters }
                    shouldShowScannedCharacters={ shouldShowScannedCharacters }
                    firstDetailBoxHeight={ firstDetailBoxHeight }
                    checkScannedCharactersOrScanAgain={ (shouldScan) => checkScannedCharactersOrScanAgain(shouldScan) }
                />
                <LineBreaker margin={ 7 } />
            </View>

            <View style={[ styles.VINDetailStyle, styles.DataFromVINViewStyle ]} >
                <Text style={[ styles.detailText, { fontSize: 24 } ]}>Car Details</Text>

                <LineBreaker margin={ 7 } />
                <SecondDetailBoxView
                    checkScannedCharactersOrScanAgain={ (shouldScan) => checkScannedCharactersOrScanAgain(shouldScan) }
                    secondDetailBoxHeight={ secondDetailBoxHeight }
                    doesScannedStringExistInDB={ doesScannedStringExistInDB }
                    scannedStringDBData={ scannedStringDBData }
                />
                <LineBreaker margin={ 7 } />
            </View>

        </Animated.View>
    )
}



const styles = StyleSheet.create({

    detailText: {
        fontFamily: 'AppleSDGothicNeo-SemiBold',
        color: '#555555',
        fontSize: 22,

    },

    DataFromVINViewStyle: {
        width: Dimensions.get('window').width * 0.85,
        marginTop: Dimensions.get('window').width * 0.05
    },

    VINTitleBoxDetail: {
        width: Dimensions.get('window').width * 0.85,
        // alignItems: 'center',
        // height: 120,
    },


    VINDetailStyle: {
        backgroundColor: 'lightgray',
        padding: 7,
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