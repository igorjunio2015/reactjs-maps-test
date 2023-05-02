import React, { useState } from "react";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  InfoWindow,
} from "@react-google-maps/api";
import AddMarkerDialog from "./components/AddMarkerDialog";
import IconMyLocal from "../assets/pin.png";
import IconYoursLocal from "../assets/pin_others.png";

export interface MapPageProps {}

const MapPage = () => {
  const [markers, setMarkers] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [stateMarkers, setStateMarkers] = useState(markers);
  const [markerRefs, setMarkerRefs] = useState({});
  const [selectedMarkerCoords, setSelectedMarkerCoords] = useState({ lat: 0, lng: 0 });

  const handleAddMarkerClick = (event: any) => {
    setSelectedMarkerCoords({ lat: event.latLng.lat(), lng: event.latLng.lng() });
    const id = new Date().getTime();
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const name = event.name;
    const newMarker = { id, lat, lng, name };
    setMarkers([...markers, newMarker]);
    setSelectedMarker(newMarker);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleMarkerClick = (marker) => {
    console.log(marker);
    setSelectedMarker(marker);
    setDialogOpen(true);
  };

  const addMarker = (name, lat, lng) => {
    const newMarker = {
      id: new Date().getTime(),
      name,
      lat,
      lng,
    };
    setMarkers([...stateMarkers, newMarker]);
    setSelectedMarker(null);
  };

  const handleUpdateMarker = (id, newLat, newLng, newName) => {
    const updatedMarkers = markers.map((marker) => {
      if (marker.id === id) {
        return {
          ...marker,
          lat: newLat,
          lng: newLng,
          name: newName,
        };
      } else {
        return marker;
      }
    });

    setMarkers(updatedMarkers);

    setDialogOpen(false);
    setSelectedMarker(null);
  };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
  });

  return isLoaded ? (
    <>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={{ lat: -16.7268656, lng: -49.3298721 }}
        zoom={17}
        onClick={handleAddMarkerClick}
        options={{
          styles: [
            {
              featureType: "all",
              elementType: "all",
              stylers: [{ saturation: -100 }, { gamma: 0.5 }],
            },
          ],
        }}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={{ lat: marker.lat, lng: marker.lng }}
            onClick={() => {
              setSelectedMarker(marker);
              setDialogOpen(true);
            }}
            icon={{
              url: IconYoursLocal,
            }}
          >
            <InfoWindow
              position={{ lat: marker.lat, lng: marker.lng }}
              options={{ pixelOffset: new window.google.maps.Size(0, -30) }}
              onCloseClick={() => setSelectedMarker(null)}
              closeOnClick={false}
            >
              <div>{marker.name}</div>
            </InfoWindow>
          </Marker>
        ))}
        <Marker
          icon={{
            url: IconMyLocal,
          }}
          position={{ lat: -16.7277934, lng: -49.330461 }}
        />
        <></>
      </GoogleMap>
      <div className="add-marker-dialog-container"></div>
      <AddMarkerDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onUpdate={handleUpdateMarker}
        onAdd={addMarker}
        selectedMarker={selectedMarker}
        markerRefs={markerRefs}
      />
    </>
  ) : (
    <></>
  );
};

export default MapPage;
