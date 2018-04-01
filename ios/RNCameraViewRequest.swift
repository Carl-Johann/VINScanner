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
  
  func postImage(croppedImage: UIImage, originalImage: UIImage, rg: VNTextObservation) {
    
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

      
      
//      if let eventEmitter = self.bridge.module(for: VINModul.self) as? RCTEventEmitter {
//        print("Returning VIN")
//        eventEmitter.sendEvent(withName: "ReturnVIN", body: "WOLBE6EC7HG099479")
//      }                
    }
    
    
    task.resume()
    
    //    self.vinScanned = false
  }
  



  func compareVINAndImage( _ data: Data, _ rg: VNTextObservation, _ croppedImage: UIImage) {
    let json = try? JSONSerialization.jsonObject(with: data, options: .allowFragments) as AnyObject
    
    guard let parsedJSON = json as? [String : AnyObject] else { print("parsedJSON error"); return }
    guard let responses = parsedJSON["responses"] as? [[String : AnyObject]] else { print("responses error"); return }
    guard let fullTextAnnotation = responses[0]["fullTextAnnotation"] as? [String : AnyObject] else { print("fullTextAnnotation error"); return }
    guard let retrievedVIN = fullTextAnnotation["text"] as? String else { print("retrievedVIN error"); return }
    guard let pages = fullTextAnnotation["pages"] as? [[String : AnyObject]] else { print("pages error"); return }
    guard let blocks = pages[0]["blocks"] as? [[String : AnyObject]] else { print("blocks error"); return }
    guard let paragraphs = blocks[0]["paragraphs"] as? [[String : AnyObject]] else { print("paragraphs error"); return }
    guard let words = paragraphs[0]["words"] as? [[String : AnyObject]] else { print("words error"); return }
    guard let symbols = words[0]["symbols"] as? [[String : AnyObject]] else { print("symbols error"); return }
    
    validateVIN(retrievedVIN)
    // If the request was bad:
    // self.compareVINCharachtersWithRetrieved(symbols, rg, croppedImage)
    // It allows the user to maunally change characters
  }
  
  
  
  func validateVIN(_ VIN: String) {
    
    var cleanedVIN = cleanVIN(VIN)
    cleanedVIN = String(cleanedVIN.filter { !" \n\t\r".contains($0) })
    print("Cleaned VIN", cleanedVIN)
    
    struct CodableVINStruct: Codable {
      let VIN: String
    }
    
    let VINStruct = CodableVINStruct(VIN: cleanedVIN)
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
      print("Post statusCode:", statusCode)
      
      if let err = error {
        print("ERROR", err)
        // Show the user an error
      }
      
      guard let data = requestData else { print("error data"); return }
      let json = try? JSONSerialization.jsonObject(with: data, options: .allowFragments) as AnyObject
      
      guard let jsonSafe = json as? [String : AnyObject] else { print("error json"); return }
      guard let table1 = jsonSafe["Table1"] as? [[String : AnyObject]] else { print("error table1"); return }
      
      
      // Send the data to React-Native
      if let eventEmitter = self.bridge.module(for: VINModul.self) as? RCTEventEmitter {
        print("Returning VIN")
        eventEmitter.sendEvent(withName: "VINExists", body: table1[0])
      }
      
    }
    
    
    task.resume()
  }
  
  
  
}







