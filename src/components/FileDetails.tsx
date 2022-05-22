import { Fragment } from "react";
import { Color, Detail } from "@raycast/api";
import formatDate from "../utils/formatDate";
import formatSize from "../utils/formatSize";
import PutioAPI, { IFile } from '@putdotio/api-client'

function FileDetails({file}: {file: IFile}) {
  return (
    <Detail.Metadata>
      <Detail.Metadata.Label title="Type" text={file.content_type} icon={null} />
      <Detail.Metadata.Label title="Size" text={formatSize(file.size, true, 2)} icon={null} />
      <Detail.Metadata.Label title="Created" text={file.created_at} icon={null} />
    </Detail.Metadata>
  );
}

export default FileDetails;