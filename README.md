# SpedGrow - Junior Intern Developer Competency Test

This is a submission project for the Junior Intern Developer Competency Test at SpedGrow. The project consists of a backend API built with Laravel and a frontend SPA (Single Page Application) built with Vue.js.

## Project Objectives

The purpose of this test is to evaluate core technical competencies in:
- [cite_start] Backend Development using Laravel
- [cite_start] Frontend Integration using Vue.js
- [cite_start] Security and Data Handling
- [cite_start] Debugging and Programming Logic
- [cite_start] Development Standards and Documentation

## Technologies Used

- **Backend**: Laravel 11, PHP 8.2, Laravel Sanctum
- **Frontend**: Vue 3 (Composition API), Vue Router, Axios
- **Database**: SQLite (for easy setup)
- **Development Tools**: Node.js, NPM, Composer

## How to Run the Project

### Prerequisites
- PHP >= 8.1
- Composer
- Node.js >= 18.x
- NPM

### 1. Backend Setup (Laravel)

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Install Composer dependencies
composer install

# 3. Copy the environment file
cp .env.example .env

# 4. Generate application key
php artisan key:generate

# 5. Create SQLite database file
touch database/database.sqlite

# 6. Run migrations to create tables (including users & expenses)
php artisan migrate

# 7. (Optional) Run seeder to create dummy users
# php artisan db:seed # If you created a seeder

# 8. Start the backend development server (usually on port 8000)
php artisan serve
```

### 2. Frontend Setup (Vue JS)
```bash
# 1. Open a new terminal and navigate to the frontend directory
cd frontend

# 2. Install NPM dependencies
npm install

# 3. Start the frontend development server (usually on port 5173)
npm run dev
```
## Potential Improvements
With more time, I would:
- Include unit and integration tests for both backend and frontend to ensure robustness and maintainability.
- Improve UI/UX with better responsive design and enhanced error/loading state visuals.

Developed by Rizqika Mulia Pratama