
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

import {
    setTakingStockAction
} from '../../../redux/Views/Actions.js'


import {
    defaultFont, defaultGray, defaultYellow, detailBoxesWidth,
    detailBoxesMarginToEdge, defaultBorderRadius, screenHeight,
    screenWidth, detailTextStyle, spinKitSize, spinKitType,
} from '../../../helpers/GlobalValues'


class CircularCancelInfoButton extends Component {


    state = {
        closeSiteStatusCode: null,
        buttonOpacity: new Animated.Value(1),
    }

    siteCloseConfirmed = () => {
        Animated.timing(this.state.buttonOpacity, { toValue: 0, duration: 100 }).start()

        CloseSiteRequest((statusCode) => {
            this.setState({ closeSiteStatusCode: statusCode })
            setTimeout(() => {
                this.props.setTakingStockAction(false)
                this.props.expandButton(false)
            }, 1500)
        })
    }

    buttonClicked = (shouldShow) => {
        this.props.expandButton(shouldShow)
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
                                style={ styles.cancelFieldsButtonStyles }
                                onPress={() => { this.buttonClicked(true) }}
                                hitSlop={{ top: 7, left: 7, bottom: 7, right: 7 }}
                            >
                                <Text>{ text }</Text>
                            </TouchableOpacity>
                        </Animated.View>

                    ) || (

                        <Modal
                            visible={ extended }
                            transparent={ true }
                            animationType={ "slide" }
                        >

                            {/*// 'stop stock count' modal */}
                            <View style={ styles.cancelModalViewStyle }>
                                <View>
                                    <Text style={ detailTextStyle }>
                                        Are you sure you want to cancel the stock count?
                                    </Text>

                                    <Text style={ detailTextStyle }>
                                        This should only be used if something goes wrong.
                                    </Text>
                                </View>

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

                                            // Update was successful
                                            <Animated.Image
                                                style={{ width: 60, height: 60 }}
                                                source={ require('../../../Images/SuccessfulStockPostGreen.png') }
                                            />
                                        ) || (

                                            // Update wasn't successful
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
                                            <Text style={ detailTextStyle }>Confirm</Text>
                                        </TouchableOpacity>
                                    </Animated.View>

                                </View>

                            </View>
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
        borderRadius: 75,

        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'rgba(0,0,0,0.2)',
        backgroundColor: defaultYellow,


        shadowRadius: 4,
        shadowOpacity: 1,
        shadowColor: 'rgba(0, 1, 0, 0.25)',
        shadowOffset: { width: 1, height: 1 },
    },

    cancelFieldsButtonStyles: {
        width: 75,
        height: 75,
        borderRadius: 75,
        alignItems: 'center',
        justifyContent: 'center',
    },

    cancelModalViewStyle: {
        flex: 1,
        position: 'absolute',
        backgroundColor: 'lightgray',
        width: detailBoxesWidth * 0.9,
        height: detailBoxesWidth * 0.6,
        padding: detailBoxesMarginToEdge,
        borderRadius: defaultBorderRadius,
        alignItems: 'center',
        justifyContent: 'space-around',
        left: screenWidth / 2 - ((detailBoxesWidth * 0.9) / 2),
        top: screenHeight / 2 - ((detailBoxesWidth * 0.6) / 2),
    },


})


const mapStateToProps = (state) => {
    return {
        takingStock: state.ViewsReducer.takingStock
    }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setTakingStockAction: (takingStock) => dispatch(setTakingStockAction(takingStock))
  }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CircularCancelInfoButton)