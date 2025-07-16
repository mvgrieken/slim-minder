import React from 'react';
import styled from 'styled-components';
import { BookOpen, DollarSign, TrendingUp, Target, Users, Shield, Lightbulb, Quote } from 'lucide-react';

const InspirationContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const HeroSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 30px;
  border-radius: 20px;
  text-align: center;
  margin-bottom: 40px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    opacity: 0.3;
  }
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.3rem;
  opacity: 0.9;
  margin-bottom: 30px;
  position: relative;
  z-index: 1;
`;

const HeroIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
`;

const ContentSection = styled.div`
  background: white;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
`;

const SectionIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const StoryText = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: #555;
  margin-bottom: 20px;
  text-align: justify;
`;

const QuoteBox = styled.div`
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-left: 5px solid #667eea;
  padding: 25px;
  margin: 30px 0;
  border-radius: 10px;
  position: relative;
`;

const QuoteText = styled.p`
  font-size: 1.2rem;
  font-style: italic;
  color: #333;
  margin-bottom: 15px;
  text-align: center;
`;

const QuoteAuthor = styled.p`
  font-size: 1rem;
  color: #667eea;
  font-weight: bold;
  text-align: center;
  margin: 0;
`;

const LessonsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  margin-top: 30px;
`;

const LessonCard = styled.div`
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #667eea;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const LessonTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LessonIcon = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: #667eea;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
`;

const LessonDescription = styled.p`
  color: #666;
  line-height: 1.6;
`;

const ActionSection = styled.div`
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  padding: 40px;
  border-radius: 15px;
  text-align: center;
  margin-top: 40px;
`;

const ActionTitle = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
`;

const ActionText = styled.p`
  font-size: 1.1rem;
  margin-bottom: 30px;
  opacity: 0.9;
