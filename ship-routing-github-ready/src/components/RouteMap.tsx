import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface RouteMapProps {
  routes?: Array<{
    id: string;
    name: string;
    coordinates: [number, number][];
    color: string;
    eta: string;
    fuelConsumption: string;
  }>;
}

const RouteMap: React.FC<RouteMapProps> = ({ routes = [] }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const savedMapboxToken = import.meta.env.VITE_MAPBOX_TOKEN || '';
  const [mapboxToken, setMapboxToken] = useState(savedMapboxToken);
  const [tokenSubmitted, setTokenSubmitted] = useState(Boolean(savedMapboxToken));

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken || map.current) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [75, -10], // Indian Ocean center
      zoom: 4,
      projection: 'mercator',
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    map.current.on('style.load', () => {
      map.current?.setPaintProperty('water', 'fill-color', '#2563eb');
    });
  };

  useEffect(() => {
    if (tokenSubmitted && mapboxToken) {
      initializeMap();
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [tokenSubmitted, mapboxToken]);

  useEffect(() => {
    if (!map.current || routes.length === 0) return;

    // Clear existing routes
    routes.forEach((route) => {
      const sourceId = `route-${route.id}`;
      const layerId = `route-layer-${route.id}`;
      
      if (map.current?.getSource(sourceId)) {
        map.current?.removeLayer(layerId);
        map.current?.removeSource(sourceId);
      }
    });

    // Add new routes
    routes.forEach((route) => {
      const sourceId = `route-${route.id}`;
      const layerId = `route-layer-${route.id}`;

      map.current?.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: route.coordinates,
          },
        },
      });

      map.current?.addLayer({
        id: layerId,
        type: 'line',
        source: sourceId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': route.color,
          'line-width': 4,
        },
      });
    });

    // Fit bounds to show all routes
    if (routes.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      routes.forEach(route => {
        route.coordinates.forEach(coord => bounds.extend(coord));
      });
      map.current?.fitBounds(bounds, { padding: 50 });
    }
  }, [routes]);

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      setTokenSubmitted(true);
    }
  };

  if (!tokenSubmitted) {
    return (
      <div className="flex items-center justify-center h-full bg-ocean-surface rounded-lg border border-border">
        <div className="text-center p-8">
          <h3 className="text-lg font-semibold mb-4">Enter Mapbox Token</h3>
          <p className="text-muted-foreground mb-4">
            Get your token from{' '}
            <a 
              href="https://mapbox.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              mapbox.com
            </a>
          </p>
          <div className="space-y-4 max-w-sm">
            <div>
              <Label htmlFor="mapbox-token">Mapbox Public Token</Label>
              <Input
                id="mapbox-token"
                type="text"
                placeholder="pk.eyJ1..."
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button onClick={handleTokenSubmit} className="w-full">
              Load Map
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapContainer} 
        className="absolute inset-0 rounded-lg border border-border overflow-hidden" 
      />
      {routes.length > 0 && (
        <div className="absolute top-4 left-4 bg-card rounded-lg shadow-lg p-4 max-w-xs">
          <h4 className="font-semibold mb-2">Route Legend</h4>
          <div className="space-y-2">
            {routes.map((route) => (
              <div key={route.id} className="flex items-center gap-2 text-sm">
                <div 
                  className="w-4 h-1 rounded"
                  style={{ backgroundColor: route.color }}
                />
                <span>{route.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteMap;
