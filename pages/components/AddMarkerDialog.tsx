import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  dialog: {
    backdropFilter: "blur(4px)",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
});

function AddMarkerDialog({ open, onClose, onUpdate, onAdd, selectedMarker, markerRefs }) {
  const classes = useStyles();
  const [name, setName] = useState("");
  const [latitude, setLatitude] = useState(selectedMarker?.lat || "");
  const [longitude, setLongitude] = useState(selectedMarker?.lng || "");

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleLatitudeChange = (event) => {
    setLatitude(event.target.value);
  };

  const handleLongitudeChange = (event) => {
    setLongitude(event.target.value);
  };

  const handleAdd = () => {
    const latitudeNumber = parseFloat(latitude);
    const longitudeNumber = parseFloat(longitude);
    if(selectedMarker) {
      onUpdate(selectedMarker.id, latitudeNumber, longitudeNumber, name);
    } else {
      if (name && !isNaN(latitudeNumber) && !isNaN(longitudeNumber)) {
        onAdd(name, latitudeNumber, longitudeNumber);
      }
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} classes={{paper: classes.dialog}}>
      <DialogTitle>Adicione sua tag</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Nome marcador"
          value={name}
          onChange={handleNameChange}
          fullWidth
        />
        <TextField
          margin="dense"
          id="latitude"
          label="Latitude"
          value={latitude}
          onChange={handleLatitudeChange}
          fullWidth
        />
        <TextField
          margin="dense"
          id="longitude"
          label="Longitude"
          value={longitude}
          onChange={handleLongitudeChange}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleAdd} color="primary">
          Adicionar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddMarkerDialog;
