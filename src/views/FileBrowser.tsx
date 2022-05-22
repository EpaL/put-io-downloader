import { ActionPanel, showToast, Toast, showHUD, Detail, List, Action, Icon, useNavigation } from "@raycast/api";
import { useEffect, useState } from "react";
import DownloadFile from "../components/DownloadFile";
import FileDetails from "../components/FileDetails";
import formatString from "../utils/formatString";
import PutioAPI, { Transfer  } from '@putdotio/api-client'
import { preferences } from "../preferences";

function FileBrowser({parent_file_id}: {parent_file_id: number}) {
  // State vars and handlers
  const [file, setFile] = useState<IFile>();
  const [fileUrl, setFileUrl] = useState<string>();
  const [files, setFiles] = useState<IFile[]>();
  const [downloadType, setDownloadType] = useState<string>();
  const [isShowingDetail, setIsShowingDetail] = useState(false);  
  const [error, setError] = useState<Error>();
  const { exec } = require("child_process");
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

  //
  // Populate the list of files (if a folder), or information about the file (if a single file).
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
          // Get the URL of the file
          putioAPI.File.GetStorageURL(t.data.parent.id)
            .then(t => {
              console.log('File URL is: ', t.data.url); 
              setFileUrl(t.data.url)
            })
            .catch(e => { 
              console.log('An error occurred while fetching file URL: ', e)
              setError(new Error("Error fetching file URL details. Check your Client ID and OAuth Token settings."))
            });
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

  //
  // Handle initiating file downloads
  useEffect(() => {
    if (fileUrl !== undefined && downloadType !== undefined) {
      var cmd = null
      console.log("Downloading ", fileUrl);
      if (downloadType == "TVSHOW") {
        cmd = formatString(preferences.tvShowDownloadCommand, fileUrl);
      } else if (downloadType == "MOVIE") {
        cmd = formatString(preferences.movieDownloadCommand, fileUrl);
      }
      console.log("Executing command: ", cmd);
      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        showHUD("⬇️ Download started.");
    });
    }
  }, [downloadType]);  

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
              {
                fileUrl && (
                  <Action.OpenInBrowser url={fileUrl} />              
                )
              }
              <Action
                title={"Download TV Show"}
                icon={Icon.Download}
                onAction={() => {
                  setDownloadType("TVSHOW");
                }}
                />
              <Action
                title="Download Movie"
                icon={Icon.Download}
                onAction={() => {
                  setDownloadType("MOVIE");
                }}             
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