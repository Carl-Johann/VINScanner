import {
    SET_IMAGE_AS_64,
    SET_SCANNED_CHARACTERS,
    SET_SCANNED_STRING_DB_DATA,
    DOES_SCANNED_STRING_EXIST_IN_DB,
    RESET_SCANNED_CHARACTERS_REDUX_STATE,
} from './ActionTypes.js'

let initialState = {
    imageAs64: "",
    shouldScan: false,
    scannedCharacters: null,
    scannedStringDBData: {},
    doesScannedStringExistInDB: null,
}

function ScannedDataReducer (state = initialState, action) {
    switch (action.type) {


        case SET_SCANNED_CHARACTERS: {
            const { scannedCharacters } = action
            return {
                ...state,
                    scannedCharacters
            }
        }

        case SET_IMAGE_AS_64: {
            const { imageAs64 } = action
            return {
                ...state,
                    imageAs64
            }
        }

        case SET_SCANNED_STRING_DB_DATA: {
            const { scannedStringDBData } = action
            return {
                ...state,
                    scannedStringDBData
            }
        }

        case DOES_SCANNED_STRING_EXIST_IN_DB: {
            const { doesScannedStringExistInDB } = action
            return {
                ...state,
                    doesScannedStringExistInDB
            }
        }

        case RESET_SCANNED_CHARACTERS_REDUX_STATE: {
            return {
                ...initialState
            }
        }



        default:
            return state
    }
}


export default ScannedDataReducer