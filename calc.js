// This is where we can write functions for the calculations.
// We can't do the actual calculations here though, we need to request them from the node.js server.

async function wakeUpServer() { // This function wakes up the server on the node.js web app
    try {
        await fetch('https://health-insurance-calc-node-js-hucuece8hvhcgrep.centralus-01.azurewebsites.net', { method: GET })
    } catch (error) {
        console.error("Error waking up server: ", error)
    }
}

/*
Example function from Savannah's dice roller:

async function rollDie(initialRoll = false, isPlayer = true) {
    try {
        const response = await fetch('https://dice-roller-azure-dna3engebka0e3hf.centralus-01.azurewebsites.net/roll'); <- Notice how to fetch. It's the link to the node.js server
        with the specific function you want to call at the end.
        const data = await response.json();
        const roll = data.roll;
        ...
}*/

// Replace with your Azure API URL
const API_URL = 'YOUR_AZURE_API_URL';

async function submitForm(event) {
    // Prevent the default form submission behavior - refreshing the page when the user clicks the button
    event.preventDefault();   

    // Get form values
    const age = document.getElementById('age').value;
    const weight = document.getElementById('weight').value;
    const heightFt = document.getElementById('heightFt').value;
    const heightIn = document.getElementById('heightIn').value;
    
    // Get selected family history conditions
    const familyHistory = Array.from(document.querySelectorAll('input[name="familyHistory"]:checked'))
        .map(checkbox => checkbox.value);
    
    const bloodPressure = document.getElementById('bloodPressure').value;

    // Prepare data for API
    const data = {
        age: parseInt(age),
        weight: parseFloat(weight),
        heightFt: parseInt(heightFt),
        heightIn: parseInt(heightIn),
        familyHistory: familyHistory,
        bloodPressure: bloodPressure
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        // Display the result
        const resultArea = document.getElementById('resultArea');
        const riskResult = document.getElementById('riskResult');
        resultArea.style.display = 'block';
        riskResult.textContent = `Risk Assessment: ${result.riskLevel}`;
        
    } catch (error) {
        console.error('Error:', error);
        alert('There was an error calculating the risk. Please try again.');
    }
}