// This is where we can write functions for the calculations.
// We can't do the actual calculations here though, we need to request them from the node.js server.


async function wakeUpServer() {
    try {
        await fetch('https://health-insurance-calc-node-js-hucuece8hvhcgrep.centralus-01.azurewebsites.net');
    } catch (error) {
        console.error("Error waking up server: ", error);
    }
}

// Handle form submission
document.getElementById("customerDataForm").addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent default form submit behavior

    // Get input values
    const age = parseInt(document.getElementById("age").value);
    const weight = parseFloat(document.getElementById("weight").value);
    const feet = parseInt(document.getElementById("heightFt").value);
    const inches = parseInt(document.getElementById("heightIn").value);
    const height = (feet * 12) + inches;

    const bp = document.getElementById("bloodPressure").value;

    const familyHistory = Array.from(document.querySelectorAll("input[name='familyHistory']:checked"))
        .map(input => input.value);

    try {
        // Step 1: Calculate BMI
        const bmiRes = await fetch(`https://health-insurance-calc-node-js-hucuece8hvhcgrep.centralus-01.azurewebsites.net/calcBMI?weight=${weight}&height=${height}`);
        const bmiData = await bmiRes.json();
        const bmi = bmiData.bmi;
        const bmiCategory = bmiData.category;

        // Step 2: Get total risk points
        const riskRes = await fetch(`https://health-insurance-calc-node-js-hucuece8hvhcgrep.centralus-01.azurewebsites.net/totalPoints?age=${age}&bmi=${bmi}&bloodPressure=${bp}&familyDisease=${familyHistory.join(",")}`);
        const riskData = await riskRes.json();

        // Step 3: Display results
        document.getElementById("result").innerHTML = `
            <h3>Results</h3>
            <p><strong>BMI:</strong> ${bmi} (${bmiCategory})</p>
            <p><strong>Total Risk Score:</strong> ${riskData.totalPoints}</p>
            <p><strong>Risk Category:</strong> ${riskData.riskCategory}</p>
        `;
    } catch (error) {
        console.error("Error calculating risk:", error);
        document.getElementById("result").innerHTML = `
            <p style="color:red;">There was an error calculating the risk. Please try again later.</p>
        `;
    }
});
