const sanityClient = require('@sanity/client');

const client = sanityClient({
  projectId: 'r6dylyos',
  dataset: 'production',
  apiVersion: '2023-07-01',
  token: process.env.SANITY_TOEKN,
  useCdn: false,
});

export { client };