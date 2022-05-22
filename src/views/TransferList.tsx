import { ActionPanel, showToast, Toast, Detail, List, Action, Icon, useNavigation } from "@raycast/api";
import { useEffect, useState } from "react";
import TransferDetails from "../components/TransferDetails";
import FileBrowser from "./FileBrowser";
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
                title="Browse File(s)"
                onAction={() => push(<FileBrowser parent_file_id={transfer.file_id} />)}
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