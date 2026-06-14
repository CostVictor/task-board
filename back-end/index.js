import { createApp } from "./app.js";

const PORT = 8080;
const server = createApp();

server.listen(PORT, () => console.log("SERVER ON"));
