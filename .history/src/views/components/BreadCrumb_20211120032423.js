import React from "react";
import { useLocation, Link } from "react-router-dom";
// import { Breadcrumb } from "antd";
import { Breadcrumb, BreadcrumbItem } from "reactstrap";

const BreadCrumb = () => {
  const location = useLocation();
  const breadCrumbView = () => {
    const { pathname } = location;
    const pathnames = pathname.split("/").filter((item) => item);
    const capatilize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
    return (
      <div>
        <Breadcrumb>
          {pathnames.length > 0 ? (
            <BreadcrumbItem>
              <Link to="/"></Link>
            </BreadcrumbItem>
          ) : (
            <BreadcrumbItem>Home</BreadcrumbItem>
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
        </Breadcrumb>
      </div>
    );
  };

  return <>{breadCrumbView()}</>;
};

export default BreadCrumb;
