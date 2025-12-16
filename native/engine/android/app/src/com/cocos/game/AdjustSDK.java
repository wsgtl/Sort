package com.cocos.game;


import static android.content.Context.MODE_PRIVATE;

import android.app.Activity;
import android.app.Application;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.webkit.JavascriptInterface;

import com.adjust.sdk.Adjust;
import com.adjust.sdk.AdjustAdRevenue;
import com.adjust.sdk.AdjustConfig;
import com.adjust.sdk.AdjustEvent;
import com.adjust.sdk.LogLevel;
import com.cocos.lib.JsbBridgeWrapper;

import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

public class AdjustSDK {

    private static String Tag = "adjustEvent";
    private static Application mApplication = null;

    private static final String PREFS_NAME = "adjust_prefs";
    private static final String KEY_FIRST_LAUNCH = "first_launch";
    public static String  AdjustAppToken="cqkstnjys16o";

    /** adjust初始化 */
    public void init(Application application) {
        mApplication = application;
        String appToken = AdjustAppToken;
        String environment = AdjustConfig.ENVIRONMENT_PRODUCTION;
//        environment = AdjustConfig.ENVIRONMENT_SANDBOX;// 或者沙盒模式 AdjustConfig.ENVIRONMENT_SANDBOX
        AdjustConfig config = new AdjustConfig(application, appToken, environment);
        config.setLogLevel(LogLevel.VERBOSE);
        // Attribution 回调
        config.setOnAttributionChangedListener(attribution -> {
            if (attribution != null) {
                Log.d(Tag, "🎯 Attribution changed: " + attribution.toString());
            }
        });
        JsbBridgeWrapper jbw = JsbBridgeWrapper.getInstance();
        jbw.addScriptEventListener("trackLevelEvent",this::trackLevelEvent);
        // 事件/会话回调
        config.setOnEventTrackingSucceededListener(data -> Log.d(Tag, "✅ 事件成功: " + data));
        config.setOnEventTrackingFailedListener(data -> Log.e(Tag, "❌ 事件失败: " + data));
        config.setOnSessionTrackingSucceededListener(data -> Log.d(Tag, "✅ 会话成功: " + data));
        config.setOnSessionTrackingFailedListener(data -> Log.e(Tag, "❌ 会话失败: " + data));

        Adjust.onCreate(config);
        application.registerActivityLifecycleCallbacks(new AdjustLifecycleCallbacks());

        Log.d(Tag, "Adjust init success, token: " + appToken + ", env: " + environment);


        // 首次启动事件
        SharedPreferences prefs = mApplication.getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
        if (prefs.getBoolean(KEY_FIRST_LAUNCH, true)) {
            AdjustEvent firstLaunchEvent = new AdjustEvent("hcbx6g");
            Adjust.trackEvent(firstLaunchEvent);
            Log.d(Tag, "📌 首次启动事件已上报，token = hcbx6g");

            prefs.edit().putBoolean(KEY_FIRST_LAUNCH, false).apply();
        }

        // 启动事件
        AdjustEvent launchEvent = new AdjustEvent("utduti");
        Adjust.trackEvent(launchEvent);
        Log.d(Tag, "📌 启动事件已上报，token = utduti");
    }

//    /** 基础事件上报 */
    private void baseSendEvent(String eventName, Map<String, Object> data) {
        try {
            String eventToken = AdjustEventMapper.getToken(eventName);
            if (eventToken == null) {
                Log.w(Tag, "未找到对应的 Adjust token: " + eventName);
                return;
            }

            AdjustEvent event = new AdjustEvent(eventToken);
            if (data != null) {
                for (Map.Entry<String, Object> entry : data.entrySet()) {
                    event.addCallbackParameter(entry.getKey(), entry.getValue().toString());
                }
            }
            Adjust.trackEvent(event);

            Log.d(Tag, "Adjust event sent: " + eventName + " => " + eventToken + " data: " + data);

        } catch (Exception e) {
            Log.e(Tag, "Adjust send event failed: " + e.toString());
        }
    }
    private static final class AdjustLifecycleCallbacks implements Application.ActivityLifecycleCallbacks {
        @Override
        public void onActivityCreated(Activity activity, Bundle bundle) {

        }

        @Override
        public void onActivityStarted(Activity activity) {
        }

        @Override
        public void onActivityResumed(Activity activity) {
            Adjust.onResume();
        }

