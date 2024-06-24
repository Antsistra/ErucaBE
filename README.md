# Eruca Simple Store Management

The backend side of Eruca Simple Store Management

## Pre-requisite

- ### Node.js `v21.6.1`
    
    to run application

- ### Mysql Database`

    to run database 

## How to Run (for development purpose)

- copy file named `.env-sample` and rename it to `.env`.
- edit the `.env` file value as your desired such as DATABASE_URL, MIDTRANS_SERVER_KEY, MIDTRANS_CLIENT_KEY, and etc.
- run `npx prisma init` to init the prisma
- run `npx prisma db push` to push the database schema
- run `npm run dev`

## Troubleshoot
