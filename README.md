# Royal Multiskill Hub

A Next.js 14 website for Royal Multiskill Hub in Amgaon, offering tattoo, piercing, and beauty as three main service areas. The design uses ink, cream, and muted gold, editorial typography, and Framer Motion animations that respect the visitor’s reduced-motion preference.

## Run locally

Use Node.js 18.17 or later and npm. From the project directory:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Code changes refresh automatically; press `Ctrl+C` to stop the server.

```bash
npm run lint    # Check code
npm test        # Check booking rules, authentication and storage
npm run build  # Create a production build
npm start      # Serve the production build
```

## Project structure

```text
app/
  page.js                 Home
  services/page.js        Tattoo, piercing, and beauty services
  portfolio/page.js       Filterable reference gallery
  about/page.js           Studio introduction
  contact/page.js         Booking form, contact details, map, and opening hours
  book/page.js            Customer date/time booking form
  booking-status/page.js  Private customer booking status
  my-requests/page.js     Requests saved in the customer's browser
  owner/page.js           Password-protected booking dashboard
  api/bookings/           Availability, requests, private status, and batch history API
  api/owner/              Owner sessions and booking decisions
  layout.js               Shared layout and metadata
  globals.css             Shared styles and CSS animations
components/
  Navbar.js               Navigation and accessible mobile menu
  Footer.js               Studio links, contact details, and hours
  BrandMark.js            SVG monogram
  MotionProvider.js       Shared motion configuration
  Reveal.js               Reusable scroll reveal with reduced-motion support
  PageIntro.js            Shared page heading
  BookingCTA.js           Appointment call to action
  BookingForm.js          Date, service, slot selection, and WhatsApp handoff
  BookingStatus.js        Private appointment status and refresh
  MyRequests.js           Browser-saved requests and current status
  OwnerDashboard.js       Owner sign-in, requests, approval, and cancellation
  ServiceCard.js          Service and pricing card
  GalleryGrid.js          Filters and keyboard-accessible image dialog
  WhatsAppButton.js       Floating enquiry link
  TestimonialCard.js      Optional review card; currently unused
config/site.js            Business information and contact configuration
data/services.js          Service categories and prices
data/portfolio.js         Gallery images, metadata, and categories
public/                   Local images, video, and other static assets
lib/                      Booking rules, authentication, API helpers, and storage
database/bookings.sql     Shared Supabase database and atomic booking operations
database/booking-retention.sql Existing-project upgrade for automatic cleanup
scripts/setup-bookings.mjs Local owner credential setup
tests/                    Booking and authentication tests (Node test runner)
tailwind.config.js        Theme colors and typography
next.config.js            Next.js and remote-image configuration
```

## Customize

- **Business details:** Edit `config/site.js` for the name, phone, WhatsApp, social links, address, maps, hours, and metadata. Contact links and enquiry messages use this central configuration.
- **Services and prices:** Edit `data/services.js`. Piercing currently has a consultation entry with “Enquire for pricing”; replace it with the confirmed service names and prices when supplied. Existing tattoo and beauty prices remain in the same file.
- **Gallery:** Edit `data/portfolio.js`. Current Unsplash photographs are reference imagery, not a claim of work completed by the studio. Replace them with actual studio photographs; place local files in `public/` and use paths such as `/images/tattoo-01.jpg`. Add piercing images with `category: 'Piercing'` and `theme: 'piercing'`. The piercing filter has an enquiry state until photographs are added. Homepage and studio-page editorial images are configured in their page files.
- **Visual design:** Edit `app/globals.css` and `tailwind.config.js`. Use `Reveal` for consistent entrance animations; `MotionProvider` and reduced-motion CSS handle visitor preferences.
- **Reviews:** `TestimonialCard` accepts a `testimonial` object with `name`, `review`, optional `service`, `rating`, and `source`, plus an optional `index`. It shows a Google label only when `source` is explicitly `Google`. Supply verified review content before using it.

Gallery photographs are bundled locally; Google Fonts and the Google Maps embed require an internet connection. Additional remote image hosts must be allowed in `next.config.js`. Business details come from `config/site.js`; `.env.example` describes server-only booking settings.

## Appointment bookings

Customers book at `/book` or `/contact`. Each day has ten one-hour slots, from 10–11 AM through 7–8 PM, in India time. Bookings can be requested up to 60 days ahead. Tattoo, piercing, and all beauty categories share one studio calendar.

1. Customer chooses a service/date/hour and submits their name, phone, and optional notes.
2. The pending request is saved. The customer taps **Send on WhatsApp**, then sends the prepared message to the studio. The website does not send messages automatically.
3. The message includes `/owner?booking=...`. The owner signs in and approves or rejects on the dashboard. Pending requests also appear there without a WhatsApp message.
4. Approval reserves that hour across all services. Competing pending requests become unavailable. Rejection leaves the hour open; cancelling an approved appointment releases it.
5. The customer can retain the private status link to see the decision. The owner can manually send a prepared confirmation through WhatsApp.

WhatsApp approval buttons and automatic notifications are not part of this free workflow. Approvals happen on the website. The tracking link contains a private token in its URL fragment; the public status API never returns customer names, numbers, or notes. Never share owner login details with customers.

### Customer request history

`/my-requests` shows up to 50 recent requests saved on the same browser and website domain, without sign-in. A successful booking saves its private reference automatically. Opening an existing private status link adds that request too; earlier requests cannot be recovered without their original links. Statuses refresh while the page is visible, with the last known status retained if the connection fails. Requests expire 72 hours after their one-hour appointment ends, in India time, regardless of status or submission date. Future appointments are preserved.

