// This is where we can write functions for the calculations.
// We can't do the actual calculations here though, we need to request them from the node.js server.

async function wakeUpServer() { // This function wakes up the server on the node.js web app
    try {
        await fetch('https://health-insurance-calc-node-js-hucuece8hvhcgrep.centralus-01.azurewebsites.net', { method: GET })
    } catch (error) {
        console.error("Error waking up server: ", error)
    }
}