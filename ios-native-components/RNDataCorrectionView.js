import React, { Component } from 'react';
import { requireNativeComponent, processColor, View, Text } from 'react-native';
let DataCorrectionView = requireNativeComponent('RNDataCorrectionView', RNDataCorrectionView);

class RNDataCorrectionView extends Component {


  render() {
    let { style,
        //imageAs64, dataFromScan,
        imageAs64AndDataFromScan
    } = this.props;

    return (
        <DataCorrectionView
            /*color={[ 55, 66, 77, 88 ]}
            location={[ 11, 22, 33, 44 ]}*/
            /*imageAs64={ imageAs64 }
            dataFromScan={ dataFromScan }*/
            style={{ flex: 1 }}
            imageAs64AndDataFromScan={ imageAs64AndDataFromScan }
        />
    )

  }
}

export default RNDataCorrectionView