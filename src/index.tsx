import { ActionPanel, Detail, List, Action } from "@raycast/api";
import PutioAPI from '@putdotio/api-client'

export default function Command() {

  const putioAPI = new PutioAPI({ clientID: '5746' })
  putioAPI.setToken("VGDZI7MZV4EHEVUQOMZN")
  putioAPI.Account.Info()
    .then(r => console.log('Fetched user info: ', r))
    .catch(e => console.log('An error occurred while fetching user info: ', e))
  
  putioAPI.Transfers.Query(100, 100)
    .then(t => console.log('Fetched transfers: ', t.data))
    .catch(e => console.log('An error occurred while fetching transfers: ', e))

  return (
    <List>
      <List.Item
        icon="list-icon.png"
        title="Greeting"
        actions={
          <ActionPanel>
            <Action.Push title="Show Details" target={<Detail markdown="# Hey! 👋" />} />
          </ActionPanel>
        }
      />
    </List>
  );
}
