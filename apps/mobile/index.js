/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Prevent unhandled promise rejections from crashing the app
const originalHandler = ErrorUtils.getGlobalHandler();
ErrorUtils.setGlobalHandler((error, isFatal) => {
  console.error('[GlobalError]', isFatal ? 'FATAL' : 'non-fatal', error);
  if (originalHandler) {
    originalHandler(error, isFatal);
  }
});

AppRegistry.registerComponent(appName, () => App);
