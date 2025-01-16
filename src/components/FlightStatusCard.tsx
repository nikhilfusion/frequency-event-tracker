import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { FlightTakeoff, FlightLand } from '@mui/icons-material';
import { FlightStatusUpdate } from "../../backend/main";
import { FlightStatus } from '../../backend/event-generator';

const getStatusColor = (status: FlightStatus['status']) => {
  switch (status) {
    case 'SCHEDULED': return 'info';
    case 'DEPARTED': return 'warning';
    case 'ARRIVED': return 'success';
    case 'CANCELED': return 'error';
    default: return 'default';
  }
};

const getChangeText = (field: string, oldValue: any, newValue: any) => {
  if (oldValue && oldValue !== newValue) {
    return `${field} changed from ${oldValue} to ${newValue}`;
  }
  return null;
};

const FlightStatusCard = ({ updatedFlightStatus }: { updatedFlightStatus: FlightStatusUpdate }) => {
  const { prevStatus, newStatus: flightStatus, updatedAt } = updatedFlightStatus;

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', width: '100%', position: 'relative' }}>
      <CardContent
        sx={{
          flex: '1 0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 1,
          px: 2,
          "&:last-child": { pb: 1 },
        }}
      >
        {/* Flight Info */}
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '25%' }}>
          <Typography variant="h6" component="div">
            {flightStatus?.flightNumber}
          </Typography>
          {flightStatus.equipmentRegistration && (
            <Typography variant="body2" color="text.secondary">
              Reg: {flightStatus?.equipmentRegistration}
            </Typography>
          )}
        </Box>

        {/* Departure Info */}
        <Box sx={{ display: 'flex', alignItems: 'center', width: '25%' }}>
          <FlightTakeoff sx={{ mr: 1 }} />
          <Box>
            <Typography variant="h6">{flightStatus.departure.airport}</Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date(flightStatus.departure.scheduled).toLocaleTimeString()}
            </Typography>
          </Box>
        </Box>

        {/* Arrival Info */}
        <Box sx={{ display: 'flex', alignItems: 'center', width: '25%' }}>
          <FlightLand sx={{ mr: 1 }} />
          <Box>
            <Typography variant="body1">{flightStatus.arrival.airport}</Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date(flightStatus.arrival.scheduled).toLocaleTimeString()}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ width: '25%', display: 'contents' }}>
          {prevStatus?.status && prevStatus.status !== flightStatus.status ? (
            <Chip
              label={
                <span> {prevStatus.status}</span>
              }
              sx={{ width: '10%' }}
              style={{ opacity: 0.3, textDecoration: 'line-through' }}
            />) : ''}

          {/* Status Chip */}
          <Chip
            label={
              <span>{flightStatus.status}</span>
            }
            color={getStatusColor(flightStatus.status)}
            sx={{ width: '10%' }}
          />
        </Box>
      </CardContent>
      <CardContent sx={{
        flex: '1 0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 1,
        px: 2,
        "&:last-child": { pb: 1 },
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '33%' }}>
          {prevStatus?.arrival?.scheduled && (
            <Typography variant="body2" color="error">
              {getChangeText(
                "Arrival Time",
                prevStatus.arrival.scheduled,
                flightStatus.arrival.scheduled
              )}
            </Typography>
          )}
          {prevStatus?.departure?.scheduled && (
            <Typography variant="body2" color="error">
              {getChangeText(
                "Departure Time",
                prevStatus.departure.scheduled,
                flightStatus.departure.scheduled
              )}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '33%' }}>
          {
            flightStatus.status === 'DEPARTED' && flightStatus?.departure?.actual ?
              <Typography variant="subtitle1" component="div" style={{ color: 'green' }}>
                {`Flight departed at: ${new Date(flightStatus.departure.actual).toLocaleString()}`}
              </Typography> : ''
          }

          {
            flightStatus.status === 'ARRIVED' && flightStatus?.arrival?.actual ?
              <Typography variant="subtitle2" component="div" style={{ color: 'green' }}>
                {`Flight arrived at: ${new Date(flightStatus.arrival.actual).toLocaleString()}`}
              </Typography> : ''
          }

        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '33%' }}>
          <Typography variant="body2" component="div" style={{ color: 'red' }}>
            Last updated: {new Date(updatedAt).toLocaleString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FlightStatusCard;

