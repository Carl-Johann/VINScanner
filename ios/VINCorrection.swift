//
//  VINCorrection.swift
//  VINScanner
//
//  Created by Joe on 01/04/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation
import Vision
import UIKit

extension RNCameraViewSwift {
  
  
  // indexInVert
  // 0 = bottomLeft
  // 1 = bottomRight
  // 2 = topRight
  // 3 = topLeft  
  func returnSecureCorner(indexInVertici: Int, _ verticies: [[String : AnyObject]]) -> CGPoint? {
    var pointToReturn = CGPoint()
    if let xCord = verticies[indexInVertici]["x"] as? CGFloat { pointToReturn.x = xCord } else { pointToReturn.x = 0 }
    if let yCord = verticies[indexInVertici]["y"] as? CGFloat { pointToReturn.y = yCord } else { pointToReturn.y = 0 }
    return pointToReturn
  }
  
  
  
  
  
  
  
  
  
  
  func compareVINCharachtersWithRetrieved() {
    
    guard let symbols = self.symbolsForScan else {
      print("Couldnt get symbols from self in compareVINCharachtersWithRetrieved"); return
    }
    guard let scannedVIN = self.VINForScan else {
      print("Couldnt get scannedVIN from self in compareVINCharachtersWithRetrieved"); return
    }
    guard let croppedImage = self.croppedImageForScan else {
      print("Couldnt get croppedImage from self in compareVINCharachtersWithRetrieved"); return
    }
    
        
      var VINDic: Dictionary = [Int : String]()
    
      // We have a manual index counter (instead of symbols.enumerated()) because we dont want index increments on whitespaces.
      var indexValue = 0
      for symbol in symbols {
        
        guard var text = symbol["text"] as? String else { print("text error at", indexValue, "for symbol:", symbol); return }
        // We only clean one character at a time here though.
        text = self.cleanVIN(text)
        
        // We don't strip whitespaces because Google can misunderstand a letter, but not whitespaces.
        // They should not be included
        if text != " " { VINDic[indexValue] = text }
        indexValue += 1
      }
    
    
    
    
      DispatchQueue.main.async {
        
        for i in 1...17 {
          
          let key = i - 1
          let value = VINDic[i - 1]
          
          
          let imgPerLayer: CGFloat = 9
          // Converts 'key' to a float value with 'imgPerLayer' so that we don't have to do it everywhere below.
          var keyF = CGFloat(key)
          let defaultHeight = self.screenHeight * 0.25
          
          // We set the individual image width based on screen,
          // as long as it is not larger than 45 px, because that will stretch the images too much
          let smallImgWidthScreen = (self.screenWidth * 0.9)/imgPerLayer
          let smallImgWidthMax: CGFloat = 45
          let smallImgWidth = smallImgWidthScreen < smallImgWidthMax ? smallImgWidthScreen : smallImgWidthMax
          
          // The bounding boxes returned from Google are on average 2:1 height compared to width
          let layer = keyF < imgPerLayer ? 1 : 2
          let smallImgHeight = smallImgWidth * 2
          let imgGap = (self.screenWidth - (smallImgWidth * imgPerLayer)) / (imgPerLayer + 1)
          
          // 'Resets' the offset when it starts adding the new layer
          if layer == 2 { keyF -= imgPerLayer }
          
          // How far in (x value) the individual image should be
          var imgOffset = (imgGap * (keyF + 1))
          imgOffset = imgOffset + (CGFloat(Double(keyF) + 0.5) * smallImgWidth)
          
          
          
          // If a full VIN wasn't returned we still want to create empty fields, if the user wants to type them in manually
          if i <= VINDic.count {
            let symbol = symbols[key]
            
            guard let boundingBox = symbol["boundingBox"] as? [String : AnyObject] else { print("boundingBox error"); return }
            guard let vertices = boundingBox["vertices"] as? [[String : AnyObject]] else { print("vertices error"); return }
            // Gets the different corners
            guard let bottomLeft: CGPoint = self.returnSecureCorner(indexInVertici: 0, vertices) else { return }
            guard let topRight: CGPoint = self.returnSecureCorner(indexInVertici: 2, vertices) else { return }
            guard let topLeft: CGPoint = self.returnSecureCorner(indexInVertici: 3, vertices) else { return }
            
            
            // Creates a rect based on corners.
            // Makes the crop a little bigger so we dont have to stretch the small images as much.
            let width = (topRight.x - topLeft.x) * 1.1
            let height = (topLeft.y - bottomLeft.y) * 1.5
            let charRect = CGRect(x: bottomLeft.x, y: bottomLeft.y * 0.5, width: width, height: height)
            
            // Cropps the image
            guard let scannedImageAsCG = croppedImage.cgImage else { print("scannedImageAsCG error"); return }
            guard let croppedCGImage = scannedImageAsCG.cropping(to: charRect) else { print("croppedCGImage error"); return }
            let croppedUIImage = UIImage(cgImage: croppedCGImage)
            
            // Creates a small imageview.
            let imageIllustration = UIImageView(image: croppedUIImage)
            imageIllustration.contentMode = UIViewContentMode.scaleToFill
            imageIllustration.frame.size = CGSize(width: smallImgWidth, height: smallImgHeight)
            imageIllustration.center = CGPoint(x: imgOffset, y: defaultHeight + (layer == 1 ? 0 : smallImgHeight * 1.8 ))
            self.VINCorrectionView.addSubview(imageIllustration)
          }
          
          
          
          // For every character we add a TextField so we can manually change the values if the suck.
          let textField = ComparisonTextField(size: CGSize(width: smallImgWidth, height: smallImgWidth))
          let extraTextFieldOffset = (layer == 1 ? 0 : (smallImgHeight * 1.8)) + ((smallImgWidth * 1.5) + imgGap)
          textField.center = CGPoint(x: imgOffset, y: defaultHeight + extraTextFieldOffset)
          
          if i <= scannedVIN.count {
            let text = scannedVIN.index(scannedVIN.startIndex, offsetBy: key)
            textField.text = String(scannedVIN[text])
          }
          textField.tag = 100 + i
          textField.delegate = self
          
          // Some characters look alot like another, and can therefore be misidentified. We just make the user aware of them.
          let dangerousChars = ["8", "B", "G", "6", "C", "5", "S"]
          var safeValue = ""
          if value != nil { safeValue = value! }
          if dangerousChars.contains(safeValue) {
            textField.font = UIFont(name: "AppleSDGothicNeo-SemiBold", size: 24)
            textField.textColor = UIColor(hex: "#cc0000")
            textField.layer.borderColor = UIColor.red.cgColor
          } else {
            textField.font = UIFont(name: "AppleSDGothicNeo-Regular", size: 24)
            textField.textColor = UIColor(hex: "#555555")
            textField.layer.borderColor = UIColor.black.withAlphaComponent(0.8).cgColor

          }
          
          self.VINCorrectionView.addSubview(textField)
          
        }
        
        let button = UIButton()
        let buttonWidth = ((self.screenWidth * 0.75) / 2) - 5
        button.frame = CGRect.init(x: 0, y: self.screenHeight * 0.75, width: buttonWidth, height: 55)
        button.center = CGPoint(x: ((self.screenWidth/2) - (buttonWidth/2)) - 5 , y: self.screenHeight * 0.75)
        button.setTitle("Resend", for: .normal)
        button.setTitleColor(UIColor.black, for: .normal)
        button.layer.cornerRadius = 4
        button.layer.borderWidth = 2
        button.layer.borderColor = UIColor(hex: "#ffb307").cgColor
        button.titleLabel?.textAlignment = NSTextAlignment.center
        button.titleLabel!.font = UIFont(name: "AppleSDGothicNeo-Regular", size: 24)
        button.showsTouchWhenHighlighted = true
        button.isUserInteractionEnabled = true
        button.titleLabel!.textColor = UIColor.black
        button.addTarget(self, action: #selector(self.send(sender:)), for: .touchUpInside)
        self.VINCorrectionView.addSubview(button)
        
        
        
        let button2 = UIButton()
        button2.frame = CGRect.init(x: 0, y: self.screenHeight * 0.75, width: buttonWidth, height: 55)
        button2.center = CGPoint(x: ((self.screenWidth/2) + (buttonWidth/2)) + 5 , y: self.screenHeight * 0.75)
        button2.setTitle("Scan Again", for: .normal)
        button2.setTitleColor(UIColor.black, for: .normal)
        button2.layer.cornerRadius = 4
        button2.layer.borderWidth = 2
        button2.layer.borderColor = UIColor(hex: "#ffb307").cgColor
        button2.titleLabel?.textAlignment = NSTextAlignment.center
        button2.titleLabel!.font = UIFont(name: "AppleSDGothicNeo-Regular", size: 24)
        button2.showsTouchWhenHighlighted = true
        button2.isUserInteractionEnabled = true
        button2.titleLabel!.textColor = UIColor.black
        button2.addTarget(self, action: #selector(self.returnToCamera(sender:)), for: .touchUpInside)
        self.VINCorrectionView.addSubview(button2)
      
    }
  }
  
  
  
  func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
    // A TextField can only have 1 character.
    guard let text = textField.text?.uppercased() else { return true }
    let newLength = text.count + string.count - range.length
    return newLength <= 1
  }
  
  func textFieldDidEndEditing(_ textField: UITextField) {
    // If a textfield was left blank, we make the user aware
    if textField.text?.count != 1 {
      textField.layer.borderWidth = 2
      textField.layer.borderColor = UIColor.red.cgColor
      textField.text = textField.text?.uppercased()
    } else {
      textField.layer.borderWidth = 0.4
      textField.layer.borderColor = UIColor.black.withAlphaComponent(0.8).cgColor
      textField.text = textField.text?.uppercased()
    }
  }
  
  
  
  
  @objc fileprivate func send(sender: UIButton) {
    print("test1")
    var completedVIN = ""
    var textFields: [ComparisonTextField] = []
    
    for i in 1...17 {
        let textField = contentView.viewWithTag(100 + i) as! ComparisonTextField
        textFields.append(textField)
    }
    
    for textfield in textFields {
      completedVIN.append(textfield.text!)
    }
    
    if let eventEmitter = self.bridge.module(for: VINModul.self) as? RCTEventEmitter {
      print("ShouldShow VIN box = true")
      eventEmitter.sendEvent(withName: "VINIsAVIN", body: [ "ShouldShow" : true, "VIN" : completedVIN ])
    }
    
//  self.contentView.layer.sublayers?.removeAll()
//    DispatchQueue.main.async {
//      self.contentView.subviews.forEach({ $0.removeFromSuperview() })
//    }
    
//    startLiveVideo()
    validateVIN(completedVIN)
  }
  
  @objc fileprivate func returnToCamera(sender: UIButton) {
    self.hideVINCorrectionView()
    self.showCameraView()
  }
  
}
