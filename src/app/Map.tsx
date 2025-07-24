'use client';

import { useEffect, useRef } from 'react';

export default function Map() {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const fallbackCoords = { lng: 13.388, lat: 52.517 };

    const initMap = (center: { lng: number; lat: number }) => {
      const map = new (window as any).maplibregl.Map({
        container: mapRef.current!,
        style: 'https://tiles.openfreemap.org/styles/liberty',
        center: [center.lng, center.lat],
        zoom: 12,
      });

      map.addControl(new (window as any).maplibregl.NavigationControl());

      new (window as any).maplibregl.Marker()
        .setLngLat([center.lng, center.lat])
        .addTo(map);
    };

    const loadMap = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            initMap({
              lng: position.coords.longitude,
              lat: position.coords.latitude,
            });
          },
          (error) => {
            console.warn('Geolocation error:', error.message);
            initMap(fallbackCoords);
          },
          { enableHighAccuracy: true, timeout: 5000 }
        );
      } else {
        console.warn('Geolocation not supported.');
        initMap(fallbackCoords);
      }
    };

    // Here, we load MapLibre script dynamically #Yan
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/maplibre-gl/dist/maplibre-gl.js';
    script.onload = loadMap;
    document.head.appendChild(script);

    // MapLibre CSS
    const link = document.createElement('link');
    link.href = 'https://unpkg.com/maplibre-gl/dist/maplibre-gl.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  return (
    <div
      ref={mapRef}
      style={{
        width: '100%',
        height: '100vh',
        margin: 0,
        padding: 0,
      }}
    />
  );
}
