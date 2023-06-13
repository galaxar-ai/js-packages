import React from 'react';
import { AppNavigator } from '@genx/react';
import bookingRoutes from './routes';

export { default as config } from './config';

export default () => <AppNavigator {...bookingRoutes} />;
