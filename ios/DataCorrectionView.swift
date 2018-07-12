//
//  DataCorrectionView.swift
//  VINScanner
//
//  Created by Joe on 25/04/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation

extension SwiftDataCorrectionView {
  
  @objc func resendData(sender: UIButton) {
//    print("resendData clicked")
//    guard let safeDataFromScan = self.dataFromScan else {
//      print("Couldnt get dataFromScan from self in correctDataFromGoogleManually"); return
//    }
    
    var correctedCharacters = ""
    var textFields = getTextFields()
    if isVIN() == false {
      textFields = textFields.filter { $0.tag <= 108 }
    }
    
    
    for textfield in textFields {
      correctedCharacters.append(textfield.text!)
    }
    
    // If the scanned data was 6 long, we actually show them 7 TextField incase Google missed one.
    correctedCharacters = correctedCharacters.trimmingCharacters(in: .whitespacesAndNewlines)
    
    guard let RCTBridge = self.bridge else { print("Couldn't get self.bridge in enterVINOrUnitmanually()"); return }
    guard let eventEmitter = RCTBridge.module(for: VINModul.self) as? RCTEventEmitter else { print("Couldn't get eventEmitter"); return }
    eventEmitter.sendEvent(withName: "ShouldShowDataInFirstDetailBox", body: [
      "ShouldShow" : true, "CleanedCharacters" : correctedCharacters
    ])
    eventEmitter.sendEvent(withName: "shouldShowDataCorrectionView", body: [
      "ShouldShow" : false,
      "imageAs64" : self.encodeImage(self.comparisonImage!)!
    ])
    
    
    
    
    print("completedVIN", correctedCharacters)
    ApiRequests.sharedInstance.validateVIN(correctedCharacters, RCTBridge)
  }

  
  
