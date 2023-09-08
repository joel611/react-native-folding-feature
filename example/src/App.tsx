import * as React from 'react';

import { FoldingFeatureProvider } from 'react-native-folding-feature';
import SampleScreen from './SampleScreen';

export default function App() {
  return (
    <FoldingFeatureProvider>
      <SampleScreen />
    </FoldingFeatureProvider>
  );
}
