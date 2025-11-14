package com.cocos.game;

import android.app.Activity;
import android.content.Context;
import android.os.Handler;
import android.util.Log;

import androidx.annotation.NonNull;

import com.applovin.mediation.MaxAd;
import com.applovin.mediation.MaxAdListener;
import com.applovin.mediation.MaxError;
import com.applovin.mediation.MaxReward;
import com.applovin.mediation.MaxRewardedAdListener;
import com.applovin.mediation.MaxSegment;
import com.applovin.mediation.MaxSegmentCollection;
import com.applovin.mediation.ads.MaxInterstitialAd;
import com.applovin.mediation.ads.MaxRewardedAd;
import com.applovin.sdk.AppLovinMediationProvider;
import com.applovin.sdk.AppLovinSdk;
import com.applovin.sdk.AppLovinSdkConfiguration;
import com.applovin.sdk.AppLovinSdkInitializationConfiguration;
import com.applovin.sdk.AppLovinSdkSettings;
import com.cocos.lib.JsbBridgeWrapper;

import java.util.Arrays;
import java.util.concurrent.TimeUnit;

public class AdMax {
    private String sdkKey = "cDH3qp_qqeDkvuZITbPw6orrhh3nuTg8aTqoDbCCdgU5b6IJKm93yFGo8ka5sPOCereeKQfl552bBAlCqe8yZB";
    /**激励视频广告id*/
    private String videoId = "87d2c8137a78228d";
    /**插屏广告id*/
    private String interstitialId = "3f34061d94fbce2f";
    private Context _context;
    private Activity _activity;
    private String Tag = "广告";
    public void init(Context context, Activity activity){
        Log.e(Tag,"初始化");
//        AppLovinSdk.getInstance( context ).showMediationDebugger();
        this._context = context;
        this._activity = activity;
        AdMax adMax=this;
// Create the initialization configuration
        AppLovinSdkInitializationConfiguration initConfig = AppLovinSdkInitializationConfiguration.builder( this.sdkKey, context )
                .setMediationProvider( AppLovinMediationProvider.MAX )
                .setSegmentCollection( MaxSegmentCollection.builder()
                        .addSegment( new MaxSegment( 849, Arrays.asList( 1, 3 ) ) )
                        .build() )
                .build();
        AppLovinSdkSettings settings = AppLovinSdk.getInstance( context ).getSettings();
        // Initialize the SDK with the configuration
        AppLovinSdk.getInstance( context ).initialize( initConfig, new AppLovinSdk.SdkInitializationListener()
        {
            @Override
            public void onSdkInitialized(final AppLovinSdkConfiguration sdkConfig)
            {
                // Start loading ads
                Log.e(Tag,"初始化2");
                adMax.createInterstitialAd("");
                adMax.createRewardedAd("");
            }
        } );
        Log.e(Tag,"初始化1");
        this.bindEvent();
    }
    private  void bindEvent(){
        JsbBridgeWrapper jbw = JsbBridgeWrapper.getInstance();

        jbw.addScriptEventListener("loadRewardVideo",this::createRewardedAd);
        jbw.addScriptEventListener("showRewardVideo",this::showRewardAd);

        jbw.addScriptEventListener("loadInterstitial",this::createInterstitialAd);
        jbw.addScriptEventListener("showInterstitial",this::showInterstitialAd);


    }

    //插屏广告
    private MaxInterstitialAd interstitialAd;
    private int retryAttemptInter;
    /**创建加载插屏广告*/
    void createInterstitialAd(String str) {
        Log.e(Tag,"创建插屏广告");
        interstitialAd = new MaxInterstitialAd( this.interstitialId, this._context );


        interstitialAd.setListener(new MaxAdListener() {
               @Override
               public void onAdLoaded(@NonNull MaxAd maxAd) {
                    Log.e(Tag,"开始加载插屏广告");
                   retryAttemptInter=0;
               }

               @Override
               public void onAdDisplayed(@NonNull MaxAd maxAd) {
                   Log.e(Tag,"开始播放插屏广告");
                   gamePause();
                   AppsFlyer.getInstance().sendEventAd(maxAd.getNetworkName(),maxAd.getFormat().getLabel(),maxAd.getRevenue());
               }

               @Override
               public void onAdHidden(@NonNull MaxAd maxAd) {
                   Log.e(Tag,"关闭插屏广告");
                   gameResume();
               }

               @Override
               public void onAdClicked(@NonNull MaxAd maxAd) {

               }

               @Override
               public void onAdLoadFailed(@NonNull String s, @NonNull MaxError maxError) {
                   Log.e(Tag,"错误加载插屏广告");
                   gameResume();

                   retryAttemptInter++;
                   long delayMillis = TimeUnit.SECONDS.toMillis( (long) Math.pow( 2, Math.min( 6, retryAttemptInter ) ) );

                   new Handler().postDelayed( new Runnable()
                   {
                       @Override
                       public void run()
                       {
                           interstitialAd.loadAd();
                       }
                   }, delayMillis );
               }

               @Override
               public void onAdDisplayFailed(@NonNull MaxAd maxAd, @NonNull MaxError maxError) {
                   Log.e(Tag,"显示失败插屏广告");
                   gameResume();
                   interstitialAd.loadAd();
               }
           }

        );
        // Load the first ad
        interstitialAd.loadAd();
    }
    /**显示插屏广告*/
    void showInterstitialAd(String str){
        if ( interstitialAd.isReady() ) {
            // `this` is the activity that will be used to show the ad
            interstitialAd.showAd( this._activity);
        }else{
            interstitialAd.loadAd();
            Log.e(Tag,"未加载成功插屏广告");
        }
    }

