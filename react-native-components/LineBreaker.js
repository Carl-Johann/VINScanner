import Dimensions from 'Dimensions'
import React from 'react'
import { View } from 'react-native'

import {
    detailBoxesContentWidth, defaultYellow
} from './GlobalValues'

const LineBreaker = ({ margin }) => {
    return (
        <View style={{ height: 1.5, width: detailBoxesContentWidth(), backgroundColor: defaultYellow, marginTop: margin, marginBottom: margin }} />
    )
}

export default LineBreaker