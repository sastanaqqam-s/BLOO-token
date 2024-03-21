/** @format */

import React from "react";
import satanaImage from "../../../../assets/sastana.png";

import { Link } from "react-router-dom";

export const SideBar = (props) => {
  const categoryDetail = props.categoryDetail;
  const id = props.index;
  return (
    <React.Fragment>
      {/*Main content Header */}
      <nav className='dashboard-nav-list'>
        <header>
          <div className='brand-logo'>
            <img src={satanaImage} alt='logo'></img>
          </div>
        </header>

        {/* Partner */}
        {categoryDetail.length > 0 ? (
          categoryDetail.map((item, key) => (
            <div className='dashboard-nav-dropdown' key={item.categoryName}>
              <div className='dashboard-nav-item dashboard-nav-dropdown-toggle no-toggle'>
                • &nbsp;
                <Link
                  className={id == key ? "active" : ""}
                  to={
                    "/tokenomics/" +
                    item.categoryName
                      .toLowerCase()
                      .replace(/ /g, "_")
                      .replace("(", "")
                      .replace(")", "")
                  }>
                  {" "}
                  {/* lowecase all text and replace text space with underscore and  replace () with _ and capital letter to small later  */}
                  {item.categoryName}
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className='dashboard-nav-dropdown'>
            <div className='dashboard-nav-item dashboard-nav-dropdown-toggle no-toggle'>
              No Data Found
            </div>
          </div>
        )}
      </nav>
    </React.Fragment>
  );
};
