# react-native-folding-feature
![npm](https://img.shields.io/npm/dm/react-native-folding-feature)


Gather android folding feature information
https://developer.android.com/reference/kotlin/androidx/window/layout/FoldingFeature

## Installation

```sh
npm install react-native-folding-feature
```

## Usage

Android set screen orientation at AndroidManifest.xml

```
android:screenOrientation="fullSensor"
```


### Warp App component with FoldingFeatureProvider
```tsx
import { FoldingFeatureProvider } from 'react-native-folding-feature';

...
<FoldingFeatureProvider option={options}>
  ... app component ...
</FoldingFeatureProvider>
...

```


### Options
| Prop | Type | Default | Description |
| ---- | ---- | --------| ----------- |
| closeAngle | number | 20 | Specifies the angle for close pose





### Get the folding feature information

```js
import { useFoldingFeature } from 'react-native-folding-feature';

...
const { layoutInfo, isTableTop, isBook } = useFoldingFeature();
...
```

### useFoldingFeature Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
|layoutInfo | LayoutInfo | |Folding Feature from [android doc](https://developer.android.com/reference/kotlin/androidx/window/layout/FoldingFeature) |
| hingeAngle | number | 180 |(range 0 - 180) acquire from [SensorManager](https://developer.android.com/reference/android/hardware/Sensor#TYPE_HINGE_ANGLE) |
| isTableTop | boolean | false | HALF_OPENED & HORIZONTAL |
| isBook | boolean | false| HALF_OPENED & VERTICAL  |
| isFlat | boolean | true | |
| isClosed | boolean | false | hingeAngle < closeAngle (default 20)|


## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
