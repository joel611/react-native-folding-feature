#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(FoldingFeature, RCTEventEmitter)

RCT_EXTERN_METHOD(initialise)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
