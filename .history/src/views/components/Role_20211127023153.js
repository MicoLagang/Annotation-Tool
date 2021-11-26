import React, { useEffect } from "react";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

export default function Role() {
  const currentUserRole = localStorage.getItem("currentUserRole");
  const [bgcolor, setBgColor] = useState("");
  const createTeam = {
    backgroundColor: "#FFD803",
    paddingBottom: "0px !important",
    fontSize: "14px",
  };
  const mystyle = {
    width: "200px",
  };

  useEffect(() => {
    if (currentUserRole == "admin") setBgColor("red");
    else if (currentUserRole == "validator") setBgColor("blue");
    else if (currentUserRole == "contributor") setBgColor("green");
  }, []);

  return (
    <div className="d-flex flex-row-reverse">
      <div style={mystyle}>
        <Card
          style={createTeam}
          className="d-flex align-items-center justify-content-center w-100"
        >
          <CardContent>
            <Typography variant="p">{currentUserRole}</Typography>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
