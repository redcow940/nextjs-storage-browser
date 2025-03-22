import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "lokmatvideo",
  access: (allow: any) => ({
    
    'beta/*': [allow.authenticated.to(['read', 'write', 'delete'])],
    'contest/*': [allow.authenticated.to(['read'])],
    'live/*': [ allow.authenticated.to(['read', 'write'])],
    
    'protected-useronlyreadwritedelete/{entity_id}/*': [
      allow.authenticated.to(['read']),
      allow.entity('identity').to(['read', 'write', 'delete'])
    ],
    'private-useronlyreadwritedelete/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete'])
    ]
  })
});
