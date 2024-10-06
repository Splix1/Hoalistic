import React, { useContext } from "react";
import Callout from "plaid-threads/Callout";
import { Button } from "@mui/material";
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
            <Button fullWidth variant="contained" disabled={true} style={{ height: '1.5rem', marginLeft: '0.5rem'}}>
      Connect Bank
    </Button>
              {/* <Link /> */}
            </div>}
      
     
          
    </div>
  )
};

Header.displayName = "Header";

export default Header;
