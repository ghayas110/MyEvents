# MyEvents

A production-grade Event Management application built with **Vue 3**, **TypeScript**, **Pinia**, and **Vite**.

## ✨ Key Features

- **🔒 Secure Authentication**: Robust login/signup flow using `ReqRes` mock API, custom validation schemas (Yup), and encrypted token storage (`CryptoJS`).
- **📅 Event Discovery**: Infinite-scrolling event list with category filtering, favorite toggling, and attendee tracking.
- **📍 Detailed Views**: Deep-dive into events with Leaflet.js map integration, sanitized HTML descriptions, and registration flow.
- **✍️ Event Management**: Multi-step creation form with real-time validation and image upload/preview management.
- **⚡ Performance & PWA**: 
  - Service Worker for full offline support.
  - Workbox caching strategies for API and assets.
  - Lazy-loading and responsive image optimizations.
- **🎨 Premium UI/UX**: Dark-themed aesthetic using Tailwind CSS v4 directives, smooth transitions, and skeleton loading states.

## 🛠️ Technology Stack

- **Framework**: Vue 3 (Composition API)
- **Store**: Pinia
- **Routing**: Vue Router
- **Styling**: Tailwind CSS
- **Network**: Axios with Interceptors (Retry + Logging)
- **Security**: CryptoJS for LocalStorage encryption
- **Forms**: VeeValidate + Yup
- **Icons**: Lucide Vue
- **Testing**: Vitest + Vue Test Utils

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   Copy the example environment file and set your secrets.
   ```bash
   cp .env.example .env
   # VITE_STORAGE_SECRET=your_secret_key
   ```

3. **Run in Development**:
   ```bash
   npm run dev
   ```

4. **Build for Production**:
   ```bash
   npm run build
   ```

5. **Run Tests**:
   ```bash
   npm test
   ```

## 🏗️ Architecture

The project follows a clean, modular architecture:
- `src/core`: Core logic and types.
- `src/services`: API abstraction layer and network services.
- `src/store`: State management (Pinia).
- `src/utils`: Reusable utilities (Logger, Storage, Validators).
- `src/components`: UI components (Common, Events, Layout).
- `src/views`: Page-level components.

## 🧪 Testing Strategy

- **Unit Tests**: Critical utilities and store logic are tested using Vitest.
- **Component Tests**: Interaction testing for forms and complex UI elements.
- **Mocking**: Axios is intercepted to use mock APIs (`reqres.in`, `mockapi.io`) for a consistent development experience.

---
Built with ❤️ by Antigravity.

## 📡 API Schema (mockapi.io)

To set up the MockAPI project for this application, use the following schema for the `events` resource.

### `events` Resource Schema

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| `id` | `string` | Unique identifier (Auto-generated) | Primary Key |
| `title` | `string` | Event title | Required, 5-100 chars |
| `description` | `string` | Detailed event description | Required, Min 20 chars |
| `date` | `string` | Event date and time (ISO format) | Required, Future date |
| `location` | `string` | Venue address | Required |
| `city` | `string` | City where event is held | Required, Min 2 chars |
| `category` | `string` | Event category | Required (e.g., Tech, Music) |
| `organizer` | `string` | Organizer name | Required |
| `thumbnail` | `string` | Main image URL | Required (Image URL) |
| `images` | `array` | Additional image URLs | Max 5 images |
| `attendeeCount` | `number` | Number of registered attendees | Positive integer |
| `isFavorited` | `boolean` | User's favorite status | Boolean |
| `lat` | `number` | Latitude for map location | -90 to 90 (Optional) |
| `lng` | `number` | Longitude for map location | -180 to 180 (Optional) |
| `attendeeLimit`| `number` | Maximum allowed attendees | Positive integer (Optional) |

---
