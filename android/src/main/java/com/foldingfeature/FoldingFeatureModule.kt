package com.foldingfeature

import android.content.Context.SENSOR_SERVICE
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;

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
import com.facebook.react.bridge.LifecycleEventListener

class FoldingFeatureModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return NAME
  }
  private val logTag:String = "FoldingFeatureModule"
  private val sensorManager by lazy { reactApplicationContext.getSystemService(SENSOR_SERVICE) as SensorManager }
  private val hingeAngleSensor: Sensor? by lazy { sensorManager.getDefaultSensor(Sensor.TYPE_HINGE_ANGLE)}

  private val sensorEventListener = object: SensorEventListener {
    override fun onSensorChanged(event: SensorEvent) {
      val params = Arguments.createMap().apply {
        putDouble("hingeAngle", event.values[0].toDouble())
      }
      sendEvent("FoldingFeatureHingeAngleChanged", params)
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {

    }
  }

  private val lifecycleEventListener = object: LifecycleEventListener{
    override fun onHostResume() {
      hingeAngleSensor?.let{
        sensorManager.registerListener(sensorEventListener, it, SensorManager.SENSOR_DELAY_UI)
      }
    }

    override fun onHostPause() {
      hingeAngleSensor?.let{
        sensorManager.unregisterListener(sensorEventListener, it)
      }
    }

    override fun onHostDestroy() {
    }
  }

  init{
    run{
      if(android.os.Build.VERSION.SDK_INT < 30) {
        return@run
      }

      reactContext.addLifecycleEventListener(lifecycleEventListener)
    }
  }

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



  private fun onWindowLayoutInfoChange(){
    getCurrentActivityOrResolveWithError()?.let { activity ->
      activity.lifecycleScope.launch {
        Log.d(logTag, "start")
        activity.lifecycle.repeatOnLifecycle(Lifecycle.State.STARTED) {
          val wit = WindowInfoTracker.getOrCreate(activity)
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

  private fun getCurrentActivityOrResolveWithError(): FragmentActivity? {
    (currentActivity as? FragmentActivity)?.let {
      return it
    }
    return null
  }

  companion object {
    const val NAME = "FoldingFeature"
  }
}
