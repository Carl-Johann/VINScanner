import {
    SET_SHOULD_SCAN,
    SET_TAKING_STOCK,
    RESET_VIEWS_REDUX_STATE,
    SET_ENTER_DATA_MANUALLY,
    SET_SHOULD_TAKE_PICTURE,
} from './ActionTypes.js'

export const setTakingStockAction = (takingStock) => {
    return {
        type: SET_TAKING_STOCK,
        takingStock
    }
}

export const setShouldScanAction = ( shouldScan ) => {
    return {
        type: SET_SHOULD_SCAN,
        shouldScan
    }
}

export const setEnterDataManuallyAction = (enterDataManually) => {
    return {
        type: SET_ENTER_DATA_MANUALLY,
        enterDataManually
    }
}

export const setShouldTakePictureAction = (shouldTakePicture) => {
    return {
        type: SET_SHOULD_TAKE_PICTURE,
        shouldTakePicture
    }
}

export const resetViewsReduxStateAction = () => {
    return { type: RESET_VIEWS_REDUX_STATE }
}