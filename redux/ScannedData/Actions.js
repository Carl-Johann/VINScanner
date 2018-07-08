import {
    SET_IMAGE_AS_64,
    SET_SCANNED_CHARACTERS,
} from './ActionTypes.js'

import PropTypes from 'prop-types'


export const setScannedCharactersAction = ( scannedCharacters ) => {
    return {
        type: SET_SCANNED_CHARACTERS,
        scannedCharacters
    }
}
setScannedCharactersAction.propTypes = { scannedCharacters: PropTypes.string.isRequired }



export const setImageAs64Action = ( imageAs64 ) => {
    return {
        type: SET_IMAGE_AS_64,
        imageAs64
    }
}
setImageAs64Action.propTypes = { imageAs64: PropTypes.string.isRequired }