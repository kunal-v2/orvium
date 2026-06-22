# Orvium.in Website

## Quick Start

1. Install dependencies:
```
npm install
```

2. Run development server:
```
npm run dev
```

3. Build for production:
```
npm run build
```

---

## ⚙️ Setup: Contact Form (EmailJS)

The contact form uses [EmailJS](https://emailjs.com) — **free, no backend needed**, sends directly to your inbox.

### Step-by-step:

1. **Sign up** at https://emailjs.com (free plan allows 200 emails/month)

2. **Add an Email Service**
   - Dashboard → Email Services → Add New Service
   - Choose Gmail (easiest) → connect your `hello@orvium.in` account
   - Copy the **Service ID** (e.g. `service_abc123`)

3. **Create an Email Template**
   - Dashboard → Email Templates → Create New Template
   - Set "To Email" to `hello@orvium.in`
   - Use this template body:
     ```
     New website inquiry from {{from_name}}

     Email: {{from_email}}
     Phone: {{phone}}
     Business: {{business}}

     Message:
     {{message}}
     ```
   - Copy the **Template ID** (e.g. `template_xyz789`)

4. **Get your Public Key**
   - Dashboard → Account → General → Public Key
   - Copy it (e.g. `aBcDeFgHiJkLmNoPq`)

5. **Paste into the code** — open `src/App.jsx` and update lines 13–15:
   ```js
   const EMAILJS_SERVICE_ID  = "service_abc123";
   const EMAILJS_TEMPLATE_ID = "template_xyz789";
   const EMAILJS_PUBLIC_KEY  = "aBcDeFgHiJkLmNoPq";
   ```

---

## 📱 Update Your Contact Details

Also in `src/App.jsx` lines 7–9:

```js
const WHATSAPP_NUMBER = "919999999999"; // ← your number (country code + number, no +)
const PHONE_NUMBER = "+91 99999 99999"; // ← display number
const EMAIL = "hello@orvium.in";        // ← already set
```

---

## 🚀 Deploy

- **Vercel** (recommended, free): `npx vercel` or connect GitHub repo
- **Netlify**: drag & drop the `dist/` folder after `npm run build`
- **cPanel**: upload contents of `dist/` to `public_html/`

## Tech Stack
- React 18 + Vite
- EmailJS (contact form)
- Pure CSS animations
#orvium
# orvium
