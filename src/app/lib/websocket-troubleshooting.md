# WebSocket Troubleshooting Guide

## Common Issues and Solutions

### 1. WebSocket Not Subscribing to API

**Symptoms:**
- WebSocket connects successfully
- No game status updates received
- Console shows "WebSocket: Notifying 0 subscribers"

**Possible Causes:**

#### A. No Subscribers Registered
- Check if `subscribe()` is being called before `connect()`
- Verify the subscription callback is not being removed prematurely

**Debug Steps:**
1. Check browser console for subscription logs:
   ```
   WebSocket: Adding subscriber, total callbacks: 1
   ```

2. Verify connection order in your component:
   ```typescript
   // ✅ Correct order
   const unsubscribe = webSocketGameService.subscribe(callback);
   await webSocketGameService.connect(gameInstanceId);
   
   // ❌ Wrong order
   await webSocketGameService.connect(gameInstanceId);
   const unsubscribe = webSocketGameService.subscribe(callback); // Too late!
   ```

#### B. Server Not Sending Expected Messages
- The server might not be sending `game_status_update` events
- Messages might be in a different format than expected

**Debug Steps:**
1. Use the Manual WebSocket Test component to see raw messages
2. Check if any messages are received at all
3. Verify message format matches expected structure:
   ```json
   {
     "event": "game_status_update",
     "data": "<?xml version=\"1.0\"...plist data..."
   }
   ```

#### C. Game Instance ID Issues
- Invalid or non-existent game instance ID
- Game might not be active or configured for WebSocket updates

**Debug Steps:**
1. Verify the game instance ID is correct
2. Check if the game is currently active
3. Test with a known working game instance ID

#### D. Network/CORS Issues
- WebSocket connection blocked by firewall
- CORS policy preventing connection
- SSL/TLS certificate issues

**Debug Steps:**
1. Check browser network tab for WebSocket connection
2. Look for CORS errors in console
3. Test from different network/device

### 2. Plist Parsing Errors

**Symptoms:**
- WebSocket receives messages but parsing fails
- Console shows "Failed to parse plist data"

**Solutions:**
1. Test plist parsing with the PlistTester component
2. Check if the plist data is valid XML
3. Verify the plist library is installed correctly

### 3. Connection Issues

**Symptoms:**
- WebSocket fails to connect
- Connection drops frequently
- "Failed to connect to WebSocket" errors

**Solutions:**
1. Check network connectivity
2. Verify the WebSocket URL is correct
3. Test with different game instance IDs
4. Check for firewall/proxy blocking WebSocket connections

## Debugging Tools

### 1. Browser Developer Tools
- **Network Tab**: Check WebSocket connection status
- **Console**: Look for WebSocket logs and errors
- **Application Tab**: Check if WebSocket is listed under "Frames"

### 2. Test Components
- **ManualWebSocketTest**: Basic connection testing
- **WebSocketDebugger**: Detailed message logging
- **PlistTester**: Verify plist parsing works

### 3. Console Logging
Enable detailed logging by checking browser console for:
```
WebSocket: Adding subscriber, total callbacks: X
WebSocket: Received raw message: {...}
WebSocket: Parsed message: {...}
WebSocket: Handling game status update, callbacks count: X
WebSocket: Notifying X subscribers
```

## Testing Checklist

1. ✅ Plist parsing works (use PlistTester)
2. ✅ WebSocket connects successfully
3. ✅ Raw messages are received
4. ✅ Messages are parsed correctly
5. ✅ Subscribers are registered before connection
6. ✅ Game instance ID is valid and active
7. ✅ Network allows WebSocket connections

## Example Working Flow

```typescript
// 1. Create service instance
const service = new WebSocketGameService();

// 2. Subscribe BEFORE connecting
const unsubscribe = service.subscribe((status) => {
  console.log('Game status:', status);
});

// 3. Connect to WebSocket
await service.connect('valid-game-instance-id');

// 4. Wait for messages...
// Should see in console:
// - "WebSocket: Adding subscriber, total callbacks: 1"
// - "WebSocket connected to game: valid-game-instance-id"
// - "WebSocket: Received raw message: {...}"
// - "WebSocket: Notifying 1 subscribers"

// 5. Cleanup when done
unsubscribe();
service.disconnect();
```

## Common Mistakes

1. **Subscribing after connecting** - Subscribers must be added before connection
2. **Wrong game instance ID** - Use a valid, active game instance
3. **Not handling connection errors** - Always check for connection failures
4. **Forgetting to unsubscribe** - Can cause memory leaks
5. **Assuming immediate messages** - Server might not send updates immediately

## Getting Help

If issues persist:
1. Use the `/websocket-test` page to debug
2. Check all console logs for detailed error information
3. Verify the game instance is active and configured for WebSocket updates
4. Test with a different game instance ID
5. Check network connectivity and firewall settings