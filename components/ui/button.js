import Link from 'next/link';

import classes from './button.module.css';

function Button(props) {
  const { link, children, onClick } = props;

  return link ? (
    <Link href={link}>
      {/* Add anchor tag to customize link. Next will detect it */}
      <a className={classes.btn}>{children}</a>
    </Link>
  ) : (
    <button className={classes.btn} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
