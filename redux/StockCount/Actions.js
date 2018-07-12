import {
    RESET_STOCK_COUNT_REDUCER,
    SET_STOCK_COUNT_POST_SATUS_CODE,
    SET_IS_STOCK_COUNT_MODAL_VISIBLE,
} from './ActionTypes.js'

export const setStockCountPostStatusCodeAction = (statusCode) => {
    return {
        type: SET_STOCK_COUNT_POST_SATUS_CODE,
        statusCode
    }
}

export const setShouldShowModalAction = ( modalVisible ) => {
    return {
        type: SET_IS_STOCK_COUNT_MODAL_VISIBLE,
        modalVisible
    }
}


export const resetStockCountReducerAction = () => {
    return { type: RESET_STOCK_COUNT_REDUCER }
}