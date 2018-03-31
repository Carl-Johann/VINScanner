import React, { Component } from 'react-native'
import { View, Text, StyleSheet, Animated } from 'react-native'


export default class VINDetailView extends Component {


    evaluateVIN = (VIN) => {
        VIN.toUpperCase().trim().replace('.', '').replace(/[\W_]+/g,'').replace(/\s/g, '')

                        // The letters I, O and Q aren't allowed in a VIN (to be confused with 1 and 0) so we replace them if they exist
                        result.replace(/I|O|Q/g, char => {
                            if (char == 'I') { return 1 }
                            if (char == 'O' || 'Q') { return 0 }
                        })
    }



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





