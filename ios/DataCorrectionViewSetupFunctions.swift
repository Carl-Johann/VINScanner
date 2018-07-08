//
//  DataCorrectionViewSetupFunctions.swift
//  VINScanner
//
//  Created by Joe on 25/04/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation

extension SwiftDataCorrectionView {
 
  func viewSetup() {
    
    // Setup of the toolbar
    setupVINCorrectionKeyboardToolbar()
    
    // Sets up all the textFields
    setupTextFields()
  }
 
  
  func setupTextFields() {
    
//    guard let safeDataFromScan = self.dataFromScan else {
//      print("Couldnt get dataFromScan from self in setupTextFields()"); return
//    }
//
//    guard let croppedImage = self.comparisonImage else {
//      print("Couldnt get croppedImage from self in setupTextFields()"); return
//    }
    
    var safeDataFromScan = ""
    if self.dataFromScan != nil { safeDataFromScan = self.dataFromScan! }

    var croppedImage = UIImage()
    if self.comparisonImage != nil { croppedImage = self.comparisonImage! }
    
    
    DispatchQueue.main.async {
      // If the scanned data is 6 characters long, we assume it's a printed window code
      let fieldPerLayer: CGFloat = safeDataFromScan.count <= 7 ? 7 : 9
      
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
      self.addSubview(comparisonImage)
      
      
      self.showRequiredTextFields(fieldPerLayer, imgGap, smallFieldWidth, safeDataFromScan)
      
      
      self.resendAndScanAgainBtnsSetup()
      
      
    }
  }
  
  
  
  func resendAndScanAgainBtnsSetup() {
    let buttonWidth = ((self.screenWidth * 0.75) / 2) - 5
    let buttonHeight: CGFloat = 55
    
    
    let resendButon = YellowRoundedButton.button(size: CGSize(width: buttonWidth, height: buttonHeight), title: "Resend")
    resendButon.center = CGPoint(x: ((self.screenWidth/2) - (buttonWidth/2)) - 5 , y: self.screenHeight * 0.75)
    resendButon.addTarget(self, action: #selector(self.resendData(sender:)), for: .touchUpInside)
    
    let scanAgainButton = YellowRoundedButton.button(size: CGSize(width: buttonWidth, height: buttonHeight), title: "Scan Again")
    scanAgainButton.center = CGPoint(x: ((self.screenWidth/2) + (buttonWidth/2)) + 5 , y: self.screenHeight * 0.75)
    scanAgainButton.addTarget(self, action: #selector(self.returnToCamera(sender:)), for: .touchUpInside)
    
    if self.isIPhoneX {
      resendButon.frame.origin.y -= 40
      scanAgainButton.frame.origin.y -= 40
    }
    
    self.addSubview(resendButon)
    self.addSubview(scanAgainButton)
  }
  
  
  
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
}
