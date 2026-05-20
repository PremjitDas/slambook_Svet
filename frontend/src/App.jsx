import { lazy, Suspense } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
const LandingPage = lazy(() => import("@/pages/LandingPage"));
const QuizPage = lazy(() => import("@/pages/QuizPage"));
const ResultsPage = lazy(()=> import("@/pages/ResultsPage"));
const JoinPage = lazy(()=> import("@/pages/JoinPage"));

function App() {
  return (
    <div className="App min-h-screen bg-[#FBF9F6]">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Suspense>
                <LandingPage />
              </Suspense>
            }
          />
          <Route
            path="/quiz/:shareCode"
            element={
              <Suspense>
                <QuizPage />
              </Suspense>
            }
          />
          <Route
            path="/join/:shareCode"
            element={
              <Suspense>
                <JoinPage />
              </Suspense>
            }
          />
          <Route
            path="/results/:shareCode"
            element={
              <Suspense>
                <ResultsPage />
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
