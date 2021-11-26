import React from "react";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

export default function Role() {
  const currentUserRole = localStorage.getItem("currentUserRole");

  const createTeam = {
    backgroundColor: "#FFD803",
  };

  const cardLink = {
    color: "#000000",
    textDecoration: "none",
    height: "130px",
  };

  const mystyle = {
    maxWidth: "200px",
  };
  return (
    <div className="d-flex flex-row-reverse">
      <div style={mystyle}>
        <Card
          style={createTeam}
          className="d-flex align-items-center justify-content-center h-100"
        >
          <CardContent>
            <Typography variant="h5" component="h2">
              Create Team
            </Typography>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
