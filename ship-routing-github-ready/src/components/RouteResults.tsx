import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, Fuel, Route, TrendingDown, TrendingUp } from 'lucide-react';

interface RouteResultsProps {
  routes: Array<{
    id: string;
    name: string;
    coordinates: [number, number][];
    color: string;
    eta: string;
    fuelConsumption: string;
  }>;
}

const RouteResults: React.FC<RouteResultsProps> = ({ routes }) => {
  if (routes.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="w-5 h-5 text-primary" />
            Route Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <Route className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Calculate a route to see detailed analysis</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const optimalRoute = routes[0];
  const alternativeRoutes = routes.slice(1);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Route className="w-5 h-5 text-primary" />
          Route Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Optimal Route */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-lg">{optimalRoute.name}</h3>
            <Badge variant="default" className="bg-success text-success-foreground">
              Recommended
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-ocean-surface p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Estimated Time</span>
              </div>
              <div className="text-2xl font-bold">{optimalRoute.eta}</div>
            </div>
            
            <div className="bg-ocean-surface p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Fuel className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Fuel Consumption</span>
              </div>
              <div className="text-2xl font-bold">{optimalRoute.fuelConsumption}</div>
            </div>
          </div>
        </div>

        {alternativeRoutes.length > 0 && (
          <>
            <Separator />
            
            {/* Alternative Routes */}
            <div>
              <h3 className="font-semibold mb-4">Alternative Routes</h3>
              <div className="space-y-3">
                {alternativeRoutes.map((route) => (
                  <div key={route.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: route.color }}
                        />
                        <span className="font-medium">{route.name}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{route.eta}</span>
                        {route.eta.includes('5 days') && (
                          <TrendingDown className="w-4 h-4 text-success" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Fuel className="w-4 h-4 text-muted-foreground" />
                        <span>{route.fuelConsumption}</span>
                        {route.fuelConsumption.includes('420') && (
                          <TrendingUp className="w-4 h-4 text-destructive" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <Separator />

        {/* Route Benefits */}
        <div>
          <h3 className="font-semibold mb-3">Optimization Benefits</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between p-2 bg-success/10 rounded">
              <span>Fuel Savings vs Direct Route</span>
              <span className="font-semibold text-success">-25%</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-ocean-surface rounded">
              <span>Weather Risk Reduction</span>
              <span className="font-semibold text-primary">High</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-ocean-surface rounded">
              <span>Current Utilization</span>
              <span className="font-semibold text-primary">Optimal</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RouteResults;