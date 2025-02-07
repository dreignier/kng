import { fuc } from './util'

export const CHAIR = 0
export const BETE = 1
export const MACHINE = 2
export const DAME = 3
export const MASQUE = 4
export const ASPECTS_LABELS = ['chair', 'bête', 'machine', 'dame', 'masque']
export const RECRUE = 'recrue'
export const INITIE = 'initié'
export const HEROS = 'héros'
export const HOSTILE = 'hostile'
export const SALOPARD = 'salopard'
export const PATRON = 'patron'
export const COLOSSE = 'colosse'
export const BANDE = 'bande'
export const PATRON_COLOSSE = 'patron colosse'
export const ALLIE = 'allié'
export const CONTACT = 'contact'
export const COURTE = 'courte'
export const MOYENNE = 'moyenne'
export const LONGUE = 'longue'
export const LOINTAINE = 'lointaine'
export const ORGANIC = 'organique'
export const ROBOT = 'robot'
export const ARMORED = 'armuré'
export const STANDARD = 'standard'
export const ADVANCED = 'avancé'
export const RARE = 'rare'
export const PRESTIGE = 'prestige'
export const HOPE = "relique d'espoir"
export const IMAGES = [
	'knife',
	'gun',
	'hammer',
	'module',
	'ai',
	'armor',
	'bam',
	'boot',
	'circuit',
	'cybersec',
	'fist',
	'form',
	'fortune',
	'glove',
	'heart',
	'ironman',
	'jet',
	'labcoat',
	'luck',
	'peoples',
	'shield',
	'shield2',
	'star',
	'table',
	'bang',
	'bolt',
	'energy',
	'eye',
	'fire',
	'gear',
	'gears',
	'grenade',
	'learning',
	'magazine',
	'mindmap',
	'network',
	'physics',
	'sniper'
]
export const CARACTERISTICS_LABELS = [
	['déplacement', 'force', 'endurance'],
	['hargne', 'combat', 'instinct'],
	['tir', 'savoir', 'technique'],
	['aura', 'parole', 'sang-froid'],
	['discrétion', 'dextérité', 'perception']
]
export const ALL_CARACTERISTICS_LABELS = CARACTERISTICS_LABELS.flat()

export const COLORS = [
	'#f25a1e', // Bête
	'#9b1a25', // Chair
	'#556abc', // Machine
	'#69bfdc', // Dame
	'#70aa6c', // Masque
	'#d3181f', // Ennemi
	'#364379', // Homme en noir
	'#cacd40', // Arbitre
	'#321619', // Horreur
	'#363d42', // Ophidien
	'#ab1d94', // Autre
	'#40bd97' // Allié
]

export const DERIVED_VALUES_LABELS: Record<string, string> = {
	defense: 'Défense',
	reaction: 'Réaction',
	initiative: 'Initiative',
	health: 'PS',
	cohesion: 'Cohésion',
	resilience: 'Résilience',
	armor: 'PA',
	outbreak: 'Débordement',
	shield: 'Bouclier',
	forcefield: 'CdF',
	energy: 'PE'
}

