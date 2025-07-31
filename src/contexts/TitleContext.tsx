import { createContext, useContext } from "react";

// Create a context for the page title
const TitleContext = createContext<string>("");

// Export the provider and a hook to consume the title
export const TitleProvider = TitleContext.Provider;
export const usePageTitle = () => useContext(TitleContext);
