import Dimensions from 'Dimensions'
import React from 'react'
import { View } from 'react-native'
import amYellow from './colors'

const widthTimes075 = () => { return Dimensions.get('window').width * 0.75 }

const LineBreaker = ({ margin }) => {
    return (
        <View style={{ height: 1.5, width: widthTimes075(), backgroundColor: amYellow, marginTop: margin , marginBottom: margin }} />
    )
}

export default LineBreaker