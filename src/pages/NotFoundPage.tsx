import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Home, ArrowLeft, Search } from 'lucide-react';

// Styled components
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[50]} 0%, ${({ theme }) => theme.colors.white} 100%);
  padding: ${({ theme }) => theme.spacing[6]};
`;

const Content = styled.div`
  text-align: center;
  max-width: 500px;
  width: 100%;
`;

const ErrorCode = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['5xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary[600]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSize['4xl']};
  }
`;

const ErrorTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ErrorDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const Button = styled(Link)<{ variant?: 'primary' | 'secondary' }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.components.button.padding.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.duration.fast} ${({ theme }) => theme.transitions.easing.easeOut};
  
  ${({ variant, theme }) =>
    variant === 'primary'
      ? `
        background-color: ${theme.colors.primary[600]};
        color: ${theme.colors.white};
        
        &:hover {
          background-color: ${theme.colors.primary[700]};
          transform: translateY(-1px);
          box-shadow: ${theme.shadows.lg};
        }
        
        &:focus {
          outline: none;
          box-shadow: 0 0 0 3px ${theme.colors.primary[100]};
        }
      `
      : `
        background-color: ${theme.colors.white};
        color: ${theme.colors.text.primary};
        border: 1px solid ${theme.colors.gray[300]};
        
        &:hover {
          background-color: ${theme.colors.gray[50]};
        }
        
        &:focus {
          outline: none;
          box-shadow: 0 0 0 3px ${theme.colors.gray[100]};
        }
      `}
      
  svg {
    width: 16px;
    height: 16px;
  }
`;

const Illustration = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  
  svg {
    width: 120px;
    height: 120px;
    color: ${({ theme }) => theme.colors.gray[400]};
  }
`;

const HelpSection = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[6]};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const HelpTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const HelpList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  text-align: left;
`;

const HelpItem = styled.li`
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  color: ${({ theme }) => theme.colors.text.secondary};
  
  &:before {
    content: '•';
    color: ${({ theme }) => theme.colors.primary[500]};
    margin-right: ${({ theme }) => theme.spacing[2]};
  }
`;

const NotFoundPage: React.FC = () => {
  return (
    <Container>
      <Content>
        <Illustration>
          <Search />
        </Illustration>
        
        <ErrorCode>404</ErrorCode>
        
        <ErrorTitle>
          Pagina niet gevonden
        </ErrorTitle>
        
        <ErrorDescription>
          De pagina die je zoekt bestaat niet of is verplaatst. 
          Controleer de URL of ga terug naar de homepage.
        </ErrorDescription>
        
        <ActionButtons>
          <Button variant="primary" to="/">
            <Home />
            Ga naar home
          </Button>
          
          <Button variant="secondary" to="/dashboard">
            <ArrowLeft />
            Terug naar dashboard
          </Button>
        </ActionButtons>
        
        <HelpSection>
          <HelpTitle>
            Hulp nodig?
          </HelpTitle>
          
          <HelpList>
            <HelpItem>
              Controleer of de URL correct gespeld is
            </HelpItem>
            <HelpItem>
              Ga terug naar de vorige pagina met je browser
            </HelpItem>
            <HelpItem>
              Bezoek onze homepage om opnieuw te beginnen
            </HelpItem>
            <HelpItem>
              Neem contact op als je denkt dat dit een fout is
            </HelpItem>
          </HelpList>
        </HelpSection>
      </Content>
    </Container>
  );
};

export default NotFoundPage; 