const squeegeeTypes = {
    "Stiff Flat (200-300 sq ft/gal)": [200, 300],
    "Flexy Flat (150-175 sq ft/gal)": [150, 175],
    "8-12 mils (133-200 sq ft/gal)": [133, 200],
    "15-20 mils (80-106 sq ft/gal)": [80, 106]
};

const calculateBtn = document.getElementById('calculateBtn');
const squeegeeInputs = document.getElementById('squeegeeInputs');
const results = document.getElementById('results');
const flakeInputSection = document.getElementById('flakeInputSection');
const floorTypeSelect = document.getElementById('floorType');

document.getElementById('numCoats').addEventListener('input', function () {
    if (this.value === '') {
        // Allow the user to temporarily clear the input
        return;
    }
    const numCoats = Math.max(1, parseInt(this.value) || 1);
    this.value = numCoats; // Ensure the input field stays at least 1

    // Clear previous selections
    squeegeeInputs.innerHTML = ''; 

    // Always add at least one squeegee type input
    for (let i = 1; i <= numCoats; i++) {
        squeegeeInputs.innerHTML += `
            <select id="coat${i}" class="calculator-select" required>
                ${Object.keys(squeegeeTypes).map(type => `<option value="${type}">${type}</option>`).join('')}
            </select>
        `;
    }
});

// Initial population of squeegee input for 1 coat (when the page loads)
document.addEventListener('DOMContentLoaded', function () {
    const numCoats = 1;  // Default to 1 coat
    for (let i = 1; i <= numCoats; i++) {
        squeegeeInputs.innerHTML += `
            <select id="coat${i}" class="calculator-select" required>
                ${Object.keys(squeegeeTypes).map(type => `<option value="${type}">${type}</option>`).join('')}
            </select>
        `;
    }
});


floorTypeSelect.addEventListener('change', function() {
    if (this.value === 'flake') {
        flakeInputSection.style.display = 'block';
    } else {
        flakeInputSection.style.display = 'none';
    }
});

calculateBtn.addEventListener('click', () => {
    const floorSize = parseFloat(document.getElementById('floorSize').value);
    const numCoats = parseInt(document.getElementById('numCoats').value);
    const floorType = document.getElementById('floorType').value;
    const flakeCoverage = parseFloat(document.getElementById('flakeCoverage').value);

    if (!floorSize || floorSize <= 0 || !numCoats || numCoats <= 0 || !floorType || (floorType === "flake" && flakeCoverage <= 0)) {
        alert('Please fill in all required fields with valid values.');
        return;
    }

    let totalMinEpoxy = 0;
    let totalMaxEpoxy = 0;

    for (let i = 1; i <= numCoats; i++) {
        const squeegeeType = document.getElementById(`coat${i}`).value;
        const [minCoverage, maxCoverage] = squeegeeTypes[squeegeeType];
        totalMinEpoxy += floorSize / maxCoverage;
        totalMaxEpoxy += floorSize / minCoverage;
    }

    const epoxyGallonsMin = totalMinEpoxy.toFixed(2);
    const epoxyGallonsMax = totalMaxEpoxy.toFixed(2);
    const epoxyLitresMin = (totalMinEpoxy * 3.785).toFixed(2);
    const epoxyLitresMax = (totalMaxEpoxy * 3.785).toFixed(2);
    let flakeBoxes = 0;

    if (floorType === "flake") {
        const flakePerBox = 40; // lbs per box
        flakeBoxes = Math.ceil((floorSize * flakeCoverage) / flakePerBox);
    }

    results.innerHTML = `
        <p><strong>Results:</strong></p>
        <p>Total Epoxy: ${epoxyGallonsMin} - ${epoxyGallonsMax} gallons (${epoxyLitresMin} - ${epoxyLitresMax} litres)</p>
        ${flakeBoxes > 0 ? `<p>Total Flake: ${flakeBoxes} Boxes (40lb each)</p>` : ''}
    `;
});
