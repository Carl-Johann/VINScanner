//
//  ToolbarFunctions.swift
//  VINScanner
//
//  Created by Joe on 25/04/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation

extension SwiftDataCorrectionView {
  enum SideToMove {
    case Right
    case Left
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
  
  
  
  // MARK: - moveText() Function
  // This function gets called to move 'all' the text in the textFields
  func moveText(toSide: SideToMove) {
    let textFields: [ComparisonTextField] = getTextFields()
    
    guard let textField = textFields.first(where: { ($0.isFirstResponder == true) }) else {
      print("ERROR. Couldn't find selected inputfield"); return }
    
    let fewOrManyTextFieldsTagMaxIndex = isVIN() == true ? 118 : 108
    
    
    // We check for empty textfields. If there aren't any. We should do anything.
    let anyEmptyFields = textFields.filter({ $0.tag < fewOrManyTextFieldsTagMaxIndex }).contains(where: { ((
      toSide == .Left
        ? $0.tag < textField.tag
        : $0.tag > textField.tag )
      && ( $0.text?.count == 0 ))
    })
    
    if anyEmptyFields == true {
      // We loop trough the textfield reversed if they have to be moved
      // right, because we want to find the first empty field from that direction
      let filteredTextFields = toSide == .Right
        ? textFields.filter({ $0.tag > textField.tag }).reversed()
        : textFields.filter({ $0.tag < textField.tag })
      
      // We re-reverse the already reversed string to get 'last where' the textfield is empty.
      guard let tagOfLastEmptyTextField = filteredTextFields.reversed().first(where: { $0.text == "" }) else {
        print("Couldn't get first(where: { $0.text == '' }) in moveText()"); return
      }
      
      for field in filteredTextFields {
        // We only want to move the left or right of the first empty field.
        // That is why we loop through them reversed when we move the text right.
        if toSide == .Right {
          if field.tag <= tagOfLastEmptyTextField.tag {
            modifyFieldWithTag(textFields, field, toSide)
          }
        } else {
          if field.tag >= tagOfLastEmptyTextField.tag {
            modifyFieldWithTag(textFields, field, toSide)
          }
        }
      }
      
      textField.text = ""
    }
  }
  
  
  
  
  // MARK: - modifyFieldWithTag() Function
  func modifyFieldWithTag( _ textFields: [ComparisonTextField], _ field: UITextField, _ sideToMoveText: SideToMove) {
    let largestOrSmallestTagForEitherSide = sideToMoveText == .Right
      ? isVIN() == true ? 118 : 108
      : 101
    
    
    guard let fieldToGetTextFrom = textFields.first(where: { sideToMoveText == .Right
      ? $0.tag == field.tag - 1
      : $0.tag == field.tag + 1
    }) else { print("error at modifyFieldWithTag. Field tag:", field.tag ); return }
    field.text = fieldToGetTextFrom.text
    
    
    guard var fieldToModify = self.viewWithTag(field.tag) as? UITextField else {
      print("fieldToModify couldn't be cast as UITextField"); return }
    
    
    
    if sideToMoveText == .Right {
      if fieldToGetTextFrom.tag <= largestOrSmallestTagForEitherSide {
        fieldToModify = modifyTextFieldIfDangerous(field)
      }
    } else if sideToMoveText == .Left {
      if fieldToGetTextFrom.tag >= largestOrSmallestTagForEitherSide {
        fieldToModify = modifyTextFieldIfDangerous(field)
      }
    }
    
  }
  
  
  
  
  
  
  
  
  // Moves the text in the TextFields left
  @objc func moveTextLeft(sender: UIButton) {
    moveText(toSide: .Left)
  }
  // Moves the text in the TextFields right
  @objc func moveTextRight(sender: UIButton) {
    moveText(toSide: .Right)
  }
  
  
  // Moves the active TextFields left
  @objc func moveActiveTextFieldLeft(sender: UIButton) {
    moveActiveTextField(toSide: .Left)
  }
  // Moves the active TextFields right
  @objc func moveActiveTextFieldRight(sender: UIButton) {
    moveActiveTextField(toSide: .Right)
  }
  
}
