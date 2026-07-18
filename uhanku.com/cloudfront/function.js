/* eslint-disable no-unused-vars -- AWS CloudFront invokes the exported handler. */
function handler(event) {
  let request = event.request;
  let uri = request.uri;

  // Let real files pass through: /assets/app.js, /favicon.ico, etc.
  if (uri.includes('.')) {
    return request;
  }

  // Send React routes like /me, /dashboard, /settings to index.html
  request.uri = '/index.html';
  return request;
}
