import React, { Component } from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'
import SpinKit from './SpinKit'
import CheckVinOrScanAgainButton from './CheckVinOrScanAgainButton'
import CheckVINAndScanAgainButtons from './CheckVINAndScanAgainButtons'
import Dimensions from 'Dimensions'
import LineBreaker from './LineBreaker'

let spinKitSize = 42
const widthTimes075 = () => { return Dimensions.get('window').width * 0.75 }

const VINTitleView = ({ VIN, shouldShowVIN, checkVINOrScanAgain, VINTitleComponentHeight }) => {

    var lort = VINTitleComponentHeight.interpolate({
        inputRange: [120, 195],
        outputRange: [spinKitSize + 15, spinKitSize + 80],
    })


    if (shouldShowVIN == null) {



        // If the views has been loaded, but no data recieved, a loading spinner will wait for data to be set in state.
        return (
            <Animated.View style={[ styles.spinKitHeightStyle, { height: lort } ]}>
                <SpinKit
                    type={ 'Arc' }
                    color={ '#555555' }
                    size={ spinKitSize }
                />
                <LineBreaker margin={ 7 } />
            </Animated.View>
        )

    } else if (shouldShowVIN == true && VIN.length == 17)  {

        // If the VIN is 'perfect'
        return (
            <View style={ styles.spinKitHeightStyle }>
                <Text style={ styles.detailText }>{ VIN }</Text>
                <LineBreaker margin={ 7 } />
            </View>
        )

    } else {

        // We accept slightly messed up VINs as Google sometimes misses one or two characters.
        return (
            <Animated.View style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <Animated.View style={{ height: lort, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={ styles.detailText }>VIN is { VIN.length } { VIN.length == 1 ? 'character' : 'characters' } long.</Text>

                    <LineBreaker margin={ 7 } />
                    <View style={ styles.buttonsStyleContainerStyle } >
                        <CheckVINAndScanAgainButtons
                            checkVINOrScanAgain={ (shouldScan) => checkVINOrScanAgain(shouldScan) }
                        />
                    </View>
                    <LineBreaker margin={ 7 } />
                </Animated.View>
            </Animated.View>
        )
    }

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