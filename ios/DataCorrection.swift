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
  
//  enum UIViewTag {
//    case CorrectionTextField
//    case ComparisonImage
//
//    init(_ tag: Int) {
//      if
//    }
//  }
  
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
  func correctDataFromGoogleManually() {
    
    guard let safeDataFromScan = self.dataFromScan else {
      print("Couldnt get dataFromScan from self in correctDataFromGoogleManually"); return
    }
    guard let croppedImage = self.croppedImageForScan else {
      print("Couldnt get croppedImage from self in correctDataFromGoogleManually"); return
    }
    
    
    
    DispatchQueue.main.async {
      // If the scanned data is 6 characters long, we assume it's a printed window code
      let fieldPerLayer: CGFloat = safeDataFromScan.count == 6 ? 6 : 9
      
      // We set the individual image width based on screen,
      // as long as it is not larger than 45 px.
      let smallFieldByScreenWidth = (self.screenWidth * 0.9)/fieldPerLayer
      let smallFieldMaxWidth: CGFloat = 45
      let smallFieldWidth = smallFieldByScreenWidth < smallFieldMaxWidth ? smallFieldByScreenWidth : smallFieldMaxWidth
      
      let imgGap = (self.screenWidth - (smallFieldWidth * fieldPerLayer)) / (fieldPerLayer + 1)
      
      // We show the cropped image right above the textfields for easy comparison.
      let comparisonImage = UIImageView(image: croppedImage)
      comparisonImage.center = CGPoint(x: UIScreen.main.bounds.width / 2, y: UIScreen.main.bounds.height * 0.4)
      comparisonImage.frame.size = croppedImage.size
      comparisonImage.layer.cornerRadius = 1
      comparisonImage.tag = 118
      self.DataCorrectionView.addSubview(comparisonImage)
      
      
      self.showRequiredTextFields(fieldPerLayer, imgGap, smallFieldWidth, safeDataFromScan)
      
      
      
      let buttonWidth = ((self.screenWidth * 0.75) / 2) - 5
      let buttonHeight: CGFloat = 55
      let resendButon = YellowRoundedButton.button(size: CGSize(width: buttonWidth, height: buttonHeight), title: "Resend")
      resendButon.center = CGPoint(x: ((self.screenWidth/2) - (buttonWidth/2)) - 5 , y: self.screenHeight * 0.75)
      resendButon.addTarget(self, action: #selector(self.resendData(sender:)), for: .touchUpInside)
      self.DataCorrectionView.addSubview(resendButon)
      
      let scanAgainButton = YellowRoundedButton.button(size: CGSize(width: buttonWidth, height: buttonHeight), title: "Scan Again")
      scanAgainButton.center = CGPoint(x: ((self.screenWidth/2) + (buttonWidth/2)) + 5 , y: self.screenHeight * 0.75)
      scanAgainButton.addTarget(self, action: #selector(self.returnToCamera(sender:)), for: .touchUpInside)
      self.DataCorrectionView.addSubview(scanAgainButton)
    }
  }
  
  

  func showRequiredTextFields(_ fieldPerLayer: CGFloat, _ imgGap: CGFloat, _ smallFieldWidth: CGFloat, _ safeDataFromScan: String) {
    let numberOfTextFieldsToCreate: Int = safeDataFromScan.count == 6 ? 6 : 17
    let isVIN: Bool = safeDataFromScan.count > 6 ? true : false
    
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
        
        
        if self.DataCorrectionView.viewWithTag(100 + i) == nil {
          // If a TextField hasn't been created there yet.
          textField = ComparisonTextField(size: CGSize(width: smallFieldWidth, height: smallFieldWidth))
        } else {
        // If there is a TextField there, we resize it to what it should be. 
          textField = self.DataCorrectionView.viewWithTag(100 + i) as! ComparisonTextField
          textField.frame.size = CGSize(width: smallFieldWidth, height: smallFieldWidth)
        }
        
        let extraTextFieldOffset = (layer == 1 ? 0 : (smallFieldWidth + imgGap))
        if CGFloat(i) > fieldPerLayer { fieldOffset += ((smallFieldWidth * 0.5) + (imgGap * 0.5)) }
        textField.center = CGPoint(x: fieldOffset, y: defaultHeight + extraTextFieldOffset)
        textField.layer.cornerRadius = 1
        
        if i <= safeDataFromScan.count {
          let text = safeDataFromScan.index(safeDataFromScan.startIndex, offsetBy: key)
          textField.text = String(safeDataFromScan[text])
        }
        textField.tag = 100 + i
        textField.addTarget(self, action: #selector(self.textFieldDidChange(_:)), for: .editingChanged)
        
        textField.inputAccessoryView = self.toolbar
        textField.autocapitalizationType = UITextAutocapitalizationType.allCharacters
        if i > 12 { textField.keyboardType = .numberPad }
        textField.delegate = self
        
        // Some characters look alot like another, and can therefore be misidentified. We just make the user aware of them.
        textField = self.modifyTextFieldIfDangerous(textField) as! ComparisonTextField
        self.DataCorrectionView.addSubview(textField)
        textField.isHidden = true
        if i <= 6 {
        // There should always atleast be 6 TextFields.
//          self.DataCorrectionView.addSubview(textField)
          textField.isHidden = false
        } else if isVIN == true {
        // If IsVIN == true, every TextField should be added.
//          self.DataCorrectionView.addSubview(textField)
          textField.isHidden = false
        } else if ((isVIN == false) && (i > 6)) {
        // Else if it isn't a VIN being scanned, we should only show 6 TextFields
        // as that is the length of numbers on the paper in the window.
//          self.DataCorrectionView.sendSubview(toBack: textField)
          textField.isHidden = true
        }
        
      }
    }
  }
  
  
  
  
  
  
  // MARK: - Button Functions
  enum SideToMove {
    case Right
    case Left
  }
  
  // Moves the text in the TextFields left
  @objc fileprivate func moveTextLeft(sender: UIButton) {
    moveText(toSide: .Left)
  }
  // Moves the text in the TextFields right
  @objc fileprivate func moveTextRight(sender: UIButton) {
    moveText(toSide: .Right)
  }
  
  
  // Moves the active TextFields left
  @objc fileprivate func moveActiveTextFieldLeft(sender: UIButton) {
    moveActiveTextField(toSide: .Left)
  }
  // Moves the active TextFields right
  @objc fileprivate func moveActiveTextFieldRight(sender: UIButton) {
    moveActiveTextField(toSide: .Right)
  }
  
  
  
  // MARK: - moveText() Function
  // This function gets called to move 'all' the text in the textFields
  func moveText(toSide: SideToMove) {
    let textFields: [ComparisonTextField] = getTextFields()
    guard let textField = textFields.first(where: { ($0.isFirstResponder == true) }) else {
      print("ERROR. Couldn't find selected inputfield"); return
    }
    
    // We check for empty textfields. If there aren't any. We should do anything. left <
    let anyEmptyFields = textFields.contains(where: { ((
      toSide == .Left
        ? $0.tag < textField.tag
        : $0.tag > textField.tag )
      && ( $0.text?.count == 0 ))
    })
    
    if anyEmptyFields == true {
      var firstEmptyFieldDetected = false
      
      // We loop trough the textfield reversed if they have to be moved
      // right, because we want to find the first empty field from that direction
      let filteredTextFields = toSide == .Right
        ? textFields.filter({ $0.tag > textField.tag }).reversed()
        : textFields.filter({ $0.tag < textField.tag })
      
      
      for field in filteredTextFields {
        // We only want to move the left or right of the first empty field.
        // That is why we loop through them reversed when we move the text right.
        if firstEmptyFieldDetected == true {
          modifyFieldWithTag(textFields, field, toSide)
          
        } else if (firstEmptyFieldDetected == false && field.text == "") {
          firstEmptyFieldDetected = true
          modifyFieldWithTag(textFields, field, toSide)
          
        }
      }
      
      textField.text = ""
    }
  }
  
  
  // MARK: - modifyFieldWithTag() Function
  func modifyFieldWithTag( _ textFields: [ComparisonTextField], _ field: UITextField, _ sideToMoveText: SideToMove) {
    
    field.text = textFields.first(where: { sideToMoveText == .Right
      ? $0.tag == field.tag - 1
      : $0.tag == field.tag + 1
    })!.text
    
    if var fieldToModify = self.DataCorrectionView.viewWithTag(field.tag) as? UITextField {
      fieldToModify = modifyTextFieldIfDangerous(field)
    }
  }
  
  
  
  
  // The function that gets called to move the active TextField
  func moveActiveTextField(toSide: SideToMove) {
    let textFields: [ComparisonTextField] = getTextFields()
    for textField in textFields {
      // If this textfield is the one selected
      if textField.isFirstResponder {
        // Sets the textField to the right of the selected one as active
        textFields.first(where: { toSide == .Right
          ? $0.tag == textField.tag + 1
          : $0.tag == textField.tag - 1 })?.becomeFirstResponder()
        return
      }
    }
  }
  
  
  
  @objc fileprivate func resendData(sender: UIButton) {

    var completedVIN = ""
    let textFields = getTextFields()
    
    for textfield in textFields {
      completedVIN.append(textfield.text!)
    }
    
    guard let eventEmitter = self.bridge.module(for: VINModul.self) as? RCTEventEmitter else { print("Couldn't get eventEmitter"); return }
    eventEmitter.sendEvent(withName: "ShouldShowDataInFirstDetailBox", body: [ "ShouldShow" : true, "VIN" : completedVIN ])
    

    
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
    
    guard let safeDataFromScan = self.dataFromScan else {
      print("Couldnt get dataFromScan from self in getTextFields"); return textFields
    }
    
    // If the safeDataFromScan length is 6. It's most likely a window paper scan, could be a bad VIN though
    let BadVINOrWindowScanLength: Int = safeDataFromScan.count == 6 ? 6 : 17
    
    for i in 1...BadVINOrWindowScanLength {
      let textField = contentView.viewWithTag(100 + i) as! ComparisonTextField
      textFields.append(textField)
    }
    
    return textFields
  }
  
  
  @objc fileprivate func returnToCamera(sender: UIButton) {
    self.hideVINCorrectionView()
    self.showCameraView()
  }
  
  
  
  
}

