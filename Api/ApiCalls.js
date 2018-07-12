import {
    setSiteActionAS,
    setBatchIdActionAS,
    setCountInitActionAS,
    getStockCountValueActionAS,
    getStockCountObjectActionAS,
} from '../AsyncStorage/Actions.js'




export const universalTriggerJS = (path, queries, callback) => {
    let fetchString = "https://api7913.azure-api.net" + path

    for (var key in queries) {
        if (queries.hasOwnProperty(key)) {
            fetchString += key + "=" + queries[key] + "&"
        }
    }
    fetchString = fetchString.slice(0, -1)

    var request = new XMLHttpRequest();
    request.onreadystatechange = (e) => {
        if (request.readyState !== 4) { return }

        if (request.status === 200) {
            let response = JSON.parse(request.responseText)
            // console.log(response.rows)
            callback(response.rows)
            return response.rows
        } else {
            console.log(request.responseText)
            // let response = JSON.parse(request.responseText)
            console.warn('error', response);
        }
    }

    request.open('GET', fetchString);
    request.setRequestHeader('Accept', 'application/json')
    request.setRequestHeader('Content-Type', 'application/json')
    request.setRequestHeader('Ocp-Apim-Subscription-Key', '295c1e4991f04732aba3e64b01c69d5b')
    request.setRequestHeader('Ocp-Apim-Trace', 'true')
    request.setRequestHeader('Cache-Control', 'no-cache')
    request.send();
}




export const StockCountUpdateVehicleStockInfoApiRequest = (vehicleId, callback) => {
    // batchId
    // vehicleId
    // countSite
    // countInit

    // let batchId = ""
    // let countSite = ""
    // let countInit = ""

    let queries = {
        batchId: "",
        countSite: "",
        countInit:"",
        vehicleId
    }

    getStockCountObjectActionAS((data) => {
        queries.batchId = data.batchId
        queries.countSite = data.site
        queries.countInit = data["count-init"]
    })

    setTimeout(() => { callback(200) }, 400)

    //     let fetchString = "https://api7913.azure-api.net"

    // for (var key in queries) {
    //     if (queries.hasOwnProperty(key)) {
    //         fetchString += key + "=" + queries[key] + "&"
    //     }
    // }
    // fetchString = fetchString.slice(0, -1)

    // var request = new XMLHttpRequest();
    // request.onreadystatechange = (e) => {
    //     if (request.readyState !== 4) { return }

    //     // We only use the statuscode in the callback func
    //     callback(response.status)
    // }

    // request.open('POST', fetchString);
    // request.setRequestHeader('Accept', 'application/json')
    // request.setRequestHeader('Content-Type', 'application/json')
    // request.setRequestHeader('Ocp-Apim-Subscription-Key', '295c1e4991f04732aba3e64b01c69d5b')
    // request.setRequestHeader('Ocp-Apim-Trace', 'true')
    // request.setRequestHeader('Cache-Control', 'no-cache')
    // request.send();
}


export const CloseSiteRequest = (callback) => {

    // batchId
    // site

    let queries = {
        batchId: "",
        countSite: "",
    }

    getStockCountObjectActionAS((data) => {
        queries.batchId = data.batchId
        queries.countSite = data.site
        // queries.countInit = data["count-init"]
    })

    setTimeout(() => {
        callback(200)
    }, 400)

    //     let fetchString = "https://api7913.azure-api.net"

    // for (var key in queries) {
    //     if (queries.hasOwnProperty(key)) {
    //         fetchString += key + "=" + queries[key] + "&"
    //     }
    // }
    // fetchString = fetchString.slice(0, -1)

    // var request = new XMLHttpRequest();
    // request.onreadystatechange = (e) => {
    //     if (request.readyState !== 4) { return }

    //     // We only use the statuscode in the callback func
    //     callback(response.status)
    // }

    // request.open('POST', fetchString);
    // request.setRequestHeader('Accept', 'application/json')
    // request.setRequestHeader('Content-Type', 'application/json')
    // request.setRequestHeader('Ocp-Apim-Subscription-Key', '295c1e4991f04732aba3e64b01c69d5b')
    // request.setRequestHeader('Ocp-Apim-Trace', 'true')
    // request.setRequestHeader('Cache-Control', 'no-cache')
    // request.send();
}