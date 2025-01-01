// src/utils/googleUtils.ts

export const loadGoogleScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.getElementById("google-script")) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.id = "google-script";
    script.async = true;
    script.defer = true;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google script"));

    document.body.appendChild(script);
  });
};