export const CAPACITIES = [
	'Abysse | héros - salopard - colosse - patron | Tous les dégâts infligés par le PNJ à un PJ sont retirés aux points d’espoir et non aux points de santé ou points d’armure.',
	'Abyssal | héros - salopard - colosse - patron | Le PNJ est insensible à tous les types de dégâts sauf ceux avec l’effet anti-Anathème et lumière X.',
	'À coup sûr (contact) | héros - salopard - patron - autre | Le PNJ, lorsqu’il attaque au contact, ne rate jamais sa cible. La défense du personnage ciblé est systématiquement ramenée à 0 pour chacune de ses attaques.',
	'À coup sûr (distance) | héros - salopard - patron - autre | Le PNJ, lorsqu’il attaque à distance, ne rate jamais sa cible. La réaction du personnage ciblé est systématiquement ramenée à 0 pour chacune de ses attaques.',
	'À revers | recrue - initié - héros - patron | Une fois par phase de conflit, le PNJ peut prendre les personnages à revers, en apparaissant simplement dans leur dos à chacune de ses attaques. Leur défense et leur réaction sont alors divisées par 2 et les dégâts du PNJ sont augmentés de 3D6 pendant tout le tour.',
	'Actions multiples (1) | recrue - hostile - salopard - colosse - patron - autre | Le PNJ possède 1 action de combat en plus de son action de déplacement et de combat de base. Cette action est à effectuer à son initiative.',
	'Actions multiples (2) | initié - hostile - salopard - colosse - patron - autre | Le PNJ possède 2 actions de combat en plus de son action de déplacement et de combat de base. Ces actions sont à effectuer à son initiative.',
	'Actions multiples (3) | initié - hostile - salopard - colosse - patron - autre | Le PNJ possède 3 actions de combat en plus de son action de déplacement et de combat de base. Ces actions sont à effectuer à son initiative.',
	'Actions multiples (4) | initié - hostile - salopard - colosse - patron - autre | Le PNJ possède 4 actions de combat en plus de son action de déplacement et de combat de base. Ces actions sont à effectuer à son initiative.',
	'Actions multiples (5 ou plus) | héros - hostile - salopard - colosse - patron - autre | Le PNJ possède 5 ou plus actions de combat en plus de son action de déplacement et de combat de base. Ces actions sont à effectuer à son initiative.',
	'Anathème | recrue - hostile - salopard - colosse - bande | Le PNJ peut décider d’infliger ses dégâts sur les points d’espoir plutôt que sur les points de santé. Le CdF fonctionne, mais pas les points d’armure. Si le PNJ est tué, les PJ ayant subi cet effet récupèrent 1D6 points d’espoir par tranche complète de 6 points d’espoir perdus.',
	'Armes multiples (1 à 3 standards) | recrue - hostile - salopard - colosse - patron - autre | Le PNJ peut être doté de 3 armes jusqu’à standards de l’arsenal.',
	'Armes multiples (1 à 3 avancées) | initié - hostile - salopard - colosse - patron - autre | Le PNJ peut être doté de 3 armes jusqu’à avancées de l’arsenal.',
	'Armes multiples (1 à 3 rares) | héros - hostile - salopard - colosse - patron - autre | Le PNJ peut être doté de 3 armes jusqu’à rares de l’arsenal.',
	'Assassin | initié - hostile - salopard - patron - autre | Lorsqu’il prend sa cible par surprise ou lorsqu’il l’attaque dans le dos, le PNJ ajoute son score de Masque à ses dégâts, score de Masque exceptionnel inclus.',
	'Autorité (mineur) | faiblesse (recrue) - recrue - salopard - patron - autre | Si le PNJ meurt, les PNJ sous ses ordres subissent 3 points de malus sur tous leurs aspects, leur défense et leur réaction, jusqu’à la fin de la phase de conflit.',
	'Autorité (majeur) | faiblesse (initié) - recrue - salopard - patron - autre | Si le PNJ meurt, les PNJ sous ses ordres fuient ou se rendent automatiquement.',
	'Charge brutale | recrue - salopard - colosse - patron - autre | Une fois par combat, le PNJ peut parcourir instantanément la distance qui le sépare d’un ennemi à portée moyenne ou inférieure. Il doit faire un jet pour toucher, s’il réussit, il inflige à son ennemi les dégâts de son arme auxquels s’ajoute deux fois son score de Bête.',
	'Contradiction | initié - colosse - patron | Chaque échec que subit un PJ sur ses tests face au PNJ lui fait perdre systématiquement 1D6 points d’espoir.',
	'Contrôle | héros - salopard - patron - autre | À portée longue ou inférieure, le PNJ peut faire agir une méta-armure à sa guise (la faire se déplacer, tirer, combattre, etc.). Seule une réussite sur un test base Hargne ou Technique difficulté difficile (6) peut éviter à un personnage de se faire posséder. Activer cette capacité compte pour une action de n’importe quel type.',
	'Coopération | recrue - hostile - salopard - autre | En agissant de façon coordonnée, 2 PNJ (ou plus) avec cette capacité gagnent 2 à leur défense et à leur réaction et gagnent chacun une action de combat supplémentaire. Attention, cette capacité ne peut pas se cumuler sur des PNJ en bénéficiant déjà.',
	'Copie parfaite | initié - hostile - salopard - patron - bande | Lorsqu’un PJ cherche à savoir si le PNJ est une créature de l’Anathème, il doit réussir un test base Perception ou Instinct difficulté difficile (6).',
	'Désespérant | recrue - hostile - salopard - colosse - patron - bande - autre | Si un PJ détruit le PNJ, il doit réussir un test base Hargne combo Sang-Froid (difficulté au choix du MJ) pour ne pas perdre 1D6 point d’espoir.',
	'Dissimulé | recrue - hostile - salopard - patron - bande | Lorsque le PNJ est en présence d’autres créatures de son Seigneur, il les dissimule et leur confère un bonus de 2 en défense et en réaction tant qu’il est présent à portée moyenne ou inférieure.',
	'Domination | initié - salopard - colosse - patron - bande | Une fois par tour, sans utiliser d’action, le PNJ peut tenter de prendre le contrôle de l’esprit d’un PJ grâce à un test sous l’aspect Machine en opposition à la Hargne du PJ visé (avec overdrives) (ou Bête divisée par 2 pour un PNJ). S’il réussit, ce dernier agit sous ses ordres au prochain tour comme s’il possédait une action de combat et de déplacement (et uniquement au prochain tour). Le personnage dominé perd ce tour de jeu et ne peut pas effectuer d’action.',
	'Doubles | héros - patron | Une fois par phase de conflit, Le PNJ peut créer 2D6 doubles de lui qui peuvent tous agir indépendamment, mais dont les aspects, les valeurs dérivées et les dégâts sont divisés par deux.',
	'Drain d’énergie | initié - salopard - colosse - patron | Le PNJ peut décider d’infliger ses dégâts sur les points d’énergie plutôt que sur les points de santé. Le CdF fonctionne, mais pas les points d’armure. Si le PNJ est tué, les PJ ayant subi cet effet récupèrent 1D6 points d’énergie par tranche complète de 6 points d’énergie perdus. Les points drainés ainsi peuvent être utilisés pour activer de puissantes armes, il est conseillé de noter leur total. Si une arme ou une capacité utilisant des points d’énergie est activée, ce sont les points issus du drain d’énergie qui sont ponctionnés en premier.',
	'Duel | initié - patron | Une fois par phase de conflit, le PNJ peut créer un cercle d’énergie indestructible autour de lui et d’un PJ. Aucun PJ ou PNJ à l’extérieur du cercle ne peut plus agir en son sein, laissant le PNJ et son adversaire dans un face à face mortel. Seul un test base Endurance difficulté très difficile (9) permet à quiconque de mettre fin au duel, sinon, il s’arrête dès que l’un des combattants tombe à 0 point de santé.',
	'En réseau | initié - patron | Le PNJ, pour être détruit, doit être enfermé dans un contenant, sinon il s’enfuit par les réseaux divers et variés.',
	'Équipement (1 à 3 standard) | recrue - hostile - salopard - colosse - patron - autre | Le PNJ peut être doté de 1 à 3 modules ou armes jusqu’à standard tirés de l’arsenal. Il est possible que cette capacité soit présente sur des PNJ ne possédant pas de méta-armure. Dans ce cas, les PNJ profitent seulement des effets de ces capacités, sans dépenser de PE, comme s’ils disposaient simplement d’un équivalent. L’aspect et l’allure des modules sur ces PNJ est à la discrétion du MJ.',
	'Équipement (1 à 3 avancé) | initié - salopard - colosse - patron - autre | Le PNJ peut être doté de 1 à 3 modules ou armes jusqu’à avancé tirés de l’arsenal. Il est possible que cette capacité soit présente sur des PNJ ne possédant pas de méta-armure. Dans ce cas, les PNJ profitent seulement des effets de ces capacités, sans dépenser de PE, comme s’ils disposaient simplement d’un équivalent. L’aspect et l’allure des modules sur ces PNJ est à la discrétion du MJ.',
	'Équipement (1 à 3 rare) | héros - hostile - salopard - colosse - patron - autre | Le PNJ peut être doté de 1 à 3 modules ou armes jusqu’à rare tirés de l’arsenal. Il est possible que cette capacité soit présente sur des PNJ ne possédant pas de méta-armure. Dans ce cas, les PNJ profitent seulement des effets de ces capacités, sans dépenser de PE, comme s’ils disposaient simplement d’un équivalent. L’aspect et l’allure des modules sur ces PNJ est à la discrétion du MJ.',
	'Évolution | initié - salopard - colosse - patron | Tant que le PNJ est présent dans une phase de conflit, ses PNJ alliés à portée longue ou inférieure peuvent bénéficier d’un effet d’arme supplémentaire à choisir parmi : dégâts continus 6, choc 2, meurtrier, destructeur ou barrage 3.',
	'Exosquelette de combat (1) | recrue - hostile - salopard - colosse - patron - bande - autre - humain | Le PNJ bénéficie d’aspects exceptionnels et d’un module de saut et de course 1. Si ses PA tombent à 0, ces bénéfices sont annulés.',
	'Exosquelette de combat (2) | initié - hostile - salopard - colosse - patron - bande - autre - humain | Le PNJ bénéficie d’aspects exceptionnels et d’un module de saut et de course 2. Si ses PA tombent à 0, ces bénéfices sont annulés.',
	'Exosquelette de combat (3) | héros - hostile - salopard - colosse - patron - bande - autre - humain | Le PNJ bénéficie d’aspects exceptionnels et d’un module de saut et de course 3. Si ses PA tombent à 0, ces bénéfices sont annulés.',
	"Haine de l’Anathème | initié - salopard - colosse - patron - autre | Les dégâts du PNJ sont augmentés de 3D6 contre les créatures de l'Anathème.",
	'Hypersensibilité lumineuse | faiblesse (héros) - recrue - hostile - salopard - colosse - patron - bande | Toute utilisation de l’effet lumière X annule pendant 1D6 tours une ou plusieurs capacités du PNJ (au choix du MJ). Les dégâts infligés au PNJ avec des armes possédant l’effet lumière X sont doublés.',
	'Immatériel | héros - patron | Le PNJ est intangible et donc insensible aux dégâts. Pour lui infliger des dommages, les effets lumière X ou anti-Anathème doivent être utilisés en même temps que l’exposition à de l’élément alpha brut (les personnages présents subissent une perte d’1D6 points d’espoir par tour en présence d’élément alpha brut).',
	'Immortel | héros - patron | Le PNJ peut dépenser une action de déplacement pour récupérer de 10 à 100 points de santé (au choix du MJ). Cette capacité ne peut être activée qu’une fois par tour en phase de conflit.',
	'Implacable | recrue - salopard - colosse - patron - autre | Si le PNJ n’utilise pas son action de déplacement durant son tour, il peut effectuer une attaque supplémentaire.',
	'Indestructible | héros - patron | Seules les armes avec l’effet anti-véhicule peuvent infliger des dégâts au PNJ. La violence des armes avec l’effet anti-véhicule font aussi baisser ses PS.',
	'Indestructible | héros - bande | Seules les armes avec l’effet anti-véhicule peuvent infliger de la violence au PNJ. Les dégâts des armes avec l’effet anti-véhicule font aussi baisser ses PS.',
	'Infiltré | initié - salopard - colosse - patron - bande | Le PNJ peut se retrouver partout et est difficilement identifiable et différentiable d’humains communs, même quand il n’est pas seul. Seul un test base Perception ou Instinct difficulté délicat (4) peut permettre de le repérer.',
	'Intangible | héros - hostile - salopard - patron | Tant qu’il est intangible, le PNJ reste insensible à la violence ou aux dégâts des armes, sauf si ceux-ci bénéficient de l’effet anti-Anathème. Tant qu’il est intangible, il ne peut cependant pas agir contre les personnages en méta-armures. L’intangibilité peut s’activer ou se désactiver une seule fois par tour en phase de conflit.',
	'Invisibilité | héros - hostile - salopard - patron | Le PNJ bénéficie de la même capacité que la méta-armure Rogue, sous les mêmes conditions.',
	'Kamikaze | héros - hostile - salopard - patron - autre | Lorsqu’il a atteint sa cible, le PNJ peut exploser, infligeant ainsi 8D6 + 15 points de dégâts dispersion 6 à portée courte autour de lui.',
	'Loyauté sans faille | faiblesse (recrue) - recrue - hostile - salopard - colosse - patron - autre | Le PNJ ne fuit jamais et ne se rend jamais.',
	'Lumière | salopard - colosse - patron - autre - humain | Quelque chose émane du PNJ à tel point que les créatures des ténèbres n’osent s’en approcher à moins de portée moyenne. Si elles devaient se trouver à une portée inférieure, elles subiraient automatiquement l’effet lumière 6 tant qu’elles y restent.',
	'Membre du Knight (recrue) | recrue - salopard - colosse - patron - autre - humain | Le PNJ bénéficie d’une méta-armure, d’une arme de contact et à distance ainsi que de 2 modules tirés de l’arsenal.',
	'Membre du Knight (initié) | initié - salopard - colosse - patron - autre - humain | Le PNJ bénéficie d’une méta-armure, d’une arme de contact et à distance ainsi que de 2 modules tirés de l’arsenal.',
	'Membre du Knight (héros) | héros - salopard - colosse - patron - autre - humain | Le PNJ bénéficie d’une méta-armure, d’une arme de contact et à distance ainsi que de 2 modules tirés de l’arsenal.',
	'Mémoire | initié - patron | Le PNJ est capable de connaître le passé complet de tous les personnages qu’il rencontre et de savoir les fautes qu’ils ont commises. Chaque test base Parole, Aura ou Sang-froid raté face à lui engendre la perte d’1D6 points d’espoir.',
	'Meneur d’hommes | recrue - salopard - colosse - patron - autre | Le PNJ, lorsqu’il est ac­compagné d’alliés sous ses ordres, leur procure un bonus de 2 en défense et en réaction, ainsi qu’un bonus de 2 en débordement et de 50 en cohésion si les alliés forment une bande.',
	"Méta-armure (4 points d’aspect exceptionnel et 1 à 3 modules standards) | recrue - hostile - salopard - colosse - patron - autre - humain | Le PNJ bénéficie d'aspects exceptionnels et de modules jusqu'à standard de l'arsenal. Si les PA du PNJ tombent à 0, ces bénéfices sont annulés, jusqu'à ce que l'armure soit réparée.",
	"Méta-armure (8 points d’aspect exceptionnel et 1 à 3 modules avancés) | initié - hostile - salopard - colosse - patron - autre - humain | Le PNJ bénéficie d'aspects exceptionnels et de modules jusqu'à avancé de l'arsenal. Si les PA du PNJ tombent à 0, ces bénéfices sont annulés, jusqu'à ce que l'armure soit réparée.",
	"Méta-armure (12 points d’aspect exceptionnel et 1 à 3 modules rares) | héros - hostile - salopard - colosse - patron - autre - humain | Le PNJ bénéficie d'aspects exceptionnels et de modules jusqu'à rare de l'arsenal. Si les PA du PNJ tombent à 0, ces bénéfices sont annulés, jusqu'à ce que l'armure soit réparée.",
	'Méthodique | faiblesse (héros) - recrue - bande | Si la cible du PNJ est mobile, c’est-à-dire si elle a effectué une action de déplacement à ce tour, elle ne subit pas de score de débordement.',
	"Module (module standard) | recrue - hostile - salopard - colosse - patron - autre | Le PNJ bénéficie de l'équivalent d'un module standard.",
	"Module (module avancé) | initié - hostile - salopard - colosse - patron - autre | Le PNJ bénéficie de l'équivalent d'un module avancé.",
	"Module (module rare) | héros - hostile - salopard - colosse - patron - autre | Le PNJ bénéficie de l'équivalent d'un module rare.",
	'Monture | initié - patron | Le destrier du PNJ lui permet de bénéficier de points supplémentaires dans l’aspect Bête ainsi qu’en défense et en réaction. Pour le mettre à terre, il faut réussir un test base Déplacement contre son aspect Chair divisé par 2 et avoir au moins un overdrive de niveau 3 en Force.',
	"Né dans la lumière | recrue - hostile - salopard - colosse - patron | Tous les dégâts infligés par le PNJ à un PJ sont retirés aux points d'espoir et non aux points de santé ou points d'armure.",
	'Parasite | initié - hostile - salopard - colosse - patron | Tant que le PNJ combat au sein d’une bande (amie ou ennemie), il ne peut pas mourir. S’il tombe à 0 PS, il se relève au tour suivant avec la moitié de ses PS initiaux.',
	'Peur (1) | initié - hostile - salopard - colosse - patron | Au début d’une phase de conflit face au PNJ (ou plusieurs PNJ) avec la capacité peur, les PJ doivent réussir un test base Sang-Froid ou Hargne opposé à un aspect (divisé par 2, au choix du MJ) du PNJ. S’ils réussissent, ils subissent un malus de 1 dé à chacun de leurs tests. S’ils échouent, ils subissent un malus de 1 dés et leur réaction comme leur défense sont réduites de 1 points. Si c’est un échec critique, le PJ est tétanisé pendant 3D6 tours et ne peut rien faire. Un PJ ne peut pas subir cet effet plusieurs fois par tour.',
	'Peur (2) | initié - hostile - salopard - colosse - patron | Au début d’une phase de conflit face au PNJ (ou plusieurs PNJ) avec la capacité peur, les PJ doivent réussir un test base Sang-Froid ou Hargne opposé à un aspect (divisé par 2, au choix du MJ) du PNJ. S’ils réussissent, ils subissent un malus de 1 dé à chacun de leurs tests. S’ils échouent, ils subissent un malus de 2 dés et leur réaction comme leur défense sont réduites de 2 points. Si c’est un échec critique, le PJ est tétanisé pendant 3D6 tours et ne peut rien faire. Un PJ ne peut pas subir cet effet plusieurs fois par tour.',
	'Peur (3) | initié - hostile - salopard - colosse - patron | Au début d’une phase de conflit face au PNJ (ou plusieurs PNJ) avec la capacité peur, les PJ doivent réussir un test base Sang-Froid ou Hargne opposé à un aspect (divisé par 2, au choix du MJ) du PNJ. S’ils réussissent, ils subissent un malus de 1 dé à chacun de leurs tests. S’ils échouent, ils subissent un malus de 3 dés et leur réaction comme leur défense sont réduites de 3 points. Si c’est un échec critique, le PJ est tétanisé pendant 3D6 tours et ne peut rien faire. Un PJ ne peut pas subir cet effet plusieurs fois par tour.',
	'Phéromones | initié - patron | Le PNJ peut appeler à lui toutes ses créatures des ténèbres présentes dans un rayon de 10 kilomètres et les commander, même si elles ne sont pas sous ses ordres à l’origine.',
	'Prescience | héros - patron - autre | Le PNJ attaque toujours de sorte à toucher le point faible de son ennemi. Il peut toujours infliger le maximum de dégâts avec ses armes.',
	'Protéiforme (mineur) | initié - hostile - salopard - colosse - patron | Le PNJ peut changer son apparence et se doter d’armes avec les effets suivants (au choix du MJ) : meurtrier, destructeur ou choc 1.',
	'Protéiforme (majeur) | héros - hostile - salopard - colosse - patron | Le PNJ peut changer son apparence et se doter d’armes avec les effets suivants (au choix du MJ) : ignore CdF, ignore armure ou choc 2.',
	'Régénération | initié - hostile - salopard - colosse - patron | Si le PNJ combat au milieu d’une bande alliée, il peut lui infliger une attaque gratuite pour se régénérer d’autant de points de santé que les dégâts infligés. Les dégâts infligés sont convertis en violence et impactent directement la cohésion de la bande.',
	'Regain de santé | initié - salopard - colosse - patron - bande | Tant que le PNJ (ou plusieurs du même type) est présent dans une phase de conflit, les bandes de son Seigneur récupèrent 6D6 de cohésion chaque tour, les hostiles 3D6 points de santé, les salopards 4D6 et les patrons 6D6. Le PNJ lui-même récupère 6D6 points de cohésion à chaque tour.',
	'Renaissance | initié - salopard - colosse - patron - bande | Le PNJ peut se former aussi bien à partir d’un être vivant et désespéré que d’un cadavre humain. Si le PNJ est détruit, il se relève ou se réincarne dans un autre corps (mort ou vivant) à portée lointaine.',
	'Résistance lumineuse | recrue - hostile - salopard - colosse - patron | Le PNJ est insensible aux effets lumière X et anti-Anathème.',
	'Résistant | recrue - salopard - patron | Peu importe sa taille, le PNJ est considéré comme un colosse.',
	'Ressources illimitées | initié - patron - autre | Ressources illimitées : Le PNJ a accès à toutes les ressources qu’il souhaite, qu’il s’agisse d’argent, de matériel ou d’hommes.',
	'Sensibilité IEM | faiblesse (recrue) - recrue - hostile - salopard - colosse - patron | L’utilisation de grenades IEM contre le PNJ lui inflige automatiquement parasitage 4.',
	'Surhomme (3 points d’aspect exceptionnel) | recrue - hostile - salopard - colosse - patron - autre | Le MJ peut répartir entre 3 points dans les aspects exceptionnels du PNJ (et, bien entendu, en créer si le PNJ n’en a pas) et lui faire bénéficier de leurs effets.',
	'Surhomme (9 points d’aspect exceptionnel) | initié - hostile - salopard - colosse - patron - autre | Le MJ peut répartir entre 9 points dans les aspects exceptionnels du PNJ (et, bien entendu, en créer si le PNJ n’en a pas) et lui faire bénéficier de leurs effets.',
	'Surhomme (18 points d’aspect exceptionnel) | héros - hostile - salopard - colosse - patron - autre | Le MJ peut répartir entre 18 points dans les aspects exceptionnels du PNJ (et, bien entendu, en créer si le PNJ n’en a pas) et lui faire bénéficier de leurs effets.',
	'Tailles diverses | recrue - hostile - salopard - patron | Certains PNJ de ce type peuvent être considérés comme des colosses, au choix du MJ lorsqu’il les inclut à sa mission.',
	'Talon d’Achille | initié - patron - autre | Lorsqu’il attaque un personnage, le PNJ touche systématiquement, de plus il inflige des dégâts à sa valeur la plus basse à choisir entre les points d’armure, d’énergie ou d’espoir.',
	'Téléportation (type) | héros - hostile - salopard - patron - autre | Le PNJ peut apparaître et disparaître à volonté dans un type de zone défini par le MJ.',
	'Tremblement de terre | recrue - salopard - colosse - patron | Toutes les attaques du PNJ infligent automatiquement l’effet choc 1.',
	'Union | initié - hostile - salopard - colosse | Deux PNJ possédant le même nom peuvent s’unir, fusionner et disparaître pour former une entité plus puissante, possédant le même nom et le même type que celles d’origine. Les aspects de la nouvelle entité ainsi créée sont augmentés de 2, ses dégâts sont augmentés de 3D6 à 5D6 (au choix du MJ) et ses points de santé sont doublés. Par contre, sa défense et sa réaction sont divisées par 2. Une entité déjà issue d’une union peut s’unir à d’autres entités du même nom pour devenir encore plus forte.',
	'Vol | initié - hostile - salopard - colosse - patron - bande | Le PNJ peut voler sur une distance équivalente à portée longue par tour (une vitesse égale à 3 si on la compare à celle des véhicules).',
	'Terreur | initié - hostile - salopard - colosse - patron - bande | Chaque début de tour, les personnages doivent réussir un test base Hargne combo Sang-Froid difficulté difficile (6) pour pouvoir agir, sinon, ils restent pétrifiés.',
	'Affidé du Seigneur | élite - recrue - hostile - salopard - colosse - patron | Le PNJ ajoute le score de l’aspect de son Seigneur multiplié par 5 à son total de PS (ou de PA). L’aspect exceptionnel n’ajoute pas de PS supplémentaires.',
	'Protégé du Seigneur | élite - recrue - hostile - salopard - colosse - patron | Les attaques portées sur le PNJ dont la base ou le combo comporte une caractéristique qui dépend de l’aspect du Seigneur de la créature infligent leurs dégâts divisés par deux.',
	'Serviteur du Seigneur | élite - recrue - hostile - salopard - colosse - patron | Lorsque le PNJ attaque un ennemi disposant d’un score dans l’aspect de son Seigneur égal à 7 ou plus (14 ou plus dans le cas d’un PNJ), il considère la défense et la réaction de sa cible comme étant divisées par deux.',
	'Tueur du Seigneur | élite - recrue - hostile - salopard - colosse - patron | Lorsque le PNJ attaque un PJ disposant d’un score dans l’aspect de son Seigneur égal à 7 ou plus (14 ou plus dans le cas d’un PNJ), ses dégâts sont augmentés d’une valeur fixe égale à son score dans l’aspect de son Seigneur (le score de l’aspect exceptionnel est ignoré dans ce calcul).',
	'Élu du Seigneur | élite - recrue - hostile - salopard - colosse - patron | Le PNJ peut dépasser un score d’aspect de 20 et un score d’aspect exceptionnel de 10 uniquement dans l’aspect de son Seigneur. Ces scores ne peuvent excéder 40 pour l’aspect et 20 pour l’aspect exceptionnel.',
	'Accablant | élite - initié - hostile - salopard - colosse - patron - bande - autre | Si un PJ détruit le PNJ, il doit réussir un test base Hargne combo Sang-Froid (difficulté au choix du MJ) pour ne pas perdre 3D6 points d’espoir.',
	'Aura de souffrance | élite - initié - hostile - salopard - colosse - patron | Un PJ (ou un PNJ) réussissant une attaque sur le PNJ subit automatiquement 2D6 points de dégâts avec les effets ignore armure et ignore CdF.',
	'Dévorant | élite - initié - hostile - salopard - colosse - patron | Lorsque ce PNJ attaque un PJ au contact et le rate, alors l’arme en main du PJ (ou une des armes en main au choix du MJ) est détruite. Après la première destruction lors d’une phase de conflit, le PJ subissant l’effet peut choisir de ne pas se défendre et de recevoir automatiquement les dégâts sans que son arme soit détruite. Cet capacité ne fonctionne pas sur le armes de prestige et les armes possédant l’amélioration élément alpha. Une arme détruite est récupérée après la mission en cours. Pour symboliser cette perte, le PJ ayant perdu son arme peut subir un malus de 5 PG à son total gagné à la fin de la mission.',
	'Hybridation | élite - initié - hostile - salopard - colosse - patron | Le PNJ est au service de deux Seigneurs. Pour lui, les capacités « du Seigneur » fonctionnent sur deux aspects (au choix du MJ) au lieu d’un seul.',
	'Intouchable | élite - héros - hostile - salopard - colosse - patron - autre | Le PNJ est insensible aux attaques qui nécessitent de dépasser sa réaction (incompatible avec insaisissable).',
	'Insaisissable | élite - héros - hostile - salopard - colosse - patron - autre | Le PNJ est insensible aux attaques qui nécessitent de dépasser sa défense (incompatible avec intouchable).',
	'Il est partout | élite - initié - salopard - colosse - patron | Les attaques du PNJ ciblent automatiquement tous les PJ impliqués dans le conflit (sauf ceux cachés ou invisibles), peu importe leur distance ou leur attitude.',
	'Phase 2 | spécial | Lorsque le PNJ a été mis à l’agonie une première fois, il récupère la totalité de ses PS, PA et PE (s’il en a) et reprend le combat. Il ne peut utiliser cette capacité qu’une seule fois. Le reste de la phase 2 doit être définie par le MJ.',
	'Amour parental | spécial | Bien que corrompu par l’Anathème, le PNJ reste attaché à son enfant. Si les PJ mènent l’assaut avec lui, alors le PNJ est troublé. Il perd la capacité actions multiples lors de sa première phase (et uniquement celle-ci).',
	"Appui d'artillerie | spécial | Une fois par combat, le PNJ peut faire appel à un barrage d’artillerie qui suit les règles d’un pod roquette nv1 ou d’un pod missile nv1 avec en plus l’effet dispersion 6.",
	'Attaque spéciale | spécial | Le PNJ peut décider de sacrifier toutes ses actions de combat pour pouvoir utiliser son attaque spéciale. Attention, pour l’utiliser, il a besoin de points d’énergie qu’il a préalablement drainés.',
	'Aura de fureur | spécial | Les PJ et PNJ en présence du PNJ doivent effectuer un jet base Sang-Froid difficulté ardu (5) sous peine d’attaquer, avec l’arme de leur choix, la personne la plus proche d’eux. Ce test ne s’effectue qu’une fois, au début d’une scène ou d’une phase de conflit.',
	'Dévoreur | spécial | Le PNJ ignore les scores d’égide et de bouclier, sauf conditions indiquées dans un scénario et en fonction des actions des PJ.',
	'Don de la Chair | spécial | Le PNJ peut soigner une blessure grave (tirée sur le tableau aléatoire) d’un personnage, mais celui-ci perd définitivement 1D6 points d’espoir (sur son score actuel et son total).',
	'Double face | spécial | Le PNJ, lorsqu’il possède un personnage et face à des systèmes de détection ou d’enregistrement, n’est visible que lorsqu’il est de dos, mais complètement invisible de face.',
	'Écho | spécial | Le PNJ est la copie d’un PJ présent dans la scène. Il en simule la quasi-totalité des équipements et des armes (sans les effets lumière X, anti-Anathème et espérance). Seuls les armes de prestige, les modules de prestige, les capacités héroïques et les capacités ultimes ne sont pas simulés.',
	'Entre les mondes | spécial | Tant qu’il n’a pas attaqué, le PNJ est considéré comme ayant le double de sa défense et de sa réaction. Une fois qu’il a attaqué, il devient tangible jusqu’à la fin du combat et possède ses scores de défense et de réaction normaux.',
	'Espion | recrue - initié - héros - hostile - salopard - colosse - patron - bande | Le PNJ est en lien direct avec son Seigneur. Si un (ou plusieurs) PNJ avec cette capacité est présent dans une phase de conflit, et tant qu’il est présent à portée longue ou moins, il offre 3 réussites automatiques aux tests des autres créatures de son Seigneur. Le bonus ne peut être cumulé.',
	'Enfant à maman | spécial | Si le PNJ est d’une façon ou d’une autre retenu prisonnier, son Seigneur fera tout pour le libérer.',
	'Griffe des ténèbres | recrue - initié - héros - hostile - salopard - colosse - patron | Une fois par tour, le PNJ peut ignorer les points d’armure et infliger ses dégâts directement sur la santé.',
	'Immunité technologique | recrue - initié - héros - hostile - salopard - colosse - patron - bande | Le PNJ est immunisé aux effets choc X et parasitage X.',
	'Invulnérabilité | spécial | Pour faire le moindre dégât à la cible, un personnage doit d’abord faire baisser sa résilience à 0, même si l’attaque utilisée possède l’effet anti-véhicule. En effet, tant que le personnage ou le véhicule possède des points de résilience, l’invulnérabilité lui permet d’ignorer l’ensemble des dégâts même ceux possédant l’effet anti-véhicule.',
	'Isolement | recrue - initié - héros - patron | Une fois par partie, le PNJ peut isoler n’importe quel personnage (un ou plusieurs) présent dans la scène dans des cubes de glace et de silence qui possèdent 100 PA. Les murs des cubes résistent jusqu’à leur destruction. Le PNJ possédant cette capacité peut attaquer au travers des murs. Les personnages isolés peuvent attaquer le mur ou activer des modules, mais pas se déplacer. Ils ne peuvent pas tirer au travers des murs, même avec des armes possédant l’effet artillerie.',
	'Horde | héros - patron | Le PNJ est toujours accompagné d’une bande de petits créatures de toutes sortes. Cette marée grouillante est à traiter comme une bande de noctes avec 1000 de cohésion.',
	'Mitraillage | recrue - initié - héros - hostile - salopard - colosse - patron | Lorsque le PNJ attaque à distance, il reçoit un bonus de 1 réussite automatique à ses jets.',
	'Noyau central | recrue - initié - héros - patron | Le noyau central du PNJ ne se déplace pas. S’il est détruit, tout ce que le PNJ contrôlait est libéré de son emprise. En contrepartie, le noyau reçoit la règle invulnérabilité et 10 points de résilience.',
	'Oubli | spécial | Plutôt que de subir le débordement, les dégâts et les effets, un PJ peut toujours décider de sacrifier un souvenir. Si le PJ choisit cette option, le MJ lui fait subir un de ces effets (au choix) : perte de 3D6 points d’espoir, perte d’un contact, perte d’un point de caractéristique (parmi les plus basses), perte d’une capacité héroïque, perte de 3D6 points de gloire totaux.',
	'Presque humain | spécial | Le PNJ se souvient encore d’une partie de son passé et garde des attitudes humaines. Il est donc plus facile pour lui de communiquer avec les PJ et de bénéficier de leur sympathie.',
	'Prévoyant | spécial | Le PNJ a préparé plusieurs sorties, pièges et armements automatisés pour assurer sa sécurité et se défendre d’éventuels ennemis. Lorsque le PNJ est rencontré dans un lieu, il peut avoir dissimulé une sortie secrète, deux pièges explosifs à traiter comme des grenades intelligentes pouvant être déclenchées à portée longue, ainsi qu’une tourelle automatisée équipée d’une mitrailleuse lourde ou d’un railgun.',
	'Psychopathe | recrue - initié - héros - patron | Si le PNJ désigne un ou plusieurs PJ comme ses proies, il les traque jusqu’à la mort.',
	'Résistant au présent | héros - hostile - salopard - colosse - patron - bande | Le PNJ subit toujours la moitié des dégâts ou de la violence infligés, sauf conditions indiquées dans un scénario et en fonction des actions des PJ.',
	'Sous les ordres | spécial | Le PNJ répond aux ordres d’un immortel et les PJ peuvent avoir des problèmes s’ils vont à son encontre sans justification.',
	'Spores | spécial | Le PNJ peut projeter des spores qui, en atteignant les voies respiratoires d’un PNJ, s’y accrochent. Dès qu’il le souhaite, le PNJ peut activer ces spores, tuant la personne de l’intérieur, avec ou sans retardement. Cet effet n’est à jouer que sur des PNJ, les chevaliers y sont naturellement immunisés grâce aux méta-armures.',
	"Tireur d'élite | spécial | Toutes les armes à feu utilisées par le personnage ne possèdent plus de limite de portée.",
	'Versatile | recrue - initié - héros - hostile - salopard - colosse - patron | Le PNJ dipose, au choix du MJ, d’un module de saut niv. 1, d’un module de vol niv. 1, d’un module d’adhérence niv. 1 ou d’un module de déplacement silencieux niv. 1 représentant une mutation animale.'
]

