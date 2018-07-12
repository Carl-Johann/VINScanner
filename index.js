import React, { Component } from 'react';
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducer from './redux/CombinedReducers'
import { createStackNavigator } from 'react-navigation'

import DataCorrectionView from './ios-native-components/RNDataCorrectionView'
import CameraView from './react-native-components/Views/CameraView'
import DetailBoxesView from './react-native-components/Views/DetailBoxesView'

import { AppRegistry, NativeEventEmitter, NativeModules } from 'react-native';

import {
    ShouldShowFirstDetailBox,
    ShouldShowDataInFirstDetailBox,
    ShouldShowDataInSecondDetailBox,
} from './helpers/ModuleEventListeners.js'

import {
    setSiteActionAS,
    setBatchIdActionAS,
    setCountInitActionAS,
    getStockCountObjectActionAS,
} from './AsyncStorage/Actions.js'

const MainStackNavigator = createStackNavigator({
    CameraView: {
        screen: CameraView,
        navigationOptions: {
            header: null
        }
    },

    // DataCorrectionView: {
    //     screen: DataCorrectionView,
    //     navigationOptions: {
    //         header: null
    //     }
    // },
})


class App extends Component {

    componentDidMount() {
        console.log("------------")
        console.log("|  SKINKE  |")
        console.log("------------")

        getStockCountObjectActionAS((data) => {
            // console.log("data1", data)
            if (data == null) {
                setSiteActionAS("")
                setBatchIdActionAS("")
                setCountInitActionAS("")
            }
            // this.setState({
            //     site: data.site,
            //     countInit: data["count-init"],
            //     batchId: data.batchId,
            // })
        })
    }


    render() {
        return (
            <Provider store={ createStore(reducer) }>
                <MainStackNavigator style={{ flex: 1 }}/>
            </Provider>
        )
    }
}




AppRegistry.registerComponent('VINScanner', () => App);