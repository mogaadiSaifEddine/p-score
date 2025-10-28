// components/WebSocketDebugInfo.tsx
// Simple debug component to show WebSocket status

'use client';

import React from 'react';

interface WebSocketDebugInfoProps {
  gameInstanceId?: number;
  connected: boolean;
  error: string | null;
  lastUpdate: Date | null;
}

export function WebSocketDebugInfo({ 
  gameInstanceId, 
  connected, 
  error, 
  lastUpdate 
}: WebSocketDebugInfoProps) {
  if (!gameInstanceId) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '6px',
      fontSize: '12px',
      fontFamily: 'monospace',
      zIndex: 9999,
      maxWidth: '250px'
    }}>
      <div>🔌 WebSocket Debug</div>
      <div>Game ID: {gameInstanceId}</div>
      <div>Status: {connected ? '🟢 Connected' : '🔴 Disconnected'}</div>
      {error && <div>Error: {error}</div>}
      {lastUpdate && <div>Last: {lastUpdate.toLocaleTimeString()}</div>}
      <div style={{ fontSize: '10px', opacity: 0.7, marginTop: '4px' }}>
        URL: wss://cms.locatify.com/ws/game/{gameInstanceId}
      </div>
    </div>
  );
}