    //激励广告
    private MaxRewardedAd rewardedAd;
    private int           retryAttemptReward;
    /**创建加载激励广告*/
    void createRewardedAd(String str) {
        Log.e(Tag,"创建激励广告");
        JsbBridgeWrapper jbw = JsbBridgeWrapper.getInstance();
        rewardedAd = MaxRewardedAd.getInstance( this.videoId, this._context );
        rewardedAd.setListener(new MaxRewardedAdListener() {
            @Override
            public void onUserRewarded(@NonNull MaxAd maxAd, @NonNull MaxReward maxReward) {
                // Rewarded ad was displayed and user should receive the reward
                //建议在此回调中下发奖励
                gameResume();
                Log.e(Tag,"广告已经获得奖励了");
                jbw.dispatchEventToScript("getRewardVideo");
            }

            @Override
            public void onAdLoaded(@NonNull MaxAd maxAd) {
                retryAttemptReward=0;
            }

            @Override
            public void onAdDisplayed(@NonNull MaxAd maxAd) {
                Log.e(Tag,"开始播放视频广告");
                gamePause();
                AppsFlyer.getInstance().sendEventAd(maxAd.getNetworkName(),maxAd.getFormat().getLabel(),maxAd.getRevenue() );
            }

            @Override
            public void onAdHidden(@NonNull MaxAd maxAd) {
                // rewarded ad is hidden. Pre-load the next ad
                rewardedAd.loadAd();
                Log.e(Tag,"关闭视频广告");
                gameResume();
            }

            @Override
            public void onAdClicked(@NonNull MaxAd maxAd) {

            }

            @Override
            public void onAdLoadFailed(@NonNull String s, @NonNull MaxError maxError) {
                Log.e(Tag,"加载失败视频广告");
                jbw.dispatchEventToScript("getRewardVideoFail","0");
                // Rewarded ad failed to load
                // AppLovin recommends that you retry with exponentially higher delays up to a maximum delay (in this case 64 seconds)

                gameResume();
                retryAttemptReward++;
                long delayMillis = TimeUnit.SECONDS.toMillis( (long) Math.pow( 2, Math.min( 6, retryAttemptReward ) ) );

                new Handler().postDelayed(new Runnable()
                {
                    @Override
                    public void run()
                    {
                        rewardedAd.loadAd();
                    }
                }, delayMillis );
            }

            @Override
            public void onAdDisplayFailed(@NonNull MaxAd maxAd, @NonNull MaxError maxError) {
                Log.e(Tag,"显示失败视频广告");
                jbw.dispatchEventToScript("getRewardVideoFail","1");
                rewardedAd.loadAd();

                gameResume();
            }
        });

        rewardedAd.loadAd();
    }
    /**显示激励广告*/
    void showRewardAd(String str){
        JsbBridgeWrapper jbw = JsbBridgeWrapper.getInstance();
        if ( rewardedAd.isReady() ) {
            // `this` is the activity that will be used to show the ad
            rewardedAd.showAd( this._activity );
        }else {
            rewardedAd.loadAd();
            Log.e(Tag,"未加载成功激励广告");
            jbw.dispatchEventToScript("getRewardVideoFail","2");
            gameResume();
        }
    }

    /**游戏暂停*/
    void gamePause(){
        JsbBridgeWrapper jbw = JsbBridgeWrapper.getInstance();
        jbw.dispatchEventToScript("gamePause");
    }
    /**游戏恢复*/
    void gameResume(){
        JsbBridgeWrapper jbw = JsbBridgeWrapper.getInstance();
        jbw.dispatchEventToScript("gameResume");
    }
}
