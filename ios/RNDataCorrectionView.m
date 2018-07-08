//
//  RNDataCorrectionView.m
//  VINScanner
//
//  Created by Joe on 23/04/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//


#import <React/RCTViewManager.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(RNDataCorrectionView, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(location, NSArray);
RCT_EXPORT_VIEW_PROPERTY(color, NSArray);
RCT_EXPORT_VIEW_PROPERTY(dataFromScan, NSString);
RCT_EXPORT_VIEW_PROPERTY(imageAs64, NSString);
RCT_EXPORT_VIEW_PROPERTY(imageAs64AndDataFromScan, NSDictionary);
RCT_EXTERN_METHOD(shouldShowCameraView:(nonnull BOOL *)shouldShow)

@end

