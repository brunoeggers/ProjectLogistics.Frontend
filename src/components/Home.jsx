import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Link from "./Utils/Link";
import Page from "./Utils/Page";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [warehouses, setWarehouses] = useState([]);

  useEffect(() => {
    getWarehouseData();
  }, []);

  // render warehouses
  const renderTable = () => {
    return (
      <TableContainer variant="outlined">
        <Table aria-label="demo table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Location (Latitude, Longitude)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {warehouses.map((row) => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  <Link href={`/warehouse/${row.id}`}>{row.name}</Link>
                </TableCell>
                <TableCell>
                  {row.latitude}, {row.longitude}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  // retrieve warehouses from server
  const getWarehouseData = () => {
    fetch("/api/warehouse")
      .then((response) => response.json())
      .then((data) => {
        setWarehouses(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  return (
    <Page loading={loading} title="Warehouses">
      {renderTable()}
    </Page>
  );
};

export default Home;
