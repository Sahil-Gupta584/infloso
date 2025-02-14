# MelodyVerse - Full Stack Login & Signup App

A secure, full-stack app for **MelodyVerse**, a fictional music streaming service, featuring **JWT authentication** for user login and signup. Built with **React.js** for the frontend and **Node.js** (Express) for the backend API.

## Features

- **Frontend (MelodyVerse)**: 
  - **Responsive UI** using **React** and **Tailwind CSS**.
  - **Login/Signup** with username/email and password.
  - Input fields validation and sanitization.
  - Proper error and success message display

- **Backend (ConnectVerse)**:
  - Secure user **registration** and **authentication** via **JWT**.
  - Password hashing with **bcrypt**.
  - Rate limiting to protect against brute force attacks.


## How to Run

1. **Clone the repo**:
   ```bash
   git clone https://github.com/Sahil-Gupta584/infloso.git .
   ```
2. **Setup Envs**
    - rename .env.sample file to just .env in connect-verse(backend)
    - copy this keys ans paste it in /connect-verse(backend)/.env file
      
  
    ```bash

       JWT_SECRET=you-can-keep-random-here
       MONGO_URI=your-url-cloud-or-local
       NODEMAILER_USER=you-email
       NODEMAILER_PASS=pass

    ```
    - replace MONGO_URI value with your local or cloud uri
    - if you want email otp verification, you will need to get appPassword for you gmail (it may take time so you can skip this step,but make sure while logging in click on home instead continue):

        - go to https://myaccount.google.com/security and see if you have enabled 2-step verification (if not enabled, it will take time you can refer external resources to how to enable it or skip this step)
        - go to https://myaccount.google.com/apppasswords create new instance and note code and replace  NODEMAILER_PASS value with actual code
        - NODEMAILER_USER is the email
        - pass and email should be of same email

3. **Backend**:
   
   ```bash
   cd connect-verse; npm install; npm run dev 
   ```
   or
   ```bash
   cd connect-verse && npm install && npm run dev 
   ```

4. **Frontend**:

   in new terminal (ctrl+shift+5, keep cursor focus on terminal)
   ```bash
   cd melody-verse; npm install; npm run dev 
   ```
   or
   ```bash
   cd melody-verse && npm install && npm run dev 
   ```

---

## Technologies Used

- **Frontend**: React.js, Tailwind CSS, React Router,Redux
- **Backend**: Node.js, Express, MongoDB, JWT, bcrypt

---

## Security Best Practices

- **JWT** for authentication.
- **bcrypt** for secure password hashing.
- Input validation and error handling throughout.
- Email otp verification with nodemailer

