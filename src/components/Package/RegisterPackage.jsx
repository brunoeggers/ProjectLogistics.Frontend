import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import Page from "../Utils/Page";

const libraries = ["places"];

const RegisterPackage = (props) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [warehouseName, setWarehouseName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // get warehouseId from url
  const { warehouseid } = useParams();

  // validation
  const validationSchema = Yup.object().shape({
    trackingNumber: Yup.string()
      .required("Tracking Number is required")
      .min(6, "Tracking Number must be at least 6 characters")
      .max(30, "Tracking Number must not exceed 30 characters"),
    address: Yup.string()
      .required("Address is required")
      .min(6, "Address must be at least 6 characters")
      .max(350, "Address must not exceed 350 characters"),
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    getWarehouseData();
  }, []);

  // start Google Maps api
  const googleMaps = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const google = window.google;

  // Retrieve data from our server
  const getWarehouseData = () => {
    fetch("/api/warehouse/" + warehouseid)
      .then((response) => response.json())
      .then((data) => {
        data.slots.sort((a, b) =>
          a.name > b.name ? 1 : b.name > a.name ? -1 : 0
        );

        setWarehouseName(data.name);
        setSlots(data.slots);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  // post request to register package
  const submitForm = (data) => {
    data.warehouseId = warehouseid;
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data, null, 2),
    };
    fetch("/api/package", requestOptions)
      .then(async (response) => {
        const isJson = response.headers
          .get("content-type")
          ?.includes("application/json");
        const data = isJson && (await response.json());

        // check for error response
        if (!response.ok) {
          // get error message from body or default to response status
          const error = data || response.status;
          console.log(data);
          return Promise.reject(error);
        }

        props.callback();
      })
      .catch((error) => {
        setErrorMessage(error.toString());
        console.error("There was an error!", error);
      });
  };

  const isSomethingLoading = !googleMaps.isLoaded || loading;

  return (
    <Page loading={isSomethingLoading} title="Add a new package">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12}>
          <TextField
            fullWidth
            id="outlined-basic"
            label="Tracking Number"
            variant="outlined"
            {...register("trackingNumber")}
            error={errors.trackingNumber ? true : false}
          />
          <Typography variant="inherit" color="error.main">
            {errors.trackingNumber?.message}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Autocomplete>
            <TextField
              fullWidth
              id="outlined-basic"
              label="Address"
              variant="outlined"
              {...register("address")}
              error={errors.address ? true : false}
            />
          </Autocomplete>
          <Typography variant="inherit" color="error.main">
            {errors.address?.message}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12}>
          <FormControl fullWidth>
            <InputLabel id="input-warehouse">Warehouse</InputLabel>
            <Select
              fullWidth
              id="outlined-basic"
              label="Warehouse"
              labelId="input-warehouse"
              defaultValue={warehouseid}
              variant="outlined"
              {...register("warehouse")}
              error={errors.warehouse ? true : false}
            >
              <MenuItem value={warehouseid}>{warehouseName}</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="inherit" color="error.main">
            {errors.warehouse?.message}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12}>
          <FormControl fullWidth>
            <InputLabel id="input-shelf" shrink>
              Shelf
            </InputLabel>
            <Select
              id="outlined-basic"
              label="Shelf"
              labelId="input-shelf"
              variant="outlined"
              defaultValue={props.selectedSlot}
              {...register("warehouseSlotId")}
              error={errors.shelf ? true : false}
              displayEmpty
            >
              <MenuItem value="">Auto assign</MenuItem>
              {slots.map((slot) =>
                slot.isFree ? (
                  <MenuItem key={slot.id} value={slot.id}>
                    {slot.name}
                  </MenuItem>
                ) : (
                  <MenuItem key={slot.id} disabled value={slot.id}>
                    {slot.name} (in use)
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>
          <Typography variant="inherit" color="error.main">
            {errors.shelf?.message}
          </Typography>
        </Grid>
      </Grid>

      <div className="space-medium"></div>
      <Typography variant="inherit" color="error.main">
        {errorMessage}
      </Typography>
      <Button onClick={handleSubmit(submitForm)} variant="contained">
        Save
      </Button>
    </Page>
  );
};

RegisterPackage.defaultProps = {
  selectedSlot: "",
};

export default RegisterPackage;