Browser storage contains only the private booking ID/token, service, appointment time, status, and saved time. Keep status links private: anyone with a link can check that appointment's status. Customer names, phone numbers, and notes are not saved in browser history. The batch status endpoint verifies each private token before returning public status fields. History itself needs no database migration; automatic database deletion needs the retention setup below.

Clearing browser data removes saved links; private browsing may remove them when the private session ends. Another browser, phone, or website domain has a separate list. Keep the original private links for access elsewhere. Removing a saved link does not cancel the appointment or delete its studio record. If browser storage is blocked or full, the booking still succeeds and the customer is prompted to keep the private status link.

### Automatic deletion after three days

Both owner records and customer history are cleared after the retention period. For example, an appointment ending Monday at 11 AM becomes eligible for deletion Thursday at 11 AM. This covers approved, pending, declined, unavailable, and cancelled requests.

For your **existing Supabase project**:

1. Open **Supabase → royal-bookings → SQL Editor → New query**.
2. Open `database/booking-retention.sql` from this repository and paste its complete contents into the SQL editor.
3. Click **Run**. This immediately deletes records already past retention, enables `pg_cron`, and schedules the `royal-booking-retention` job hourly. This is permanent deletion from the booking table.
4. Confirm the job appears under **Integrations → Cron → Jobs**, or run the verification queries included as comments at the bottom of the SQL file. The job should be active with schedule `0 * * * *`.
5. Deploy this website update to Vercel so the customer-history cleanup is included too. No new environment variables or Vercel cron configuration are needed.

Fresh projects get the same cleanup when running the full `database/bookings.sql`. Re-running the retention file with the same SQL-editor database user updates the named schedule rather than adding another job. Supabase removes eligible owner records on its next hourly run, even when nobody visits the website. Browser links are removed when the customer next opens the website, and within 30 seconds while My requests stays open. The local development JSON store removes old records on the next storage access. A deleted record's private status link stops working.

### Local owner setup

```bash
npm run booking:setup
npm run dev
```

Open [http://localhost:3000/owner](http://localhost:3000/owner). Setup generates a password, stores its scrypt hash and a session signing secret in the ignored `.env.local`, and saves your login details in the ignored `.booking-data/owner-login.txt`. It does not print the password. Both files are private. Restart the dev server if it was already running and still shows setup instructions. Owner sessions expire after eight hours.

To choose or change the owner password, run this in an interactive terminal in the project folder:

```bash
npm run owner:password
```

Enter a new password of 12–256 characters, then enter it again to confirm. Typing stays hidden. The command stores its hash, replaces the session signing secret, and removes the previous plaintext password from the private login file. It does not store your chosen password as plaintext, so keep it in your password manager. Cancelling, invalid input, or mismatched confirmation leaves credentials unchanged. Restart the local dev server after a successful change. For a randomly generated replacement instead, use `npm run booking:setup -- --reset` and read the private login file.

To activate the new password on Vercel:

1. Open `.env.local` locally and copy the new values of `OWNER_PASSWORD_HASH` and `OWNER_SESSION_SECRET`. Keep them private; do not commit the file.
2. Open your Vercel project → **Settings → Environments → Production** and update both environment variables. Paste only each value, without the variable name or `=`. Remove an old `OWNER_PASSWORD` variable if present. Update other environments separately if they also need the new password.
3. Open **Deployments**, select the latest production deployment, and choose **Redeploy**. Environment changes apply to the new deployment.
4. Once deployment is ready, open `/owner` on the live website and sign in with your chosen password. The rotated signing secret invalidates previous owner sessions on the new deployment.

The local command changes only local credentials. The live website keeps its previous password until the new environment values are deployed. Booking records and customer private links are unaffected by an owner password change.

Development requests persist in `.booking-data/bookings.json`. This is a single-process development store, suitable for local testing. Keep it out of Git and public directories. A different data path can be set with `BOOKING_DATA_FILE`.

### Shared bookings on the live website

Localhost links in WhatsApp cannot be opened by an owner on another device. Publish the site to obtain a public HTTPS URL and connect a shared database before accepting live requests:

1. Create a Supabase project (a free plan can cover initial low usage, subject to the provider's limits and availability).
2. Run `database/bookings.sql` in its SQL editor. It creates a private table and server-only functions. A database constraint plus transactional locking prevents double approval of an hour.
3. Configure the host with `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (the legacy `service_role` API key), `OWNER_PASSWORD_HASH`, and `OWNER_SESSION_SECRET`. Copy the last two from your local generated environment or generate separate production credentials. The Supabase key must remain server-only.
4. Set `APP_URL` to the website's actual origin, such as `https://your-domain.example`, and update `config/site.js` for public metadata. `APP_URL` must match the domain used to access forms; redirect alternate domains to it.
5. Deploy to a host with a Node.js runtime and a plan that permits business use. Confirm request, owner approval, status update, and blocked availability before launch. Static export hosting cannot run these APIs.

No Supabase project is created by this repository, and development bookings are not automatically uploaded. Production fails closed if the shared database is missing. For a traditional single-process Node server with a persistent private disk, `BOOKING_STORAGE=local` explicitly enables file storage; do not use it with multiple processes, replicas, or serverless hosting. Back up customer records and remove old records according to the studio's needs. API burst limits are per process; add host-level throttling if traffic requires it.

## Deployment

Deploy the production build to a Node.js host or a compatible Next.js platform. Choose a plan that permits a commercial studio website and configure shared bookings as above. Hosting/database free plans have usage limits; no paid WhatsApp API is required for the manual WhatsApp workflow.
