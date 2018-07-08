import {
    SET_IMAGE_AS_64,
    SET_SCANNED_CHARACTERS,
} from './ActionTypes.js'

let initialState = {
    imageAs64: "",
    scannedCharacters: null,
}

const ScannedDataReducer = (state = initialState, action) => {
    switch (action.type) {


        case SET_SCANNED_CHARACTERS: {
            const { scannedCharacters } = action

            console.log("SET_SCANNED_CHARACTERS", scannedCharacters)

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

        default:
            return state
    }
}


export default ScannedDataReducer