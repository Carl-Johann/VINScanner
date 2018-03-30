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
    //request.httpBody = postString.data(using: .utf8)
    
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
    
    let types = TypeStruct(type: "TEXT_DETECTION", maxResults: 1)
    let imags = ImageStruct(content: imageAsBase64)
    let requests = RequestStruct(image: imags, features: [types])
    let requestss = RequestsStruct(requests: [requests])
    
    let encodedData = try? JSONEncoder().encode(requestss)
    
    let json = try? JSONSerialization.jsonObject(with: encodedData!, options: .allowFragments)
    //    print("json", json!)
//    let valid = JSONSerialization.isValidJSONObject(json!) // true
//    print("is JSON valid:", valid)
    let jsonData = try? JSONSerialization.data(withJSONObject: json!)
    
    var request = URLRequest(url: URL(string: "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyB8WDzdr9pPDVjqc4txtB6M5ClrY-P_8q8")!)
    
    request.httpBody = jsonData
    request.addValue("application/json", forHTTPHeaderField: "Content-Type")
    request.httpMethod = "POST"
    let task = self.urlSession.dataTask(with: request as URLRequest) { requestData, requestResponse, error in
      
      
      
//      let parsedResult = try! JSONSerialization.jsonObject(with: requestData!, options: .allowFragments) as AnyObject
//      print("data", parsedResult)
      
      self.compareVINAndImage(originalImage, requestData!, rg, croppedImage)
//            guard let data = parsedResult["responses"] as? [String : AnyObject] else { return }
      
      // CHECK IF VIN IS 17 CHARS LONG, IF NOT RETRY, ELSE:
      // CONVERT: TO SWIFT.
      //      toUpperCase().trim().replace('.', '').replace(/[\W_]+/g,'').replace(/\s/g, '')
      //
      //      // The letters I, O and Q aren't allowed in a VIN (to be confused with 1 and 0) so we replace them if they exist
      //      result.replace(/I|O|Q/g, char => {
      //        if (char == 'I') { return 1 }
      //        if (char == 'O' || 'Q') { return 0 }
      //        })
      
      
      
      
//      if let eventEmitter = self.bridge.module(for: VINModul.self) as? RCTEventEmitter {
//        print("Returning VIN")
//        eventEmitter.sendEvent(withName: "ReturnVIN", body: "WOLBE6EC7HG099479")
//      }                
    }
    
    
    task.resume()
    
    //    self.vinScanned = false
  }
  



  func compareVINAndImage(_ originalImage: UIImage, _ data: Data, _ rg: VNTextObservation, _ croppedImage: UIImage) {
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
    
    print("Retrieved VIN:", retrievedVIN)
    self.compareVINCharachtersWithRetrieved(symbols, rg, originalImage, croppedImage)
  }
}





