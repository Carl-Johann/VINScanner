import {
    SET_SHOULD_SCAN,
    SET_TAKING_STOCK,
    RESET_VIEWS_REDUX_STATE,
    SET_ENTER_DATA_MANUALLY,
    SET_SHOULD_TAKE_PICTURE,
} from './ActionTypes.js'

let initialState = {
    shouldScan: true,
    takingStock: false,
    enterDataManually: false,
    shouldTakePicture: false,
}

function ViewsReducer (state = initialState, action) {
    switch (action.type) {

        case SET_TAKING_STOCK: {
            const { takingStock } = action
            return {
                ...state,
                    takingStock
            }
        }


        case SET_ENTER_DATA_MANUALLY: {
            const { enterDataManually } = action
            return {
                ...state,
                    enterDataManually
            }
        }

        case SET_SHOULD_SCAN: {
            const { shouldScan } = action
            return {
                ...state,
                    shouldScan
            }
        }

        case SET_SHOULD_TAKE_PICTURE: {
            const { shouldTakePicture } = action
            return {
                ...state,
                    shouldTakePicture
            }
        }

        case RESET_VIEWS_REDUX_STATE: {
            return {
                ...initialState
            }
        }

        default:
            return state
    }
}


export default ViewsReducer