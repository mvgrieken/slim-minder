import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  TrendingUp, 
  Shield, 
  Target, 
  MessageCircle, 
  Award, 
  Smartphone,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

// Styled components
const HomePage = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[50]} 0%, ${({ theme }) => theme.colors.white} 100%);
`;

const Header = styled.header`
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary[600]};
`;

const Nav = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.spacing[6]};
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.duration.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  align-items: center;
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
      `
      : `
        background-color: transparent;
        color: ${theme.colors.text.primary};
        border: 1px solid ${theme.colors.gray[300]};
        
        &:hover {
          background-color: ${theme.colors.gray[50]};
        }
      `}
`;

const Main = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing[6]};
`;

const HeroSection = styled.section`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[20]} 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing[12]} 0;
  }
`;

const HeroTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['5xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  }
`;

const HeroSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
  }
`;

const HeroButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing[12]};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    align-items: center;
  }
`;

const FeaturesSection = styled.section`
  padding: ${({ theme }) => theme.spacing[20]} 0;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['3xl']};
  margin-top: ${({ theme }) => theme.spacing[12]};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[12]};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing[8]};
  margin-top: ${({ theme }) => theme.spacing[12]};
`;

const FeatureCard = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[6]};
`;

const FeatureIcon = styled.div<{ color: string }>`
  display: flex;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  
  svg {
    width: 48px;
    height: 48px;
    color: ${({ color }) => color};
  }
`;

const FeatureTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

const BenefitsSection = styled.section`
  padding: ${({ theme }) => theme.spacing[20]} 0;
  text-align: center;
`;

const BenefitsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};
  margin-top: ${({ theme }) => theme.spacing[12]};
  text-align: left;
`;

const BenefitItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const BenefitIcon = styled.div`
  flex-shrink: 0;
  margin-top: ${({ theme }) => theme.spacing[1]};
  
  svg {
    width: 20px;
    height: 20px;
    color: ${({ theme }) => theme.colors.secondary[500]};
  }
`;

const BenefitText = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const CTASection = styled.section`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[600]} 0%, ${({ theme }) => theme.colors.primary[800]} 100%);
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing[20]} 0;
  text-align: center;
  border-radius: ${({ theme }) => theme.borderRadius['3xl']};
  margin: ${({ theme }) => theme.spacing[12]} 0;
`;

const CTATitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const CTADescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  opacity: 0.9;
`;

const CTAButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.primary[600]};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[100]};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
  }
`;

const HomePageComponent: React.FC = () => {
  const features = [
    {
      icon: <TrendingUp />,
      color: '#0ea5e9', // primary-500
      title: 'Inzichtelijke overzichten',
      description: 'Krijg direct inzicht in je inkomsten en uitgaven met automatische categorisatie en duidelijke grafieken.'
    },
    {
      icon: <Target />,
      color: '#22c55e', // secondary-500
      title: 'Slimme budgetten',
      description: 'Stel budgetten in per categorie en ontvang tijdige waarschuwingen voordat je over je limiet gaat.'
    },
    {
      icon: <MessageCircle />,
      color: '#8b5cf6', // purple
      title: 'AI-coach',
      description: 'Krijg persoonlijk financieel advies van onze intelligente coach die je uitgavenpatroon begrijpt.'
    },
    {
      icon: <Award />,
      color: '#f59e0b', // warning-500
      title: 'Gamification',
      description: 'Verdien badges en behaal uitdagingen terwijl je je financiële doelen realiseert.'
    },
    {
      icon: <Shield />,
      color: '#ef4444', // error-500
      title: 'Bankbeveiliging',
      description: 'Veilige bankkoppeling via PSD2 met hoogste beveiligingsstandaarden.'
    },
    {
      icon: <Smartphone />,
      color: '#6366f1', // indigo
      title: 'Altijd bereikbaar',
      description: 'Gebruik Slim Minder op web, iOS en Android. Jouw financiën altijd binnen handbereik.'
    }
  ];

  const benefits = [
    'Voorkom schulden voordat ze ontstaan',
    'Krijg meer grip op je geld',
    'Bespaar geld met slimme inzichten',
    'Bereik je spaardoelen sneller',
    'Leer betere financiële gewoonten',
    'Ontvang tijdige waarschuwingen',
    'Toegang tot Nederlandse toeslagen',
    'Volledig Nederlands platform'
  ];

  return (
    <HomePage>
      <Header>
        <Logo>
          <TrendingUp />
          Slim Minder
        </Logo>
        
        <Nav>
          <NavLink to="#features">Functies</NavLink>
          <NavLink to="#benefits">Voordelen</NavLink>
          <NavLink to="#pricing">Tarieven</NavLink>
          <NavLink to="/test">🔧 Test</NavLink>
        </Nav>
        
        <AuthButtons>
          <Button variant="secondary" to="/login">
            Inloggen
          </Button>
          <Button variant="primary" to="/register">
            Gratis starten
            <ArrowRight size={16} />
          </Button>
        </AuthButtons>
      </Header>

      <Main id="main-content">
        <HeroSection>
          <HeroTitle>
            Meer grip op geld, <br />
            minder geldzorgen
          </HeroTitle>
          
          <HeroSubtitle>
            Slim Minder helpt je financiële problemen te voorkomen met inzichtelijke budgetten, 
            slimme waarschuwingen en persoonlijk advies van onze AI-coach.
          </HeroSubtitle>
          
          <HeroButtons>
            <Button variant="primary" to="/register">
              Gratis proberen
              <ArrowRight size={16} />
            </Button>
            <Button variant="secondary" to="#features">
              Bekijk functies
            </Button>
          </HeroButtons>
        </HeroSection>

        <FeaturesSection id="features">
          <SectionTitle>
            Alles wat je nodig hebt voor financiële controle
          </SectionTitle>
          
          <FeaturesGrid>
            {features.map((feature, index) => (
              <FeatureCard key={index}>
                <FeatureIcon color={feature.color}>
                  {feature.icon}
                </FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </FeaturesSection>

        <BenefitsSection id="benefits">
          <SectionTitle>
            Waarom kiezen voor Slim Minder?
          </SectionTitle>
          
          <BenefitsList>
            {benefits.map((benefit, index) => (
              <BenefitItem key={index}>
                <BenefitIcon>
                  <CheckCircle />
                </BenefitIcon>
                <BenefitText>{benefit}</BenefitText>
              </BenefitItem>
            ))}
          </BenefitsList>
        </BenefitsSection>

        <CTASection>
          <CTATitle>
            Klaar om te beginnen?
          </CTATitle>
          <CTADescription>
            Start vandaag nog gratis en krijg binnen enkele minuten inzicht in je financiën.
          </CTADescription>
          <CTAButton to="/register">
            Gratis account aanmaken
            <ArrowRight size={16} />
          </CTAButton>
        </CTASection>
      </Main>
    </HomePage>
  );
};

export default HomePageComponent; 