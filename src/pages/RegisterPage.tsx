import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const RegisterContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[50]} 0%, ${({ theme }) => theme.colors.white} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[4]};
`;

const RegisterCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  padding: ${({ theme }) => theme.spacing[8]};
  width: 100%;
  max-width: 500px;
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

const RegisterHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const RegisterTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const RegisterSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[4]};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
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

const RememberMeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
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



const RegisterButton = styled.button`
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

const LoginLink = styled.div`
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

const SuccessMessage = styled.div`
  background: ${({ theme }) => theme.colors.success[50]};
  color: ${({ theme }) => theme.colors.success[700]};
  padding: ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  border: 1px solid ${({ theme }) => theme.colors.success[200]};
`;

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Wachtwoorden komen niet overeen');
      return;
    }

    if (formData.password.length < 8) {
      setError('Wachtwoord moet minimaal 8 karakters lang zijn');
      return;
    }

    setIsLoading(true);

    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        acceptTerms: formData.acceptTerms
      });
      
      setSuccess('Account succesvol aangemaakt! Je wordt doorgestuurd naar je dashboard.');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError('Er is een onverwachte fout opgetreden. Probeer het opnieuw.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <BackButton to="/">
          <ArrowLeft size={16} />
          Terug naar home
        </BackButton>

        <RegisterHeader>
          <RegisterTitle>Maak je account</RegisterTitle>
          <RegisterSubtitle>Start vandaag nog met Slim Minder</RegisterSubtitle>
        </RegisterHeader>

        <Form onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}

          <FormRow>
            <FormGroup>
              <Label htmlFor="firstName">Voornaam</Label>
              <InputWrapper>
                <InputIcon>
                  <User size={16} />
                </InputIcon>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Jan"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                />
              </InputWrapper>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="lastName">Achternaam</Label>
              <InputWrapper>
                <InputIcon>
                  <User size={16} />
                </InputIcon>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Jansen"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                />
              </InputWrapper>
            </FormGroup>
          </FormRow>

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
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </InputWrapper>
          </FormGroup>

          <FormRow>
            <FormGroup>
              <Label htmlFor="password">Wachtwoord</Label>
              <InputWrapper>
                <InputIcon>
                  <Lock size={16} />
                </InputIcon>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimaal 8 karakters"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
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

            <FormGroup>
              <Label htmlFor="confirmPassword">Bevestig wachtwoord</Label>
              <InputWrapper>
                <InputIcon>
                  <Lock size={16} />
                </InputIcon>
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Herhaal wachtwoord"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required
                />
                <PasswordToggle
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </PasswordToggle>
              </InputWrapper>
            </FormGroup>
          </FormRow>

          <RememberMeContainer>
            <Checkbox
              type="checkbox"
              id="acceptTerms"
              checked={formData.acceptTerms}
              onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
              required
            />
            <RememberMeLabel htmlFor="acceptTerms">
              Ik ga akkoord met de <Link to="/terms" style={{ color: 'inherit', textDecoration: 'underline' }}>gebruiksvoorwaarden</Link> en <Link to="/privacy" style={{ color: 'inherit', textDecoration: 'underline' }}>privacybeleid</Link>
            </RememberMeLabel>
          </RememberMeContainer>

          <RegisterButton type="submit" disabled={isLoading}>
            {isLoading ? 'Account aanmaken...' : 'Account aanmaken'}
          </RegisterButton>
        </Form>

        <Divider>of</Divider>

        <LoginLink>
          Heb je al een account? <Link to="/login">Log hier in</Link>
        </LoginLink>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default RegisterPage; 