import { connect } from 'react-redux'
import React, { Component } from 'react'

import {
    View, StyleSheet, Animated, Easing,
    TouchableOpacity, Image, Text,
} from 'react-native'

import CheckVinOrScanAgainButton from './CheckVinOrScanAgainButton'
import { ShouldShowDataCorrectionView } from '../../helpers/ModuleEventListeners'

import {
    setSiteActionAS,
    setBatchIdActionAS,
    setCountInitActionAS,
    getStockCountValueActionAS,
    getStockCountObjectActionAS,
} from '../../AsyncStorage/Actions.js'

import {
    setTakingStockAction,
} from '../../redux/Views/Actions.js'

import {
    detailBoxesContentWidth, detailBoxesDurationTime,
    defaultFont, defaultGray, defaultYellow, detailBoxesWidth,
    detailBoxesMarginToEdge, defaultBorderRadius
} from '../../helpers/GlobalValues'

import CircularCancelInfoButton from './StockCountInfoButtonFields/CircularCancelInfoButton'
import CircularStartStockCountButton from './StockCountInfoButtonFields/CircularStartStockCountButton'

const time = 200
const time2 = 75
class StockCountInfoButton extends Component {


    state = {
        // buttonsExtended: false,
        buttonsExtended: false,

        hiddenButtons: [
            {
                icon: "",
                text: "Cancel",
                extended: false,

                style: {
                    position: 'absolute',
                    top: new Animated.Value(0),   // 60
                    right: new Animated.Value(0), // 60
                    opacity: new Animated.Value(0),
                },
                largeTop: -30,
                largeRight: 70,
            },

            {
                icon: "",
                text: "Start",
                extended: false,
                takingStockText: "Stop",

                style: {
                    position: 'absolute',
                    top: new Animated.Value(0),   // 100 - 0
                    right: new Animated.Value(0), // -40 - 0
                    opacity: new Animated.Value(0),
                },
                largeTop: 60,
                largeRight: 60,
            },

            // {
            //     text: "Info",
            //     takingStockText: "Info",
            //     icon: "",
            //     extended: false,
            //     method: () => { console.log(3) },
            //     style: {
            //         position: 'absolute',
            //         top: new Animated.Value(0),   // 60
            //         right: new Animated.Value(0), // 60
            //         opacity: new Animated.Value(0),
            //     },
            //     largeTop: 60,
            //     largeRight: 60,
            // },

        ]
    }





    mainButtonClicked = () => {
        const { buttonsExtended } = this.state
        // console.log("buttonsExtended", buttonsExtended)
        let largeCancel = this.state.hiddenButtons[0]
        let largeStart = this.state.hiddenButtons[1]
        // let secondIsExtended = this.state.hiddenButtons[0].extended
        // let taber = this.state.hiddenButtons[2].extended
        Animated.parallel([
            // Close
            Animated.timing(this.state.hiddenButtons[0].style.top, { easing: Easing.linear(), toValue: buttonsExtended ? 0 : largeCancel.largeTop, duration: time }),
            Animated.timing(this.state.hiddenButtons[0].style.right, { easing: Easing.linear(), toValue: buttonsExtended ? 0 : largeCancel.largeRight, duration: time }),
            Animated.timing(this.state.hiddenButtons[0].style.opacity, { delay: buttonsExtended ? 100 : 0, toValue: buttonsExtended ? 0 : 1, duration: time2 }),

            // Join
            Animated.timing(this.state.hiddenButtons[1].style.top, { easing: Easing.linear(), toValue: buttonsExtended ? 0 : largeStart.largeTop, duration: time }),
            Animated.timing(this.state.hiddenButtons[1].style.right, { easing: Easing.linear(), toValue: buttonsExtended ? 0 : largeStart.largeRight, duration: time }),
            Animated.timing(this.state.hiddenButtons[1].style.opacity, { delay: buttonsExtended ? 100 : 0, toValue: buttonsExtended ? 0 : 1, duration: time2 }),

            // // Join
            // Animated.timing(this.state.hiddenButtons[1].style.top, { easing: Easing.linear(), toValue: fuck ? 0 : 50, duration: time }),
            // Animated.timing(this.state.hiddenButtons[1].style.right, { easing: Easing.linear(), toValue: fuck ? 0 : 50, duration: time }),
            // Animated.timing(this.state.hiddenButtons[1].style.opacity, { delay: fuck ? 100 : 0, toValue: fuck ? 0 : 1, duration: time2 }),

            // Info
            // Animated.timing(this.state.hiddenButtons[2].style.top, { easing: Easing.linear(), toValue: taber ? 0 : 70, duration: time }),
            // Animated.timing(this.state.hiddenButtons[2].style.right, { easing: Easing.linear(), toValue: taber ? 0 : -30, duration: time }),
            // Animated.timing(this.state.hiddenButtons[2].style.opacity, { delay: taber ? 100 : 0, toValue: taber ? 0 : 1, duration: time2 }),
        ]).start(() => {
            this.setState({ buttonsExtended: !this.state.buttonsExtended })
        })
    }







