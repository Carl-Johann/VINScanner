//
//  CameraView.swift
//  test01
//
//  Created by Joe on 22/03/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation
import AVKit
import UIKit
import AVFoundation
import Vision


//var EventEmitter = RCTEventEmitter()
//class EventEmitter : RCTEventEmitter {
//
//}


@objc(RNCameraViewSwift)
class RNGradientViewManager : RCTViewManager, AVCaptureVideoDataOutputSampleBufferDelegate {
  
  var contentView = UIView(frame: CGRect(x: 0, y: 0, width: UIScreen.main.bounds.width, height: UIScreen.main.bounds.height))
  var requests = [VNRequest]()
  let urlSession = URLSession.shared
  
  let session = AVCaptureSession()
  let captureDevice = AVCaptureDevice.default(for: AVMediaType.video)
  let rectOfInterest = CGRect(x: (UIScreen.main.bounds.width / 2) - (UIScreen.main.bounds.width * 0.45),
                              y: UIScreen.main.bounds.height / 2 - (UIScreen.main.bounds.height * 0.05),
                              width: UIScreen.main.bounds.width * 0.9,
                              height: UIScreen.main.bounds.height * 0.1)
  var loaded = 0
  var vinScanned: Bool = false
  //  How many times the camera will have to detect a 17 charachter word
  let scanThreshold: Int = 6
  
  
  
  
  override func view() -> UIView! {
    startLiveVideo()
  
    let rectOfInterest = UIView(frame: self.rectOfInterest)
    rectOfInterest.layer.cornerRadius = 8
    rectOfInterest.layer.borderWidth = 4
    rectOfInterest.layer.borderColor = UIColor.lightGray.cgColor
    contentView.addSubview(rectOfInterest)

    
    if let eventEmitter = self.bridge.module(for: VINModul.self) as? RCTEventEmitter {
      eventEmitter.sendEvent(withName: "EventToJS", body: "123")
    }
    
    return contentView
  }
  
  
  
  
  
  
  func startLiveVideo() {
    
    //    check for sim or retarded device
    let deviceInput = try! AVCaptureDeviceInput(device: captureDevice!)
    let deviceOutput = AVCaptureVideoDataOutput()
    deviceOutput.videoSettings = [kCVPixelBufferPixelFormatTypeKey as String: Int(kCVPixelFormatType_32BGRA)]
    deviceOutput.setSampleBufferDelegate(self, queue: DispatchQueue.global(qos: DispatchQoS.QoSClass.default))
    session.addInput(deviceInput)
    session.addOutput(deviceOutput)
    
    let imageLayer = AVCaptureVideoPreviewLayer(session: session)
    imageLayer.frame = contentView.bounds
    contentView.layer.addSublayer(imageLayer)
    
    session.startRunning()
  }
  
  
  //  func highlightLetters(box: VNRectangleObservation) {
  //    let xCord = box.topLeft.x * contentView.frame.size.width
  //    let yCord = (1 - box.topLeft.y) * contentView.frame.size.height
  //    let width = (box.topRight.x - box.bottomLeft.x) * contentView.frame.size.width
  //    let height = (box.topLeft.y - box.bottomLeft.y) * contentView.frame.size.height
  //
  //    let outline = CALayer()
  //    outline.frame = CGRect(x: xCord, y: yCord, width: width, height: height)
  //    outline.borderWidth = 1.0
  //    outline.borderColor = UIColor.blue.cgColor
  //
  //    contentView.layer.addSublayer(outline)
  //  }
  
  
  func highlightWord(box: VNTextObservation) -> CGRect  {
    guard let boxes = box.characterBoxes else { return CGRect() }
    
    var maxX: CGFloat = 9999.0
    var minX: CGFloat = 0.0
    var maxY: CGFloat = 9999.0
    var minY: CGFloat = 0.0
    
    for char in boxes {
      if char.bottomLeft.x < maxX {
        maxX = char.bottomLeft.x
      }
      if char.bottomRight.x > minX {
        minX = char.bottomRight.x
      }
      if char.bottomRight.y < maxY {
        maxY = char.bottomRight.y
      }
      if char.topRight.y > minY {
        minY = char.topRight.y
      }
    }
    
    let xCord = maxX * contentView.frame.size.width
    let yCord = (1 - minY) * contentView.frame.size.height
    let width = (minX - maxX) * contentView.frame.size.width
    let height = (minY - maxY) * contentView.frame.size.height
    
    
    return CGRect(x: xCord, y: yCord, width: width, height: height)
  }
  
  
  func createCALayerFromRect(rect: CGRect) {
    let outline = CALayer()
    outline.frame = CGRect(x: rect.origin.x, y: rect.origin.y, width: rect.width, height: rect.height)
    outline.borderColor = UIColor.green.cgColor
    outline.cornerRadius = 3
    outline.borderWidth = 2
    if rect.width > 100 && rect.height > 25 {
      contentView.layer.addSublayer(outline)
    }
  }
  
  
  
  
  
  
  
  
  
  
  
  
  func captureOutput(_ output: AVCaptureOutput, didOutput sampleBuffer: CMSampleBuffer, from connection: AVCaptureConnection) {
    if !self.vinScanned {
      guard let pixelBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) else { return }
      var requestOptions:[VNImageOption : Any] = [:]
      guard let outputImage = getImageFromSampleBuffer(sampleBuffer: sampleBuffer) else { return }
      
      let textRequest = VNDetectTextRectanglesRequest { request, error in
        self.detectTextHandler(request: request, error: error, image: outputImage, pixelBuffer: pixelBuffer)
      }
      textRequest.reportCharacterBoxes = true
      
      //    DispatchQueue.main.async {
      //      if self.loaded == self.scanThreshold {
      //          self.contentView.layer.sublayers?.removeSubrange(2...)
      //      }
      //    }
      
      if let camData = CMGetAttachment(sampleBuffer, kCMSampleBufferAttachmentKey_CameraIntrinsicMatrix, nil) {
        requestOptions = [.cameraIntrinsics:camData]
      }
      
      let imageRequestHandler = VNImageRequestHandler(cvPixelBuffer: pixelBuffer, orientation: CGImagePropertyOrientation.right, options: requestOptions)
      
      
      do {
        try imageRequestHandler.perform([textRequest])
      } catch {
        print(error)
      }
    }
  }
  
  
  
  
  
  
  func postImage(croppedImage: UIImage) {
    print("send shit")
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
    }
    
    struct ImageStruct: Codable {
      let content: String
    }
    
    let types = TypeStruct(type: "TEXT_DETECTION")
    let imags = ImageStruct(content: imageAsBase64)
    let requests = RequestStruct(image: imags, features: [types])
    let requestss = RequestsStruct(requests: [requests])
    
    let encodedData = try? JSONEncoder().encode(requestss)
    
    let json = try? JSONSerialization.jsonObject(with: encodedData!, options: .allowFragments)
    //    print("json", json!)
    let valid = JSONSerialization.isValidJSONObject(json!) // true
    print("is JSON valid:", valid)
    let jsonData = try? JSONSerialization.data(withJSONObject: json!)
    
    var request = URLRequest(url: URL(string: "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyB8WDzdr9pPDVjqc4txtB6M5ClrY-P_8q8")!)
    
    request.httpBody = jsonData
    request.addValue("application/json", forHTTPHeaderField: "Content-Type")
    request.httpMethod = "POST"
    let task = self.urlSession.dataTask(with: request as URLRequest) { requestData, requestResponse, error in
      
      let parsedResult = try! JSONSerialization.jsonObject(with: requestData!, options: .allowFragments) as AnyObject
      print("data", parsedResult)
      
      guard let data = parsedResult["responses"] as? [String : AnyObject] else { return }
      
      
      
      
//            guard let responses = parsedResult["responses"] as? [String : AnyObject] else { return }
      //      print("lortsvar", responses)
      //      print("fucklort", parsedResult["responses"]!!["fullTextAnnotation"]["pages"])
      //      for response in responses {
      //        print(response)
      //      }
      //      print("spadelort", responses["fullTextAnnotation"]!["text"])
      //      guard let parsedResponses = parsedResult["responses"] as? [String : AnyObject]  else { print(1); return }
      
      //      guard let textAno = parsedResponses["fullTextAnnotation"] else { print(2); return }
      
    }
    
    
    task.resume()
    
    //    self.vinScanned = false
  }
  
  
  
  // Called from CaptureOutput
  func detectTextHandler(request: VNRequest, error: Error?, image: CIImage, pixelBuffer: CVPixelBuffer) {
    if !self.vinScanned {
      guard let observations = request.results else { return }
      let result = observations.map({$0 as? VNTextObservation})
      
      DispatchQueue.main.async() {
        for region in result {
          guard let rg = region else { return }
          guard let boxes = rg.characterBoxes else { return }
          let regionBox = self.highlightWord(box: rg)
          
          if boxes.count == 17 {
            if self.rectOfInterest.contains(regionBox) {
              if self.loaded == self.scanThreshold {
                print("scanned")
                self.vinScanned = true
                
                var scannedImage = UIImage(ciImage: image)
                scannedImage = scannedImage.rotate(radians: .pi / 2)!
                scannedImage = scannedImage.resizeImage(targetSize: CGSize(width: UIScreen.main.bounds.width, height: UIScreen.main.bounds.height))
                guard let scannedImageAsCG = scannedImage.cgImage else { return }
                let croppedCGImage = scannedImageAsCG.cropping(to: self.rectOfInterest)
                let croppedUIImage = UIImage(cgImage: croppedCGImage!)
                DispatchQueue.main.async {
                  self.postImage(croppedImage: croppedUIImage)
                }
                // Next segment used only for debugging.
                let imageIllustration = UIImageView(image: croppedUIImage)
                imageIllustration.center = CGPoint(x: UIScreen.main.bounds.width / 2, y: UIScreen.main.bounds.height / 2)
                imageIllustration.frame.size = croppedUIImage.size
                imageIllustration.backgroundColor = UIColor.green
                self.contentView.addSubview(imageIllustration)
                
                
                //
              } else {
                self.loaded += 1
                if self.loaded != 0 { self.contentView.layer.sublayers?.removeSubrange(2...) }
                self.createCALayerFromRect(rect: regionBox)
              }
            }
          }
        }
      }
    }
  }
  
  
  
  
  
  
  
  
  
  
  func getImageFromSampleBuffer(sampleBuffer: CMSampleBuffer) -> CIImage? {
    guard let pixelBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) else {
      return nil
    }
    CVPixelBufferLockBaseAddress(pixelBuffer, .readOnly)
    let baseAddress = CVPixelBufferGetBaseAddress(pixelBuffer)
    let width = CVPixelBufferGetWidth(pixelBuffer)
    let height = CVPixelBufferGetHeight(pixelBuffer)
    let bytesPerRow = CVPixelBufferGetBytesPerRow(pixelBuffer)
    let colorSpace = CGColorSpaceCreateDeviceRGB()
    let bitmapInfo = CGBitmapInfo(rawValue: CGImageAlphaInfo.premultipliedFirst.rawValue | CGBitmapInfo.byteOrder32Little.rawValue)
    guard let context = CGContext(data: baseAddress, width: width, height: height, bitsPerComponent: 8, bytesPerRow: bytesPerRow, space: colorSpace, bitmapInfo: bitmapInfo.rawValue) else {
      return nil
    }
    guard let cgImage = context.makeImage() else {
      return nil
    }
    
    let image = CIImage(cgImage: cgImage)
    CVPixelBufferUnlockBaseAddress(pixelBuffer, .readOnly)
    return image
  }
  
  
}