export const EFFECTS = [
	'Anathème | recrue - hostile - salopard - colosse - patron | 20',
	'Anti-Anathème | recrue - hostile - salopard - colosse - patron - autre - humain - bande | 20',
	'Anti-véhicule | recrue - hostile - salopard - colosse - patron - autre - bande | 20',
	'Barrage 4 | recrue - hostile - salopard - colosse - patron - autre - bande | 10',
	'Barrage 6 | initié - hostile - salopard - colosse - patron - autre - bande | 15',
	'Barrage 8 | héros - hostile - salopard - colosse - patron - autre - bande | 20',
	'Choc 1 | recrue - hostile - salopard - colosse - patron - autre - bande | 20',
	'Choc 2 | initié - hostile - salopard - colosse - patron - autre | 50',
	'Choc 4 | héros - hostile - salopard - colosse - patron - autre | 60',
	'Choc 6 | héros - hostile - salopard - colosse - patron - autre | 70',
	'Dispersion 2 | recrue - hostile - salopard - colosse - patron - autre | 10',
	'Dispersion 3 | initié - hostile - salopard - colosse - patron - autre | 20',
	'Dispersion 6 | héros - hostile - salopard - colosse - patron - autre | 30',
	'Dégâts continus 3 | recrue - hostile - salopard - colosse - patron - autre | 20',
	'Dégâts continus 6 | initié - hostile - salopard - colosse - patron - autre | 40',
	'Dégâts continus 9 | héros - hostile - salopard - colosse - patron - autre | 60',
	'Destructeur | recrue - hostile - salopard - colosse - patron - autre - bande | 20',
	'Ignore armure | initié - hostile - salopard - colosse - patron - autre - bande | 70',
	'Ignore CdF | initié - hostile - salopard - colosse - patron - autre - bande | 70',
	'Lumière 2 | recrue - hostile - salopard - colosse - patron - autre - humain - bande | 5',
	'Lumière 4 | initié - hostile - salopard - colosse - patron - autre - humain - bande | 15',
	'Lumière 6 | héros - hostile - salopard - colosse - patron - autre - humain - bande | 20',
	'Meurtrier | recrue - hostile - salopard - colosse - patron - autre - bande | 20',
	'Parasitage 1 | recrue - hostile - salopard - colosse - patron - autre - bande | 20',
	'Parasitage 2 | initié - hostile - salopard - colosse - patron - autre | 50',
	'Parasitage 4 | héros - hostile - salopard - colosse - patron - autre | 60',
	'Parasitage 6 | héros - hostile - salopard - colosse - patron - autre | 70',
	'Perce armure 20 | recrue - hostile - salopard - colosse - patron - autre - bande | 20',
	'Perce armure 40 | initié - hostile - salopard - colosse - patron - autre - bande | 40',
	'Perce armure 60 | héros - hostile - salopard - colosse - patron - autre - bande | 50',
	'Silencieux | recrue - hostile - salopard - colosse - patron - autre | 10',
	'Soumission | initié - hostile - salopard - colosse - patron - autre - bande | 30',
	'Artillerie | PJ | 0',
	'Assassin 2 | PJ | 0',
	'Assassin 4 | PJ | 0',
	'Assistance à l’attaque | PJ | 0',
	'Cadence 2 | PJ | 0',
	'Cadence 3 | PJ | 0',
	'Chargeur 4 | PJ | 0',
	'Chargeur 5 | PJ | 0',
	'Chargeur 6 | PJ | 0',
	'Défense 2 | PJ | 0',
	'Défense 3 | PJ | 0',
	'Défense 4 | PJ | 0',
	'Démoralisant | PJ | 0',
	'Désignation | PJ | 0',
	'Deux mains | PJ | 0',
	'En chaîne | PJ | 0',
	'Espérance | PJ | 0',
	'Fureur | PJ | 0',
	'Jumelé (akimbo) | PJ | 0',
	'Jumelé (ambidextrie) | PJ | 0',
	'Lesté | PJ | 0',
	'Lourd | PJ | 0',
	'Oblitération | PJ | 0',
	'Orfèvrerie | PJ | 0',
	'Pénétrant 5 | PJ | 0',
	'Pénétrant 10 | PJ | 0',
	'Précision | PJ | 0',
	'Réaction 2 | PJ | 0',
	'Réaction 3 | PJ | 0',
	'Réaction 4 | PJ | 0',
	'Ténébricide | PJ | 0',
	'Tir en rafale | PJ | 0',
	'Tir en sécurité | PJ | 0',
	'Ultraviolence | PJ | 0'
]

