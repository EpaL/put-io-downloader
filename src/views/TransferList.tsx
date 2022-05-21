import { ActionPanel, showToast, Toast, Detail, List, Action, Icon, useNavigation } from "@raycast/api";
import { useEffect, useState } from "react";
import TransferDetails from "../components/TransferDetails";
import FileList from "./FileList";
import PutioAPI, { Transfer } from '@putdotio/api-client'
import { count } from "console";
import { preferences } from "../preferences";

function TransferList() {
  // State vars and handlers
  const [transfers, setTransfers] = useState<Transfer[]>();
  const [isShowingDetail, setIsShowingDetail] = useState(false);  
  const [error, setError] = useState<Error>();
  const { push } = useNavigation();

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
  useEffect(() => {
    const putioAPI = new PutioAPI({ clientID: preferences.putioClientId })
    putioAPI.setToken(preferences.putioOAuthToken)

    // // Query account info
    // putioAPI.Account.Info()
    //   .then(r => console.log('Fetched user info: ', r))
    //   .catch(e => {
    //     console.log('An error occurred while fetching user info: ', e)
    //     setError(new Error("Error fetching user details from put.io. Check your Client ID and API Token."))
    //   })

    // Query for a list of transfers
    putioAPI.Transfers.Query()
      .then(t => {
        // Filter the transfer list to only include completed items.
        // setTransfers(t.data.transfers.filter((transfer) => transfer.percent_done >= 0));
        // Reverse-sort the transfer list by when it was created.
        setTransfers(t.data.transfers.sort((n1,n2) => {
          if (n1.created_at < n2.created_at) {
              return 1;
          }
      
          if (n1.created_at > n2.created_at) {
              return -1;
          }
          return 0;
        }));
        console.log('Number of fetched transfers: ', transfers?.length); 
      })
      .catch(e => { 
        console.log('An error occurred while fetching transfers: ', e)
        setError(new Error("Error fetching transfer details from put.io."))
      })
  }, []);

  return (
    <List isLoading={transfers === undefined}
          isShowingDetail={isShowingDetail}
          navigationTitle="Put.io Transfers"
    >
      { transfers && 
        Object.values(transfers).map(transfer => {
        return (
          <List.Item
          key={`${transfer.id}`}
          icon={Icon.Download}
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
                icon={Icon.Document}
                title="Show Files"
                onAction={() => push(<FileList transferDetails={transfer} />)}
              />
              <Action
                icon={Icon.Sidebar}
                title={isShowingDetail ? "Hide Transfer Details" : "Show Transfer Details"}
                onAction={() => setIsShowingDetail((previous) => !previous)}
              />
              <Action
                title={"Download TV Show"}
                icon={Icon.Download}
              />
              <Action
                title="Download Movie"
                icon={Icon.Download}
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