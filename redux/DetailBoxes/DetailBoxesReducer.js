import {
    SHOULD_SHOW_FIRST_DETAIL_BOX,
    RESET_DETAIL_BOXES_REDUX_STATE,
} from './ActionTypes.js'



let initialState = {
    shouldShowFirstDetailBox: false,
}

const DetailBoxesReducer = (state = initialState, action) => {
    switch (action.type) {


        case SHOULD_SHOW_FIRST_DETAIL_BOX: {
            const { shouldShowFirstDetailBox } = action
            return {
                ...state,
                    shouldShowFirstDetailBox
            }
        }

        case RESET_DETAIL_BOXES_REDUX_STATE: {
            return {
                ...initialState
            }
        }


        default:
            return state
    }
}


export default DetailBoxesReducer