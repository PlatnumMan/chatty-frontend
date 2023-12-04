import { authHandlers } from '@mocks/handlers/auth';
import { setupServer } from 'msw/node';

// setup reques intersections using  the given handlers
export const server = setupServer(...authHandlers);
