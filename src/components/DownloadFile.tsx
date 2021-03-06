import { Color, showToast, Toast, Detail, Form, List } from "@raycast/api";
import { useEffect, useState } from "react";
import PutioAPI, { IFile, Transfer } from "@putdotio/api-client";
import { preferences } from "../preferences";
import { start } from "repl";

function DownloadFile({ file, type }: { file: IFile; type: string }) {
  const [error, setError] = useState<Error>();
  const [fileUrl, setFileUrl] = useState<string>();
  const { exec } = require("child_process");

  // Get file information
  useEffect(() => {
    if (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Something went wrong",
      });
    }
  }, [error]);

  console.log("File: ", file);

  // Retrieve the file URL
  useEffect(() => {
    // Init put.io API
    const putioAPI = new PutioAPI({ clientID: Number(preferences.putioClientId) });
    putioAPI.setToken(preferences.putioOAuthToken);

    // Get the URL for the file
    putioAPI.File.GetStorageURL(file.id)
      .then((t) => {
        console.log("File URL is: ", t.data.url);
        setFileUrl(t.data.url);
      })
      .catch((e) => {
        console.log("An error occurred while fetching file URL: ", e);
        setError(new Error("Error fetching file URL details. Check your Client ID and OAuth Token settings."));
      });
  }, [file]);

  // Execute the download
  useEffect(() => {
    // Once the file URL is retrieved, send the download command.
    if (fileUrl !== undefined && preferences.tvShowDownloadCommand !== null) {
      console.log("Downloading ", fileUrl);
      const cmd = FormatString(preferences.tvShowDownloadCommand!, fileUrl);
      console.log("Executing command: ", cmd);
      exec(cmd, (error: { message: any }, stdout: any, stderr: any) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      });
    }
  }, [fileUrl]);

  if (type == "TVSHOW" && fileUrl !== null) {
    return <Detail markdown={formatDownloadInfo(file, fileUrl!)}></Detail>;
  } else {
    return <Form></Form>;
  }
}

function formatDownloadInfo(file: IFile, fileUrl: string): string {
  let startingDownload = "";

  if (fileUrl) {
    startingDownload = "Starting download [${fileUrl}](${fileUrl})";
  }
  return `
    # ${file.name}
    Size: ${file.size}
    Type: ${file.file_type}
    Content Type: ${file.content_type} 
    ${startingDownload}
  `;
}

function FormatString(str: string, ...val: string[]) {
  for (let index = 0; index < val.length; index++) {
    str = str.replace(`{${index}}`, val[index]);
  }
  return str;
}

export default DownloadFile;
