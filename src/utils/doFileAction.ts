import { showToast, Toast } from "@raycast/api";
import { exec } from "child_process";
import formatString from "./formatString";

const doFileAction = (actionCommand: string | undefined, fileUrl: string) => {
  if (fileUrl !== undefined && actionCommand !== undefined) {
    const cmd = formatString(actionCommand ? actionCommand : "(no command defined)", fileUrl);
    console.log("Executing command: " + cmd);
    exec(cmd, (error: Error | null, stdout: string, stderr: string) => {
      if (error) {
        console.log(`error: ${error.message}`);
        showToast({
          style: Toast.Style.Failure,
          title: "Error",
          message: "Custom Action failed.",
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
        message: "⬇️ Action success.",
      });
    });
  }
};

export default doFileAction;
