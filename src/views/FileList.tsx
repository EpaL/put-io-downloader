import { ActionPanel, showToast, Toast, Detail, List, Action, Icon, useNavigation } from "@raycast/api";
import { useEffect, useState } from "react";
import TransferDetails from "../components/TransferDetails";
import PutioAPI, { Transfer, IDownloadLinks } from '@putdotio/api-client'
import { count } from "console";
import File from "@putdotio/api-client/dist/resources/Files/File";
import { preferences } from "../preferences";

function FileList({transferDetails}: {transferDetails: Transfer}) {
  // State vars and handlers
  const [files, setFiles] = useState<IFile[]>();
  const [isShowingDetail, setIsShowingDetail] = useState(false);  
  const [error, setError] = useState<Error>();
  const { push } = useNavigation();

  useEffect(() => {
    if (error) {
      showToast({

        style: Toast.Style.Failure,
        title: "Something went wrong",
        message: error.message,
      })  
    }
  }, [error]);

  useEffect(() => {
    // Init put.io API
    const putioAPI = new PutioAPI({ clientID: preferences.putioClientId })
    putioAPI.setToken(preferences.putioOAuthToken)

    // Query for a list of files
    var file_id = transferDetails ? transferDetails.file_id : -1
    putioAPI.Files.Query(file_id)
      .then(t => {
        // console.log('Querying ', transferDetails.name, " file id: ", transferDetails.file_id, "url: ", transferDetails.download_id); 
        // console.log('Number of fetched files: ', t.data.files.length); 
        setFiles(t.data.files)
      })
      .catch(e => { 
        console.log('An error occurred while fetching files: ', e)
        setError(new Error("Error fetching file details. Check your Client ID and OAuth Token settings."))
      })
  }, [transferDetails]);

  return (
    <List isLoading={files === undefined}
          isShowingDetail={isShowingDetail}
          navigationTitle="Put.io Files"
    >
      { files && 
        Object.values(files).map(file => {

        return (
          <List.Item
          key={`${file.id}`}
          icon={`${file.icon}`}
          title={`${file.name}`}
          actions={
            <ActionPanel title="File Actions">
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

export default FileList;