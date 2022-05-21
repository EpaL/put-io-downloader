import { ActionPanel, showToast, Toast, Detail, List, Action, Icon, useNavigation } from "@raycast/api";
import { useEffect, useState } from "react";
import DownloadFile from "../components/DownloadFile";
import PutioAPI, { Transfer  } from '@putdotio/api-client'
import { preferences } from "../preferences";

function FileList({parent_file_id}: {parent_file_id: number}) {
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

    // Do we have a parent folder?
    var file_id = parent_file_id ? parent_file_id : -1
    // Query for a list of files
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
  }, [parent_file_id]);

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
              {
                file.file_type == "FOLDER" ? (
                  <Action
                  title={"Browse Folder"}
                  icon={Icon.List}
                  onAction={() => push(<FileList parent_file_id={file.id} />)}
                  />                  
                ) : null
              }
              <Action
                title={"Download TV Show"}
                icon={Icon.Download}
                onAction={() => push(<DownloadFile file={file} type="TVSHOW"/>)}
                />
              <Action
                title="Download Movie"
                icon={Icon.Download}
                onAction={() => push(<DownloadFile file={file} type="MOVIE"/>)}
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