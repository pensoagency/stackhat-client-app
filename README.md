# React App Web Client

React based React App client.

## Technology Stack

* React
* Mobx
* Axios
* Bootstrap (currently v3, see https://5c507d49471426000887a6a7--react-bootstrap.netlify.com/components/modal/)
* SASS
* And more

## Development Environment

Clone repository and run:

`npm install`

To run locally run:

`npm run dev`

There are additional local configuration that use the test, demo and live instances, run respectively as follows:

`npm run devtest`
`npm run devdemo`
`npm run prodtest`

See the ~/src/config folder for the various environment configurations.

## Deployment

After running `npm run dist` or `npm run prod`, the files in ./dist must be uploaded to the S3 bucket named `stackhat` hosting the client application.

The stackhat CloudFront distribution ID `E1APPLI1ZYV37D` needs to be invalidated. Copy an existing /* invalidation and wait for that to complete. 

The application is now updated.
