document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get({
    length: 16,
    useUpper: true,
    useLower: true,
    useNumbers: true,
    useSymbols: true
  }, (items) => {
    document.getElementById("length").value = items.length;
    document.getElementById("useUpper").checked = items.useUpper;
    document.getElementById("useLower").checked = items.useLower;
    document.getElementById("useNumbers").checked = items.useNumbers;
    document.getElementById("useSymbols").checked = items.useSymbols;
  });

  document.getElementById("save").addEventListener("click", () => {
    chrome.storage.sync.set({
      length: parseInt(document.getElementById("length").value),
      useUpper: document.getElementById("useUpper").checked,
      useLower: document.getElementById("useLower").checked,
      useNumbers: document.getElementById("useNumbers").checked,
      useSymbols: document.getElementById("useSymbols").checked
    }, () => {
      document.getElementById("statusMsg").textContent = "Settings saved!";
      setTimeout(() => document.getElementById("statusMsg").textContent = "", 2000);
    });
  });
});
