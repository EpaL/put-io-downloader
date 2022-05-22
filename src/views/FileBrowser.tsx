import { ActionPanel, showToast, Toast, Detail, List, Action, Icon, useNavigation } from "@raycast/api";
import { useEffect, useState } from "react";
import DownloadFile from "../components/DownloadFile";
import FileDetails from "../components/FileDetails";
import PutioAPI, { Transfer  } from '@putdotio/api-client'
import { preferences } from "../preferences";

function FileBrowser({parent_file_id}: {parent_file_id: number}) {
  // State vars and handlers
  const [file, setFile] = useState<IFile>();
  const [files, setFiles] = useState<IFile[]>();
  const [isShowingDetail, setIsShowingDetail] = useState(false);  
  const [error, setError] = useState<Error>();
  const { push } = useNavigation();

  console.log("parent file id: ", parent_file_id);

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

    // Query for a list of files and then reverse-sort by creation date/time
    var file_id = parent_file_id ? parent_file_id : -1
    putioAPI.Files.Query(file_id)
      .then(t => {
        if (t.data.files.length == 0) {
          // If the files array is empty, it means this is just a file, not a directory.
          // Set the file to the 'parent' object, which contains the file info.
          setFile(t.data.parent);
        } else {
          // The files array isn't empty, which means this is a folder.
          // Set the files object to the 'files' array, which contains the list of files in the folder.
          setFiles(t.data.files.sort((n1,n2) => {
            if (n1.created_at < n2.created_at) {
                return 1;
            }
        
            if (n1.created_at > n2.created_at) {
                return -1;
            }
            return 0;
          }))
        }
      })
      .catch(e => { 
        console.log('An error occurred while fetching files: ', e)
        setError(new Error("Error fetching file details. Check your Client ID and OAuth Token settings."))
      })
  }, [parent_file_id]);


  // If neither files or file are populated yet, display an empty list with the loading animation.
  if (files === undefined && file === undefined) {
    return (
      <List isLoading={true}
            navigationTitle="Put.io Files"
      >
      </List>
    )
  } else if (files !== undefined && files?.length > 0) {
    //
    // List of files
    return (
      <List isLoading={files === undefined && file === undefined}
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
              <ActionPanel title="Actions">
                <Action
                title={"Browse File(s)"}
                icon={Icon.List}
                onAction={() => push(<FileBrowser parent_file_id={file.id} />)}
                />                  
              </ActionPanel>
            }
            />  
          )
          }
        )}
      </List>
    );
  } else {
    if (file !== undefined) {
      //
      // One file - show the file details
      return (
        <Detail
          markdown={formatFileInfo(file)}
          metadata={
            (
              <FileDetails file={file}
              />
            )
          }
          actions={
            <ActionPanel title="File Actions">
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
          >
        </Detail>
      );
    }
  }

}

function formatFileInfo(file: IFile): string
{
  return `
# ${file.name}
![](${file.screenshot})
`;
}

export default FileBrowser;