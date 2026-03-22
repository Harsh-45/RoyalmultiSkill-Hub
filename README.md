# Royal Multiskill Hub

**Tagline:** Ink • Beauty • Confidence

A premium, modern website for Royal Multiskill Hub - a professional tattoo studio and beauty parlour.

## 🎨 Features

- **Split Theme Design**: Dark theme for tattoo section, light theme for beauty parlour
- **Smooth Animations**: Powered by Framer Motion for engaging user experience
- **Fully Responsive**: Mobile-first design that works on all devices
- **Premium UI**: Glassmorphism effects, smooth scrolling, and modern aesthetics
- **Service Categories**: Comprehensive listing of all tattoo and beauty services
- **Portfolio Gallery**: Image gallery with category filters and lightbox modal
- **Contact Integration**: WhatsApp integration for easy booking
- **Performance Optimized**: Fast loading with lazy loading and optimized images

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: React Icons
- **Deployment**: Optimized for Vercel

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 18.0 or higher)
- **npm** or **yarn** package manager

### Installing Node.js

If you don't have Node.js installed:

1. **macOS**: 
   ```bash
   # Using Homebrew
   brew install node
   ```

2. **Windows**: 
   Download from [nodejs.org](https://nodejs.org/)

3. **Linux**: 
   ```bash
   # Using apt (Ubuntu/Debian)
   sudo apt update
   sudo apt install nodejs npm
   ```

Verify installation:
```bash
node --version
npm --version
```

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the website.

### 3. Build for Production

```bash
npm run build
```

### 4. Start Production Server

```bash
npm start
```

## 📁 Project Structure

```
royal-multiskill-hub/
├── app/
│   ├── about/
│   │   └── page.js          # About page
│   ├── contact/
│   │   └── page.js          # Contact page
│   ├── portfolio/
│   │   └── page.js          # Portfolio gallery
│   ├── services/
│   │   └── page.js          # Services listing
│   ├── globals.css          # Global styles
│   ├── layout.js            # Root layout
│   └── page.js              # Home page
├── components/
│   ├── Footer.js            # Footer component
│   ├── GalleryGrid.js       # Portfolio gallery grid
│   ├── Navbar.js            # Navigation bar
│   ├── ServiceCard.js       # Service card component
│   ├── TestimonialCard.js   # Testimonial card
│   └── WhatsAppButton.js    # Floating WhatsApp button
├── data/
│   ├── portfolio.js         # Portfolio images data
│   └── services.js          # Services and pricing data
├── public/                  # Static assets
├── .gitignore
├── next.config.js           # Next.js configuration
├── package.json             # Dependencies
├── postcss.config.js        # PostCSS configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── README.md
```

## 🎯 Pages

1. **Home** (`/`) - Split-theme hero with tattoo and beauty sections
2. **Services** (`/services`) - Complete service listing with pricing
3. **Portfolio** (`/portfolio`) - Image gallery with category filters
4. **About** (`/about`) - Story, mission, and why choose us
5. **Contact** (`/contact`) - Contact form, map, and business hours

## ⚙️ Customization

### Update Contact Information

Edit the WhatsApp number in:
- `components/WhatsAppButton.js`
- `components/Footer.js`
- `app/contact/page.js`

Replace `919876543210` with your actual WhatsApp number.

### Update Services & Pricing

Edit `data/services.js` to modify service categories and pricing.

### Update Portfolio Images

Edit `data/portfolio.js` to add/modify portfolio images.

### Update Location

In `app/contact/page.js`, replace the Google Maps embed URL with your actual location.

## 🚀 Deployment on Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel will auto-detect Next.js and deploy

Or use Vercel CLI:

```bash
npm install -g vercel
vercel
```

## 📱 Features Checklist

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Smooth scroll animations
- ✅ Glassmorphism effects
- ✅ Image lazy loading
- ✅ WhatsApp integration
- ✅ Instagram links
- ✅ Google Maps integration
- ✅ Service categories with pricing
- ✅ Portfolio gallery with lightbox
- ✅ Testimonials section
- ✅ Hygiene & safety information
- ✅ Contact form
- ✅ Business hours

## 🎨 Color Scheme

**Tattoo Theme (Dark)**
- Background: Black (#0a0a0a), Grey (#1a1a1a)
- Accent: Red (#dc2626, #ef4444)

**Beauty Theme (Light)**
- Background: Light Pink (#fef3f4, #fce7f3)
- Accent: Pink (#ec4899), Gold (#fbbf24)

## 📄 License

This project is created for Royal Multiskill Hub.

## 🤝 Support

For any issues or questions, please contact the development team.

---

**Built with ❤️ for Royal Multiskill Hub**

