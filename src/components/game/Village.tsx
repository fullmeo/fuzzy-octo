import React, { useState, useEffect } from 'react';
import PinkyOctopus from '../common/PinkyOctopus';
import '../../index.css';

export default function Village() {
  const [fuzzyBalance, setFuzzyBalance] = useState(1337);
  const [coralPoints, setCoralPoints] = useState(250); // ✅ CHANGÉ : nookMiles → coralPoints
  const [dailyEarnings, setDailyEarnings] = useState(0);
  const [villagers, setVillagers] = useState([
    { id: 1, name: 'Capitaine Coco', emoji: '🦝', friendship: 50 }, // ✅ CHANGÉ : Tom Nook → Capitaine Coco
    { id: 2, name: 'Luna Belle', emoji: '🐶', friendship: 75 },     // ✅ CHANGÉ : Isabelle → Luna Belle
    { id: 3, name: 'Professeur Sage', emoji: '🦉', friendship: 30 } // ✅ CHANGÉ : Blathers → Professeur Sage
  ]);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [floatingTexts, setFloatingTexts] = useState<{id: number, text: string, x: number, y: number}[]>([]);

  const [gameStats, setGameStats] = useState({
    level: 1,
    experience: 0,
    experienceToNext: 100,
    totalEarnings: 0,
    activitiesCount: { diving: 0, jellyfish: 0, seaweed: 0 },
    achievements: [] as string[],
    unlockedFeatures: ['basic_activities'] as string[]
  });

  const [marketPrices, setMarketPrices] = useState({
    shells: 1.0,      // Prix de base
    pearls: 5.0,      // Items rares
    algae: 0.5,       // Items communs
    jellyfish: 2.0    // Items spéciaux
  });

  const [inventory, setInventory] = useState({
    shells: 0,
    pearls: 0,
    algae: 0,
    jellyfish: 0,
    specialItems: [] as string[]
  });

  // Ajouter state d'énergie
  const [energy, setEnergy] = useState(100);
  const [maxEnergy, setMaxEnergy] = useState(100);
  const [lastEnergyUpdate, setLastEnergyUpdate] = useState(Date.now());

  const [marketOpen, setMarketOpen] = useState(false);

  const [quests, setQuests] = useState([
    {
      id: 'first_dive',
      title: 'Première plongée',
      description: 'Effectuez 5 plongées',
      target: 5,
      progress: 0,
      reward: { fuzzy: 100, item: 'diving_mask' },
      completed: false
    },
    {
      id: 'friendship_builder',
      title: 'Créateur d\'amitié',
      description: 'Atteignez 80% d\'amitié avec un villageois',
      target: 80,
      progress: 0,
      reward: { fuzzy: 200, coralPoints: 50 },
      completed: false
    }
  ]);

  const getFriendshipBonus = () => {
    const avgFriendship = villagers.reduce((sum, v) => sum + v.friendship, 0) / villagers.length;
    return 1 + (avgFriendship / 100);
  };

  const addNotification = (message: string) => {
    setNotifications(prev => [...prev, message]);
    setTimeout(() => {
      setNotifications(prev => prev.slice(1));
    }, 3000);
  };

  // Remplacer handleActivity par un système plus complexe
  const handleActivity = (activity: string) => {
    const activityData = {
      diving: {
        baseEarnings: 0,
        resourcesGained: { shells: 2, pearls: 0.1 },
        energyCost: 10,
        experience: 15,
        rareChance: 0.05,
        description: "Plongée profonde pour trouver des trésors"
      },
      jellyfish: {
        baseEarnings: 0,
        resourcesGained: { jellyfish: 1, shells: 1 },
        energyCost: 8,
        experience: 12,
        rareChance: 0.1,
        description: "Capture délicate de méduses électriques"
      },
      seaweed: {
        baseEarnings: 0,
        resourcesGained: { algae: 3, shells: 0.5 },
        energyCost: 5,
        experience: 8,
        rareChance: 0.02,
        description: "Récolte d'algues nutritives"
      }
    };

    const data = activityData[activity as keyof typeof activityData];
    if (!data) return;

    // Système d'énergie réaliste
    if (energy < data.energyCost) {
      addNotification("😴 Pas assez d'énergie ! Reposez-vous.");
      return;
    }

    // Calcul des ressources avec variabilité
    const friendshipBonus = getFriendshipBonus();
    const levelBonus = 1 + (gameStats.level * 0.1);
    
    Object.entries(data.resourcesGained).forEach(([resource, baseAmount]) => {
      const variance = 0.8 + (Math.random() * 0.4); // ±20% variance
      const amount = Math.floor(baseAmount * variance * friendshipBonus * levelBonus);
      
      if (amount > 0) {
        setInventory(prev => ({
          ...prev,
          [resource]: prev[resource as keyof typeof prev] + amount
        }));
        addFloatingText(`+${amount} ${resource}`, Math.random() * 300 + 100, Math.random() * 200 + 200);
      }
    });

    // Chance d'item rare
    if (Math.random() < data.rareChance * friendshipBonus) {
      const rareItems = ['ancient_shell', 'golden_pearl', 'mystic_algae', 'electric_essence'];
      const rareItem = rareItems[Math.floor(Math.random() * rareItems.length)];
      setInventory(prev => ({
        ...prev,
        specialItems: [...prev.specialItems, rareItem]
      }));
      addNotification(`🌟 Item rare trouvé : ${rareItem} !`);
      playSound('bonus');
    }

    // Consommation d'énergie et gain d'expérience
    setEnergy(prev => Math.max(0, prev - data.energyCost));
    gainExperience(data.experience);
    
    // Compter l'activité
    setGameStats(prev => ({
      ...prev,
      activitiesCount: {
        ...prev.activitiesCount,
        [activity]: prev.activitiesCount[activity as keyof typeof prev.activitiesCount] + 1
      }
    }));

    playSound(activity as any);
    addNotification(`${data.description} complétée !`);
  };

  const handleVillagerInteraction = (villagerId: number) => {
    setVillagers(prev => prev.map(villager => 
      villager.id === villagerId 
        ? { ...villager, friendship: Math.min(100, villager.friendship + 5) }
        : villager
    ));
    
    const bonus = Math.floor(Math.random() * 20) + 10;
    setFuzzyBalance(prev => prev + bonus);
  };

  // Mise à jour de la progression des quêtes
  const updateQuestProgress = (questId: string, progress: number) => {
    setQuests(prev => prev.map(quest => {
      if (quest.id === questId && !quest.completed) {
        const newProgress = Math.min(quest.target, quest.progress + progress);
        const isCompleted = newProgress >= quest.target;
        
        if (isCompleted) {
          addNotification(`🎯 Quête complétée : ${quest.title} !`);
          // Donner récompenses
          if (quest.reward.fuzzy) {
            setFuzzyBalance(prev => prev + quest.reward.fuzzy);
          }
          playSound('bonus');
        }
        
        return { ...quest, progress: newProgress, completed: isCompleted };
      }
      return quest;
    }));
  };

  // 🎵 SYSTÈME DE SONS AQUATIQUES
  const playSound = (type: 'click' | 'earn' | 'bonus' | 'friendship' | 'diving' | 'jellyfish' | 'seaweed') => {
    if (!soundEnabled) return;
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Fréquences thématiques océaniques
    const soundConfig = {
      click: { freq: 800, duration: 0.1, type: 'sine' as OscillatorType },
      earn: { freq: 1000, duration: 0.3, type: 'triangle' as OscillatorType },
      bonus: { freq: 1200, duration: 0.5, type: 'sawtooth' as OscillatorType },
      friendship: { freq: 600, duration: 0.4, type: 'sine' as OscillatorType },
      diving: { freq: 400, duration: 0.6, type: 'sine' as OscillatorType }, // Son de plongée
      jellyfish: { freq: 1100, duration: 0.2, type: 'triangle' as OscillatorType }, // Son électrique
      seaweed: { freq: 300, duration: 0.4, type: 'sawtooth' as OscillatorType } // Son organique
    };
    
    const config = soundConfig[type];
    oscillator.frequency.setValueAtTime(config.freq, audioContext.currentTime);
    oscillator.type = config.type;
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + config.duration);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + config.duration);
  };

  const gainExperience = (amount: number) => {fect(() => {
    setGameStats(prev => {nst passiveIncome = setInterval(() => {
      const newExp = prev.experience + amount;ssive = Math.floor(getFriendshipBonus() * 10);
      const levelUpThreshold = (prev.level * prev.level * 50);lance(prev => prev + passive);
      const newLevel = Math.floor(Math.sqrt(newExp / 50)); => prev + passive);
      
      // 🎉 Effet sonore et visuel lors du passage de niveau
      if (newLevel > prev.level) {rn () => clearInterval(passiveIncome);
        addNotification(`🎉 Vous êtes maintenant au niveau ${newLevel} !`);illagers]);
        playSound('friendship');
      }  useEffect(() => {
      
      return {
        ...prev,
        experience: newExp,
        level: newLevel,
        experienceToNext: (newLevel * newLevel * 50) - newExp
      };};
    });zzy-depths-save', JSON.stringify(saveGame));
  };

  // Régénération d'énergie en temps réel SYSTÈME DE NIVEAUX ET PROGRESSION
  useEffect(() => { {
    const energyRegen = setInterval(() => {    return Math.floor(Math.sqrt(totalExp / 50)) + 1;
      const now = Date.now();
      const timeDiff = now - lastEnergyUpdate;
      const energyToAdd = Math.floor(timeDiff / 60000); // 1 énergie par minute  const gainExperience = (amount: number) => {
    
      if (energyToAdd > 0) {= prev.experience + amount;
        setEnergy(prev => Math.min(maxEnergy, prev + energyToAdd));ings + amount);
        setLastEnergyUpdate(now);
      }
    }, 10000); // Check toutes les 10 secondes

    return () => clearInterval(energyRegen);
  }, [maxEnergy, lastEnergyUpdate]);
 Débloquer nouvelles fonctionnalités
  // Système de marché avec prix fluctuants
  useEffect(() => { Marché débloqué !");
    // Prix du marché fluctuent toutes les 5 minutes        }
    const marketUpdate = setInterval(() => {
      setMarketPrices(prev => ({ addNotification("🔓 Quêtes débloquées !");
        shells: prev.shells * (0.9 + Math.random() * 0.2),        }
        pearls: prev.pearls * (0.85 + Math.random() * 0.3),
        algae: prev.algae * (0.95 + Math.random() * 0.1),
        jellyfish: prev.jellyfish * (0.9 + Math.random() * 0.2)
      }));    ...prev,
      addNotification("📈 Prix du marché mis à jour !");
    }, 300000); // 5 minutes newLevel,

    return () => clearInterval(marketUpdate);
  }, []);});

  const sellResource = (resource: string, amount: number) => {
    const price = marketPrices[resource as keyof typeof marketPrices];ergie en temps réel
    const totalValue = Math.floor(price * amount);eEffect(() => {
        const energyRegen = setInterval(() => {
    setInventory(prev => ({t now = Date.now();
      ...prev,Update;
      [resource]: prev[resource as keyof typeof prev] - amount
    }));
    if (energyToAdd > 0) {
    setFuzzyBalance(prev => prev + totalValue);nergy, prev + energyToAdd));
    addNotification(`💰 Vendu ${amount} ${resource} pour ${totalValue} FUZZY !`);
    playSound('earn');
  };

  return (gyRegen);
    <div className="village-container">
      {/* Contrôles et stats en temps réel */}
      <div className="top-hud">e marché avec prix fluctuants
        <div className="sound-control">
          <button onClick={() => setSoundEnabled(!soundEnabled)}>tes les 5 minutes
            {soundEnabled ? '🔊' : '🔇'}
          </button>tPrices(prev => ({
        </div>+ Math.random() * 0.2),
        5 + Math.random() * 0.3),
        <div className="energy-bar"> 0.1),
          <span>⚡ Énergie: {energy}/{maxEnergy}</span>ish: prev.jellyfish * (0.9 + Math.random() * 0.2)
          <div className="energy-fill" style={{ width: `${(energy/maxEnergy)*100}%` }} />
        </div>ix du marché mis à jour !");
        
        <div className="level-display">
          <span>⭐ Niveau {gameStats.level}</span>) => clearInterval(marketUpdate);
          <span>EXP: {gameStats.experience}/{gameStats.experienceToNext}</span>]);
        </div>
      </div> = (resource: string, amount: number) => {
rketPrices[resource as keyof typeof marketPrices];
      <h1>🏘️ Village FUZZY-DEPTHS</h1>h.floor(price * amount);
      
      {/* Stats avec vraies données */}
      <div className="stats-dashboard">
        <div className="stat-card">esource]: prev[resource as keyof typeof prev] - amount
          <h3>💰 FUZZY Balance</h3>);
          <p>{fuzzyBalance.toLocaleString()}</p>
          <small>Total gagné: {gameStats.totalEarnings.toLocaleString()}</small>
        </div>e} FUZZY !`);
        <div className="stat-card">rn');
          <h3>🎒 Inventaire</h3>
          <div className="inventory-grid">
            <span>🐚 {inventory.shells}</span>
            <span>💎 {inventory.pearls}</span>
            <span>🌱 {inventory.algae}</span>FUZZY-DEPTHS */}
            <span>🎐 {inventory.jellyfish}</span>e dans votre communauté sous-marine !</p> {/* ✅ CHANGÉ : village → communauté */}
          </div>
        </div><div className="stats-dashboard">
        <div className="stat-card">">
          <h3>📈 Marché</h3>
          <div className="market-prices">uzzyBalance.toLocaleString()}</p>
            <span>🐚 {marketPrices.shells.toFixed(2)}F</span>
            <span>💎 {marketPrices.pearls.toFixed(2)}F</span>d">
          </div>al Points */}
        </div>kMiles → coralPoints */}
      </div>iv>

      {/* Activités avec coûts énergétiques */}
      <div className="activities">
        <button 
          onClick={() => handleActivity('diving')}ame="stat-card">
          disabled={energy < 10}
          className={energy < 10 ? 'disabled' : ''}
        >
          🤿 Plongée (⚡10) Name="stat-card">
          <small>Shells + chance de perles</small>Énergie</h3>
        </button>p>{energy} / {maxEnergy}</p>
        <button onClick={() => handleActivity('jellyfish')}> {/* ✅ CHANGÉ : bugs → jellyfish */}v>
          🎐 Chasser les méduses (+60 FUZZY) {/* ✅ CHANGÉ : insectes → méduses */}      </div>
        </button>
        <button onClick={() => handleActivity('seaweed')}> {/* ✅ CHANGÉ : fruits → seaweed */}
          🌱 Récolter des algues (+45 FUZZY) {/* ✅ CHANGÉ : fruits → algues */}
        </button>e"
      </div>ive={true}
      wTokenBalance={true}
      <div className="villagers">yBalance={fuzzyBalance}
        {villagers.map(villager => (PinkyClick={() => handleActivity('greeting')}
          <div   />
            key={villager.id}      
            className="villager"      <div className="activities">






























































}  );    </div>      </div>        ))}          </div>            {note}          <div key={index} className="notification">        {notifications.map((note, index) => (      <div className="notifications">      )}        </div>          ))}            )              </div>                </button>                  Vendre 1                <button onClick={() => sellResource(resource, 1)}>                <span>Prix: {marketPrices[resource as keyof typeof marketPrices]?.toFixed(2)}F</span>                <span>{resource}: {amount}</span>              <div key={resource} className="market-item">            amount > 0 && typeof amount === 'number' && (          {Object.entries(inventory).map(([resource, amount]) => (          <h3>🏪 Marché aux trésors</h3>        <div className="market-section">      {gameStats.level >= 3 && (      {/* Marché (débloqué niveau 3+) */}      )}        </div>          ))}            </div>              <span>{quest.progress}/{quest.target}</span>              </div>                <div style={{ width: `${(quest.progress/quest.target)*100}%` }} />              <div className="progress-bar">              <p>{quest.description}</p>              <h4>{quest.title}</h4>            <div key={quest.id} className="quest-card">          {quests.filter(q => !q.completed).map(quest => (          <h3>🎯 Quêtes actives</h3>        <div className="quests-section">      {gameStats.level >= 2 && (      {/* Système de quêtes */}      </div>        ))}          </div>            </div>              ></div>                style={{ width: `${villager.friendship}%` }}                className="friendship-fill"               <div             <div className="friendship-bar">            <div>Amitié: {villager.friendship}%</div>            <h3>{villager.name}</h3>            <span>{villager.emoji}</span>          >            title={`Cliquez pour interagir avec ${villager.name}`}            onClick={() => handleVillagerInteraction(villager.id)}        <button onClick={() => handleActivity('diving')}> {/* ✅ CHANGÉ : fishing → diving */}
          🤿 Plongée (+75 FUZZY) {/* ✅ CHANGÉ : Pêcher → Plongée */}
        </button>
        <button onClick={() => handleActivity('jellyfish')}> {/* ✅ CHANGÉ : bugs → jellyfish */}
          🎐 Chasser les méduses (+60 FUZZY) {/* ✅ CHANGÉ : insectes → méduses */}
        </button>
        <button onClick={() => handleActivity('seaweed')}> {/* ✅ CHANGÉ : fruits → seaweed */}
          🌱 Récolter des algues (+45 FUZZY) {/* ✅ CHANGÉ : fruits → algues */}
        </button>
      </div>
      
      <div className="villagers">
        {villagers.map(villager => (
          <div 
            key={villager.id} 
            className="villager"
            onClick={() => handleVillagerInteraction(villager.id)}
            title={`Cliquez pour interagir avec ${villager.name}`}
          >
            <span>{villager.emoji}</span>
            <h3>{villager.name}</h3>
            <div>Amitié: {villager.friendship}%</div>
            <div className="friendship-bar">
              <div 
                className="friendship-fill" 
                style={{ width: `${villager.friendship}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="notifications">
        {notifications.map((note, index) => (
          <div key={index} className="notification">
            {note}
          </div>
        ))}
      </div>
    </div>
  );
}
