import React, { Component } from 'react';
import { requireNativeComponent, processColor, View, Text } from 'react-native';
let RNLinearGradient = requireNativeComponent('RNCameraViewSwift', RNCameraView);

class RNCameraView extends Component {

  componentDidMount() {

    // console.log("skinke")
  }

  render() {
    let { colors, locations, ...otherProps } = this.props;

    return (
        <RNLinearGradient {...otherProps} colors={processColor(colors)} />
    )

  }
}

export default RNCameraView