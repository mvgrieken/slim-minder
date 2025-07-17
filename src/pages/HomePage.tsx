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
          <VisualCard>
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
          <FeatureCard>
            <FeatureIcon>
              <Target size={32} />
            </FeatureIcon>
            <FeatureTitle>AI Coach</FeatureTitle>
            <FeatureDescription>
              Persoonlijke financiële adviezen op basis van je uitgavenpatroon en doelen
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <Target size={32} />
            </FeatureIcon>
            <FeatureTitle>Slimme Budgettering</FeatureTitle>
            <FeatureDescription>
              Automatische categorisering en real-time budget monitoring
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <TrendingUp size={32} />
            </FeatureIcon>
            <FeatureTitle>Inzichten & Trends</FeatureTitle>
            <FeatureDescription>
              Visualiseer je financiële vooruitgang met gedetailleerde analyses
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <Award size={32} />
            </FeatureIcon>
            <FeatureTitle>Gamification</FeatureTitle>
            <FeatureDescription>
              Verdien badges en behaal uitdagingen om gemotiveerd te blijven
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <Shield size={32} />
            </FeatureIcon>
            <FeatureTitle>Veilige Bankkoppeling</FeatureTitle>
            <FeatureDescription>
              PSD2-compliant bankintegratie voor automatische transactiesynchronisatie
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
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
          <StatCard>
            <StatNumber>€15,420</StatNumber>
            <StatLabel>Gemiddeld bespaard per gebruiker</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>94%</StatNumber>
            <StatLabel>Te tevreden gebruikers</StatLabel>
          </StatCard>
          <StatCard>
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
          <CTAButton to="/register">
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
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.background} 0%, ${({ theme }) => theme.colors.gray50} 100%);
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
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.textPrimary} 0%, ${({ theme }) => theme.colors.textSecondary} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes['4xl']};
  }
`;

const GoldText = styled.span`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.primaryDark} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const HeroSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
  line-height: 1.6;
`;

const HeroButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    justify-content: center;
  }
`;

const PrimaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.primaryDark} 100%);
  color: ${({ theme }) => theme.colors.white};
  text-decoration: none;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  transition: all ${({ theme }) => theme.transitions.base};
  box-shadow: ${({ theme }) => theme.shadows.lg};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
    color: ${({ theme }) => theme.colors.white};
  }
`;

const SecondaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textPrimary};
  text-decoration: none;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  transition: all ${({ theme }) => theme.transitions.base};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
  }
`;

const HeroVisual = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const VisualCard = styled.div`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.surface} 0%, ${({ theme }) => theme.colors.gray50} 100%);
  padding: ${({ theme }) => theme.spacing['2xl']};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  text-align: center;
  box-shadow: ${({ theme }) => theme.shadows.xl};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  min-width: 280px;
`;

const VisualIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.primaryDark} 100%);
  border-radius: ${({ theme }) => theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.white};
`;

const VisualText = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const VisualLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
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
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
`;

const FeatureCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.md};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  transition: all ${({ theme }) => theme.transitions.base};
  text-align: center;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
    border-color: ${({ theme }) => theme.colors.primary}40;
  }
`;

const FeatureIcon = styled.div`
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}20 0%, ${({ theme }) => theme.colors.primary}10 100%);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.primary};
`;

const FeatureTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
`;

const StatsSection = styled.section`
  padding: ${({ theme }) => theme.spacing['4xl']} ${({ theme }) => theme.spacing.xl};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}10 0%, ${({ theme }) => theme.colors.primary}05 100%);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  text-align: center;
  box-shadow: ${({ theme }) => theme.shadows.md};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const StatNumber = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const StatLabel = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const CTASection = styled.section`
  padding: ${({ theme }) => theme.spacing['4xl']} ${({ theme }) => theme.spacing.xl};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.secondary} 0%, ${({ theme }) => theme.colors.secondaryDark} 100%);
  text-align: center;
`;

const CTAContent = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const CTATitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
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
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.primaryDark} 100%);
  color: ${({ theme }) => theme.colors.white};
  text-decoration: none;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  transition: all ${({ theme }) => theme.transitions.base};
  box-shadow: ${({ theme }) => theme.shadows.lg};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
    color: ${({ theme }) => theme.colors.white};
  }
`;

export default HomePage; 