  func showRequiredTextFields(_ fieldPerLayer: CGFloat, _ imgGap: CGFloat, _ smallFieldWidth: CGFloat, _ safeDataFromScan: String) {
    
    
    DispatchQueue.main.async {
      for i in 1...17 {
        
        let key = i - 1
        // Converts 'key' to a float value with 'fieldPerLayer' so that we don't have to convert it everywhere below.
        var keyF = CGFloat(key)
        
        // The desired default height
        let defaultHeight = self.screenHeight * 0.5
        
        // The bounding boxes returned from Google are on average 2:1 height compared to width
        let layer = keyF < fieldPerLayer ? 1 : 2
        
        // 'Resets' the offset when it starts adding the new layer
        if layer == 2 { keyF -= fieldPerLayer }
        
        // How far in (x value) the individual field should be
        var fieldOffset = (imgGap * (keyF + 1))
        fieldOffset = fieldOffset + (CGFloat(Double(keyF) + 0.5) * smallFieldWidth)
        
        // Placeholder
        var textField: ComparisonTextField
        
        
        if self.viewWithTag(100 + i) == nil {
          // If a TextField hasn't been created there yet.
          textField = ComparisonTextField(size: CGSize(width: smallFieldWidth, height: smallFieldWidth))
        } else {
          // If there is a TextField there, we resize it to what it should be.
          textField = self.viewWithTag(100 + i) as! ComparisonTextField
          textField.frame.size = CGSize(width: smallFieldWidth, height: smallFieldWidth)
        }
        
        
        let extraTextFieldOffset = (layer == 1 ? 0 : (smallFieldWidth + imgGap))
        if CGFloat(i) > fieldPerLayer { fieldOffset += ((smallFieldWidth * 0.5) + (imgGap * 0.5)) }
        textField.center = CGPoint(x: fieldOffset, y: defaultHeight + extraTextFieldOffset)
        textField.layer.cornerRadius = 1
        
        if i <= safeDataFromScan.count {
          let text = safeDataFromScan.index(safeDataFromScan.startIndex, offsetBy: key)
          textField.text = String(safeDataFromScan[text]).trimmingCharacters(in: .whitespacesAndNewlines)
        }
        textField.tag = 100 + i
        textField.addTarget(self, action: #selector(self.textFieldDidChange(_:)), for: .editingChanged)
        
        textField.inputAccessoryView = self.toolbar
        textField.autocapitalizationType = UITextAutocapitalizationType.allCharacters
        
        if self.isVIN() == true {
          textField.keyboardType = .default
          if i > 12 { textField.keyboardType = .numberPad }
        } else if self.isVIN() == false {
          textField.keyboardType = .numberPad
        }
        
        textField.delegate = self
        
        // Some characters look alot like another, and can therefore be misidentified. We just make the user aware of them.
        textField = self.modifyTextFieldIfDangerous(textField) as! ComparisonTextField
        self.addSubview(textField)
        
        textField.isHidden = true
        if i <= 7 {
          // There should always atleast be 7 TextFields.
          textField.isHidden = false
        } else if self.isVIN() == true {
          // If IsVIN == true, every TextField should be added.
          textField.isHidden = false
        } else if ((self.isVIN() == false) && (i > 7)) {
          // Else if it isn't a VIN being scanned, we should only show 6 TextFields
          // as that is the length of numbers on the paper in the window.
          textField.isHidden = true
        }
        
      }
    }
    
  }
  
  
  
  
  
  
  // MARK: - Helpers
  
  func encodeImage(_ image: UIImage) -> String? {
//    let imageAsUI = cropImage(image)
    let base64String = UIImageJPEGRepresentation(image, 1.0)
    
    if (base64String != nil) {
      return base64String?.base64EncodedString()
    } else { return nil }
  }
  
  
  
  @objc func returnToCamera(sender: UIButton) {
//    print("returnToCamera clicked")
    guard let RCTBridge = self.bridge else { print("Couldn't get self.bridge in enterVINOrUnitmanually()"); return }
    guard let eventEmitter = RCTBridge.module(for: VINModul.self) as? RCTEventEmitter else { print("Couldn't get eventEmitter"); return }
    eventEmitter.sendEvent(withName: "ShouldShowCameraView", body: [ "shouldShow" : true ])
//    eventEmitter.sendEvent(withName: "shouldShowDataCorrectionView", body: [ "shouldShow" : false ])
  }
  
  func modifyTextFieldIfDangerous(_ textField: UITextField) -> UITextField {
    let dangerousChars = ["8", "B", "G", "6", "C", "5", "S"]
    
    guard let char = textField.text?.trimmingCharacters(in: .whitespacesAndNewlines) else { return textField }
    
    if dangerousChars.contains(char) {
      textField.font = UIFont(name: "AppleSDGothicNeo-SemiBold", size: 24)
      textField.textColor = UIColor(hex: "#cc0000")
      textField.layer.borderColor = UIColor.red.cgColor
      
    } else {
      textField.font = UIFont(name: "AppleSDGothicNeo-Regular", size: 24)
      textField.textColor = UIColor(hex: "#555555")
      textField.layer.borderColor = UIColor.black.withAlphaComponent(0.8).cgColor
    }
    
    if char.count != 1 {
      textField.layer.borderWidth = 2
      textField.layer.borderColor = UIColor.red.cgColor
    } else {
      textField.layer.borderWidth = 0.4
      textField.layer.borderColor = UIColor.black.withAlphaComponent(0.8).cgColor
    }
    
    //    textField.text = char.uppercased()
    return textField
  }
  
  
  func getTextFields() -> [ComparisonTextField] {
    var textFields: [ComparisonTextField] = []
    
    guard let safeDataFromScan = self.dataFromScan else {
      print("Couldnt get dataFromScan from self in getTextFields"); return textFields
    }
    
    // If the safeDataFromScan length is 6. It's most likely a window paper scan, could be a bad VIN though
    let BadVINOrWindowScanLength: Int = safeDataFromScan.count > 7 ? 17 : 7
    
    for i in 1...BadVINOrWindowScanLength {
      let textField = self.viewWithTag(100 + i) as! ComparisonTextField
      
      if isVIN() == true {
        textField.keyboardType = .default
        if i > 12 { textField.keyboardType = .numberPad }
      } else if isVIN() == false {
        textField.keyboardType = .numberPad
      }
      
      textFields.append(textField)
    }
    
    return textFields
  }
  
  func isVIN() -> Bool {
    guard let safeDataFromScan = self.dataFromScan else {
      // print("Couldnt get dataFromScan from self in isVIN()")
      return false
    }
    
    return safeDataFromScan.count > 7 ? true : false
    
  }
  
}
