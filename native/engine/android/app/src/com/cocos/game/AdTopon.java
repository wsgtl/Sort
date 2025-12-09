package com.cocos.game;

import android.app.Activity;
import android.content.Context;
import android.os.Build;
import android.util.Log;

import com.cocos.lib.CocosSensorHandler;
import com.cocos.lib.JsbBridgeWrapper;
import com.thinkup.core.api.AdError;
import com.thinkup.core.api.TUAdInfo;
import com.thinkup.core.api.TUAdStatusInfo;
import com.thinkup.core.api.TUSDK;
import com.thinkup.core.api.TUShowConfig;
import com.thinkup.interstitial.api.TUInterstitial;
import com.thinkup.interstitial.api.TUInterstitialListener;
import com.thinkup.rewardvideo.api.TURewardVideoAd;
import com.thinkup.rewardvideo.api.TURewardVideoListener;

import org.json.JSONObject;

public class AdTopon {
    private String appId = "h693169b2ce884";
   private String appKey = "a399a4e290ae7a57432566b9a50139810";

   /**激励视频广告id*/
   private String videoId = "n693244d191436";
   /**插屏广告id*/
   private String interstitialId = "n693169eca88fe";
   private String Tag = "topon广告";

   public  Context context;
   public  Activity mActivity;
    JsbBridgeWrapper jbw;
   public void init(Activity activity){
       this.context = activity;
       this.mActivity = activity;
       jbw = JsbBridgeWrapper.getInstance();
       //初始化topon广告
       TUSDK.init(activity, appId, appKey);
//        ATDebuggerUITest.showDebuggerUI(context);
//        ATSDK.setDebuggerConfig(context, GAID, new ATDebuggerConfig.Builder(Ironsource_NETWORK).build());
       this.bindEvent();
   }

   private  void bindEvent(){

       jbw.addScriptEventListener("loadRewardVideo",this::loadVideo);
       jbw.addScriptEventListener("showRewardVideo",this::showVideo);

       jbw.addScriptEventListener("loadInterstitial",this::loadInterstitial);
       jbw.addScriptEventListener("showInterstitial",this::showInterstitial);

   }
   /**加载激励视频广告*/
   private void loadVideo(String s){
       Log.d(Tag,"将要加载激励视频广告");
       this.initVideo();

   }
   /**显示激励视频广告*/
   private void showVideo(String s) {
       Log.d(Tag,"将要显示激励视频广告");
       AppsFlyer.setCurrentAdInfo(s,"AdRewardVideo");
       this.showVideoAd("");
   }

   /**加载插屏广告*/
   private void loadInterstitial(String s){
       Log.d(Tag,"将要加载插屏广告");
       this.initInterstitial();
   }
   /**显示插屏广告*/
   private void showInterstitial(String s){
       Log.d(Tag,"将要显示插屏广告");
       AppsFlyer.setCurrentAdInfo(s,"AdInterstitial");
       this.showInterstitialAd(interstitialId);
   }



    //插屏广告
    private  TUInterstitial mInterstitialAd;
   private void initInterstitial() {
       Log.d(Tag,"initInterstitial: " + interstitialId);

       mInterstitialAd = new TUInterstitial(mActivity, interstitialId);
    //设置广告监听
       mInterstitialAd.setAdListener(new TUInterstitialListener() {
           @Override
           public void onInterstitialAdLoaded() {}

           @Override
           public void onInterstitialAdLoadFail(AdError adError) {
               //注意：禁止在此回调中执行广告的加载方法进行重试，否则会引起很多无用请求且可能会导致应用卡顿
           }
           @Override
           public void onInterstitialAdShow(TUAdInfo adInfo) {
               //建议在此回调中调用load进行广告的加载，方便下一次广告的展示（不需要调用isAdReady()）
               mInterstitialAd.load();
               gamePause();
               Log.d(Tag,"加载插屏视频广告");
           }
           @Override
           public void onInterstitialAdVideoStart(TUAdInfo adInfo) {
               gamePause();
               Log.d(Tag,"开始播放插屏视频广告");

               //上报用户收入
               double ecpm = adInfo.getEcpm()/1000.0;

               String adPlatform = adInfo.getPlacementId();



               // 上报广告收益（单位为美元）
               AppsFlyer.getInstance().sendEventAd(adPlatform, "interstitial", ecpm);


               String placement =  AppsFlyer.getInstance().getCurrentAdPlacement();
               String adType =  AppsFlyer.getInstance().getCurrentAdType();

               // 上报广告展示事件
               AppsFlyer.getInstance().sendAdShownEvent(placement, adType);

//                AppsFlyer.getInstance().sendEventAd(maxAd.getNetworkName(),maxAd.getFormat().getLabel(),maxAd.getRevenue());

               AppsFlyer.getInstance().recordAdRevenue( ecpm);
               AppsFlyer.getInstance().reportAdRevenue(adInfo.getEcpm(),adInfo.getCurrency());

               // 高价值用户数据上传
               // 声明 final 变量，供匿名内部类使用
               final double finalEcpm = ecpm;
               String model = Build.MODEL;

               GAIDHelper.fetchGAID(context, new GAIDHelper.GAIDCallback() {
                   @Override
                   public void onGAIDAvailable(String gaid) {
                       AppsFlyer.getInstance().uploadAdInfoToServer(context,gaid, finalEcpm, model, adPlatform);
                   }
               });

           }

           @Override
           public void onInterstitialAdVideoEnd(TUAdInfo atAdInfo) {}

           @Override
           public void onInterstitialAdVideoError(AdError adError) {
               gameResume();
               Log.d(Tag,"播放插屏视频广告错误");
           }

           @Override
           public void onInterstitialAdClose(TUAdInfo atAdInfo) {
               gameResume();
               Log.d(Tag,"播放插屏视频广告关闭");
           }

           @Override
           public void onInterstitialAdClicked(TUAdInfo atAdInfo) {}
       });
       mInterstitialAd.load();
   }