export const GRID = {
	[HOSTILE]: {
		[RECRUE]: {
			aspects: {
				min: 12,
				max: 24,
				limit: 8
			},
			aspects_exceptionals: {
				min: 2,
				max: 6,
				limit: 3,
				major_min: 0,
				major_max: 0
			},
			health: {
				min: 1,
				max: 30
			},
			armor: {
				min: 0,
				max: 0
			},
			forcefield: {
				min: 0,
				max: 0
			},
			shield: {
				min: 0,
				max: 0
			},
			energy: {
				min: 10,
				max: 10
			},
			resilience: 0,
			capacities: 2,
			elite: {
				major_aspects: 1,
				capacities: 1
			},
			weapon: {
				effect: 1,
				points: 30
			}
		},
		[INITIE]: {
			aspects: {
				min: 25,
				max: 42,
				limit: 12
			},
			aspects_exceptionals: {
				min: 7,
				max: 10,
				limit: 6,
				major_min: 0,
				major_max: 0
			},
			health: {
				min: 30,
				max: 60
			},
			armor: {
				min: 1,
				max: 10
			},
			forcefield: {
				min: 5,
				max: 5
			},
			shield: {
				min: 5,
				max: 5
			},
			energy: {
				min: 20,
				max: 20
			},
			resilience: 0,
			capacities: 3,
			elite: {
				major_aspects: 1,
				capacities: 1
			},
			weapon: {
				effect: 1,
				points: 40
			}
		},
		[HEROS]: {
			aspects: {
				min: 43,
				max: 52,
				limit: 14
			},
			aspects_exceptionals: {
				min: 11,
				max: 15,
				limit: 9,
				major_min: 1,
				major_max: 1
			},
			health: {
				min: 60,
				max: 80
			},
			armor: {
				min: 10,
				max: 40
			},
			forcefield: {
				min: 10,
				max: 10
			},
			shield: {
				min: 10,
				max: 10
			},
			energy: {
				min: 20,
				max: 40
			},
			resilience: 0,
			capacities: 5,
			elite: {
				major_aspects: 1,
				capacities: 1
			},
			weapon: {
				effect: 1,
				points: 60
			}
		}
	},
	[SALOPARD]: {
		[RECRUE]: {
			aspects: {
				min: 33,
				max: 40,
				limit: 12
			},
			aspects_exceptionals: {
				min: 7,
				max: 13,
				limit: 6,
				major_min: 1,
				major_max: 1
			},
			health: {
				min: 60,
				max: 100
			},
			armor: {
				min: 0,
				max: 40
			},
			forcefield: {
				min: 5,
				max: 5
			},
			shield: {
				min: 0,
				max: 0
			},
			energy: {
				min: 20,
				max: 30
			},
			resilience: 0,
			capacities: 3,
			elite: {
				major_aspects: 2,
				capacities: 2
			},
			weapon: {
				effect: 2,
				points: 50
			}
		},
		[INITIE]: {
			aspects: {
				min: 41,
				max: 52,
				limit: 14
			},
			aspects_exceptionals: {
				min: 14,
				max: 16,
				limit: 8,
				major_min: 1,
				major_max: 1
			},
			health: {
				min: 100,
				max: 150
			},
			armor: {
				min: 40,
				max: 60
			},
			forcefield: {
				min: 10,
				max: 10
			},
			shield: {
				min: 5,
				max: 10
			},
			energy: {
				min: 30,
				max: 50
			},
			resilience: 0,
			capacities: 4,
			elite: {
				major_aspects: 2,
				capacities: 2
			},
			weapon: {
				effect: 2,
				points: 80
			}
		},
		[HEROS]: {
			aspects: {
				min: 53,
				max: 70,
				limit: 16
			},
			aspects_exceptionals: {
				min: 17,
				max: 20,
				limit: 10,
				major_min: 2,
				major_max: 2
			},
			health: {
				min: 150,
				max: 300
			},
			armor: {
				min: 60,
				max: 100
			},
			forcefield: {
				min: 15,
				max: 30
			},
			shield: {
				min: 15,
				max: 20
			},
			energy: {
				min: 50,
				max: 100
			},
			resilience: 0,
			capacities: 6,
			elite: {
				major_aspects: 2,
				capacities: 2
			},
			weapon: {
				effect: 2,
				points: 100
			}
		}
	},
	[PATRON]: {
		[RECRUE]: {
			aspects: {
				min: 52,
				max: 70,
				limit: 20
			},
			aspects_exceptionals: {
				min: 12,
				max: 17,
				limit: 10,
				major_min: 1,
				major_max: 2
			},
			health: {
				min: 160,
				max: 300
			},
			armor: {
				min: 40,
				max: 100
			},
			forcefield: {
				min: 10,
				max: 10
			},
			shield: {
				min: 10,
				max: 10
			},
			energy: {
				min: 10,
				max: 50
			},
			resilience: 0.033,
			capacities: 5,
			elite: {
				major_aspects: 2,
				capacities: 4
			},
			weapon: {
				effect: 3,
				points: 100
			}
		},
		[INITIE]: {
			aspects: {
				min: 71,
				max: 90,
				limit: 20
			},
			aspects_exceptionals: {
				min: 18,
				max: 37,
				limit: 10,
				major_min: 2,
				major_max: 3
			},
			health: {
				min: 300,
				max: 700
			},
			armor: {
				min: 100,
				max: 200
			},
			forcefield: {
				min: 10,
				max: 20
			},
			shield: {
				min: 10,
				max: 30
			},
			energy: {
				min: 50,
				max: 100
			},
			resilience: 0.05,
			capacities: 7,
			elite: {
				major_aspects: 2,
				capacities: 4
			},
			weapon: {
				effect: 3,
				points: 120
			}
		},
		[HEROS]: {
			aspects: {
				min: 90,
				max: 100,
				limit: 20
			},
			aspects_exceptionals: {
				min: 38,
				max: 50,
				limit: 10,
				major_min: 3,
				major_max: 5
			},
			health: {
				min: 700,
				max: 1000
			},
			armor: {
				min: 200,
				max: 300
			},
			forcefield: {
				min: 20,
				max: 50
			},
			shield: {
				min: 20,
				max: 40
			},
			energy: {
				min: 100,
				max: 200
			},
			resilience: 0.1,
			capacities: 9,
			elite: {
				major_aspects: 2,
				capacities: 4
			},
			weapon: {
				effect: 3,
				points: 150
			}
		}
	},
	[PATRON_COLOSSE]: {
		[RECRUE]: {
			aspects: {
				min: 52,
				max: 70,
				limit: 20
			},
			aspects_exceptionals: {
				min: 12,
				max: 18,
				limit: 10,
				major_min: 1,
				major_max: 2
			},
			health: {
				min: 160,
				max: 300
			},
			armor: {
				min: 40,
				max: 100
			},
			forcefield: {
				min: 10,
				max: 10
			},
			shield: {
				min: 10,
				max: 10
			},
			energy: {
				min: 10,
				max: 50
			},
			resilience: 0.033,
			capacities: 5,
			elite: {
				major_aspects: 2,
				capacities: 4
			},
			weapon: {
				effect: 3,
				points: 100
			}
		},
		[INITIE]: {
			aspects: {
				min: 71,
				max: 90,
				limit: 20
			},
			aspects_exceptionals: {
				min: 19,
				max: 37,
				limit: 10,
				major_min: 2,
				major_max: 3
			},
			health: {
				min: 300,
				max: 700
			},
			armor: {
				min: 100,
				max: 200
			},
			forcefield: {
				min: 10,
				max: 20
			},
			shield: {
				min: 10,
				max: 30
			},
			energy: {
				min: 50,
				max: 100
			},
			resilience: 0.05,
			capacities: 7,
			elite: {
				major_aspects: 2,
				capacities: 4
			},
			weapon: {
				effect: 3,
				points: 120
			}
		},
		[HEROS]: {
			aspects: {
				min: 90,
				max: 100,
				limit: 20
			},
			aspects_exceptionals: {
				min: 38,
				max: 50,
				limit: 10,
				major_min: 3,
				major_max: 5
			},
			health: {
				min: 700,
				max: 1000
			},
			armor: {
				min: 200,
				max: 300
			},
			forcefield: {
				min: 20,
				max: 50
			},
			shield: {
				min: 20,
				max: 40
			},
			energy: {
				min: 100,
				max: 200
			},
			resilience: 0.1,
			capacities: 9,
			elite: {
				major_aspects: 2,
				capacities: 4
			},
			weapon: {
				effect: 3,
				points: 150
			}
		}
	},
	[BANDE]: {
		[RECRUE]: {
			aspects: {
				min: 18,
				max: 37,
				limit: 10
			},
			aspects_exceptionals: {
				min: 0,
				max: 8,
				limit: 8,
				major_min: 1,
				major_max: 1
			},
			health: {
				min: 50,
				max: 150
			},
			armor: {
				min: 0,
				max: 0
			},
			forcefield: {
				min: 0,
				max: 0
			},
			shield: {
				min: 0,
				max: 0
			},
			energy: {
				min: 0,
				max: 0
			},
			resilience: 0,
			capacities: 2,
			outbreak: {
				min: 4,
				max: 8,
				effects_min: 0,
				effects_max: 1
			},
			elite: {
				major_aspects: 1,
				capacities: 1
			}
		},
		[INITIE]: {
			aspects: {
				min: 38,
				max: 46,
				limit: 12
			},
			aspects_exceptionals: {
				min: 9,
				max: 13,
				limit: 8,
				major_min: 1,
				major_max: 1
			},
			health: {
				min: 200,
				max: 400
			},
			armor: {
				min: 0,
				max: 0
			},
			forcefield: {
				min: 0,
				max: 0
			},
			shield: {
				min: 0,
				max: 0
			},
			energy: {
				min: 0,
				max: 0
			},
			resilience: 0,
			capacities: 3,
			outbreak: {
				min: 9,
				max: 12,
				effects_min: 1,
				effects_max: 2
			},
			elite: {
				major_aspects: 1,
				capacities: 1
			}
		},
		[HEROS]: {
			aspects: {
				min: 39,
				max: 56,
				limit: 15
			},
			aspects_exceptionals: {
				min: 14,
				max: 18,
				limit: 8,
				major_min: 1,
				major_max: 2
			},
			health: {
				min: 400,
				max: 600
			},
			armor: {
				min: 0,
				max: 0
			},
			forcefield: {
				min: 5,
				max: 10
			},
			shield: {
				min: 5,
				max: 10
			},
			energy: {
				min: 0,
				max: 0
			},
			resilience: 0,
			capacities: 5,
			outbreak: {
				min: 12,
				max: 15,
				effects_min: 2,
				effects_max: 3
			},
			elite: {
				major_aspects: 1,
				capacities: 1
			}
		}
	},
	[COLOSSE]: {
		[RECRUE]: {
			aspects: {
				min: 28,
				max: 37,
				limit: 14
			},
			aspects_exceptionals: {
				min: 4,
				max: 10,
				limit: 8,
				major_min: 1,
				major_max: 1
			},
			health: {
				min: 100,
				max: 200
			},
			armor: {
				min: 20,
				max: 40
			},
			forcefield: {
				min: 0,
				max: 0
			},
			shield: {
				min: 0,
				max: 0
			},
			energy: {
				min: 0,
				max: 0
			},
			resilience: 0.1,
			capacities: 2,
			elite: {
				major_aspects: 2,
				capacities: 3
			},
			weapon: {
				effect: 2,
				points: 50
			}
		},
		[INITIE]: {
			aspects: {
				min: 38,
				max: 52,
				limit: 16
			},
			aspects_exceptionals: {
				min: 12,
				max: 20,
				limit: 10,
				major_min: 2,
				major_max: 2
			},
			health: {
				min: 200,
				max: 400
			},
			armor: {
				min: 30,
				max: 50
			},
			forcefield: {
				min: 5,
				max: 5
			},
			shield: {
				min: 5,
				max: 10
			},
			energy: {
				min: 10,
				max: 50
			},
			resilience: 0.2,
			capacities: 4,
			elite: {
				major_aspects: 2,
				capacities: 3
			},
			weapon: {
				effect: 2,
				points: 80
			}
		},
		[HEROS]: {
			aspects: {
				min: 52,
				max: 70,
				limit: 18
			},
			aspects_exceptionals: {
				min: 21,
				max: 30,
				limit: 10,
				major_min: 3,
				major_max: 3
			},
			health: {
				min: 400,
				max: 600
			},
			armor: {
				min: 50,
				max: 100
			},
			forcefield: {
				min: 10,
				max: 10
			},
			shield: {
				min: 10,
				max: 20
			},
			energy: {
				min: 50,
				max: 100
			},
			resilience: 0.3,
			capacities: 6,
			elite: {
				major_aspects: 2,
				capacities: 3
			},
			weapon: {
				effect: 2,
				points: 100
			}
		}
	},
	[ALLIE]: {
		[RECRUE]: {
			aspects: {
				min: 28,
				max: 33,
				limit: 20
			},
			aspects_exceptionals: {
				min: 10,
				max: 16,
				limit: 10,
				major_min: 1,
				major_max: 2
			},
			health: {
				min: 60,
				max: 100
			},
			armor: {
				min: 0,
				max: 40
			},
			forcefield: {
				min: 5,
				max: 10
			},
			shield: {
				min: 5,
				max: 10
			},
			energy: {
				min: 20,
				max: 30
			},
			resilience: 0.03,
			capacities: 2,
			elite: {
				major_aspects: 2,
				capacities: 3
			},
			weapon: {
				effect: 3,
				points: 100
			}
		},
		[INITIE]: {
			aspects: {
				min: 34,
				max: 45,
				limit: 20
			},
			aspects_exceptionals: {
				min: 17,
				max: 25,
				limit: 10,
				major_min: 2,
				major_max: 3
			},
			health: {
				min: 100,
				max: 150
			},
			armor: {
				min: 40,
				max: 80
			},
			forcefield: {
				min: 10,
				max: 20
			},
			shield: {
				min: 10,
				max: 20
			},
			energy: {
				min: 30,
				max: 50
			},
			resilience: 0.05,
			capacities: 5,
			elite: {
				major_aspects: 2,
				capacities: 3
			},
			weapon: {
				effect: 3,
				points: 120
			}
		},
		[HEROS]: {
			aspects: {
				min: 46,
				max: 80,
				limit: 20
			},
			aspects_exceptionals: {
				min: 26,
				max: 50,
				limit: 10,
				major_min: 3,
				major_max: 5
			},
			health: {
				min: 150,
				max: 250
			},
			armor: {
				min: 80,
				max: 150
			},
			forcefield: {
				min: 20,
				max: 50
			},
			shield: {
				min: 20,
				max: 30
			},
			energy: {
				min: 50,
				max: 100
			},
			resilience: 0.1,
			capacities: 9,
			elite: {
				major_aspects: 2,
				capacities: 3
			},
			weapon: {
				effect: 3,
				points: 150
			}
		}
	}
}

