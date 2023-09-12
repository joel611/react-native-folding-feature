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

example: android:screenOrientation="fullSensor"


### warp App component with FoldingFeatureProvider
```tsx
import { FoldingFeatureProvider } from 'react-native-folding-feature';

...
<FoldingFeatureProvider>
  ... app component ...
</FoldingFeatureProvider>
...

```

### Get the folding feature information

```js
import { useFoldingFeature } from 'react-native-folding-feature';

...
const { layoutInfo, isTableTop, isBook } = useFoldingFeature();
...
```


## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
