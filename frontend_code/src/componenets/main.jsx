/** @format */

import React, { useEffect, useState } from "react";
import "./main.css";

// import header and sider bar jsx file
import { ContentIndex } from "./content";
import { Header } from "./pages/layout/header/header";
import { Mobileheader } from "./pages/layout/sideBar/mobileHeader";
import { SideBar } from "./pages/layout/sideBar/sideBar";

import { CATEGORY } from "./pages/utils/enum";
import { ContractMethods } from "./smart_contract/Web3/contractMethods";

export const Main = () => {
  var id = window.location.pathname;
  if (id == "/tokenomics/" || id == "/") {
    id = "team";
  } else {
    id = id.replace("/tokenomics/", "");
  }

  const [allCategoryDetail, setALLCategoryDetail] = useState([]);
  const [categoryDetail, setCategoryDetail] = useState();
  const [categoryId, setCategoryId] = useState(0);

  useEffect(() => {
    getDetail(CATEGORY[id]);
  }, [id]);

  const getDetail = async (categoryId) => {
    var contract = ContractMethods();

    setCategoryId(categoryId);
    let category = await contract.getCategory(categoryId);
    setCategoryDetail(category);

    let allCategory = await contract.viewAllCategory();
    setALLCategoryDetail(allCategory);
  };

  return (
    <>
      <div className='dashboard' id='dashboard'>
        <div className='dashboard-nav'>
          {/*Main content Header */}
          <Mobileheader />
          {/* navBar(Sidebar) */}
          <SideBar index={categoryId} categoryDetail={allCategoryDetail} />
        </div>

        {/*content Header */}
        <div className='dashboard-app'>
          <Header heading={categoryDetail?.categoryName} />
          <ContentIndex detail={categoryDetail} />
        </div>
      </div>
    </>
  );
};
