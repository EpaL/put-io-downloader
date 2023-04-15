import { showToast, Toast } from "@raycast/api";
import { preferences } from "../preferences";
import { exec } from "child_process";
import formatString from "../utils/formatString";

const doFileAction = (fileAction: string, fileUrl: string) => {
  if (fileUrl !== undefined && fileAction !== undefined) {
    let cmd = "";
    switch (fileAction) {
      case "action1":
        cmd = formatString(preferences.actionCommand1 ? preferences.actionCommand1 : "(no command defined)", fileUrl);
        break;
      case "action2":
        cmd = formatString(preferences.actionCommand2 ? preferences.actionCommand2 : "(no command defined)", fileUrl);
        break;
    }
    console.log("Executing command: " + cmd);
    exec(cmd, (error: Error | null, stdout: string, stderr: string) => {
      if (error) {
        console.log(`error: ${error.message}`);
        showToast({
          style: Toast.Style.Failure,
          title: "Error",
          message: "Starting download failed.",
        });
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      showToast({
        style: Toast.Style.Success,
        title: "Success",
        message: "⬇️ Download started.",
      });
    });
  }

};

export default doFileAction;
