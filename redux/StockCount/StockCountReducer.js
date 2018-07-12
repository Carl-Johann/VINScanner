import {
    RESET_STOCK_COUNT_REDUCER,
    SET_STOCK_COUNT_POST_SATUS_CODE,
    SET_IS_STOCK_COUNT_MODAL_VISIBLE,
} from './ActionTypes.js'

let initialState = {
    statusCode: null,
    modalVisible: false
}

function StockCountReducer (state = initialState, action) {
    switch (action.type) {

        case SET_STOCK_COUNT_POST_SATUS_CODE: {
            const { statusCode } = action
            return {
                ...state,
                    statusCode
            }
        }

        case SET_IS_STOCK_COUNT_MODAL_VISIBLE: {
            const { modalVisible } = action
            return {
                ...state,
                    modalVisible
            }
        }

        case RESET_STOCK_COUNT_REDUCER: {
            return { ...initialState }
        }

        default:
            return state
    }
}


export default StockCountReducer