# ✈️ UdaanSathi - Smart Travel Companion

<div align="center">

![UdaanSathi Banner](https://img.shields.io/badge/UdaanSathi-Travel%20Companion-blue?style=for-the-badge&logo=airplane)

**An intelligent flight booking platform with AI-powered crisis management and real-time travel assistance**

[![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0-000000?logo=flask)](https://flask.palletsprojects.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Admin-ffca28?logo=firebase)](https://firebase.google.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI-8e44ad?logo=google)](https://ai.google.dev/)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Architecture](#-architecture) • [Installation](#-installation) • [Usage](#-usage) • [API Docs](#-api-endpoints)

</div>

---

## 📖 Overview

**UdaanSathi** (उड़ान साथी - Flight Companion) is a next-generation travel booking platform that goes beyond simple flight reservations. Built for modern travelers, it combines intelligent booking systems with AI-powered crisis management to ensure seamless travel experiences even during disruptions.

### 🎯 Problem Statement

Travelers face critical challenges when flights are disrupted:
- Limited visibility into alternative options
- Confusion during emergencies (cancellations, delays)
- Poor communication from airlines
- Manual refund processes
- Lack of personalized travel assistance

### 💡 Our Solution

UdaanSathi provides:
- **AI-Powered Chatbot**: Contextual travel advice using Google Gemini AI
- **Disaster Recovery Mode**: Automated crisis response with alternative flights/trains/hotels
- **Instant Refund System**: Streamlined compensation processing
- **Real-time Notifications**: Proactive alerts for flight status changes
- **Smart Booking**: Intuitive search with live availability

---

## 🚀 Features

### Core Booking Features
- 🔍 **Advanced Flight Search**: Multi-city, date-range, and filter-based search
- 📅 **Real-time Availability**: Live seat counts and pricing
- 💳 **Secure Booking**: End-to-end encrypted payment flow
- 📱 **Booking Management**: View, modify, and cancel reservations
- 🧾 **E-Ticket Generation**: Instant PDF tickets with QR codes

### AI & Intelligence
- 🤖 **Gemini AI Chatbot**: 
  - Natural language queries
  - Flight recommendations
  - Travel tips and regulations
  - Voice interaction support
- 🧠 **Smart Suggestions**: Context-aware alternative options
- 📊 **Predictive Analytics**: Delay probability indicators

### Crisis Management
- 🚨 **Disaster Mode Dashboard**: 
  - Emergency alerts for disrupted flights
  - One-click alternative bookings
  - Priority customer support
- ✈️ **Alternative Flights**: Smart rebooking across partner airlines
- 🚆 **Train Options**: IRCTC integration for rail alternatives
- 🏨 **Emergency Hotels**: Nearby accommodation suggestions
- 💰 **Instant Refunds**: Automated UPI/bank transfer processing

### User Experience
- 🌓 **Dark/Light Mode**: Adaptive theme with smooth transitions
- 📱 **Responsive Design**: Mobile-first, works on all devices
- ⚡ **Fast Performance**: Optimized loading with React lazy loading
- 🎨 **Modern UI**: Glassmorphism, animations, and micro-interactions
- ♿ **Accessibility**: ARIA labels and keyboard navigation

### Admin Features
- 📊 **Analytics Dashboard**: Booking trends and user insights
- ✈️ **Flight Management**: Add, update, and cancel flights
- 🎟️ **Manifest Viewer**: Passenger lists and PNR lookup
- 💸 **Refund Manager**: Approve/reject refund requests

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI framework for component-based architecture |
| **TypeScript** | 5.7.2 | Type-safe JavaScript for reduced runtime errors |
| **Vite** | 7.3.0 | Lightning-fast build tool and dev server |
| **Tailwind CSS** | 3.4.19 | Utility-first CSS for rapid styling |
| **Radix UI** | Latest | Headless UI primitives for accessible components |
| **Lucide React** | Latest | Beautiful icon library |
| **React Router** | 7.6.1 | Client-side routing |
| **Google Generative AI** | 0.24.1 | Gemini AI SDK for chatbot |
| **Firebase** | 11.2.0 | Authentication and real-time database |
| **Framer Motion** | 11.16.2 | Animation library |
| **Three.js / React Three Fiber** | Latest | 3D graphics for visual effects |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Flask** | 3.0.0 | Lightweight Python web framework |
| **Flask-CORS** | 4.0.0 | Cross-origin resource sharing |
| **SQLite** | 3 | Embedded relational database |
| **SQLAlchemy** | (via Firebase Admin) | ORM for database operations |
| **Firebase Admin SDK** | 6.4.0 | Server-side Firebase integration |
| **python-dotenv** | 1.0.0 | Environment variable management |
| **ReportLab** | 4.0.2 | PDF generation for tickets |
| **Requests** | 2.31.0 | HTTP library for external APIs |

### AI & Integration
- **Google Gemini AI**: Advanced conversational AI for chatbot
- **Firebase Firestore**: Real-time NoSQL database
- **Firebase Authentication**: Secure user management

### Development Tools
- **ESLint**: Code linting for consistency
- **Prettier**: Code formatting
- **PostCSS**: CSS processing with Autoprefixer
- **Git**: Version control

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Browser    │  │    Mobile    │  │   Tablet     │      │
│  │  (React App) │  │  (Responsive)│  │  (Adaptive)  │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                 │                │
│         └─────────────────┴─────────────────┘                │
│                           │                                   │
└───────────────────────────┼───────────────────────────────────┘
                            │
                    ┌───────▼────────┐
                    │   Vite Dev     │
                    │   Server/CDN   │
                    └───────┬────────┘
                            │
┌───────────────────────────┼───────────────────────────────────┐
│                   APPLICATION LAYER                            │
│  ┌────────────────────────▼───────────────────────┐           │
│  │          React Frontend (Port 5173)            │           │
│  │  ┌─────────────┐  ┌──────────────┐           │           │
│  │  │   Pages     │  │  Components  │           │           │
│  │  │  - Welcome  │  │  - FlightCard│           │           │
│  │  │  - Search   │  │  - Chatbot   │           │           │
│  │  │  - Booking  │  │  - Disaster  │           │           │
│  │  │  - Dashboard│  │  - Sidebar   │           │           │
│  │  └─────┬───────┘  └──────┬───────┘           │           │
│  │        │                  │                    │           │
│  │  ┌─────▼──────────────────▼───────┐          │           │
│  │  │       Services Layer           │          │           │
│  │  │  - flightService.ts            │          │           │
│  │  │  - bookingService.ts           │          │           │
│  │  │  - aiService.ts (Gemini)       │          │           │
│  │  │  - firestoreService.ts         │          │           │
│  │  └────────┬───────────────────────┘          │           │
│  └───────────┼──────────────────────────────────┘           │
│              │                                                │
└──────────────┼────────────────────────────────────────────────┘
               │
        ┌──────▼──────┐
        │   HTTP/S    │
        │   API Calls │
        └──────┬──────┘
               │
┌──────────────┼────────────────────────────────────────────────┐
│                      BACKEND LAYER                             │
│  ┌────────────────▼─────────────────────────┐                 │
│  │    Flask API Server (Port 5000)         │                 │
│  │  ┌──────────────────────────────┐       │                 │
│  │  │    Routes / Endpoints        │       │                 │
│  │  │  /flights/search             │       │                 │
│  │  │  /bookings/create            │       │                 │
│  │  │  /notifications/:pnr         │       │                 │
│  │  │  /api/refunds/submit         │       │                 │
│  │  └───────────┬──────────────────┘       │                 │
│  │              │                           │                 │
│  │  ┌───────────▼──────────────────┐       │                 │
│  │  │    Business Logic Layer      │       │                 │
│  │  │  - Flight management         │       │                 │
│  │  │  - Booking processing        │       │                 │
│  │  │  - Notification service      │       │                 │
│  │  │  - Refund handler            │       │                 │
│  │  └───────────┬──────────────────┘       │                 │
│  └──────────────┼──────────────────────────┘                 │
│                 │                                              │
└─────────────────┼──────────────────────────────────────────────┘
                  │
        ┌─────────▼──────────┐
        │   Data Layer       │
        └─────────┬──────────┘
                  │
    ┌─────────────┼──────────────┐
    │             │              │
┌───▼────┐  ┌────▼─────┐  ┌────▼─────┐
│SQLite  │  │Firebase  │  │ Gemini   │
│Database│  │Firestore │  │ AI API   │
│        │  │          │  │          │
│-Flights│  │-Users    │  │-Chatbot  │
│-Booking│  │-Notifs   │  │-NLP      │
│-Refunds│  │-Auth     │  │-Context  │
└────────┘  └──────────┘  └──────────┘
```

### Data Flow

#### 1. Flight Search Flow
```
User → Search Form → flightService.ts → Flask API (/flights/search)
→ SQLite Query → Return Results → Display FlightCards
```

#### 2. Booking Flow
```
User → Select Flight → Booking Form → bookingService.ts
→ Flask API (/bookings/create) → SQLite Insert
→ Generate PNR → Send Notification → Redirect to Dashboard
```

#### 3. AI Chatbot Flow
```
User Message → aiService.ts → Google Gemini API
→ Context Analysis → Generate Response → Display in Chat UI
→ Optional: Trigger Actions (search, book, help)
```

#### 4. Disaster Mode Flow
```
Flight Cancellation → Admin Marks Cancelled → Firebase Notification
→ User Dashboard Shows Alert → Navigate to Disaster Mode
→ Load Alternative Options (Flights/Trains/Hotels)
→ User Selects Option → Rebook or Request Refund
```

### Component Architecture

```
src/
├── userpanel/
│   ├── pages/                    # Route-level components
│   │   ├── WelcomePage.jsx       # Landing page with hero
│   │   ├── FlightSearchPage.tsx  # Search interface
│   │   ├── UserDashboard.tsx     # User home with bookings
│   │   ├── DisasterModePage.tsx  # Crisis management hub
│   │   ├── AlternativeFlights.tsx
│   │   ├── AlternativeTrains.tsx
│   │   └── NearbyHotels.tsx
│   ├── components/               # Reusable UI components
│   │   ├── FlightCard.tsx        # Flight display card
│   │   ├── TravelAssistant.tsx   # AI chatbot widget
│   │   ├── NotificationSystem.tsx
│   │   ├── Sidebar.tsx
│   │   └── TopBar.tsx
│   ├── services/                 # API & business logic
│   │   ├── flightService.ts
│   │   ├── bookingService.ts
│   │   ├── aiService.ts
│   │   └── firestoreService.ts
│   └── layouts/
│       └── DashboardLayout.tsx   # Common layout wrapper
└── components/ui/                # Shared UI primitives
    ├── button.tsx
    ├── card.tsx
    ├── dialog.tsx
    └── ...
```

---

## 📦 Installation

### Prerequisites

- **Node.js**: 18.x or higher
- **Python**: 3.9 or higher
- **npm/yarn**: Latest version
- **Git**: For version control

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/udaansathi.git
cd udaansathi
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
# Create .env file with:
# FLASK_SECRET_KEY=your_secret_key
# GEMINI_API_KEY=your_gemini_api_key
# FIREBASE_CREDENTIALS=path/to/serviceAccountKey.json

# Initialize database
python app.py
# Database will be created automatically on first run
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Set up environment variables
# Create .env file with:
# VITE_GEMINI_API_KEY=your_gemini_api_key
# VITE_API_URL=http://localhost:5000

# Start development server
npm run dev
```

### 4. Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database and Authentication
3. Download `serviceAccountKey.json` and place in `backend/`
4. Copy Firebase config to `frontend/src/firebase/initFirebase.ts`

### 5. Gemini AI Setup

1. Get API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Add to `.env` files in both frontend and backend
3. Enable "Generative Language API" in Google Cloud Console

---

## 🚀 Usage

### Starting the Application

#### Terminal 1 - Backend
```bash
cd backend
venv\Scripts\activate  # or source venv/bin/activate on macOS/Linux
python app.py
```
Backend runs on `http://localhost:5000`

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5173`

### Default Routes

- **Home**: `http://localhost:5173/`
- **User Dashboard**: `http://localhost:5173/user/dashboard`
- **Admin Dashboard**: `http://localhost:5173/admin/dashboard`
- **Flight Search**: `http://localhost:5173/user/flights`
- **Disaster Mode**: `http://localhost:5173/user/disaster-mode`

### Demo Credentials

**Regular User**:
- Create account via sign-up flow
- Use any email/password (stored in Firebase Auth)

**Admin Access**:
- Navigate to `/admin/dashboard`
- Use admin panel for flight management

---

## 🔌 API Endpoints

### Flights

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/flights/search` | Search available flights | `source`, `destination`, `date` (optional) |
| GET | `/flights/:id` | Get flight details | `id` (flight number) |
| POST | `/flights/create` | Create new flight (Admin) | Flight object in body |
| DELETE | `/flights/:id` | Cancel flight (Admin) | `id` |

### Bookings

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| POST | `/bookings/create` | Create new booking | Booking object in body |
| GET | `/bookings/:pnr` | Get booking details | `pnr` |
| GET | `/bookings/user/:userId` | Get user's bookings | `userId` |
| PUT | `/bookings/:pnr/cancel` | Cancel booking | `pnr` |

### Notifications

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/notifications/:pnr` | Get notifications for PNR | `pnr` |
| POST | `/notifications/send` | Send notification (Admin) | Notification object |

### Refunds

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| POST | `/api/refunds/submit` | Submit refund request | Refund details in body |
| GET | `/api/refunds/:pnr` | Get refund status | `pnr` |
| PUT | `/api/refunds/:id/approve` | Approve refund (Admin) | `id` |

### Example Request

```javascript
// Search flights
fetch('http://localhost:5000/flights/search?source=DEL&destination=BOM')
  .then(res => res.json())
  .then(data => console.log(data));

// Create booking
fetch('http://localhost:5000/bookings/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    flightId: 'AI101',
    passengerName: 'John Doe',
    email: 'john@example.com',
    phone: '9876543210'
  })
});
```

---

## 🎨 Key Features Breakdown

### 1. AI Travel Assistant

The chatbot uses Google's Gemini AI for contextual conversations:

```typescript
// aiService.ts
const generateResponse = async (message: string, context: any) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
  
  const prompt = `You are a travel assistant. User context: ${JSON.stringify(context)}
  User query: ${message}
  Provide helpful travel advice.`;
  
  const result = await model.generateContent(prompt);
  return result.response.text();
};
```

**Features**:
- Context-aware responses (knows user's bookings)
- Multi-turn conversations
- Voice input/output
- Quick action buttons (search, book, help)
- Flight recommendations

### 2. Disaster Recovery System

Automatically triggers when flights are cancelled:

```typescript
// DisasterModePage.tsx
- Shows affected booking (PNR, flight details)
- Displays 4 quick action tiles:
  1. Alternative Flights (smart rebooking)
  2. Emergency Trains (IRCTC integration)
  3. Airport Hotels (nearby accommodations)
  4. Request Refund (instant processing)
- Provides 24/7 support contacts
- Real-time status updates
```

**UI Highlights**:
- Dark mode with high contrast for emergency visibility
- Gradient hero banner with red alert
- Tabbed sections (overview, solutions, refund, support)
- One-click booking transitions

### 3. Smart Flight Search

```typescript
// FlightSearchPage.tsx
- Auto-suggest for cities (DEL, BOM, BLR, etc.)
- Date picker with calendar
- Real-time availability check
- Loading animations with staggered card reveals
- Empty state with helpful suggestions
- Filters (price, time, airline)
```

---

## 📱 Screenshots

### Home Page
Modern landing with animated hero section and feature highlights.

### Flight Search
Intuitive search with real-time results and smooth animations.

### User Dashboard
Comprehensive view of bookings, notifications, and quick actions.

### AI Chatbot
Floating assistant with natural language understanding.

### Disaster Mode
Emergency hub with alternative options and refund processing.

---

## 🧪 Testing

### Run Frontend Tests
```bash
cd frontend
npm run test  # (Add test scripts as needed)
```

### Run Backend Tests
```bash
cd backend
pytest  # (Add pytest configuration)
```

### Manual Testing Checklist
- [ ] Flight search with various routes
- [ ] Booking flow end-to-end
- [ ] Chatbot interactions
- [ ] Disaster mode triggers
- [ ] Refund submissions
- [ ] Mobile responsiveness
- [ ] Dark/light mode toggle

---

## 🌐 Deployment

### Frontend (Vercel/Netlify)

```bash
cd frontend
npm run build
# Deploy 'dist/' folder to Vercel/Netlify
```

**Environment Variables** (Vercel):
- `VITE_GEMINI_API_KEY`
- `VITE_API_URL`

### Backend (Railway/Render)

```bash
cd backend
# Deploy with Procfile or Railway config
```

**Environment Variables**:
- `FLASK_SECRET_KEY`
- `GEMINI_API_KEY`
- `FIREBASE_CREDENTIALS`

### Database

For production, migrate from SQLite to **PostgreSQL** or **MySQL**:
```bash
pip install psycopg2-binary
# Update database URI in app.py
```

---

## 🤝 Contributing

We welcome contributions! Follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Use TypeScript for new frontend components
- Follow ESLint and Prettier rules
- Write descriptive commit messages
- Add comments for complex logic
- Test before submitting PR

---

## 🐛 Known Issues & Roadmap

### Current Limitations
- SQLite for database (not suitable for high traffic)
- No payment gateway integration yet
- Limited to Indian airports
- Chatbot context limited to 10 messages

### Future Enhancements
- [ ] Payment integration (Razorpay/Stripe)
- [ ] Email/SMS notifications
- [ ] Multi-language support
- [ ] Flight price predictions
- [ ] Loyalty program
- [ ] Social sharing of trips
- [ ] Offline mode with PWA
- [ ] iOS/Android mobile apps

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 UdaanSathi Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👥 Team

- **Your Name** - Lead Developer - [GitHub](https://github.com/yourusername)
- **Contributors** - See [CONTRIBUTORS.md](CONTRIBUTORS.md)

---

## 🙏 Acknowledgments

- **Google Gemini AI** for powering the intelligent chatbot
- **Firebase** for authentication and real-time database
- **Radix UI** for accessible component primitives
- **Lucide Icons** for beautiful iconography
- **Tailwind CSS** for rapid styling
- **Vercel** for frontend hosting

---

## 📞 Support

For questions or issues:
- 📧 Email: support@udaansathi.com
- 💬 Discord: [Join our server](https://discord.gg/udaansathi)
- 🐛 GitHub Issues: [Report bugs](https://github.com/yourusername/udaansathi/issues)
- 📖 Documentation: [Read the docs](https://docs.udaansathi.com)

---

## ⭐ Star History

If you find this project useful, please consider giving it a star! ⭐

---

<div align="center">

**Built with ❤️ by the UdaanSathi Team**

[![GitHub stars](https://img.shields.io/github/stars/yourusername/udaansathi?style=social)](https://github.com/yourusername/udaansathi)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/udaansathi?style=social)](https://github.com/yourusername/udaansathi)

</div>