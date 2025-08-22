import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

// Network status types
export interface NetworkState {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
  type: string | null;
  isWifi: boolean;
  isCellular: boolean;
  isEthernet: boolean;
  isVpn: boolean;
  isUnknown: boolean;
}

// Network status hook
export const useNetworkStatus = () => {
  const [networkState, setNetworkState] = useState<NetworkState>({
    isConnected: null,
    isInternetReachable: null,
    type: null,
    isWifi: false,
    isCellular: false,
    isEthernet: false,
    isVpn: false,
    isUnknown: false,
  });

  useEffect(() => {
    // Get initial network state
    const getInitialState = async () => {
      const state = await NetInfo.fetch();
      updateNetworkState(state);
    };

    getInitialState();

    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener(updateNetworkState);

    return () => {
      unsubscribe();
    };
  }, []);

  const updateNetworkState = (state: any) => {
    setNetworkState({
      isConnected: state.isConnected,
      isInternetReachable: state.isInternetReachable,
      type: state.type,
      isWifi: state.type === 'wifi',
      isCellular: state.type === 'cellular',
      isEthernet: state.type === 'ethernet',
      isVpn: state.type === 'vpn',
      isUnknown: state.type === 'unknown',
    });
  };

  return networkState;
};

// Network utility functions
export const networkUtils = {
  /**
   * Check if device is connected to internet
   */
  async isConnected(): Promise<boolean> {
    const state = await NetInfo.fetch();
    return state.isConnected === true && state.isInternetReachable === true;
  },

  /**
   * Get current network type
   */
  async getNetworkType(): Promise<string | null> {
    const state = await NetInfo.fetch();
    return state.type;
  },

  /**
   * Check if connected to WiFi
   */
  async isWifi(): Promise<boolean> {
    const state = await NetInfo.fetch();
    return state.type === 'wifi';
  },

  /**
   * Check if connected to cellular
   */
  async isCellular(): Promise<boolean> {
    const state = await NetInfo.fetch();
    return state.type === 'cellular';
  },

  /**
   * Get detailed network information
   */
  async getNetworkDetails() {
    const state = await NetInfo.fetch();
    return {
      isConnected: state.isConnected,
      isInternetReachable: state.isInternetReachable,
      type: state.type,
      isWifi: state.type === 'wifi',
      isCellular: state.type === 'cellular',
      isEthernet: state.type === 'ethernet',
      isVpn: state.type === 'vpn',
      isUnknown: state.type === 'unknown',
      details: state.details,
    };
  },

  /**
   * Wait for network connection
   */
  async waitForConnection(timeout: number = 30000): Promise<boolean> {
    return new Promise((resolve) => {
      const startTime = Date.now();
      
      const checkConnection = async () => {
        if (await this.isConnected()) {
          resolve(true);
          return;
        }

        if (Date.now() - startTime > timeout) {
          resolve(false);
          return;
        }

        setTimeout(checkConnection, 1000);
      };

      checkConnection();
    });
  },
};

// Network status constants
export const NETWORK_TYPES = {
  WIFI: 'wifi',
  CELLULAR: 'cellular',
  ETHERNET: 'ethernet',
  VPN: 'vpn',
  UNKNOWN: 'unknown',
  NONE: 'none',
} as const;

export const NETWORK_STATUS = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  CONNECTING: 'connecting',
  UNKNOWN: 'unknown',
} as const;

export default networkUtils;
