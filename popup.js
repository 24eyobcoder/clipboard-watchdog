function generateStrongPassword(length, opts) {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const digits = "0123456789";
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  let pool = "";
  let password = [];

  if (opts.useUpper) {
    pool += upper;
    password.push(upper[Math.floor(Math.random() * upper.length)]);
  }
  if (opts.useLower) {
    pool += lower;
    password.push(lower[Math.floor(Math.random() * lower.length)]);
  }
  if (opts.useNumbers) {
    pool += digits;
    password.push(digits[Math.floor(Math.random() * digits.length)]);
  }
  if (opts.useSymbols) {
    pool += symbols;
    password.push(symbols[Math.floor(Math.random() * symbols.length)]);
  }

  for (let i = password.length; i < length; i++) {
    password.push(pool[Math.floor(Math.random() * pool.length)]);
  }

  return password.sort(() => 0.5 - Math.random()).join("");
}

document.getElementById("generateBtn").addEventListener("click", () => {
  chrome.storage.sync.get({
    length: 16,
    useUpper: true,
    useLower: true,
    useNumbers: true,
    useSymbols: true
  },async (opts) => {
    const pwd = generateStrongPassword(opts.length, opts);
    document.getElementById("passwordBox").value = pwd;
    document.getElementById("statusMsg").textContent = "Generated!";
  });
});

document.getElementById("copyBtn").addEventListener("click", () => {
  const pwdBox = document.getElementById("passwordBox");
  if (pwdBox.value) {
    navigator.clipboard.writeText(pwdBox.value)
      .then(() => {
        document.getElementById("statusMsg").textContent = "Copied!";
      })
      .catch(err => {
        document.getElementById("statusMsg").textContent = "Copy failed.";
      });
  }
});
