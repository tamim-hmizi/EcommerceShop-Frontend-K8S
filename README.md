# EcommerceShop Frontend (Kubernetes)

React storefront and admin dashboard of the EcommerceShop application, wired to the EcommerceShop microservices (auth, users, products, categories, orders, carts, favorites) for the AKS / Kubernetes deployment use case of the QuickOps platform. It shares its code with [EcommerceShop-Frontend](https://github.com/tamim-hmizi/EcommerceShop-Frontend); the differences are the microservice resource paths (`/carts`, `/categories`) used by the cart and category services.

## Features

- Storefront: home page, product catalogue with category filtering and a quick-view modal, contact page
- Cart with a guest cart that is merged into the user's server-side cart after sign-in
- Favorites, order history (My Orders) and a profile page with profile picture upload
- Sign-in and registration, with protected routes for authenticated users and administrators
- Admin area: dashboard (sales, order status, category, user growth charts, top products, recent orders, time filter) and management of users, products, orders and categories
- Light and dark themes
- State persisted with Redux Toolkit and redux-persist; HTTP calls through a shared Axios client that adds the JWT bearer token

## Tech stack

React 19, Vite 8, Redux Toolkit, React Router 7, Tailwind CSS 4 with daisyUI 5, Chart.js (react-chartjs-2), Axios, react-toastify, ESLint. Served in production by nginx.

## Environment variables

Copy `.env.example` to `.env`. Vite inlines these at build time.

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the API (the microservices entry point, for example the ingress or API gateway). Defaults to `http://localhost:5000/api`. |

## Run locally

Requires Node.js 22.

```bash
npm install
npm run dev      # http://localhost:5173
```

## Build

```bash
npm run build    # output in dist/
npm run preview
npm run lint
```

## Docker

Multi-stage image: `node:22-alpine` builds the bundle, `nginx:stable-alpine` serves it on port 3000 with an SPA fallback (`nginx.conf`).

```bash
docker build --build-arg VITE_API_URL=https://<your-ingress-host>/api -t ecommerceshop-frontend-k8s .
docker run -p 3000:3000 ecommerceshop-frontend-k8s
```

## Related repositories

- [EcommerceShop-Frontend](https://github.com/tamim-hmizi/EcommerceShop-Frontend) - storefront for the monolithic backend
- [EcommerceShop-Frontend-K8S](https://github.com/tamim-hmizi/EcommerceShop-Frontend-K8S) - storefront wired to the microservices
- [EcommerceShop-monolithic-backend](https://github.com/tamim-hmizi/EcommerceShop-monolithic-backend) - Express/MongoDB monolith
- Microservices: [auth](https://github.com/tamim-hmizi/EcommerceShop-microservice-auth), [users](https://github.com/tamim-hmizi/EcommerceShop-microservice-users), [products](https://github.com/tamim-hmizi/EcommerceShop-microservice-products), [categories](https://github.com/tamim-hmizi/EcommerceShop-microservice-categories), [orders](https://github.com/tamim-hmizi/EcommerceShop-microservice-orders), [carts](https://github.com/tamim-hmizi/EcommerceShop-microservice-carts), [favorites](https://github.com/tamim-hmizi/EcommerceShop-microservice-favorites)
- [QuickOps-Frontend](https://github.com/tamim-hmizi/QuickOps-Frontend) - the QuickOps platform that deployed this use case

---

Part of the MERN e-commerce use case for QuickOps, 2025, by Tamim Hmizi: https://tamim-hmizi.github.io/Portfolio/
