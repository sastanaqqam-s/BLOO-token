/** @format */

import "./App.css";

import "bootstrap/dist/css/bootstrap.min.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import pagenot found component

import { Main } from "./componenets/main.jsx";
import { PageNotFound } from "./componenets/pages/pageNotFound/pageNotFound.jsx";

function App() {
  const router = createBrowserRouter([
    { path: "*", element: <PageNotFound /> },
    { path: "/", element: <Main /> },
    { path: "/tokenomics/", element: <Main /> },
    { path: "/tokenomics/team", element: <Main /> },
    { path: "/tokenomics/advisors", element: <Main /> },
    { path: "/tokenomics/partners", element: <Main /> },
    { path: "/tokenomics/special_private_sale", element: <Main /> },
    { path: "/tokenomics/private_sale", element: <Main /> },
    { path: "/tokenomics/public_launch_ido", element: <Main /> },
    { path: "/tokenomics/public_launch_ieo", element: <Main /> },
    { path: "/tokenomics/exchanges_liquidity", element: <Main /> },
    { path: "/tokenomics/airdrop_rewards", element: <Main /> },
    { path: "/tokenomics/incentive_rewards", element: <Main /> },
    { path: "/tokenomics/treasury", element: <Main /> },
    { path: "/tokenomics/reserve_fund", element: <Main /> },
  ]);

  return (
    <>
      {/* Transaction Loader */}
      <div
        className='mainLoader loader loader-default '
        id='loaderVisibility'
        data-text='Loading...  Wait for Transaction to Complete!'></div>

      <RouterProvider router={router} />
    </>
  );
}

export default App;
