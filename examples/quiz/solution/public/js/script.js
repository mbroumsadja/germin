// ❓ Solution : le moteur de quiz

function calculerScore(reponses, bonnesReponses) {
  let score = 0;
  for (let i = 0; i < reponses.length && i < bonnesReponses.length; i++) {
    if (reponses[i] === bonnesReponses[i]) {
      score++;
    }
  }
  return score;
}

function pourcentage(score, total) {
  if (total === 0) {
    return 0;
  }
  return Math.round((score / total) * 100);
}

function mention(pourcentage) {
  if (pourcentage >= 80) {
    return 'Excellent';
  }
  if (pourcentage >= 50) {
    return 'Bien';
  }
  return 'À revoir';
}

function melanger(tableau) {
  const copie = [...tableau];
  for (let i = copie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copie[i], copie[j]] = [copie[j], copie[i]];
  }
  return copie;
}
