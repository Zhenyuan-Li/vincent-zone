import Head from 'next/head';

import EventList from '../../components/events/event-list';
import ResultsTitle from '../../components/events/results-title';
import Button from '../../components/ui/button';
import ErrorAlert from '../../components/ui/error-alert';
import { getFilteredEvents } from '../../lib/event-util';

function FilteredEventsPage(props) {
  const { hasError, events, date } = props;

  const pageHeadData = (
    <Head>
      <title>Filtered Events</title>
      <meta name="description" content={`A list of filtered events`} />
    </Head>
  );

  if (hasError) {
    return (
      <>
        {pageHeadData}
        <ErrorAlert>
          <p>Invalid filter, please adjust your values.</p>
        </ErrorAlert>
        <div className="center">
          <Button link="/events">Show All Events</Button>
        </div>
      </>
    );
  }

  if (!events || events.length == 0) {
    return (
      <>
        {pageHeadData}
        <ErrorAlert>
          <p>No events found for the chosen filter</p>
        </ErrorAlert>
        <div className="center">
          <Button link="/events">Show All Events</Button>
        </div>
      </>
    );
  }

  return (
    <>
      {pageHeadData}
      <ResultsTitle date={new Date(date.year, date.month)} />
      <EventList items={events} />
    </>
  );
}

export default FilteredEventsPage;

// It will be hard to choose which need to be pre-rendered. Also the data is mass.
export const getServerSideProps = async (ctx) => {
  const { params } = ctx;

  const filterData = params.slug;
  if (!filterData) {
    return <p className="center">Loading...</p>;
  }
  const [filteredYear, filteredMonth] = filterData;
  if (
    isNaN(+filteredYear) ||
    isNaN(+filteredMonth) ||
    +filteredYear > 2023 ||
    +filteredYear < 2022 ||
    +filteredMonth < 1 ||
    +filteredMonth > 12
  ) {
    return {
      props: {
        hasError: true,
      },
    };
  }

  const filterEvents = await getFilteredEvents({
    year: +filteredYear,
    month: +filteredMonth,
  });

  return {
    props: {
      events: filterEvents,
      date: {
        year: +filteredYear,
        month: filteredMonth - 1,
      },
    },
  };
};
