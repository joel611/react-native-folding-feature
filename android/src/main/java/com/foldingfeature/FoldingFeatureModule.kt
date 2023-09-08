package com.foldingfeature

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments
import com.facebook.react.modules.core.DeviceEventManagerModule

import androidx.fragment.app.FragmentActivity
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.lifecycleScope
import androidx.lifecycle.repeatOnLifecycle
import androidx.window.layout.FoldingFeature
import kotlinx.coroutines.launch

import androidx.window.layout.WindowInfoTracker

import android.util.Log

class FoldingFeatureModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return NAME
  }
  private val logTag:String = "FoldingFeatureModule"

  @ReactMethod
  fun initialise(){
      Log.d(logTag, "initialise")
      onWindowLayoutInfoChange();
  }

  @ReactMethod
  fun addListener(type: String?) {
  }

  @ReactMethod
  fun removeListeners(type: Int?) {
  }

  init{
      Log.d(logTag, "init")
      onWindowLayoutInfoChange();
  }

  private fun onWindowLayoutInfoChange(){
    getCurrentActivityOrResolveWithError(null)?.let { activity ->
      activity.lifecycleScope.launch {
        Log.d(logTag, "start")
        activity.lifecycle.repeatOnLifecycle(Lifecycle.State.STARTED) {
          WindowInfoTracker.getOrCreate(activity)
            .windowLayoutInfo(activity)
            .collect {layoutInfo ->
              if(layoutInfo.displayFeatures.isEmpty()) return@collect

              val foldingFeature = layoutInfo.displayFeatures.filterIsInstance<FoldingFeature>()
                    .firstOrNull()

              foldingFeature ?: return@collect

              Log.d(logTag, foldingFeature.state.toString())

              val params = Arguments.createMap().apply {
                putString("state", foldingFeature.state.toString())
                putString("occlusionType", foldingFeature.occlusionType.toString())
                putString("orientation", foldingFeature.orientation.toString())
                putBoolean("isSeparating", foldingFeature.isSeparating)

                putMap("bounds", Arguments.createMap().apply{
                  putInt("top", foldingFeature.bounds.top)
                  putInt("bottom", foldingFeature.bounds.bottom)
                  putInt("left", foldingFeature.bounds.left)
                  putInt("right", foldingFeature.bounds.right)
                })
              }
              sendEvent("FoldingFeatureLayoutChanged", params);
            }
        }
      }
    }
  }

  private fun sendEvent(eventName: String, params: WritableMap?) {
    this.reactApplicationContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit(eventName, params)
  }

  private fun getCurrentActivityOrResolveWithError(promise: Promise?): FragmentActivity? {
    (currentActivity as? FragmentActivity)?.let {
      return it
    }
    promise?.resolve(createMissingActivityError())
    return null
  }

  private fun createMissingActivityError(){

  }

  companion object {
    const val NAME = "FoldingFeature"
  }
}
