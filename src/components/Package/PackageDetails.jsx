import React, { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";

import Page from "../Utils/Page";
import { Navigate, useNavigate, useParams } from "react-router-dom";

const PackageDetails = (props) => {
  const [loading, setLoading] = useState(true);
  const [packageDetails, setPackageDetails] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  // get packageId from url or props
  const params = useParams();
  const packageId = params.packageid || props.packageId;

  useEffect(() => {
    getWarehouseData();
  }, []);

  const getWarehouseData = () => {
    fetch("/api/package/" + packageId)
      .then((response) => response.json())
      .then((data) => {
        setPackageDetails(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const confirmDeletion = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this package? This action is irreversible"
      ) == true
    ) {
      const requestOptions = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      };
      fetch("/api/package/" + packageId, requestOptions)
        .then(async (response) => {
          const isJson = response.headers
            .get("content-type")
            ?.includes("application/json");
          const data = isJson && (await response.json());

          // check for error response
          if (!response.ok) {
            // get error message from body or default to response status
            const error = data || response.status;
            return Promise.reject(error);
          }

          if (typeof props.callback === "function") {
            props.callback();
          } else {
            navigate("/packages");
          }
        })
        .catch((error) => {
          setErrorMessage(error.toString());
          console.error("There was an error!", error);
        });
    }
  };
  const confirmDelivered = () => {
    if (
      window.confirm(
        "Are you sure you want to mark this package as shipped? This action is irreversible"
      ) == true
    ) {
      const requestOptions = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      };
      fetch("/api/package/" + packageId, requestOptions)
        .then(async (response) => {
          const isJson = response.headers
            .get("content-type")
            ?.includes("application/json");
          const data = isJson && (await response.json());

          // check for error response
          if (!response.ok) {
            // get error message from body or default to response status
            const error = data || response.status;
            return Promise.reject(error);
          }

          if (typeof props.callback === "function") {
            props.callback();
          } else {
            setLoading(true);
            getWarehouseData();
          }
        })
        .catch((error) => {
          setErrorMessage(error.toString());
          console.error("There was an error!", error);
        });
    }
  };
  const viewRoute = () => {
    return <Navigate to={`'/packages/shipping/${packageId}'`}></Navigate>;
  };

  return (
    <Page loading={loading} title="Package">
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1 },
        }}
        noValidate
        autoComplete="off"
      >
        <FormControl fullWidth>
          <TextField
            id="outlined-basic"
            label="Tracking Number"
            variant="outlined"
            value={packageDetails.trackingNumber}
            InputProps={{
              readOnly: true,
            }}
          />
        </FormControl>
        <FormControl fullWidth>
          <TextField
            id="outlined-basic"
            label="Warehouse Slot"
            variant="outlined"
            value={packageDetails.warehouseSlotName}
            InputProps={{
              readOnly: true,
            }}
          />
        </FormControl>
        <FormControl fullWidth>
          <TextField
            id="outlined-basic"
            label="Address"
            variant="outlined"
            value={packageDetails.address}
            InputProps={{
              readOnly: true,
            }}
          />
        </FormControl>
        <FormControl fullWidth>
          <TextField
            id="outlined-basic"
            label="Status"
            variant="outlined"
            value={packageDetails.statusText}
            InputProps={{
              readOnly: true,
            }}
          />
        </FormControl>
      </Box>

      <Typography variant="inherit" color="error.main">
        {errorMessage}
      </Typography>
      <div className="space-medium"></div>
      <Stack
        spacing={2}
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        {packageDetails.status == 0 && (
          <React.Fragment>
            <Button
              href={`/packages/shipping/${packageId}`}
              variant="contained"
            >
              View Route
            </Button>
            <Button onClick={() => confirmDelivered()} variant="contained">
              Mark as shipped
            </Button>
          </React.Fragment>
        )}
        <Button onClick={() => confirmDeletion()} variant="contained">
          Delete
        </Button>
      </Stack>
    </Page>
  );
};

export default PackageDetails;
