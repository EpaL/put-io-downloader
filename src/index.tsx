import { ActionPanel, showToast, Toast, Detail, List, Action } from "@raycast/api";
import { useEffect, useState } from "react";
import PutioAPI from '@putdotio/api-client'

export default function Command() {
  // State vars and handlers
  const [transfers, setTransfers] = useState(null);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    if (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Something went wrong",
        message: error,
      })  
    }
  }, [error]);

  // Init put.io API
  const putioAPI = new PutioAPI({ clientID: '5746' })
  putioAPI.setToken("VGDZI7MZV4EHEVUQOMZN")

  // // Query account info
  // putioAPI.Account.Info()
  //   .then(r => console.log('Fetched user info: ', r))
  //   .catch(e => {
  //     console.log('An error occurred while fetching user info: ', e)
  //     setError(new Error("Error fetching user details from put.io. Check your Client ID and API Token."))
  //   })

  // Query for a list of transfers
  putioAPI.Transfers.Query(100, 100)
    .then(t => {
      setTransfers(t.data)
      console.log('Fetched transfers: ', t.data); 
    })
    .catch(e => { 
      console.log('An error occurred while fetching transfers: ', e)
      setError(new Error("Error fetching transfer details from put.io."))
    })

  return (
    <List isLoading={transfers === undefined}>
      <List.Item
        icon="list-icon.png"
        title="Greeting"
        actions={
          <ActionPanel>
            <Action.Push title="Show Details" target={<Detail markdown="# Hey! 👋" />} />
          </ActionPanel>
        }
      />
    </List>
  );
}
