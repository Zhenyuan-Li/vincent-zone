import { useState, useContext } from 'react';

import Button from '../ui/button';
import NotificationContext from '../../store/notification-context';
import classes from './contact-form.module.css';

function ContactForm() {
  const [enteredEmail, setEnteredEmail] = useState('');
  const [enteredName, setEnteredName] = useState('');
  const [enteredMessage, setEnteredMessage] = useState('');
  const { showNotification } = useContext(NotificationContext);

  const sendMessageHandler = async (event) => {
    event.preventDefault();

    showNotification({
      title: 'Sending...',
      message: 'Message is in the air...',
      status: 'pending',
    });

    fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        email: enteredEmail,
        name: enteredName,
        message: enteredMessage,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return res.json().then((data) => {
          throw new Error(data.message || 'Something went wrong');
        });
      })
      .then((_) => {
        showNotification({
          title: 'Success!',
          message: 'Successfully Send Message to Vincent',
          status: 'success',
        });
      })
      .catch((error) => {
        showNotification({
          title: 'Error!',
          message: error.message || 'Something Went Wrong!',
          status: 'error',
        });
      });
  };

  return (
    <section className={classes.contact}>
      <h1>How can I help you?</h1>
      <form className={classes.form} onSubmit={sendMessageHandler}>
        <div className={classes.controls}>
          <div className={classes.control}>
            <label htmlFor="email">Your Email</label>
            <input
              value={enteredEmail}
              onChange={(e) => setEnteredEmail(e.target.value)}
              type="email"
              id="email"
              required
            />
          </div>
          <div className={classes.control}>
            <label htmlFor="name">Your Name</label>
            <input
              value={enteredName}
              onChange={(e) => setEnteredName(e.target.value)}
              type="text"
              id="name"
              required
            />
          </div>
        </div>
        <div className={classes.control}>
          <label htmlFor="message">Your Message</label>
          <textarea
            value={enteredMessage}
            onChange={(e) => setEnteredMessage(e.target.value)}
            id="message"
            rows="5"
          ></textarea>
        </div>
        <Button>Send Message</Button>
      </form>
    </section>
  );
}

export default ContactForm;
