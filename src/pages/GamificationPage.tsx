import React from 'react';
import styled from 'styled-components';
import { Award, Lock, TrendingUp, CheckCircle, Star } from 'lucide-react';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
`;

const PageHeader = styled.div`
  background: linear-gradient(135deg, #ffb347 0%, #ffcc33 100%);
  color: #333;
  padding: 30px;
  border-radius: 15px;
  margin-bottom: 30px;
  text-align: center;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 10px;
`;

const PageSubtitle = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
`;

const Section = styled.div`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 1.4rem;
  font-weight: bold;
  color: #ffb347;
  margin-bottom: 18px;
`;

const BadgesGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const BadgeCard = styled.div<{ earned: boolean }>`
  background: ${({ earned }) => (earned ? '#fffbe6' : '#f0f0f0')};
  border: 2px solid ${({ earned }) => (earned ? '#ffb347' : '#ccc')};
  border-radius: 12px;
  padding: 20px;
  min-width: 180px;
  text-align: center;
  box-shadow: ${({ earned }) => (earned ? '0 4px 12px rgba(255, 179, 71, 0.15)' : 'none')};
  opacity: ${({ earned }) => (earned ? 1 : 0.6)};
`;

const BadgeIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 10px;
`;

const BadgeName = styled.div`
  font-weight: bold;
  color: #333;
  margin-bottom: 6px;
`;

const BadgeDesc = styled.div`
  font-size: 0.95rem;
  color: #666;
`;

const ChallengesGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ChallengeCard = styled.div`
  background: #fffbe6;
  border: 2px solid #ffb347;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(255, 179, 71, 0.10);
`;

const ChallengeTitle = styled.div`
  font-weight: bold;
  color: #ffb347;
  font-size: 1.1rem;
  margin-bottom: 8px;
`;

const ChallengeDesc = styled.div`
  color: #666;
  margin-bottom: 12px;
`;

const ProgressBar = styled.div<{ percent: number }>`
  width: 100%;
  height: 12px;
  background: #f0f0f0;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 8px;
  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${({ percent }) => Math.min(percent, 100)}%;
    background: linear-gradient(90deg, #ffb347 0%, #ffcc33 100%);
    border-radius: 6px;
    transition: width 0.3s ease;
  }
`;

const ProgressText = styled.div`
  font-size: 0.95rem;
  color: #333;
`;

const badges = [
  {
    id: 1,
    name: 'Eerste Stap',
    desc: 'Voeg je eerste transactie toe',
    icon: <CheckCircle size={32} />, 
    earned: true
  },
  {
    id: 2,
    name: 'Sparende Starter',
    desc: 'Maak je eerste spaardoel aan',
    icon: <Star size={32} />, 
    earned: true
  },
  {
    id: 3,
    name: 'Budgetbaas',
    desc: 'Stel een budget in',
    icon: <TrendingUp size={32} />, 
    earned: false
  },
  {
    id: 4,
    name: 'Volhouder',
    desc: 'Houd 3 maanden je uitgaven bij',
    icon: <Award size={32} />, 
    earned: false
  },
  {
    id: 5,
    name: 'Geheim',
    desc: 'Ontgrendel deze badge door een verrassing!',
    icon: <Lock size={32} />, 
    earned: false
  }
];

const challenges = [
  {
    id: 1,
    title: '7 Dagen Uitgaven Bijhouden',
    desc: 'Voer elke dag een uitgave in, 7 dagen achter elkaar.',
    progress: 5,
    total: 7
  },
  {
    id: 2,
    title: '€100 Besparen Deze Maand',
    desc: 'Spaar in totaal €100 in één maand.',
    progress: 60,
    total: 100
  },
  {
    id: 3,
    title: '3 Spaardoelen Actief',
    desc: 'Heb minimaal 3 actieve spaardoelen.',
    progress: 2,
    total: 3
  }
];

const GamificationPage: React.FC = () => {
  return (
    <Container>
      <PageHeader>
        <PageTitle>Gamification</PageTitle>
        <PageSubtitle>Verdien badges en voltooi uitdagingen voor extra motivatie!</PageSubtitle>
      </PageHeader>

      <Section>
        <SectionTitle>Badges</SectionTitle>
        <BadgesGrid>
          {badges.map(badge => (
            <BadgeCard key={badge.id} earned={badge.earned}>
              <BadgeIcon>{badge.icon}</BadgeIcon>
              <BadgeName>{badge.name}</BadgeName>
              <BadgeDesc>{badge.desc}</BadgeDesc>
            </BadgeCard>
          ))}
        </BadgesGrid>
      </Section>

      <Section>
        <SectionTitle>Challenges</SectionTitle>
        <ChallengesGrid>
          {challenges.map(challenge => {
            const percent = (challenge.progress / challenge.total) * 100;
            return (
              <ChallengeCard key={challenge.id}>
                <ChallengeTitle>{challenge.title}</ChallengeTitle>
                <ChallengeDesc>{challenge.desc}</ChallengeDesc>
                <ProgressBar percent={percent} />
                <ProgressText>{challenge.progress} van {challenge.total} voltooid ({percent.toFixed(0)}%)</ProgressText>
              </ChallengeCard>
            );
          })}
        </ChallengesGrid>
      </Section>
    </Container>
  );
};

export default GamificationPage; 