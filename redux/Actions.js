import {
    SET_SCANNED_CHARACTERS
} from './ActionTypes.js'


export const setScannedCharacters = ( characters ) => {
    // Should be a single string

    return {
        type: SET_SCANNED_CHARACTERS,
        characters
    }
}