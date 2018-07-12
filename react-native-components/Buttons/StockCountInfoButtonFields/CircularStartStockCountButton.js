import { connect } from 'react-redux'
import React, { Component } from 'react'

import {
    View, StyleSheet, Animated, Easing,
    TouchableOpacity, Image, Text,
    TouchableWithoutFeedback, Modal
} from 'react-native'

import SpinKit from '../../ViewAccessories/SpinKit'

import {
    CloseSiteRequest
} from '../../../Api/ApiCalls.js'

import StartFields from '../StockCountInfoButtonFields/StartFields'

import {
    defaultFont, defaultGray, defaultYellow, detailBoxesWidth,
    detailBoxesMarginToEdge, defaultBorderRadius, screenHeight,
    screenWidth, detailTextStyle, spinKitSize, spinKitType,
} from '../../../helpers/GlobalValues'


class CircularStartStockCountButton extends Component {


    state = {
        closeSiteStatusCode: null,
        buttonOpacity: new Animated.Value(1),
    }


    buttonClicked = (shouldShow) => {
        this.props.expandButton(shouldShow)
    }

    siteCloseConfirmed = () => {
        Animated.timing(this.state.buttonOpacity, { toValue: 0, duration: 100 }).start()

        CloseSiteRequest((statusCode) => {
            this.setState({ closeSiteStatusCode: statusCode })
            setTimeout(() => { this.props.expandButton(false) }, 1500)
        })
    }



    render () {


        const {
            buttonOpacity, closeSiteStatusCode
        } = this.state

        const statusImageOpacity = buttonOpacity.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0]
        })

        const {
            text, expandButton, extended, takingStock
        } = this.props


            return (
                <View style={{ flex: 1 }}>
                    { extended == false && (

                        <Animated.View style={ styles.circularStyle }>
                            <TouchableOpacity
                                onPress={() => { this.buttonClicked(true) }}
                                hitSlop={{ top: 7, left: 7, bottom: 7, right: 7 }}
                                style={ styles.startFieldsButtonStyles }
                            >
                                <Text>
                                    { text }
                                </Text>
                            </TouchableOpacity>
                        </Animated.View>

                    ) || (


                        <Modal
                            visible={ extended }
                            transparent={ true }
                            animationType={ "slide" }
                        >

                            { takingStock == false && (

                                // The standard 'start stock count' modal
                                <View
                                    style={ styles.startFieldsViewStyles }
                                >
                                    <StartFields
                                        hideModal={ () => { this.buttonClicked(false) } }
                                    />
                                </View>

                            ) || takingStock == true && (

                                // 'stop stock count' modal
                                <View style={ styles.stopModalViewStyle }>
                                    <Text style={ detailTextStyle }>
                                        Are you sure you want to stop the current stock count?
                                    </Text>

                                    <View style={{ justifyContent: 'center', alignItems: 'center' }} >

                                        <Animated.View style={{ opacity: statusImageOpacity, position: 'absolute' }}>
                                            { closeSiteStatusCode == null && (

                                                // Waiting for a response
                                                <SpinKit
                                                    size={ 50 }
                                                    type={ spinKitType }
                                                    color={ defaultGray }
                                                />
                                            ) || closeSiteStatusCode == 200 && (

                                                // Success
                                                <Animated.Image
                                                    style={{ width: 60, height: 60 }}
                                                    source={ require('../../../Images/SuccessfulStockPostGreen.png') }
                                                />
                                            ) || (

                                                // Error
                                                <Animated.Image
                                                    style={{ width: 60, height: 60 }}
                                                    source={ require('../../../Images/FailedStockPostRed.png') }
                                                />
                                            ) }
                                        </Animated.View>


                                        <Animated.View style={{ opacity: buttonOpacity }} >
                                            <TouchableOpacity
                                                style={ styles.confirmButtonStyle }
                                                hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
                                                onPress={() => { this.siteCloseConfirmed() }}
                                            >
                                                <Text style={ detailTextStyle }>
                                                    Confirm
                                                </Text>
                                            </TouchableOpacity>
                                        </Animated.View>
                                    </View>


                                </View>
                            ) }
                        </Modal>


                    )}
                </View>


            )
    }

}

const styles = StyleSheet.create({
    confirmButtonStyle: {
        width: 90,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: defaultBorderRadius,
    },

    circularStyle: {
        width: 75,
        height: 75,
        borderWidth: 1,
        borderRadius: 75,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'rgba(0,0,0,0.2)',
        backgroundColor: defaultYellow,

        shadowRadius: 4,
        shadowOpacity: 1,
        shadowColor: 'rgba(0, 1, 0, 0.25)',
        shadowOffset: { width: 1, height: 1 },
    },

    startFieldsButtonStyles: {
        width: 75,
        height: 75,
        borderRadius: 75,
        alignItems: 'center',
        justifyContent: 'center',
    },


    startFieldsViewStyles: {
        flex: 1,
        position: 'absolute',
        backgroundColor: 'lightgray',
        width: detailBoxesWidth * 0.9,
        height: detailBoxesWidth * 0.6,
        borderRadius: defaultBorderRadius,
        top: screenHeight / 2 - ((detailBoxesWidth * 0.6) / 2),
        left: screenWidth / 2 - ((detailBoxesWidth * 0.9) / 2),
    },

    stopModalViewStyle: {
        flex: 1,
        alignItems: 'center',
        position: 'absolute',
        backgroundColor: 'lightgray',
        width: detailBoxesWidth * 0.8,
        height: detailBoxesWidth * 0.5,
        justifyContent: 'space-around',
        padding: detailBoxesMarginToEdge,
        borderRadius: defaultBorderRadius,
        left: screenWidth / 2 - ((detailBoxesWidth * 0.8) / 2),
        top: screenHeight / 2 - ((detailBoxesWidth * 0.5) / 2),
    },


})


const mapStateToProps = (state) => {
    return {
        takingStock: state.ViewsReducer.takingStock
    }
}

const mapDispatchToProps = (dispatch) => {
  return { }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CircularStartStockCountButton)