export const WEAPON = {
	damage: [
		{ dice: 2, cost: 0 },
		{ dice: 3, cost: 5 },
		{ dice: 4, cost: 10 },
		{ dice: 5, cost: 15 },
		{ dice: 6, cost: 20 },
		{ dice: 7, cost: 25 },
		{ dice: 8, cost: 30 },
		{ dice: 9, cost: 35 },
		{ dice: 10, cost: 40 },
		{ dice: 11, cost: 50 },
		{ dice: 12, cost: 60 },
		{ dice: 13, cost: 70 },
		{ dice: 14, cost: 80 },
		{ dice: 15, cost: 90 }
	],
	damageRaw: [
		{ bonus: 0, cost: 0 },
		{ bonus: 3, cost: 5 },
		{ bonus: 6, cost: 10 },
		{ bonus: 9, cost: 15 }
	],
	violence: [
		{ dice: 2, cost: 0 },
		{ dice: 3, cost: 5 },
		{ dice: 4, cost: 10 },
		{ dice: 5, cost: 15 },
		{ dice: 6, cost: 20 },
		{ dice: 7, cost: 25 },
		{ dice: 8, cost: 30 },
		{ dice: 9, cost: 35 },
		{ dice: 10, cost: 40 },
		{ dice: 11, cost: 50 },
		{ dice: 12, cost: 60 },
		{ dice: 13, cost: 70 },
		{ dice: 14, cost: 80 },
		{ dice: 15, cost: 90 }
	],
	violenceRaw: [
		{ bonus: 0, cost: 0 },
		{ bonus: 3, cost: 5 },
		{ bonus: 6, cost: 10 },
		{ bonus: 9, cost: 15 }
	],
	ranges: {
		contact: [
			{ range: CONTACT, cost: 0 },
			{ range: COURTE, cost: 10 }
		],
		ranged: [
			{ range: COURTE, cost: 0 },
			{ range: MOYENNE, cost: 5 },
			{ range: LONGUE, cost: 10 },
			{ range: LOINTAINE, cost: 15 }
		]
	},
	types: [
		{ name: 'Une main', cost: 0, effects: [] },
		{ name: 'Deux mains', cost: -20, effects: ['Deux mains'] },
		{ name: 'Lourde', cost: -30, effects: ['Deux mains', 'Lourd'] }
	],
	effects: [
		'Ténébricide | -20',
		'Anti-Anathème | 20',
		'Anti-véhicule | 20',
		'Artillerie | 10',
		'Assassin 2 | 5',
		'Assassin 4 | 10',
		'Assistance à l’attaque | 10',
		'Barrage 2 | 5',
		'Barrage 4 | 10',
		'Barrage 6 | 15',
		'Barrage 8 | 20',
		'Cadence 2 | 10',
		'Cadence 3 | 20',
		'Choc 2 | 10',
		'Choc 4 | 15',
		'Choc 6 | 20',
		'Défense 2 | 10',
		'Défense 3 | 15',
		'Défense 4 | 20',
		'Dispersion 3 | 10',
		'Dispersion 6 | 20',
		'Dégâts continus 3 | 5',
		'Dégâts continus 6 | 15',
		'Démoralisant | 15',
		'Désignation | 5',
		'Destructeur | 10',
		'En chaîne | 15',
		'Espérance | 15',
		'Fureur | 20',
		'Ignore armure | 20',
		'Ignore CdF | 20',
		'Jumelé (akimbo) | 10',
		'Jumelé (ambidextrie) | 10',
		'Lesté | 10',
		'Lumière 2 | 5',
		'Lumière 4 | 15',
		'Lumière 6 | 20',
		'Meurtrier | 10',
		'Oblitération | 15',
		'Orfèvrerie | 10',
		'Pénétrant 5 | 5',
		'Pénétrant 10 | 10',
		'Perce armure 20 | 5',
		'Perce armure 40 | 10',
		'Perce armure 60 | 15',
		'Précision | 10',
		'Réaction 2 | 10',
		'Réaction 3 | 15',
		'Réaction 4 | 20',
		'Silencieux | 10',
		'Soumission | 15',
		'Tir en rafale | 15',
		'Tir en sécurité | 10',
		'Ultraviolence | 10'
	]
}

export const SECTIONS = [
	"Cyclope | Machine | Overdrive Savoir niv. 1 | Sensible à l'Anathème",
	'Dragon | Dame | Pod fusées éclairantes niv. 1, Flash, Attaque non létale niv. 1 | Humaniste',
	'Gargoyle | Chair | Banner, Relais TacCom | Surprotecteur',
	"Giant | Machine | Overdrive Technique niv. 1 | Rat d'atelier",
	'Griffon | Masque | Moto steed | Jouteur',
	"Korrigan | Masque | Relais satellite niv. 1, Drone d'espionnage, Caméraman | Toujours un doute",
	'Ogre | Bête | Déplacement silencieux niv. 1, Fumigène, Vue alternative niv. 1 | Marqué par les ténèbres',
	'Tarasque | Bête | Lame de bras niv. 1, Attaque sur casque niv. 1, Saut niv. 1 | Fou dangereux',
	'Aucune section'
]

export const ARMORS = [
	'Barbarian | 60 60 12 | 5 5 5 8 5 5 | Force Endurance Hargne Combat',
	'Bard | 40 80 12 | 5 5 5 8 5 5 | Déplacement Aura Parole Dextérité',
	'Druid | 50 80 12 | 5 5 5 8 5 5 | Combat Instinct Tir Technique',
	'Monk | 60 50 14 | 7 8 8 10 6 6 | Hargne Combat Tir Sang-froid',
	'Paladin | 120 20 8 | 7 7 7 10 7 7 | Force Endurance Tir Perception',
	'Priest | 70 60 10 | 5 5 5 8 5 5 | Force Endurance Savoir Technique',
	'Psion | 50 60 14 | 7 10 10 12 7 7 | Instinct Savoir Sang-froid Perception',
	'Ranger | 50 70 12 | 4 4 4 6 4 4 | Déplacement Tir Discrétion Dextérité',
	'Rogue | 50 70 12 | 5 5 5 8 5 5 | Déplacement Combat Discrétion Dextérité',
	'Shaman | 60 80 10 | 5 5 5 8 5 5 | Hargne Savoir Technique Sang-froid',
	'Sorcerer | 60 80 14 | 7 8 8 10 6 6 | Endurance Instinct Sang-froid Dextérité',
	'Warlock | 60 60 8 | 5 8 8 8 5 5 | Déplacement Combat Instinct Dextérité',
	'Warmaster | 90 50 8 | 5 5 5 8 5 5 | Force Endurance Aura Sang-froid',
	'Warrior | 100 40 8 | 7 10 10 12 7 7 | Déplacement Combat Tir Dextérité',
	'Wizard | 40 80 14 | 5 5 5 8 5 5 | Combat Instinct Aura Sang-froid'
]

export const CRESTS = "L'aigle, Le cerf, Le cheval, Le corbeau, Le dragon, le faucon, le lion, le loup, le sanglier, le serpent, le taureau, l'ours".split(', ').map((crest) => fuc(crest.trim()))

export const ARCANAS = [
	' | Le Fou |  | Chevalier véritable | Trouble mental',
	'I | Le Bateleur | Dame | Infatigable | Colérique',
	'II | La Papesse | Masque | Connaissance secrète | Curiosité maladive',
	"III | L'Impératrice | Machine | Mémoire efficace | Esprit de contradiction",
	"IV | L'Empereur | Dame | Magnétique | Présomptueux",
	'V | Le Pape | Machine | Forteresse spirituelle | Fanatique',
	"VI | L'Amoureux | Bête | Aisance | Graveleux",
	'VII | Le Chariot | Bête | Sûr de soi | Ennemi juré',
	'VIII | La Justice | Machine | Bon sens | Trop prudent',
	"IX | L'Ermite | Machine | Esprit d'acier | Solitaire",
	'X | La Roue-de-Fortune | Bête | Chanceux | Mauvaises intuitions',
	'XI | La Force | Chair | Dur à cuir | Forcené',
	'XII | Le Pendu | Chair | Code moral | Sacrifice total',
	"XIII | L'Arcane sans nom | Masque | Trompe la mort | Vétéran",
	'XIV | Tempérance | Chair | Guérison rapide | Immunité déficiente',
	'XV | Le Diable | Bête | Instinct animal | Brute',
	"XVI | La Maison-Dieu |  | Soif d'apprendre | Amnésique",
	"XVII | L'Étoile | Masque | Rêves prémonitoires | Cauchemars",
	'XVIII | La Lune | Masque | Menteur professionnel | Lunatique',
	'XIX | Le Soleil | Dame | Rayonnement | Égoïste',
	'XX | Le Jugement | Dame | Empathie | Prisonnier',
	'XXI | Le Monde | Chair | Créateur-né | Porte-malheur'
]

export const ARCHETYPES = [
	'Agent du Nodachi | Dextérité, Combat OU Tir',
	'Archétype libre | ' + CARACTERISTICS_LABELS.flatMap((labels) => labels).join(' OU '),
	'Artiste | Hargne, Aura',
	'Célébrité | Aura, Parole',
	'Citoyen | Technique, Discrétion',
	'Combattant | Combat, Tir',
	'Force de la nature | Force, Endurance',
	'Génie | Savoir, Technique',
	'Habitant des territoires libres | Savoir, Parole',
	'Hors-la-loi | Sang-froid, Discrétion',
	'Indépendant | Instinct, Perception',
	'Leader | Aura, Instinct',
	"Membre d'un service secret | Discrétion, Combat OU Tir",
	"Membre d'une société secrète | Savoir, Combat OU Tir",
	'Rebut | Déplacement, Endurance',
	'Religieux | Sang-froid, Hargne',
	'Survivant | Endurance, Hargne',
	'Voyageur | Déplacement, Perception'
]

export const ACHIEVEMENTS = [
	'Combat de titans | Chair | Chair',
	'Conception de la première méta-armure | Machine | Technique | Agent du Nodachi',
	'Construction de la première arche | Machine | Technique OU Savoir | Rebut ET Agent du Nodachi',
	'Création du Knight | Dame | Aura OU Combat',
	"Découverte d'une tache dissimulée | Masque | Perception OU Instinct",
	"Défenseur de l'art | Bête OU Dame | Hargne OU Sang-Froid",
	'En territoire ennemi | Bête | Bête',
	'Guide | Dame | Parole OU Perception',
	'Héros de guerre | Bête OU Machine | Combat OU Tir',
	"Le renouveau de l'espoir | Bête | Hargne OU Sang-Froid",
	'Sauveur | Masque OU Dame | Perception OU Sang-Froid',
	'Survivant de la peste rouge | Chair | Endurance OU Hargne',
	'Torturé dans les ténèbres | Chair | Endurance OU Force',
	'Tueur de ténèbres | Masque | Discrétion OU Perception',
	'Haut fait personnalisé | Chair OU Bête OU Machine OU Masque OU Dame'
]

