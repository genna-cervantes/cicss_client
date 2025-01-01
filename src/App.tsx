import React, { useEffect } from "react";
import { loadGoogleScript } from "./utils/googleUtils";

const App = () => {
  useEffect(() => {
    const initializeGoogle = async () => {
      try {
        await loadGoogleScript();

        if (window.google) {
          window.google.accounts.id.initialize({
            client_id:
              "192935754120-n3qdl8lqcm29fvr7sivfrli1uimf7r7q.apps.googleusercontent.com",
            callback: (response: any) => {
              console.log("Encoded JWT ID token: ", response.credential);
            },
          });

          window.google.accounts.id.renderButton(
            document.getElementById("google-login") as HTMLElement,
            {
              theme: "outline",
              size: "large",
            }
          );
        } else {
          console.error("Google object not found on window.");
        }
      } catch (error) {
        console.error("Error loading Google script:", error);
      }
    };

    initializeGoogle();
  }, []);

  return <div id="google-login"></div>;
};

export default App;
