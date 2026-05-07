// Handle form submission
document.getElementById('calculatorForm').addEventListener('submit', function(e) {
    e.preventDefault();
    calculateResistance();
});

function calculateResistance() {
    // Get input values
    const squadPower = parseFloat(document.getElementById('squadPower').value);
    const targetDamage = parseFloat(document.getElementById('targetDamage').value);
    const actualVirus = parseFloat(document.getElementById('actualVirus').value);
    const actualRequired = parseFloat(document.getElementById('actualRequired').value);

    // Validate inputs
    if (isNaN(squadPower) || isNaN(targetDamage) || isNaN(actualVirus) || isNaN(actualRequired)) {
        alert('Please fill in all fields with valid numbers');
        return;
    }

    // Calculate damage and attack flag
    const result = calculateDamageLogic(squadPower, targetDamage, actualVirus, actualRequired);

    // Display results
    displayResults(result.damage, result.attackFlag);
}

function calculateDamageLogic(squadPower, targetDamage, actualVirus, actualRequired) {
    /**
     * PLACEHOLDER FUNCTION
     * Replace this logic with the actual game formula
     * 
     * Expected return format:
     * {
     *     damage: number,
     *     attackFlag: 'YES' | 'NO'
     * }
     */

    // Temporary calculation (replace with actual formula)
    const damage = targetDamage * (squadPower / 100);
    const attackFlag = actualVirus >= actualRequired ? 'YES' : 'NO';

    return {
        damage: Math.round(damage),
        attackFlag: attackFlag
    };
}

function displayResults(damage, attackFlag) {
    // Update result values
    document.getElementById('damageDealtValue').textContent = damage.toLocaleString();
    document.getElementById('attackFlagValue').textContent = attackFlag;

    // Show results section
    document.getElementById('results').classList.remove('hidden');

    // Update attack flag styling
    const attackResultElement = document.querySelector('.attack-result');
    if (attackFlag === 'YES') {
        attackResultElement.style.borderColor = '#00d9ff';
        attackResultElement.style.color = '#00d9ff';
        attackResultElement.style.background = 'rgba(0, 217, 255, 0.1)';
    } else {
        attackResultElement.style.borderColor = '#e63946';
        attackResultElement.style.color = '#e63946';
        attackResultElement.style.background = 'rgba(230, 57, 70, 0.1)';
    }

    // Scroll to results
    setTimeout(() => {
        document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

function resetCalculator() {
    // Clear form
    document.getElementById('calculatorForm').reset();

    // Hide results
    document.getElementById('results').classList.add('hidden');

    // Scroll to top
    document.getElementById('calculatorForm').scrollIntoView({ behavior: 'smooth' });
}
