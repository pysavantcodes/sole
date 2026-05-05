import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Why from "./pages/Why";
import Story from "./pages/Story";
import Ecosystem from "./pages/Ecosystem";
import Product from "./pages/Product";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import MyAccount from "./pages/account/MyAccount";
import Orders from "./pages/account/Orders";
import Cart from "./pages/cart/Cart";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicOnlyRoute from "./routes/PublicOnlyRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            element={
              <Layout>
                <Home />
              </Layout>
            }
            path="/"
          />
          <Route
            element={
              <Layout>
                <Why />
              </Layout>
            }
            path="/why"
          />
          <Route
            element={
              <Layout>
                <Story />
              </Layout>
            }
            path="/story"
          />
          <Route
            element={
              <Layout>
                <Ecosystem />
              </Layout>
            }
            path="/ecosystem"
          />
          <Route
            element={
              <Layout>
                <Product />
              </Layout>
            }
            path="/pod"
          />
          <Route
            element={
              <Layout>
                <PublicOnlyRoute>
                  <Login />
                </PublicOnlyRoute>
              </Layout>
            }
            path="/login"
          />
          <Route
            element={
              <Layout>
                <PublicOnlyRoute>
                  <Signup />
                </PublicOnlyRoute>
              </Layout>
            }
            path="/signup"
          />
          <Route
            element={
              <Layout>
                <PublicOnlyRoute>
                  <ForgotPassword />
                </PublicOnlyRoute>
              </Layout>
            }
            path="/forgot-password"
          />
          <Route
            element={
              <Layout>
                <PublicOnlyRoute>
                  <ResetPassword />
                </PublicOnlyRoute>
              </Layout>
            }
            path="/reset-password"
          />
          <Route
            element={
              <Layout>
                <ProtectedRoute>
                  <MyAccount />
                </ProtectedRoute>
              </Layout>
            }
            path="/account"
          />
          <Route
            element={
              <Layout>
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              </Layout>
            }
            path="/account/orders"
          />
          <Route
            element={
              <Layout>
                <Cart />
              </Layout>
            }
            path="/cart"
          />
          <Route element={<NotFound />} path="*" />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
