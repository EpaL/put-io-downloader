import { Fragment } from "react";
import { Color, Icon, List } from "@raycast/api";
import formatDate from "../utils/formatDate";
import formatSize from "../utils/formatSize";
import PutioAPI, { Transfer } from '@putdotio/api-client'

function TransferDetails({transferDetails}: {transferDetails: Transfer}) {
  return (
    <List.Item.Detail
      metadata={
        <List.Item.Detail.Metadata>
          <List.Item.Detail.Metadata.Label title="Transfer Details" />
          <List.Item.Detail.Metadata.Separator />
          <Fragment key="finishedAt">
            <List.Item.Detail.Metadata.Label title="Finished" text={formatDate(new Date(transferDetails.finished_at!))} icon={Icon.Calendar} />
            <List.Item.Detail.Metadata.Separator />
          </Fragment>
          <Fragment key="size">
            <List.Item.Detail.Metadata.Label title="Size" text={formatSize(transferDetails.size, true, 2)} icon={Icon.List} />
            <List.Item.Detail.Metadata.Separator />
          </Fragment>
          <Fragment key="status">
            <List.Item.Detail.Metadata.Label title="Status" text={`${transferDetails.status}`} icon={Icon.Checkmark} />
            <List.Item.Detail.Metadata.Separator />
          </Fragment>
          <Fragment key="tracker">
            <List.Item.Detail.Metadata.Label title="Tracker" text={`${transferDetails.tracker}`} icon={Icon.Binoculars} />
            <List.Item.Detail.Metadata.Separator />
          </Fragment>
          <Fragment key="tracker_message">
            <List.Item.Detail.Metadata.Label title="Tracker Message" text={transferDetails.tracker_message ? transferDetails.tracker_message : "(empty)"} icon={Icon.Message} />
            <List.Item.Detail.Metadata.Separator />
          </Fragment>
          <Fragment key="ratio">
            <List.Item.Detail.Metadata.Label title="Ratio" text={`${transferDetails.current_ratio}`} icon={Icon.TwoArrowsClockwise} />
            <List.Item.Detail.Metadata.Separator />
          </Fragment>
          <Fragment key="peers">
            <List.Item.Detail.Metadata.Label title="Peers" text={`${transferDetails.peers_getting_from_us} sending ${transferDetails.peers_sending_to_us} receiving`} icon={Icon.Person} />
            <List.Item.Detail.Metadata.Separator />
          </Fragment>
        </List.Item.Detail.Metadata>
      }
    />
  );
}

export default TransferDetails;