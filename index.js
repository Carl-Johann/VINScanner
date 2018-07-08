import React, { Component } from 'react';
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducer from './redux/CombinedReducers'
import { StackNavigator } from 'react-navigation'
import { AppRegistry } from 'react-native'

import RNDataCorrectionView from './ios-native-components/RNDataCorrectionView'
import CameraView from './react-native-components/CameraView'



const MainStackNavigator = StackNavigator({
    CameraView: {
        screen: CameraView,
        navigationOptions: {
            header: null
        }
    },

    DataCorrectionView: {
        screen: RNDataCorrectionView,
        navigationOptions: {
            header: null
        }
    },
})


class MainApp extends Component {
    render() {
        return (
            <Provider store={ createStore(reducer) }>
                <MainStackNavigator style={{ flex: 1 }}/>
            </Provider>
        )
    }
}


AppRegistry.registerComponent('VINScanner', () => MainApp);