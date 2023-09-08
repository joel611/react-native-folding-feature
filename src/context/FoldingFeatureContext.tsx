import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { NativeEventEmitter, NativeModules } from 'react-native';

import FoldingFeature from '../FoldingFeature';
import {
  FoldingFeatureOcclusionType,
  FoldingFeatureOrientation,
  FoldingFeatureState,
  type LayoutInfo,
} from '../types';

type FoldingFeatureContextProps = {
  layoutInfo: LayoutInfo;
  isTableTop: boolean;
  isBook: boolean;
  isNormal: boolean;
};

export const FoldingFeatureContext = createContext<FoldingFeatureContextProps>({
  layoutInfo: {
    state: FoldingFeatureState.FLAT,
    occlusionType: FoldingFeatureOcclusionType.NONE,
    orientation: FoldingFeatureOrientation.VERTICAL,
    isSeparating: false,
  },
  // helper state
  isTableTop: false,
  isBook: false,
  isNormal: true,
});

export const useFoldingFeature = () => {
  const context = useContext(FoldingFeatureContext);

  if (context === undefined) {
    throw new Error('useFoldingFeature was used outside of its provider');
  }

  return context;
};

type ProviderProps = {
  children: React.ReactElement | React.ReactElement[];
};

export const FoldingFeatureProvider = ({ children }: ProviderProps) => {
  const value = useProvideFunc();

  return (
    <FoldingFeatureContext.Provider value={value}>
      {children}
    </FoldingFeatureContext.Provider>
  );
};

const useProvideFunc = (): FoldingFeatureContextProps => {
  const [layoutInfo, setLayoutInfo] = useState<LayoutInfo>({
    state: FoldingFeatureState.FLAT,
    occlusionType: FoldingFeatureOcclusionType.NONE,
    orientation: FoldingFeatureOrientation.VERTICAL,
    isSeparating: false,
  });

  const updateLayoutInfo = (event: LayoutInfo) => {
    setLayoutInfo(event);
  };

  const isTableTop = useMemo(() => {
    return (
      layoutInfo.state === FoldingFeatureState.HALF_OPENED &&
      layoutInfo.orientation === FoldingFeatureOrientation.HORIZONTAL
    );
  }, [layoutInfo]);

  const isBook = useMemo(() => {
    return (
      layoutInfo.state === FoldingFeatureState.HALF_OPENED &&
      layoutInfo.orientation === FoldingFeatureOrientation.VERTICAL
    );
  }, [layoutInfo]);

  const isNormal = useMemo(() => {
    return !(isTableTop || isBook);
  }, [isTableTop, isBook]);

  useEffect(() => {
    FoldingFeature.initialise();

    const eventEmitter = new NativeEventEmitter(
      NativeModules.FoldingFeatureLayoutModule
    );
    const subscription = eventEmitter.addListener(
      'FoldingFeatureLayoutChanged',
      (event) => {
        console.debug('[FoldingFeature] LayoutChanged', event);
        updateLayoutInfo(event);
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return {
    layoutInfo,
    isTableTop,
    isBook,
    isNormal,
  };
};
