import React, { Component } from 'react-native'
import { View, Text, StyleSheet, Animated } from 'react-native'


export default class VINDetailView extends Component {




    render() {
        return(
            <View style={ styles.container }>

            </View>
        )
    }
}


const styles = StyleSheet.create({

    container: {
        backgroundColor: 'grenn',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },

})






// if (Object.getOwnPropertyNames(data['responses'][0]).length > 0) {

//                     homemadeVINs = []
//                     data['responses'][0]['textAnnotations'].forEach( i => {
//                         result = i['description'].toUpperCase().trim().replace('.', '').replace(/[\W_]+/g,'').replace(/\s/g, '')

//                         // The letters I, O and Q aren't allowed in a VIN (to be confused with 1 and 0) so we replace them if they exist
//                         result.replace(/I|O|Q/g, char => {
//                             if (char == 'I') { return 1 }
//                             if (char == 'O' || 'Q') { return 0 }
//                         })
//                         if (!results.includes(result)) { results.push(result) }
//                     })


// /////////////////////////////////////////////////////////////////
// //                                                             //
// //                                                             //
// //                                                             //
// //                                                             //
// // CREATE A BOX ON THE SCREEN. ONLY SEND THAT 'BOX' TO GOOGLE. //
// //                                                             //
// //                                                             //
// //                                                             //
// //                                                             //
// /////////////////////////////////////////////////////////////////


//                     // Google Cloud Vision API sometimes returns a correct VIN split up in bits
//                     // so we check to try and 'create' a complete VIN if possible.
//                     if (results.length > 1) {

//                         resultsLength = 0
//                         // Calculate complete results length
//                         // results.forEach( string => resultsLength += string.length )

//                         results.forEach( (resultLengthToAdd) => { resultsLength += resultLengthToAdd.length })

//                         // Some weird 'bug' where i couldn't access 'results' after the if statement '(resultsLength % 17 < 16)'
//                         bugResults = results

//                         // If resultsLength could be long enough for more than 1 VIN
//                         if (resultsLength % 17 < 16) {
//                             var concatenatedVINs = []
//                             var createdString = ''

//                             // Creates a list of string not being VINs
//                             // console.log(bugResults.map( (string) => { string.length !== 17 }))
//                             var filteredResults = bugResults.filter( string => string.length < 17 )
//                             // console.log(123, filteredResults)
//                             // Itterate through (hopefully) bits of VIN
//                             filteredResults.forEach( (string, index) => {

//                                 // If we have created a vin
//                                 if (createdString.length == 17) {
//                                     // Check if it is already a VIN in results
//                                     if (!concatenatedVINs.includes(createdString)) { concatenatedVINs.push(createdString) }
//                                     // Clear the created string, in case there is enough bits to create a new vin
//                                     createdString = ''

//                                     // We check if this string is last, otherwise it wouldn't be added.
//                                 } else if (index == filteredResults.length - 1) {
//                                     createdString += string
//                                     // We check if the createdString is 17 chars long.
//                                     // If not we don't add it since it's not going to be any longer
//                                     if (!concatenatedVINs.includes(createdString) && createdString.length == 17 ) { concatenatedVINs.push(createdString) }
//                                 }
//                                 createdString += string

//                             })

//                             homemadeVINs = concatenatedVINs
//                             // let arrayFromSet = Array.from(new Set(results.concat(concatenatedVINs)))
//                             // homemadeVINs = arrayFromSet

//                         }
//                     }

//                     console.log("Analysis done")
//                     console.log("results", results)
//                     console.log("homemadeVINs", homemadeVINs)

//                 }