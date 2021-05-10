// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrlPrefix: 'http://localhost:8080/api/v1',
  qiniuUrlPrefix: 'http://qsiqf7q6k.hd-bkt.clouddn.com',
  webSocketUrlPrefix: 'ws://localhost:8080/api/v1/webSocket',
  rtmpUrlPrefix: 'rtmp://172.28.2.194'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
