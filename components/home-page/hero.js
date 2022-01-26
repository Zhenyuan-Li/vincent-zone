import Image from 'next/image';

import classes from './home.module.css';

function Hero() {
  return (
    <section className={classes.hero}>
      <div className={classes.image}>
        <Image
          src="/images/site/George.JPG"
          alt="George"
          width={300}
          height={300}
        />
      </div>
      <h1>Hi, I am Vincent</h1>
      <p>A Passionate Full Stack Developer</p>
    </section>
  );
}

export default Hero;
