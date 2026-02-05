# Nuxt4 Starter Template - Project Plan

## Overview

A starter template with Nuxt4, Better Auth, Prisma ORM, MySQL, Shadcn-vue, Pinia, Tailwind CSS, and Zod.

---

## Phase 1: Initialize Nuxt4 Project

1. Create new Nuxt4 project using `npx nuxi@latest init .`
2. Install base dependencies

---

## Phase 2: Install & Configure Core Dependencies

1. **Tailwind CSS** - Install `@tailwindcss/vite` and configure in `nuxt.config.ts`
2. **Prisma ORM** - Install `prisma`, `@prisma/client`, `@prisma/adapter-mariadb`
   - Create `prisma/schema.prisma` with MySQL datasource and User model
3. **Better Auth** - Install `better-auth`
   - Configure auth schema in Prisma (User, Session, Account, Verification tables)
4. **Shadcn-vue** - Install via `npx shadcn-vue@latest init`
5. **Pinia** - Install `@pinia/nuxt` for state management
   - Create auth store for managing user state
6. **Zod** - Install `zod` for validation
7. **ESLint** - Install `@nuxt/eslint` module

---

## Phase 3: Project Structure

```
├── server/
│   ├── api/
│   │   └── auth/
│   │       ├── sign-in.post.ts
│   │       ├── sign-up.post.ts
│   │       ├── sign-out.post.ts
│   │       └── me.get.ts
│   └── lib/
│       ├── auth.ts          # Better Auth configuration
│       └── prisma.ts        # Prisma client instance
├── prisma/
│   └── schema.prisma        # Database schema
├── stores/
│   └── auth.ts              # Pinia auth store
├── components/
│   └── ui/                  # Shadcn components
├── lib/
│   └── auth-client.ts       # Client-side auth helpers
├── .env.example             # Environment variables template
└── README.md                # Setup guide
```

---

## Phase 4: Auth Implementation

1. Configure Better Auth with Prisma adapter
2. Create server routes:
   - `POST /api/auth/sign-up` - Register new user
   - `POST /api/auth/sign-in` - Login with email/password
   - `GET /api/auth/me` - Get current user
   - `POST /api/auth/sign-out` - Logout
3. Add Zod schemas for validation
4. Create Pinia auth store with user state and actions

---

## Phase 5: Documentation

1. Create `README.md` with:
   - Prerequisites (Node.js, MySQL)
   - Clone & install steps
   - Environment setup
   - Database migration commands
   - Development server start
   - Available auth endpoints

---

## Packages to Install

| Category | Packages |
|----------|----------|
| Core | `nuxt` (via nuxi init) |
| Styling | `@tailwindcss/vite`, `tailwindcss` |
| Database | `prisma`, `@prisma/client`, `@prisma/adapter-mariadb` |
| Auth | `better-auth` |
| State Management | `@pinia/nuxt` |
| UI | `shadcn-vue` (+ dependencies) |
| Validation | `zod` |
| Dev Tools | `@nuxt/eslint` |

---

## Status

- [x] Phase 1: Initialize Nuxt4 Project
- [x] Phase 2: Install & Configure Core Dependencies
- [x] Phase 3: Create Project Structure
- [x] Phase 4: Auth Implementation
- [x] Phase 5: Documentation
