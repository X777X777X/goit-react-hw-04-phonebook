import React, { Component } from 'react';
import { ContactForm } from './ContactForm/ContactForm';
import { ContactList } from './ContactList/ContactList';
import { Filter } from './Filter/Filter';
import { nanoid } from 'nanoid';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.module.css';

export class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  //Проверяем наличие сохраненных контактов в localStorage
  componentDidMount() {
    const savedContacts = localStorage.getItem('contacts');
    if (savedContacts) {
      this.setState({ contacts: JSON.parse(savedContacts) });
    }
  }

  //Сохраняем контакты в localStorage если они изменились
  componentDidUpdate(prevProps, prevState) {
    const { contacts } = this.state;
    if (prevState.contacts !== contacts) {
      localStorage.setItem('contacts', JSON.stringify(contacts));
    }
  }

  formSubmit = ({ name, number }) => {
    const { contacts } = this.state;

    // Проверка наличия контакта с таким же именем
    const existingContact = contacts.find(
      contact => contact.name.toLowerCase() === name.toLowerCase()
    );

    // Проверка наличия контакта с таким же номером
    if (existingContact) {
      toast.error(`${name} уже существует в контактах!`);
    } else if (!this.isValidPhoneNumber(number)) {
      toast.error('Некорректный формат номера!');
    } else {
      const contact = {
        id: nanoid(),
        name,
        number,
      };
      this.setState(prevState => ({
        contacts: [contact, ...prevState.contacts],
      }));
    }
  };

  changeFilterInput = e => {
    this.setState({ filter: e.target.value });
  };

  findContacts = () => {
    const { filter, contacts } = this.state;
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(filter.toLowerCase())
    );
  };

  deleteContact = id => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== id),
    }));
  };

  isValidPhoneNumber = number => {
    const regexPattern =
      /^\+?\d{1,4}[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
    return regexPattern.test(number);
  };

  render() {
    const { filter } = this.state;
    return (
      <section>
        <ToastContainer autoClose={5000} />
        <h1>Phonebook</h1>
        <ContactForm onSubmit={this.formSubmit} />
        <h2>Contacts</h2>
        <Filter filter={filter} changeFilterInput={this.changeFilterInput} />
        <ContactList
          contacts={this.findContacts()}
          deleteContact={this.deleteContact}
        />
      </section>
    );
  }
}