export const WEAPONS = [
	'Pistolet de service | standard | 15 | distance | une main | Canon long, Canon raccourci, Chargeur et balles grappes, Chargeur et munitions explosives, Interface de guidage, Jumelage, Munitions drones, Munitions hyper vélocité, Munitions IEM, Munitions non létales, Pointeur laser, Revêtement Omega, Structure alpha, Système de refroidissement',
	"Shotgun escamotable | standard | 20 | distance | deux mains | Canon long, Canon raccourci, Chambre double, Chargeur et balles grappes, Chargeur et munitions explosives, Interface de guidage, Lunette intelligente, Munitions drones, Munitions hyper vélocité, Munitions IEM, Munitions non létales, Munitions subsoniques, Pointeur laser, Protection d'arme, Structure alpha, Système de refroidissement",
	"Fusil d'assaut | standard | 30 | distance | deux mains | Canon long, Canon raccourci, Chambre double, Chargeur et balles grappes, Chargeur et munitions explosives, Interface de guidage, Lunette intelligente, Munitions drones, Munitions hyper vélocité, Munitions IEM, Munitions non létales, Munitions subsoniques, Pointeur laser, Protection d'arme, Structure alpha, Système de refroidissement",
	'Pistolet mitrailleur | standard | 25 | distance | une main | Canon long, Canon raccourci, Chargeur et balles grappes, Chargeur et munitions explosives, Interface de guidage, Jumelage, Munitions drones, Munitions hyper vélocité, Munitions IEM, Munitions non létales, Munitions subsoniques, Pointeur laser, Structure alpha, Système de refroidissement',
	"Fusil de précision | standard | 40 | distance | deux mains | Canon long, Canon raccourci, Chambre double, Chargeur et balles grappes, Chargeur et munitions explosives, Interface de guidage, Lunette intelligente, Munitions drones, Munitions hyper vélocité, Munitions IEM, Munitions non létales, Munitions subsoniques, Pointeur laser, Protection d'arme, Structure alpha, Système de refroidissement",
	'Lance-grenade léger | standard | 40 | distance | une main | Canon long, Interface de guidage, Jumelage, Munitions drones, Munitions hyper vélocité, Pointeur laser, Structure alpha',
	'Morgenstern | standard | 15 | contact | une main | Arabesques iridescentes, Arme azurine, Arme rouge sang, Armure gravée, Blason du chevalier, Bouclier gravé, Chêne sculpté, Chromée avec lignes lumineuses et colorées, Code du Knight gravé, Crâne rieur gravé, Faucheuse gravée, Faucon et plumes luminescentes, Flammes stylisées, Griffures gravées, Masque brisé sculpté, Rouages cassés gravés, Sillons formant des lignes et des flèches, Agressive, Barbelée, Connectée, Électrifiée, Indestructible, Jumelle, Lumineuse, Protectrice, Sur mesure, Sœur',
	'Marteau-épieu | standard | 10 | contact | une main | Arabesques iridescentes, Arme azurine, Arme rouge sang, Armure gravée, Blason du chevalier, Bouclier gravé, Chêne sculpté, Chromée avec lignes lumineuses et colorées, Code du Knight gravé, Crâne rieur gravé, Faucheuse gravée, Faucon et plumes luminescentes, Flammes stylisées, Griffures gravées, Masque brisé sculpté, Rouages cassés gravés, Sillons formant des lignes et des flèches, Agressive, Barbelée, Connectée, Électrifiée, Indestructible, Jumelle, Protectrice, Sournoise, Sur mesure, Sœur',
	'Couteau de combat | standard | 15 | contact | une main | Arabesques iridescentes, Arme azurine, Arme rouge sang, Armure gravée, Blason du chevalier, Bouclier gravé, Chêne sculpté, Chromée avec lignes lumineuses et colorées, Code du Knight gravé, Crâne rieur gravé, Faucheuse gravée, Faucon et plumes luminescentes, Flammes stylisées, Griffures gravées, Masque brisé sculpté, Rouages cassés gravés, Sillons formant des lignes et des flèches, Agressive, Barbelée, Connectée, Électrifiée, Indestructible, Jumelle, Protectrice, Sur mesure, Sœur',
	'Ceste lourd | standard | 20 | contact | une main | Arabesques iridescentes, Arme azurine, Arme rouge sang, Armure gravée, Blason du chevalier, Bouclier gravé, Chêne sculpté, Chromée avec lignes lumineuses et colorées, Code du Knight gravé, Crâne rieur gravé, Faucheuse gravée, Faucon et plumes luminescentes, Flammes stylisées, Griffures gravées, Masque brisé sculpté, Rouages cassés gravés, Sillons formant des lignes et des flèches, Agressive, Barbelée, Connectée, Électrifiée, Indestructible, Jumelle, Lumineuse, Protectrice, Sur mesure, Sœur',
	'Épée bâtarde | standard | 30 | contact | deux mains | Arabesques iridescentes, Arme azurine, Arme rouge sang, Armure gravée, Blason du chevalier, Bouclier gravé, Chêne sculpté, Chromée avec lignes lumineuses et colorées, Code du Knight gravé, Crâne rieur gravé, Faucheuse gravée, Faucon et plumes luminescentes, Flammes stylisées, Griffures gravées, Masque brisé sculpté, Rouages cassés gravés, Sillons formant des lignes et des flèches, Agressive, Barbelée, Connectée, Électrifiée, Indestructible, Jumelle, Lumineuse, Protectrice, Sur mesure, Sœur',
	'Bouclier amovible | standard | 20 | contact | une main | Arabesques iridescentes, Arme azurine, Arme rouge sang, Armure gravée, Blason du chevalier, Bouclier gravé, Chêne sculpté, Chromée avec lignes lumineuses et colorées, Code du Knight gravé, Crâne rieur gravé, Faucheuse gravée, Flammes stylisées, Griffures gravées, Masque brisé sculpté, Rouages cassés gravés, Sillons formant des lignes et des flèches, Agressive, Barbelée, Connectée, Électrifiée, Indestructible, Jumelle, Protectrice, Sournoise, Sur mesure, Sœur',
	"Lance-missile | avancé | 15 | distance | lourde | Canon long, Chargeur et balles grappes, Chargeur et munitions explosives, Interface de guidage, Lunette intelligente, Munitions drones, Munitions IEM, Munitions non létales, Munitions subsoniques, Pointeur laser, Protection d'arme, Structure alpha",
	"Mitrailleuse lourde | avancé | 45 | distance | lourde | Canon long, Canon raccourci, Chambre double, Chargeur et balles grappes, Chargeur et munitions explosives, Interface de guidage, Lunette intelligente, Munitions drones, Munitions IEM, Munitions non létales, Munitions subsoniques, Pointeur laser, Protection d'arme, Structure alpha",
	"Pistolet d'infiltration | avancé | 50 | distance | une main | Canon long, Canon raccourci, Chargeur et balles grappes, Chargeur et munitions explosives, Jumelage, Munitions drones, Munitions hyper vélocité, Munitions non létales, Munitions subsoniques, Pointeur laser, Revêtement Omega, Structure alpha, Système de refroidissement",
	"Lance-grenade lourd | avancé | 60 | distance | lourde | Canon long, Interface de guidage, Lunette intelligente, Munitions drones, Pointeur laser, Protection d'arme, Structure alpha",
	"Fusil anti-matériel | avancé | 60 | distance | lourde | Canon long, Canon raccourci, Chambre double, Chargeur et balles grappes, Chargeur et munitions explosives, Lunette intelligente, Munitions drones, Munitions IEM, Munitions non létales, Munitions subsoniques, Pointeur laser, Protection d'arme, Structure alpha",
	"Shotgun automatique | avancé | 70 | distance | lourde | Canon long, Chambre double, Chargeur et balles grappes, Chargeur et munitions explosives, Interface de guidage, Lunette intelligente, Munitions drones, Munitions IEM, Munitions non létales, Munitions subsoniques, Pointeur laser, Protection d'arme, Structure alpha",
	'Ceste répulsif | avancé | 30 | contact | une main | Arabesques iridescentes, Arme azurine, Arme rouge sang, Armure gravée, Blason du chevalier, Bouclier gravé, Chêne sculpté, Chromée avec lignes lumineuses et colorées, Code du Knight gravé, Crâne rieur gravé, Faucheuse gravée, Faucon et plumes luminescentes, Flammes stylisées, Griffures gravées, Masque brisé sculpté, Rouages cassés gravés, Sillons formant des lignes et des flèches, Agressive, Barbelée, Connectée, Indestructible, Jumelle, Lumineuse, Protectrice, Sournoise, Sur mesure, Sœur',
	'Épée longue | avancé | 35 | contact | deux mains | Arabesques iridescentes, Arme azurine, Arme rouge sang, Armure gravée, Blason du chevalier, Bouclier gravé, Chêne sculpté, Chromée avec lignes lumineuses et colorées, Code du Knight gravé, Crâne rieur gravé, Faucheuse gravée, Faucon et plumes luminescentes, Flammes stylisées, Griffures gravées, Masque brisé sculpté, Rouages cassés gravés, Sillons formant des lignes et des flèches, Agressive, Barbelée, Connectée, Indestructible, Lumineuse, Protectrice, Sur mesure',
	'Dague | avancé | 40 | contact | une main | Arabesques iridescentes, Arme azurine, Arme rouge sang, Armure gravée, Blason du chevalier, Bouclier gravé, Chêne sculpté, Chromée avec lignes lumineuses et colorées, Code du Knight gravé, Crâne rieur gravé, Faucheuse gravée, Faucon et plumes luminescentes, Flammes stylisées, Griffures gravées, Masque brisé sculpté, Rouages cassés gravés, Sillons formant des lignes et des flèches, Agressive, Barbelée, Indestructible, Jumelle, Protectrice, Sur mesure, Sœur',
	'Bélier à piston | avancé | 40 | contact | une main | Arabesques iridescentes, Arme azurine, Arme rouge sang, Armure gravée, Blason du chevalier, Bouclier gravé, Chêne sculpté, Chromée avec lignes lumineuses et colorées, Code du Knight gravé, Crâne rieur gravé, Faucheuse gravée, Faucon et plumes luminescentes, Flammes stylisées, Griffures gravées, Masque brisé sculpté, Rouages cassés gravés, Sillons formant des lignes et des flèches, Agressive, Indestructible, Jumelle, Lumineuse, Protectrice, Sur mesure, Sœur',
	'Matraques électriques | avancé | 40 | contact | deux mains | Arabesques iridescentes, Arme azurine, Arme rouge sang, Armure gravée, Blason du chevalier, Bouclier gravé, Chêne sculpté, Chromée avec lignes lumineuses et colorées, Code du Knight gravé, Crâne rieur gravé, Faucheuse gravée, Faucon et plumes luminescentes, Flammes stylisées, Griffures gravées, Masque brisé sculpté, Rouages cassés gravés, Sillons formant des lignes et des flèches, Agressive, Allégée, Connectée, Indestructible, Lumineuse, Massive, Protectrice, Sournoise, Sur mesure',
	'Sabre brûlant | avancé | 40 | contact | une main | Arabesques iridescentes, Arme azurine, Arme rouge sang, Armure gravée, Blason du chevalier, Bouclier gravé, Chêne sculpté, Chromée avec lignes lumineuses et colorées, Code du Knight gravé, Crâne rieur gravé, Faucheuse gravée, Flammes stylisées, Griffures gravées, Masque brisé sculpté, Rouages cassés gravés, Sillons formant des lignes et des flèches, Agressive, Connectée, Indestructible, Jumelle, Protectrice, Sur mesure, Sœur',
	'Targe amovible | avancé | 45 | contact | une main | Arabesques iridescentes, Arme azurine, Arme rouge sang, Armure gravée, Blason du chevalier, Bouclier gravé, Chêne sculpté, Chromée avec lignes lumineuses et colorées, Code du Knight gravé, Crâne rieur gravé, Faucheuse gravée, Faucon et plumes luminescentes, Flammes stylisées, Griffures gravées, Masque brisé sculpté, Rouages cassés gravés, Sillons formant des lignes et des flèches, Agressive, Barbelée, Connectée, Indestructible, Jumelle, Lumineuse, Protectrice, Sournoise, Sur mesure, Sœur',
	'Fléau répulsif | avancé | 55 | contact | une main | Arabesques iridescentes, Arme azurine, Arme rouge sang, Armure gravée, Blason du chevalier, Bouclier gravé, Chêne sculpté, Chromée avec lignes lumineuses et colorées, Code du Knight gravé, Crâne rieur gravé, Faucheuse gravée, Faucon et plumes luminescentes, Flammes stylisées, Griffures gravées, Masque brisé sculpté, Rouages cassés gravés, Sillons formant des lignes et des flèches, Agressive, Barbelée, Connectée, Indestructible, Jumelle, Lumineuse, Protectrice, Sournoise, Sur mesure, Sœur',
	'Torche plasma | avancé | 50 | contact | deux mains | Arabesques iridescentes, Arme azurine, Arme rouge sang, Armure gravée, Blason du chevalier, Bouclier gravé, Chêne sculpté, Chromée avec lignes lumineuses et colorées, Code du Knight gravé, Crâne rieur gravé, Faucheuse gravée, Faucon et plumes luminescentes, Flammes stylisées, Griffures gravées, Masque brisé sculpté, Rouages cassés gravés, Sillons formant des lignes et des flèches, Agressive, Allégée, Connectée, Électrifiée, Indestructible, Massive, Protectrice, Sournoise, Sur mesure',
	'Revolver lourd | rare | 70 | distance | une main | Canon long, Canon raccourci, Chargeur et balles grappes, Chargeur et munitions explosives, Interface de guidage, Jumelage, Munitions drones, Munitions hyper vélocité, Munitions IEM, Munitions non létales, Munitions subsoniques, Pointeur laser, Structure alpha, Système de refroidissement',
	"Fusil laser | rare | 70 | distance | deux mains | Canon long, Canon raccourci, Lunette intelligente, Pointeur laser, Protection d'arme, Structure alpha, Système de refroidissement",
	"Arbalète magnétique | rare | 70 | distance | deux mains | Canon long, Canon raccourci, Lunette intelligente, Munitions drones, Munitions hyper vélocité, Munitions subsoniques, Pointeur laser, Protection d'arme, Revêtement Omega, Structure alpha",
	"Shotgun auto. lourd | rare | 80 | distance | lourde | Canon long, Chambre double, Chargeur et balles grappes, Chargeur et munitions explosives, Interface de guidage, Lunette intelligente, Munitions drones, Munitions IEM, Munitions non létales, Munitions subsoniques, Pointeur laser, Protection d'arme, Structure alpha",
	"Lance-flammes | rare | 100 | distance | lourde | Canon long, Protection d'arme, Structure alpha",
	"Railgun | rare | 90 | distance | deux mains | Canon long, Canon raccourci, Chambre double, Chargeur et balles grappes, Chargeur et munitions explosives, Interface de guidage, Lunette intelligente, Munitions drones, Munitions hyper vélocité, Munitions IEM, Munitions non létales, Munitions subsoniques, Pointeur laser, Protection d'arme, Structure alpha, Système de refroidissement",
	'Hache à réaction | rare | 60 | contact | une main | Arabesques iridescentes, Arme azurine, Arme rouge sang, Armure gravée, Blason du chevalier, Bouclier gravé, Chêne sculpté, Chromée avec lignes lumineuses et colorées, Code du Knight gravé, Crâne rieur gravé, Faucheuse gravée, Faucon et plumes luminescentes, Flammes stylisées, Griffures gravées, Masque brisé sculpté, Rouages cassés gravés, Sillons formant des lignes et des flèches, Agressive, Barbelée, Électrifiée, Indestructible, Jumelle, Lumineuse, Protectrice, Sur mesure, Sœur',
	'Pavois | rare | 60 | contact | une main | Arabesques iridescentes, Arme azurine, Arme rouge sang, Armure gravée, Blason du chevalier, Bouclier gravé, Chêne sculpté, Chromée avec lignes lumineuses et colorées, Code du Knight gravé, Crâne rieur gravé, Faucheuse gravée, Faucon et plumes luminescentes, Flammes stylisées, Griffures gravées, Masque brisé sculpté, Rouages cassés gravés, Sillons formant des lignes et des flèches, Agressive, Barbelée, Connectée, Indestructible, Jumelle, Lumineuse, Protectrice, Sur mesure, Sœur',
	'Épée lumière | rare | 70 | contact | deux mains | Arabesques iridescentes, Arme azurine, Arme rouge sang, Armure gravée, Blason du chevalier, Bouclier gravé, Chêne sculpté, Chromée avec lignes lumineuses et colorées, Code du Knight gravé, Crâne rieur gravé, Faucheuse gravée, Flammes stylisées, Griffures gravées, Masque brisé sculpté, Rouages cassés gravés, Sillons formant des lignes et des flèches, Agressive, Barbelée, Électrifiée, Indestructible, Jumelle, Protectrice, Sur mesure, Sœur',
	'Épée cinétique | rare | 70 | contact | une main | Arabesques iridescentes, Arme azurine, Arme rouge sang, Armure gravée, Blason du chevalier, Bouclier gravé, Chêne sculpté, Chromée avec lignes lumineuses et colorées, Code du Knight gravé, Crâne rieur gravé, Faucheuse gravée, Faucon et plumes luminescentes, Flammes stylisées, Griffures gravées, Masque brisé sculpté, Rouages cassés gravés, Sillons formant des lignes et des flèches, Agressive, Assassine, Barbelée, Indestructible, Jumelle, Lumineuse, Protectrice, Sur mesure',
	'Masse magnétique | rare | 90 | contact | lourde | Arabesques iridescentes, Arme azurine, Arme rouge sang, Armure gravée, Blason du chevalier, Bouclier gravé, Chêne sculpté, Chromée avec lignes lumineuses et colorées, Code du Knight gravé, Crâne rieur gravé, Faucheuse gravée, Faucon et plumes luminescentes, Flammes stylisées, Griffures gravées, Masque brisé sculpté, Rouages cassés gravés, Sillons formant des lignes et des flèches, Agressive, Barbelée, Connectée, Indestructible, Protectrice, Sur mesure',
	'Ceste de fracture | rare | 80 | contact | une main | Arabesques iridescentes, Arme azurine, Arme rouge sang, Armure gravée, Blason du chevalier, Bouclier gravé, Chêne sculpté, Chromée avec lignes lumineuses et colorées, Code du Knight gravé, Crâne rieur gravé, Faucheuse gravée, Faucon et plumes luminescentes, Flammes stylisées, Griffures gravées, Masque brisé sculpté, Rouages cassés gravés, Sillons formant des lignes et des flèches, Agressive, Connectée, Indestructible, Jumelle, Lumineuse, Protectrice, Sournoise, Sur mesure, Sœur',
	'Épée sonique | rare | 100 | contact | lourde | Arabesques iridescentes, Arme azurine, Arme rouge sang, Armure gravée, Blason du chevalier, Bouclier gravé, Chêne sculpté, Chromée avec lignes lumineuses et colorées, Code du Knight gravé, Crâne rieur gravé, Faucheuse gravée, Faucon et plumes luminescentes, Flammes stylisées, Griffures gravées, Masque brisé sculpté, Rouages cassés gravés, Sillons formant des lignes et des flèches, Agressive, Barbelée, Indestructible, Lumineuse, Massive, Protectrice, Sournoise, Sur mesure',
	'Matraque taser | standard | 25 | contact | deux mains | Arabesques iridescentes, Arme azurine, Arme rouge sang, Armure gravée, Blason du chevalier, Bouclier gravé, Chêne sculpté, Chromée avec lignes lumineuses et colorées, Code du Knight gravé, Crâne rieur gravé, Faucheuse gravée, Faucon et plumes luminescentes, Flammes stylisées, Griffures gravées, Masque brisé sculpté, Rouages cassés gravés, Sillons formant des lignes et des flèches, Agressive, Allégée, Barbelée, Connectée, Indestructible, Lumineuse, Massive, Protectrice, Sournoise, Sur mesure',
	'Pistolet connecté | standard | 20 | distance | une main | Canon long, Canon raccourci, Chargeur et balles grappes, Chargeur et munitions explosives, Interface de guidage, Jumelage, Munitions drones, Munitions hyper vélocité, Munitions IEM, Munitions non létales, Munitions subsoniques, Pointeur laser, Structure alpha, Système de refroidissement',
	'Pistolet de précision | standard | 20 | distance | une main | Canon long, Canon raccourci, Chargeur et balles grappes, Chargeur et munitions explosives, Interface de guidage, Jumelage, Munitions drones, Munitions hyper vélocité, Munitions IEM, Munitions non létales, Munitions subsoniques, Pointeur laser, Structure alpha, Système de refroidissement',
	'Hache de combat | standard | 30 | contact | lourde | Arabesques iridescentes, Arme azurine, Arme rouge sang, Armure gravée, Blason du chevalier, Bouclier gravé, Chêne sculpté, Chromée avec lignes lumineuses et colorées, Code du Knight gravé, Crâne rieur gravé, Faucheuse gravée, Faucon et plumes luminescentes, Flammes stylisées, Griffures gravées, Masque brisé sculpté, Rouages cassés gravés, Sillons formant des lignes et des flèches, Agressive, Barbelée, Connectée, Électrifiée, Indestructible, Lumineuse, Protectrice, Sur mesure',
	'Lance perforante à piston | standard | 30 | contact | deux mains | Arabesques iridescentes, Arme azurine, Arme rouge sang, Armure gravée, Blason du chevalier, Bouclier gravé, Chêne sculpté, Chromée avec lignes lumineuses et colorées, Code du Knight gravé, Crâne rieur gravé, Faucheuse gravée, Faucon et plumes luminescentes, Flammes stylisées, Griffures gravées, Masque brisé sculpté, Rouages cassés gravés, Sillons formant des lignes et des flèches, Agressive, Allégée, Assassine, Barbelée, Connectée, Électrifiée, Indestructible, Lumineuse, Massive, Protectrice, Sournoise, Sur mesure',
	'Shotgun automatique léger | avancé | 50 | distance | une main | Canon long, Chargeur et balles grappes, Chargeur et munitions explosives, Interface de guidage, Jumelage, Munitions drones, Munitions hyper vélocité, Munitions IEM, Munitions non létales, Munitions subsoniques, Pointeur laser, Structure alpha, Système de refroidissement',
	'Baton de combat | avancé | 30 | contact | deux mains | Arabesques iridescentes, Arme azurine, Arme rouge sang, Armure gravée, Blason du chevalier, Bouclier gravé, Chêne sculpté, Chromée avec lignes lumineuses et colorées, Code du Knight gravé, Crâne rieur gravé, Faucheuse gravée, Faucon et plumes luminescentes, Flammes stylisées, Griffures gravées, Masque brisé sculpté, Rouages cassés gravés, Sillons formant des lignes et des flèches, Agressive, Allégée, Barbelée, Connectée, Indestructible, Lumineuse, Protectrice, Sur mesure',
	'Cimeterre cinétique | avancé | 40 | contact | deux mains | Arabesques iridescentes, Arme azurine, Arme rouge sang, Armure gravée, Blason du chevalier, Bouclier gravé, Chêne sculpté, Chromée avec lignes lumineuses et colorées, Code du Knight gravé, Crâne rieur gravé, Faucheuse gravée, Faucon et plumes luminescentes, Flammes stylisées, Griffures gravées, Masque brisé sculpté, Rouages cassés gravés, Sillons formant des lignes et des flèches, Agressive, Allégée, Assassine, Barbelée, Connectée, Électrifiée, Indestructible, Lumineuse, Protectrice, Sur mesure',
	'Ceste shotgun | avancé | 50 | contact | une main | Arabesques iridescentes, Arme azurine, Arme rouge sang, Armure gravée, Blason du chevalier, Bouclier gravé, Chêne sculpté, Chromée avec lignes lumineuses et colorées, Code du Knight gravé, Crâne rieur gravé, Faucheuse gravée, Faucon et plumes luminescentes, Flammes stylisées, Griffures gravées, Masque brisé sculpté, Rouages cassés gravés, Sillons formant des lignes et des flèches, Agressive, Connectée, Indestructible, Jumelle, Lumineuse, Protectrice, Sur mesure, Sœur',
	'Trident mâchoire | avancé | 50 | contact | deux mains | Arabesques iridescentes, Arme azurine, Arme rouge sang, Armure gravée, Blason du chevalier, Bouclier gravé, Chêne sculpté, Chromée avec lignes lumineuses et colorées, Code du Knight gravé, Crâne rieur gravé, Faucheuse gravée, Faucon et plumes luminescentes, Flammes stylisées, Griffures gravées, Masque brisé sculpté, Rouages cassés gravés, Sillons formant des lignes et des flèches, Agressive, Allégée, Assassine, Connectée, Indestructible, Lumineuse, Protectrice, Sur mesure',
	"Paire de pistolets ouragan | rare | 70 | distance | deux mains | Canon long, Canon raccourci, Chambre double, Chargeur et balles grappes, Chargeur et munitions explosives, Interface de guidage, Lunette intelligente, Munitions drones, Munitions hyper vélocité, Munitions IEM, Munitions non létales, Munitions subsoniques, Pointeur laser, Protection d'arme, Revêtement Omega, Structure alpha, Système de refroidissement",
	'Stylet thermique | rare | 65 | contact | une main | Arabesques iridescentes, Arme azurine, Arme rouge sang, Armure gravée, Blason du chevalier, Bouclier gravé, Chêne sculpté, Chromée avec lignes lumineuses et colorées, Code du Knight gravé, Crâne rieur gravé, Faucheuse gravée, Faucon et plumes luminescentes, Flammes stylisées, Griffures gravées, Masque brisé sculpté, Rouages cassés gravés, Sillons formant des lignes et des flèches, Agressive, Barbelée, Connectée, Indestructible, Jumelle, Protectrice, Sur mesure, Sœur',
	'Lance thermique | rare | 90 | contact | deux mains | Arabesques iridescentes, Arme azurine, Arme rouge sang, Armure gravée, Blason du chevalier, Bouclier gravé, Chêne sculpté, Chromée avec lignes lumineuses et colorées, Code du Knight gravé, Crâne rieur gravé, Faucheuse gravée, Flammes stylisées, Griffures gravées, Masque brisé sculpté, Rouages cassés gravés, Sillons formant des lignes et des flèches, Agressive, Allégée, Barbelée, Connectée, Électrifiée, Indestructible, Protectrice, Sur mesure',
	'Chaîne tronçonneuse | rare | 100 | contact | deux mains | Arabesques iridescentes, Arme azurine, Arme rouge sang, Armure gravée, Blason du chevalier, Bouclier gravé, Chêne sculpté, Chromée avec lignes lumineuses et colorées, Code du Knight gravé, Crâne rieur gravé, Faucheuse gravée, Faucon et plumes luminescentes, Flammes stylisées, Griffures gravées, Masque brisé sculpté, Rouages cassés gravés, Sillons formant des lignes et des flèches, Agressive, Allégée, Assassine, Connectée, Électrifiée, Indestructible, Lumineuse, Protectrice, Sur mesure',
	"Fusil sonique | avancé | 30 | distance | deux mains | Canon long, Canon raccourci, Chargeur et balles grappes, Chargeur et munitions explosives, Lunette intelligente, Munitions drones, Munitions hyper vélocité, Munitions IEM, Munitions non létales, Munitions subsoniques, Pointeur laser, Protection d'arme, Structure alpha, Système de refroidissement",
	"Canon à concussion | rare | 60 | distance | lourde | Canon long, Canon raccourci, Chargeur et balles grappes, Chargeur et munitions explosives, Lunette intelligente, Munitions drones, Munitions IEM, Munitions non létales, Munitions subsoniques, Pointeur laser, Protection d'arme, Structure alpha",
	'Ceste à concussion | avancé | 40 | contact | une main | Arabesques iridescentes, Arme azurine, Arme rouge sang, Armure gravée, Blason du chevalier, Bouclier gravé, Chêne sculpté, Chromée avec lignes lumineuses et colorées, Code du Knight gravé, Faucheuse gravée, Faucon et plumes luminescentes, Flammes stylisées, Griffures gravées, Masque brisé sculpté, Rouages cassés gravés, Sillons formant des lignes et des flèches, Agressive, Barbelée, Connectée, Indestructible, Jumelle, Lumineuse, Protectrice, Sournoise, Sur mesure, Sœur',
	'Fusil UV | avancé | 40 | distance | deux mains | Canon long, Canon raccourci, Chargeur et balles grappes, Chargeur et munitions explosives, Jumelage, Munitions drones, Munitions hyper vélocité, Munitions IEM, Munitions non létales, Munitions subsoniques, Pointeur laser, Structure alpha',
	"Canon UV | rare | 80 | distance | lourde | Canon long, Canon raccourci, Chambre double, Chargeur et balles grappes, Chargeur et munitions explosives, Lunette intelligente, Munitions drones, Munitions IEM, Munitions non létales, Munitions subsoniques, Pointeur laser, Protection d'arme, Structure alpha",
	'Lance de lumière | avancé | 60 | contact | deux mains | Arabesques iridescentes, Arme azurine, Arme rouge sang, Armure gravée, Blason du chevalier, Bouclier gravé, Chêne sculpté, Chromée avec lignes lumineuses et colorées, Code du Knight gravé, Crâne rieur gravé, Faucheuse gravée, Flammes stylisées, Griffures gravées, Masque brisé sculpté, Rouages cassés gravés, Sillons formant des lignes et des flèches, Agressive, Allégée, Barbelée, Connectée, Électrifiée, Indestructible, Jumelle, Protectrice, Sur mesure, Sœur',
	"Fusil Longbow | standard | 0 | distance | lourde | Effets suppl., Profile de base, Suppression lourd, -2PE par effet de liste, Canon long, Canon raccourci, Chambre double, Chargeur et balles grappes, Chargeur et munitions explosives, Interface de guidage, Lunette intelligente, Munitions drones, Munitions IEM, Munitions non létales, Munitions subsoniques, Pointeur laser, Protection d'arme, Structure alpha"
]