   public void showInterstitialAd(final String scenario) {
       Log.d(Tag,"showInterstitial: " + interstitialId + ", scenario: " + scenario);
       AppsFlyer.getInstance().sendAdClickedEvent(AppsFlyer.getCurrentAdPlacement(),AppsFlyer.getCurrentAdType());
//        AppsFlyer.getInstance().reportAdRevenue(0.0008,"USD");
       if (mInterstitialAd.isAdReady()) {

           TUShowConfig showConfig = new TUShowConfig.Builder()
                   .scenarioId("your scenario id")
                   .build();
           mInterstitialAd.show(mActivity,showConfig);
       } else {
           mInterstitialAd.load();
       }

   }



    //激励视频广告
   TURewardVideoAd mRewardVideoAd;
   private void initVideo() {
       Log.d(Tag,"初始化广告");

       mRewardVideoAd = new TURewardVideoAd(mActivity, videoId);

       //设置广告监听
       mRewardVideoAd.setAdListener(new TURewardVideoListener() {
           @Override
           public void onRewardedVideoAdLoaded() {
           }

           @Override
           public void onRewardedVideoAdFailed(AdError adError) {
               //注意：禁止在此回调中执行广告的加载方法进行重试，否则会引起很多无用请求且可能会导致应用卡顿
               jbw.dispatchEventToScript("getRewardVideoFail","0");
               Log.d(Tag,"激励视频广告加载失败err"+adError.toString());
           }

           @Override
           public void onRewardedVideoAdPlayStart(TUAdInfo adInfo) {
               //建议在此回调中调用load进行广告的加载，方便下一次广告的展示（不需要调用isAdReady()）
               Log.d(Tag,"开始播放视频广告");
               mRewardVideoAd.load();
               gamePause();
           }

           @Override
           public void onRewardedVideoAdPlayEnd(TUAdInfo atAdInfo) {

           }

           @Override
           public void onRewardedVideoAdPlayFailed(AdError adError, TUAdInfo atAdInfo) {
               gameResume();
               jbw.dispatchEventToScript("getRewardVideoFail","1");

           }

           @Override
           public void onRewardedVideoAdClosed(TUAdInfo atAdInfo) {
               gameResume();
           }

           @Override
           public void onReward(TUAdInfo adInfo) {
               //建议在此回调中下发奖励
               gameResume();
               Log.d(Tag,"广告已经获得奖励了");
               jbw.dispatchEventToScript("getRewardVideo");
               //上报用户收入
               double ecpm = adInfo.getEcpm()/1000.0;

               String adPlatform = adInfo.getPlacementId();



               // 上报广告收益（单位为美元）
               AppsFlyer.getInstance().sendEventAd(adPlatform, "reward", ecpm);


               String placement =  AppsFlyer.getInstance().getCurrentAdPlacement();
               String adType =  AppsFlyer.getInstance().getCurrentAdType();

               // 上报广告展示事件
               AppsFlyer.getInstance().sendAdShownEvent(placement, adType);

//                AppsFlyer.getInstance().sendEventAd(maxAd.getNetworkName(),maxAd.getFormat().getLabel(),maxAd.getRevenue());

               AppsFlyer.getInstance().recordAdRevenue( ecpm);
               AppsFlyer.getInstance().reportAdRevenue(adInfo.getEcpm(),adInfo.getCurrency());

               // 高价值用户数据上传
               // 声明 final 变量，供匿名内部类使用
               final double finalEcpm = ecpm;
               String model = Build.MODEL;

               GAIDHelper.fetchGAID(context, new GAIDHelper.GAIDCallback() {
                   @Override
                   public void onGAIDAvailable(String gaid) {
                       AppsFlyer.getInstance().uploadAdInfoToServer(context,gaid, finalEcpm, model, adPlatform);
                   }
               });
           }


           @Override
           public void onRewardedVideoAdPlayClicked(TUAdInfo atAdInfo) {
           }
       });

       mRewardVideoAd.load();
   }


   public void showVideoAd(final String scenario) {
//        Log.d(Tag,"显示广告");
       AppsFlyer.getInstance().sendAdClickedEvent(AppsFlyer.getCurrentAdPlacement(),AppsFlyer.getCurrentAdType());
//        AppsFlyer.getInstance().reportAdRevenue(0.0008,"USD");
       if (mRewardVideoAd.isAdReady()) {

           TUShowConfig showConfig = new TUShowConfig.Builder()
                   .scenarioId(scenario)
                   .build();
           mRewardVideoAd.show(mActivity, showConfig);
       } else {
           mRewardVideoAd.load();
           jbw.dispatchEventToScript("getRewardVideoFail","2");
           Log.d(Tag,"激励视频广告未ready");
       }
   }



    /**游戏暂停*/
    void gamePause(){
        jbw.dispatchEventToScript("gamePause");
    }
    /**游戏恢复*/
    void gameResume(){
        jbw.dispatchEventToScript("gameResume");
    }
}
