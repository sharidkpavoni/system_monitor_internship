/* import * as echarts from "./node_modules/echarts/dist/echarts.min.js"; */
var Chart = require("chart.js");
var ctx = document.getElementById("myChart").getContext("2d");
var myChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "# of Votes",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

const socket = io("ws://192.168.0.231:3001"); // we use ws (WebSocket) here
// The io object (the socket.io client library) is now globally available in the browser

// We're ready to listen to events
socket.on("message", (message) => {
  const msgElement = document.createElement("li");
  msgElement.innerHTML = message;
  /* console.log(msgElement); */
  document.getElementById("messages").appendChild(msgElement);
}); // we listen to the 'message' event EMITTED BY THE SERVER

// Displaying CPU usage on client side
/* socket.on("cpuUsage", (package) => {
  if (document.getElementById(package.id)) {
    let el = document.getElementById(package.id);
    el.innerHTML = package.cpuUsage;
  } else if (!document.getElementById(package.id)) {
    let newEl = document.createElement("li");
    newEl.id = package.id;
    newEl.innerHTML = package.cpuUsage;
    document.getElementById("system").appendChild(newEl);
  }
}); */

let timers = {}; // Object to contain all timers for deleting not updated data on page

socket.on("sysData", (sysData) => {
  if (!timers[sysData.id]) {
    timers[sysData.id] = []; // Creating an array which will contain up to 2 timers at a time for every user. Look down for info
  }

  timers[sysData.id].push(
    setTimeout(() => {
      document.getElementById(sysData.id).remove();
      console.log(`Deleting node ${sysData.id}`);
    }, 4000)
  );

  if (timers[sysData.id].length > 1) {
    // Idea is that for every user I have an array of timers. At the beginning I have 0 timers, one is created. Then another one is created. Array length is now 2, I delete the first timer from the array and clear the timer. Then another timer is created and the first one gets deleted and cleared, and so on.
    const t = timers[sysData.id].shift();
    clearTimeout(t);
    console.log(`Clearing timer for ${sysData.id}`);
  }

  /* console.log(timers); */

  if (!document.getElementById(sysData.id)) {
    let tableRows = document.querySelector(".sysDataTableRows");

    /* Disk Data Formatting */
    // Used disk
    let usedDisk = "";
    for (let i = 0; i < sysData.DISK_used.length; i++) {
      usedDisk += `${sysData.DISK_used[i][0]} ${sysData.DISK_used[i][1]}%<br>`; // this is actually the free space
    }
    // Free disk
    let freeDisk = "";
    for (let i = 0; i < sysData.DISK_free.length; i++) {
      freeDisk += `${sysData.DISK_free[i][0]} ${sysData.DISK_free[i][1]}<br>`;
    }

    let newRow = document.createElement("tr");
    newRow.id = sysData.id;
    newRow.innerHTML = `<th scope="row">${sysData.id}</th>
        <td class='CPU'>${sysData.CPU_usage}</td>
        <td class='RAMused'>${sysData.RAM_usage}</td>
        <td class='RAMfree'>${sysData.RAM_free}</td>
        <td class='DISKused-container'>${usedDisk}</td>
        <td class='DISKfree-container'>${freeDisk}</td>`;

    tableRows.appendChild(newRow);
  } else if (document.getElementById(sysData.id)) {
    let row = document.getElementById(sysData.id);

    /* Disk Data Formatting */

    // Used disk
    let usedDisk = "";
    for (let i = 0; i < sysData.DISK_used.length; i++) {
      usedDisk += `${sysData.DISK_used[i][0]} ${sysData.DISK_used[i][1]}%<br>`;
    }
    // Free disk
    let freeDisk = "";
    for (let i = 0; i < sysData.DISK_free.length; i++) {
      freeDisk += `${sysData.DISK_free[i][0]} ${sysData.DISK_free[i][1]}<br>`;
    }
    /*  */

    row.innerHTML = `<th scope="row">${sysData.id}</th>
        <td class='CPUload'>${sysData.CPU_usage}</td>
        <td class='RAMused'>${sysData.RAM_usage}</td>
        <td class='RAMfree'>${sysData.RAM_free}</td>
        <td class='DISKused-container'>${usedDisk}</td>
        <td class='DISKfree-container'>${freeDisk}</td>`;
  }
});
