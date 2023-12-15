import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
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
  hingeAngle: number;
  isTableTop: boolean;
  isBook: boolean;
  isFlat: boolean;
  isClosed: boolean;
};

export const FoldingFeatureContext = createContext<FoldingFeatureContextProps>({
  layoutInfo: {
    state: FoldingFeatureState.FLAT,
    occlusionType: FoldingFeatureOcclusionType.NONE,
    orientation: FoldingFeatureOrientation.VERTICAL,
    isSeparating: false,
  },
  hingeAngle: 180,
  // helper state
  isTableTop: false,
  isBook: false,
  isFlat: true,
  isClosed: false,
});

export const useFoldingFeature = () => {
  const context = useContext(FoldingFeatureContext);

  if (context === undefined) {
    throw new Error('useFoldingFeature was used outside of its provider');
  }

  return context;
};

export const FoldingFeatureProvider = ({
  option,
  children,
}: PropsWithChildren<{ option?: ProviderProps }>) => {
  const value = useProvideFunc(option);

  return (
    <FoldingFeatureContext.Provider value={value}>
      {children}
    </FoldingFeatureContext.Provider>
  );
};

type ProviderProps = {
  closeAngle: number;
};

const useProvideFunc = (option?: ProviderProps): FoldingFeatureContextProps => {
  const [layoutInfo, setLayoutInfo] = useState<LayoutInfo>({
    state: FoldingFeatureState.FLAT,
    occlusionType: FoldingFeatureOcclusionType.NONE,
    orientation: FoldingFeatureOrientation.VERTICAL,
    isSeparating: false,
  });
  const [hingeAngle, setHingeAngle] = useState<number>(180);

  const updateLayoutInfo = (event: LayoutInfo) => {
    setLayoutInfo(event);
  };

  const isClosed = useMemo(() => {
    return hingeAngle <= (option?.closeAngle ?? 20);
  }, [hingeAngle, option]);

  const isTableTop = useMemo(() => {
    return (
      !isClosed &&
      layoutInfo.state === FoldingFeatureState.HALF_OPENED &&
      layoutInfo.orientation === FoldingFeatureOrientation.HORIZONTAL
    );
  }, [layoutInfo, isClosed]);

  const isBook = useMemo(() => {
    return (
      !isClosed &&
      layoutInfo.state === FoldingFeatureState.HALF_OPENED &&
      layoutInfo.orientation === FoldingFeatureOrientation.VERTICAL
    );
  }, [layoutInfo, isClosed]);

  const isFlat = useMemo(() => {
    return !isClosed && !(isTableTop || isBook);
  }, [isTableTop, isBook, isClosed]);

  useEffect(() => {
    FoldingFeature.initialise();

    const eventEmitter = new NativeEventEmitter(NativeModules.FoldingFeature);
    const layoutSubscription = eventEmitter.addListener(
      'FoldingFeatureLayoutChanged',
      (event) => {
        console.debug('[FoldingFeature] LayoutChanged', event);
        updateLayoutInfo(event);
      }
    );
    const hingeAngleSubscription = eventEmitter.addListener(
      'FoldingFeatureHingeAngleChanged',
      (event) => {
        console.debug('[FoldingFeature] HingeAngleChanged', event);
        setHingeAngle(event.hingeAngle);
      }
    );

    return () => {
      layoutSubscription.remove();
      hingeAngleSubscription.remove();
    };
  }, []);

  return {
    layoutInfo,
    hingeAngle,
    isTableTop,
    isBook,
    isFlat,
    isClosed,
  };
};
