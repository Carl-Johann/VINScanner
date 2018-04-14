import React, { Component } from 'react';
import { requireNativeComponent, processColor, View, Text } from 'react-native';
let RNLinearGradient = requireNativeComponent('RNCameraViewSwift', RNCameraView);

class RNCameraView extends Component {


  render() {
    let { style } = this.props;

    return (
        <RNLinearGradient style={ style }/>
    )

  }
}

export default RNCameraView