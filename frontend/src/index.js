import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";
import App from "./App";
import { HelmetProvider } from "react-helmet-async";
import { StoreProvider } from "./Store";
import {PayPalScriptProvider} from '@paypal/react-paypal-js'


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
   <StoreProvider>
    <HelmetProvider>
      <PayPalScriptProvider deferLoading={true}>
      <App />
      </PayPalScriptProvider>
    </HelmetProvider>
    </StoreProvider>
);
