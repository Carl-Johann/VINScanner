import { connect } from 'react-redux'
import React, { Component } from 'react'

import SpinKit from '../../ViewAccessories/SpinKit'

import {
    View, Text, StyleSheet, TouchableOpacity,
    TextInput, FlatList, Animated,
    KeyboardAvoidingView,
} from 'react-native'

import {
    universalTriggerJS,
} from '../../../Api/ApiCalls.js'

import {
    defaultButtonHeight, detailTextStyle,
    detailBoxesContentWidth, defaultYellow,
    defaultBorderRadius, screenWidth, defaultGray,
    AMDarkGray, spinKitType, spinKitSize,
} from '../../../helpers/GlobalValues'


import {
    setSiteActionAS,
    setBatchIdActionAS,
    setCountInitActionAS,
    getStockCountValueActionAS,
    getStockCountObjectActionAS,
} from '../../../AsyncStorage/Actions.js'


class StartFields extends Component {

    state = {
        site: "",
        batchId: "",
        countInit:  "",

        apiBatchId: "",
        availableSites: null,

        modalOpacity: new Animated.Value(0)
    }

    componentDidMount() {

        getStockCountObjectActionAS((data) => {
            console.log("data", data)
            this.setState({
                site: data.site,
                countInit: data["count-init"],
                batchId: data.batchId,
            })
        })


        let lort = universalTriggerJS(
            "/stockcount/sites/batches/status?",
            { batchid: "12" },

            (rows) => {

                if (rows.length != 0) {
                    // setBatchIdActionAS(rows[0].BATCH_ID)
                    this.setState({
                        availableSites: rows,
                        apiBatchId: rows[0].BATCH_ID,
                    })
                } else {
                    this.setState({ availableSites: rows })
                }
            }
        )

    }

    setSite = (site, isFinal) => {
        if (this.state.modalOpacity._value == 1 ) {
            this.setState({ site })
            this.hideOrShowModal()
        }

        if (isFinal) { setSiteActionAS(site) }
    }

    setCountInit = (countInit, isFinal) => {
        this.setState({ countInit })

        if (isFinal) { setCountInitActionAS(countInit) }

    }




    hideOrShowModal = () => { Animated.timing(this.state.modalOpacity, { toValue: this.state.modalOpacity._value == 1 ? 0 : 1, duration: 250 }).start() }


    render () {
        const buttonWidth = ((screenWidth * 0.75) / 2 ) - 5


        const {
            scanNowMethod, enterNowMethod,
            hideModal,
        } = this.props

        const {
            site, countInit, batchId,
            modalOpacity, availableSites, apiBatchId
        } = this.state

        // The API hasn't been finished yet
        if (availableSites == null && apiBatchId == "") {
            return (
                <View style={{ flex: 1, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                    <SpinKit
                        type={ spinKitType }
                        color={ defaultGray }
                        size={ spinKitSize }
                    />
                </View>
            )
        } else if (availableSites != null && apiBatchId != "") {

            return (
                <KeyboardAvoidingView behavior="padding" style={{ width: detailBoxesContentWidth / 1.05, height: detailBoxesContentWidth / 1.65, backgroundColor: 'transparent', alignItems: 'center' }} enabled={true}>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: detailBoxesContentWidth / 1.05, alignItems: 'center' }}>
                            <Text style={[ detailTextStyle, { textAlign: 'left' }]}>
                                Site: { site.length == 0 ? " ----------" : site }
                            </Text>


                            <TouchableOpacity
                                style={ styles.changeSiteButtonStyle }
                                hitSlop={{ top: 5, left: 5, bottom: 5, right: 5 }}
                                onPress={ () => { this.hideOrShowModal() }}
                            >
                                <Text style={ detailTextStyle }>Change</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ padding: 10 }} />

                        <View
                            style={{ flexDirection: 'row', width: detailBoxesContentWidth / 1.05, alignItems: 'center' }}
                        >
                            <Text style={[ detailTextStyle, { textAlign: 'left', width: 50 }]}>
                                User: </Text>

                            <TextInput
                                style={[ detailTextStyle, styles.inputTextStyle ]}
                                onChangeText={(text) => this.setCountInit(text, false)}
                                multiline={false}

                                value={countInit}
                            />
                        </View>

                        <TouchableOpacity
                            style={[
                                styles.changeSiteButtonStyle,
                                apiBatchId == batchId ? { width: 100 } : { width: 110 },
                                { bottom: 10, position: 'absolute' },
                                countInit.length == 0 || site.length == 0 ? { opacity: 0.5 } : { opacity: 1 },
                            ]}
                            hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
                            disabled={ countInit.length == 0 || site.length == 0 }
                            onPress={() => {
                                this.setCountInit(countInit, true)
                                this.setSite(site, true)
                                hideModal()
                            }}
                        >
                            <Text style={ detailTextStyle }>
                                { apiBatchId == batchId ? 'Continue' : 'Start New' }
                            </Text>
                        </TouchableOpacity>

                        <Animated.View style={{ opacity: modalOpacity, position: 'absolute', top: -5, left: 0 }}>
                            <ModalPicker
                                availableSites={ availableSites }
                                siteSelect={ (site, isFinal) => this.setSite(site, isFinal) }
                            />
                        </Animated.View>
                </KeyboardAvoidingView>
            )
        } else if (apiBatchId != "" && availableSites.length == 0) {
        // The API request finished, but there aren't any available sites
            <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent',
                width: detailBoxesContentWidth / 1.05,
                height: detailBoxesContentWidth / 1.65,
            }}>
                <Text style={ detailTextStyle }>
                    No Sites Available
                </Text>
            </View>
        }
    }
}



