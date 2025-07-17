import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Target, 
  Bell, 
  Shield, 
  BookOpen,
  ArrowRight,
  DollarSign,
  BarChart,
  Users,
  Award
} from 'react-feather';

const HomePage: React.FC = () => {
  return (
    <Container>
      <HeroSection>
        <HeroContent>
          <HeroTitle>
            Welkom bij <GoldText>Slim Minder</GoldText>
          </HeroTitle>
          <HeroSubtitle>
            Neem controle over je financiën met slimme inzichten, persoonlijke coaching en gamification
          </HeroSubtitle>
          <HeroButtons>
            <PrimaryButton to="/dashboard">
              Start je reis
              <ArrowRight size={20} />
            </PrimaryButton>
            <SecondaryButton to="/inspiration">
              Ontdek meer
            </SecondaryButton>
          </HeroButtons>
        </HeroContent>
        <HeroVisual>
          <VisualCard className="glass">
            <VisualIcon>
              <DollarSign size={48} />
            </VisualIcon>
            <VisualText>€2,450</VisualText>
            <VisualLabel>Bespaard deze maand</VisualLabel>
          </VisualCard>
        </HeroVisual>
      </HeroSection>

      <FeaturesSection>
        <SectionTitle>Waarom Slim Minder?</SectionTitle>
        <FeaturesGrid>
          <FeatureCard className="card">
            <FeatureIcon>
              <Target size={32} />
            </FeatureIcon>
            <FeatureTitle>AI Coach</FeatureTitle>
            <FeatureDescription>
              Persoonlijke financiële adviezen op basis van je uitgavenpatroon en doelen
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard className="card">
            <FeatureIcon>
              <Target size={32} />
            </FeatureIcon>
            <FeatureTitle>Slimme Budgettering</FeatureTitle>
            <FeatureDescription>
              Automatische categorisering en real-time budget monitoring
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard className="card">
            <FeatureIcon>
              <TrendingUp size={32} />
            </FeatureIcon>
            <FeatureTitle>Inzichten & Trends</FeatureTitle>
            <FeatureDescription>
              Visualiseer je financiële vooruitgang met gedetailleerde analyses
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard className="card">
            <FeatureIcon>
              <Award size={32} />
            </FeatureIcon>
            <FeatureTitle>Gamification</FeatureTitle>
            <FeatureDescription>
              Verdien badges en behaal uitdagingen om gemotiveerd te blijven
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard className="card">
            <FeatureIcon>
              <Shield size={32} />
            </FeatureIcon>
            <FeatureTitle>Veilige Bankkoppeling</FeatureTitle>
            <FeatureDescription>
              PSD2-compliant bankintegratie voor automatische transactiesynchronisatie
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard className="card">
            <FeatureIcon>
              <Bell size={32} />
            </FeatureIcon>
            <FeatureTitle>Slimme Notificaties</FeatureTitle>
            <FeatureDescription>
              Ontvang tijdige waarschuwingen en herinneringen voor je financiële doelen
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>

      <StatsSection>
        <StatsGrid>
          <StatCard className="glass">
            <StatNumber>€15,420</StatNumber>
            <StatLabel>Gemiddeld bespaard per gebruiker</StatLabel>
          </StatCard>
          <StatCard className="glass">
            <StatNumber>94%</StatNumber>
            <StatLabel>Te tevreden gebruikers</StatLabel>
          </StatCard>
          <StatCard className="glass">
            <StatNumber>€2.1M</StatNumber>
            <StatLabel>Totaal bespaard door gebruikers</StatLabel>
          </StatCard>
        </StatsGrid>
      </StatsSection>

      <CTASection>
        <CTAContent>
          <CTATitle>Klaar om te beginnen?</CTATitle>
          <CTADescription>
            Sluit je aan bij duizenden gebruikers die al hun financiële doelen hebben bereikt
          </CTADescription>
          <CTAButton to="/register" className="btn-primary">
            Gratis aanmelden
            <ArrowRight size={20} />
          </CTAButton>
        </CTAContent>
      </CTASection>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.gradientSecondary};
  background-attachment: fixed;
`;

const HeroSection = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing['4xl']};
  align-items: center;
  padding: ${({ theme }) => theme.spacing['4xl']} ${({ theme }) => theme.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
  min-height: 80vh;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: ${({ theme }) => theme.spacing['2xl']};
    padding: ${({ theme }) => theme.spacing['2xl']} ${({ theme }) => theme.spacing.lg};
  }
`;

const HeroContent = styled.div``;

const HeroTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['5xl']};
  font-weight: ${({ theme }) => theme.fontWeights.extrabold};
  line-height: 1.1;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.white};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes['4xl']};
  }
`;

const GoldText = styled.span`
  background: ${({ theme }) => theme.colors.gradientPrimary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const HeroSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.gray300};
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
  line-height: 1.6;
`;

const HeroButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    justify-content: center;
  }
`;

const PrimaryButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.gradientPrimary};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitions.base};
  box-shadow: ${({ theme }) => theme.shadows.lg};

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${({ theme }) => theme.shadows['2xl']};
    color: ${({ theme }) => theme.colors.white};
  }
`;

const SecondaryButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  background: rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitions.base};
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);

  &:hover {
    transform: translateY(-3px);
    background: rgba(255, 255, 255, 0.2);
    color: ${({ theme }) => theme.colors.white};
  }
`;

const HeroVisual = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const VisualCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius['3xl']};
  padding: ${({ theme }) => theme.spacing['2xl']};
  text-align: center;
  box-shadow: ${({ theme }) => theme.shadows['2xl']};
  transition: all ${({ theme }) => theme.transitions.base};

  &:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: ${({ theme }) => theme.shadows['2xl']}, 0 0 30px rgba(255, 215, 0, 0.3);
  }
`;

const VisualIcon = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const VisualText = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  font-weight: ${({ theme }) => theme.fontWeights.extrabold};
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const VisualLabel = styled.div`
  color: ${({ theme }) => theme.colors.gray300};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const FeaturesSection = styled.section`
  padding: ${({ theme }) => theme.spacing['4xl']} ${({ theme }) => theme.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing['3xl']};
  color: ${({ theme }) => theme.colors.white};
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing['3xl']};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.lg};
  }
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  transition: all ${({ theme }) => theme.transitions.base};

  &:hover {
    transform: translateY(-8px);
    background: rgba(255, 255, 255, 0.1);
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }
`;

const FeatureIcon = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const FeatureTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.white};
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors.gray300};
  line-height: 1.6;
`;

const StatsSection = styled.section`
  padding: ${({ theme }) => theme.spacing['4xl']} ${({ theme }) => theme.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  transition: all ${({ theme }) => theme.transitions.base};

  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  }
`;

const StatNumber = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  font-weight: ${({ theme }) => theme.fontWeights.extrabold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const StatLabel = styled.div`
  color: ${({ theme }) => theme.colors.gray300};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const CTASection = styled.section`
  padding: ${({ theme }) => theme.spacing['4xl']} ${({ theme }) => theme.spacing.xl};
  text-align: center;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
`;

const CTAContent = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const CTATitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.white};
`;

const CTADescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.gray300};
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
  line-height: 1.6;
`;

const CTAButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.gradientPrimary};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitions.base};
  box-shadow: ${({ theme }) => theme.shadows.lg};

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${({ theme }) => theme.shadows['2xl']};
    color: ${({ theme }) => theme.colors.white};
  }
`;

export default HomePage; 