import "./styles/index.css";
import Layout from "./components/layout";
import { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import routers from "./routers/router";
function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout>
            <Routes>
              {routers.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  element={<route.component />}
                />
              ))}
            </Routes>
          </Layout>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
