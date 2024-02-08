import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-control-geocoder';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

function MapView({ address }) {
  const [map, setMap] = useState(null);
  const [lon, setLon] = useState(0);
  const [lat, setLat] = useState(0);
  const [markerAdded, setMarkerAdded] = useState(false);

  useEffect(() => {
    if (address) {
      // Perform geocoding
      const geocoder = L.Control.Geocoder.nominatim();
      geocoder.geocode(address, (results) => {
        if (results.length > 0) {
          setLat(results[0].center.lat);
          setLon(results[0].center.lng);

          if (map) {
            map.setView([results[0].center.lat, results[0].center.lng], 14);

            if (!markerAdded) {
              const customIcon = L.icon({
                iconUrl: markerIcon,
                shadowUrl: markerShadow,
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
              });

              const marker = L.marker([results[0].center.lat, results[0].center.lng], { icon: customIcon });
              marker.bindPopup(address).openPopup();
              marker.addTo(map);
              setMarkerAdded(true);
            }
          }
        }
      });
    }
  }, [address, map, markerAdded]);

  const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    map.setView(center, zoom);
    setMap(map);
    return null;
  };

  return (
    <div className="map-container">
      <MapContainer center={[lat, lon]} zoom={14}>
        <ChangeView center={[lat, lon]} zoom={14} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  );
}

export default MapView;
