import { Fragment } from "react";
import { Color, List } from "@raycast/api";
import formatDate from "../utils/formatDate";
import formatSize from "../utils/formatSize";
import PutioAPI, { Transfer } from '@putdotio/api-client'

function TransferDetails({transferDetails}: {transferDetails: Transfer}) {
  return (
    <List.Item.Detail
      metadata={
        <List.Item.Detail.Metadata>
          <List.Item.Detail.Metadata.Label title="Details" />
          <List.Item.Detail.Metadata.Separator />
          <Fragment key="finishedAt">
            <List.Item.Detail.Metadata.Label title="Finished" text={formatDate(new Date(transferDetails.finished_at))} icon={null} />
            <List.Item.Detail.Metadata.Separator />
          </Fragment>
          <Fragment key="size">
            <List.Item.Detail.Metadata.Label title="Size" text={formatSize(transferDetails.size, true, 2)} icon={null} />
            <List.Item.Detail.Metadata.Separator />
          </Fragment>
          <Fragment key="ratio">
            <List.Item.Detail.Metadata.Label title="Ratio" text={`${transferDetails.current_ratio}:1`} icon={null} />
            <List.Item.Detail.Metadata.Separator />
          </Fragment>
          <Fragment key="peers">
            <List.Item.Detail.Metadata.Label title="Peers" text={`${transferDetails.peers_getting_from_us} sending ${transferDetails.peers_sending_to_us} receiving`} icon={null} />
            <List.Item.Detail.Metadata.Separator />
          </Fragment>
        </List.Item.Detail.Metadata>
      }
    />
  );
}

export default TransferDetails;