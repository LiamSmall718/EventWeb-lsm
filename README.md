# EventWeb 

Une application web moderne et jolie de gestion d'événements construite avec React, Node.js et PostgreSQL

## Prérequis

- Node.js
- npm
- PostgreSQL

##  Installation super rapide

Copiez-collez ces commandes dans votre terminal :

```bash
# vérif que tout est là
node -v
npm -v
psql --version

# Cloner le projet
git clone https://github.com/LiamSmall718/EventWeb-lsm.git
cd EventWeb-lsm

# Configuration de la base PostgreSQL
dropdb -U postgres eventdb 2>/dev/null
createdb -U postgres eventdb
psql -U postgres -d eventdb -f event-backend/eventweb.sql

# Import du schéma SQL
psql -U postgres -d eventdb -f event-backend/eventweb.sql

# BACKEND (nouveau terminal, depuis la racine EventWeb)
cd event-backend
npm install
node src/server.js

# FRONTEND (nouveau terminal, depuis la racine EventWeb)
cd event-frontend
npm i react-hot-toast
npm install
npm run dev
```

L'application est dispo en navigateur à l'adresse : **http://localhost:5173**


