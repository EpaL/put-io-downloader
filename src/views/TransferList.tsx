import { ActionPanel, showToast, Toast, Detail, List, Action, Icon } from "@raycast/api";
import { useEffect, useState } from "react";
import TransferDetails from "../components/TransferDetails";
import PutioAPI, { Transfer } from '@putdotio/api-client'

function TransferList() {
  // State vars and handlers
  const [transfers, setTransfers] = useState<Transfer[]>();
  const [isShowingDetail, setIsShowingDetail] = useState(false);  
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
      // Filter the transfer list to only include completed items.
      setTransfers(t.data.transfers.filter((transfer) => transfer.status == "COMPLETED"));
      console.log('Fetched transfers: ', t.data); 
    })
    .catch(e => { 
      console.log('An error occurred while fetching transfers: ', e)
      setError(new Error("Error fetching transfer details from put.io."))
    })

  return (
    <List isLoading={transfers === undefined}
          isShowingDetail={isShowingDetail}
    >
      { transfers && 
        Object.values(transfers).map(transfer => {

        return (
          <List.Item
          icon="list-icon.png"
          title={`${transfer.name}`}
          detail={
            (
              <TransferDetails transferDetails={transfer}
              />
            )
          }
          actions={
            <ActionPanel title="Transfer Actions">
              <Action
                icon={Icon.Sidebar}
                title={isShowingDetail ? "Hide Transfer Details" : "Show Transfer Details"}
                onAction={() => setIsShowingDetail((previous) => !previous)}
              />
              <Action
                title={"Download TV Show"}
                icon={Icon.TV}
              />
              <Action
                title="Download Movie"
                icon={Icon.Movie}
              />
            </ActionPanel>
          }
          />  
        )
        }
      )}
    </List>
  );
}

export default TransferList;