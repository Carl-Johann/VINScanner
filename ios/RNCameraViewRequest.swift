//
//  RNCameraViewRequest.swift
//  VINScanner
//
//  Created by Joe on 29/03/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation
import Vision

extension RNCameraViewSwift {
  
  func ERROR(_ errorFuncName: String) {
    resetCheckOrScanAttributes()
    if let eventEmitter = self.bridge.module(for: VINModul.self) as? RCTEventEmitter {
      eventEmitter.sendEvent(withName: errorFuncName, body: "")
    }
  }
  
  
  func postImage(croppedImage: UIImage, originalImage: UIImage, _ rg: VNTextObservation = VNTextObservation()) {
    
    
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
    let task = self.urlSession.dataTask(with: request as URLRequest) { requestData, requestResponse, error in
      self.compareVINAndImage(requestData!, rg, croppedImage)
    }
    
    
    task.resume()
    
    
  }
  
  func resetCheckOrScanAttributes() {
    self.croppedImageForScan = nil
    self.dataFromScan = nil
    self.symbolsForScan = nil
  }
  
  func setCheckOrScanAttribues(_ croppedImageForScan: UIImage, _ VINForScan: String, _ symbolsForScan: [[String : AnyObject]]) {
    self.croppedImageForScan = croppedImageForScan
    self.dataFromScan = VINForScan
    self.symbolsForScan = symbolsForScan
  }


  
  
  
  
  
  func compareVINAndImage( _ data: Data, _ rg: VNTextObservation, _ croppedImage: UIImage) {
    let json = try? JSONSerialization.jsonObject(with: data, options: .allowFragments) as AnyObject
    guard let eventEmitter = self.bridge.module(for: VINModul.self) as? RCTEventEmitter else { print("Couldn't get eventEmitter in compareVINAndImage"); return }
    guard let parsedJSON = json as? [String : AnyObject] else { print("parsedJSON error"); return }
    guard let responses = parsedJSON["responses"] as? [[String : AnyObject]] else { print("responses error"); return }
    guard let fullTextAnnotation = responses[0]["fullTextAnnotation"] as? [String : AnyObject] else {
      print("fullTextAnnotation error"); ERROR("ShouldShowDataInSecondDetailBox")	; return }
    
    guard let retrievedVIN = fullTextAnnotation["text"] as? String else { print("retrievedVIN error"); return }
    guard let pages = fullTextAnnotation["pages"] as? [[String : AnyObject]] else { print("pages error"); return }
    guard let blocks = pages[0]["blocks"] as? [[String : AnyObject]] else { print("blocks error"); return }
    guard let paragraphs = blocks[0]["paragraphs"] as? [[String : AnyObject]] else { print("paragraphs error"); return }
    guard let words = paragraphs[0]["words"] as? [[String : AnyObject]] else { print("words error"); return }
    guard let symbols = words[0]["symbols"] as? [[String : AnyObject]] else { print("symbols error"); return }
//    sleep(UInt32(2))
    
    var cleanedVIN = cleanVIN(retrievedVIN)
    cleanedVIN = String(cleanedVIN.filter { !" \n\t\r".contains($0) })
    print("Cleaned VIN:", cleanedVIN, "-", cleanedVIN.count)
    
    // If the VIN could actually be an actual VIN we notify JS
                                                      // 6
    if ((cleanedVIN.count == 17) || (cleanedVIN.count == 17 )) {
      // We might have a VIN that exists in the database, so we check(validate) it
      validateVIN(cleanedVIN, croppedImage, symbols)
      setCheckOrScanAttribues(croppedImage, cleanedVIN, symbols)
      eventEmitter.sendEvent(withName: "ShouldShowDataInFirstDetailBox", body: [ "ShouldShow" : true, "VIN" : cleanedVIN ])
      
    } else {
    // else we notify JS too, but theres no 'VIN'
      setCheckOrScanAttribues(croppedImage, cleanedVIN, symbols)
      eventEmitter.sendEvent(withName: "ShouldShowDataInFirstDetailBox", body: [ "ShouldShow" : false, "VIN" : cleanedVIN ])
    }
  }
  

  
  
  func validateVIN(_ VIN: String, _ croppedImage: UIImage = UIImage(), _ symbols: [[String : AnyObject]] = [[String : AnyObject]]()) {
    guard let eventEmitter = self.bridge.module(for: VINModul.self) as? RCTEventEmitter else { print("Couldn't get eventEmitter in validateVIN"); return }

    // We dont bother validation the VIN if it ins't 17 characters long
//    if VIN.count != 17 {
//
//      print("VIN is not 17 long. Skipping validation.", VIN.count)
//      self.hideCameraView()
//      self.hideVINCorrectionView()
//      eventEmitter.sendEvent(withName: "ShouldShowDataInFirstDetailBox", body: [ "ShouldShow" : false, "VIN" : "" ])
//
//      return
//    }
//
    
    struct CodableVINStruct: Codable {
      let VIN: String
    }
    
    let VINStruct = CodableVINStruct(VIN: VIN)
    
    let encodedData = try? JSONEncoder().encode(VINStruct)
    let json = try? JSONSerialization.jsonObject(with: encodedData!, options: .allowFragments)
    let jsonData = try? JSONSerialization.data(withJSONObject: json!)
    var request = URLRequest(url: URL(string: "https://prod-17.northeurope.logic.azure.com:443/workflows/ccf987eef25e4d3c930573724579a2b5/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Ad4tVWWLhUpPRFDxT7T-BOjwX8y-ZsUEOhaKjP6gFR8")!)
    
    request.httpBody = jsonData
    
    request.addValue("0e6f5455-00e4-402a-a9b6-0956debb937b", forHTTPHeaderField: "subscription-id")
    request.addValue("application/json", forHTTPHeaderField: "content-type")
    request.httpMethod = "POST"
    let task = self.urlSession.dataTask(with: request as URLRequest) { requestData, requestResponse, error in
      guard let statusCode = (requestResponse as? HTTPURLResponse)?.statusCode else { return }
      
      if let err = error {
        print("ERROR", err)
        // Show the user an error
      }
      
      
      if statusCode == 200 {
        print("VIN exists in the database")
        // VIN exists. Send the data to React-Native
        
        // The fact that the VIN exists means the user won't be promted to choose weather or not to scan or check VI
//        self.resetCheckOrScanAttributes()
        self.setCheckOrScanAttribues(croppedImage, VIN, symbols)
        
        guard let data = requestData else { print("error data"); return }
        let json = try? JSONSerialization.jsonObject(with: data, options: .allowFragments) as AnyObject
        guard let jsonSafe = json as? [String : AnyObject] else { print("error json"); return }
        guard let table1 = jsonSafe["Table1"] as? [[String : AnyObject]] else { print("error table1"); return }
        eventEmitter.sendEvent(withName: "ShouldShowDataInSecondDetailBox", body: ["scannedStringDBData" : table1[0]])
        
        
      } else if statusCode == 404 {
        print("VIN does NOT exists in the database")
        // They will be asked to 'check vin' or 'scan again'. If they decide to check,
        // 'correctDataFromGoogleManually()' needs the data from 'self'
        self.setCheckOrScanAttribues(croppedImage, VIN, symbols)
        eventEmitter.sendEvent(withName: "ShouldShowDataInSecondDetailBox", body: ["scannedStringDBData" : ""])
      }
    }
    
    task.resume()
    
    
    self.hideCameraView()
    self.hideVINCorrectionView()
  }
}







