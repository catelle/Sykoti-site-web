import 'dotenv/config'
import { connectDb } from '../db.js'
import Engagement from '../models/Engagement.js'

const engagements = [
  ['Fanny', 'Protection de mes données personnelles', 'je vérifierai les autorisations demandées par chaque application avant de les accepter.'],
  ['Sara', 'Sécurité de mes comptes', 'j’utiliserai un mot de passe différent et robuste pour chacun de mes comptes importants.'],
  ['Wilson', 'Vérification des informations', 'je chercherai au moins deux sources fiables avant de partager une information.'],
  ['Clarisse', 'Respect des autres en ligne', 'je choisirai des mots respectueux, même lorsque je ne suis pas d’accord.'],
  ['Armand', 'Utilisation responsable des réseaux sociaux', 'je limiterai mon temps d’écran et réfléchirai avant chaque publication.'],
  ['Nadine', 'Intelligence artificielle responsable', 'je vérifierai les réponses d’une IA avant de les utiliser ou de les diffuser.'],
  ['Junior', 'Protection contre les arnaques en ligne', 'je ne cliquerai pas sur un lien suspect et je vérifierai toujours son expéditeur.'],
  ['Estelle', 'Sensibilisation de mon entourage', 'je montrerai à ma famille comment reconnaître les faux messages et les arnaques.'],
  ['Patrick', 'Protection de mes données personnelles', 'je partagerai seulement les informations personnelles vraiment nécessaires.'],
  ['Lydie', 'Sécurité de mes comptes', 'j’activerai la double authentification sur mes comptes principaux.'],
  ['Brice', 'Vérification des informations', 'je lirai l’article complet au lieu de me fier uniquement à son titre.'],
  ['Mireille', 'Respect des autres en ligne', 'je signalerai les contenus haineux sans répondre par la haine.'],
  ['Kevin', 'Utilisation responsable des réseaux sociaux', 'je protégerai ma vie privée en réglant la visibilité de mes publications.'],
  ['Aïcha', 'Intelligence artificielle responsable', 'je n’utiliserai pas une IA pour tromper, harceler ou nuire à quelqu’un.'],
  ['Boris', 'Protection contre les arnaques en ligne', 'je demanderai conseil avant d’envoyer de l’argent à une personne rencontrée en ligne.'],
  ['Cynthia', 'Sensibilisation de mon entourage', 'je partagerai une astuce de sécurité numérique avec mes camarades chaque mois.'],
  ['David', 'Protection de mes données personnelles', 'je me déconnecterai de mes comptes lorsque j’utilise un appareil partagé.'],
  ['Josiane', 'Sécurité de mes comptes', 'je ne communiquerai jamais mes codes de connexion ni mes codes de validation.'],
  ['Fabrice', 'Vérification des informations', 'je vérifierai la date et l’auteur d’un contenu avant de le relayer.'],
  ['Chantal', 'Respect des autres en ligne', 'je demanderai l’accord d’une personne avant de publier sa photo ou son message.'],
  ['Loïc', 'Utilisation responsable des réseaux sociaux', 'je ferai des pauses régulières pour garder un usage équilibré des réseaux sociaux.'],
  ['Grâce', 'Intelligence artificielle responsable', 'je préciserai lorsqu’un contenu a été créé ou modifié avec une intelligence artificielle.'],
  ['Rodolphe', 'Protection contre les arnaques en ligne', 'je me méfierai des offres trop belles pour être vraies et des demandes urgentes.'],
  ['Marlène', 'Sensibilisation de mon entourage', 'j’encouragerai mes proches à mettre à jour leurs applications et leurs téléphones.'],
  ['Stéphane', 'Protection de mes données personnelles', 'je relirai les paramètres de confidentialité de mes réseaux sociaux.'],
  ['Odette', 'Sécurité de mes comptes', 'je créerai des phrases de passe longues et faciles à retenir, mais difficiles à deviner.'],
  ['Yannick', 'Vérification des informations', 'je distinguerai les faits, les opinions et les rumeurs dans ce que je consulte.'],
  ['Prisca', 'Respect des autres en ligne', 'je soutiendrai les personnes ciblées par le cyberharcèlement au lieu de rester silencieuse.'],
  ['Maxime', 'Utilisation responsable des réseaux sociaux', 'je ne partagerai pas impulsivement un contenu qui peut blesser ou exposer quelqu’un.'],
  ['Vanessa', 'Sensibilisation de mon entourage', 'je parlerai des bonnes pratiques numériques autour de moi avec bienveillance.'],
]

const previousDisplayNames = [
  'PixelSage', 'NayaConnect', 'KmerVigilant', 'MboaPeace', 'SafeScroll', 'AmaniBot',
  'KlikMalin', 'TontonWeb', 'DataNova', 'CodeBaobab', 'FactCheck237', 'DoualaZen',
  'RéseauLumière', 'IAavecSoin', 'StopFauxLien', 'CampusCyber', 'MangoSecure',
  'ClicPrudent', 'InfoClair', 'KoudouRespect', 'PauseDigitale', 'EspritCritique',
  'AlerteMboa', 'VoixNumérique', 'CacaoCloud', 'MotDePassePro', 'SourceSûre',
  'UbuntuOnline', 'FiltreFuté', 'CyberRelais',
]

await connectDb()

await Engagement.deleteMany({ displayName: { $in: previousDisplayNames } })
const inserted = await Engagement.insertMany(engagements.map(([displayName, theme, commitment], index) => ({
  displayName,
  theme,
  commitment,
  location: ['Douala', 'Yaoundé', 'Bafoussam', 'Garoua', 'Buea'][index % 5],
  ageRange: ['15–18 ans', '19–24 ans', '25–34 ans'][index % 3],
  consentToPublish: true,
  status: 'approved',
  approvedAt: new Date(Date.now() - index * 60_000),
})))

console.log(`${inserted.length} engagements publiés ajoutés.`)
process.exit(0)
