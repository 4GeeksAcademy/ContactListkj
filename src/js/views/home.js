import React, { useState, useEffect } from "react";

export const Home = () => {
  const [contacts, setContacts] = useState([]);
  const [showAddContactForm, setShowAddContactForm] = useState(false);
  const [newContact, setNewContact] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    image: "", 
  });

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch("https://playground.4geeks.com/contact/agendas/kaylaa/contacts", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch contacts");
        }
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setContacts(data);
        } else {
          console.error("Expected an array for contacts, received:", data);
          setContacts([]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchContacts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContact(prevContact => ({ ...prevContact, [name]: value }));
  };

  const handleAddContact = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://playground.4geeks.com/contact/agendas/kaylaa/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newContact),
      });
      if (!response.ok) {
        throw new Error("Failed to add contact");
      }
      const addedContact = await response.json();
      setContacts(prevContacts => [...prevContacts, addedContact]);
      setNewContact({ name: "", address: "", phone: "", email: "", image: "" });
      setShowAddContactForm(false); 
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteContact = async (id) => {
    try {
      const response = await fetch(`https://playground.4geeks.com/contact/agendas/kaylaa/contacts/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete contact");
      }
      setContacts(prevContacts => prevContacts.filter(contact => contact.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container" style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
      <h1>Contact List</h1>
      <button onClick={() => setShowAddContactForm(true)} style={{ marginBottom: "20px" }}>
        Add New Contact
      </button>
      {showAddContactForm ? (
        <form onSubmit={handleAddContact}>
          <input type="text" name="name" value={newContact.name} onChange={handleInputChange} placeholder="Name" required />
          <input type="text" name="address" value={newContact.address} onChange={handleInputChange} placeholder="Address" required />
          <input type="text" name="phone" value={newContact.phone} onChange={handleInputChange} placeholder="Phone Number" required />
          <input type="email" name="email" value={newContact.email} onChange={handleInputChange} placeholder="Email Address" required />
          <input type="url" name="image" value={newContact.image} onChange={handleInputChange} placeholder="Image URL" />
          <button type="submit">Submit</button>
          <button type="button" onClick={() => setShowAddContactForm(false)}>Cancel</button>
        </form>
      ) : (
        <ul>
          {Array.isArray(contacts) && contacts.map(contact => (
            <li key={contact.id}>
              <img src={contact.image} alt={contact.name} style={{ width: "50px", height: "50px", objectFit: "cover" }} />
              <div>{contact.name}</div>
              <div>{contact.address}</div>
              <div>{contact.phone}</div>
              <div>{contact.email}</div>
              <button onClick={() => handleDeleteContact(contact.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;