        @Override
        public void onActivityPaused(Activity activity) {
            Adjust.onPause();
        }

        @Override
        public void onActivityStopped(Activity activity) {
        }

        @Override
        public void onActivitySaveInstanceState(Activity activity, Bundle bundle) {
        }

        @Override
        public void onActivityDestroyed(Activity activity) {
        }
    }

    @JavascriptInterface
    public void loglog(String data){
        Log.d(Tag, "adjustLogEvent data:"+data);
        String eventType = "i4qbzx";
        AdjustEvent adjustEvent = new AdjustEvent(eventType);
        Adjust.trackEvent(adjustEvent);
    }

    /** JSON埋点上报（保持AppsFlyer接口一致）*/
    public void sendEvent(String data) {
//        try {
//            Map<String, Object> m_data = new HashMap<>();
//            String eventType = "";
//            org.json.JSONObject json = new org.json.JSONObject(data);
//            Iterator it = json.keys();
//            while (it.hasNext()) {
//                String key = it.next().toString();
//                Object value = json.get(key);
//                if (key.equals("event_type")) {
//                    eventType = value.toString();
//                } else {
//                    m_data.put(key, value);
//                }
//            }
//            if (!eventType.equals("")) {
//                // ⚠️ 注意：Adjust 需要在后台获取到对应 eventType 的 eventToken
//                String eventToken = Const.getAdjustToken(eventType);
//                baseSendEvent(eventToken, m_data);
//            }
//        } catch (Exception e) {
//            Log.e(Tag, "sendEvent parse failed: " + e.toString());
//        }
    }

    /** 广告收入上报 */
    public void sendEventAd(String network, String format, Double revenue) {
        try {
            Log.d(Tag, "ad_network_name:" + network + " ad_format:" + format + " revenue:" + revenue);

            AdjustAdRevenue adRevenue = new AdjustAdRevenue("applovin_max_sdk");
            adRevenue.setRevenue(revenue, "USD");
            adRevenue.addCallbackParameter("ad_network_name", network);
            adRevenue.addCallbackParameter("ad_format", format);

            Adjust.trackAdRevenue(adRevenue);

        } catch (Exception e) {
            Log.e(Tag, "Adjust ad revenue report failed: " + e.toString());
        }
    }



        // 在AppsFlyer类里新增方法，保存当前placement，给上报用
    private static String currentAdPlacement = "unknown";
    private static String currentAdType = "unknown";
    public static void setCurrentAdInfo(String placement, String adType) {
        currentAdPlacement = placement;
        currentAdType = adType;
    }

    public static String getCurrentAdPlacement() {
        return currentAdPlacement;
    }
    public static String getCurrentAdType() {
        return currentAdType;
    }
    /** 广告请求埋点 */
    public void sendAdRequestedEvent(String placement, String adType) {
//        Log.d(Tag, "上报广告请求事件: placement=" + placement + ", ad_type=" + adType);
//        Map<String, Object> data = new HashMap<>();
//        data.put("placement", placement);
//        data.put("ad_type", adType);
//        this.baseSendEvent("ad_requested", data);
    }

    /** 广告展示埋点 */
    public void sendAdShownEvent(String placement, String adType) {
//        Log.d(Tag, "上报广告展示事件: placement=" + placement + ", ad_type=" + adType);
//        Map<String, Object> data = new HashMap<>();
//        data.put("placement", placement);
//        data.put("ad_type", adType);
//        this.baseSendEvent("ad_shown", data);
    }

    /** 广告点击埋点 */
    public void sendAdClickedEvent(String placement, String adType) {
//        Log.d(Tag, "上报广告点击事件: placement=" + placement + ", ad_type=" + adType);
//        Map<String, Object> data = new HashMap<>();
//        data.put("placement", placement);
//        data.put("ad_type", adType);
//        this.baseSendEvent("ad_clicked", data);
    }

    /** cocos 调用接口：根据事件名上报 */
    public static void trackEventFromCocos(String eventName) {
        try {
            String token = AdjustEventMapper.getToken(eventName);
            if (token == null) {
                Log.w(Tag, "未找到事件映射: " + eventName);
                return;
            }

            AdjustEvent event = new AdjustEvent(token);
            Adjust.trackEvent(event);

            Log.d(Tag, "Adjust 上报事件: " + eventName + " => " + token);
        } catch (Exception e) {
            Log.e(Tag, "trackEventFromUnity 出错: " + e.toString());
        }
    }