const ModalPicker = ({ siteSelect, availableSites }) => {

    isEven = (n) => {
        return n % 2 == 0
    }


    return (
        <View style={{
            height: 96,
            borderWidth: 1,
            backgroundColor: 'gray',
            borderRadius: 3,
            width: detailBoxesContentWidth * 0.6,

            shadowRadius: 4,
            shadowOpacity: 1,
            shadowColor: 'rgba(0, 1, 0, 0.5)',
            shadowOffset: { width: 3, height: 3 },
        }} >

            {/*{ availableSites != null && (*/}
                <FlatList
                    data={ availableSites }


                    keyExtractor={ (item, index) => String(index) }
                    renderItem={ ({ item, index }) => (
                            <View
                                style={{ padding: 12.5, backgroundColor: this.isEven(index) ? 'lightgray' : 'white' }}
                            >
                                <TouchableOpacity
                                    onPress={ () => { siteSelect(item.BATCH_SITE, false) } }
                                >
                                    <Text
                                        style={ detailTextStyle }
                                    >{ item.BATCH_SITE }</Text>
                                </TouchableOpacity>

                            </View>
                    ) }
                />
            {/*) || availableSites == null && (
                <View style={{ flex: 1, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                    <SpinKit
                        type={ spinKitType }
                        color={ defaultGray }
                        size={ spinKitSize }
                    />
                </View>
            )}*/}
        </View>
    )
}


const styles = StyleSheet.create({

    inputTextStyle: {
        height: 40,
        paddingLeft: 5,
        paddingRight: 5,
        textAlign: 'left',
        borderColor: 'gray',
        borderBottomWidth: 1,
        width: ((detailBoxesContentWidth / 1.05) - 50),
    },

    buttonStyle: {
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: defaultYellow,
        height: defaultButtonHeight,
        backgroundColor: defaultYellow,
        borderRadius: defaultBorderRadius,
        width: ((screenWidth * 0.75) / 2 ) - 5,
    },

    changeSiteButtonStyle: {
        width: 90,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: defaultBorderRadius,
    }
})

const mapStateToProps = (state) => {
    return {
        takingStock: state.ViewsReducer.takingStock
    }
}

// Some of these actions get used in another file
const mapDispatchToProps = (dispatch) => {
  return {
    setTakingStockAction: (takingStock) => dispatch(setTakingStockAction(takingStock))
  }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StartFields)