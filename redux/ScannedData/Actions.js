import {
    SET_IMAGE_AS_64,
    SET_SCANNED_CHARACTERS,
    SET_SCANNED_STRING_DB_DATA,
    DOES_SCANNED_STRING_EXIST_IN_DB,
    RESET_SCANNED_CHARACTERS_REDUX_STATE,
} from './ActionTypes.js'

import PropTypes from 'prop-types'


export const setScannedCharactersAction = ( scannedCharacters ) => {
    return {
        type: SET_SCANNED_CHARACTERS,
        scannedCharacters
    }
}


export const setImageAs64Action = ( imageAs64 ) => {
    return {
        type: SET_IMAGE_AS_64,
        imageAs64
    }
}


export const setScannedStringDBDataAction = ( scannedStringDBData ) => {
    return {
        type: SET_SCANNED_STRING_DB_DATA,
        scannedStringDBData
    }
}


export const doesScannedStringExistInDBAction = ( doesScannedStringExistInDB ) => {
    return {
        type: DOES_SCANNED_STRING_EXIST_IN_DB,
        doesScannedStringExistInDB
    }
}

export const resetScannedCharactersReduxStateAction = () => {
    return { type: RESET_SCANNED_CHARACTERS_REDUX_STATE }
}