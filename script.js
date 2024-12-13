const squeegeeOptions = [
    { value: "flexy-flat", label: "Flexy Flat (120-140 sq ft/gal)", range: [200, 225] },
    { value: "stiff-flat", label: "Stiff Flat (100-120 sq ft/gal)", range: [200, 250] },
    { value: "8-12-mils", label: "8-12 mils (133-200 sq ft/gal)", range: [133, 200] },
    { value: "15-20-mils", label: "15-20 mils (80-106 sq ft/gal)", range: [80, 106] },
];

function toggleFlakeOptions() {
    const floorType = document.getElementById("floor-type").value;
    const flakeOptionsDiv = document.getElementById("flake-options");

    if (floorType === "flake") {
        flakeOptionsDiv.style.display = "block";
    } else {
        flakeOptionsDiv.style.display = "none";
    }
}

function generateCoatFields() {
    const coats = parseInt(document.getElementById("coats").value) || 0;
    const floorType = document.getElementById("floor-type").value;
    const coatFieldsDiv = document.getElementById("coat-fields");
    coatFieldsDiv.innerHTML = ""; // Clear existing fields

    for (let i = 1; i <= coats; i++) {
        const label = document.createElement("label");
        label.textContent = `Squeegee for Coat ${i}:`;

        const select = document.createElement("select");
        select.id = `tool-type-coat-${i}`;
        squeegeeOptions.forEach(option => {
            const opt = document.createElement("option");
            opt.value = option.value;
            opt.textContent = option.label;
            opt.dataset.rangeMin = option.range[0];
            opt.dataset.rangeMax = option.range[1];
            select.appendChild(opt);
        });

        const flakeLabel = document.createElement("label");
        flakeLabel.textContent = `Flake on Coat ${i}?`;
        flakeLabel.className = "flake-option";

        const flakeCheckbox = document.createElement("input");
        flakeCheckbox.type = "checkbox";
        flakeCheckbox.id = `flake-coat-${i}`;
        flakeCheckbox.className = "flake-option";

        // If floor type is "solid" and coats > 0, hide the flake option
        if (floorType === "solid") {
            flakeLabel.style.display = "none";
            flakeCheckbox.style.display = "none";
        }

        // Append elements to coat fields div
        coatFieldsDiv.appendChild(label);
        coatFieldsDiv.appendChild(select);
        coatFieldsDiv.appendChild(flakeLabel);
        coatFieldsDiv.appendChild(flakeCheckbox);
    }

    toggleFlakeOptions();
}

function calculateEpoxy() {
    // Get input values
    const floorSize = parseFloat(document.getElementById('floor-size').value);
    const floorType = document.getElementById('floor-type').value;
    const coats = parseInt(document.getElementById('coats').value);
    const flakeRate = parseFloat(document.getElementById('flake-rate').value) || 0.25;

    // Epoxy coverage (assumed average coverage)
    const epoxyCoverage = 150; // coverage in sq ft per gallon for solid epoxy
    const flakeCoverage = 100; // coverage in sq ft per lb for flakes (adjust based on your needs)

    // Calculate the epoxy required (gallons)
    const epoxyGallons = (floorSize * coats) / epoxyCoverage;

    // Calculate the flake required (lbs)
    const flakePounds = floorSize * coats * flakeRate;

    // Convert to liters (1 gallon = 3.78541 liters)
    const epoxyLiters = epoxyGallons * 3.78541;
    const flakeLiters = flakePounds * 3.78541 / 8.34; // Assuming flake density of 8.34 lbs per gallon (adjust if necessary)

    // Display results
    document.getElementById('epoxy-gallons').innerText = `Epoxy Required: ${epoxyGallons.toFixed(2)} Gallons`;
    document.getElementById('epoxy-liters').innerText = `Epoxy Required: ${epoxyLiters.toFixed(2)} Liters`;
    document.getElementById('flake-gallons').innerText = `Flake Required: ${flakePounds.toFixed(2)} Pounds`;
    document.getElementById('flake-liters').innerText = `Flake Required: ${flakeLiters.toFixed(2)} Liters`;

    // Show result
    document.getElementById('result').style.display = 'block';
}


// Set default number of coats to 0
document.getElementById("coats").value = 0;
toggleFlakeOptions(); // Hide the flake options by default for solid epoxy
