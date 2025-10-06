# Recipe Sharing Application

An Angular app where users can post, view, edit, and delete recipes.  
Built with **Angular**, **Reactive Forms**, **Routing**, and a mock backend using **json-server**.

---

## Quick Start

```bash
# Clone repo
git clone https://github.com/your-username/recipe-sharing-app.git
cd recipe-sharing-app

# Install dependencies
npm install

# Start Angular frontend
ng serve   # http://localhost:4200
OR
npm start

# Start mock backend
npx json-server --watch db.json --port 3000
OR
npm run server

```

## Features

- Display recipe list with details (title, description, thumbnail).
- View full recipe with ingredients & instructions.
- Add, edit, and delete recipes.
- Search recipes by title or ingredients.
- Routing with 404 page.
- (Optional) Mark and filter favorite recipes.

---

## Tech Stack

- Angular 20
- Angular Router
- Reactive Forms
- json-server (mock backend)

---

## Project Structure

src/app/
├── components/ (list, detail, form, not-found)
├── services/recipe.service.ts
└── app-routing.module.ts
db.json # mock backend
