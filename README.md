# Task API
A simple Express, SQLite based task manager (headless)

### Installation
```
git clone https://github.com/iSanjayAchar/task-crud.git
cd task-crud

# Need NodeJS 16 or above
npm install
node index.js
```

### Consumption
- The project contains an exported [Postman](https://postman.com) collection. Import to access all APIs
- The project contains `database.sqlite` with seed data already.
- The project contains a shell script and dummy data to see. Running `bash ./seed/seed.sh` will recursively make API calls to create new records line by line
