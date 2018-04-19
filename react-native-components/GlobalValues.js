import Dimensions from 'Dimensions'


export const spinKitSize = 42
export const defaultButtonHeight = 55
export const lineBreakerMarginHeight = 7

export const spinKitType = 'Arc'
export const defaultGray = '#555555'
export const defaultFont = 'AppleSDGothicNeo-SemiBold'
export const defaultFontSize = 22
export const largerTextFontSize = 25
export const defaultYellow = "#ffb307"


export const isVINOrUnit = (characters) => {
    let legalLengths = [17, 7, 6]

    return legalLengths.includes(characters.length)
}

export const detailBoxesContentWidth = () => {
    return Dimensions.get('window').width * 0.75
}

export const detailTextStyle =
{
    fontFamily: defaultFont,
    color: defaultGray,
    fontSize: defaultFontSize,
    textAlign: 'center',
    justifyContent: 'center'
}



/*

import {
    spinKitSize, defaultButtonHeight, lineBreakerMarginHeight,
    detailBoxesContentWidth, spinKitType, defaultGray,
    defaultFont, defaultFontSize, isVINOrUnit, detailTextStyle
} from './GlobalValues'

*/