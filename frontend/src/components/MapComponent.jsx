import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap , Autocomplete, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '400px',
};

const MapComponent = () => {
    //   const [center, setCenter] = useState({
    //     lat: 37.7749, // Example coordinates (San Francisco)
    //     lng: -122.4194,
    //   });
    const mapRef = useRef(null);
    const [center, setCenter] = useState({
        lat: 24.887296,
        lng: 67.0564352
    });
    useEffect(() => {

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    console.log(`Latitude: ${lat}, Longitude: ${lng}`);
                    setCenter({ lat, lng });
                },
                (error) => {
                    console.error('Geolocation error:', error);
                }
            );
        }
    }, [])

    useEffect(() => {
        if (mapRef.current && center.lat !== 0 && center.lng !== 0) {
            const { AdvancedMarkerElement } = google.maps.marker;

            const marker = new AdvancedMarkerElement({
                position: center,
                map: mapRef.current,
            });
        }
    }, [center]);

    const SetCordToClick = (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        setCenter({ lat, lng });
        console.log('Selected Location:', { lat, lng });
    };

    const [autocomplete, setAutocomplete] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
  
    const onPlaceChanged = () => {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        setSelectedLocation({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          address: place.formatted_address,
        });
        console.log('Selected Place:', place);
      }
    };  

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={15}
            onLoad={(map) => (mapRef.current = map)}
        >
        </GoogleMap>
    );
};

export default MapComponent;
