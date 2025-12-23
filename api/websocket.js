// api/websocket.js - WebSocket server via Vercel Edge
/* global Deno, WebSocket */

const clients = new Set();

export const config = {
  runtime: 'edge'
};

export default async function handler(req) {
  if (req.headers.get('upgrade') !== 'websocket') {
    return new Response('Expected WebSocket', { status: 426 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);

  socket.onopen = () => {
    clients.add(socket);
    console.log('✅ Client connected');
  };

  socket.onmessage = async event => {
    const message = JSON.parse(event.data);
    
    // Broadcast a todos los clientes
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'agent-update',
          data: message,
          timestamp: Date.now()
        }));
      }
    });
  };

  socket.onclose = () => {
    clients.delete(socket);
    console.log('❌ Client disconnected');
  };

  return response;
}
