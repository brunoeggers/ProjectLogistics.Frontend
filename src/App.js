import "./App.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Home from "./components/Home";
import React from "react";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Layout from "./components/Utils/Layout";
import Warehouse from "./components/Warehouse/Warehouse";
import Shipping from "./components/Shipping/Shipping";
import Packages from "./components/Package/Packages";
import RegisterPackage from "./components/Package/RegisterPackage";
import PackageDetails from "./components/Package/PackageDetails";
import ShippingSingle from "./components/Shipping/ShippingSingle";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Layout />}>
      <Route path="/home" element={<Home />} />
      <Route path="/packages" element={<Packages />} />
      <Route path="/packages/:packageid" element={<PackageDetails />} />
      <Route path="/packages/add/:warehouseid" element={<RegisterPackage />} />
      <Route
        path="/packages/shipping/:packageid"
        element={<ShippingSingle />}
      />
      <Route path="/warehouse/:warehouseid" element={<Warehouse />} />
      <Route path="/shipping/:warehouseid" element={<Shipping />} />
      <Route path="/" exact element={<Navigate replace to="/home" />} />
    </Route>
  )
);

function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

export default App;
