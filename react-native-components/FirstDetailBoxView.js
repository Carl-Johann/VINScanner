import React, { Component } from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'
import SpinKit from './SpinKit'
import CheckVinOrScanAgainButton from './CheckVinOrScanAgainButton'
import CheckVINAndScanAgainButtons from './CheckVINAndScanAgainButtons'
import Dimensions from 'Dimensions'
import LineBreaker from './LineBreaker'

let spinKitSize = 42
const widthTimes075 = () => { return Dimensions.get('window').width * 0.75 }

const FirstDetailBoxView = ({ scannedCharacters, shouldShowScannedCharacters, checkScannedCharactersOrScanAgain, firstDetailBoxHeight }) => {

    var lort = firstDetailBoxHeight.interpolate({
        inputRange: [120, 195],
        outputRange: [spinKitSize + 15, spinKitSize + 80],
    })


    if (shouldShowScannedCharacters == null) {
    // If the views has been loaded, but no data recieved, a loading spinner will wait for data to be set in state.
        return (
            <Animated.View style={[ styles.spinKitHeightStyle, { height: lort } ]}>
                <SpinKit
                    type={ 'Arc' }
                    color={ '#555555' }
                    size={ spinKitSize }
                />
                {/*<LineBreaker margin={ 7 } />*/}
            </Animated.View>
        )

    } else if (shouldShowScannedCharacters == true && ((scannedCharacters.length == 17) || (scannedCharacters.length == 6)))  {
    // If the VIN is 'perfect'

        return (
            <View style={ styles.spinKitHeightStyle }>
                <Text style={ styles.detailText }>{ scannedCharacters }</Text>
                {/*<LineBreaker margin={ 7 } />*/}
            </View>
        )

    } else {
    // We accept slightly messed up VINs as Google sometimes misses one or two characters.

        return (
            // <Animated.View style={ styles.subviewStyle }>
                <Animated.View style={{ height: lort, alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'transparent', bottom: 0 }}>
                    <Text style={ styles.detailText }>Scanned { scannedCharacters.length }{ scannedCharacters.length == 1 ? ' character.' : ' characters.' }</Text>

                    <View style={{  backgroundColor: 'transparent', marginBottom: 7}}>
                        <LineBreaker margin={ 0 } />
                        <View style={{ marginBottom: 7 }}/>
                        <View style={ styles.buttonsStyleContainerStyle } >
                            <CheckVINAndScanAgainButtons
                                checkScannedCharactersOrScanAgain={ (shouldScan) => checkScannedCharactersOrScanAgain(shouldScan) }
                            />
                        </View>
                    </View>
                    {/*<LineBreaker margin={ 7 } />*/}
                </Animated.View>
            // </Animated.View>
        )
    }

}


const styles = StyleSheet.create({

    buttonsStyleContainerStyle: {
        justifyContent: 'space-between',
        width: widthTimes075(),
        flexDirection: 'row',
    },

    subviewStyle: {
        alignItems: 'center',
        width: widthTimes075(),
        justifyContent: 'center',
        backgroundColor: 'green'
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
        // backgroundColor: 'green',

    },


})

export default FirstDetailBoxView