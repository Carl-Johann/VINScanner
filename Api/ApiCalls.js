import React from 'react'







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