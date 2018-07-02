//
//  TextFieldDelegateFunctions.swift
//  VINScanner
//
//  Created by Joe on 25/04/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation


extension SwiftDataCorrectionView {
  
  func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
    // A TextField can only have 1 character.
    guard let text = textField.text?.uppercased() else { return true }
    let newLength = text.count + string.count - range.length
    //    print("newLength", newLength)
    
    
    return newLength <= 1
  }
  
  
  
  @objc func textFieldDidChange(_ textField: UITextField) {
    // We shouldnt move the active field if the user only deleted the charactersa
    if textField.text != "" {
      moveActiveTextField(toSide: .Right)
    }
    
    
  }
  
  func textFieldDidEndEditing(_ textField: UITextField) {
    // If a textfield was left blank, we make the user aware
    //    print("lort")
    modifyTextFieldIfDangerous(textField)
  }
  
}
