import { connect } from 'react-redux'
import React, { Component } from 'react'
import {
  requireNativeComponent, Text,
  processColor, View, Animated
} from 'react-native'
let RNCameraViewSwift = requireNativeComponent('RNCameraViewSwift', RNCameraView)

class RNCameraView extends Component {

  render() {

    const {
      shouldShowFirstDetailBox, takingStock,
      shouldTakePicture, enterDataManually,
      shouldScan,
    } = this.props


    return (
      <RNCameraViewSwift
        takingStock={ takingStock }
        ShouldTakePicture={ shouldTakePicture }
        ShouldScan={ shouldScan }
        ShouldEnterDataManually={ enterDataManually }
      />
    )

  }
}


const mapStateToProps = (state) => {
    return {
      shouldScan: state.ViewsReducer.shouldScan,
      takingStock: state.ViewsReducer.takingStock,
      enterDataManually: state.ViewsReducer.enterDataManually,
      shouldTakePicture: state.ViewsReducer.shouldTakePicture,
      shouldShowFirstDetailBox: state.DetailBoxesReducer.shouldShowFirstDetailBox,
    }
}

const mapDispatchToProps = (dispatch) => {
  return { }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RNCameraView)