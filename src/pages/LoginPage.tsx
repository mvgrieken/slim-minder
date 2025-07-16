import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Eye, EyeOff, ArrowLeft, Mail, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LoginContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[50]} 0%, ${({ theme }) => theme.colors.white} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[4]};
`;

const LoginCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  padding: ${({ theme }) => theme.spacing[8]};
  width: 100%;
  max-width: 400px;
  position: relative;
`;

const BackButton = styled(Link)`
  position: absolute;
  top: ${({ theme }) => theme.spacing[6]};
  left: ${({ theme }) => theme.spacing[6]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-decoration: none;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  transition: color ${({ theme }) => theme.transitions.duration.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const LoginTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const LoginSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]};
  padding-left: ${({ theme }) => theme.spacing[10]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  transition: all ${({ theme }) => theme.transitions.duration.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[400]};
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: ${({ theme }) => theme.spacing[3]};
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.gray[400]};
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: ${({ theme }) => theme.spacing[3]};
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.gray[400]};
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${({ theme }) => theme.colors.gray[600]};
  }
`;

const LoginButton = styled.button`
  background: ${({ theme }) => theme.colors.primary[600]};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[3]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.duration.fast};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primary[700]};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const RememberMeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  position: relative;
`;

const RememberMeTooltip = styled.div`
  position: absolute;
  top: -40px;
  left: 0;
  background: ${({ theme }) => theme.colors.gray[800]};
  color: white;
  padding: ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all ${({ theme }) => theme.transitions.duration.fast};
  z-index: 10;
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 20px;
    border: 4px solid transparent;
    border-top-color: ${({ theme }) => theme.colors.gray[800]};
  }
`;

const RememberMeContainerWithTooltip = styled.div`
  position: relative;
  
  &:hover ${RememberMeTooltip} {
    opacity: 1;
    visibility: visible;
  }
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  accent-color: ${({ theme }) => theme.colors.primary[600]};
`;

const RememberMeLabel = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
`;

const ForgotPassword = styled(Link)`
  text-align: center;
  color: ${({ theme }) => theme.colors.primary[600]};
  text-decoration: none;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-top: ${({ theme }) => theme.spacing[2]};

  &:hover {
    text-decoration: underline;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: ${({ theme }) => theme.spacing[6]} 0;
  color: ${({ theme }) => theme.colors.gray[400]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.colors.gray[300]};
  }

  &::before {
    margin-right: ${({ theme }) => theme.spacing[3]};
  }

  &::after {
    margin-left: ${({ theme }) => theme.spacing[3]};
  }
`;

const RegisterLink = styled.div`
  text-align: center;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};

  a {
    color: ${({ theme }) => theme.colors.primary[600]};
    text-decoration: none;
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.div`
  background: ${({ theme }) => theme.colors.error[50]};
  color: ${({ theme }) => theme.colors.error[700]};
  padding: ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  border: 1px solid ${({ theme }) => theme.colors.error[200]};
`;

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  // Load saved credentials on component mount
  React.useEffect(() => {
    const savedEmail = localStorage.getItem('slim_minder_saved_email');
    const savedRememberMe = localStorage.getItem('slim_minder_remember_me') === 'true';
    
    if (savedEmail && savedRememberMe) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []); // Remember me functionality - loads saved credentials on page load

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({ email, password, rememberMe });
      
      // Save credentials if rememberMe is checked
      if (rememberMe) {
        localStorage.setItem('slim_minder_saved_email', email);
        localStorage.setItem('slim_minder_remember_me', 'true');
      } else {
        // Clear saved credentials if rememberMe is unchecked
        localStorage.removeItem('slim_minder_saved_email');
        localStorage.removeItem('slim_minder_remember_me');
      }
      
      navigate('/dashboard');
    } catch (err) {
      setError('Er is een onverwachte fout opgetreden. Probeer het opnieuw.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setRememberMe(checked);
    
    // If unchecking rememberMe, clear saved credentials
    if (!checked) {
      localStorage.removeItem('slim_minder_saved_email');
      localStorage.removeItem('slim_minder_remember_me');
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <BackButton to="/">
          <ArrowLeft size={16} />
          Terug naar home
        </BackButton>

        <LoginHeader>
          <LoginTitle>Welkom terug</LoginTitle>
          <LoginSubtitle>Log in op je Slim Minder account</LoginSubtitle>
        </LoginHeader>

        <Form onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}

          <FormGroup>
            <Label htmlFor="email">E-mailadres</Label>
            <InputWrapper>
              <InputIcon>
                <Mail size={16} />
              </InputIcon>
              <Input
                id="email"
                type="email"
                placeholder="jouw@email.nl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Wachtwoord</Label>
            <InputWrapper>
              <InputIcon>
                <Lock size={16} />
              </InputIcon>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Je wachtwoord"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </PasswordToggle>
            </InputWrapper>
          </FormGroup>

          <RememberMeContainerWithTooltip>
            <RememberMeContainer>
              <Checkbox
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={handleRememberMeChange}
              />
              <RememberMeLabel htmlFor="rememberMe">
                Onthoud mij
              </RememberMeLabel>
            </RememberMeContainer>
            <RememberMeTooltip>
              Onthoud mij om je inloggegevens te onthouden voor de volgende keer.
            </RememberMeTooltip>
          </RememberMeContainerWithTooltip>

          <LoginButton type="submit" disabled={isLoading}>
            {isLoading ? 'Inloggen...' : 'Inloggen'}
          </LoginButton>

          <ForgotPassword to="/forgot-password">
            Wachtwoord vergeten?
          </ForgotPassword>
        </Form>

        <Divider>of</Divider>

        <RegisterLink>
          Nog geen account? <Link to="/register">Registreer je gratis</Link>
        </RegisterLink>
      </LoginCard>
    </LoginContainer>
  );
};

export default LoginPage; 