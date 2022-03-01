import { useContext } from 'react';

import MainNavigation from './main-navigation';
import Notification from '../ui/notification';
import NotificationContext from '../../store/notification-context';

function Layout(props) {
  const { children } = props;
  const { notification: activeNotification } = useContext(NotificationContext);

  return (
    <>
      <MainNavigation />
      <main>{children}</main>
      {activeNotification && (
        <Notification
          title={activeNotification.title}
          message={activeNotification.message}
          status={activeNotification.status}
        />
      )}
    </>
  );
}

export default Layout;
