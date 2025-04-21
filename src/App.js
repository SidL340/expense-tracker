import { Box, Container, Flex } from "@chakra-ui/react";
import Main from "./compnents/main/index";
import FinancialTools from "./components/financial-tools";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/auth/LoginForm";
import SignupForm from "./components/auth/SignupForm";
import ForgotPassword from "./components/auth/ForgotPassword";
import { GlobalContext } from "./context";
import { useContext } from "react";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useContext(GlobalContext);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AuthRoute({ children }) {
  const { isAuthenticated } = useContext(GlobalContext);
  return !isAuthenticated ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <Router>
      <Container bg={"#f8fafd"} maxW={"Container.3xl"} height={"100vh"} p={"0"}>
        <Flex height={"full"}>
          <Box height={"full"} flex={'5'} w={["20%", "30%", "20%", "50%", "60%"]}>
            <Routes>
              <Route path="/" element={
                <ProtectedRoute>
                  <Main />
                </ProtectedRoute>
              } />
              <Route path="/financial-tools" element={
                <ProtectedRoute>
                  <FinancialTools />
                </ProtectedRoute>
              } />
              <Route path="/login" element={
                <AuthRoute>
                  <LoginForm />
                </AuthRoute>
              } />
              <Route path="/signup" element={
                <AuthRoute>
                  <SignupForm />
                </AuthRoute>
              } />
              <Route path="/forgot-password" element={
                <AuthRoute>
                  <ForgotPassword />
                </AuthRoute>
              } />
            </Routes>
          </Box>
        </Flex>
      </Container>
    </Router>
  );
}

export default App;
