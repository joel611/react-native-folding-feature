@objc(FoldingFeature)
class FoldingFeature: RCTEventEmitter {

  @objc(initialise)
  func initialise() -> Void {
    // do nothing in ios
  }

  var hasEventListeners = false
  override func startObserving() {
    hasEventListeners = true
  }
  override func stopObserving() {
    hasEventListeners = false
  }

  override func supportedEvents() -> [String]! {
    return ["FoldingFeatureLayoutChanged", "FoldingFeatureHingeAngleChanged"]
  }
}
