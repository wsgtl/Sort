package com.cocos.game;

import android.app.Activity;
import android.app.Application;
import android.util.Log;

import androidx.annotation.NonNull;

import com.appsflyer.AFInAppEventParameterName;
import com.appsflyer.AppsFlyerLib;
import com.appsflyer.attribution.AppsFlyerRequestListener;
import com.cocos.lib.JsbBridgeWrapper;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class AppsFlyer
{
    private String Tag = "afEvent";
    private Activity mApplication = null;
    /**af的key*/
    private String AfDevKey = "kYVJnzYQqaxjNLmErt4buY";
    /**af初始化*/
    public void init(Activity application){
        mApplication = application;
        Log.d(Tag, "AppsFlyerLib init key:"+AfDevKey);
        AppsFlyerLib.getInstance().init(AfDevKey, null, mApplication);
//        AppsFlyerLib.getInstance().start(this);
        AppsFlyerLib.getInstance().start(mApplication, AfDevKey, new AppsFlyerRequestListener() {
            @Override
            public void onSuccess() {
                Log.d(Tag, "AppsFlyerLib start success");
            }

            @Override
            public void onError(int i, @NonNull String s) {
                Log.d(Tag, "AppsFlyerLib start failed, code: " + i + " msg: " + s);
            }
        });


        JsbBridgeWrapper jbw = JsbBridgeWrapper.getInstance();
        jbw.addScriptEventListener("sendEvent",this::sendEvent);
    }
    /**埋点上报*/
    public void sendEvent(String data) {
        Log.d(Tag, "=====data:" + data);
        Map<String, Object> m_data = new HashMap<String, Object>();
        try {
            JSONObject json = new JSONObject(data);
            Iterator it = json.keys();
            String eventType = "";
            while (it.hasNext()) {
                String key = it.next().toString();
                Object value = json.get(key);
//                Log.d(Tag, "key" + key+"  value"+value);
                if (key.equals("event_type")) {
                    eventType = value.toString();
                } else {
                    m_data.put(key, value);
                }
            }

            if (!eventType.equals("")) {
                Log.d(Tag, "appsflyer事件:" + eventType);
                Log.d(Tag, m_data.toString());
                this.baseSendEvent(eventType,m_data);
            }
        } catch (JSONException e) {
            e.printStackTrace();
            Log.d(Tag,  e.toString());
        }

    }
    private  void baseSendEvent(String eventType,Map<String,Object> data){
        AppsFlyerLib.getInstance().logEvent(mApplication, eventType, data, new AppsFlyerRequestListener() {
            @Override
            public void onSuccess() {
                Log.d(Tag, "Event sent successfully   eventType:"+eventType+"  data:" + data);
            }

            @Override
            public void onError(int i, @NonNull String s) {
                Log.d(Tag, "Event failed to be sent:\n" +
                        "Error code: " + i + "\n"
                        + "Error description: " + s + "    eventType:"+eventType+"  data:" + data);
            }
        });
    }
    /**广告上报*/
    public void sendEventAd(String network,String format, Double revenue){
        Log.e(Tag,"ad_network_name:"+network+"  ad_format:"+format+"  revenue:"+revenue);
        Map<String,Object> data = new HashMap<String, Object>();
        data.put(AFInAppEventParameterName.CURRENCY, "USD");
        data.put(AFInAppEventParameterName.REVENUE, revenue+"");
        data.put("ad_network_name",network);
        data.put("ad_format",format);
        this.baseSendEvent("af_ad_revenue_custom",data);
    }


    static AppsFlyer mInstace = null;
    public static AppsFlyer getInstance() {
        if (null == mInstace) {
            mInstace = new AppsFlyer();
        }
        return mInstace;
    }
}
