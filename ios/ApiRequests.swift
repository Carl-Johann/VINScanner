//
//  CameraViewRequests.swift
//  VINScanner
//
//  Created by Joe on 24/04/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation
import Vision


struct ApiRequests {
  
  let session = URLSession.shared
  
  
  func ERROR(_ errorFuncName: String, _ safeBridge: RCTBridge) {
    if let eventEmitter = safeBridge.module(for: VINModul.self) as? RCTEventEmitter {
      eventEmitter.sendEvent(withName: errorFuncName, body: "")
    }
  }
  
  func cleanCharacters(_ VIN: String) -> String {
    var text = VIN
    
    text = text.uppercased()
    text = text.replacingOccurrences(of: "I", with: "1")
    text = text.replacingOccurrences(of: "Q", with: "0")
    text = text.replacingOccurrences(of: "O", with: "0")
    text = text.stripped
    
    return text
  }
  
  func encodeImage(_ croppedImageimage: UIImage) -> String? {
//    let imageAsUI = cropImage(image)
    let base64String = UIImageJPEGRepresentation(croppedImageimage, 1.0)
    
    if (base64String != nil) {
      return base64String?.base64EncodedString()
    } else { return nil }
  }
  
  
  
  func postImage(
    _ croppedImage: UIImage,
    _ safeBridge: RCTBridge,
    _ originalImage: UIImage,
    _ rg: VNTextObservation = VNTextObservation()  
  ) {
    
    
    let imagePNG = UIImagePNGRepresentation(croppedImage)!
    let imageAsBase64 = imagePNG.base64EncodedString()
    
    struct RequestsStruct: Codable {
      let requests: [RequestStruct]
    }
    
    struct RequestStruct: Codable {
      let image: ImageStruct
      let features: [TypeStruct]
      
    }
    
    struct TypeStruct: Codable {
      let type: String
      let maxResults: Int
    }
    
    struct ImageStruct: Codable {
      let content: String
    }
    
    let typeStruct = TypeStruct(type: "TEXT_DETECTION", maxResults: 1)
    let imageStruct = ImageStruct(content: imageAsBase64)
    let requestStruct = RequestStruct(image: imageStruct, features: [typeStruct])
    let requestsStruct = RequestsStruct(requests: [requestStruct])
    let encodedData = try? JSONEncoder().encode(requestsStruct)
    
    let json = try? JSONSerialization.jsonObject(with: encodedData!, options: .allowFragments)
    let jsonData = try? JSONSerialization.data(withJSONObject: json!)
    
    var request = URLRequest(url: URL(string: "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyB8WDzdr9pPDVjqc4txtB6M5ClrY-P_8q8")!)
    request.httpBody = jsonData
    request.addValue("application/json", forHTTPHeaderField: "Content-Type")
    request.httpMethod = "POST"
    let task = session.dataTask(with: request as URLRequest) { requestData, requestResponse, error in
      self.compareVINAndImage(requestData!, rg, croppedImage, safeBridge)
    }
    
    
    task.resume()
    
    
  }
  
  
  func compareVINAndImage( _ data: Data, _ rg: VNTextObservation, _ croppedImage: UIImage, _ safeBridge: RCTBridge) {
    let json = try? JSONSerialization.jsonObject(with: data, options: .allowFragments) as AnyObject
    
    guard let eventEmitter = safeBridge.module(for: VINModul.self) as? RCTEventEmitter else { print("Couldn't get eventEmitter in compareVINAndImage"); return }
    
    guard let parsedJSON = json as? [String : AnyObject] else { print("parsedJSON error"); return }
    guard let responses = parsedJSON["responses"] as? [[String : AnyObject]] else { print("responses error"); return }
    guard let fullTextAnnotation = responses[0]["fullTextAnnotation"] as? [String : AnyObject] else {
      print("fullTextAnnotation error"); ERROR("NoDataReturnedFromGoogle", safeBridge)  ; return }
    
    guard let retrievedCharacters = fullTextAnnotation["text"] as? String else { print("retrievedVIN error"); return }
    guard let pages = fullTextAnnotation["pages"] as? [[String : AnyObject]] else { print("pages error"); return }
    guard let blocks = pages[0]["blocks"] as? [[String : AnyObject]] else { print("blocks error"); return }
    guard let paragraphs = blocks[0]["paragraphs"] as? [[String : AnyObject]] else { print("paragraphs error"); return }
    guard let words = paragraphs[0]["words"] as? [[String : AnyObject]] else { print("words error"); return }
    guard let symbols = words[0]["symbols"] as? [[String : AnyObject]] else { print("symbols error"); return }
    
    var cleanedCharacters = cleanCharacters(retrievedCharacters)
    cleanedCharacters = String(cleanedCharacters.filter { !" \n\t\r".contains($0) })
//    print("Cleaned Chars:", cleanedCharacters, "-", cleanedCharacters.count)
    
    // A succesfull scan should be 17, 7 or 6 characters long, based on what type of data was scanned
    if ((cleanedCharacters.count == 17) || (cleanedCharacters.count == 6 ) || (cleanedCharacters.count == 7 )) {
      // We might have a VIN that exists in the database, so we check(validate) it
      validateVIN(cleanedCharacters, safeBridge, croppedImage, symbols)
      
      
      eventEmitter.sendEvent(withName: "ShouldShowDataInFirstDetailBox", body: [
//        "ShouldShow" : true,
        "cleanedCharacters" : cleanedCharacters,
        "imageAs64" : encodeImage(croppedImage)!
      ])
      
    } else {
      // else we notify JS too, but theres no 'VIN or Unit'
      eventEmitter.sendEvent(withName: "ShouldShowDataInFirstDetailBox", body: [
//        "ShouldShow" : false,
        "cleanedCharacters" : cleanedCharacters,
        "imageAs64" : encodeImage(croppedImage)!
      ])
    }
  }
  
  
  
  
  func validateVIN(
    _ cleanedCharacters: String,
    _ safeBridge: RCTBridge,
    _ croppedImage: UIImage = UIImage(),
    _ symbols: [[String : AnyObject]] = [[String : AnyObject]]()
  ) {
    
    guard let eventEmitter = safeBridge.module(for: VINModul.self) as? RCTEventEmitter else { print("Couldn't get eventEmitter in validateVIN()"); return }
    
    
//    struct CodableScannedCharactersStruct: Codable {
//      let ScannedCharacters: String
//    }
//    
//    let ScannedCharactersStruct = CodableScannedCharactersStruct(ScannedCharacters: cleanedCharacters)
//    
//    let encodedData = try? JSONEncoder().encode(ScannedCharactersStruct)
//    let json = try? JSONSerialization.jsonObject(with: encodedData!, options: .allowFragments)
//    let jsonData = try? JSONSerialization.data(withJSONObject: json!)
//    var request = URLRequest(url: URL(string: "https://prod-17.northeurope.logic.azure.com:443/workflows///ccf987eef25e4d3c930573724579a2b5/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Ad4tVWWLhUpPRFDxT7T-BOjwX8y-ZsUEOhaKjP6gFR8")!)
    let url = URL(string: "https://api7913.azure-api.net/VIN/get-vin?scannedCharacters=" + cleanedCharacters)!
    var request = URLRequest(url: url)
//    print(123, request.url!)
//    request.httpBody = jsonData
    
    request.addValue("295c1e4991f04732aba3e64b01c69d5b", forHTTPHeaderField: "Ocp-Apim-Subscription-Key")
    request.addValue("application/json", forHTTPHeaderField: "content-type")
    request.addValue("true", forHTTPHeaderField: "Ocp-Apim-Trace")
    request.addValue("no-cache", forHTTPHeaderField: "Cache-Control")
    request.httpMethod = "GET"
    
    let task = session.dataTask(with: request as URLRequest) { requestData, requestResponse, error in
      
      guard let statusCode = (requestResponse as? HTTPURLResponse)?.statusCode else { return }
      
      if let err = error {
        print("ERROR", err)
        // Show the user an error
      }
      
      
      if statusCode == 200 {
        print("Status Code:", statusCode)
        // VIN exists. Send the data to React-Native
        
        // The fact that the VIN exists means the user won't be promted to choose weather or not to scan or check VI
        guard let data = requestData else { print("error data"); return }
        let json = try? JSONSerialization.jsonObject(with: data, options: .allowFragments) as AnyObject
        guard let jsonSafe = json as? [String : AnyObject] else { print("error json"); return }
        guard let table1 = jsonSafe["Table1"] as? [[String : AnyObject]] else { print("error table1"); return }
        
        eventEmitter.sendEvent(withName: "ShouldShowDataInSecondDetailBox", body: ["scannedStringDBData" : table1[0]])
        
        
      } else if statusCode == 404 {
        print("ERROR 404, ScannedCharacters does NOT exists in the database")
        // They will be asked to 'check vin' or 'scan again'. If they decide to check,
        // 'correctDataFromGoogleManually()' needs the data from 'self'
        eventEmitter.sendEvent(withName: "ShouldShowDataInSecondDetailBox", body: ["scannedStringDBData" : {}])
      }
    }
    
    task.resume()
  }
  
  func lort() {
    let url = URL(string: "https://api7913.azure-api.net/stockcount/sites/batches/status?batchid=12")!
    var request = URLRequest(url: url)
    
    request.addValue("295c1e4991f04732aba3e64b01c69d5b", forHTTPHeaderField: "Ocp-Apim-Subscription-Key")
    request.addValue("application/json", forHTTPHeaderField: "content-type")
    request.addValue("true", forHTTPHeaderField: "Ocp-Apim-Trace")
    request.addValue("no-cache", forHTTPHeaderField: "Cache-Control")
    request.httpMethod = "GET"
    
    let task = session.dataTask(with: request as URLRequest) { requestData, requestResponse, error in
      
      guard let statusCode = (requestResponse as? HTTPURLResponse)?.statusCode else { return }
      
      if let err = error {
        print("ERROR", err)
        // Show the user an error
      }
      let json = try? JSONSerialization.jsonObject(with: requestData!, options: .allowFragments) as AnyObject
      print(requestResponse!)
      print(statusCode, json!)
    }
    
    task.resume()
  }
  


  static let sharedInstance = ApiRequests()

}