    // 广告曝光里程碑处理
    private static final String PREFS_AD_COUNT = "ad_impression_count";
    /**
     * 每次广告曝光调用
     */
    public void handleAdImpression() {
        if (mApplication == null) {
            Log.w(Tag, "AdjustSDK 未初始化，无法处理广告曝光");
            return;
        }

        SharedPreferences prefs = mApplication.getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
        int currentCount = prefs.getInt(PREFS_AD_COUNT, 0); // 获取当前曝光次数
        currentCount++; // 本次曝光次数加1
        prefs.edit().putInt(PREFS_AD_COUNT, currentCount).apply(); // 保存最新次数

        Log.d(Tag, "广告曝光次数: " + currentCount);

        // 广告曝光里程碑事件
        if (isAdMilestone(currentCount)) {
            String eventName = "revvideo_" + currentCount;
            trackEventFromCocos(eventName); // 上报 Adjust
            Log.d(Tag, "广告曝光里程碑上报 Adjust 事件: " + eventName);
        }
    }

    /**
     * 判断当前曝光次数是否达到里程碑
     */
    private static boolean isAdMilestone(int count) {
        String eventName = "revvideo_" + count;
        String token = AdjustEventMapper.getToken(eventName);
        return token != null;
    }

    // ===================== 新增关卡上报 =====================
    private static final String PREFS_LEVEL_KEY = "level_reported_";

    /**
     * 调用上报关卡事件
     * @param levelId 当前关卡ID
     */
    public void trackLevelEvent(String levelId) {
        if (mApplication == null) {
            Log.w(Tag, "AdjustSDK 未初始化，无法处理关卡上报");
            return;
        }
        // SharedPreferences 记录每个关卡是否已上报过，避免重复上报
        SharedPreferences prefs = mApplication.getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
        String levelKey = PREFS_LEVEL_KEY + levelId;
        boolean reported = prefs.getBoolean(levelKey, false);
        if (reported) {
            Log.d(Tag, "关卡 " + levelId + " 已上报过，跳过");
            return;
        }

        // 在 AdjustEventMapper 中查找对应事件
        String eventName = "Level_0" +  levelId;
        String token = AdjustEventMapper.getToken(eventName);
        if (token == null) {
            Log.w(Tag, "未找到关卡事件映射: " + eventName);
            return;
        }
        // 构造 AdjustEvent 并上报
        AdjustEvent event = new AdjustEvent(token);
        Adjust.trackEvent(event);

        Log.d(Tag, "Adjust 上报关卡事件: " + eventName + " => " + token);

        // 标记该关卡已上报
        prefs.edit().putBoolean(levelKey, true).apply();
    }


    // ================== 下面的持久化、uploadAdInfoToServer 等逻辑保持不变 ==================
    // 只需把 baseSendEvent 改成调用 Adjust 即可
    // ==================
    //    高价值用户数据上传
    private  String baseUrl ="http://click.dreamad.mobi/sdk/data";

    public void uploadAdInfoToServer(Context context, String gaid, double ecpm, String model, String adPlatform) {
        new Thread(() -> {
            try {
                // 获取包名和版本号
                String packageName = context.getPackageName();
                String versionName = context.getPackageManager()
                        .getPackageInfo(packageName, 0).versionName;
                String fullUrl = baseUrl
                        + "?gaid=" + URLEncoder.encode(gaid, "UTF-8")
                        + "&packageName=" + URLEncoder.encode(packageName, "UTF-8")
                        + "&version=" + URLEncoder.encode(versionName, "UTF-8")
                        + "&ecpm=" + ecpm
                        + "&model=" + URLEncoder.encode(model, "UTF-8")
                        + "&adPlatform=" + URLEncoder.encode(adPlatform, "UTF-8");

                Log.d(Tag, "上传广告信息请求: " + fullUrl);

                URL url = new URL(fullUrl);
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("GET");
                conn.setConnectTimeout(5000);
                conn.setReadTimeout(5000);

                int code = conn.getResponseCode();
                Log.d(Tag, "广告数据上传响应码: " + code);
            } catch (Exception e) {
                Log.e(Tag, "上传广告信息失败: " + e.toString());
            }
        }).start();
    }
    static AdjustSDK mInstace = null;
    public static AdjustSDK getInstance() {
        if (null == mInstace) {
            mInstace = new AdjustSDK();
        }
        return mInstace;
    }
}
