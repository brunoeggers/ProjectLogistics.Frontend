import { CircularProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { Fragment } from "react";

import "./Page.css";

const Page = (props) => {
  return (
    <Fragment>
      <div id="page-wrapper">
        <div id="page-header">
          <Typography variant="h4">{props.title}</Typography>
        </div>
        <hr />
        <div id="page-content">
          {props.loading ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <CircularProgress size={100} />
              <div style={{ marginTop: "25px" }}>
                <b>Loading... Make sure the backend is running</b>
              </div>
            </Box>
          ) : (
            props.children
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Page;
