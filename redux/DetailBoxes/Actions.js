import {
    SHOULD_SHOW_FIRST_DETAIL_BOX
} from './ActionTypes.js'

import PropTypes from 'prop-types'



export const shouldShowFirstDetailBoxAction = (shouldShowFirstDetailBox) => {
    // 'shouldShowFirstDetailBox' should be a boolean

    return {
        type: SHOULD_SHOW_FIRST_DETAIL_BOX,
        shouldShowFirstDetailBox
    }
}
shouldShowFirstDetailBoxAction.propTypes = {
  shouldShowFirstDetailBox: PropTypes.bool.isRequired
}


// export const set = (shouldShowFirstDetailBox) => {
//     // 'shouldShowFirstDetailBox' should be a boolean

//     return {
//         type: SHOULD_SHOW_FIRST_DETAIL_BOX,
//         shouldShowFirstDetailBox
//     }
// }
// shouldShowFirstDetailBoxAction.propTypes = {
//   shouldShowFirstDetailBox: PropTypes.bool.isRequired
// }
