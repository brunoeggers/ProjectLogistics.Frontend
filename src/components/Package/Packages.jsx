import React, { useEffect, useState } from "react";
import Page from "../Utils/Page";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/system";
import { Button } from "@mui/material";
import Link from "../Utils/Link";

const columns = [
  { field: "id", headerName: "ID", width: 50 },
  {
    field: "trackingNumber",
    headerName: "Tracking Number",
    width: 150,
    renderCell: (params) => (
      <Link href={`/packages/${params.row.id}`}>
        {params.row.trackingNumber}
      </Link>
    ),
  },
  { field: "warehouseName", headerName: "Warehouse", width: 150 },
  { field: "warehouseSlotName", headerName: "Shelf", width: 150 },
  { field: "statusText", headerName: "Status", width: 150 },
];

const Packages = () => {
  const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    getWarehouseData();
  }, []);

  const renderTable = () => {
    return (
      <Box sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={packages}
          columns={columns}
          pageSize={20}
          rowsPerPageOptions={[20]}
        />
      </Box>
    );
  };

  const getWarehouseData = () => {
    fetch("/api/package")
      .then((response) => response.json())
      .then((data) => {
        setPackages(data);
        setLoading(false);

        console.log(data);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  return (
    <Page loading={loading} title="Packages">
      {renderTable()}
    </Page>
  );
};

export default Packages;
