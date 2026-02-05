# Nuxt 4 Starter Template

A starter template with Nuxt 4, Better Auth, Prisma ORM, MySQL, Shadcn-vue, Pinia, Tailwind CSS, and Zod.

## Tech Stack

- **Framework**: [Nuxt 4](https://nuxt.com/)
- **Authentication**: [Better Auth](https://www.better-auth.com/)
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **Database**: MySQL (via MariaDB adapter)
- **UI Components**: [shadcn-vue](https://www.shadcn-vue.com/)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Linting**: [@nuxt/eslint](https://eslint.nuxt.com/)

## Prerequisites

- Node.js 20.x or newer
- MySQL server running locally or remotely

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd <project-name>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example environment file:

```bash
cp .env.example .env
```

Update `.env` with your configuration:

```env
# Database connection string
DATABASE_URL="mysql://user:password@localhost:3306/database_name"

# App URL
NUXT_PUBLIC_APP_URL="http://localhost:3000"

# Better Auth secret (min 32 characters)
BETTER_AUTH_SECRET="your-secret-key-here-min-32-chars"
```

### 4. Create the database

Create a MySQL database matching your `DATABASE_URL`:

```sql
CREATE DATABASE database_name;
```

### 5. Run database migrations

Generate the Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 6. Start the development server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
├── app/
│   ├── assets/css/          # Tailwind CSS styles
│   ├── components/ui/       # shadcn-vue components
│   ├── lib/utils.ts         # shadcn-vue utilities
│   ├── plugins/
│   │   └── auth.client.ts   # Better Auth plugin
│   └── app.vue              # Root component
├── generated/prisma/        # Generated Prisma client
├── prisma/
│   └── schema.prisma        # Database schema
├── server/
│   ├── api/
│   │   └── auth/
│   │       └── [...all].ts  # Better Auth API handler
│   └── lib/
│       ├── auth.ts          # Better Auth configuration
│       └── prisma.ts        # Prisma client instance
└── nuxt.config.ts           # Nuxt configuration
```

## Auth Endpoints

Better Auth provides the following endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/sign-up/email` | Register with email/password |
| POST | `/api/auth/sign-in/email` | Login with email/password |
| POST | `/api/auth/sign-out` | Logout |
| GET | `/api/auth/session` | Get current session |

## Usage Examples

### Using Better Auth

```vue
<script setup lang="ts">
const { $auth } = useNuxtApp()

const session = $auth.useSession()

async function handleLogin() {
  await $auth.signIn.email({
    email: 'user@example.com',
    password: 'password',
  })
}

async function handleLogout() {
  await $auth.signOut()
}
</script>

<template>
  <div v-if="session.data?.user">
    <p>Welcome, {{ session.data.user.name }}</p>
    <button @click="handleLogout">Logout</button>
  </div>
  <div v-else>
    <button @click="handleLogin">Login</button>
  </div>
</template>
```

## Adding Shadcn Components

Add components using the CLI:

```bash
npx shadcn-vue@latest add button
npx shadcn-vue@latest add input
npx shadcn-vue@latest add card
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run generate` | Generate static site |
| `npx prisma studio` | Open Prisma Studio |
| `npx prisma migrate dev` | Run database migrations |

## License

MIT
