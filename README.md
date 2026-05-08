# School Management API

Node.js + Express.js + MySQL API for managing school data.
Add schools and retrieve them sorted by proximity to any location.

## Tech Stack

- Node.js
- Express.js
- MySQL
- mysql2 (database driver)

## MySQL Setup

### Step 1: Install MySQL

- **Windows**: Download from https://dev.mysql.com/downloads/installer/ and follow the setup wizard.
- **Mac**: Run `brew install mysql` then `brew services start mysql`.
- **Linux**: Run `sudo apt update && sudo apt install mysql-server` then `sudo systemctl start mysql`.

### Step 2: Open the MySQL terminal

```bash
mysql -u root -p
```

If you did not set a password, press Enter.

### Step 3: Create the database

```sql
CREATE DATABASE school_management;
```

Type `exit` to leave.

### Step 4: Update the .env file

```
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=school_management
```

The schools table will be created automatically on server start.

## Getting Started

```bash
npm install
npm run dev
```

## API Endpoints

### POST /addSchool

Add a new school.

| Field     | Type   | Required | Description         |
|-----------|--------|----------|---------------------|
| name      | string | yes      | Name of the school  |
| address   | string | yes      | School address      |
| latitude  | number | yes      | Between -90 and 90  |
| longitude | number | yes      | Between -180 and 180|

### GET /listSchools

Get all schools sorted by distance (nearest first).

| Param     | Type   | Required | Description    |
|-----------|--------|----------|----------------|
| latitude  | number | yes      | User latitude  |
| longitude | number | yes      | User longitude |

Example: `/listSchools?latitude=28.7041&longitude=77.1025`

## Project Structure

```
school-manage/
  config/db.js                 - MySQL connection and table setup
  controllers/schoolController.js - Business logic
  routes/schoolRoutes.js       - Route definitions
  server.js                    - Entry point
  .env                         - Environment variables
```

## Postman Collection

Import `School_Management_API.postman_collection.json` into Postman.

| Request                   | Method | Endpoint     | Description                   |
|---------------------------|--------|--------------|-------------------------------|
| Add School                | POST   | /addSchool   | Adds a school in Delhi        |
| Add School - Bangalore    | POST   | /addSchool   | Adds a school in Bangalore    |
| Add School - Mumbai       | POST   | /addSchool   | Adds a school in Mumbai       |
| List Schools              | GET    | /listSchools | Schools sorted by distance    |
