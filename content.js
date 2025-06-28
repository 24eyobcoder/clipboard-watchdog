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

function createTooltip(id, text, color, topOffset = -40) {
  const existing = document.getElementById(id);
  if (existing) existing.remove();

  const tip = document.createElement("div");
  tip.id = id;
  tip.style.position = "absolute";
  tip.style.background = "#fff";
  tip.style.border = "1px solid #ccc";
  tip.style.padding = "6px";
  tip.style.fontSize = "14px";
  tip.style.zIndex = 9999;
  tip.style.color = color;
  tip.style.fontWeight = "bold";
  tip.textContent = text;
  document.body.appendChild(tip);

  return tip;
}

async function checkPasswordBreach(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);

  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const fullHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();

  const prefix = fullHash.slice(0, 5);
  const suffix = fullHash.slice(5);

  const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
  const text = await response.text();

  return text.split('\n').some(line => line.startsWith(suffix));
}

document.querySelectorAll('input[type="password"]').forEach(input => {
  input.addEventListener("input", (e) => {
    const strength = evaluatePasswordStrength(e.target.value);
    const tooltip = createTooltip("password-strength-tip", `Strength: ${strength}`, strength === "Strong" ? "green" : strength === "Medium" ? "orange" : "red");
    const rect = input.getBoundingClientRect();
    tooltip.style.top = `${rect.top + window.scrollY - 40}px`;
    tooltip.style.left = `${rect.left + window.scrollX}px`;
  });

  input.addEventListener("blur", async (e) => {
    const pwd = e.target.value;
    if (pwd.length < 6) return; // avoid checking short passwords

    const isBreached = await checkPasswordBreach(pwd);
    const breachTip = createTooltip(
      "password-breach-warning",
      isBreached ? "⚠️ This password has been breached!" : "✅ Password not found in breaches.",
      isBreached ? "red" : "green",
      5 // position below input
    );
    const rect = input.getBoundingClientRect();
    breachTip.style.top = `${rect.top + window.scrollY + 40}px`;
    breachTip.style.left = `${rect.left + window.scrollX}px`;
  });
});
