// This is where we can write functions for the calculations.
// We can't do the actual calculations here though, we need to request them from the node.js server.

document.getElementById("customerDataForm").addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent form reload

    // Gather form values
    const age = parseInt(document.getElementById("age").value);
    const weight = parseFloat(document.getElementById("weight").value);
    const feet = parseInt(document.getElementById("heightFt").value);
    const inches = parseInt(document.getElementById("heightIn").value);
    const height = (feet * 12) + inches;

    const bp = document.getElementById("bloodPressure").value;
    const familyHistory = Array.from(document.querySelectorAll("input[name='familyHistory']:checked"))
        .map(input => input.value);

    // Debugging console logs
    console.log("Collected form data:");
    console.log("Age:", age);
    console.log("Weight:", weight);
    console.log("Height (inches):", height);
    console.log("Blood Pressure:", bp);
    console.log("Family History:", familyHistory);

    try {
        // Step 1: BMI calculation
        const bmiRes = await fetch(`https://health-insurance-calc-node-js-hucuece8hvhcgrep.centralus-01.azurewebsites.net/calcBMI?weight=${weight}&height=${height}`);
        const bmiData = await bmiRes.json();
        const bmi = bmiData.bmi;
        const bmiCategory = bmiData.category;

        console.log("BMI Response:", bmiData);

        // Step 2: Total risk calculation
        const riskRes = await fetch(`https://health-insurance-calc-node-js-hucuece8hvhcgrep.centralus-01.azurewebsites.net/totalPoints?age=${age}&bmi=${bmi}&bloodPressure=${encodeURIComponent(bp)}&familyDisease=${encodeURIComponent(familyHistory.join(","))}`);
        const riskData = await riskRes.json();

        console.log("Risk Response:", riskData);

        // Step 3: Display full summary for agent
        document.getElementById("result").innerHTML = `
            <h3>Customer Risk Summary</h3>
            <ul>
                <li><strong>Age:</strong> ${age}</li>
                <li><strong>Weight:</strong> ${weight} lbs</li>
                <li><strong>Height:</strong> ${feet} ft ${inches} in</li>
                <li><strong>BMI:</strong> ${bmi} (${bmiCategory})</li>
                <li><strong>Total Risk Score:</strong> ${riskData.totalPoints}</li>
                <li><strong>Risk Category:</strong> ${riskData.riskCategory}</li>
            </ul>
        `;
    } catch (error) {
        console.error("❌ Error calculating risk:", error);
        document.getElementById("result").innerHTML = `
            <p style="color:red;">There was an error calculating the risk. Please try again later.</p>
        `;
    }
});

