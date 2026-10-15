// 🧮 Solution : la calculatrice

function addition(a, b) {
  return a + b;
}

function soustraction(a, b) {
  return a - b;
}

function multiplication(a, b) {
  return a * b;
}

function division(a, b) {
  if (b === 0) {
    return null;
  }
  return a / b;
}

function moyenne(nombres) {
  if (nombres.length === 0) {
    return 0;
  }
  let total = 0;
  for (const n of nombres) {
    total += n;
  }
  return total / nombres.length;
}
