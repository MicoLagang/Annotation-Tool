import React from "react";
import { useLocation } from "react-router-dom";
// import { Breadcrumb } from "antd";
// import { Breadcrumb, BreadcrumbItem } from "reactstrap";

import { makeStyles } from "@material-ui/core/styles";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

function handleClick(event) {
  event.preventDefault();
  console.info("You clicked a breadcrumb.");
}

const BreadCrumb = () => {
  const classes = useStyles();
  const location = useLocation();
  const breadCrumbView = () => {
    const { pathname } = location;
    const pathnames = pathname.split("/").filter((item) => item);
    const capatilize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
    return (
      <div>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          <Link color="inherit" href="/" onClick={handleClick}>
            Material-UI
          </Link>
          <Link
            color="inherit"
            href="/getting-started/installation/"
            onClick={handleClick}
          >
            Core
          </Link>
          <Typography color="textPrimary">Breadcrumb</Typography>
        </Breadcrumbs>
        {/* <Breadcrumb>
          {pathnames.length > 0 ? (
            <BreadcrumbItem>
              <Link to="/">Home</Link>
            </BreadcrumbItem>
          ) : (
            <BreadcrumbItem></BreadcrumbItem>
          )}
          {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;
            return isLast ? (
              <BreadcrumbItem>{capatilize(name)}</BreadcrumbItem>
            ) : (
              <BreadcrumbItem>
                <Link to={`${routeTo}`}>{capatilize(name)}</Link>
              </BreadcrumbItem>
            );
          })}
        </Breadcrumb> */}
      </div>
    );
  };

  return <>{breadCrumbView()}</>;
};

export default BreadCrumb;
