# Blobio
This is a multiplayer browser based game, heavily inspired by agar.io


https://github.com/user-attachments/assets/9222d33b-0e19-4c78-980d-c08bb04e1ef1


## Backend
Server uses Cloudflare Durable Objects which is a serverless offering by Cloudflare. Built on top of workers, it provides 0 downtime (as it is running on top of a CF worker) and provides a generous free tier of 100k HTTP requests, ideal for making a game or handling game-room logic.

## Frontend
Uses NextJS, and Native HTML Canvas API functions for the moving, collision and zooming out logic.

Consider starring the repo if you found it interesting!
