// Handle form submission
document.getElementById('calculatorForm').addEventListener('submit', function(e) {
    e.preventDefault();
    calculateResistance();
});

// Format number inputs with thousand separator as user types
const numberInputs = document.querySelectorAll('input[type="number"]');
numberInputs.forEach(input => {
    input.addEventListener('input', function(e) {
        let value = this.value.replace(/,/g, '');
        if (value) {
            this.value = formatNumber(value);
        }
    });

    input.addEventListener('blur', function(e) {
        if (this.value) {
            let value = this.value.replace(/,/g, '');
            this.value = formatNumber(value);
        }
    });
});

// Format number with thousand separator
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Remove formatting before calculation
function getNumericValue(formattedValue) {
    return parseFloat(formattedValue.toString().replace(/,/g, ''));
}

function calculateResistance() {
    // Get input values and remove formatting
    const squadPower = getNumericValue(document.getElementById('squadPower').value);
    const targetDamage = getNumericValue(document.getElementById('targetDamage').value);
    const actualVirus = getNumericValue(document.getElementById('actualVirus').value);
    const actualRequired = getNumericValue(document.getElementById('actualRequired').value);

    // Validate inputs
    if (isNaN(squadPower) || isNaN(targetDamage) || isNaN(actualVirus) || isNaN(actualRequired)) {
        alert('Please fill in all fields with valid numbers');
        return;
    }

    // Calculate damage and attack flag
    const result = calculateDamageLogic(squadPower, targetDamage, actualVirus, actualRequired);

    // Display results
    displayResults(result.damageDeal, result.attackFlag);
}

function calculateDamageLogic(squadPower, targetDamage, actualVirus, actualRequired) {
    /**
     * Last War Resistance Calculator Formula
     * Optimized from Google Sheets
     * 
     * Variables:
     * - squadPower: Squad Power (C4)
     * - targetDamage: Target Damage (C6)
     * - actualVirus: Actual Virus Resistance (B10)
     * - actualRequired: Actual Required (C10)
     */

    // Step 1: Calculate MISSING
    // MISSING = IF(actualRequired - actualVirus < 0; 0; actualRequired - actualVirus)
    const missing = Math.max(0, actualRequired - actualVirus);

    // Step 2: Calculate Missing / Required
    // Missing / Required = IF(actualRequired = 0; 0; missing / actualRequired)
    const missingRatio = actualRequired === 0 ? 0 : missing / actualRequired;

    // Step 3: Calculate Ceiling (ROUNDUP to 2 decimal places)
    // Ceiling = ROUNDUP(missingRatio; 2)
    const ceiling = Math.ceil(missingRatio * 100) / 100;

    // Step 4: Calculate 100% - 2x
    // 100% - 2x = 1 - (2 * ceiling)
    const percentageDamage = 1 - (2 * ceiling);

    // Step 5: Calculate Real % Damage Deal
    // IF(percentageDamage > 0; percentageDamage; IF(0.01 + (percentageDamage / 20) < 0.001; 0.001; 0.01 + (percentageDamage / 20)))
    let realPercentageDamage;
    if (percentageDamage > 0) {
        realPercentageDamage = percentageDamage;
    } else {
        const alternativeCalc = 0.01 + (percentageDamage / 20);
        realPercentageDamage = Math.max(0.001, alternativeCalc);
    }

    // Step 6: Calculate Damage Deal
    // Damage Deal = squadPower * realPercentageDamage
    const damageDeal = Math.round(squadPower * realPercentageDamage);

    // Step 7: Calculate ATTACK FLAG
    // ATTACK FLAG = IF(damageDeal < targetDamage; "NO"; "YES")
    const attackFlag = damageDeal < targetDamage ? 'NO' : 'YES';

    return {
        damageDeal: damageDeal,
        attackFlag: attackFlag
    };
}

function displayResults(damageDeal, attackFlag) {
    // Update damage deal value with formatting
    document.getElementById('damageDealtValue').textContent = formatNumber(damageDeal.toString());

    // Update attack flag value
    document.getElementById('attackFlagValue').textContent = attackFlag;

    // Show results section
    document.getElementById('results').classList.remove('hidden');

    // Update attack result styling based on YES or NO
    const attackResultElement = document.querySelector('.attack-result');
    
    if (attackFlag === 'YES') {
        // Green styling for YES
        attackResultElement.classList.add('yes');
        attackResultElement.classList.remove('no');
        attackResultElement.style.borderColor = '#00d946';
        attackResultElement.style.color = '#00d946';
        attackResultElement.style.background = 'rgba(0, 217, 70, 0.1)';
    } else {
        // Red styling for NO
        attackResultElement.classList.add('no');
        attackResultElement.classList.remove('yes');
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
