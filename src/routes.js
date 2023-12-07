import CardSkeleton from '@components/card-element/CardSkeleton';
import ProtoctedRoute from '@pages/ProtoctedRoute';
import { AuthTabs, ForgotPassword, ResetPassword } from '@pages/auth';
import Error from '@pages/error/Error';
import NotificationSkeleton from '@pages/social/notifications/NotificationSkeleton';
import PhotoSkeleton from '@pages/social/photos/PhotoSkeleton';
import StreamsSkeleton from '@pages/social/streams/StreamsSkeleton';
import { Suspense, lazy } from 'react';
import { useRoutes } from 'react-router-dom';

const Social = lazy(() => import('@pages/social/Social'));
const Chat = lazy(() => import('@pages/social/chat/Chat'));
const Followers = lazy(() => import('@pages/social/followers/Followers'));
const Following = lazy(() => import('@pages/social/following/Following'));
const Notifications = lazy(() => import('@pages/social/notifications/Notifications'));
const People = lazy(() => import('@pages/social/people/People'));
const Photos = lazy(() => import('@pages/social/photos/Photos'));
const Profile = lazy(() => import('@pages/social/profile/Profile'));
const Streams = lazy(() => import('@pages/social/streams/Streams'));

export const AppRouter = () => {
  const elements = useRoutes([
    {
      path: '/',
      element: <AuthTabs />
    },
    {
      path: '/forgot-password',
      element: <ForgotPassword />
    },
    {
      path: '/reset-password',
      element: <ResetPassword />
    },
    {
      path: '/app/social',
      element: (
        <ProtoctedRoute>
          <Social />
        </ProtoctedRoute>
      ),
      children: [
        {
          path: 'streams',
          element: (
            <Suspense fallback={<StreamsSkeleton />}>
              <Streams />
            </Suspense>
          )
        },
        {
          path: 'chat/messages',
          element: (
            <Suspense>
              <Chat />
            </Suspense>
          )
        },
        {
          path: 'people',
          element: (
            <Suspense fallback={<CardSkeleton />}>
              <People />
            </Suspense>
          )
        },
        {
          path: 'followers',
          element: (
            <Suspense fallback={<CardSkeleton />}>
              <Followers />
            </Suspense>
          )
        },
        {
          path: 'following',
          element: (
            <Suspense fallback={<CardSkeleton />}>
              <Following />
            </Suspense>
          )
        },
        {
          path: 'photos',
          element: (
            <Suspense fallback={<PhotoSkeleton />}>
              <Photos />
            </Suspense>
          )
        },
        {
          path: 'notifications',
          element: (
            <Suspense fallback={<NotificationSkeleton />}>
              <Notifications />
            </Suspense>
          )
        },
        {
          path: 'profile/:username',
          element: (
            <Suspense>
              <Profile />
            </Suspense>
          )
        }
      ]
    },
    {
      path: '*',
      element: <Error />
    }
  ]);

  return elements;
};
