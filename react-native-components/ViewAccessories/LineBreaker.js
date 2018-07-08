import Dimensions from 'Dimensions'
import React from 'react'
import { View } from 'react-native'

import {
    detailBoxesContentWidth, defaultYellow, lineBreakerHeight
} from '../../helpers/GlobalValues'

const LineBreaker = ({ margin }) => {
    return (
        <View
            style={{
                marginTop: margin / 2,
                marginBottom: margin / 2,
                height: lineBreakerHeight,
                width: detailBoxesContentWidth,
                backgroundColor: defaultYellow,
            }}
        />
    )
}

export default LineBreaker