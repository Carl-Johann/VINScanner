import {
    SHOULD_SHOW_CAMERA_VIEW,
    SHOULD_SHOW_FIRST_DETAIL_BOX,
    RESET_DETAIL_BOXES_REDUX_STATE,
} from './ActionTypes.js'



export const shouldShowFirstDetailBoxAction = (shouldShowFirstDetailBox) => {
    // 'shouldShowFirstDetailBox' should be a boolean

    return {
        type: SHOULD_SHOW_FIRST_DETAIL_BOX,
        shouldShowFirstDetailBox
    }
}


export const resetDetailBoxesReduxStateAction = () => {
    return {
        type: RESET_DETAIL_BOXES_REDUX_STATE
    }
}


export const shouldShow = (shouldShowFirstDetailBox) => {
    // 'shouldShowFirstDetailBox' should be a boolean

    return {
        type: SHOULD_SHOW_FIRST_DETAIL_BOX,
        shouldShowFirstDetailBox
    }
}