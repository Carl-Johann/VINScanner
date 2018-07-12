import { connect } from 'react-redux'
import React, { Component } from 'react'

import {
    View, Modal, Text, StyleSheet, Animated,
} from 'react-native'

import {
    setShouldShowModalAction,
    resetStockCountReducerAction,
} from '../../redux/StockCount/Actions.js'

import {
    setShouldScanAction
} from '../../redux/Views/Actions.js'

import SpinKit from '../ViewAccessories/SpinKit'

import {
    defaultBorderRadius, defaultYellow,
    lineBreakerMarginHeight, screenWidth,
    lineBreakerHeight, detailBoxesWidth,
    detailBoxesMarginToEdge, screenHeight,
    spinKitType, spinKitSize, defaultGray,
} from '../../helpers/GlobalValues.js'



class StockCountModal extends Component {


    // componentDidMount() {
    //     console.log("Modal did mount")
    // }


    shouldComponentUpdate(nextProps, nextState) {
        // The modal is shown on screen and is commanded to disappear
        // if (this.props.modalVisible == true && nextProps.modalVisible == false) {

        // // The modal is hidden and is commanded to appear
        // } else if (this.props.modalVisible == false && nextProps.modalVisible == true) {

        // }

        if ( nextProps.statusCode != null ) {
            setTimeout(() => {
                    // this.props.setShouldShowModalAction(false)
                    this.props.setShouldScanAction(true)
                    this.props.resetStockCountReducerAction()
            }, 750);
        }


        return true
    }




    render () {



        const {
            modalVisible, statusCode
        } = this.props


            return (
                <Modal
                    transparent={ true }
                    visible={ modalVisible }
                    animationType={ "slide" }
                >
                    <View style={{
                        flex: 1,
                        position: 'absolute',
                        backgroundColor: 'lightgray',
                        width: detailBoxesWidth * 0.5,
                        height: detailBoxesWidth * 0.35,
                        borderRadius: defaultBorderRadius,
                        top: screenHeight / 2 - ((detailBoxesWidth * 0.35) / 2),
                        left: screenWidth / 2 - ((detailBoxesWidth * 0.5) / 2),

                    }}>
                        <View style={{ justifyContent: 'space-between', flex: 1, paddingLeft: detailBoxesMarginToEdge, paddingRight: detailBoxesMarginToEdge }}>
                            <View style={{
                                height: lineBreakerHeight,
                                backgroundColor: defaultYellow,
                                marginTop: lineBreakerMarginHeight ,
                                // marginBottom: lineBreakerMarginHeight ,
                            }} />

                            <View style={{ alignItems: 'center', backgroundColor: 'transparent' }}>
                                { statusCode == null && (
                                    <SpinKit
                                        size={ 65 }
                                        type={ spinKitType }
                                        color={ defaultGray }
                                    />
                                ) || statusCode == 200 && (
                                    <Animated.Image
                                        style={{ width: 75, height: 75, opacity: 1 }}
                                        source={ require('../../Images/SuccessfulStockPostGreen.png') }
                                    />
                                ) || (
                                    <Animated.Image
                                        style={{ width: 75, height: 75, opacity: 0.85 }}
                                        source={ require('../../Images/FailedStockPostRed.png') }
                                    />
                                )}
                            </View>

                            <View style={{
                                height: lineBreakerHeight,
                                backgroundColor: defaultYellow,
                                // marginTop: lineBreakerMarginHeight / 2,
                                marginBottom: lineBreakerMarginHeight ,
                            }} />
                        </View>
                    </View>
                </Modal>
            )
    }

}

const styles = StyleSheet.create({

})

const mapStateToProps = (state) => {
    return {
        statusCode: state.StockCountReducer.statusCode,
        modalVisible: state.StockCountReducer.modalVisible,
    }
}

const mapDispatchToProps = (dispatch) => {
  return {
    resetStockCountReducerAction: () => dispatch(resetStockCountReducerAction()),
    setShouldScanAction: (shouldScan) => dispatch(setShouldScanAction(shouldScan)),
    setShouldShowModalAction: (shouldShow) => dispatch(setShouldShowModalAction(shouldShow)),
  }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StockCountModal)