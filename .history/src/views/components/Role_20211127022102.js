import React from "react";

export default function Role() {
  const currentUserRole = localStorage.getItem("currentUserRole");
  const mystyle = {
    maxWidth: "200px",
  };
  return (
    <div className="d-flex flex-row-reverse">
      <div style={mystyle}></div>
    </div>
  );
}
