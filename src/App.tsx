import { BrowserRouter, Routes, Route } from "react-router";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Login } from "./pages/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Beans } from "./pages/Beans";
import { Forms } from "./pages/Forms";
import { ProductsList } from "./pages/ProductList";
import { ProductCreate } from "./pages/ProductCreate";
import { ProductEdit } from "./pages/ProductEdit";
import { OrdersList } from "./pages/OrderList";
import { Navigate } from "react-router";
import theme from "./theme/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OrderDetail } from "./pages/OrderDetail";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="inventory">
                <Route path="beans" element={<Beans />} />
                <Route path="forms" element={<Forms />} />
                <Route path="products" element={<ProductsList />} />
                <Route path="products/create" element={<ProductCreate />} />
                <Route path="products/edit/:id" element={<ProductEdit />} />
              </Route>
              <Route path="orders" element={<OrdersList />} />
              <Route path="orders/:id" element={<OrderDetail />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
