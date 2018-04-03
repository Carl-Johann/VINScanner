import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import CheckVinOrScanAgainButton from './CheckVinOrScanAgainButton'
import CheckVINAndScanAgainButtons from './CheckVINAndScanAgainButtons'
import amYellow from './colors'
import LineBreaker from './LineBreaker'
import SpinKit from './SpinKit'
import Dimensions from 'Dimensions'

const widthTimes075 = () => { return Dimensions.get('window').width * 0.75 }

const DataFromVINView = ({ DoesVINExist, checkVINOrScanAgain, VINData }) => {
    let spinKitSize = 42


    if (DoesVINExist == null) {

        // If the views has been loaded, but no data recieved, a loading spinner will wait for data to be set in state.
        return (
            <View style={ styles.subviewStyle }>
                <LineBreaker margin={ 7 } />
                <SpinKit
                    type={ 'Arc' }
                    color={ '#555555' }
                    size={ spinKitSize }
                />
                <LineBreaker margin={ 7 } />
            </View>
        )

    } else if (DoesVINExist == true) {

        // If the VIN exists in the database
        return (
            <View style={ styles.subviewStyle }>
                <LineBreaker margin={ 7 } />
                <Text style={ styles.detailText }>Site: { VINData['site'] }</Text>
                <Text style={ styles.detailText }>Model: { VINData['model'].replace(/ .*/,'') }</Text>

                <CheckVinOrScanAgainButton
                    titleText={ 'Scan Again' }
                    checkVINOrScanAgain={ (shouldScan) => checkVINOrScanAgain(shouldScan) }
                    shouldScan={ true }
                />

                <LineBreaker margin={ 10 } />
            </View>
        )

    } else if (DoesVINExist == false) {

        // If the VIN is 17 long, but it doesn't exist in the database. Let them manually change it (compareVINCharachtersWithRetrieved() from VINCorrection.swift)
        return (
            <View style={ styles.subviewStyle }>
                <LineBreaker margin={ 7 } />
                <Text style={ styles.detailText }>VIN is incorrect or doesn't exist in the database</Text>
                <LineBreaker margin={ 10 } />

                <View style={ styles.subviewStyle } >
                    <CheckVINAndScanAgainButtons
                        checkVINOrScanAgain={ (shouldScan) => checkVINOrScanAgain(shouldScan) }
                    />
                </View>

                <LineBreaker margin={ 10 } />
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

export default DataFromVINView