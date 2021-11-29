import React from "react";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Role() {
  const currentUserRole = localStorage.getItem("currentUserRole");
  const mystyle = {
    maxWidth: "200px",
  };
  return (
    <div className="d-flex flex-row-reverse">
      <div style={mystyle}>
        <Alert severity="error">This is an error message!</Alert>
        <Alert severity="warning">This is a warning message!</Alert>
        <Alert severity="info">This is an information message!</Alert>
        <Alert severity="success">This is a success message!</Alert>
      </div>
    </div>
  );
}