export const MODULES = [
	'Blindage amélioré niv. 1 | Amélioration | Avancé | 30',
	'Blindage amélioré niv. 2 | Amélioration | Avancé | 30',
	'Champ de force amélioré niv. 1 | Amélioration | Avancé | 40',
	'Champ de force amélioré niv. 2 | Amélioration | Avancé | 40',
	'Énergie améliorée niv. 1 | Amélioration | Avancé | 30',
	'Énergie améliorée niv. 2 | Amélioration | Avancé | 30',
	'Blindage amélioré niv. 3 | Amélioration | Rare | 30',
	'Champ de force amélioré niv. 3 | Amélioration | Rare | 40',
	'Énergie améliorée niv. 3 | Amélioration | Rare | 30',
	'Tourelle automatisée | Automatisé | Standard | 10',
	"Tourelle d'épaule | Automatisé | Avancé | 30",
	'Attaque sur casque niv. 1 | Contact | Standard | 10 | 1 0 0 0 0 0',
	'Attaque sur casque niv. 2 | Contact | Standard | 20',
	'Griffes de combat niv. 1 | Contact | Standard | 10 | 0 0 1 0 0 0 | 0 1 0 0 0 0',
	'Griffes de combat niv. 2 | Contact | Standard | 10',
	'Lame de bras niv. 1 | Contact | Standard | 10 | 0 0 2 0 0 0 | 0 2 0 0 0 0',
	'Lame de bras niv. 2 | Contact | Standard | 10',
	'Amplification de frappe niv. 1 | Contact | Avancé | 20 | 0 0 2 0 0 0 | 0 2 0 0 0 0',
	'Amplification de frappe niv. 2 | Contact | Avancé | 20',
	'Amplification de frappe niv. 3 | Contact | Avancé | 30',
	'Dard niv. 1 | Contact | Avancé | 20 | 0 0 1 0 0 0 | 0 1 0 0 0 0',
	'Dard niv. 2 | Contact | Avancé | 15',
	'Dard niv. 3 | Contact | Avancé | 15',
	'Découpeur | Contact | Avancé | 50 | 0 0 2 0 0 0 | 0 2 0 0 0 0',
	'Attaque portée niv. 1 | Contact | Rare | 30 | 0 1 1 0 0 0',
	'Attaque portée niv. 2 | Contact | Rare | 40',
	'Griffes de combat niv. 3 | Contact | Rare | 30',
	'Lame de bras niv. 3 | Contact | Rare | 30',
	'Nova niv. 1 | Contact | Rare | 20 | 0 0 0 2 0 0',
	'Nova niv. 2 | Contact | Rare | 20',
	'Nova niv. 3 | Contact | Rare | 20',
	'Option grenades intelligentes avancées | Distance | Standard | 25',
	'Attaque non létale niv. 1 | Distance | Standard | 10 | 0 0 1 0 0 0 | 0 1 0 0 0 0',
	'Attaque non létale niv. 2 | Distance | Standard | 10',
	'Attaque non létale niv. 3 | Distance | Standard | 10',
	'Canon Balder | Distance | Standard | 30 | 0 0 2 0 0 0 | 0 2 0 0 0 0',
	'Grappin | Distance | Standard | 20 | 0 0 1 0 0 0 | 0 1 0 0 0 0',
	'Arme de torse niv. 1 | Distance | Avancé | 20 | 0 0 0 2 0 0',
	'Arme de torse niv. 2 | Distance | Avancé | 30',
	'Canon de bras niv. 1 | Distance | Avancé | 30 | 0 0 2 0 0 0 | 0 2 0 0 0 0',
	'Canon de bras niv. 2 | Distance | Avancé | 30',
	'Canon défensif niv. 1 | Distance | Avancé | 30 | 0 0 0 2 0 0',
	'Canon défensif niv. 2 | Distance | Avancé | 20',
	'Canon défensif niv. 3 | Distance | Avancé | 20',
	'Pod missile | Distance | Avancé | 30 | 0 0 0 2 0 0 | 0 0 2 0 0 0 | 0 2 0 0 0 0',
	'Pod roquette niv. 1 | Distance | Avancé | 30 | 0 0 0 2 0 0 | 0 0 2 0 0 0 | 0 2 0 0 0 0',
	'Pod roquette niv. 2 | Distance | Avancé | 20',
	'Pod roquette niv. 3 | Distance | Rare | 30',
	'Canon de bras niv. 3 | Distance | Rare | 30',
	'Canon Sol Invictus | Distance | Rare | 80 | 0 0 0 4 0 0 | 0 0 3 1 0 0 | 0 3 0 1 0 0',
	'Flash | Défense | Standard | 15 | 1 0 0 0 0 0',
	'Fumigène | Défense | Standard | 10 | 0 0 0 1 0 0',
	'Canon TNL niv. 1 | Défense | Avancé | 10 | 0 0 2 0 0 0 | 0 2 0 0 0 0',
	'Canon TNL niv. 2 | Défense | Avancé | 10',
	'Canon TNL niv. 3 | Défense | Avancé | 10',
	'Contre-mesures niv. 1 | Défense | Avancé | 20 | 0 0 0 2 0 0',
	'Contre-mesures niv. 2 | Défense | Avancé | 10',
	'Contre-mesures niv. 3 | Défense | Avancé | 10',
	'Accumulation de force niv. 1 | Défense | Rare | 50 | 0 1 1 1 1 1',
	'Accumulation de force niv. 2 | Défense | Rare | 50',
	'Blindage drone niv. 1 | Défense | Rare | 30 | 0 0 0 2 0 0',
	'Blindage drone niv. 2 | Défense | Rare | 30',
	'Interception niv. 1 | Défense | Rare | 50 | 0 1 1 1 1 1',
	'Interception niv. 2 | Défense | Rare | 50',
	'Course niv. 1 | Déplacement | Standard | 20 | 0 0 0 0 1 1',
	'Course niv. 2 | Déplacement | Standard | 20',
	'Course niv. 3 | Déplacement | Standard | 30',
	'Moto steed | Déplacement | Standard | 30 | 0 0 0 1 0 0',
	'Saut niv. 1 | Déplacement | Standard | 10 | 0 0 0 0 1 1',
	'Saut niv. 2 | Déplacement | Standard | 20',
	'Saut niv. 3 | Déplacement | Standard | 20',
	'Wingsuit | Déplacement | Standard | 10 | 0 0 0 1 0 0',
	'Adhérence niv. 1 | Déplacement | Avancé | 20 | 0 2 2 0 2 2',
	'Adhérence niv. 2 | Déplacement | Avancé | 50',
	'Déplacement silencieux niv. 1 | Déplacement | Avancé | 10 | 0 0 0 1 1 1',
	'Déplacement silencieux niv. 2 | Déplacement | Avancé | 20',
	'Module de phase niv. 1 | Déplacement | Rare | 50 | 1 1 1 2 1 1',
	'Module de phase niv. 2 | Déplacement | Rare | 50',
	'Téléportation | Déplacement | Rare | 100 | 1 2 2 3 2 2',
	'Vol niv. 1 | Déplacement | Rare | 30 | 1 2 2 2 2 2',
	'Vol niv. 2 | Déplacement | Rare | 30',
	'Vol niv. 3 | Déplacement | Rare | 50',
	'Accompagnement tactique | Tactique | Standard | 20 | 1 0 0 0 0 0',
	'Analyse des adversaires | Tactique | Standard | 30 | 2 0 0 0 0 0',
	'Caméraman | Tactique | Standard | 10 | 1 0 0 0 0 0',
	'Relais satellite niv. 1 | Tactique | Standard | 10 | 0 0 0 1 0 0 | 1 0 0 0 0 0',
	'Relais satellite niv. 2 | Tactique | Standard | 10',
	'Relais satellite niv. 3 | Tactique | Standard | 10',
	'Relais TacCom | Tactique | Standard | 20 | 0 0 0 1 0 0 | 1 0 0 0 0 0',
	'Banner | Tactique | Avancé | 10 | 0 0 0 1 0 0 | 1 0 0 0 0 0',
	'Billes sonar | Tactique | Avancé | 20 | 0 0 2 0 0 0 | 0 2 0 0 0 0',
	'Champ de force portatif niv. 1 | Tactique | Avancé | 15 | 0 0 0 1 0 0 | 0 0 1 0 0 0 | 0 1 0 0 0 0',
	'Champ de force portatif niv. 2 | Tactique | Avancé | 15',
	'Champ de force portatif niv. 3 | Tactique | Avancé | 15',
	'Diffuseur de nanoM niv. 1 | Tactique | Avancé | 20 | 0 0 0 1 0 0',
	'Diffuseur de nanoM niv. 2 | Tactique | Avancé | 10',
	"Drone d'espionnage | Tactique | Avancé | 20 | 0 0 0 1 0 0",
	'Drone pour nods | Tactique | Avancé | 30 | 0 0 0 1 0 0',
	'Fléchettes incandescentes niv. 1 | Tactique | Avancé | 20 | 0 0 0 1 0 0 | 0 0 1 0 0 0 | 0 1 0 0 0 0 | 1 0 0 0 0 0',
	'Fléchettes incandescentes niv. 2 | Tactique | Avancé | 25',
	'Fléchettes incandescentes niv. 3 | Tactique | Avancé | 25',
	'Grenade intelligente supplémentaire | Tactique | Avancé | 15 | 0 0 0 1 0 0',
	'Pack de nods supplémentaires | Tactique | Avancé | 25 | 0 0 0 1 0 0 | 0 0 1 0 0 0 | 0 1 0 0 0 0',
	'Camouflage optique | Tactique | Rare | 60 | 1 1 1 1 1 1',
	'Capsule | Tactique | Rare | 25 | 0 0 0 1 0 0',
	'Couvert portatif niv. 1 | Tactique | Rare | 20 | 0 0 0 2 0 0',
	'Couvert portatif niv. 2 | Tactique | Rare | 10',
	'Couvert portatif niv. 3 | Tactique | Rare | 10',
	'Déguisement | Tactique | Rare | 50 | 1 1 1 1 1 1',
	'Déploiement pour méga-armure | Tactique | Rare | 60 | 1 1 1 1 1 1',
	'Wolfpack | Tactique | Rare | 10 | 0 0 0 1 0 0 | 1 0 0 0 0 0',
	'Interface sensitive RIGG | Utilitaire | Standard | 30 | 2 0 0 0 0 0',
	'Pod fusées éclairantes niv. 1 | Utilitaire | Standard | 10 | 0 0 0 1 0 0 | 0 0 1 0 0 0 | 0 1 0 0 0 0',
	'Pod fusées éclairantes niv. 2 | Utilitaire | Standard | 30',
	'Pod fusées éclairantes niv. 3 | Utilitaire | Standard | 50',
	'Voyager | Utilitaire | Standard | 10 | 0 0 0 1 0 0',
	'Thunder security | Utilitaire | Avancé | 50 | 1 1 1 1 1 1',
	'Accélérateur niv. 1 | Utilitaire | Rare | 50 | 0 1 1 1 1 1',
	'Accélérateur niv. 2 | Utilitaire | Rare | 100',
	'Interface Babel | Utilitaire | Rare | 50 | 1 0 0 0 0 0',
	'Désignation niv. 1 | Visée | Standard | 10 | 1 0 0 0 0 0',
	'Désignation niv. 2 | Visée | Standard | 20',
	'Désignation niv. 3 | Visée | Standard | 30',
	'Vue alternative niv. 1 | Visée | Standard | 10 | 1 0 0 0 0 0',
	'Vue alternative niv. 2 | Visée | Standard | 10',
	'Vue alternative niv. 3 | Visée | Standard | 20',
	...CARACTERISTICS_LABELS.flatMap((labels) => labels)
		.map((label) => fuc(label))
		.flatMap((label) => [
			`Overdrive ${label} niv. 1 | Overdrive | Avancé | 10`,
			`Overdrive ${label} niv. 2 | Overdrive | Avancé | 30`,
			`Overdrive ${label} niv. 3 | Overdrive | Rare | 50`,
			`Overdrive ${label} niv. 4 | Overdrive | Rare | 70`,
			`Overdrive ${label} niv. 5 | Overdrive | Rare | 100`
		])
]

