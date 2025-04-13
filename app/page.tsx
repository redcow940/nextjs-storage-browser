'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { signIn, signOut, getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';
import { Amplify } from 'aws-amplify';
import config from '@/amplify_outputs.json';
// import { useRouter } from 'next/navigation';
import {
  createStorageBrowser,
  createAmplifyAuthAdapter,
  elementsDefault,
} from '@aws-amplify/ui-react-storage/browser';
// import { StorageBrowser } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react-storage/styles.css';
import '@aws-amplify/ui-react-storage/storage-browser-styles.css';
// import { currentAuthenticatedUser } from 'aws-amplify/auth';
import { useRouter, usePathname } from 'next/navigation';

import './login-style.css';
import './login-style2.css';
Amplify.configure(config);

const authAdapter = createAmplifyAuthAdapter({
  options: {
    defaultPrefixes: ['files/'],
  },
});

const { StorageBrowser } = createStorageBrowser({
  elements: elementsDefault,
  config: authAdapter,
});

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [error, setError] = useState('');
  const [userProfile, setUserProfile] = useState('');


  const router = useRouter();

   // Check if the user is signed in when the component mounts
   useEffect(() => {
    console.log("----------------");
    const checkUser = async () => {
      try {
        const user = await getCurrentUser();
        console.log('Already signed in as:', user);
        setIsSignedIn(true);
      } catch {
        setIsSignedIn(false); // not signed in
      }
    };
    checkUser();
  }, []);

  const pathname = usePathname();

  useEffect(() => {
    if (userProfile !== 'reader') return;
  
    const targetNode = document.querySelector('.storage-browser');
    if (!targetNode) return;
  
    const removeUnwantedElements = () => {
      const actionsMenu = document.querySelector('.storage-browser__actions-menu');
      const uploadDropZone = document.querySelector('.storage-browser__upload-drop-zone');
      const createFolder = document.querySelector('[data-element-id="create-folder-menu-item"]');
  
      if (actionsMenu) actionsMenu.remove();
      if (uploadDropZone) uploadDropZone.remove();
      if (createFolder) createFolder.remove();
    };
  
    // Run initially in case elements are already present
    removeUnwantedElements();
  
    const observer = new MutationObserver(() => {
      removeUnwantedElements(); // Re-run every time DOM changes
    });
  
    observer.observe(targetNode, {
      childList: true,
      subtree: true,
    });
  
    return () => observer.disconnect();
  }, [userProfile]);
  

  
// useEffect(() => {
//   if (userProfile === 'reader') {
//     console.log("...............");
//     const removeActionsMenu = () => {
//       const actionsMenu = document.querySelector('.storage-browser__actions-menu');
//       if (actionsMenu) {
//         actionsMenu.remove();
//       }
//     };

//     // Run after a slight delay to ensure the DOM is rendered
//     const timeout = setTimeout(removeActionsMenu, 300);

//     return () => clearTimeout(timeout);
//   }
// }, [userProfile, pathname]);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const existingUser = await getCurrentUser();
      if (existingUser) {
        setIsSignedIn(true);
        return;
      }
    } catch {
      // no user signed in, continue to sign in
    }

    try {
      const user = await signIn({ username, password });
      console.log('Signed in:', user);
      setIsSignedIn(true);

      const attributes = await fetchUserAttributes();
      setUserProfile(attributes.profile || "reader");
      console.log("..............");
      console.log(userProfile);
// setIsSignedIn(true);

    } catch (err) {
      console.error('Sign-in error:', err);
      setError('Failed to sign in. Please check your credentials.');
    }
  };

  if (isSignedIn) {
    console.log('elementsDefault:', elementsDefault);

    return (
      <>
      <div style={{ padding: '2rem' }}>
                <h1 className="brandlogo">
          <img src="https://lokmat.com/static/asera/asera-logo.png" alt="Asera Minings" />
        </h1>
        <div className={userProfile === 'reader' ? 'reader-mode' : ''}>
          <StorageBrowser />
        </div>
        <button
          className="amplify-button amplify-button--secondary"
          onClick={() => {
            signOut();
            setIsSignedIn(false);
          }}
        >
          Sign Out
        </button>

      </div>
      <p><strong>CONFIDENTIAL</strong><br/>
The information contained in the below folders is proprietary and confidential information owned by Asera Mining AB. Its use, viewing and sharing is expressly meant for Asera’s employees and consultants and for authorised external parties covered under non-disclosure agreement established between such parties. No part of such information should be copied, downloaded, shared, photographed or disclosed to any person(s), without the written permission from Asera. </p>
</>
    );
  }

  return (
    <div data-amplify-authenticator="" data-variation="modal">
      <div data-amplify-container="">
        <h1 className="brandlogo">
          <img src="https://lokmat.com/static/asera/asera-logo.png" alt="Asera Minings" />
        </h1>
        <div className="info-container">
          <div className="info-text">
            <p className="title">WELCOME TO ASERA MINING</p>
            <p>
              We are striving to develop European Union's Lithium mineral resources and contribute to its goal of
              becoming self-reliant in its transition to green mobility and energy solutions.
            </p>
            <p className="forinfomation">For more information,</p>
            <button className="contactus" onClick={() => router.push('/contact-us')}>Contact us</button>
          </div>

          <form onSubmit={handleSubmit}>
            <fieldset className="amplify-flex" style={{ flexDirection: 'column' }}>
              <legend className="amplify-visually-hidden">Sign in</legend>

              <div className="amplify-field amplify-textfield">
                <label className="amplify-label" htmlFor="username">Email</label>
                <input
                  id="username"
                  name="username"
                  type="email"
                  placeholder="Enter your Email"
                  required
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="amplify-field amplify-textfield amplify-passwordfield">
                <label className="amplify-label" htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your Password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </fieldset>

            <button className="amplify-button amplify-button--primary" type="submit">
              Sign in
            </button>

            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
