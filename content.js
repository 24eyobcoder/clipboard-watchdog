function evaluatePasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score >= 5) return "Strong";
  if (score >= 3) return "Medium";
  return "Weak";
}

function createTooltip(strength) {
  const existing = document.getElementById("password-strength-tip");
  if (existing) existing.remove();

  const tip = document.createElement("div");
  tip.id = "password-strength-tip";
  tip.style.position = "absolute";
  tip.style.background = "#fff";
  tip.style.border = "1px solid #ccc";
  tip.style.padding = "6px";
  tip.style.fontSize = "14px";
  tip.style.zIndex = 9999;
  tip.style.color = strength === "Strong" ? "green" : strength === "Medium" ? "orange" : "red";
  tip.textContent = `Password Strength: ${strength}`;
  document.body.appendChild(tip);
  return tip;
}

document.querySelectorAll('input[type="password"]').forEach(input => {
  input.addEventListener("input", (e) => {
    const strength = evaluatePasswordStrength(e.target.value);
    const tooltip = createTooltip(strength);
    const rect = input.getBoundingClientRect();
    tooltip.style.top = `${rect.top + window.scrollY - 40}px`;
    tooltip.style.left = `${rect.left + window.scrollX}px`;
  });
});
