import React, { useEffect, useContext, useCallback } from "react";

import Header from "./Components/Headers";
import Products from "./Components/ProductTypes/Products";
import Items from "./Components/ProductTypes/Items";
import { Context } from "../Components/ContextProvider";
import { setPlaid } from "../Store/Plaid";

import styles from "./App.module.scss";

const App = () => {
  const { statePlaid, dispatchPlaid } = useContext(Context);


  const getInfo = useCallback(async () => {
    const response = await fetch("/api/info", { method: "POST" });
    if (!response.ok) {
      dispatchPlaid(setPlaid({ ...statePlaid, backend: false }));
      return { paymentInitiation: false };
    }
    const data = await response.json();
    const paymentInitiation: boolean = data.products.includes(
      "payment_initiation"
    );
    dispatchPlaid(setPlaid({
      ...statePlaid,
        products: data.products,
      }));
    return { paymentInitiation };
  }, [dispatchPlaid]);

  const generateToken = useCallback(
    async (paymentInitiation) => {
      const path = paymentInitiation
        ? "/api/create_link_token_for_payment"
        : "/api/create_link_token";
      const response = await fetch(path, {
        method: "POST",
      });
      if (!response.ok) {
        dispatchPlaid(setPlaid({ ...statePlaid, linkToken: null }));
        return;
      }
      const data = await response.json();
      if (data) {
        if (data.error != null) {
          dispatchPlaid(setPlaid({
            ...statePlaid, 
              linkToken: null,
              linkTokenError: data.error,
            }));
          return;
        }
      
        dispatchPlaid(setPlaid({ ...statePlaid, linkToken: data.link_token }));
      }
      localStorage.setItem("link_token", data.link_token); //to use later for Oauth
    },
    [dispatchPlaid]
  );



  useEffect(() => {
    const init = async () => {
      const { paymentInitiation } = await getInfo(); // used to determine which path to take when generating token
      // do not generate a new token for OAuth redirect; instead
      // setLinkToken from localStorage
      if (window.location.href.includes("?oauth_state_id=")) {
        dispatchPlaid(setPlaid({
          ...statePlaid,
            linkToken: localStorage.getItem("link_token"),
          }));
        return;
      }
      generateToken(paymentInitiation);
    };
    if(!statePlaid?.linkToken) init();
    
  }, [dispatchPlaid, generateToken, getInfo]);

  return (
    <div>
      <div>
        <Header />
        
      </div>
    </div>
  );
};

export default App;
