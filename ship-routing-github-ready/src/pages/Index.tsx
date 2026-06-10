import React, { useState } from 'react';
import RouteMap from '@/components/RouteMap';
import RoutePlanner from '@/components/RoutePlanner';
import RouteResults from '@/components/RouteResults';
import heroImage from '@/assets/ship-hero.jpg';
import { Anchor } from 'lucide-react';

interface Route {
  id: string;
  name: string;
  coordinates: [number, number][];
  color: string;
  eta: string;
  fuelConsumption: string;
  origin: string;
  destination: string;
  distance: number;
  // Add other relevant fields as needed
}

const Index = () => {
  const [calculatedRoutes, setCalculatedRoutes] = useState<Route[]>([]);

  const handleRouteCalculated = (routes: Route[]) => {
    setCalculatedRoutes(routes);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Anchor className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">OceanRoute</h1>
                <p className="text-sm text-muted-foreground">Smart Ship Routing for the Indian Ocean</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-64 overflow-hidden">
        <img 
          src={heroImage} 
          alt="Container ship in the Indian Ocean"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/60 flex items-center justify-center">
          <div className="text-center text-primary-foreground">
            <h2 className="text-4xl font-bold mb-4">Weather-Aware Route Optimization</h2>
            <p className="text-xl opacity-90">Save fuel, reduce risk, optimize your voyage</p>
          </div>
        </div>
      </section>

      {/* Main Dashboard */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-400px)]">
          {/* Left Panel - Route Planning */}
          <div className="lg:col-span-3">
            <RoutePlanner onRouteCalculated={handleRouteCalculated} />
          </div>

          {/* Center Panel - Map */}
          <div className="lg:col-span-6">
            <RouteMap routes={calculatedRoutes} />
          </div>

          {/* Right Panel - Results */}
          <div className="lg:col-span-3">
            <RouteResults routes={calculatedRoutes} />
          </div>
        </div>
      </main>
    {/* Add closing tag for main container */}
    </div>
  );
};

export default Index;
