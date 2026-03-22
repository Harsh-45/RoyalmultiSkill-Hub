# 🎯 Configuration Guide - Royal Multiskill Hub

## ✅ **CENTRALIZED CONFIGURATION SYSTEM**

All your business details are now stored in **ONE SINGLE FILE**:

📁 **`config/site.js`**

This is the **ONLY** file you need to edit to update all your contact information, business details, and settings across the entire website!

---

## 📝 **What You Need to Update**

### **1. WhatsApp Number** ⚠️ **REQUIRED**

```javascript
whatsapp: "919876543210",  // Change this!
```

**Format**: Country code + number (no spaces, no +)
- Example: For +91 98765 43210, use: `919876543210`
- For +1 555 123 4567, use: `15551234567`

---

### **2. Phone Number (Display Format)**

```javascript
phone: "+91 98765 43210",  // Change this!
```

**Format**: With spaces for better readability
- This is how the phone number will be displayed on the website

---

### **3. Email Address**

```javascript
email: "info@royalmultiskillhub.com",  // Change this!
```

---

### **4. Instagram Username**

```javascript
instagram: "royalmultiskillhub",  // Change this!
```

**Format**: Username only (without @)

---

### **5. Business Address**

```javascript
address: {
  street: "Your Street Address",      // Change this!
  area: "Your Area/Locality",         // Change this!
  city: "Your City",                  // Change this!
  state: "Your State",                // Change this!
  pincode: "123456",                  // Change this!
  country: "India",
}
```

---

### **6. Google Maps**

```javascript
maps: {
  embedUrl: "https://www.google.com/maps/embed?pb=...",  // Change this!
  directionsUrl: "https://goo.gl/maps/your-location",    // Change this!
}
```

**How to get your Google Maps embed URL:**
1. Go to [Google Maps](https://www.google.com/maps)
2. Search for your business location
3. Click **"Share"** button
4. Click **"Embed a map"** tab
5. Copy the **src URL** from the iframe code
6. Paste it in `embedUrl`

**How to get directions URL:**
1. On Google Maps, click **"Share"** button
2. Click **"Copy link"**
3. Paste it in `directionsUrl`

---

### **7. Business Hours**

```javascript
hours: {
  weekdays: {
    days: "Monday - Saturday",        // Change if needed
    time: "10:00 AM - 8:00 PM"       // Change this!
  },
  weekend: {
    days: "Sunday",
    time: "11:00 AM - 6:00 PM"       // Change this!
  },
  note: "Walk-ins welcome, but appointments are recommended"
}
```

---

### **8. Statistics (About Page)**

```javascript
stats: {
  clients: "1000+",      // Update with your numbers
  experience: "5+",      // Years in business
  tattoos: "500+",       // Total tattoos done
  satisfaction: "100%"   // Customer satisfaction
}
```

---

### **9. Website URL (After Deployment)**

```javascript
url: "https://royalmultiskillhub.com",  // Update after deploying
```

---

## 🚀 **How It Works**

Once you update `config/site.js`, the changes will automatically appear in:

✅ **All Pages**
- Home page
- Services page
- Portfolio page
- About page
- Contact page

✅ **All Components**
- Navbar (brand name, tagline)
- Footer (contact info, social links)
- WhatsApp Button (phone number, messages)
- Service Cards (booking links)

✅ **SEO & Metadata**
- Page titles
- Meta descriptions
- Open Graph tags

---

## 📋 **Quick Update Checklist**

Before going live, update these in `config/site.js`:

- [ ] WhatsApp number
- [ ] Phone number (display format)
- [ ] Email address
- [ ] Instagram username
- [ ] Street address
- [ ] Area/Locality
- [ ] City
- [ ] State
- [ ] Pincode
- [ ] Google Maps embed URL
- [ ] Google Maps directions URL
- [ ] Business hours (weekdays)
- [ ] Business hours (weekend)
- [ ] Statistics (clients, experience, etc.)
- [ ] Website URL (after deployment)

---

## 💡 **Example: Complete Configuration**

```javascript
export const siteConfig = {
  businessName: "Royal Multiskill Hub",
  tagline: "Ink • Beauty • Confidence",
  
  contact: {
    whatsapp: "919876543210",           // ⚠️ UPDATE THIS
    phone: "+91 98765 43210",           // ⚠️ UPDATE THIS
    email: "contact@example.com",       // ⚠️ UPDATE THIS
    instagram: "yourusername",          // ⚠️ UPDATE THIS
  },
  
  address: {
    street: "123 Main Street",          // ⚠️ UPDATE THIS
    area: "Downtown",                   // ⚠️ UPDATE THIS
    city: "Mumbai",                     // ⚠️ UPDATE THIS
    state: "Maharashtra",               // ⚠️ UPDATE THIS
    pincode: "400001",                  // ⚠️ UPDATE THIS
  },
  
  // ... rest of the config
}
```

---

## ✅ **Benefits of This System**

1. **Single Source of Truth** - Update once, changes everywhere
2. **No Code Duplication** - Contact info stored in one place
3. **Easy Maintenance** - Simple to update in the future
4. **Error Prevention** - No risk of missing updates in some files
5. **Type Safety** - Helper functions ensure correct formatting

---

## 🎉 **You're Done!**

After updating `config/site.js`, your entire website will reflect the new information automatically. No need to edit multiple files!

**Next Steps:**
1. Open `config/site.js`
2. Update all the values marked with `// Change this!`
3. Save the file
4. Run `npm run dev` to see your changes
5. Deploy to production!

---

**Need Help?** Check the comments in `config/site.js` for detailed instructions on each field.