    expandButton = (index, shouldShow) => {
        let buttonExtended = this.state.hiddenButtons[index].extended
        let largeRight = this.state.hiddenButtons[index].largeRight
        let largeTop = this.state.hiddenButtons[index].largeTop
        // console.log("Animating")

        this.setState( prevState => {
            let hiddenButtons = prevState.hiddenButtons
            hiddenButtons[index].extended = !hiddenButtons[index].extended
            if (shouldShow == false) {
                return {
                    hiddenButtons,
                    buttonsExtended: false
                }
            } else { return { hiddenButtons } }
        })


        this.state.hiddenButtons.map( (item, i) => {
            // if (index != i) {
                Animated.parallel([
                    Animated.timing(item.style.right, { toValue: 0, duration: time }),
                    Animated.timing(item.style.top, { toValue: 0, duration: time }),
                    Animated.timing(item.style.opacity, { toValue: 0, duration: time }),
                ]).start()
            // }
        })


        // Animated.parallel([
        //     Animated.timing(this.state.hiddenButtons[index].style.right, {
        //         toValue: buttonExtended ? 0 : largeRight,
        //         duration: shouldShow ? time : 0
        //     }),
        //     Animated.timing(this.state.hiddenButtons[index].style.top, {
        //         toValue: buttonExtended ? 0 : largeTop,
        //         duration: shouldShow ? time : 0
        //     }),
        //     Animated.timing(this.state.hiddenButtons[index].style.opacity, {
        //         delay: shouldShow ? 100 : 0,
        //         toValue: buttonExtended ? 0 : 1,
        //         duration: shouldShow ? time2 : 0
        //     })
        // ]).start()
    }







    render () {
        const {
            checkScannedCharactersOrScanAgain, component,
            changeStockStatus, takingStock,
        } = this.props

        const {
            hiddenButtons
        } = this.state


        return (
            <View style={{ margin: 40 }}>
                {/*{ this.state.hiddenButtons.map( ( item, index) => (
                    <Animated.View
                        style={[ item.style, styles.circularStyle, { flex: 1, padding: 10, backgroundColor: 'transparent', borderWidth: 0 }]}
                        key={ item.text }
                    >
                        <CircularStockCountButton
                            text={ takingStock ? item.takingStockText : item.text}
                            extended={ item.extended }

                            expandButton={(shouldShow) => { this.expandButton(index, shouldShow) }}
                        />
                    </Animated.View>
                ))}*/}

                { takingStock == true && (
                    <Animated.View
                        style={[ hiddenButtons[0].style, styles.circularStyle, { flex: 1, borderWidth: 0 }]}
                    >
                        <CircularCancelInfoButton
                            text={ hiddenButtons[0].text }
                            extended={ hiddenButtons[0].extended }

                            expandButton={(shouldShow) => { this.expandButton(0, shouldShow) }}
                        />

                    </Animated.View>
                )}

                <Animated.View
                    style={[ hiddenButtons[1].style, styles.circularStyle, { flex: 1, borderWidth: 0 }]}
                >
                    <CircularStartStockCountButton
                        text={ takingStock ? hiddenButtons[1].takingStockText : hiddenButtons[1].text }
                        extended={ hiddenButtons[1].extended }

                        expandButton={(shouldShow) => { this.expandButton(1, shouldShow) }}
                    />

                </Animated.View>

                <TouchableOpacity style={[ styles.circularStyle, { height: 75, width: 75, borderRadius: 75 }]}
                    onPress={ () => { changeStockStatus(), this.mainButtonClicked() }}
                >
                    <Animated.Image
                        style={{ width: 50, height: 50, opacity: 0.5 }}
                        source={ require('../../Images/StockCountIcon.png/') }
                    />
                </TouchableOpacity>

            </View>
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
        height: 75, width: 75, borderRadius: 75,

        shadowRadius: 4,
        shadowOpacity: 1,
        shadowColor: 'rgba(0, 1, 0, 0.25)',
        shadowOffset: { width: 1, height: 1 },
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
)(StockCountInfoButton)