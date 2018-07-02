import {
    View, StyleSheet, Animated,
    TouchableOpacity, Image, Text,
    Easing
} from 'react-native'
import React, { Component } from 'react'
import CheckVinOrScanAgainButton from './CheckVinOrScanAgainButton'

import { ShouldShowDataCorrectionView } from '../helpers/ModuleEventListeners'
import { defaultYellow } from '../helpers/GlobalValues'
import {
    detailBoxesContentWidth, detailBoxesDurationTime, defaultFont, defaultGray
} from '../helpers/GlobalValues'

export default class StockCountInfoButton extends Component {

    state = {
        buttonsExtended: false,

        hiddenButtons: [
            {
                text: "Status",
                icon: "",
                // method: () => { console.log(1) },
                method: () => { console.log(1)
                    this.props.changeStockStatus()
                },
                style: {
                    position: 'absolute',
                    right: new Animated.Value(0), // 80
                    top: new Animated.Value(0),   // -20
                    opacity: new Animated.Value(0)
                },
            },
            {
                text: "Start",
                icon: "",
                method: () => { console.log(2) },
                style: {
                    position: 'absolute',
                    right: new Animated.Value(0), // 60
                    top: new Animated.Value(0),   // 60
                    opacity: new Animated.Value(0)
                },
            },
            {
                text: "Info",
                icon: "",
                method: () => { console.log(3) },
                style: {
                    position: 'absolute',
                    right: new Animated.Value(0), // -20
                    top: new Animated.Value(0),   //  80
                    opacity: new Animated.Value(0)
                },
            },

        ]
    }

    mainButtonClicked = () => {
        console.log("Animating")
        const { buttonsExtended } = this.state

        Animated.parallel([
            // Close
            // Animated.timing(this.state.hiddenButtons[0].style.right, { easing: Easing.out(Easing.back()), toValue: buttonsExtended? 0 : 80, duration: 1000 }),
            Animated.timing(this.state.hiddenButtons[0].style.right, { easing: Easing.linear(), toValue: buttonsExtended ? 0 : 80, duration: 750 }),
            Animated.timing(this.state.hiddenButtons[0].style.top, { easing: Easing.linear(), toValue: buttonsExtended ? 0 : -20, duration: 750 }),
            Animated.timing(this.state.hiddenButtons[0].style.opacity, { delay: 200, toValue: buttonsExtended ? 0 : 1, duration: 550 }),

            // Join
            Animated.timing(this.state.hiddenButtons[1].style.right, { easing: Easing.linear(), toValue: buttonsExtended ? 0 : 60, duration: 750 }),
            Animated.timing(this.state.hiddenButtons[1].style.top, { easing: Easing.linear(), toValue: buttonsExtended ? 0: 60, duration: 750 }),
            Animated.timing(this.state.hiddenButtons[1].style.opacity, { delay: 200, toValue: buttonsExtended ? 0 : 1, duration: 550 }),

            // Info
            Animated.timing(this.state.hiddenButtons[2].style.right, { easing: Easing.linear(), toValue: buttonsExtended ? 0 : -20, duration: 750 }),
            Animated.timing(this.state.hiddenButtons[2].style.top, { easing: Easing.linear(), toValue: buttonsExtended ? 0: 80, duration: 750 }),
            Animated.timing(this.state.hiddenButtons[2].style.opacity, { delay: 200, toValue: buttonsExtended ? 0 : 1, duration: 550 }),
        ]).start(() => {
            this.setState({ buttonsExtended: !buttonsExtended })
        })

        // this.state.hiddenButtons.map( item => {
        //     item.style.map( prop => {

        //     })
        // })


    }


    render () {
        const {
            checkScannedCharactersOrScanAgain, component, changeStockStatus
        } = this.props

        // const {
        //     mainButtonRotation
        // } = this.state

        // const mainButtonRotationDeg = mainButtonRotation.interpolate({
        //     inputRange: [ 0, 15, 105 ],
        //     outputRange: [ '0deg', '15deg', '-105deg' ]
        // })


        return (
            <View style={{
                margin: 40,
                //backgroundColor: 'green'
                //position: 'absolute'
            }}>

                { this.state.hiddenButtons.map( ( item ) => (
                    <Animated.View
                        style={ item.style }
                        key={ item.text }
                    >
                        <TouchableOpacity
                            style={[ styles.circularStyle, {  }]}

                            onPress={ () => { item.method() } }
                        >
                            <Text style={ styles.infoItemStyle }>{ item.text }</Text>
                        </TouchableOpacity>
                    </Animated.View>
                ))}

                <TouchableOpacity style={ styles.circularStyle }
                    onPress={ () => {
                        changeStockStatus()
                        this.mainButtonClicked()
                    }}
                >
                    <Animated.Image
                        style={{
                            width: 50, height: 50, opacity: 0.5,
                            //transform: [{ rotate: mainButtonRotationDeg }],
                            //transform: [{ rotate: '-105deg' }],
                        }}
                        source={ require('./StockCountIcon2.png/') }
                    />
                </TouchableOpacity>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    circularStyle: {
        backgroundColor: defaultYellow,
        borderColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 75,
        borderWidth: 1,
        height: 75,
        width: 75,
    },

    infoItemStyle: {
        fontFamily: defaultFont,
        color: defaultGray,
        fontSize: 15
    }
})