extension UIImage {
  
  func rotate(radians: Float) -> UIImage? {
    var newSize = CGRect(origin: CGPoint.zero, size: self.size).applying(CGAffineTransform(rotationAngle: CGFloat(radians))).size
    // Trim off the extremely small float value to prevent core graphics from rounding it up
    newSize.width = floor(newSize.width)
    newSize.height = floor(newSize.height)
    
    UIGraphicsBeginImageContext(newSize);
    let context = UIGraphicsGetCurrentContext()!
    
    // Move origin to middle
    context.translateBy(x: newSize.width/2, y: newSize.height/2)
    // Rotate around middle
    context.rotate(by: CGFloat(radians))
    
    self.draw(in: CGRect(x: -self.size.width/2, y: -self.size.height/2, width: self.size.width, height: self.size.height))
    
    let newImage = UIGraphicsGetImageFromCurrentImageContext()
    UIGraphicsEndImageContext()
    
    return newImage
  }
  
  func resizeImage(targetSize: CGSize) -> UIImage {
    let size = self.size
    let widthRatio  = targetSize.width  / size.width
    let heightRatio = targetSize.height / size.height
    let newSize = widthRatio > heightRatio ?  CGSize(width: size.width * heightRatio, height: size.height * heightRatio) : CGSize(width: size.width * widthRatio,  height: size.height * widthRatio)
    let rect = CGRect(x: 0, y: 0, width: newSize.width, height: newSize.height)
    
    UIGraphicsBeginImageContextWithOptions(newSize, false, 1.0)
    self.draw(in: rect)
    let newImage = UIGraphicsGetImageFromCurrentImageContext()
    
    UIGraphicsEndImageContext()
    
    return newImage!
  }
}

