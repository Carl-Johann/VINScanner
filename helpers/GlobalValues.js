import Dimensions from 'Dimensions'


export const spinKitSize = 42
export const defaultButtonHeight = 55
export const lineBreakerMarginHeight = 20
export const lineBreakerHeight = 1.5


export const spinKitType = 'Arc'
export const defaultGray = '#555555'
export const AMDarkGray = '#282828'
export const defaultFont = 'AppleSDGothicNeo-SemiBold'
export const detailBoxesDurationTime = 300
export const defaultFontSize = 22

// This was retrieved with 'onLayout={(event) => { console.log(event.nativeEvent.layout.height) }}'
export const largerTextFontSize = 25 // WARNING. largerTextFontTextHeight won't be accurate
export const largerTextFontTextHeight = 30.3333740234375


export const defaultYellow = "#ffb307"


export const detailBoxesWidth = Dimensions.get('window').width * 0.95
export const detailBoxesContentWidth = Dimensions.get('window').width * 0.9 - lineBreakerMarginHeight / 2
export const detailBoxesMarginToEdge = (Dimensions.get('window').width - detailBoxesWidth) / 2

export const VINLength = 17
export const isVINOrUnit = (characters) => {
    const legalLengths = [VINLength, 7, 6]

    return legalLengths.includes(characters.length)
}



export const detailTextStyle = {
    fontFamily: defaultFont,
    color: defaultGray,
    fontSize: defaultFontSize,
    textAlign: 'center',
    justifyContent: 'center'
}


export const isEmpty = (obj) => {
    if (
        obj === null ||
        obj === undefined ||
        Array.isArray(obj) ||
        typeof obj !== 'object'
    )
    {
        return true
    }

    return Object.getOwnPropertyNames(obj).length === 0 ? true : false
}





/*

import {
    spinKitSize, defaultButtonHeight, lineBreakerMarginHeight,
    detailBoxesContentWidth, spinKitType, defaultGray,
    defaultFont, defaultFontSize, isVINOrUnit, detailTextStyle
} from './GlobalValues'

*/