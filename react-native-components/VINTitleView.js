import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import SpinKit from './SpinKit'
import CheckVinOrScanAgainButton from './CheckVinOrScanAgainButton'
import CheckVINAndScanAgainButtons from './CheckVINAndScanAgainButtons'
import Dimensions from 'Dimensions'
import LineBreaker from './LineBreaker'

let spinKitSize = 42
const widthTimes075 = () => { return Dimensions.get('window').width * 0.75 }

const VINTitleView = ({ VIN, shouldShowVIN, checkVINOrScanAgain }) => {


    if (shouldShowVIN == null) {

        // If the views has been loaded, but no data recieved, a loading spinner will wait for data to be set in state.
        return (
            <View style={ styles.spinKitHeightStyle }>
                <SpinKit
                    type={ 'Arc' }
                    color={ '#555555' }
                    size={ spinKitSize }
                />
            </View>
        )

    } else if (shouldShowVIN == true && VIN.length == 17)  {

        // If the VIN is 'perfect'
        return (
            <View style={ styles.spinKitHeightStyle }>
                <Text style={ styles.detailText }>{ VIN }</Text>
            </View>
        )

    } else {

        // We accept slightly messed up VINs as Google sometimes misses one or two characters.
        return (
            <View style={{ alignItems: 'center' }}>
                <Text style={ styles.detailText }>VIN is { VIN.length } characters long.</Text>
                <LineBreaker margin={ 7 } />
                <View style={ styles.buttonsStyleContainerStyle } >
                    <CheckVINAndScanAgainButtons
                        checkVINOrScanAgain={ (shouldScan) => checkVINOrScanAgain(shouldScan) }
                    />
                </View>
            </View>
        )

    }
    // else if (shouldShowVIN == false)  {

    //     // If the VIN returned from Google was less than 15 characters long.
    //     return (
    //         <View style={{ alignItems: 'center' }}>
    //             <Text style={ styles.detailText }>VIN returned is to short at { VIN.length } </Text>
    //             <LineBreaker margin={ 7 } />
    //             <CheckVinOrScanAgainButton
    //                 titleText={ 'Scan Again' }
    //                 checkVINOrScanAgain={ (shouldScan) => checkVINOrScanAgain(shouldScan) }
    //                 shouldScan={ true }
    //             />
    //         </View>
    //     )

    // }
}


const styles = StyleSheet.create({

    buttonsStyleContainerStyle: {
        justifyContent: 'space-between',
        width: widthTimes075(),
        flexDirection: 'row',
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

    },


})

export default VINTitleView