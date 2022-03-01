import Image from 'next/image';

import Button from '../ui/button';
import DateIcon from '../ui/icons/date-icon';
import AddressIcon from '../ui/icons/address-icon';
import ArrowRightIcon from '../ui/icons/arrow-right-icon';
import classes from './event-item.module.css';

function EventItem(props) {
  const { title, image, date, location, id } = props;

  const humanReadableDate = new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const formattedAddress = location.replace(', ', '\n');
  const exploreLink = `/events/${id}`;

  return (
    <li className={classes.item}>
      <Image src={`/${image}`} alt={title} width={250} height={160} />

      <div className={classes.content}>
        <h2 className={classes.summary}>{title}</h2>
        <div className={classes.date}>
          <DateIcon />
          <time>{humanReadableDate}</time>
        </div>
        <div className={classes.address}>
          <AddressIcon />
          <address>{formattedAddress}</address>
        </div>
        <div className={classes.actions}>
          <Button link={exploreLink}>
            <span>Explore Event</span>
            <span className={classes.icon}>
              <ArrowRightIcon />
            </span>
          </Button>
        </div>
      </div>
    </li>
  );
}

export default EventItem;
