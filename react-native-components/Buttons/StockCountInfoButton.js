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

import StartFields from './StockCountInfoButtonFields/StartFields'

import {
    detailBoxesContentWidth, detailBoxesDurationTime,
    defaultFont, defaultGray, defaultYellow, detailBoxesWidth,
    detailBoxesMarginToEdge, defaultBorderRadius
} from '../../helpers/GlobalValues'

import CircularStockCountButton from './StockCountInfoButtonFields/CircularStockCountButton'

const time = 400
const time2 = 150
class StockCountInfoButton extends Component {


    state = {
        // buttonsExtended: false,
        buttonsExtended: false,

        hiddenButtons: [
            // {
            //     text: this.props.takingStock ? "Cancel" : "Status" ,
            //     icon: "",
            //     extended: false,
            //     method: () => { console.log(1)
            //         this.props.changeStockStatus()
            //     },
            //     style: {
            //         position: 'absolute',
            //         top: new Animated.Value(0),   // 60
            //         right: new Animated.Value(0), // 60
            //         opacity: new Animated.Value(0),
            //     },
            //     largeTop: 60,
            //     largeRight: 60,
            // },
            {
                text: this.props.takingStock ? "Stop" : "Start",
                icon: "",
                extended: false,
                method: () => {
                    console.log(2)
                    this.setState( prevState => {
                        let buttons = prevState.hiddenButtons
                        buttons[1].extended = true
                        return { hiddenButtons: buttons }
                    })
                    Animated.parallel([
                        Animated.timing(this.state.hiddenButtons[1].style.width, { easing: Easing.linear(), toValue: detailBoxesWidth, duration: time }),
                        Animated.timing(this.state.hiddenButtons[1].style.height, { easing: Easing.linear(), toValue: detailBoxesWidth / 1.6, duration: time }),
                        Animated.timing(this.state.hiddenButtons[1].style.right, { easing: Easing.linear(), toValue: detailBoxesMarginToEdge - 40 , duration: time }),
                        Animated.timing(this.state.hiddenButtons[1].style.borderRadius, { easing: Easing.linear(), toValue: defaultBorderRadius, duration: time }),
                        Animated.timing(this.state.hiddenButtons[1].style.shadowOpacity, { easing: Easing.linear(), toValue: 1, duration: time }),
                        Animated.timing(this.state.hiddenButtons[1].style.top, { easing: Easing.linear(), toValue: 100, duration: time }),
                        Animated.timing(this.state.hiddenButtons[1].boxOp, { delay: time - time2, easing: Easing.linear(), toValue: 1, duration: time2 }),
                    ]).start()
                },

                style: {
                    // transform: [{'translate' : [0, 0, 1]}],
                    position: 'absolute',
                    top: new Animated.Value(0),   // 60 - 0
                    right: new Animated.Value(0), // 60 - 0
                    opacity: new Animated.Value(0),
                },
                largeTop: 100,
                largeRight: -40,
            },
            // {
            //     text: "Info",
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


    componentDidMount() {
        // setSiteActionAS("")
        // setBatchIdActionAS("")
        // setCountInitActionAS("")

        // getStockCountValueActionAS((data) => console.log(data), 'count-init')
        // getStockCountObjectActionAS((data) => { console.log(data)})
        // this.state.hiddenButtons[1].method()
        // this.mainButtonClicked()
    }








    mainButtonClicked = () => {
        const { buttonsExtended } = this.state
        // console.log("buttonsExtended", buttonsExtended)
        // let lort = this.state.hiddenButtons[0].extended
        // let fuck = this.state.hiddenButtons[1].extended
        // let secondIsExtended = this.state.hiddenButtons[0].extended
        // let taber = this.state.hiddenButtons[2].extended
        Animated.parallel([
            // Close
            // Animated.timing(this.state.hiddenButtons[0].style.right, { easing: Easing.out(Easing.back()), toValue: buttonsExtended? 0 : 80, duration: 1000 }),
            // Animated.timing(this.state.hiddenButtons[0].style.top, { easing: Easing.linear(), toValue: lort ? 0 : -30, duration: time }),
            // Animated.timing(this.state.hiddenButtons[0].style.right, { easing: Easing.linear(), toValue: lort ? 0 : 70, duration: time }),
            // Animated.timing(this.state.hiddenButtons[0].style.opacity, { delay: lort ? 100 : 0, toValue: lort ? 0 : 1, duration: time2 }),

            // Join
            Animated.timing(this.state.hiddenButtons[0].style.top, { easing: Easing.linear(), toValue: buttonsExtended ? 0 : 50, duration: time }),
            Animated.timing(this.state.hiddenButtons[0].style.right, { easing: Easing.linear(), toValue: buttonsExtended ? 0 : 50, duration: time }),
            Animated.timing(this.state.hiddenButtons[0].style.opacity, { delay: buttonsExtended ? 100 : 0, toValue: buttonsExtended ? 0 : 1, duration: time2 }),

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
            } else {
                return {
                    hiddenButtons,
                }
            }

        })

        this.state.hiddenButtons.map( (item, i) => {
            if (index != i) {
                Animated.parallel([
                    Animated.timing(item.style.right, { toValue: 0, duration: time }),
                    Animated.timing(item.style.top, { toValue: 0, duration: time }),
                    Animated.timing(item.style.opacity, { toValue: 0, duration: time }),
                ]).start()
            }
        })


        Animated.parallel([
            Animated.timing(this.state.hiddenButtons[index].style.right, {
                toValue: buttonExtended ? 0 : largeRight,
                duration: shouldShow ? time : 0
            }),
            Animated.timing(this.state.hiddenButtons[index].style.top, {
                toValue: buttonExtended ? 0 : largeTop,
                duration: shouldShow ? time : 0
            }),
            Animated.timing(this.state.hiddenButtons[index].style.opacity, {
                delay: shouldShow ? 100 : 0,
                toValue: buttonExtended ? 0 : 1,
                duration: shouldShow ? time2 : 0
            })
        ]).start()
    }







    render () {
        const {
            checkScannedCharactersOrScanAgain, component, changeStockStatus
        } = this.props

        const {

        } = this.state


        return (
            <View style={{ margin: 40 }}>

                { this.state.hiddenButtons.map( ( item, index) => (
                    <Animated.View
                        style={[ item.style, styles.circularStyle, { flex: 1, padding: 10, backgroundColor: 'transparent', borderWidth: 0 }]}
                        key={ item.text }
                    >
                        <CircularStockCountButton
                            text={ item.text }
                            extended={ item.extended }

                            expandButton={(shouldShow) => { this.expandButton(index, shouldShow) }}
                        />
                    </Animated.View>
                ))}

                <TouchableOpacity style={[ styles.circularStyle, { height: 75, width: 75, borderRadius: 75 }]}
                    onPress={ () => { changeStockStatus(), this.mainButtonClicked() }}
                >
                    <Animated.Image
                        style={{ width: 50, height: 50, opacity: 0.5 }}
                        source={ require('../ViewAccessories/StockCountIcon2.png/') }
                    />
                </TouchableOpacity>

            </View>
        )
    }

}

const styles = StyleSheet.create({
    circularStyle: {
        // width: 75,
        // height: 75,
        // borderRadius: 75,

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

// Some of these actions get used in another file
const mapDispatchToProps = (dispatch) => {
  return {
    setTakingStockAction: (takingStock) => dispatch(setTakingStockAction(takingStock))
  }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StockCountInfoButton)