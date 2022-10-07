import "./App.css";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import DashBoard from "./pages/dash-board";
import ErrorPage from "./pages/error";
import PageNotFound from "./pages/not-found";
import Header from "./components/header";
import { ToastContainer } from "react-toastify";
import React from "react";

// CSS files
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css";

function App() {
  return (
    <Routes>
      <Route path='/' element={<AppContainer />}>
        <Route index element={<Navigate to='create-deal' />} />
        <Route
          path='create-deal'
          element={
            <React.Fragment>
              <Outlet />
            </React.Fragment>
          }
        >
          <Route index element={<Home />} />
          <Route path=':deal_id' element={<Home />} />
        </Route>
        <Route path='dashboard' element={<DashBoard />} />
        <Route path='help' element={<h1>This is Help Page.</h1>} />
        <Route path='error' element={<ErrorPage />} />
        <Route path='*' element={<PageNotFound />} />
      </Route>
    </Routes>
  );
}

const AppContainer = () => {
  return (
    <>
      <Header />
      <div>
        <Outlet />
      </div>
      <ToastContainer
        pauseOnHover={false}
        pauseOnFocusLoss={false}
        limit={3}
        autoClose={1500}
      />
    </>
  );
};

export default App;
