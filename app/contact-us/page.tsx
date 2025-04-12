'use client';
import React, { useState } from "react";
import { Amplify } from "aws-amplify";
import './style.css';

import { withAuthenticator } from "@aws-amplify/ui-react";

import config from "../../amplify_outputs.json";

Amplify.configure(config);

const API_ENDPOINT = 'https://oiaei37691.execute-api.ap-south-1.amazonaws.com/live/live';

function Example() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        company: '',
        title: '',
        email: '',
        subject: '',
        body: '',
        to: 'sanjay.saini@lokmat.com', // 👈 Add this line
      });


  const [status, setStatus] = useState({ message: '', type: '' });

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setStatus({ message: '', type: '' });

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus({ message: 'Message sent successfully!', type: 'success' });
        setFormData({
          firstName: '',
          lastName: '',
          company: '',
          title: '',
          email: '',
          subject: '',
          body: '',
          to:'sanjay.saini@lokmat.com'
        });
              // ⏳ Wait 5 seconds, then redirect
      setTimeout(() => {
        window.location.href = '/';
      }, 5000);
      } else {
        throw new Error(result.message || 'Error sending message');
      }
    } catch (error) {
      setStatus({ message: "Error-0" || 'Error', type: 'error' });
    }
  };


  return (
    <>
  <div className="contactwrapper">
  <div className="contactwrapper-inner">
    <h1 className="brandlogo">
      <img src="https://lokmat.com/static/asera/asera-logo.png" alt="Asera Minings" />
    </h1>
    <h2>Contact Us</h2>
    <form onSubmit={handleSubmit}>
  <input
    placeholder="First Name"
    required
    type="text"
    name="firstName"
    value={formData.firstName}
    onChange={handleChange}
  />
  <input
    placeholder="Last Name"
    required
    type="text"
    name="lastName"
    value={formData.lastName}
    onChange={handleChange}
  />
  <input
    placeholder="Company"
    required
    type="text"
    name="company"
    value={formData.company}
    onChange={handleChange}
  />
  <input
    placeholder="Title"
    required
    type="text"
    name="title"
    value={formData.title}
    onChange={handleChange}
  />
  <input
    placeholder="Email"
    required
    type="email"
    name="email"
    value={formData.email}
    onChange={handleChange}
  />
  <input
    placeholder="Subject"
    required
    type="text"
    name="subject"
    value={formData.subject}
    onChange={handleChange}
  />
  <textarea
    name="body"
    placeholder="Message"
    rows={5}
    required
    value={formData.body}
    onChange={handleChange}
  />
  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
    <button type="submit">Submit</button>
    <button type="button" onClick={() =>window.location.href = '/'}>
      Close
    </button>
  </div>
  {status.message && (
    <p style={{ textAlign: 'center', color: status.type === 'error' ? 'red' : 'green' }}>
      {status.message}
    </p>
  )}
</form>

  </div>
</div>
    </>
  );
}

// export default withAuthenticator(Example);
export default Example;
