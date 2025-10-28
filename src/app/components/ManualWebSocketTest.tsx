// components/ManualWebSocketTest.tsx
// Manual WebSocket test to isolate connection issues

'use client';

import React, { useState, useRef } from 'react';

interface ManualWebSocketTestProps {
  gameInstanceId: string;
}

export function ManualWebSocketTest({ gameInstanceId }: ManualWebSocketTestProps) {
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [messages, setMessages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);

  const addMessage = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setMessages(prev => [...prev.slice(-9), `[${timestamp}] ${message}`]); // Keep last 10 messages
  };

  const connect = () => {
    if (status === 'connecting' || status === 'connected') return;
    
    setStatus('connecting');
    setError(null);
    setMessages([]);
    
    const wsUrl = `wss://cms.locatify.com/ws/game/${gameInstanceId}`;
    addMessage(`Connecting to: ${wsUrl}`);
    
    try {
      wsRef.current = new WebSocket(wsUrl);
      
      wsRef.current.onopen = () => {
        addMessage('✅ WebSocket connected successfully');
        setStatus('connected');
      };
      
      wsRef.current.onmessage = (event) => {
        addMessage(`📨 Received: ${event.data}`);
        
        // Try to parse and log structured data
        try {
          const parsed = JSON.parse(event.data);
          if (parsed.event === 'game_status_update') {
            addMessage('🎮 Game status update received');
          } else if (parsed.type === 'heartbeat') {
            addMessage('💓 Heartbeat received');
          }
        } catch (e) {
          addMessage('📄 Non-JSON message received');
        }
      };
      
      wsRef.current.onclose = (event) => {
        addMessage(`❌ Connection closed: ${event.code} - ${event.reason || 'No reason'}`);
        setStatus('disconnected');
      };
      
      wsRef.current.onerror = (event) => {
        addMessage('🚨 WebSocket error occurred');
        setError('WebSocket connection error');
        setStatus('error');
      };
      
    } catch (err) {
      addMessage(`🚨 Failed to create WebSocket: ${err}`);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setStatus('error');
    }
  };

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    addMessage('🔌 Disconnected by user');
    setStatus('disconnected');
  };

  const sendHeartbeat = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const heartbeat = {
        type: 'heartbeat',
        timestamp: Date.now()
      };
      
      try {
        wsRef.current.send(JSON.stringify(heartbeat));
        addMessage('💓 Heartbeat sent');
      } catch (err) {
        addMessage(`🚨 Failed to send heartbeat: ${err}`);
      }
    } else {
      addMessage('🚨 Cannot send heartbeat - not connected');
    }
  };

  const sendTestMessage = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const testMsg = {
        type: 'test',
        message: 'Hello from client',
        timestamp: Date.now()
      };
      
      try {
        wsRef.current.send(JSON.stringify(testMsg));
        addMessage('🧪 Test message sent');
      } catch (err) {
        addMessage(`🚨 Failed to send test message: ${err}`);
      }
    } else {
      addMessage('🚨 Cannot send test message - not connected');
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected': return 'Connected';
      case 'connecting': return 'Connecting...';
      case 'error': return 'Error';
      default: return 'Disconnected';
    }
  };

  return (
    <div className="manual-websocket-test p-4 border rounded-lg bg-blue-50">
      <h3 className="text-lg font-semibold mb-4">Manual WebSocket Test</h3>
      
      {/* Status */}
      <div className="status mb-4 p-3 border rounded bg-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
            <span className="font-medium">{getStatusText()}</span>
          </div>
          <div className="text-sm text-gray-600">
            Game ID: {gameInstanceId}
          </div>
        </div>
        
        {error && (
          <div className="text-red-600 text-sm mb-2">
            Error: {error}
          </div>
        )}
        
        <div className="flex gap-2 flex-wrap">
          <button 
            onClick={connect}
            disabled={status === 'connected' || status === 'connecting' || !gameInstanceId}
            className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50 text-sm"
          >
            Connect
          </button>
          <button 
            onClick={disconnect}
            disabled={status !== 'connected'}
            className="px-3 py-1 bg-red-500 text-white rounded disabled:opacity-50 text-sm"
          >
            Disconnect
          </button>
          <button 
            onClick={sendHeartbeat}
            disabled={status !== 'connected'}
            className="px-3 py-1 bg-green-500 text-white rounded disabled:opacity-50 text-sm"
          >
            Send Heartbeat
          </button>
          <button 
            onClick={sendTestMessage}
            disabled={status !== 'connected'}
            className="px-3 py-1 bg-purple-500 text-white rounded disabled:opacity-50 text-sm"
          >
            Send Test
          </button>
        </div>
      </div>

      {/* Message Log */}
      <div className="message-log">
        <h4 className="font-medium mb-2">Activity Log</h4>
        <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-xs h-48 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-gray-500">No activity yet...</div>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className="mb-1">
                {msg}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}