`;

const ActionButton = styled.button`
  background: white;
  color: #28a745;
  border: none;
  padding: 15px 30px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const InspirationPage: React.FC = () => {
  return (
    <InspirationContainer>
      <HeroSection>
        <HeroIcon>🏛️</HeroIcon>
        <HeroTitle>De Rijkste Man van Babylon</HeroTitle>
        <HeroSubtitle>
          Ontdek de tijdloze wijsheid van het oude Babylon en leer hoe je rijkdom kunt opbouwen
        </HeroSubtitle>
      </HeroSection>

      <ContentSection>
        <SectionTitle>
          <SectionIcon>
            <BookOpen size={24} />
          </SectionIcon>
          Het Verhaal
        </SectionTitle>
        
        <StoryText>
          Lang geleden, in het oude Babylon, leefde er een man genaamd Arkad. Hij begon als een arme schrijver, 
          maar werd uiteindelijk de rijkste man van de stad. Zijn verhaal is vastgelegd in het beroemde boek 
          "The Richest Man in Babylon" door George S. Clason.
        </StoryText>
        
        <StoryText>
          Arkad ontdekte de zeven wetten van rijkdom door te luisteren naar de wijsheid van de oude meesters 
          en door zijn eigen ervaringen. Deze wetten zijn vandaag de dag nog steeds even relevant als duizenden 
          jaren geleden.
        </StoryText>

        <QuoteBox>
          <QuoteText>
            "Een deel van alles wat je verdient, is van jou om te behouden."
          </QuoteText>
          <QuoteAuthor>- De Eerste Wet van Rijkdom</QuoteAuthor>
        </QuoteBox>
      </ContentSection>

      <ContentSection>
        <SectionTitle>
          <SectionIcon>
            <Lightbulb size={24} />
          </SectionIcon>
          De Zeven Wetten van Rijkdom
        </SectionTitle>
        
        <LessonsGrid>
          <LessonCard>
            <LessonTitle>
              <LessonIcon>💰</LessonIcon>
              Begin met Sparen
            </LessonTitle>
            <LessonDescription>
              Bewaar minimaal 10% van je inkomen voordat je iets uitgeeft. 
              Maak sparen een prioriteit, geen optie.
            </LessonDescription>
          </LessonCard>

          <LessonCard>
            <LessonTitle>
              <LessonIcon>🎯</LessonIcon>
              Controleer je Uitgaven
            </LessonTitle>
            <LessonDescription>
              Schrijf al je uitgaven op en identificeer waar je geld naartoe gaat. 
              Kennis is de eerste stap naar controle.
            </LessonDescription>
          </LessonCard>

          <LessonCard>
            <LessonTitle>
              <LessonIcon>📈</LessonIcon>
              Laat Geld voor je Werken
            </LessonTitle>
            <LessonDescription>
              Investeer je spaargeld zodat het meer geld genereert. 
              Compound interest is de achtste wereldwonder.
            </LessonDescription>
          </LessonCard>

          <LessonCard>
            <LessonTitle>
              <LessonIcon>🛡️</LessonIcon>
              Bescherm je Rijkdom
            </LessonTitle>
            <LessonDescription>
              Verzeker jezelf tegen verlies en investeer alleen in wat je begrijpt. 
              Veiligheid gaat voor op hoge rendementen.
            </LessonDescription>
          </LessonCard>

          <LessonCard>
            <LessonTitle>
              <LessonIcon>🏠</LessonIcon>
              Maak van je Huis een Investering
            </LessonTitle>
            <LessonDescription>
              Besit je eigen huis en betaal jezelf in plaats van een verhuurder. 
              Bouw vermogen op door eigenwoningbezit.
            </LessonDescription>
          </LessonCard>

          <LessonCard>
            <LessonTitle>
              <LessonIcon>📚</LessonIcon>
              Plan voor de Toekomst
            </LessonTitle>
            <LessonDescription>
              Zorg voor een inkomen na je pensioen en voor je gezin. 
              Denk langetermijn en bereid je voor op de toekomst.
            </LessonDescription>
          </LessonCard>

          <LessonCard>
            <LessonTitle>
              <LessonIcon>⚡</LessonIcon>
              Verhoog je Verdienvermogen
            </LessonTitle>
            <LessonDescription>
              Ontwikkel je vaardigheden en kennis. 
              Je vermogen om te verdienen is je grootste activa.
            </LessonDescription>
          </LessonCard>
        </LessonsGrid>
      </ContentSection>

      <ContentSection>
        <SectionTitle>
          <SectionIcon>
            <Users size={24} />
          </SectionIcon>
          De Wijsheid van Babylon
        </SectionTitle>
        
        <StoryText>
          De lessen van Babylon zijn gebaseerd op eenvoudige maar krachtige principes. 
          Het gaat niet om complexe investeringsstrategieën, maar om fundamentele 
          gewoonten die iedereen kan toepassen.
        </StoryText>
        
        <StoryText>
          De belangrijkste les is dat rijkdom niet afhankelijk is van je inkomen, 
          maar van je vermogen om geld te beheren en te laten groeien. 
          Een laag inkomen met goede gewoonten kan leiden tot meer rijkdom dan 
          een hoog inkomen met slechte gewoonten.
        </StoryText>

        <QuoteBox>
          <QuoteText>
            "Rijkdom is niet een kwestie van inkomen, maar van uitgaven."
          </QuoteText>
          <QuoteAuthor>- Babylonische Wijsheid</QuoteAuthor>
        </QuoteBox>
      </ContentSection>

      <ActionSection>
        <ActionTitle>Begin Vandaag</ActionTitle>
        <ActionText>
          De lessen van Babylon zijn tijdloos en universeel. 
          Begin vandaag met het toepassen van deze principes in je eigen leven.
        </ActionText>
        <ActionButton onClick={() => window.location.href = '/budgets'}>
          Start met Budgetteren
        </ActionButton>
      </ActionSection>
    </InspirationContainer>
  );
};

export default InspirationPage; 