import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { MapPin, Ship, Target, Fuel } from 'lucide-react';

interface RoutePlannerProps {
  onRouteCalculated: (routes: any[]) => void;
}

const INDIAN_OCEAN_PORTS = [
  { id: 'mumbai', name: 'Mumbai, India', coordinates: [72.8777, 19.0760] },
  { id: 'chennai', name: 'Chennai, India', coordinates: [80.2707, 13.0827] },
  { id: 'colombo', name: 'Colombo, Sri Lanka', coordinates: [79.8612, 6.9271] },
  { id: 'singapore', name: 'Singapore', coordinates: [103.8198, 1.3521] },
  { id: 'durban', name: 'Durban, South Africa', coordinates: [31.0218, -29.8587] },
  { id: 'capetown', name: 'Cape Town, South Africa', coordinates: [18.4241, -33.9249] },
  { id: 'port_louis', name: 'Port Louis, Mauritius', coordinates: [57.5012, -20.1609] },
  { id: 'male', name: 'Malé, Maldives', coordinates: [73.5093, 4.1755] },
];

const VESSEL_TYPES = [
  {
    id: 'bulk_carrier',
    name: 'Bulk Carrier',
    description: '180m length, 32,000 DWT',
    fuelConsumption: '45 MT/day',
    maxSpeed: '14 knots'
  },
  {
    id: 'container_ship',
    name: 'Container Ship',
    description: '300m length, 12,000 TEU',
    fuelConsumption: '180 MT/day',
    maxSpeed: '22 knots'
  },
  {
    id: 'passenger_vessel',
    name: 'Passenger Vessel',
    description: '250m length, 3,000 passengers',
    fuelConsumption: '120 MT/day',
    maxSpeed: '20 knots'
  }
];

const RoutePlanner: React.FC<RoutePlannerProps> = ({ onRouteCalculated }) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [vesselType, setVesselType] = useState('');
  const [optimization, setOptimization] = useState('fuel');
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculateRoute = async () => {
    if (!origin || !destination || !vesselType) {
      return;
    }

    setIsCalculating(true);
    
    // Simulate route calculation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const originPort = INDIAN_OCEAN_PORTS.find(p => p.id === origin);
    const destinationPort = INDIAN_OCEAN_PORTS.find(p => p.id === destination);
    
    if (!originPort || !destinationPort) return;

    // Mock route data; replace this with a real routing service when available.
    const mockRoutes = [
      {
        id: 'optimal',
        name: optimization === 'fuel' ? 'Fuel Optimal' : 'Time Optimal',
        coordinates: [
          originPort.coordinates,
          // Add some waypoints for demonstration
          [originPort.coordinates[0] + (destinationPort.coordinates[0] - originPort.coordinates[0]) * 0.3, 
           originPort.coordinates[1] + (destinationPort.coordinates[1] - originPort.coordinates[1]) * 0.2],
          [originPort.coordinates[0] + (destinationPort.coordinates[0] - originPort.coordinates[0]) * 0.7, 
           originPort.coordinates[1] + (destinationPort.coordinates[1] - originPort.coordinates[1]) * 0.8],
          destinationPort.coordinates
        ],
        color: '#2563eb',
        eta: optimization === 'fuel' ? '7 days 14 hours' : '6 days 2 hours',
        fuelConsumption: optimization === 'fuel' ? '315 MT' : '385 MT'
      },
      {
        id: 'alternative',
        name: 'Direct Route',
        coordinates: [
          originPort.coordinates,
          destinationPort.coordinates
        ],
        color: '#dc2626',
        eta: '5 days 18 hours',
        fuelConsumption: '420 MT'
      }
    ];

    onRouteCalculated(mockRoutes);
    setIsCalculating(false);
  };

  const selectedVessel = VESSEL_TYPES.find(v => v.id === vesselType);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ship className="w-5 h-5 text-primary" />
          Route Planning
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Port Selection */}
        <div className="space-y-4">
          <div>
            <Label className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4" />
              Origin Port
            </Label>
            <Select value={origin} onValueChange={setOrigin}>
              <SelectTrigger>
                <SelectValue placeholder="Select origin port" />
              </SelectTrigger>
              <SelectContent>
                {INDIAN_OCEAN_PORTS.map(port => (
                  <SelectItem key={port.id} value={port.id}>
                    {port.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4" />
              Destination Port
            </Label>
            <Select value={destination} onValueChange={setDestination}>
              <SelectTrigger>
                <SelectValue placeholder="Select destination port" />
              </SelectTrigger>
              <SelectContent>
                {INDIAN_OCEAN_PORTS.map(port => (
                  <SelectItem key={port.id} value={port.id}>
                    {port.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* Vessel Selection */}
        <div>
          <Label className="text-base font-medium mb-3 block">Vessel Type</Label>
          <Select value={vesselType} onValueChange={setVesselType}>
            <SelectTrigger>
              <SelectValue placeholder="Select vessel type" />
            </SelectTrigger>
            <SelectContent>
              {VESSEL_TYPES.map(vessel => (
                <SelectItem key={vessel.id} value={vessel.id}>
                  <div>
                    <div className="font-medium">{vessel.name}</div>
                    <div className="text-sm text-muted-foreground">{vessel.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedVessel && (
            <div className="mt-3 p-3 bg-ocean-surface rounded-lg">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Fuel Consumption:</span>
                  <div className="font-medium">{selectedVessel.fuelConsumption}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Max Speed:</span>
                  <div className="font-medium">{selectedVessel.maxSpeed}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Optimization Goal */}
        <div>
          <Label className="text-base font-medium mb-3 block">Optimization Goal</Label>
          <RadioGroup value={optimization} onValueChange={setOptimization}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="fuel" id="fuel" />
              <Label htmlFor="fuel" className="flex items-center gap-2">
                <Fuel className="w-4 h-4" />
                Minimize Fuel Consumption
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="time" id="time" />
              <Label htmlFor="time" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Minimize Travel Time
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Calculate Button */}
        <Button 
          onClick={handleCalculateRoute}
          disabled={!origin || !destination || !vesselType || isCalculating}
          className="w-full"
          size="lg"
        >
          {isCalculating ? 'Calculating Routes...' : 'Calculate Optimal Routes'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default RoutePlanner;
