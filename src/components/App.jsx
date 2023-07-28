import { useEffect, useState } from 'react';
import  ContactForm  from './ContactForm/ContactForm';
import { ContactList } from './ContactList/ContactList';
import { Filter } from './Filter/Filter';
import { nanoid } from 'nanoid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './App.module.css';

function App() {
  const [contacts, setContacts] = useState(
    () => JSON.parse(localStorage.getItem('contacts')) ?? []
  );

  useEffect(() => {
    window.localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  const [filter, setFilter] = useState('');

  const handleSubmit = ({ name, number }) => {
    const existingContact = contacts.find(
      contact => contact.name.toLowerCase() === name.toLowerCase()
    );

    if (existingContact) {
      toast.error(`${name} уже существует в контактах!`);
    } else if (!isValidPhoneNumber(number)) {
      toast.error('Некорректный формат номера!');
    } else {
      const contact = {
        id: nanoid(),
        name,
        number,
      };
      setContacts(prevContacts => [contact, ...prevContacts]);
    }
  };

  const handleFilterChange = e => {
    setFilter(e.target.value);
  };

  const findContacts = () =>
    contacts.filter(contact =>
      contact.name.toLowerCase().includes(filter.toLowerCase())
    );

  const deleteContact = id => {
    setContacts(prevContacts =>
      prevContacts.filter(contact => contact.id !== id)
    );
  };

  const isValidPhoneNumber = number => {
    const regexPattern =
      /^\+?\d{1,4}[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
    return regexPattern.test(number);
  };

  return (
    <section className={styles.container}>
      <ToastContainer autoClose={5000} />
      <h1>Phonebook</h1>
      <ContactForm onSubmit={handleSubmit} />
      <h2>Contacts</h2>
      <Filter filter={filter} changeFilterInput={handleFilterChange} />
      <ContactList contacts={findContacts()} deleteContact={deleteContact} />
    </section>
  );
}
export { App };
