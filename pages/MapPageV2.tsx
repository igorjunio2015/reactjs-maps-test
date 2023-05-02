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
  const [editingMarker, setEditingMarker] = useState(null);
  const [stateMarkers, setStateMarkers] = useState(markers);
  const [markerRefs, setMarkerRefs] = useState({});

  const handleAddMarkerClick = (event: any) => {
    console.log("<event>", event);
    const id = new Date().getTime();
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const name = event.name;
    setEditingMarker({ id, lat, lng, name });
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingMarker(null);
  };

  const handleMarkerClick = (marker) => {
    console.log(marker);
    setEditingMarker(marker);
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
    setEditingMarker(null);
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
    setEditingMarker(null);
  };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyB-rXAJUS_gBObxtKA430BDYT-hWVNXkw8",
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
