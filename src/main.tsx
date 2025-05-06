import ReactDOM from "react-dom/client";
import App from "./App";
import i18n from "./i18n/index";
import { I18nextProvider } from "react-i18next";
import { LanguageProvider } from "./contexts/LanguagesContext";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import "../src/i18n"
import { CharacterCountProvider } from "./pages/CharacterCountContext";
import "./index.css";
import { AuthProvider } from "./services/auth_context";
const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <LanguageProvider>
         <CharacterCountProvider>
            <Toaster
              position="top-right"
              reverseOrder={false}
              toastOptions={{
                style: {
                  background: "#333",
                  color: "#fff",
                },
              }}
            />
            <AuthProvider>
            <App />
            </AuthProvider>
         </CharacterCountProvider>
        </LanguageProvider>
      </I18nextProvider>
    </QueryClientProvider>
  </BrowserRouter>
);
