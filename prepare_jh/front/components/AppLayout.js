import React from "react";
import { PropTypes } from "prop-types";

const AppLayout = ({ children }) => {
  return (
    <>
      <div>공통메뉴</div>
      {children}
    </>
  );
};

AppLayout.prototype = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
