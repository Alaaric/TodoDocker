# Symfony / React Template

This project is a template setup combining Symfony for the backend and React with Vite and TypeScript for the frontend.

## Used Technologies

<div align="center">
  <table>
    <tr>
      <td align="center" style="padding: 15px;">
        <img src="https://img.icons8.com/color/48/000000/php.png" alt="PHP" /><br/>
        <strong>PHP</strong><br/> Version: >=8.2
      </td>
      <td align="center" style="padding: 15px;">
        <img src="https://img.icons8.com/color/48/000000/symfony.png" alt="Symfony" /><br/>
        <strong>Symfony</strong><br/> Version: 7.1.*
      </td>
      <td align="center" style="padding: 15px;">
        <img src="https://img.icons8.com/color/48/000000/react-native.png" alt="React" /><br/>
        <strong>React</strong><br/> Version: ^18.3.1
      </td>
      <td align="center" style="padding: 15px;">
        <img src="https://vitejs.dev/logo.svg" alt="Vite" width="48" height="48" /><br/>
        <strong>Vite</strong><br/> Version: ^5.4.9
      </td>
      <td align="center" style="padding: 15px;">
        <img src="https://img.icons8.com/color/48/000000/typescript.png" alt="TypeScript" /><br/>
        <strong>TypeScript</strong><br/> Version: ~5.6.2
      </td>
    </tr>
  </table>
</div>

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- PHP
- Composer
- Node.js (recommended version: 18.x or later)
- npm (Node Package Manager)
- A database server (e.g., MySQL, PostgreSQL)

## Getting Started

Follow these steps to set up the project:

### 1. Use this repository as template

On github select this template for your new repository

### 2. Setup environements variables

add and edit .env.local files in front and back directory

### 3. Install dependencies

In your project root directory run the following command:

```bash
npm run install-all
```

### 4. Generate your APP_SECRET

In your project root directory run the following command:

```bash
npm run generate-secret
```

### 5. Setup database

In your project root directory run the following command:

```bash
npm run setup-db
```

### 6. test your project

In your project root directory run the following command:

```bash
npm run up
```

## Usefull commands

Migrate your new database schema and fixtures:

```bash
npm run migrate
```

update this readme technologies version:

```bash
npm run readme-update
```
