import { useRouter } from 'next/router';

import EventList from '../../components/events/event-list';
import EventSearch from '../../components/events/event-search';
import { getAllEvents } from '../../lib/event-util';

function AllEventsPage(props) {
  const router = useRouter();
  const { events } = props;

  const findEventsHandler = (year, month) => {
    const fullPath = `/events/${year}/${month}`;

    router.push(fullPath);
  };

  return (
    <div>
      <EventSearch onSearch={findEventsHandler} />
      <EventList items={events} />
    </div>
  );
}

export default AllEventsPage;

export const getStaticProps = async (ctx) => {
  const events = await getAllEvents();

  return {
    props: { events },
    revalidate: 60,
  };
};
