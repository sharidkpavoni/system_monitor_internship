import io from "socket.io-client";
import { execSync } from "child_process";
import { cpuUsage, totalmem, freemem } from "os-utils";

const socket = io("http://192.168.0.231:3001");

/* IDENTIFY CURRENT OS */
const isWin: boolean = process.platform === "win32";
const isLinux: boolean = process.platform === "linux";