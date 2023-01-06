import { LocalShipping } from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  createTheme,
  CssBaseline,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";
import { Link as ReactRouterLink } from "react-router-dom";
import Link from "./Link";

export const themeOptions = createTheme({
  palette: {
    type: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "rgb(220, 0, 78)",
    },
    background: {
      default: "#fff",
      paper: "#fff",
    },
  },
});

const Layout = ({ children }) => {
  return (
    <ThemeProvider theme={themeOptions}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <LocalShipping sx={{ mr: 2 }} />
          <Link href="/" className="header-title" flexGrow={1}>
            <Typography variant="h6" color="inherit">
              iLogistics
            </Typography>
          </Link>
          <Button component={ReactRouterLink} to="/" color="inherit">
            Warehouses
          </Button>
          <Button component={ReactRouterLink} to="/packages" color="inherit">
            Packages
          </Button>
        </Toolbar>
      </AppBar>
      <Outlet />
      {/* Footer */}
      <Box component="footer"></Box>
      {/* End footer */}
    </ThemeProvider>
  );
};

export default Layout;
