# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in E:\developSoftware\Android\SDK/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

# Proguard Cocos2d-x-lite for release
-keep public class com.cocos.** { *; }
-dontwarn com.cocos.**

# Proguard Apache HTTP for release
-keep class org.apache.http.** { *; }
-dontwarn org.apache.http.**

# Proguard okhttp for release
-keep class okhttp3.** { *; }
-dontwarn okhttp3.**

-keep class okio.** { *; }
-dontwarn okio.**

# Proguard Android Webivew for release. you can comment if you are not using a webview
-keep public class android.net.http.SslError
-keep public class android.webkit.WebViewClient

-keep public class com.google.** { *; }

-dontwarn android.webkit.WebView
-dontwarn android.net.http.SslError
-dontwarn android.webkit.WebViewClient

# This is generated automatically by the Android Gradle plugin.
-dontwarn android.hardware.BatteryState
-dontwarn android.hardware.lights.Light
-dontwarn android.hardware.lights.LightState$Builder
-dontwarn android.hardware.lights.LightState
-dontwarn android.hardware.lights.LightsManager$LightsSession
-dontwarn android.hardware.lights.LightsManager
-dontwarn android.hardware.lights.LightsRequest$Builder
-dontwarn android.hardware.lights.LightsRequest
-dontwarn android.net.ssl.SSLSockets
-dontwarn android.os.VibratorManager










#h5 sdk混淆
#-keep public class com.gift.match.MatchGiftSDK {
#    public static com.gift.match.MatchGiftSDK Build();
#    public void onPageStart(android.app.Activity);
#    public void onPageDestroy(android.app.Activity);
#    public void createSDK(android.content.Context);
#    public void isFrontDesk(boolean);
#    public void onDestroy();
#}
#
#-keep class com.gift.match.work.** {*;}
#-keep class com.gift.match.listener.** {*;}
#-keep class retrofit2.** {*;}
#-keep class com.google.gson.** {*;}
#-keep class com.google.gson.reflect.TypeToken{*;}
#-keep class * extends com.google.gson.reflect.TypeToken
#-keepattributes Signature
#-keepattributes Exceptions
#
## 保护WebView相关类
#-keep class android.webkit.** { *; }
#-dontwarn android.webkit.**
#
## 保护SSL相关类
#-keep class javax.net.ssl.** { *; }
#-keep class java.security.** { *; }
#
## 保护异常信息但混淆类名
#-keepattributes Exceptions,InnerClasses,Signature,Deprecated,*Annotation*,EnclosingMethod
#
## 保护反射调用的类和方法
#-keepattributes Signature
#-keepattributes *Annotation*
#
## 保护Serializable类
#-keepclassmembers class * implements java.io.Serializable {
#    static final long serialVersionUID;
#    private static final java.io.ObjectStreamField[] serialPersistentFields;
#    !static !transient <fields>;
#    private void writeObject(java.io.ObjectOutputStream);
#    private void readObject(java.io.ObjectInputStream);
#    java.lang.Object writeReplace();
#    java.lang.Object readResolve();
#}