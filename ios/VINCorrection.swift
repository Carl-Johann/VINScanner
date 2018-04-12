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
  
  
  // MARK: - Setup Toolbar Items
  func setupVINCorrectionKeyboardToolbar() {
    
    // To evenly space the buttons in the toolbar we need to add a flexbtn between them
    let flexibleButton = UIBarButtonItem(barButtonSystemItem: .flexibleSpace, target: nil, action: nil)
    let barButtonInset: UIEdgeInsets = UIEdgeInsets(top: 4, left: 0, bottom: 0, right: 0)
    let resizeTarget: CGSize = CGSize(width: 25, height: 25)
    
    
    var BackIconLeftImage = UIImage(named: "BackIconLeft.png")
    BackIconLeftImage = BackIconLeftImage?.resizeImage(targetSize: resizeTarget)
    let BackIconLeft = UIBarButtonItem(image: BackIconLeftImage, style: .plain, target: self, action: #selector(self.moveActiveTextFieldLeft(sender:) ))
    BackIconLeft.imageInsets = barButtonInset
    
    // We set the alpha to 0.7 because the BackIconLeft.png and BackIconRight.png
    //have a slightly dimmer shade of blue and to match that the alpha is set to 0.7
    guard let MoveBackIconLeftImage = UIImage(named: "MoveBackIconLeft.png")?.alpha(0.7) else { print("couldn't get MoveBackIconLeft.png with 0.7 alpha"); return }
    let MoveBackIconLeft = UIBarButtonItem(image: MoveBackIconLeftImage, style: .plain, target: self, action: #selector(self.moveTextLeft(sender:) ))
    MoveBackIconLeft.imageInsets = barButtonInset
    
    guard let MoveBackIconRightImage = UIImage(named: "MoveBackIconRight.png")?.alpha(0.7) else { print("couldn't get MoveBackIconRight.png with 0.7 alpha"); return }
    let MoveBackIconRight = UIBarButtonItem(image: MoveBackIconRightImage, style: .plain, target: self, action: #selector(self.moveTextRight(sender:) ))
    MoveBackIconRight.imageInsets = barButtonInset
    //
    
    var BackIconRightImage = UIImage(named: "BackIconRight.png")
    BackIconRightImage = BackIconRightImage?.resizeImage(targetSize: resizeTarget)
    let BackIconRight = UIBarButtonItem(image: BackIconRightImage, style: .plain, target: self, action: #selector(self.moveActiveTextFieldRight(sender:) ))
    BackIconRight.imageInsets = barButtonInset
    
    
    toolbar.setItems([BackIconLeft, flexibleButton, MoveBackIconLeft, flexibleButton, MoveBackIconRight, flexibleButton, BackIconRight], animated: false)
  }
  
  
  
  
  
  // MARK: - Compare VIN Charachters With Retrieved
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
//          let value = VINDic[i - 1]
//          let shouldShowSmallImages = VINDic.count == symbols.count ? true : false
          
          let fieldPerLayer: CGFloat = 9
          // Converts 'key' to a float value with 'fieldPerLayer' so that we don't have to convert it everywhere below.
          var keyF = CGFloat(key)
          
          // The desired default height
          let defaultHeight = self.screenHeight * 0.5
          
          // We set the individual image width based on screen,
          // as long as it is not larger than 45 px, because that will stretch the images too much
          let smallFieldByScreenWidth = (self.screenWidth * 0.9)/fieldPerLayer
          let smallFieldMaxWidth: CGFloat = 45
          let smallFieldWidth = smallFieldByScreenWidth < smallFieldMaxWidth ? smallFieldByScreenWidth : smallFieldMaxWidth
          
          // The bounding boxes returned from Google are on average 2:1 height compared to width
          let layer = keyF < fieldPerLayer ? 1 : 2

          let imgGap = (self.screenWidth - (smallFieldWidth * fieldPerLayer)) / (fieldPerLayer + 1)
          
          // 'Resets' the offset when it starts adding the new layer
          if layer == 2 { keyF -= fieldPerLayer }
          
          // How far in (x value) the individual field should be
          var fieldOffset = (imgGap * (keyF + 1))
          fieldOffset = fieldOffset + (CGFloat(Double(keyF) + 0.5) * smallFieldWidth)
          
          
          // We show the cropped image right above the textfields for easy comparison.
          let imageIllustration = UIImageView(image: croppedImage)
          imageIllustration.center = CGPoint(x: UIScreen.main.bounds.width / 2, y: UIScreen.main.bounds.height * 0.4)
          imageIllustration.frame.size = croppedImage.size
          imageIllustration.backgroundColor = UIColor.green
          imageIllustration.tag = 118
          self.VINCorrectionView.addSubview(imageIllustration)
          
          
          if self.VINCorrectionView.viewWithTag(100 + i) == nil {
            // For every character we add a TextField so we can manually change the values if the suck.
            var textField = ComparisonTextField(size: CGSize(width: smallFieldWidth, height: smallFieldWidth))
            let extraTextFieldOffset = (layer == 1 ? 0 : (smallFieldWidth + imgGap))
            if CGFloat(i) > fieldPerLayer { fieldOffset += ((smallFieldWidth * 0.5) + (imgGap * 0.5)) }
            textField.center = CGPoint(x: fieldOffset, y: defaultHeight + extraTextFieldOffset)
            textField.layer.cornerRadius = 1
            
            if i <= scannedVIN.count {
              let text = scannedVIN.index(scannedVIN.startIndex, offsetBy: key)
              textField.text = String(scannedVIN[text])
            }
            textField.tag = 100 + i
            textField.addTarget(self, action: #selector(self.textFieldDidChange(_:)), for: .editingChanged)
            
            textField.inputAccessoryView = self.toolbar
            textField.autocapitalizationType = UITextAutocapitalizationType.allCharacters
            if i > 12 { textField.keyboardType = .numberPad }
            textField.delegate = self
            
            // Some characters look alot like another, and can therefore be misidentified. We just make the user aware of them.
            textField = self.modifyTextFieldIfDangerous(textField) as! ComparisonTextField
            
            self.VINCorrectionView.addSubview(textField)
          }
          
        }
        
        
        let buttonWidth = ((self.screenWidth * 0.75) / 2) - 5
        let resendButon = YellowRoundedButton.button(size: CGSize(width: buttonWidth, height: 55), title: "Resend")
        resendButon.center = CGPoint(x: ((self.screenWidth/2) - (buttonWidth/2)) - 5 , y: self.screenHeight * 0.75)
        resendButon.addTarget(self, action: #selector(self.resendVINBtn(sender:)), for: .touchUpInside)
        self.VINCorrectionView.addSubview(resendButon)
        
        let scanAgainButton = YellowRoundedButton.button(size: CGSize(width: buttonWidth, height: 55), title: "Scan Again")
        scanAgainButton.center = CGPoint(x: ((self.screenWidth/2) + (buttonWidth/2)) + 5 , y: self.screenHeight * 0.75)
        scanAgainButton.addTarget(self, action: #selector(self.returnToCamera(sender:)), for: .touchUpInside)
        self.VINCorrectionView.addSubview(scanAgainButton)
    }
  }
  
  

  
  
  
  
  
  
  
  // MARK: - Button Functions
  @objc fileprivate func moveActiveTextFieldLeft(sender: UIButton) {
    let textFields: [ComparisonTextField] = getTextFields()
    for textField in textFields {
      // If this textfield is the one selected
      if textField.isFirstResponder {
        // tag 101 is the first textfield. 117 is the last
        if (textField.isFirstResponder && textField.tag > 101) {
          // tag 101 is the first textfield. 117 is the last
          // Sets the textField to the left of the selected one as active
          textFields.first(where: { $0.tag == textField.tag - 1 })?.becomeFirstResponder()
          return
        }
      }
    }
  }
  
  @objc fileprivate func moveTextLeft(sender: UIButton) {
    let textFields: [ComparisonTextField] = getTextFields()
    // If the textField is the one selected
    // If there are any fields next to the selected textfield that are empty
    guard let textField = textFields.first(where: { (($0.isFirstResponder == true) && ($0.tag > 101)) }) else { print("ERROR. Couldn't find selected inputfield"); return }
    
    let anyEmptyFields = textFields.contains(where: { (($0.tag < textField.tag) && ($0.text?.count == 0)) })
    var firstEmptyFieldDetected = false
    
    if anyEmptyFields == true {
      for field in textFields.filter({ $0.tag < textField.tag }) {
        if firstEmptyFieldDetected == true {
          field.text = textFields.first(where: { $0.tag == field.tag + 1 })!.text
          
          if var fieldToModify = self.VINCorrectionView.viewWithTag(field.tag) as? UITextField {
            fieldToModify = modifyTextFieldIfDangerous(field)
          }
        } else if (firstEmptyFieldDetected == false && field.text == "") {
          firstEmptyFieldDetected = true
          field.text = textFields.first(where: { $0.tag == field.tag + 1 })!.text
          
          if var fieldToModify = self.VINCorrectionView.viewWithTag(field.tag) as? UITextField {
            fieldToModify = modifyTextFieldIfDangerous(field)
          }
        }
      }
      textField.text = ""
    }
    
  }
  
  @objc fileprivate func moveTextRight(sender: UIButton) {
    let textFields: [ComparisonTextField] = getTextFields()
    // If the textField is the one selected
    // If there are any fields next to the selected textfield that are empty
    guard let textField = textFields.first(where: { (($0.isFirstResponder == true) ) }) else { print("ERROR. Couldn't find selected inputfield"); return }
    
    let anyEmptyFields = textFields.contains(where: { (($0.tag > textField.tag) && ($0.text?.count == 0)) })
    var firstEmptyFieldDetected = false
    
    if anyEmptyFields == true {
      for field in textFields.filter({ $0.tag > textField.tag }).reversed() {
        if firstEmptyFieldDetected == true {
          field.text = textFields.first(where: { $0.tag == field.tag - 1 })!.text
          
          if var fieldToModify = self.VINCorrectionView.viewWithTag(field.tag) as? UITextField {
            fieldToModify = modifyTextFieldIfDangerous(field)
          }
          
        } else if (firstEmptyFieldDetected == false && field.text == "") {
          firstEmptyFieldDetected = true
          field.text = textFields.first(where: { $0.tag == field.tag - 1 })!.text
          
          if var fieldToModify = self.VINCorrectionView.viewWithTag(field.tag) as? UITextField {
              fieldToModify = modifyTextFieldIfDangerous(field)
          }
          
        }
      }
      textField.text = ""
    }
    
  }
  
  @objc fileprivate func moveActiveTextFieldRight(sender: UIButton) {
    let textFields: [ComparisonTextField] = getTextFields()
    for textField in textFields {
      // If this textfield is the one selected
      if (textField.isFirstResponder && textField.tag < 117) {
        // tag 101 is the first textfield. 117 is the last
        // Sets the textField to the right of the selected one as active
        textFields.first(where: { $0.tag == textField.tag + 1 })?.becomeFirstResponder()
        return
      }
    }
    
  }
  
  @objc fileprivate func resendVINBtn(sender: UIButton) {

    var completedVIN = ""
    let textFields = getTextFields()
    
    for textfield in textFields {
      completedVIN.append(textfield.text!)
    }
    
    guard let eventEmitter = self.bridge.module(for: VINModul.self) as? RCTEventEmitter else { print("Couldn't get eventEmitter"); return }
    eventEmitter.sendEvent(withName: "VINIsAVIN", body: [ "ShouldShow" : true, "VIN" : completedVIN ])
    

    
    print("completedVIN", completedVIN)
    validateVIN(completedVIN)
  }

  
  
  
  
  
  
  // MARK: - TextField Delegate Functions
  func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
    // A TextField can only have 1 character.
    guard let text = textField.text?.uppercased() else { return true }
    let newLength = text.count + string.count - range.length
    print("newLength", newLength)
    return newLength <= 1
  }
  

  
 @objc func textFieldDidChange(_ textField: UITextField) {
//    print("texfield did change", textField.text!)
  
  
  }
  
  func textFieldDidEndEditing(_ textField: UITextField) {
    // If a textfield was left blank, we make the user aware
//    print("lort")
    modifyTextFieldIfDangerous(textField)
  }
  
  
  
  
  
  
  
  // MARK: - Helper Functions
  
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
    
    for i in 1...17 {
      let textField = contentView.viewWithTag(100 + i) as! ComparisonTextField
      textFields.append(textField)
    }
    
    return textFields
  }
  
  
  @objc fileprivate func returnToCamera(sender: UIButton) {
    self.hideVINCorrectionView()
    self.showCameraView()
  }
  
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
  
  
  
  
}

