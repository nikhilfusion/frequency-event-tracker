import WebSocket, { WebSocketServer } from 'ws';
import { simulateFlights } from './event-generator';
import { FlightStatus } from './event-generator';

interface FlightStatusUpdate {
  prevStatus: FlightStatus | null;
  newStatus: FlightStatus;
  updatedAt: Date;
}

const wss = new WebSocketServer({ port: 8181 });
const flightUpdates: Map<string, FlightStatusUpdate> = new Map();

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Send current flight statuses to the newly connected client
  const currentFlights = Array.from(flightUpdates.values());
  ws.send(JSON.stringify({ type: 'INITIAL_FLIGHTS', data: currentFlights }));

  ws.on('message', (message) => {
    console.log('Received message:', message);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Simulate flight updates
simulateFlights(1000, (newFlightStatus) => {
  const flightNumber = newFlightStatus.flightNumber;
  const prevUpdate = flightUpdates.get(flightNumber);

  const updatedStatusData: FlightStatusUpdate = {
    prevStatus: prevUpdate ? prevUpdate.newStatus : null,
    newStatus: newFlightStatus,
    updatedAt: new Date(),
  };

  flightUpdates.set(flightNumber, updatedStatusData);

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'FLIGHT_UPDATE', data: updatedStatusData }));
    }
  });
});

console.log('WebSocket server started on port 8181 🚀');