export const HEROIC_CAPACITIES = [
	'Art guerrier | 10',
	'Colère du juste | 20',
	'Combo + 1 | 10',
	'Combo + 2 | 20',
	'Commandant implacable | 30',
	'Connaissance des lieux | 10',
	'Discours enflammé | 20',
	'Fin limier | 10',
	'Frappes terribles | 20',
	"Œil d'aigle | 20",
	'Instinct infaillible | 20',
	'Investigateur expert | 10',
	'Majesté du chevalier | 10',
	'Prédateurs et proies | 10'
]

export const WEAPON_UPGRADES = [
	'Arabesques iridescentes | 5 | Ornementale',
	'Arme azurine | 10 | Ornementale',
	'Arme rouge sang | 10 | Ornementale',
	'Armure gravée | 20 | Ornementale',
	'Blason du chevalier | 15 | Ornementale',
	'Bouclier gravé | 5 | Ornementale',
	'Chêne sculpté | 10 | Ornementale',
	'Chromée avec lignes lumineuses et colorées | 15 | Ornementale',
	'Code du Knight gravé | 20 | Ornementale',
	'Crâne rieur gravé | 15 | Ornementale',
	'Faucheuse gravée | 5 | Ornementale',
	'Faucon et plumes luminescentes | 20 | Ornementale',
	'Flammes stylisées | 5 | Ornementale',
	'Griffures gravées | 10 | Ornementale',
	'Masque brisé sculpté | 10 | Ornementale',
	'Rouages cassés gravés | 10 | Ornementale',
	'Sillons formant des lignes et des flèches | 5  | Ornementale',
	'Agressive | 5',
	'Allégée | 10',
	'Assassine | 10',
	'Barbelée | 10',
	'Connectée | 10',
	'Électrifiée | 5',
	'Indestructible | 15',
	'Jumelle | 10',
	'Lumineuse | 5',
	'Massive | 10',
	'Protectrice | 10',
	'Sournoise | 10',
	'Sœur | 5',
	'Sur mesure | 20',
	'Canon long | 10',
	'Canon raccourci | 10',
	'Chambre double | 30',
	'Chargeur et balles grappes | 10',
	'Chargeur et munitions explosives | 10',
	'Interface de guidage | 15',
	'Jumelage | 10',
	'Lunette intelligente | 10',
	'Munitions drones | 30',
	'Munitions hyper vélocité | 30',
	'Munitions IEM | 15',
	'Munitions non létales | 10',
	'Munitions subsoniques | 20',
	'Pointeur laser | 10',
	"Protection d'arme | 20",
	'Revêtement Omega | 20',
	'Structure alpha | 20',
	'Système de refroidissement | 30',
	'Effets suppl. | 50',
	'Profile de base | 50',
	'Suppression lourd | 50',
	'-2PE par effet de liste | 100'
]

export const XP_COST = [
	// 0   1   2   3   4   5   6   7   8   9
	[0, 0, 1, 3, 6, 10, 15, 21, 28, 36], // 0
	[0, 0, 2, 5, 9, 14, 20, 27, 35, 44], // 1
	[0, 0, 0, 3, 7, 12, 18, 25, 33, 42], // 2
	[0, 0, 0, 0, 4, 9, 15, 22, 30, 39], // 3
	[0, 0, 0, 0, 0, 5, 11, 18, 26, 35], // 4
	[0, 0, 0, 0, 0, 0, 6, 13, 21, 30], // 5
	[0, 0, 0, 0, 0, 0, 0, 7, 15, 24], // 6
	[0, 0, 0, 0, 0, 0, 0, 0, 8, 17], // 7
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 9], // 8
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0] // 9
]

export const SLOTS_LABELS = ['Tête', 'Bras gauche', 'Bras droit', 'Torse', 'Jambe gauche', 'Jambe droite']
