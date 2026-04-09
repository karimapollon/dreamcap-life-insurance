import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { FunnelProvider } from "./contexts/FunnelContext";
import Landing from "./pages/Landing";
import Estimate from "./pages/Estimate";
import Results from "./pages/Results";
import Conversion from "./pages/Conversion";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Landing} />
      <Route path={"/estimate"} component={Estimate} />
      <Route path={"/results"} component={Results} />
      <Route path={"/convert"} component={Conversion} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <FunnelProvider>
        <ThemeProvider
          defaultTheme="light"
          // switchable
        >
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </FunnelProvider>
    </ErrorBoundary>
  );
}

export default App;
