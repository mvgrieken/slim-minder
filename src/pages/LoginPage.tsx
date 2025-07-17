import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield, CheckCircle, AlertTriangle } from 'react-feather';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login({ email, password, rememberMe });
      navigate('/dashboard');
    } catch (err) {
      setError('Inloggegevens zijn onjuist. Probeer het opnieuw.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <BackgroundPattern />
      <Content>
        <FormCard>
          <LogoSection>
            <LogoIcon>
              <Shield size={32} />
            </LogoIcon>
            <LogoText>Slim Minder</LogoText>
            <LogoSubtitle>Financiële controle in je handen</LogoSubtitle>
          </LogoSection>

          <FormSection>
            <FormTitle>Welkom terug</FormTitle>
            <FormSubtitle>Log in om je financiële reis voort te zetten</FormSubtitle>

            {error && (
              <ErrorMessage>
                <AlertTriangle size={16} />
                {error}
              </ErrorMessage>
            )}

            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <InputLabel>E-mailadres</InputLabel>
                <InputWrapper>
                  <InputIcon>
                    <Mail size={16} />
                  </InputIcon>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jouw@email.nl"
                    required
                  />
                </InputWrapper>
              </FormGroup>

              <FormGroup>
                <InputLabel>Wachtwoord</InputLabel>
                <InputWrapper>
                  <InputIcon>
                    <Lock size={16} />
                  </InputIcon>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
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

              <FormOptions>
                <CheckboxWrapper>
                  <Checkbox
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <CheckboxLabel htmlFor="rememberMe">
                    <CheckboxCustom checked={rememberMe}>
                      {rememberMe && <CheckCircle size={12} />}
                    </CheckboxCustom>
                    Onthoud mij
                  </CheckboxLabel>
                </CheckboxWrapper>
                <ForgotLink to="/forgot-password">Wachtwoord vergeten?</ForgotLink>
              </FormOptions>

              <SubmitButton type="submit" disabled={isLoading}>
                {isLoading ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    Inloggen
                    <ArrowRight size={16} />
                  </>
                )}
              </SubmitButton>
            </Form>

            <Divider>
              <DividerText>of</DividerText>
            </Divider>

            <SocialButtons>
              <SocialButton type="button">
                <GoogleIcon>G</GoogleIcon>
                Doorgaan met Google
              </SocialButton>
            </SocialButtons>

            <SignupPrompt>
              Nog geen account?{' '}
              <SignupLink to="/register">Maak een gratis account aan</SignupLink>
            </SignupPrompt>
          </FormSection>
        </FormCard>

        <FeaturesSection>
          <FeatureCard>
            <FeatureIcon>
              <Shield size={24} />
            </FeatureIcon>
            <FeatureTitle>Veilig & Betrouwbaar</FeatureTitle>
            <FeatureDescription>
              Bank-level beveiliging met end-to-end encryptie
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <CheckCircle size={24} />
            </FeatureIcon>
            <FeatureTitle>PSD2 Compliant</FeatureTitle>
            <FeatureDescription>
              Officiële bankkoppeling volgens Europese standaarden
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <ArrowRight size={24} />
            </FeatureIcon>
            <FeatureTitle>Direct Resultaat</FeatureTitle>
            <FeatureDescription>
              Binnen 2 minuten inzicht in je financiën
            </FeatureDescription>
          </FeatureCard>
        </FeaturesSection>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.background} 0%, ${({ theme }) => theme.colors.gray50} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  position: relative;
  overflow: hidden;
`;

const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 80%, ${({ theme }) => theme.colors.primary}10 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, ${({ theme }) => theme.colors.primary}05 0%, transparent 50%);
  pointer-events: none;
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing['4xl']};
  max-width: 1200px;
  width: 100%;
  z-index: 1;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing['2xl']};
  }
`;

const FormCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  overflow: hidden;
`;

const LogoSection = styled.div`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.primaryDark} 100%);
  padding: ${({ theme }) => theme.spacing['2xl']};
  text-align: center;
  color: ${({ theme }) => theme.colors.white};
`;

const LogoIcon = styled.div`
  width: 64px;
  height: 64px;
  background: ${({ theme }) => theme.colors.white}20;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.white};
`;

const LogoText = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const LogoSubtitle = styled.p`
  opacity: 0.9;
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const FormSection = styled.div`
  padding: ${({ theme }) => theme.spacing['2xl']};
`;

const FormTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const FormSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.error}10;
  border: 1px solid ${({ theme }) => theme.colors.error}20;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FormGroup = styled.div``;

const InputLabel = styled.label`
  display: block;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const InputIcon = styled.div`
  position: absolute;
  left: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  z-index: 1;
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.fontSizes.base};
  transition: all ${({ theme }) => theme.transitions.fast};
  background: ${({ theme }) => theme.colors.surface};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}10;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textTertiary};
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: ${({ theme }) => theme.spacing.md};
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const FormOptions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Checkbox = styled.input`
  display: none;
`;

const CheckboxCustom = styled.div<{ checked: boolean }>`
  width: 16px;
  height: 16px;
  border: 2px solid ${({ theme, checked }) => checked ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme, checked }) => checked ? theme.colors.primary : 'transparent'};
  color: ${({ theme }) => theme.colors.white};
  transition: all ${({ theme }) => theme.transitions.fast};
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
`;

const ForgotLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primaryHover};
  }
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.primaryDark} 100%);
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.base};
  box-shadow: ${({ theme }) => theme.shadows.md};

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid ${({ theme }) => theme.colors.white}40;
  border-top: 2px solid ${({ theme }) => theme.colors.white};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: ${({ theme }) => theme.spacing.xl} 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.colors.border};
  }
`;

const DividerText = styled.span`
  padding: 0 ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const SocialButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const SocialButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-1px);
  }
`;

const GoogleIcon = styled.div`
  width: 18px;
  height: 18px;
  background: #4285f4;
  color: white;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 12px;
`;

const SignupPrompt = styled.p`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const SignupLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primaryHover};
  }
`;

const FeaturesSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`;

const FeatureCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.md};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  transition: all ${({ theme }) => theme.transitions.base};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const FeatureIcon = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}20 0%, ${({ theme }) => theme.colors.primary}10 100%);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
`;

const FeatureTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const FeatureDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.4;
`;

export default LoginPage; 