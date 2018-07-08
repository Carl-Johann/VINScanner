import { connect } from 'react-redux'
import React, { Component } from 'react'
import { requireNativeComponent, processColor, View, Text } from 'react-native'
let DataCorrectionView = requireNativeComponent('RNDataCorrectionView', RNDataCorrectionView)


import { resetViewsReduxStateAction } from '../redux/Views/Actions'
import { resetDetailBoxesReduxStateAction } from '../redux/DetailBoxes/Actions'
import { resetScannedCharactersReduxStateAction } from '../redux/ScannedData/Actions'



class RNDataCorrectionView extends Component {

    componentWillUnmount() {
        this.props.resetViewsReduxStateAction()
        this.props.resetDetailBoxesReduxStateAction()
        this.props.resetScannedCharactersReduxStateAction()
    }

    render() {
        let { style,
            imageAs64, scannedCharacters,
            imageAs64AndDataFromScan
        } = this.props;

        return (
            // <View />
            <DataCorrectionView
                /*color={[ 55, 66, 77, 88 ]}
                location={[ 11, 22, 33, 44 ]}*/
                /*imageAs64={ imageAs64 }
                dataFromScan={ dataFromScan }*/
                style={{ flex: 1 }}
                // imageAs64AndDataFromScan={ imageAs64AndDataFromScan }
                imageAs64AndDataFromScan={{
                    dataFromScan: scannedCharacters,
                    imageAs64: imageAs64
                }}
            />
        )

    }
}



const mapStateToProps = (state) => {
    return {
        imageAs64: state.ScannedDataReducer.imageAs64,
        scannedCharacters: state.ScannedDataReducer.scannedCharacters,
        shouldShowFirstDetailBox: state.DetailBoxesReducer.shouldShowFirstDetailBox,
    }
}

const mapDispatchToProps = (dispatch) => {
  return {
    resetViewsReduxStateAction: () => dispatch(resetViewsReduxStateAction()),
    resetDetailBoxesReduxStateAction: () => dispatch(resetDetailBoxesReduxStateAction()),
    resetScannedCharactersReduxStateAction: () => dispatch(resetScannedCharactersReduxStateAction()),
  }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RNDataCorrectionView)