import Dimensions from 'Dimensions'
import React from 'react'
import { View } from 'react-native'

import {
    detailBoxesContentWidth, defaultYellow, lineBreakerHeight
} from '../helpers/GlobalValues'

const LineBreaker = ({ margin }) => {
    return (
        <View style={{ height: lineBreakerHeight, width: detailBoxesContentWidth, backgroundColor: defaultYellow, marginTop: margin / 2, marginBottom: margin / 2 }} />
    )
}

export default LineBreaker