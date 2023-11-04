import os from "os";
import path from "path";
import { ActionPanel, Action, Icon, openExtensionPreferences, useNavigation } from "@raycast/api";
import PutioAPI, { IFile } from "@putdotio/api-client";
import doFileAction from "../utils/doFileAction";
import FileBrowser from "../views/FileBrowser";
import { preferences } from "../preferences";

function FileActions({ file, fileUrl, showBrowseFile }: { file: IFile, fileUrl: string, showBrowseFile: boolean }) {
  const downloadsDirectory = path.join(os.homedir(), "Downloads");
  return (
    <ActionPanel title="Actions">
      {showBrowseFile && (<Action
        title={"Browse File(s)"}
        icon={Icon.List}
        onAction={() => push(<FileBrowser parent_file_id={file.id} />)}
      />
      )}
      {fileUrl && <Action.OpenInBrowser url={fileUrl} />}
      {fileUrl && (
        <Action
          title="curl to ~/Downloads"
          icon={Icon.Download}
          shortcut={{ modifiers: ["cmd", "shift"], key: "1" }}
          onAction={() => {
            doFileAction("/usr/bin/curl -o '"+downloadsDirectory+"/"+file.name+"' '{0}'", fileUrl);
          }}
        />
      )}
      {fileUrl && (
        <Action
          title={preferences.actionTitle1 ? preferences.actionTitle1 : "(Configure Custom Action #1)"}
          icon={Icon.Download}
          shortcut={{ modifiers: ["cmd", "shift"], key: "2" }}
          onAction={() => {
            if (preferences.actionTitle1 === null) {
              openExtensionPreferences();
            } else {
              doFileAction(preferences.actionCommand1, fileUrl);
            }
          }}
        />
      )}
      {fileUrl && (
        <Action
          title={preferences.actionTitle2 ? preferences.actionTitle2 : "(Configure Custom Action #2)"}
          icon={Icon.Download}
          shortcut={{ modifiers: ["cmd", "shift"], key: "3" }}
          onAction={() => {
            if (preferences.actionTitle2 === null) {
              openExtensionPreferences();
            } else {
              doFileAction(preferences.actionCommand2, fileUrl);
            }
          }}
        />
      )}
    </ActionPanel>
  );
}

export default FileActions;
