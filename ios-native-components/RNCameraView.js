import React, { Component } from 'react';
import { requireNativeComponent, processColor, View, Text, Animated } from 'react-native';
let RNCameraViewSwift = requireNativeComponent('RNCameraViewSwift', RNCameraView);

class RNCameraView extends Component {

  render() {
    const {
      style, shouldScan,
      takingStock, shouldTakePicture, enterDataManually
    } = this.props

    return (
      <RNCameraViewSwift
        style={ style }
        colors={[ 5, 6, 7, 8 ]}
        ShouldScan={ shouldScan }
        ShouldTakePicture={ shouldTakePicture }
        takingStock={ takingStock }
        ShouldEnterDataManually={ enterDataManually }
        locations={[ 1, 2, 3, 4 ]}
      />
    )

  }
}

export default RNCameraView