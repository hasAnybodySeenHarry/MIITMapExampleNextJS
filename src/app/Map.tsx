'use client';

import { useEffect, useRef } from 'react';
import maplibregl, { Map as MaplibreMap, Marker, NavigationControl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css'; // import CSS here so no need to dynamically add

export default function Map() {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const fallbackCoords = { lng: 13.388, lat: 52.517 };

    const initMap = (center: { lng: number; lat: number }) => {
      const map: MaplibreMap = new maplibregl.Map({
        container: mapRef.current!,
        style: 'https://tiles.openfreemap.org/styles/liberty',
        center: [center.lng, center.lat],
        zoom: 12,
      });

      map.addControl(new NavigationControl());

      new Marker()
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

    loadMap();
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
