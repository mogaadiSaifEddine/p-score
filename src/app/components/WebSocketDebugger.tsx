// components/WebSocketDebugger.tsx
// Debug component to test WebSocket connection and message handling

'use client';

import React, { useState, useEffect, useRef } from 'react';

interface WebSocketDebuggerProps {
  gameInstanceId: string;
}

export function WebSocketDebugger({ gameInstanceId }: WebSocketDebuggerProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [messages, setMessages] = useState<Array<{ timestamp: Date; type: string; data: any }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [heartbeatCount, setHeartbeatCount] = useState(0);
  
  const wsRef = useRef<WebSocket | null>(null);
  const heartbeatTimerRef = useRef<NodeJS.Timeout | null>(null);

  const addMessage = (type: string, data: any) => {
    setMessages(prev => [...prev.slice(-19), { // Keep last 20 messages
      timestamp: new Date(),
      type,
      data
    }]);
  };

  const connect = async () => {
    if (isConnecting || isConnected) return;
    
    setIsConnecting(true);
    setError(null);
    setMessages([]);
    
    try {
      const wsUrl = `wss://cms.locatify.com/ws/game/${gameInstanceId}`;
      addMessage('INFO', `Connecting to: ${wsUrl}`);
      
      wsRef.current = new WebSocket(wsUrl);
      
      wsRef.current.onopen = () => {
        addMessage('CONNECTION', 'WebSocket connected successfully');
        setIsConnected(true);
        setIsConnecting(false);
        startHeartbeat();
      };
      
      wsRef.current.onmessage = (event) => {
        addMessage('RECEIVED', event.data);
        
        try {
          const parsed = JSON.parse(event.data);
          addMessage('PARSED', parsed);
          
          if (parsed.event === 'game_status_update') {
            addMessage('GAME_UPDATE', 'Received game status update');
            
            // Try to parse plist data
            try {
              // For now, just log the raw plist data
              addMessage('PLIST_RAW', parsed.data);
            } catch (plistError) {
              addMessage('PLIST_ERROR', plistError);
            }
          }
        } catch (parseError) {
          addMessage('PARSE_ERROR', parseError);
        }
      };
      
      wsRef.current.onclose = (event) => {
        addMessage('CONNECTION', `WebSocket closed: ${event.code} - ${event.reason}`);
        setIsConnected(false);
        setIsConnecting(false);
        stopHeartbeat();
      };
      
      wsRef.current.onerror = (error) => {
        addMessage('ERROR', error);
        setError('WebSocket connection error');
        setIsConnecting(false);
      };
      
    } catch (error) {
      addMessage('ERROR', error);
      setError(error instanceof Error ? error.message : 'Connection failed');
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    stopHeartbeat();
    setIsConnected(false);
    addMessage('INFO', 'Disconnected by user');
  };

  const startHeartbeat = () => {
    stopHeartbeat();
    
    heartbeatTimerRef.current = setInterval(() => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        const heartbeat = {
          type: 'heartbeat',
          timestamp: Date.now()
        };
        
        try {
          wsRef.current.send(JSON.stringify(heartbeat));
          setHeartbeatCount(prev => prev + 1);
          addMessage('HEARTBEAT_SENT', heartbeat);
        } catch (error) {
          addMessage('HEARTBEAT_ERROR', error);
        }
      }
    }, 30000); // 30 seconds
  };

  const stopHeartbeat = () => {
    if (heartbeatTimerRef.current) {
      clearInterval(heartbeatTimerRef.current);
      heartbeatTimerRef.current = null;
    }
  };

  const sendTestMessage = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const testMessage = {
        type: 'test',
        timestamp: Date.now(),
        message: 'Test message from client'
      };
      
      try {
        wsRef.current.send(JSON.stringify(testMessage));
        addMessage('TEST_SENT', testMessage);
      } catch (error) {
        addMessage('TEST_ERROR', error);
      }
    }
  };

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return (
    <div className="websocket-debugger p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">WebSocket Debugger</h3>
      
      {/* Connection Status */}
      <div className="connection-status mb-4 p-3 border rounded bg-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              isConnected ? 'bg-green-500' : 
              isConnecting ? 'bg-yellow-500' : 
              'bg-red-500'
            }`} />
            <span className="font-medium">
              {isConnected ? 'Connected' : 
               isConnecting ? 'Connecting...' : 
               'Disconnected'}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            Heartbeats sent: {heartbeatCount}
          </div>
        </div>
        
        {error && (
          <div className="text-red-600 text-sm mb-2">
            Error: {error}
          </div>
        )}
        
        <div className="flex gap-2">
          <button 
            onClick={connect}
            disabled={isConnected || isConnecting || !gameInstanceId}
            className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50 text-sm"
          >
            Connect
          </button>
          <button 
            onClick={disconnect}
            disabled={!isConnected}
            className="px-3 py-1 bg-red-500 text-white rounded disabled:opacity-50 text-sm"
          >
            Disconnect
          </button>
          <button 
            onClick={sendTestMessage}
            disabled={!isConnected}
            className="px-3 py-1 bg-green-500 text-white rounded disabled:opacity-50 text-sm"
          >
            Send Test
          </button>
        </div>
      </div>

      {/* Connection Info */}
      <div className="connection-info mb-4 p-3 border rounded bg-white">
        <div className="text-sm">
          <div><strong>Game Instance ID:</strong> {gameInstanceId}</div>
          <div><strong>WebSocket URL:</strong> wss://cms.locatify.com/ws/game/{gameInstanceId}</div>
          <div><strong>Messages Received:</strong> {messages.length}</div>
        </div>
      </div>

      {/* Message Log */}
      <div className="message-log">
        <h4 className="font-medium mb-2">Message Log (Last 20)</h4>
        <div className="bg-black text-green-400 p-3 rounded font-mono text-xs h-64 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-gray-500">No messages yet...</div>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className="mb-1">
                <span className="text-gray-400">
                  [{msg.timestamp.toLocaleTimeString()}]
                </span>
                <span className={`ml-2 ${
                  msg.type === 'ERROR' ? 'text-red-400' :
                  msg.type === 'CONNECTION' ? 'text-blue-400' :
                  msg.type === 'RECEIVED' ? 'text-yellow-400' :
                  msg.type === 'GAME_UPDATE' ? 'text-green-400' :
                  'text-white'
                }`}>
                  [{msg.type}]
                </span>
                <span className="ml-2">
                  {typeof msg.data === 'string' ? msg.data : JSON.stringify(msg.data, null, 2)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}