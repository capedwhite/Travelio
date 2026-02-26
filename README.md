🌍 Travelio
Full-Stack Travel Marketplace Platform with Negotiation & Gamified Booking

A production-structured full-stack travel application that transforms traditional vacation booking into a dynamic, marketplace-style experience through price negotiation, gamification, and community-driven discovery.

🚀 Project Summary

Travelio is a scalable full-stack web application built using modern JavaScript technologies that enables users to browse, compare, negotiate, and book travel packages.

Unlike traditional booking platforms with fixed pricing models, Travelio introduces a Vacation Bargaining System, allowing users to negotiate directly with administrators, creating a competitive and interactive marketplace environment.

The platform integrates secure authentication, PostgreSQL-backed data persistence, and a community-driven engagement layer to increase trust and user retention.

🧠 Key Engineering Highlights

Designed and developed a full-stack application using React, Node.js, Express, and PostgreSQL.

Implemented a price negotiation system enabling marketplace-style interaction between users and administrators.

Built a gamified discount mechanism to improve engagement and booking conversion rates.

Developed a community-based social feature where travelers share experiences, photos, and itineraries.

Integrated Google OAuth authentication for secure third-party login.

Structured backend using RESTful API principles and modular architecture.

Managed relational data using PostgreSQL with structured schema design.

🛠 Tech Stack

Frontend

React.js

Tailwind CSS

Vite

Backend

Node.js

Express.js

REST API architecture

Database

PostgreSQL (Relational Database)

Authentication

Google OAuth 2.0

🏗 System Architecture
Client (React + Tailwind)
        ↓
REST API (Node.js + Express)
        ↓
PostgreSQL Database

React handles dynamic UI and routing

Express manages API endpoints and business logic

PostgreSQL ensures relational data consistency

OAuth enables secure authentication flow

⚙️ Local Development Setup
Clone Repository
git clone https://github.com/capedwhite/Travelio.git
cd Travelio

Backend Setup
cd backend
npm install
npm start

Frontend Setup
cd frontend
npm install
npm run dev


💡 Core Features
✈️ Travel Services

Flight deals

Hotel bookings

Tour and activity listings

Destination-based browsing

🔍 Advanced Search & Filtering

Dynamic filtering based on pricing and destination

Comparative browsing interface

Dashboard-based booking management

💰 Vacation Bargaining System (Marketplace Model)

Structured price negotiation between user and admin

Offer submission workflow

Competitive pricing mechanism

Marketplace-style travel purchasing

🎮 Gamified Discount System

Engagement-based discount logic

Trust-building incentives

Interactive booking experience

👥 Community Experience Page

Social network-style interaction

Photo sharing and travel posts

Reviews, tips, and itinerary sharing

Community-driven travel discovery


The .env file is excluded for security.

To enable Google Login:

Create OAuth credentials in Google Cloud Console

Add the following to your .env file:

GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
DATABASE_URL=your_postgres_connection_string
