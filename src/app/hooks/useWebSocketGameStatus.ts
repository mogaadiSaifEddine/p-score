// hooks/useWebSocketGameStatus.ts
// React hook for WebSocket game status updates

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  webSocketGameService, 
  ParsedGameStatus, 
  GameStatusUpdateCallback 
} from '../lib/websocket-game-service';

export interface UseWebSocketGameStatusOptions {
  gameInstanceId: string;
  autoConnect?: boolean;
  onStatusUpdate?: (status: ParsedGameStatus) => void;
  onConnectionChange?: (connected: boolean) => void;
}

export interface UseWebSocketGameStatusReturn {
  // Connection state
  isConnected: boolean;
  isConnecting: boolean;
  connectionError: string | null;
  
  // Latest game status
  gameStatus: ParsedGameStatus | null;
  lastUpdated: Date | null;
  
  // Actions
  connect: () => Promise<void>;
  disconnect: () => void;
  
  // Team helpers
  getTeamInfo: (teamId: number) => ParsedGameStatus['teams_info'][0] | null;
  getAllTeams: () => ParsedGameStatus['teams_info'];
}

export function useWebSocketGameStatus({
  gameInstanceId,
  autoConnect = true,
  onStatusUpdate,
  onConnectionChange
}: UseWebSocketGameStatusOptions): UseWebSocketGameStatusReturn {
  
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [gameStatus, setGameStatus] = useState<ParsedGameStatus | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const connectionCheckInterval = useRef<NodeJS.Timeout | null>(null);

  // Handle game status updates
  const handleStatusUpdate: GameStatusUpdateCallback = useCallback((status: ParsedGameStatus) => {
    setGameStatus(status);
    setLastUpdated(new Date());
    onStatusUpdate?.(status);
  }, [onStatusUpdate]);

  // Connect to WebSocket
  const connect = useCallback(async () => {
    if (isConnecting || isConnected) return;
    
    setIsConnecting(true);
    setConnectionError(null);
    
    try {
      // Subscribe to updates before connecting
      unsubscribeRef.current = webSocketGameService.subscribe(handleStatusUpdate);
      
      await webSocketGameService.connect(gameInstanceId);
      
      setIsConnected(true);
      setConnectionError(null);
      onConnectionChange?.(true);
      
    } catch (error) {
      setConnectionError(error instanceof Error ? error.message : 'Connection failed');
      setIsConnected(false);
      onConnectionChange?.(false);
      
      // Clean up subscription on connection failure
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    } finally {
      setIsConnecting(false);
    }
  }, [gameInstanceId, isConnecting, isConnected, handleStatusUpdate, onConnectionChange]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    webSocketGameService.disconnect();
    
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
    
    setIsConnected(false);
    setIsConnecting(false);
    onConnectionChange?.(false);
  }, [onConnectionChange]);

  // Monitor connection status
  useEffect(() => {
    const checkConnection = () => {
      const actuallyConnected = webSocketGameService.isConnected;
      if (actuallyConnected !== isConnected) {
        setIsConnected(actuallyConnected);
        onConnectionChange?.(actuallyConnected);
      }
    };

    connectionCheckInterval.current = setInterval(checkConnection, 1000);
    
    return () => {
      if (connectionCheckInterval.current) {
        clearInterval(connectionCheckInterval.current);
      }
    };
  }, [isConnected, onConnectionChange]);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect && gameInstanceId && !isConnected && !isConnecting) {
      connect();
    }
  }, [autoConnect, gameInstanceId, isConnected, isConnecting, connect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
      if (connectionCheckInterval.current) {
        clearInterval(connectionCheckInterval.current);
      }
    };
  }, [disconnect]);

  // Helper functions
  const getTeamInfo = useCallback((teamId: number) => {
    if (!gameStatus?.teams_info) return null;
    
    return gameStatus.teams_info.find(team => 
      parseInt(team.id) === teamId
    ) || null;
  }, [gameStatus]);

  const getAllTeams = useCallback(() => {
    return gameStatus?.teams_info || [];
  }, [gameStatus]);

  return {
    // Connection state
    isConnected,
    isConnecting,
    connectionError,
    
    // Game status
    gameStatus,
    lastUpdated,
    
    // Actions
    connect,
    disconnect,
    
    // Helpers
    getTeamInfo,
    getAllTeams
  };
}