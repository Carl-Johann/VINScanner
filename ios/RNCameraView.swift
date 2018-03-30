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


@objc(RNCameraViewSwift)
class RNCameraViewSwift : RCTViewManager, AVCaptureVideoDataOutputSampleBufferDelegate {
  let screenWidth = UIScreen.main.bounds.width
  let screenHeight = UIScreen.main.bounds.height
  var contentView = UIView(frame: CGRect(x: 0, y: 0, width: UIScreen.main.bounds.width, height: UIScreen.main.bounds.height))
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
    rectOfInterest.tag = 99
    rectOfInterest.layer.borderColor = UIColor.lightGray.cgColor
    contentView.addSubview(rectOfInterest)
    
    // DON'T REMOVE. This is removed right after launch, but will crash without it.
    let layerDummy = CALayer()
    contentView.frame = CGRect(x: 0, y: 0, width: 0, height: 0)
    contentView.layer.addSublayer(layerDummy)
    ///////////////////////////////////////////////////////////////////////////////
    
    
//    WORKS!!
//    if let eventEmitter = self.bridge.module(for: VINModul.self) as? RCTEventEmitter {
//      eventEmitter.sendEvent(withName: "EventToJS", body: "123")
//    }
//    WORKS!!
    
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
    startSession()
  }
  func startSession() {
    loaded = 0
    vinScanned = false
    session.startRunning()
  }
  
  
  
  
  //  func highlightLetters(box: VNRectangleObservation) {
  //      let xCord = box.topLeft.x * contentView.frame.size.width
  //      let yCord = (1 - box.topLeft.y) * contentView.frame.size.height
  //      let width = (box.topRight.x - box.bottomLeft.x) * contentView.frame.size.width
  //      let height = (box.topLeft.y - box.bottomLeft.y) * contentView.frame.size.height
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
  
  
  
  
  
  func compareVINCharachtersWithRetrieved(_ symbols: [[String : AnyObject]], _ rg: VNTextObservation, _ originalImage: UIImage, _ croppedImage: UIImage) {
    var VINDic: Dictionary = [Int : String]()
    
    // We have a manual index counter (instead of symbols.enumerated()) because we dont want index increments on whitespaces.
    var indexValue = 0
    print(123, symbols)
    for symbol in symbols {
      guard var text = symbol["text"] as? String else { print("text error at", index, "for symbol:", symbol); return }
//      guard let boundingBox = symbol["boundingBox"] as? [String : AnyObject] else { print("boundingBox error"); return }
//      guard let vertices = boundingBox["vertices"] as? [[String : AnyObject]] else { print("vertices error"); return }
      
      
      
      // I, O and Q are not not allowed in a VIN so they are replaced with what the could be misinterpreted as.
      // All charachters in a VIN are capitalizd aswell.
      text = text.capitalized
      text = text.replacingOccurrences(of: "I", with: "1")
      text = text.replacingOccurrences(of: "Q", with: "0")
      text = text.replacingOccurrences(of: "O", with: "0")
      text = text.stripped
      
      // We don't strip whitespaces because google can misunderstand a letter, but not whitespaces.
      // They should not be included
      if text != " " { VINDic[indexValue] = text }
      indexValue += 1
    }
    
    
    let sortedDict = VINDic.sorted(by: { $0.0 < $1.0 })
    print(VINDic)
    print(sortedDict, VINDic.count)
    
    //
    // Decide if the VIN is acceptable (length wise etc.)
    //
    
    DispatchQueue.main.async {
      if let viewWithTag = self.contentView.viewWithTag(99) { viewWithTag.removeFromSuperview() }
      self.contentView.layer.sublayers?.removeAll()

      for (key, value) in sortedDict {
        let symbol = symbols[key]
        guard let boundingBox = symbol["boundingBox"] as? [String : AnyObject] else { print("boundingBox error"); return }
        guard let vertices = boundingBox["vertices"] as? [[String : AnyObject]] else { print("vertices error"); return }
        
        let bottomLeft: CGPoint = CGPoint(x: vertices[0]["x"] as! Int, y: vertices[0]["y"] as! Int)
        let topRight: CGPoint = CGPoint(x: vertices[2]["x"] as! Int, y: vertices[2]["y"] as! Int)
        let topLeft: CGPoint = CGPoint(x: vertices[3]["x"] as! Int, y: vertices[3]["y"] as! Int)
        
        let xCord = bottomLeft.x
        let yCord = bottomLeft.y
        
        let width = (topRight.x - topLeft.x)
//          * croppedImage.size.width
        let height = (topLeft.y - bottomLeft.y)
//          * croppedImage.size.height
        
        let charRect = CGRect(x: xCord, y: yCord, width: width, height: height)
        
        guard let scannedImageAsCG = croppedImage.cgImage else { print("scannedImageAsCG error"); return }
        guard let croppedCGImage = scannedImageAsCG.cropping(to: charRect) else { print("croppedCGImage error"); return }
        let croppedUIImage = UIImage(cgImage: croppedCGImage)

        // We need to set the size of the images to something that will fit, but not be overly stretched.
        let smallImgWidthScreen = (self.screenWidth * 0.9)/17
        let smallImgWidthMax: CGFloat = 25.0
        let smallImgWidth = smallImgWidthScreen < smallImgWidthMax ? smallImgWidthScreen : smallImgWidthMax
        
        // The bounding boxes returned from Google are on average 2:1 height compared to width
        let smallImgHeight = smallImgWidth * 2
        let imgGap = (((self.screenWidth - (smallImgWidth * 17))/17) + (smallImgWidth * 0.5))
        
        print(key, imgGap + (CGFloat(key) * smallImgWidth))
//        let imageIllustration = UIImageView(image: croppedUIImage)
        let imageIllustration = UIView()
//        imageIllustration.contentMode = UIViewContentMode.scaleToFill
        imageIllustration.center = CGPoint(x: imgGap + (CGFloat(key) * smallImgWidth), y: self.screenHeight * 0.3)
        imageIllustration.frame.size = CGSize(width: smallImgWidth, height: smallImgHeight)
        imageIllustration.backgroundColor = UIColor.green
        self.contentView.addSubview(imageIllustration)
        
        print("--------------------")
      }
      
      
      
      
//      Crops the images and adds them in !one! layer. Could be used for test purposes
//
//      for (index, box) in rg.characterBoxes!.enumerated() {
//        let xCord = box.topLeft.x * self.contentView.frame.size.width
//        let yCord = (1 - box.topLeft.y) * self.contentView.frame.size.height
//        let width = (box.topRight.x - box.bottomLeft.x) * self.contentView.frame.size.width
//        let height = (box.topLeft.y - box.bottomLeft.y) * self.contentView.frame.size.height
//        let rectToCropTo = CGRect(x: xCord, y: yCord, width: width, height: height)
//
//        guard let scannedImageAsCG = originalImage.cgImage else { print("scannedImageAsCG error"); return }
//        guard let croppedCGImage = scannedImageAsCG.cropping(to: rectToCropTo) else { print("croppedCGImage erro"); return }
//        let croppedUIImage = UIImage(cgImage: croppedCGImage)
//
//
//        let imageIllustration = UIImageView(image: croppedUIImage)
//        imageIllustration.center = CGPoint(x: UIScreen.main.bounds.width / 2, y: UIScreen.main.bounds.height * 0.3)
//        imageIllustration.frame.size = croppedUIImage.size
//        imageIllustration.backgroundColor = UIColor.green
//        self.contentView.addSubview(imageIllustration)
//      }
      
     
      
      
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
  
  
  
  
  
  
  
  
  
  
  
  
  func createAndRemoveRects(_ rect: CGRect) {
    self.contentView.layer.sublayers?.removeSubrange(2...)
    if self.loaded != self.scanThreshold {
        self.createCALayerFromRect(rect: rect)
    }
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
            
            self.createAndRemoveRects(regionBox)
            
            if self.rectOfInterest.contains(regionBox) {
              if self.loaded == self.scanThreshold {
                print("Scanned 'VIN'")
                self.vinScanned = true
                
                var scannedImage = UIImage(ciImage: image)
                scannedImage = scannedImage.rotate(radians: .pi / 2)!
                scannedImage = scannedImage.resizeImage(targetSize: CGSize(width: UIScreen.main.bounds.width, height: UIScreen.main.bounds.height))
                guard let scannedImageAsCG = scannedImage.cgImage else { return }
                let croppedCGImage = scannedImageAsCG.cropping(to: self.rectOfInterest)
                let croppedUIImage = UIImage(cgImage: croppedCGImage!)
                DispatchQueue.main.async {
                  self.postImage(croppedImage: croppedUIImage, originalImage: scannedImage, rg: rg)
                  self.session.stopRunning()
                }
//                for (index, box) in boxes.enumerated() {
//                  print(index)
//                  print("x", box.bottomLeft.x)
//                  print("y", box.bottomLeft.y)
//                  print("-------")
//                }
                // Next segment used only for debugging.
//                let imageIllustration = UIImageView(image: croppedUIImage)
//                imageIllustration.center = CGPoint(x: UIScreen.main.bounds.width / 2, y: UIScreen.main.bounds.height * 0.3)
//                imageIllustration.frame.size = croppedUIImage.size
//                imageIllustration.backgroundColor = UIColor.green
//                self.contentView.addSubview(imageIllustration)
                //
                
              } else {
                self.loaded += 1
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



extension String {
  
  var stripped: String {
    let okayChars = Set("ABCDEFGHJKLKMNPRSTUVWXYZ 1234567890")
    return self.filter {okayChars.contains($0) }
  }
}




