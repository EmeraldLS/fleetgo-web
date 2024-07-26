import { ThemeProvider } from "./components/theme-provider";
import { Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import React from "react";
import { UserProvider } from "./components/context/userContext";

import TripDetail from "./pages/TripDetail";

const Home = React.lazy(() => import("./pages/Home"));

const Trips = React.lazy(() => import("./pages/Trips"));
const queryClient = new QueryClient();

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <UserProvider>
          <QueryClientProvider client={queryClient}>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/*" element={<div> Page not found</div>} />
              <Route path="/app/:user_type" element={<Dashboard />}>
                <Route path="trips" element={<Trips />} />
                <Route index element={<Home />} />
                <Route path="trip/:id" element={<TripDetail />} />
              </Route>
            </Routes>
          </QueryClientProvider>
        </UserProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
