/** @format */

import React from "react";

import { faBars } from "@fortawesome/fontawesome-free-solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

export const Mobileheader = () => {
  return (
    <>
      <header className='dashboard-toolbar mobile-view'>
        <Link href='#' className='menu-toggle'>
          <FontAwesomeIcon icon={faBars} />
        </Link>
      </header>
    </>
  );
};
