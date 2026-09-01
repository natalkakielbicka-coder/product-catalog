# Product Catalog

A responsive e-commerce application built with Vue 3 and Vite.

The project includes a complete shopping flow: product browsing, filtering, favorites, comparison, cart management, checkout and local order history.

## Features

- Product catalog loaded from DummyJSON API
- Product search with suggestions and recent searches
- Category filtering
- Price range filtering
- Stock filtering
- Product sorting
- Pagination
- Product details page
- Product image gallery and lightbox
- Related products
- Recently viewed products
- Favorites
- Product comparison
- Shopping cart
- Quantity and stock limits
- Mini cart
- Free shipping progress indicator
- Multi-step checkout
- Delivery method selection
- Payment method selection
- Coupon codes
- Order confirmation
- Order history
- Order details
- Order status management
- Persistent data with localStorage
- Loading skeletons
- Error states
- Custom 404 page
- Responsive layout

## Tech Stack

- Vue 3
- Composition API
- Vue Router
- Vite
- JavaScript
- CSS
- DummyJSON API
- Local Storage
- vue-easy-lightbox
- ESLint
- Oxlint
- Prettier

## Project Structure

```text
src/
├── components/
├── composables/
├── directives/
├── services/
├── utils/
├── views/
├── router/
├── App.vue
└── main.js
```

The application separates responsibilities between:

- `components` – reusable UI components
- `views` – route-level pages
- `composables` – reusable state and business logic
- `services` – API communication and data normalization
- `utils` – shared helper functions
- `directives` – custom Vue directives

## State Management

The project uses Vue Composition API and reusable composables instead of an external state management library.

Shared application state includes:

- cart
- favorites
- product comparison
- recently viewed products
- orders

Selected data is persisted in `localStorage`, allowing it to survive page refreshes.

## API

Product data is loaded from:

[DummyJSON](https://dummyjson.com/products)

API responses are normalized in the service layer before being used by the application.

## Getting Started

Install dependencies:

```sh
npm install
```

Start the development server:

```sh
npm run dev
```

Create a production build:

```sh
npm run build
```

Preview the production build:

```sh
npm run preview
```

## Code Quality

Run linting:

```sh
npm run lint
```

Format source files:

```sh
npm run format
```

## Purpose

This project was created to practice building a larger Vue application with reusable components, composables, routing, asynchronous API communication and persistent client-side state.
