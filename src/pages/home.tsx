import { Box, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { FlightStatusUpdate } from "../../backend/main";
import FlightStatusCard from "../components/FlightStatusCard";



export default function Home() {
  const [flightStatuses, setFlightStatuses] = useState<FlightStatusUpdate[]>([]);
  const [filteredStatuses, setFilteredStatuses] = useState<FlightStatusUpdate[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [ws, setWs] = useState<WebSocket | null>(null);


  useEffect(() => {
    const connect = async () => {
      try {
        const webSocket = new WebSocket('ws://localhost:8181');
        setWs(webSocket);

        webSocket.onmessage = (event) => {
          const message = JSON.parse(event.data);
          console.log("message is ", message);
          // Check if the flight already exists in the list

          if (message.type === 'INITIAL_FLIGHTS') {
            // Initialize the flight statuses
            setFlightStatuses(message.data);
          } else if (message.type === 'FLIGHT_UPDATE') {
            // Handle a new flight update
            setFlightStatuses((prevStatuses) => {
              const updatedFlight = message.data;

              // Check if the flight already exists in the list
              const flightExists = prevStatuses.some(
                (status) => status.newStatus.flightNumber === updatedFlight.newStatus.flightNumber
              );

              console.log("Flightexists are ", flightExists);

              if (flightExists) {
                // Update the existing flight status
                return prevStatuses.map((status) =>
                  status.newStatus.flightNumber === updatedFlight.newStatus.flightNumber
                    ? updatedFlight
                    : status
                );
              } else {
                // Add the new flight status to the list
                return [...prevStatuses, updatedFlight];
              }
            });
          }
        };

        webSocket.onclose = async (event) => {
          console.log('WebSocket connection closed. Reconnecting...');
          // Wait for some time before reconnecting
          await new Promise((resolve) => setTimeout(resolve, 2000)); // Adjust delay as needed
          connect();
        };
      } catch (error) {
        console.error('WebSocket connection error:', error);
        // Handle connection errors (optional)
      }
    };

    connect();

    return () => {
      ws?.close(); // Close the connection if the component unmounts
    };
  }, []);

  // Filter flight statuses based on search query
  useEffect(() => {
    if (searchQuery) {
      setFilteredStatuses(
        flightStatuses.filter((status) =>
          status.newStatus.flightNumber.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredStatuses(flightStatuses);
    }
  }, [searchQuery, flightStatuses]);



  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, m: 4 }}>
      <TextField
        label="Search by Flight Number"
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 2 }}
      />
      {filteredStatuses.reverse().map((flightStatus, index) => (
        <FlightStatusCard key={`${flightStatus.prevStatus?.flightNumber}-${index}`} updatedFlightStatus={flightStatus} />
      ))}
    </Box>
  )
}
