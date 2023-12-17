import { useRouter } from 'next/router';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import _Navigation from "../components/_Navigation";
import '../styles/globals.css'
import UserSessionContext from '../libs/contexts/UserSessionContext';
import useUserSession from '../libs/hooks/useUserSession';
import UserContext from '../libs/contexts/UserContext';
import useUser from '../libs/hooks/useUser';
import ToastContext from '../libs/contexts/ToastContext';
import useToast from '../libs/hooks/useToast';
import Toast from '../components/Toast';

const PATHS = {
  '/': 'Home',
  '/explore': 'Explore',
  '/create_room': 'Create Room',
  '/chat': 'Chat',
  '/chat/[chat_id]': 'Chat',
  '/rooms': 'Rooms',
  '/rooms/[room_id]': 'Rooms',
  '/friends': 'Freinds',
  '/settings': 'Settings',
  '/user/[user_id]': 'User Profile',
  '/sign_in': 'Sign In',
  '/sign_up': 'Sign up',
};

// NOTE: White list paths are the paths that does not require access_token to be rendered.
const WHITE_LIST_PATHS = ['/sign_in', '/sign_up'];

function MyApp({ Component, pageProps }) {
  const toastManager = useToast();

  let router = useRouter();
  const getPageTitle = (): string => {
    let pathname = router.pathname;
    let pageTitle = PATHS[pathname];
    if (pageTitle) {
      return pageTitle;
    }

    return 'NOT FOUND';
  }

  const { userSession } = useUserSession();
  const { user } = useUser();

  if (WHITE_LIST_PATHS.includes(router.pathname)) {
    return (
      <ToastContext.Provider value={toastManager}>
        <div className='flex flex-col sm:flex-row background h-screen w-screen'>
          <_Navigation page={router.pathname} />
          <div className='h-full lg:w-5/6 md:w-11/12 w-full bg-[#f1f5fe] sm:rounded-l-3xl flex flex-col items-center py-4'>
            <div className='w-11/12 text-start font-mono font-bold text-2xl py-2 text-[#02166c]'>{getPageTitle()}</div>
            <Component {...pageProps} />
          </div>
        </div>
        <Toast />
      </ToastContext.Provider>
    )
  }


  if (userSession.access_token) {
    return (
      <ToastContext.Provider value={toastManager}>
        <UserSessionContext.Provider value={userSession} >
          <UserContext.Provider value={user}>
            <div className='flex flex-col sm:flex-row background h-screen w-full'>
              <Navigation page={router.pathname} />
              <div className='h-full lg:w-5/6 md:w-11/12 w-full bg-[#f1f5fe] sm:rounded-l-3xl flex flex-col items-center sm:py-4'>
                <Header />
                <div className='w-11/12 text-start font-mono font-bold text-2xl py-2 text-purple-900 uppercase'>{getPageTitle()}</div>
                <Component {...pageProps} />
              </div>
            </div>
            <Toast />
          </UserContext.Provider>
        </UserSessionContext.Provider>
      </ToastContext.Provider>
    )
  }

  return <div className='w-full h-screen bg-gray-100 text-gray-900 flex items-center justify-center'>Loading...</div>
}

export default MyApp
