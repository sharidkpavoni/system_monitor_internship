
const random0_100 = () => {
    return Math.floor(Math.random() * (100 - 0 + 1) + 0);
}

let sysData = {
    'id': Date.now(),
    'CPU_usage': random0_100(),
    'RAM_usage': random0_100(),
    'RAM_free': RAM_usage*81.92
}
