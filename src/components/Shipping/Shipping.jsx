import React, { useEffect, useState } from "react";
import { Skeleton } from "@mui/material";
import { Box } from "@mui/system";
import { useParams } from "react-router-dom";

import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";

const googleLibraries = ["places"];

const Shipping = () => {
  // state management
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [directionResponse, setDirectionResponse] = useState(null);
  const [warehouseName, setWarehouseName] = useState("");
  const [warehouseCoordinates, setWarehouseCoordinates] = useState({});
  const [shippingData, setShippingData] = useState([]);

  const { warehouseid } = useParams();

  const googleMaps = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    googleLibraries,
  });

  useEffect(() => {
    getWarehouseData();
  }, []);

  // Retrieve data from our server
  const getWarehouseData = () => {
    fetch("/api/warehouse/" + warehouseid)
      .then((response) => response.json())
      .then((data) => {
        setWarehouseName(data.name);
        setWarehouseCoordinates({ lat: data.latitude, lng: data.longitude });
        setShippingData(data.slots);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setApiError(true);
      });
  };

  // If either google or our page is not ready yet, show a placeholder
  if (!googleMaps.isLoaded || loading) {
    return <Skeleton></Skeleton>;
  }
  const google = window.google;

  // Get addresses of all pending packages
  const shippingCoords = shippingData
    .filter((x) => x.packageAddress)
    .map((x) => ({
      location: x.packageAddress,
    }));

  // Service to retrieve routes
  const directionService = new google.maps.DirectionsService();
  directionService
    .route({
      origin: warehouseCoordinates,
      destination: warehouseCoordinates,
      optimizeWaypoints: true,
      waypoints: shippingCoords,
      travelMode: google.maps.TravelMode.DRIVING,
    })
    .then((response) => setDirectionResponse(response));

  // If we are unable to retrieve data from our server, show a generic error
  // This needs to be improved later to have more meaninful messages :)
  if (apiError) {
    return (
      <React.Fragment>
        <h1>Error loading data</h1>
        <p>Make sure the API is running!</p>
      </React.Fragment>
    );
  }
  // Finally, render our page, with our map
  return (
    <Box height="calc(100vh - 64px)" display="flex" flexDirection="column">
      <Box flex={1} overflow="auto">
        <GoogleMap
          center={warehouseCoordinates}
          zoom={15}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          options={{
            streetViewControl: false,
            fullscreenControl: false,
            mapTypeControl: false,
          }}
        >
          <Marker
            label={`${warehouseName} Warehouse`}
            position={warehouseCoordinates}
          />
          {directionResponse && (
            <DirectionsRenderer directions={directionResponse} />
          )}
        </GoogleMap>
      </Box>
    </Box>
  );
};

export default Shipping;
