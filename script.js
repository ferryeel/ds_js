const amountInput = document.getElementById('amount');
const fromSelect = document.getElementById('from');
const toSelect = document.getElementById('to');
const resultDiv = document.getElementById('result');
const lastConversionDiv = document.getElementById('last-conversion');
const convertBtn = document.getElementById('convert');

// API configuration
const API_KEY = 'cur_live_BWYNOxeQKfSAwYDDMwwwsWcNuAN9ynEi0QdclLPe';
const BASE_URL = 'https://api.currencyapi.com/v3';

async function populateCurrencies() {
  try {
    const res = await fetch(`${BASE_URL}/currencies?apikey=${API_KEY}`);
    const data = await res.json();

    const symbols = data.data;
    for (let code in symbols) {
      const optionFrom = document.createElement('option');
      const optionTo = document.createElement('option');
      optionFrom.value = optionTo.value = code;
      optionFrom.textContent = optionTo.textContent = `${code} - ${symbols[code].name}`;
      fromSelect.appendChild(optionFrom);
      toSelect.appendChild(optionTo);
    }

    const saved = JSON.parse(localStorage.getItem('conversion'));
    if (saved) {
      amountInput.value = saved.amount;
      fromSelect.value = saved.from;
      toSelect.value = saved.to;
      convert(saved.amount, saved.from, saved.to);
    } else {
      fromSelect.value = 'USD';
      toSelect.value = 'EUR';
    }
  } catch (error) {
    resultDiv.textContent = "Erreur lors du chargement des devises.";
    console.error(error);
  }
}

async function convert(amount, from, to) {
  try {
    const res = await fetch(`${BASE_URL}/latest?apikey=${API_KEY}&base_currency=${from}&currencies=${to}`);
    const data = await res.json();

    const rate = data.data[to].value;
    const result = amount * rate;

    resultDiv.textContent = `${amount} ${from} = ${result.toFixed(2)} ${to}`;

    // Save last conversion
    const conversionData = { amount, from, to };
    localStorage.setItem('conversion', JSON.stringify(conversionData));
    lastConversionDiv.textContent = "Dernière conversion sauvegardée.";
  } catch (error) {
    resultDiv.textContent = "Erreur lors de la conversion.";
    console.error(error);
  }
}

convertBtn.addEventListener('click', () => {
  const amount = parseFloat(amountInput.value);
  const from = fromSelect.value;
  const to = toSelect.value;
  if (amount && from && to) {
    convert(amount, from, to);
  }
});

populateCurrencies();
