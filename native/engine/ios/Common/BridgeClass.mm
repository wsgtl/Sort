/**
 * iOS与cocos互调接口
 */

#include "BridgeClass.h"
#import "cocos/platform/apple/JsbBridgeWrapper.h"
#include "application/ApplicationManager.h"
#import <AudioToolbox/AudioToolbox.h>
#include "cocos.h"

@implementation BridgeClass
+(void)init {
    JsbBridgeWrapper* m = [JsbBridgeWrapper sharedInstance];
    
    // 震动
    OnScriptEventListener vibrate = ^void(NSString* arg) {
        [BridgeClass vibrate:arg];
    };
    [m addScriptEventListener:@"vibrate" listener:vibrate];
}

+ (void)vibrate:(NSString*)arg {
    AudioServicesPlaySystemSound(1520);
}

@end
