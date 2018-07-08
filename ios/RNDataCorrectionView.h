//
//  RNDataCorrectionView.h
//  VINScanner
//
//  Created by Joe on 23/04/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <React/RCTView.h>
#import <React/RCTViewManager.h>


@interface RNDataCorrectionView : RCTViewManager

@property (nonatomic, assign) NSArray *location;
@property (nonatomic, assign) NSArray *color;
@property (nonatomic, assign) NSString *dataFromScan;
@property (nonatomic, assign) NSString *imageAs64;
@property (nonatomic, assign) NSDictionary *imageAs64AndDataFromScan;
@end

