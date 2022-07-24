import React, { useContext } from "react";
import Callout from "plaid-threads/Callout";
import Button from "plaid-threads/Button";
import InlineLink from "plaid-threads/InlineLink";

import Link from "../Link";
import { Context } from "../../../Components/ContextProvider";

import styles from "./index.module.scss";

const Header = () => {
  const {
   statePlaid
  } = useContext(Context);
  

  return (
    <div className={styles.grid}>   
          {<div>
              <Link />
            </div>}
      
     
          
    </div>
  )
};

Header.displayName = "Header";

export default Header;
