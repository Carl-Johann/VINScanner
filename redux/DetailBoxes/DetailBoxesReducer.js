import {
    SHOULD_SHOW_FIRST_DETAIL_BOX
} from './ActionTypes.js'

let initialState = {
    shouldShowFirstDetailBox: false
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



        default:
            return state
    }
}


export default DetailBoxesReducer