# Ayojok: Wedding & Event Planning Platform

**Live demo:** https://israfil0077.github.io/ayojok/

Ayojok brings wedding and event planning into one place: find vendors, plan the budget and book a consultation.
This website is a front-end version of the **AYOJOK 2.0 Figma design**, made for the System Analysis and Design
course at United International University. The design won **3rd Runner-Up at the UIU CSE Project Show, Summer 2025**.

![Ayojok home page](assets/img/preview.jpg)

## Pages

| Page | What it does |
|---|---|
| [Home](https://israfil0077.github.io/ayojok/) | Hero, highlights, vendor categories and ideas & tips |
| [Services](https://israfil0077.github.io/ayojok/services.html) | All vendor categories with ideas & tips |
| [Vendors](https://israfil0077.github.io/ayojok/vendors.html?type=venues) | Vendor lists per category (venues, photographers, catering, cakes, DJs, makeup, attire) with search, city, price, rating and date filters |
| [Booking](https://israfil0077.github.io/ayojok/booking.html?type=venues&v=1) | Vendor page with photos, pricing and a request form |
| [Budget](https://israfil0077.github.io/ayojok/budget.html) | Budget planner with a per-category summary |
| [Book for Consult](https://israfil0077.github.io/ayojok/consult.html) | Consultation booking with date, time slot and token number |
| [About](https://israfil0077.github.io/ayojok/about.html) and [Contact](https://israfil0077.github.io/ayojok/contact.html) | About the platform and a contact form |
| [Log in](https://israfil0077.github.io/ayojok/login.html), [Sign up](https://israfil0077.github.io/ayojok/signup.html), [Forgot password](https://israfil0077.github.io/ayojok/forgot.html) | Log-in, 5-step sign-up and password reset |
| [Become a vendor](https://israfil0077.github.io/ayojok/vendor-register.html) | Vendor registration form |
| [My bookings](https://israfil0077.github.io/ayojok/account.html) | A signed-in user's profile, vendor bookings and consultations with their status |
| [Admin](https://israfil0077.github.io/ayojok/admin.html) | Admins review bookings, consultations, vendor applications and messages and update their status |
| [Full design](https://israfil0077.github.io/ayojok/design.html) | All 42 screens of the Figma design in a full-size viewer |

## Backend

Accounts and data run on **Firebase** (no server to maintain):

- **Authentication**: email and password sign-up, log-in and password reset by email.
- **Cloud Firestore**: `users`, `bookings`, `consultations`, `messages` and `vendorApplications`.
- **Security rules** ([firestore.rules](firestore.rules)): users only see their own bookings, anyone can send a message
  or vendor application, and only admins (listed in `admins/{uid}`) can read everything and change a status.

The Firebase web config in `assets/js/firebase-config.js` is public by design; the rules are what protect the data.
Vendor listings are sample data.

## Built with

HTML, CSS and vanilla JavaScript (ES modules), no build step, with the Firebase JS SDK loaded from the CDN. Colours, fonts and layout follow the Figma design
(cream `#FFFDF6`, pink `#F75DA8`, Playball and Lato). Images come from the design file.

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8000
```
