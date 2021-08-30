import io from "socket.io-client";
import { execSync } from "child_process";
import { cpuUsage, totalmem, freemem } from "os-utils";

const socket = io("http://192.168.0.231:3001");

/* IDENTIFY CURRENT OS */
const isWin= process.platform === "win32";
const isLinux = process.platform === "linux";

/* INTERFACE FOR SYSTEM DATA */
// Defining diskInfo type
type diskInfo = [string, number];
interface IsysData {
    id: number;
    CPU_usage: number[];
    RAM_usage: number[];
    RAM_free: number[];
    DISK_used: diskInfo[];
    DISK_free: diskInfo[];
}
// Initialization of the sysData object
let sysData: IsysData = {
    id: Date.now(),
    CPU_usage: [],
    RAM_usage: [],
    RAM_free: [],
    DISK_used: [],
    DISK_free: []
}

/* DISK INFO */
let diskUsed: diskInfo[] = [];
let diskFree: diskInfo[] = [];
const calculateDiskWin = () => {
    // Command for partition info
    const output = execSync("wmic logicaldisk", { encoding: "utf-8" });
    /* PARSING THE OUTPUT FROM THE COMMAND */
    // Splitting text on new lines
    const output0 = output.split(/\r?\n/);
    // Removing excessive whitespaces and replacing them with a single space. Array output1 contains data for each partition
    const output1 = [] as string[];
    for (let i = 1; i < output0.length - 2; i++) {
        output1.push(output0[i].replace(/\s+/g, " "));
    }
    // Splitting strings in output1 by space. The result is an array of arrays (any[]?)
    const output2 = [] as any[];
    // Emptying the two arrays to avoid redundancy
    diskUsed = [];
    diskFree = [];
    // Pushing in the two arrays the data I need, namely arrays of [partLetter, partUsedSpaceGB/partFreeSpaceGB]
    for (let i = 0; i < output1.length; i++) {
        output2[i] = output1[i].split(" ");
        // Picking out/elaborating what we need from output2[i]
        let partName: string = output2[i][19];
        let partLetter: string = output2[i][1];
        let partFreeSpaceGB: number = parseFloat((output2[i][10]/Math.pow(1024,3)).toFixed(1))
        let partTotalSpaceGB: number = parseFloat((output2[i][14]/Math.pow(1024,3)).toFixed(1))
        let partUsedSpaceGB: number = partTotalSpaceGB-partFreeSpaceGB;
        let partUsedSpacePercent: number = (partUsedSpaceGB/partTotalSpaceGB)/100
        if (partLetter !== undefined && partUsedSpacePercent !== 0) {
            diskUsed.push([partLetter, partUsedSpaceGB]);
            diskFree.push([partLetter, partFreeSpaceGB]);
        }
    }
}
/* REFRESHING REST OF PARAMETERS */
const refreshData = (sysData: IsysData) => {
    // CPU usage
    cpuUsage((value) => {
        if (sysData.CPU_usage.length < 5) {
            let currentCpuUsage = parseFloat((value*100).toFixed(1))
            sysData.CPU_usage.push(currentCpuUsage);
        }
    })
}
// Windows
if (isWin) {
    // Calculating disk info
    calculateDiskWin();
    // Refreshing other parameters
    refreshData();
    

}