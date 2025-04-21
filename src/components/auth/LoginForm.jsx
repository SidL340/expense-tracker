import { useState, useContext } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Heading,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Container,
  useMediaQuery,
  Text,
  Divider,
  Icon,
  InputGroup,
  InputRightElement,
  IconButton
} from "@chakra-ui/react";
import { GlobalContext } from "../../context";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import "../../styles/animations.css";

export default function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { loginUser, loginWithGoogle, resendVerificationEmail, isLoading: authLoading } = useContext(GlobalContext);
  const toast = useToast();
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = await loginUser(email, password);
      if (user) {
        toast({
          title: "Login successful",
          description: "Welcome back!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setTimeout(() => {
          navigate('/');
        }, 1000);
      }
    } catch (error) {
      if (error.message.includes("email not verified")) {
        toast({
          title: "Email not verified",
          description: "Please verify your email before logging in",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      toast({
        title: "Login successful",
        description: "Welcome back!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      await resendVerificationEmail();
      toast({
        title: "Verification email sent",
        description: "Please check your email for the verification link",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (authLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="100vh">
        <Spinner size="xl" className="spinner" />
      </Box>
    );
  }

  return (
    <Container maxW="container.sm" py={8}>
      <Box
        className={`card-hover-effect ${isLargerThan768 ? 'fade-in' : 'mobile-fade-in'}`}
        p={8}
        borderRadius="lg"
        boxShadow="lg"
        bg="white"
      >
        <Heading 
          mb={6} 
          textAlign="center"
          className={isLargerThan768 ? 'slide-in' : 'mobile-slide-in'}
        >
          Welcome Back
        </Heading>
        <Text 
          mb={6} 
          textAlign="center" 
          color="gray.600"
          className={isLargerThan768 ? 'fade-in' : 'mobile-fade-in'}
        >
          Sign in to continue to your account
        </Text>
        <form onSubmit={handleSubmit}>
          <VStack spacing={6}>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="input-focus-effect"
                size="lg"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup size="lg">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input-focus-effect"
                />
                <InputRightElement>
                  <IconButton
                    variant="ghost"
                    icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              width="full"
              size="lg"
              isLoading={isLoading}
              loadingText="Logging in..."
              className="button-hover-effect"
            >
              Sign In
            </Button>

            <Button
              onClick={handleGoogleLogin}
              leftIcon={<Icon as={FaGoogle} />}
              colorScheme="red"
              variant="outline"
              width="full"
              size="lg"
              isLoading={isLoading}
              className="button-hover-effect"
            >
              Sign in with Google
            </Button>

            <Divider my={4} />

            <VStack spacing={2} width="full">
              <Button
                onClick={() => navigate('/signup')}
                variant="link"
                colorScheme="blue"
                className="button-hover-effect"
              >
                Don't have an account? Sign Up
              </Button>

              <Button
                onClick={() => navigate('/forgot-password')}
                variant="link"
                colorScheme="blue"
                className="button-hover-effect"
              >
                Forgot Password?
              </Button>

              <Button
                onClick={handleResendVerification}
                variant="link"
                colorScheme="blue"
                className="button-hover-effect"
              >
                Resend Verification Email
              </Button>
            </VStack>
          </VStack>
        </form>
      </Box>
    </Container>
  );
}
