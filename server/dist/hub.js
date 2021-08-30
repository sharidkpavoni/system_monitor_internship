"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const path_1 = require("path");
const socket_io_1 = require("socket.io");
const path_2 = __importDefault(require("path"));
/* Creating an Express application */
// app is a request handler function that has properties. It can be passed as an argument for the http server 
const app = express_1.default();
// creating an http server
const server = http_1.default.createServer(app);
// getting to views folder (publicPath) from hub.ts file path
const filename = process.cwd() + "\\hub.ts";
const dirname_string = path_1.dirname(filename);
const publicPath = path_2.default.join(dirname_string, "../static/views");
// express.static() is used to manage static files (js, CSS, HTML) so that we can load them directly (eg. http://localhost:3000/static/css/style.css)
// the first argument is the mount path for the static directory
app.use("/static", express_1.default.static("../static"));
// app.get() lets me define a route handler for GET requests to a given URL
app.get("/", (req, res) => {
    res.sendFile(path_2.default.join(publicPath, "/index.html"));
});
/* Creating a socket.io server instance */
const io = new socket_io_1.Server(server, {
    cors: { origin: "*" },
});
// Handling socket.io events
io.on('connection', (socket) => {
    console.log(`SERVER: User connected`);
    // Most important event which triggers the creation of the client-side HTML
    socket.on("sysData", (sysData) => {
        /* console.log(sysData); */
        io.emit("sysData", sysData);
    });
    socket.on("disconnect", (sysData) => {
        console.log(`SERVER: User ${sysData.id} disconnected`);
        io.emit("disconnectedUser", sysData.id);
    });
});
// Telling the server to listen to port 3001
// 0.0.0.0 -> server will run on all available interfaces
server.listen(3001, "0.0.0.0", () => {
    console.log("Listening to port: 3001");
});
