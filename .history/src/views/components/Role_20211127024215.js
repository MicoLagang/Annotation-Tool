import React, { useEffect, useState } from "react";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

import Chip from "@mui/material/Chip";

export default function Role() {
  const currentUserRole = localStorage.getItem("currentUserRole");
  const [bgcolor, setBgColor] = useState("");
  const createTeam = {
    backgroundColor: `${bgcolor}`,
    paddingBottom: "0px !important",
    fontSize: "14px",
    color: "white",
    fontWeight: "bold",
  };
  const mystyle = {
    width: "200px",
  };

  useEffect(() => {
    if (currentUserRole == "admin") setBgColor("#c92d39");
    else if (currentUserRole == "validator") setBgColor("#834187");
    else if (currentUserRole == "annotator") setBgColor("#fcc438");
    else if (currentUserRole == "contributor") setBgColor("#82bb53");
  }, []);

  return (
    <div className="d-flex flex-row-reverse">
      <div style={mystyle}>
        <Chip style={createTeam} label={currentUserRole} />
        {/* <Card
          style={createTeam}
          className="d-flex align-items-center justify-content-center w-100"
        >
          <CardContent>
            <Typography variant="p">{currentUserRole}</Typography>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}