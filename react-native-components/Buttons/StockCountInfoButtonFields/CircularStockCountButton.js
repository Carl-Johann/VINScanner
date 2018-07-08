import { connect } from 'react-redux'
import React, { Component } from 'react'

import {
    View, StyleSheet, Animated, Easing,
    TouchableOpacity, Image, Text,
    TouchableWithoutFeedback,
} from 'react-native'



import StartFields from '../StockCountInfoButtonFields/StartFields'

import {
    detailBoxesContentWidth, detailBoxesDurationTime,
    defaultFont, defaultGray, defaultYellow, detailBoxesWidth,
    detailBoxesMarginToEdge, defaultBorderRadius, screenHeight, screenWidth,
} from '../../../helpers/GlobalValues'

const time = 400
const time2 = 250


class CircularStockCountButton extends Component {


    state = {
        icon: "",
        extended: false,
        boxOp: new Animated.Value(0),
        text: this.props.takingStock ? "Stop" : "Start",

        style: {
            position: 'absolute',
            width: new Animated.Value(75),
            height: new Animated.Value(75),
            opacity: new Animated.Value(1),
            borderRadius: new Animated.Value(75),
        }
    }


    componentDidMount() {

    }


    buttonClicked = (shouldShow) => {

        if (shouldShow) {
            this.props.expandButton(shouldShow)

            Animated.parallel([
                Animated.timing(this.state.boxOp, { delay: 375, toValue: 1, duration: 100 }),
                Animated.timing(this.state.style.width, { duration: time, toValue: detailBoxesWidth }),
                Animated.timing(this.state.style.height, { duration: time, toValue: detailBoxesWidth / 1.6 }),
                Animated.timing(this.state.style.borderRadius, { duration: time, toValue: defaultBorderRadius }),
            ]).start()

        } else {

            Animated.timing(this.state.style.opacity, { toValue: 0, duration: time }).start(() => {
                Animated.parallel([
                    Animated.timing(this.state.boxOp, { toValue: 0, duration: 0 }),
                    Animated.timing(this.state.style.width, { toValue: 75, duration: 0 }),
                    Animated.timing(this.state.style.height, { toValue: 75, duration: 0 }),
                    Animated.timing(this.state.style.opacity, { toValue: 1, duration: 0 }),
                    Animated.timing(this.state.style.borderRadius, { toValue: 75, duration: 0 }),
                ]).start()

                this.props.expandButton(shouldShow)
            })
        }

    }


    render () {

        const {
            width, height, top, opacity, borderRadius,
            shadowOpacity, right,
        } = this.state.style

        const {
            boxOp, method
        } = this.state

        const {
            text, expandButton, extended
        } = this.props


            return (
                <Animated.View style={[ styles.circularStyle, { width, height, borderRadius, opacity }]}>

                    { extended == false && (

                        <TouchableOpacity
                            hitSlop={{ top: 7, left: 7, bottom: 7, right: 7 }}
                            style={{ width: 75, height: 75, borderRadius: 75, alignItems: 'center', justifyContent: 'center' }}
                            onPress={() => { this.buttonClicked(true) }}
                        >
                            <Text>
                                { text }
                            </Text>
                        </TouchableOpacity>


                    ) || (

                        <Animated.View style={{ opacity: boxOp }}>
                            <StartFields
                                hideModal={ () => { this.buttonClicked(false) } }
                            />
                        </Animated.View>

                    )}

                </Animated.View>
            )
    }

}

const styles = StyleSheet.create({
    circularStyle: {
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'rgba(0,0,0,0.2)',
        backgroundColor: defaultYellow,
    },

    infoItemStyle: {
        fontSize: 15,
        color: defaultGray,
        fontFamily: defaultFont,
    }
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
)(CircularStockCountButton)