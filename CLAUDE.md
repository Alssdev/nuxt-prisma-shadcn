# CLAUDE.md

## Do
- use Nuxt4
- use Pinia as State Manager
- default to small components. prefer focused modules over god components
- default to small files and diffs. avoid repo wide rewrites unless asked
- use 2 space tab indent
- use single quotes
- use semicolon
- tell the user (me) if he is wrong
- use Nuxt MCP Server
- use Prisma ORM MCP Server

## Don't
- do not create custom css clases, use tailwindcss always.
- do not hard code colors, create new tailwind tokens instead.
- do not add new heavy dependencies without approval
- do not use TypeScript comment directives
- do not use ESLint comment directives
- do not read type definitions in node_modules/, instead, read docs or use MCP Servers.
- do not use `any` as type in .ts files
- don't add design, testing or dir structures in .md plan files.
- don't modify package-lock.json manually
- avoid using @@map in prisma schema

## Commands
### Type check a single file by path
npx tsc --noEmit path/to/file.ts

### Lint
npx eslint --fix path/to/file.tsx

Note: Always lint and typecheck updated files. Use project-wide build sparingly.

## Project structure
- front-end lives in `./app/`
- back-end lives in `./server/`

## When stuck
- ask a clarifying question, propose a short plan, or open a draft PR with notes
- do not push large speculative changes without confirmation
