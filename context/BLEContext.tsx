import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
  Children,
  isValidElement,
  Fragment,
} from 'react';
import { BleManager, Device } from 'react-native-ble-plx';
import { Text } from 'react-native';

type BLEContextType = {
  bleManager: BleManager;
  connectedDevice: Device | null;
  setConnectedDevice: (device: Device | null) => void;
};

const BLEContext = createContext<BLEContextType | undefined>(undefined);

export const BLEProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const bleManager = useMemo(() => new BleManager(), []);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

  const safeChildren = Children.toArray(children).map((child, index) => {
    if (typeof child === 'string' || typeof child === 'number') {
      return <Text key={`wrapped-${index}`}>{child}</Text>;
    }
    return child;
  });

  return (
    <BLEContext.Provider value={{ bleManager, connectedDevice, setConnectedDevice }}>
      {safeChildren}
    </BLEContext.Provider>
  );
};

export const useBLEContext = (): BLEContextType => {
  const context = useContext(BLEContext);
  if (!context) {
    throw new Error('useBLEContext must be used within a BLEProvider');
  }
  return context;
};
