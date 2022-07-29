import React, { useEffect, useContext } from "react";
import { usePlaidLink } from "react-plaid-link";
import { Button } from "@mui/material";
import { Context } from "../../../Components/ContextProvider";
import { setPlaid } from "../../../Store/Plaid";
import supabase from "../../../client";
const dayjs = require('dayjs');

const Link = () => {
  const { state, statePlaid, dispatchPlaid } = useContext(Context);

  const onSuccess = React.useCallback(
    (public_token: string) => {
      // send public_token to server
      const setToken = async () => {
        const response = await fetch("/api/set_access_token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
          body: `public_token=${public_token}`,
        });
        if (!response.ok) {
          dispatchPlaid(setPlaid({
            ...statePlaid,
              itemId: `no item_id retrieved`,
              accessToken: `no access_token retrieved`,
              isItemAccess: false,
            }));
          return;
        }
        const data = await response.json();
        dispatchPlaid(setPlaid({
          ...statePlaid,
            itemId: data.item_id,
            accessToken: data.access_token,
            isItemAccess: true,
            tokenExpired: false,
          }));
           let expiration = dayjs().add(30, 'minute');
        let token = await supabase.from('access_tokens').select('*').eq('HOA', state?.id);
        if(token?.data?.length === 0){
          await supabase.from('access_tokens').insert({ HOA: state?.id, access_token: data.access_token, expiration})
        } else {
          await supabase.from('access_tokens').update({ access_token: data.access_token, expiration}).eq('HOA', state?.id)
        }
      };
      setToken();
      dispatchPlaid(setPlaid({ ...statePlaid, linkSuccess: true}));
      window.history.pushState("", "", "/");
    },
    [dispatchPlaid]
  );

  let isOauth = false;
  const config: Parameters<typeof usePlaidLink>[0] = {
    token: statePlaid?.linkToken!,
    onSuccess,
  };

  if (window.location.href.includes("?oauth_state_id=")) {
    // TODO: figure out how to delete this ts-ignore
    // @ts-ignore
    config.receivedRedirectUri = window.location.href;
    isOauth = true;
  }

  const { open, ready } = usePlaidLink(config);

  

  useEffect(() => {
    if (isOauth && ready) {
      open();
    }
  }, [ready, open, isOauth]);

  return (
    <Button fullWidth variant="contained" onClick={() => open()} disabled={!ready} style={{ height: '1.5rem', marginLeft: '0.5rem'}}>
      Connect Bank
    </Button>
  );
};

Link.displayName = "Link";

export default Link;
