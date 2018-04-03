import React, { Component } from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'
import VINTitleView from './VINTitleView'
import DataFromVINView from './DataFromVINView'

import amYellow from './colors'
import Dimensions from 'Dimensions'
import LineBreaker from './LineBreaker'

const screenWidth = () => { return Dimensions.get('window').width }



const VINDetailView = ({ VIN, checkVINOrScanAgain, hideAnim, VINTitleComponentHeight, dataFromVINComponentHeight, shouldShowVIN, VINData, DoesVINExist }) => {
    // console.log(1313131313)
    return (
        <Animated.View style={{ bottom: hideAnim }}>
            <Animated.View style={[ styles.VINDetailStyle, styles.VINTitleBoxDetail, { height: VINTitleComponentHeight } ]}>
                <Text style={[ styles.detailText, { fontSize: 24 } ]}>VIN</Text>
                <LineBreaker margin={ 7 } />

                <VINTitleView
                    VIN={ VIN }
                    shouldShowVIN={ shouldShowVIN }
                    checkVINOrScanAgain={ (shouldScan) => checkVINOrScanAgain(shouldScan) }
                />
                <LineBreaker margin={ 7 } />
            </Animated.View>

            <Animated.View style={[ styles.VINDetailStyle, styles.DataFromVINViewStyle, { height: dataFromVINComponentHeight }]} >
                <Text style={[ styles.detailText, { fontSize: 24 } ]}>Car Details</Text>
                <View >
                    <DataFromVINView
                        checkVINOrScanAgain={ (shouldScan) => checkVINOrScanAgain(shouldScan) }
                        DoesVINExist={ DoesVINExist }
                        VINData={ VINData }
                    />
                </View>
            </Animated.View>
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
        justifyContent: 'center',
        alignItems: 'center',
        height: 120,
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

export default VINDetailView