// Default website copy. The admin dashboard (admin.html → Page content) stores
// overrides in MongoDB; these values are used for anything not overridden.
// Use *asterisks* inside a title to render the wrapped words in italic accent.

export const copy = {
  en: {
    nav: [['Home','home'],['About Us','about'],['Programmes','programs'],['Impact','impact'],['Blog','resources']],
    involved: 'Get Involved', civic: 'Civic Tech Africa',
    footerIntro: 'A Cameroonian youth-focused nonprofit building safer, more creative and more inclusive digital communities.',
    focus: 'Our focus', explore: 'Explore', contact: 'Contact', rights: 'All rights reserved.', reports:'Reports', motto:'Solidarity · Integrity · Excellence',
    location:'Bafoussam, Cameroon', region:'Cameroon · FR/EN',
    focusLinks:['Digital citizenship','Practical STEM','Youth leadership','Inclusive access'],
  },
  fr: {
    nav: [['Accueil','home'],['À propos','about'],['Programmes','programs'],['Impact','impact'],['Blog','resources']],
    involved: 'S’engager', civic: 'Tech civique Afrique',
    footerIntro: 'Une association camerounaise centrée sur la jeunesse, pour des communautés numériques plus sûres, créatives et inclusives.',
    focus: 'Nos priorités', explore: 'Explorer', contact: 'Contact', rights: 'Tous droits réservés.', reports:'Rapports', motto:'Solidarité · Intégrité · Excellence',
    location:'Bafoussam, Cameroun', region:'Cameroun · FR/EN',
    focusLinks:['Citoyenneté numérique','STIM pratiques','Leadership des jeunes','Accès inclusif'],
  },
}

export const content = {
  home: {
    en: {
      pill:'Civic Tech • Cameroon • Central Africa', title:"Shaping a *human-centred* technological future.",
      lead:'We equip young people with digital safety, practical STEM and leadership skills—with particular attention to girls and young women.',
      primary:['Explore programmes','programs'], secondary:['See our impact','impact'],
      stats:[['217','Young people reached'],['15','CyberAmbassador graduates'],['42','Scholarship learners'],['14','Youth-led projects']],
      section:'Areas of intervention', sectionLead:'Practical pathways that help young people learn, create and act with confidence.',
      cards:[['security','Digital citizenship','Safer habits, critical thinking and protection from online harm.','/img/placeholders/digital-citizenship.svg'],['code','Practical STEM','Hands-on technology learning connected to local realities.','/img/placeholders/practical-stem.svg'],['diversity_3','Inclusive access','Youth-focused programmes with particular attention to girls and young women.','/img/placeholders/inclusive-access.svg'],['lightbulb','Innovation','Turning knowledge into useful ideas and community tools.','/img/placeholders/innovation.svg'],['trending_up','Project support','Mentorship that helps youth-led initiatives grow.','/img/placeholders/project-support.svg'],['campaign','Leadership','Young voices contributing to digital rights and policy.','/img/placeholders/leadership.svg']],
      trust:'Bilingual initiative rooted in Cameroon', heroAlt:'Sykoti Center youth community', badge:['CyberAmbassador','Learn · protect · lead'],
      pillarsKicker:'Strategic pillars', ticker:'Cybersecurity · Coding · Artificial intelligence · Digital rights · Media literacy · Girls in tech · Youth leadership · Civic innovation', cardButton:'Learn more',
      featureKicker:'Flagship programme', featureTitle:'CyberAmbassador', featureText:'A practical pathway to understand digital life, stay safer, verify information and act in the community.', featureButton:['Explore the programme','cyberambassador'], featureAlt:'Youth community action',
    },
    fr: {
      pill:'Tech civique • Cameroun • Afrique centrale', title:"Construire un avenir technologique *centré sur l’humain.*",
      lead:'Nous outillons les jeunes en sécurité numérique, STIM pratiques et leadership, avec une attention particulière aux filles et jeunes femmes.',
      primary:['Découvrir les programmes','programs'], secondary:['Voir notre impact','impact'],
      stats:[['217','Jeunes touchés'],['15','CyberAmbassadeurs diplômés'],['42','Bénéficiaires de bourses'],['14','Projets portés par des jeunes']],
      section:'Domaines d’intervention', sectionLead:'Des parcours pratiques pour apprendre, créer et agir avec confiance.',
      cards:[['security','Citoyenneté numérique','Bons réflexes, esprit critique et protection contre les risques en ligne.','/img/placeholders/digital-citizenship.svg'],['code','STIM pratiques','Un apprentissage technologique concret, lié aux réalités locales.','/img/placeholders/practical-stem.svg'],['diversity_3','Accès inclusif','Des programmes jeunesse avec une attention particulière aux filles et jeunes femmes.','/img/placeholders/inclusive-access.svg'],['lightbulb','Innovation','Transformer les connaissances en idées et outils utiles.','/img/placeholders/innovation.svg'],['trending_up','Accompagnement','Du mentorat pour faire grandir les initiatives des jeunes.','/img/placeholders/project-support.svg'],['campaign','Leadership','Des voix jeunes engagées pour les droits et politiques numériques.','/img/placeholders/leadership.svg']],
      trust:'Initiative bilingue ancrée au Cameroun', heroAlt:'Communauté de jeunes de Sykoti Center', badge:['CyberAmbassador','Apprendre · protéger · agir'],
      pillarsKicker:'Piliers stratégiques', ticker:'Cybersécurité · Programmation · Intelligence artificielle · Droits numériques · Éducation aux médias · Filles et tech · Leadership des jeunes · Innovation civique', cardButton:'En savoir plus',
      featureKicker:'Programme phare', featureTitle:'CyberAmbassador', featureText:'Un parcours pratique pour comprendre le numérique, se protéger, vérifier l’information et agir dans sa communauté.', featureButton:['Découvrir le programme','cyberambassador'], featureAlt:'Action communautaire de jeunes',
    },
  },
  about: {
    en:{pill:'About Sykoti Center',title:'Youth, technology and the power to act.',lead:'Sykoti Center is a Cameroonian nonprofit helping young people understand, use and shape technology responsibly.',primary:['Our programmes','programs'],section:'What guides us',sectionLead:'We combine practical learning, dignity and community action.',cards:[['Our main objective','Make digital knowledge useful, accessible and safe for young people by connecting practical digital citizenship, skills development and opportunities to create meaningful solutions in their communities.',null,'community-action.jpg'],['Mission','We help young people build the knowledge, habits and confidence they need to navigate digital spaces safely, learn useful skills and participate actively in the communities they call home.'],['Vision','We imagine African youth shaping technology with confidence: questioning what they encounter online, creating with purpose and contributing to a more inclusive and responsible digital future.'],['Approach','We learn from lived realities, explain complex subjects clearly, practise through concrete situations and share responsibility with participants, mentors and community partners.']],feature:'Youth first. Inclusion by design.',featureText:'Our work is open to young people of all genders, with particular attention to barriers faced by girls and young women.'},
    fr:{pill:'À propos de Sykoti Center',title:'Jeunesse, technologie et pouvoir d’agir.',lead:'Sykoti Center est une association camerounaise qui aide les jeunes à comprendre, utiliser et façonner la technologie de manière responsable.',primary:['Nos programmes','programs'],section:'Ce qui nous guide',sectionLead:'Nous réunissons apprentissage pratique, dignité et action communautaire.',cards:[['Notre objectif principal','Rendre les savoirs numériques utiles, accessibles et sûrs pour les jeunes en reliant citoyenneté numérique, développement des compétences et occasions de créer des solutions utiles dans leurs communautés.',null,'community-action.jpg'],['Mission','Aider les jeunes à développer les connaissances, les habitudes et la confiance nécessaires pour évoluer dans les espaces numériques, apprendre des compétences utiles et participer activement à la vie de leurs communautés.'],['Vision','Nous imaginons une jeunesse africaine qui façonne la technologie avec confiance : capable de questionner ce qu’elle rencontre en ligne, de créer avec intention et de contribuer à un avenir numérique plus inclusif et responsable.'],['Approche','Nous partons des réalités vécues, expliquons les sujets complexes avec clarté, pratiquons à partir de situations concrètes et partageons la responsabilité avec les participants, mentors et partenaires communautaires.']],feature:'La jeunesse d’abord. L’inclusion dès la conception.',featureText:'Nos actions sont ouvertes aux jeunes de tous genres, avec une attention particulière aux obstacles rencontrés par les filles et jeunes femmes.'},
  },
  programs: {
    en:{pill:'Programmes & actions',title:'Clear pathways from learning to action.',lead:'Focused programmes, practical tools and human support for young people.',cards:[['CyberAmbassador','A structured digital citizenship, safety and leadership journey.','cyberambassador',null,'fellows-2026.jpg'],['Scholarships & workshops','Bilingual access, practical sessions and community learning for schools and youth groups.','programs',null,'jeunes-connectes-workshop.png']],section:'How learning works',steps:[['01','Understand','Explore real digital situations.'],['02','Practice','Build useful habits and skills.'],['03','Create','Apply learning to a project.'],['04','Share','Support peers and communities.']]},
    fr:{pill:'Programmes & actions',title:'Des parcours clairs, de l’apprentissage à l’action.',lead:'Des programmes ciblés, des outils pratiques et un accompagnement humain pour les jeunes.',cards:[['CyberAmbassador','Un parcours structuré de citoyenneté, sécurité et leadership numériques.','cyberambassador',null,'fellows-2026.jpg'],['Bourses & ateliers','Un accès bilingue, des sessions pratiques et un apprentissage communautaire pour les écoles et groupes de jeunes.','programs',null,'jeunes-connectes-workshop.png']],section:'Comment se déroule l’apprentissage',steps:[['01','Comprendre','Explorer des situations numériques réelles.'],['02','Pratiquer','Développer des réflexes et compétences utiles.'],['03','Créer','Appliquer les acquis dans un projet.'],['04','Partager','Soutenir ses pairs et sa communauté.']]},
  },
  impact: {
    en:{pill:'Impact & evidence',title:'Progress we can show, not promises we cannot.',lead:'We report participation, learning and community action clearly and responsibly.',stats:[['217','People reached'],['15','Graduates'],['42','Scholarship learners'],['14','Youth-led projects']],section:'Evidence from the work',cards:[['Structured learning','Four connected modules with practical missions.'],['Community action','Projects translate learning into local contribution.'],['Participant feedback','Young people help us improve every cohort.']]},
    fr:{pill:'Impact & preuves',title:'Des progrès visibles, sans promesses exagérées.',lead:'Nous présentons clairement la participation, les apprentissages et les actions communautaires.',stats:[['217','Personnes touchées'],['15','Diplômés'],['42','Bénéficiaires de bourses'],['14','Projets de jeunes']],section:'Les preuves de notre action',cards:[['Apprentissage structuré','Quatre modules reliés à des missions pratiques.'],['Action communautaire','Des projets qui transforment les acquis en contribution locale.'],['Retours des participants','Les jeunes nous aident à améliorer chaque cohorte.']]},
  },
  resources: {
    en:{searchPlaceholder:'Search articles…',allLabel:'All',featuredLabel:'Featured',latestLabel:'Latest articles',readMore:'Read the article',loadMore:'Load more articles',minRead:'min read',emptyTitle:'Articles are on their way',emptyText:'Our first articles are being written. Here is what we will cover.',noResults:'No article matches your search.',reportsTitle:'Reports & publications',webinarsTitle:'Conversations & webinars',pill:'Blog',title:'Useful knowledge for safer digital lives.',lead:'Short, practical resources drawn from our programmes and field experience.',cards:[['Digital safety','Simple guidance for protecting accounts, data and wellbeing.'],['Information literacy','Tools for verification, critical thinking and responsible AI use.'],['Field stories','Lessons from workshops, cohorts and youth-led projects.']],primary:['Browse CyberAmbassador','cyberambassador']},
    fr:{searchPlaceholder:'Rechercher un article…',allLabel:'Tous',featuredLabel:'À la une',latestLabel:'Derniers articles',readMore:'Lire l’article',loadMore:'Voir plus d’articles',minRead:'min de lecture',emptyTitle:'Les articles arrivent bientôt',emptyText:'Nos premiers articles sont en cours de rédaction. Voici les sujets que nous aborderons.',noResults:'Aucun article ne correspond à votre recherche.',reportsTitle:'Rapports & publications',webinarsTitle:'Conversations & webinaires',pill:'Blog',title:'Des connaissances utiles pour une vie numérique plus sûre.',lead:'Des ressources courtes et pratiques issues de nos programmes et de l’expérience de terrain.',cards:[['Sécurité numérique','Des conseils simples pour protéger comptes, données et bien-être.'],['Éducation aux médias','Des outils de vérification, d’esprit critique et d’usage responsable de l’IA.'],['Récits de terrain','Les leçons de nos ateliers, cohortes et projets portés par des jeunes.']],primary:['Découvrir CyberAmbassador','cyberambassador']},
  },
  'get-involved': {
    en:{
      pill:'Join Sykoti Center', title:'Help young people build *safer digital lives.*',
      lead:'Become a member, share your skills, support learning access or partner with us. Every contribution helps young people in Cameroon learn, create and lead with technology.',
      primary:['Apply for membership','membership'], secondary:['Volunteer with us','interest:volunteer'],
      jumpLabel:'I want to…',
      section:'Find the right way to contribute', sectionLead:'Pick a path to see what it involves, how much time it takes and what happens next.',
      paths:[
        ['card_membership','Become a member','Join the association and take part in its decisions.','Members are the backbone of Sykoti Center. Active members take on responsibilities, can stand for election and help steer the programmes; supporting members follow and back the work.','A few hours per month','Complete the online application (about 15 minutes)\nShortlisted applicants are invited to an interview\nOnce accepted, pay the annual contribution — in up to 3 instalments','Apply for membership','membership'],
        ['volunteer_activism','Volunteer your skills','Mentor, facilitate, or help with communication and tech.','Volunteers mentor learners, co-facilitate workshops, review learning materials or support our communication and technical tools. Every role has a clear scope, and volunteers working with young people follow our safeguarding expectations.','Flexible, based on your availability','Tell us your skills and availability\nWe match you with a concrete need\nShort onboarding and safeguarding briefing','I want to volunteer','interest:volunteer'],
        ['savings','Donate or sponsor','Fund learning access, a workshop or a cohort.','Financial support pays for connectivity, learning materials, workshop delivery and cohort follow-up. We agree the intended use with you before receiving funds and share what your support made possible.','One-off or recurring','Choose what you would like to support\nWe confirm the use and payment details with you\nReceive a short account of what was delivered','Pledge support','interest:donation'],
        ['handshake','Partner with us','For schools, NGOs, companies and institutions.','Partners host activities, co-design programmes, contribute infrastructure or expertise, or support initiatives over the longer term. Every partnership starts from a shared purpose and a clear agreement on roles, audience and evidence.','Project-based','Share your organisation and goals\nCo-design the activity and agree responsibilities\nDeliver together and review the results','Start a partnership','interest:partnership'],
      ],
      pathCommitment:'Time commitment', pathSteps:'How it works',
      levelsKicker:'Donation & sponsorship', levelsTitle:'What your support makes possible', levelsLead:'Choose an area to support. We confirm the exact budget and use with you before any payment.',
      levels:[
        ['wifi','Learning access','Connectivity and learning materials for young people during a training phase.',''],
        ['co_present','Workshop support','Delivery of a practical digital-safety session in a school or community.',''],
        ['groups','Cohort sponsorship','Guided learning, follow-up and certification for a group of learners.',''],
        ['devices','Devices & equipment','Laptops, phones or connectivity that make learning possible.',''],
      ],
      levelsButton:'Support this',
      formKicker:'Expression of interest', formTitle:'Tell us how you would like to help', formLead:'Send us a few details and the team will reply by email with the most suitable next step.',
      formSuccess:'Thank you! Your message has reached the Sykoti Center team. We will reply by email with the next step.',
      faqTitle:'Frequently asked questions',
      faq:[
        ['What happens after I send the form?','The team reviews your message and replies by email with the most suitable next step, based on current needs and capacity. An expression of interest opens a conversation; it is not an automatic acceptance into a programme or partnership.'],
        ['How is my financial support used?','Before receiving any funds, we agree with you on the intended use, the delivery period and the evidence we can realistically share. Public recognition is agreed with you and never takes priority over participants’ privacy.'],
        ['Can I volunteer if I am not in Bafoussam?','Several roles, such as reviewing learning materials, communication or technical support, can be done remotely. Tell us where you are and we will let you know which needs are currently open.'],
        ['What is the difference between a member and a volunteer?','Members join the association under its statutes, would pay, where applicable, the contribution set by the General Assembly, and take part in its life and decisions. Volunteers contribute time or expertise to specific activities without necessarily becoming members.'],
        ['Can my organisation be listed as a partner?','Partner references are published only once a collaboration is agreed, and only with your confirmation and consent.'],
      ],
    },
    fr:{
      pill:'Rejoindre Sykoti Center', title:'Aidez les jeunes à construire une *vie numérique plus sûre.*',
      lead:'Devenez membre, partagez vos compétences, soutenez l’accès à la formation ou devenez partenaire. Chaque contribution aide des jeunes au Cameroun à apprendre, créer et agir avec la technologie.',
      primary:['Candidater à l’adhésion','membership'], secondary:['Devenir bénévole','interest:volunteer'],
      jumpLabel:'Je souhaite…',
      section:'Trouvez la bonne manière de contribuer', sectionLead:'Choisissez un parcours pour voir ce qu’il implique, le temps nécessaire et les prochaines étapes.',
      paths:[
        ['card_membership','Devenir membre','Rejoindre l’association et participer à ses décisions.','Les membres sont le cœur de Sykoti Center. Les membres actifs prennent des responsabilités, peuvent être élus et orientent les programmes ; les membres sympathisants suivent et soutiennent l’action.','Quelques heures par mois','Remplissez la candidature en ligne (environ 15 minutes)\nLes candidats présélectionnés sont invités en entretien\nUne fois accepté·e, réglez la cotisation annuelle — en 3 tranches maximum','Candidater à l’adhésion','membership'],
        ['volunteer_activism','Partager vos compétences','Mentorat, animation, communication ou technique.','Les bénévoles accompagnent des apprenants, co-animent des ateliers, relisent des contenus pédagogiques ou soutiennent nos outils de communication et techniques. Chaque rôle a un périmètre clair, et les bénévoles en contact avec des jeunes respectent nos règles de protection.','Flexible, selon vos disponibilités','Présentez vos compétences et disponibilités\nNous vous associons à un besoin concret\nCourte intégration et briefing sur la protection des jeunes','Je veux être bénévole','interest:volunteer'],
        ['savings','Faire un don ou parrainer','Financer l’accès à la formation, un atelier ou une cohorte.','Le soutien financier couvre la connexion, le matériel pédagogique, l’animation d’ateliers et le suivi des cohortes. Nous convenons avec vous de l’usage prévu avant de recevoir les fonds et partageons ce que votre soutien a permis.','Ponctuel ou régulier','Choisissez ce que vous souhaitez soutenir\nNous confirmons avec vous l’usage et les modalités de paiement\nRecevez un court compte rendu de ce qui a été réalisé','Proposer un soutien','interest:donation'],
        ['handshake','Devenir partenaire','Écoles, ONG, entreprises et institutions.','Les partenaires accueillent des activités, co-construisent des programmes, apportent des infrastructures ou une expertise, ou soutiennent des initiatives dans la durée. Chaque partenariat part d’une mission partagée et d’un accord clair sur les rôles, le public et les preuves.','Par projet','Présentez votre organisation et vos objectifs\nCo-construisons l’activité et répartissons les responsabilités\nRéalisons-la ensemble et faisons le bilan','Démarrer un partenariat','interest:partnership'],
      ],
      pathCommitment:'Temps à prévoir', pathSteps:'Comment ça marche',
      levelsKicker:'Don & parrainage', levelsTitle:'Ce que votre soutien rend possible', levelsLead:'Choisissez un domaine à soutenir. Nous confirmons avec vous le budget exact et son usage avant tout paiement.',
      levels:[
        ['wifi','Accès à la formation','Connexion et matériel pédagogique pour des jeunes pendant une phase de formation.',''],
        ['co_present','Soutien à un atelier','Animation d’une session pratique de sécurité numérique dans une école ou une communauté.',''],
        ['groups','Parrainage de cohorte','Formation accompagnée, suivi et certification pour un groupe d’apprenants.',''],
        ['devices','Équipements','Ordinateurs, téléphones ou connexion qui rendent l’apprentissage possible.',''],
      ],
      levelsButton:'Soutenir',
      formKicker:'Manifestation d’intérêt', formTitle:'Dites-nous comment vous souhaitez aider', formLead:'Envoyez-nous quelques informations : l’équipe vous répondra par e-mail avec l’étape la plus adaptée.',
      formSuccess:'Merci ! Votre message est bien parvenu à l’équipe de Sykoti Center. Nous vous répondrons par e-mail avec la suite.',
      faqTitle:'Questions fréquentes',
      faq:[
        ['Que se passe-t-il après l’envoi du formulaire ?','L’équipe examine votre message et vous répond par e-mail avec l’étape la plus adaptée, selon les besoins et capacités du moment. Une manifestation d’intérêt ouvre une conversation ; elle ne vaut pas admission automatique dans un programme ou un partenariat.'],
        ['Comment mon soutien financier est-il utilisé ?','Avant toute réception de fonds, nous convenons avec vous de l’usage prévu, de la période de réalisation et des preuves que nous pouvons raisonnablement partager. La visibilité publique est convenue avec vous et ne passe jamais avant la vie privée des participants.'],
        ['Puis-je être bénévole si je ne suis pas à Bafoussam ?','Plusieurs rôles, comme la relecture de contenus, la communication ou le soutien technique, peuvent se faire à distance. Indiquez-nous où vous êtes et nous vous dirons quels besoins sont ouverts.'],
        ['Quelle différence entre membre et bénévole ?','Les membres adhèrent aux statuts, s’acquitteraient, le cas échéant, de la cotisation fixée par l’Assemblée générale et participent à la vie et aux décisions de l’association. Les bénévoles apportent du temps ou une expertise sur des activités précises sans être forcément membres.'],
        ['Mon organisation peut-elle être citée comme partenaire ?','Les références de partenaires ne sont publiées qu’une fois la collaboration convenue, et uniquement avec votre confirmation et votre accord.'],
      ],
    },
  },
  reports: {
    en:{pill:'Reports & downloads',title:'Evidence made accessible.',lead:'Download concise reports about our programmes, learning and community action.',cards:[['2026 Impact Brief','A concise view of participation, delivery and early outcomes.'],['CyberAmbassador Overview','Programme structure, modules and participant journey.'],['Partnership Note','Ways institutions can support or host the work.']]},
    fr:{pill:'Rapports & téléchargements',title:'Des preuves accessibles.',lead:'Téléchargez des rapports concis sur nos programmes, apprentissages et actions communautaires.',cards:[['Note d’impact 2026','Une vue concise de la participation, des actions et premiers résultats.'],['Présentation CyberAmbassador','Structure, modules et parcours des participants.'],['Note de partenariat','Les possibilités pour soutenir ou accueillir nos actions.']]},
  },
}

export const extras = {
  home: {
    en:[
      {k:'Featured initiatives',t:'Two pathways into practical digital learning.',theme:'soft initiatives',cards:[['CyberAmbassador','Full learning and leadership journey.','cyberambassador','community-action.jpg'],['100 Training Scholarships','Bilingual access to foundational modules.','scholarship','graduation-ceremony.png']]},
      {k:'Our values',t:'How we choose to work.',theme:'values',cards:[['Solidarity','We learn and build with communities.'],['Integrity','We communicate evidence honestly.'],['Excellence','We improve through practice and feedback.']]},
      {k:'People behind the work',t:'Leadership and youth contributors.',theme:'people',source:'team',cards:[['Ing. Ningha Catelle','Founding president of Sykoti Center, shaping the organisation’s direction and making sure every programme remains grounded in practical learning, responsibility and community needs.',null,'/img/placeholders/person-1.svg','Founding president'],['Youth Fellows','Young participants who learn, test ideas and share what works. Their questions, feedback and projects help turn the programme into an experience that speaks to real digital lives.',null,'/img/placeholders/person-2.svg','Youth participants'],['Technical Mentors','Practitioners who bring experience in technology, digital safety and learning design. They help participants connect concepts to concrete situations and build confidence through practice.',null,'/img/placeholders/person-3.svg','Technical mentors'],['Community Leads','Young people who carry useful knowledge beyond the platform. They help create conversations, support their peers and connect learning with positive action in their schools and communities.',null,'/img/placeholders/person-4.svg','Community leads']]},
      {k:'Latest insights',t:'Short reads from programmes and the field.',theme:'soft content',cards:[['Safer digital habits','Practical steps for everyday online life.','resources','cyber-attacks-webinar.png'],['Learning through real situations','Why practice matters more than warnings.','resources','platform-module.png'],['From learner to leader','How youth projects extend programme impact.','resources','jeunes-connectes-workshop.png']]},
      {k:'Build with us',t:'Help more young people learn, create and lead.',theme:'banner',action:['Get involved','get-involved']},
    ],
    fr:[
      {k:'Initiatives phares',t:'Deux portes d’entrée vers un apprentissage numérique pratique.',theme:'soft initiatives',cards:[['CyberAmbassador','Parcours complet de formation et de leadership.','cyberambassador','community-action.jpg'],['100 bourses de formation','Accès bilingue aux modules fondamentaux.','scholarship','graduation-ceremony.png']]},
      {k:'Nos valeurs',t:'Notre manière de travailler.',theme:'values',cards:[['Solidarité','Apprendre et construire avec les communautés.'],['Intégrité','Communiquer les résultats avec honnêteté.'],['Excellence','Progresser par la pratique et les retours.']]},
      {k:'Les personnes derrière l’action',t:'',theme:'people',source:'team',cards:[['Ing. Ningha Catelle','Président-fondateur de Sykoti Center, il porte l’orientation de l’organisation et veille à ce que chaque programme reste ancré dans l’apprentissage pratique, la responsabilité et les besoins des communautés.',null,'/img/placeholders/person-1.svg','Président-fondateur'],['Jeunes participants','Ils apprennent, testent des idées et partagent ce qui fonctionne. Leurs questions, leurs retours et leurs projets rendent le programme plus proche des réalités numériques vécues au quotidien.',null,'/img/placeholders/person-2.svg','Participants jeunesse'],['Mentors techniques','Des praticiens apportent leur expérience de la technologie, de la sécurité numérique et de la pédagogie. Ils aident les participants à relier les notions aux situations concrètes et à progresser par la pratique.',null,'/img/placeholders/person-3.svg','Mentors techniques'],['Relais communautaires','Des jeunes qui transmettent les connaissances au-delà de la plateforme. Ils créent des échanges, soutiennent leurs pairs et relient l’apprentissage à des actions positives dans leurs écoles et communautés.',null,'/img/placeholders/person-4.svg','Relais communautaires']]},
      {k:'Derniers contenus',t:'Des lectures courtes issues des programmes et du terrain.',theme:'soft content',cards:[['Bons réflexes numériques','Des gestes pratiques pour la vie en ligne.','resources','cyber-attacks-webinar.png'],['Apprendre par des situations réelles','Pourquoi la pratique compte plus que les avertissements.','resources','platform-module.png'],['De l’apprenant au leader','Comment les projets des jeunes prolongent l’impact.','resources','jeunes-connectes-workshop.png']]},
      {k:'Construisons ensemble',t:'Aidez davantage de jeunes à apprendre, créer et diriger.',theme:'banner',action:['S’engager','get-involved']},
    ],
  },
  about: {
    en:[
      {k:'Our origin',t:'Built in response to connected youth challenges.',theme:'soft origin',cards:[]},
      {k:'Today and tomorrow',t:'Delivered work and long-term direction.',theme:'today',cards:[['CyberAmbassador','A structured learning and leadership journey for safer digital participation.',null,null,'Flagship program','Young people · Cohort-based · Platform + guided follow-up'],['Threat Insights','Accessible analysis and guidance around emerging online risks.',null,null,'Resource','Communities · Public resources'],['Conversations','Webinars and discussions around technology, safety and society.',null,null,'Resource','Open audiences · Online sessions'],['Sykoti Safety Lab','Testing practical responses to digital-safety challenges.',null,null,'Experimental initiative','Partners · Applied exploration']]},
      {k:'Our method',t:'A simple four-step approach.',theme:'method',cards:[['Listen','Start from lived realities.'],['Learn','Build clear foundations.'],['Practice','Use skills in real situations.'],['Multiply','Share knowledge through community action.']]},
      {k:'Who we serve',t:'Youth first, with inclusion built in.',theme:'audiences',cards:[['Young people','Learners, creators and future leaders.',null,'community-action.jpg'],['Girls & young women','Particular attention to barriers in technology access.',null,'graduation-group.jpg'],['Educators','Partners who extend practical learning.',null,'platform-module.png'],['Community organisations','Local actors connecting programmes to needs.',null,'graduation-ceremony.png']]},
      {k:'Leadership & community',t:'A growing network of programme stewards, mentors and youth fellows.',theme:'banner',action:['Our team','about-team']},
    ],
    fr:[
      {k:'Notre origine',t:'Une réponse à plusieurs défis liés à la jeunesse.',theme:'soft origin',cards:[]},
      {k:'Aujourd’hui',t:'Actions réalisées et direction à long terme.',theme:'today',cards:[['CyberAmbassador','Un parcours structuré de formation et de leadership pour une participation numérique plus sûre.',null,null,'Programme phare','Jeunes · Cohorte · Plateforme + accompagnement'],['Veille sur les menaces','Des analyses et conseils accessibles sur les risques numériques émergents.',null,null,'Ressource','Communautés · Ressources publiques'],['Conversations','Des webinaires et échanges autour de la technologie, de la sécurité et de la société.',null,null,'Ressource','Publics ouverts · Sessions en ligne'],['Sykoti Safety Lab','Des réponses pratiques aux défis liés à la sécurité numérique.',null,null,'Initiative expérimentale','Partenaires · Exploration appliquée']]},
      {k:'Notre méthode',t:'Une approche simple en quatre étapes.',theme:'method',cards:[['Écouter','Partir des réalités vécues.'],['Apprendre','Construire des bases claires.'],['Pratiquer','Utiliser les compétences en situation réelle.'],['Multiplier','Partager par l’action communautaire.']]},
      {k:'Nos publics',t:'La jeunesse d’abord, avec une inclusion réelle.',theme:'audiences',cards:[['Jeunes','Apprenants, créateurs et futurs leaders.',null,'community-action.jpg'],['Filles et jeunes femmes','Attention particulière aux obstacles d’accès à la technologie.',null,'graduation-group.jpg'],['Éducateurs','Des partenaires qui prolongent l’apprentissage.',null,'platform-module.png'],['Organisations communautaires','Des acteurs locaux proches des besoins.',null,'graduation-ceremony.png']]},
      {k:'Leadership & communauté',t:'Un réseau de responsables, mentors et jeunes participants.',theme:'banner',action:['Notre équipe','about-team']},
    ],
  },
  programs: {
    en:[
      {k:'Programme snapshot',t:'Focused delivery, visible progress.',cards:[['4 modules','Connected digital learning.'],['2 languages','English and French access.'],['1 pathway','From learning to community action.']]},
      {k:'CyberAmbassador / CyberA-Rise',t:'The complete flagship journey.',theme:'soft',cards:[['Curriculum','Digital world, safety, verification and leadership.'],['Cohort support','Platform learning plus human follow-up.'],['Completion','Assessment, project and recognition.']],action:['Open CyberAmbassador','cyberambassador']},
      {k:'100 Training Scholarships',t:'A shorter bilingual access route.',cards:[['Foundational access','First CyberAmbassador modules.'],['Guided progression','Clear lessons and practical checks.'],['Next step','A bridge toward deeper programmes.']],action:['View scholarships','scholarship']},
      {k:'Workshops & community initiatives',t:'Short formats connected to local needs.',theme:'soft',cards:[['STEM discovery','Hands-on exploration and problem solving.'],['Digital safety clinics','Account protection, scams and response.'],['Media literacy sessions','Verification and responsible AI use.'],['Open learning resources','Reusable guides for communities.']]},
      {k:'Programme moments',t:'Learning, collaboration and community action.',media:['jeunes-connectes-workshop.png','community-action.jpg','graduation-group.jpg']},
      {k:'Find your pathway',t:'Join as a learner, mentor, school or partner.',theme:'banner',action:['Start a conversation','get-involved']},
    ],
    fr:[
      {k:'Aperçu des programmes',t:'Des actions ciblées et des progrès visibles.',cards:[['4 modules','Un parcours numérique cohérent.'],['2 langues','Accès en français et en anglais.'],['1 trajectoire','De l’apprentissage à l’action communautaire.']]},
      {k:'CyberAmbassador / CyberA-Rise',t:'Le parcours phare complet.',theme:'soft',cards:[['Programme','Monde numérique, sécurité, vérification et leadership.'],['Accompagnement','Plateforme et suivi humain.'],['Finalisation','Évaluation, projet et reconnaissance.']],action:['Ouvrir CyberAmbassador','cyberambassador']},
      {k:'100 bourses de formation',t:'Une voie d’accès bilingue plus courte.',cards:[['Accès fondamental','Premiers modules de CyberAmbassador.'],['Progression guidée','Leçons claires et exercices pratiques.'],['Étape suivante','Un pont vers des parcours plus approfondis.']],action:['Voir les bourses','scholarship']},
      {k:'Ateliers & initiatives communautaires',t:'Des formats courts liés aux besoins locaux.',theme:'soft',cards:[['Découverte STIM','Exploration pratique et résolution de problèmes.'],['Cliniques de sécurité','Comptes, arnaques et réaction.'],['Éducation aux médias','Vérification et usage responsable de l’IA.'],['Ressources ouvertes','Guides réutilisables par les communautés.']]},
      {k:'Moments de programme',t:'Apprentissage, collaboration et action communautaire.',media:['jeunes-connectes-workshop.png','community-action.jpg','graduation-group.jpg']},
      {k:'Trouvez votre parcours',t:'Participez comme apprenant, mentor, école ou partenaire.',theme:'banner',action:['Démarrer la conversation','get-involved']},
    ],
  },
  impact: {
    en:[
      {k:'Regional footprint',t:'Work rooted in Cameroon and shared across connected communities.',theme:'soft',media:['graduation-group.jpg','community-action.jpg']},
      {k:'Youth-led projects',t:'Learning translated into practical action.',cards:[['Cyber-hygiene sessions','Peer learning for safer accounts.'],['Verification workshops','Tools for questioning online claims.'],['Privacy toolkits','Accessible guidance for local groups.'],['Safe social circles','Peer support for healthier online habits.']]},
      {k:'Community voice',t:'“The programme helped me question information and explain safer choices to others.”',theme:'quote'},
      {k:'Achievements and ambitions',t:'Clear separation between delivered work and future goals.',theme:'soft',cards:[['Achieved in 2026','Structured learning, cohort delivery and community projects.'],['Next horizon','More local delivery partners and youth-led solutions.']]},
      {k:'Data integrity',t:'Participation, completion and outcome data are reported separately.',action:['Request the impact brief','reports']},
    ],
    fr:[
      {k:'Empreinte régionale',t:'Une action ancrée au Cameroun et partagée entre communautés.',theme:'soft',media:['graduation-group.jpg','community-action.jpg']},
      {k:'Projets portés par les jeunes',t:'Des apprentissages transformés en action.',cards:[['Sessions de cyber-hygiène','Apprentissage entre pairs pour sécuriser les comptes.'],['Ateliers de vérification','Des outils pour questionner les contenus en ligne.'],['Kits de confidentialité','Des conseils accessibles aux groupes locaux.'],['Cercles numériques sûrs','Du soutien entre pairs pour de meilleurs usages.']]},
      {k:'Parole de participant',t:'« Le programme m’a aidé à vérifier l’information et à partager de meilleurs réflexes. »',theme:'quote'},
      {k:'Réalisations et ambitions',t:'Une distinction claire entre actions menées et objectifs futurs.',theme:'soft',cards:[['Réalisé en 2026','Formation structurée, cohorte et projets communautaires.'],['Prochaine étape','Davantage de partenaires locaux et de solutions portées par les jeunes.']]},
      {k:'Intégrité des données',t:'Participation, complétion et résultats sont présentés séparément.',action:['Demander la note d’impact','reports']},
    ],
  },
  resources: {
    en:[
      {k:'Civic Tech Dispatch',t:'Receive occasional programme notes and practical resources.',theme:'soft',action:['Subscribe by email','mailto:contact@sykoticenter.com?subject=Civic Tech Dispatch']},
      {k:'Share a field story',t:'Contribute a grassroots case study or practical lesson.',theme:'banner',action:['Submit an idea','mailto:contact@sykoticenter.com?subject=Field story']},
    ],
    fr:[
      {k:'Bulletin Tech civique',t:'Recevez occasionnellement nos ressources et nouvelles.',theme:'soft',action:['S’abonner par email','mailto:contact@sykoticenter.com?subject=Bulletin Tech civique']},
      {k:'Partager une expérience',t:'Proposez une étude de cas ou une leçon de terrain.',theme:'banner',action:['Proposer une idée','mailto:contact@sykoticenter.com?subject=Récit de terrain']},
    ],
  },
  'get-involved': {
    en:[
      {k:'Transparency',t:'Support is tied to clear programme needs and documented delivery.',theme:'soft'},
      {k:'Partner trust',t:'We work with schools, youth groups, civil society and technology actors.',theme:'soft',media:['community-action.jpg','graduation-ceremony.png']},
      {k:'Ready to contribute?',t:'Tell us your role, availability and the support you can offer.',theme:'banner',action:['Send your interest','#interest']},
    ],
    fr:[
      {k:'Transparence',t:'Chaque soutien répond à un besoin clair et à une action documentée.',theme:'soft'},
      {k:'Confiance des partenaires',t:'Nous travaillons avec écoles, groupes de jeunes, société civile et acteurs technologiques.',theme:'soft',media:['community-action.jpg','graduation-ceremony.png']},
      {k:'Prêt à contribuer ?',t:'Présentez votre rôle, disponibilité et forme de soutien.',theme:'banner',action:['Envoyer votre intérêt','#interest']},
    ],
  },
  reports: {
    en:[
      {k:'Document artifacts',source:'reports',t:'Concise material for partners, educators and communities.',cards:[['Impact brief','Participation, delivery and early outcomes.'],['Programme overview','CyberAmbassador structure and learning journey.'],['Data note','Definitions and responsible interpretation.']]},
      {k:'Report contents',t:'Context · programmes · participation · projects · governance · next steps',theme:'soft'},
      {k:'Resource allocation',t:'A high-level view of learning, access, delivery and programme support.',cards:[['Learning delivery','Facilitation and participant support.'],['Access','Connectivity, tools and materials.'],['Community action','Youth projects and local activities.'],['Programme operations','Coordination, safeguarding and reporting.']]},
      {k:'Need detailed data?',t:'Contact us for partner due diligence or research questions.',theme:'banner',action:['Request information','mailto:contact@sykoticenter.com?subject=Report data request']},
    ],
    fr:[
      {k:'Documents disponibles',source:'reports',t:'Des supports concis pour partenaires, éducateurs et communautés.',cards:[['Note d’impact','Participation, actions et premiers résultats.'],['Présentation du programme','Structure et parcours CyberAmbassador.'],['Note méthodologique','Définitions et lecture responsable des données.']]},
      {k:'Contenu du rapport',t:'Contexte · programmes · participation · projets · gouvernance · prochaines étapes',theme:'soft'},
      {k:'Répartition des ressources',t:'Une vue générale de la formation, de l’accès et de l’accompagnement.',cards:[['Formation','Facilitation et suivi des participants.'],['Accès','Connexion, outils et supports.'],['Action communautaire','Projets de jeunes et activités locales.'],['Fonctionnement','Coordination, protection et reporting.']]},
      {k:'Besoin de données détaillées ?',t:'Contactez-nous pour une vérification partenaire ou une recherche.',theme:'banner',action:['Demander des informations','mailto:contact@sykoticenter.com?subject=Demande de données']},
    ],
  },
}

export const baseDetails = {
  home:{
    en:'Our areas of intervention respond to the realities young people face when learning, communicating and creating with technology. Each pillar combines accessible explanations, practical exercises and opportunities to apply knowledge in everyday life. Together, they build confidence without separating safety, creativity, inclusion and leadership.',
    fr:'Nos domaines d’intervention répondent aux réalités vécues par les jeunes lorsqu’ils apprennent, communiquent et créent avec la technologie. Chaque pilier associe des explications accessibles, des exercices pratiques et des occasions d’appliquer les connaissances dans la vie quotidienne. Ensemble, ils développent la confiance sans séparer sécurité, créativité, inclusion et leadership.',
  },
  about:{
    en:'Sykoti Center was created from a simple observation: access to technology is not enough when young people lack practical guidance, safe learning spaces and opportunities to turn ideas into action. Our work therefore connects digital citizenship, STEM learning, innovation, mentorship and community participation within one coherent youth-focused mission.',
    fr:'Sykoti Center est née d’un constat simple : l’accès à la technologie ne suffit pas lorsque les jeunes manquent de repères pratiques, d’espaces d’apprentissage sûrs et d’occasions de transformer leurs idées en action. Notre travail relie donc citoyenneté numérique, apprentissage des STIM, innovation, mentorat et participation communautaire dans une même mission centrée sur la jeunesse.',
  },
  programs:{
    en:'Our programmes are designed as connected learning journeys rather than isolated events. Participants first understand the subject, then practise with realistic situations, receive guidance and finally apply what they have learned through a project or community contribution. The format varies by programme, but practical usefulness and responsible participation remain constant.',
    fr:'Nos programmes sont conçus comme des parcours d’apprentissage reliés, et non comme des événements isolés. Les participants comprennent d’abord le sujet, pratiquent ensuite à partir de situations réalistes, bénéficient d’un accompagnement puis appliquent leurs acquis dans un projet ou une contribution communautaire. Le format varie, mais l’utilité pratique et la participation responsable restent constantes.',
  },
  impact:{
    en:'We distinguish carefully between people reached, learners enrolled, programme completion, projects delivered and longer-term change. This avoids combining unrelated figures or presenting participation as proof of impact. Our evidence grows with delivery and is strengthened through participant feedback, documented activities and transparent reporting methods.',
    fr:'Nous distinguons avec attention les personnes touchées, les apprenants inscrits, la complétion des programmes, les projets réalisés et les changements à plus long terme. Cela évite de mélanger des chiffres différents ou de présenter la participation comme une preuve d’impact. Nos données progressent avec les actions, les retours des participants et une méthode de suivi transparente.',
  },
  resources:{
    en:'This knowledge space translates programme learning into resources that can be understood and reused beyond a cohort. Articles and field notes address common questions about online safety, information verification, artificial intelligence, digital wellbeing and youth leadership. The aim is to make complex topics practical without oversimplifying the risks or the choices involved.',
    fr:'Cet espace de connaissances transforme les apprentissages des programmes en ressources compréhensibles et réutilisables au-delà d’une cohorte. Les articles et notes de terrain répondent aux questions courantes sur la sécurité en ligne, la vérification de l’information, l’intelligence artificielle, le bien-être numérique et le leadership des jeunes, sans simplifier excessivement les enjeux.',
  },
  'get-involved':{
    en:'Support can take several forms: funding a learning activity, sharing professional expertise, mentoring participants, hosting a local session or helping provide devices and connectivity. We encourage contributors to choose a role that matches their capacity and to begin with a clear conversation about needs, responsibilities, safeguarding and expected outcomes.',
    fr:'Le soutien peut prendre plusieurs formes : financer une activité, partager une expertise professionnelle, accompagner des participants, accueillir une session locale ou contribuer en équipements et connexion. Nous invitons chaque personne ou organisation à choisir un rôle adapté à ses moyens et à commencer par un échange clair sur les besoins, responsabilités, mesures de protection et résultats attendus.',
  },
  reports:{
    en:'Our reporting materials bring together programme context, delivery choices, participation figures, learning evidence and community activities. They are intended for partners, educators, researchers and community organisations that need a clear account of what was delivered, how figures were interpreted and which ambitions remain future objectives rather than completed results.',
    fr:'Nos documents de suivi réunissent le contexte des programmes, les choix de mise en œuvre, les chiffres de participation, les preuves d’apprentissage et les actions communautaires. Ils s’adressent aux partenaires, éducateurs, chercheurs et organisations qui ont besoin de comprendre ce qui a été réalisé, comment les données sont interprétées et quels objectifs restent à venir.',
  },
}

export const sectionDetails = {
  home:{
    en:[
      'CyberAmbassador and the scholarship initiative serve different needs while sharing the same educational foundation. The first offers a complete learning and leadership journey, including assessment and community action. The second creates a shorter entry point so that more young people can access essential digital citizenship and safety knowledge before deciding whether to continue further.',
      'Solidarity means designing with communities rather than delivering solutions from a distance. Integrity means being honest about what has been completed, what is still being tested and what remains an ambition. Excellence means treating participant feedback, including criticism, as useful evidence for improving both the content and the way it is delivered.',
      'Sykoti is carried by a combination of organisational leadership, technical contributors, mentors, facilitators and young participants. Youth are not presented only as beneficiaries: they question the programme, test the learning experience, create projects and help translate knowledge into language and examples that make sense within their own communities.',
      'Our articles and insights extend the learning beyond scheduled programme activities. They capture questions raised during workshops, explain recurring online risks in accessible language and document lessons from implementation. This creates a public knowledge base that educators, young people and community organisations can revisit when they need practical guidance.',
      'Partnership makes it possible to reach more young people without reducing the quality of support. Schools, civil-society organisations, technology professionals and funders can contribute through delivery spaces, expertise, devices, connectivity, mentorship or direct programme support. Every collaboration begins with a shared understanding of the audience and the intended result.',
    ],
    fr:[
      'CyberAmbassador et l’initiative de bourses répondent à des besoins différents tout en partageant une même base pédagogique. Le premier propose un parcours complet avec évaluations et action communautaire. La seconde crée une porte d’entrée plus courte afin que davantage de jeunes accèdent aux connaissances essentielles avant de choisir une progression plus approfondie.',
      'La solidarité signifie concevoir avec les communautés plutôt que proposer des solutions à distance. L’intégrité consiste à distinguer ce qui est réalisé, ce qui est encore testé et ce qui reste une ambition. L’excellence implique de considérer les retours des participants, y compris les critiques, comme des éléments utiles pour améliorer le contenu et sa mise en œuvre.',
      'Sykoti repose sur une combinaison de responsables associatifs, contributeurs techniques, mentors, facilitateurs et jeunes participants. Les jeunes ne sont pas seulement bénéficiaires : ils questionnent le programme, testent l’expérience, créent des projets et aident à traduire les connaissances dans des mots et exemples adaptés à leurs communautés.',
      'Nos articles prolongent l’apprentissage au-delà des activités programmées. Ils reprennent les questions posées pendant les ateliers, expliquent les risques récurrents dans un langage accessible et documentent les leçons de mise en œuvre. Ils forment ainsi une base de connaissances publique pour les jeunes, éducateurs et organisations communautaires.',
      'Les partenariats permettent de toucher davantage de jeunes sans réduire la qualité de l’accompagnement. Écoles, organisations de la société civile, professionnels de la technologie et partenaires financiers peuvent contribuer par des espaces, de l’expertise, des équipements, de la connexion, du mentorat ou un soutien direct aux programmes.',
    ],
  },
  about:{
    en:[
      'The organisation emerged from challenges that reinforce one another: online risks grow as connectivity expands, practical STEM opportunities remain uneven, and many young people have ideas without access to mentorship or a structured path for developing them. Sykoti addresses these issues together because safety, skill and agency are closely connected.',
      'Our current work is intentionally concrete: structured learning modules, youth cohorts, scholarships, workshops and community projects. Our longer-term vision is broader, but we do not present future intentions as completed achievements. Growth will depend on verified learning, durable partnerships and the ability to adapt programmes without losing their purpose.',
      'Listening comes before curriculum design. Learning then provides concepts and vocabulary; practice helps participants make decisions in realistic situations; multiplication turns individual understanding into peer support and local action. This cycle also sends new feedback to the programme team, making the method iterative rather than fixed.',
      'Our primary audience is young people across different backgrounds and levels of experience. Particular attention is given to girls and young women because they often face additional barriers in technology learning and leadership, but Sykoti is not a women-only organisation. Educators, community groups and grassroots innovators are important multipliers of youth impact.',
      'Working bilingually is not limited to translating a headline or navigation menu. It requires adapting explanations, examples, facilitation and support so that participants can ask questions and express uncertainty in the language they understand best. We continue improving language parity as programmes and resources develop.',
      'Leadership at Sykoti includes governance, programme stewardship, technical contribution and community representation. The wider community includes mentors, facilitators, youth fellows and partner organisations. Profiles are published progressively as roles, consent and biographical information are confirmed.',
    ],
    fr:[
      'L’association est née de défis qui se renforcent mutuellement : les risques en ligne augmentent avec la connectivité, les occasions de pratiquer les STIM restent inégales et de nombreux jeunes ont des idées sans mentorat ni parcours structuré. Sykoti traite ces enjeux ensemble, car sécurité, compétences et pouvoir d’agir sont étroitement liés.',
      'Nos actions actuelles sont volontairement concrètes : modules structurés, cohortes de jeunes, bourses, ateliers et projets communautaires. Notre vision à long terme est plus large, mais nous ne présentons pas les intentions futures comme des réalisations. La croissance reposera sur des apprentissages vérifiés et des partenariats durables.',
      'L’écoute précède la conception pédagogique. L’apprentissage fournit ensuite concepts et vocabulaire ; la pratique aide à décider dans des situations réalistes ; la multiplication transforme la compréhension individuelle en soutien entre pairs et action locale. Les retours ainsi obtenus nourrissent à nouveau le programme.',
      'Notre public principal est la jeunesse, dans toute sa diversité. Une attention particulière est accordée aux filles et jeunes femmes, qui rencontrent souvent des obstacles supplémentaires dans l’accès aux technologies et au leadership, mais Sykoti n’est pas une organisation réservée aux femmes. Les éducateurs et groupes communautaires jouent aussi un rôle multiplicateur.',
      'Le bilinguisme ne se limite pas à traduire un titre ou un menu. Il suppose d’adapter les explications, exemples, activités et formes d’accompagnement afin que les participants puissent poser leurs questions dans la langue qu’ils maîtrisent le mieux. Nous améliorons progressivement cette parité linguistique.',
      'Le leadership de Sykoti associe gouvernance, conduite des programmes, contribution technique et représentation communautaire. La communauté élargie comprend mentors, facilitateurs, jeunes participants et organisations partenaires. Les profils sont publiés progressivement, selon la confirmation des rôles et le consentement des personnes.',
    ],
  },
  programs:{
    en:[
      'The programme portfolio is deliberately focused. Numbers such as modules, languages and pathways describe the structure of the learning experience rather than marketing claims. Each programme has a defined audience, expected progression and level of support so participants understand what they are joining and what completion requires.',
      'CyberAmbassador moves from understanding digital environments to personal safety, information investigation and responsible leadership. Learners use a dedicated platform, complete practical missions and receive human follow-up. The title of CyberAmbassador is connected to successful completion rather than registration alone.',
      'The scholarship initiative broadens access to the first part of the learning pathway through a shorter bilingual format. It is valuable in its own right but does not automatically confer CyberAmbassador status. Participants who want to continue can use the experience as preparation for more complete future cohorts.',
      'Workshops respond to specific community needs and can be delivered with schools, youth organisations or local groups. Topics may include STEM discovery, account safety, scams, media verification, responsible artificial intelligence and digital wellbeing. Short formats are documented but are not confused with completion of a full programme.',
      'Images from workshops, platform activities, collaborative sessions and graduation help show the programme as a lived experience. They complement quantitative data by documenting how young people participate, ask questions and work together, while respecting consent and avoiding exaggerated claims about results.',
      'Prospective participants, mentors, schools and partners enter through different pathways. A short initial conversation helps determine the relevant programme, timing, audience, language and support needs. This prevents generic registration forms from creating expectations that the current programme cycle cannot meet.',
    ],
    fr:[
      'Le portefeuille de programmes reste volontairement ciblé. Les nombres de modules, langues et parcours décrivent la structure de l’apprentissage, et non des promesses marketing. Chaque programme possède un public, une progression attendue et un niveau d’accompagnement définis afin que les participants comprennent clairement leur engagement.',
      'CyberAmbassador progresse de la compréhension des environnements numériques vers la sécurité personnelle, l’analyse de l’information et le leadership responsable. Les apprenants utilisent une plateforme dédiée, réalisent des missions pratiques et bénéficient d’un suivi humain. Le titre est lié à la réussite du parcours, pas à une simple inscription.',
      'L’initiative de bourses élargit l’accès à la première partie du parcours dans un format bilingue plus court. Elle est utile en elle-même, mais ne donne pas automatiquement le titre de CyberAmbassadeur. Les participants souhaitant poursuivre peuvent s’en servir comme préparation à de futures cohortes complètes.',
      'Les ateliers répondent à des besoins précis et peuvent être organisés avec des écoles, associations de jeunes ou groupes locaux. Les thèmes incluent découverte des STIM, sécurité des comptes, arnaques, vérification de l’information, usage responsable de l’IA et bien-être numérique. Ces formats courts ne sont pas confondus avec un programme complet.',
      'Les images d’ateliers, activités sur plateforme, sessions collaboratives et remises de certificats montrent le programme comme une expérience vécue. Elles complètent les chiffres en documentant la participation, les questions et le travail collectif, dans le respect du consentement et sans exagération des résultats.',
      'Participants, mentors, écoles et partenaires suivent des voies d’entrée différentes. Un premier échange permet d’identifier le programme, le calendrier, le public, la langue et les besoins d’accompagnement. Cela évite qu’un formulaire générique crée des attentes incompatibles avec le cycle en cours.',
    ],
  },
  impact:{
    en:[
      'Our current footprint is rooted in Cameroonian communities and supported by digital tools that can connect participants beyond one location. Regional ambition does not mean claiming activity where none has occurred. Expansion will be documented progressively through named programmes, partners and verified delivery evidence.',
      'Youth-led projects are where learning becomes visible action. Topics range from account protection and misinformation to privacy and healthier social-media habits. The projects differ in scale, and their value lies in applying learning to a recognisable need rather than in presenting every activity as a large or permanent intervention.',
      'Participant testimony adds context to figures by showing what felt useful, difficult or unclear. We retain both positive comments and constructive criticism because language complexity, limited choices or insufficient support can reveal where programme design needs to change.',
      'Achievements describe work that has already been delivered and documented. Ambitions describe the direction we hope to pursue with sufficient learning, partnerships and resources. Keeping these categories separate protects the credibility of the organisation and gives partners a realistic basis for deciding how they can contribute.',
      'Our reporting method avoids adding overlapping participation figures as if every entry represented a unique person. It also distinguishes completion from attendance and short-term learning from longer-term behavioural change. More detailed definitions and source notes are available for partners who need to review the evidence.',
    ],
    fr:[
      'Notre empreinte actuelle est ancrée dans des communautés camerounaises et soutenue par des outils numériques permettant de relier des participants au-delà d’un seul lieu. Une ambition régionale ne signifie pas revendiquer des actions inexistantes. L’expansion sera documentée progressivement à travers des programmes, partenaires et preuves de mise en œuvre identifiés.',
      'Les projets portés par les jeunes rendent l’apprentissage visible dans l’action. Ils abordent la protection des comptes, la désinformation, la vie privée ou de meilleurs usages des réseaux sociaux. Leur échelle varie et leur valeur vient de l’application des acquis à un besoin réel, sans présenter chaque activité comme une intervention permanente.',
      'Les témoignages donnent du contexte aux chiffres en montrant ce qui a été utile, difficile ou peu clair. Nous conservons les appréciations positives comme les critiques constructives, car la complexité du langage, le manque de choix ou un accompagnement insuffisant révèlent les améliorations nécessaires.',
      'Les réalisations décrivent les actions déjà menées et documentées. Les ambitions indiquent la direction souhaitée avec suffisamment d’apprentissages, de partenaires et de ressources. Maintenir cette distinction protège la crédibilité de l’association et donne aux partenaires une base réaliste pour envisager leur contribution.',
      'Notre méthode évite d’additionner des chiffres de participation qui se recoupent comme s’il s’agissait toujours de personnes uniques. Elle distingue également présence, complétion, apprentissage à court terme et changement durable. Des définitions et notes de source plus détaillées sont disponibles pour les partenaires.',
    ],
  },
  resources:{
    en:[
      'The Civic Tech Dispatch is intended as an occasional, useful update rather than a high-volume marketing newsletter. Subscribers receive new guides, programme notes, open opportunities and evidence releases. Email addresses are used only for the requested communication and can be removed on request.',
      'Useful knowledge also comes from practitioners, educators and community members outside Sykoti. Guest case studies should describe a real situation, the response attempted, what was learned and any limits or unresolved questions. Submissions are reviewed for relevance, consent and responsible representation.',
    ],
    fr:[
      'Le Bulletin Tech civique est conçu comme une mise à jour occasionnelle et utile, et non comme une campagne marketing fréquente. Les abonnés reçoivent guides, nouvelles des programmes, opportunités et publications de résultats. Les adresses sont utilisées uniquement pour la communication demandée.',
      'Les connaissances utiles viennent aussi de praticiens, éducateurs et membres de communautés extérieurs à Sykoti. Les études de cas invitées doivent décrire une situation réelle, la réponse essayée, les apprentissages et les questions restantes. Les propositions sont examinées pour leur pertinence et le respect du consentement.',
    ],
  },
  'get-involved':{
    en:[
      'Transparency begins before funding is received. We clarify the intended use, delivery period, safeguarding responsibilities and evidence that can realistically be collected. Public recognition is agreed with the contributor and never takes priority over participant privacy or programme integrity.',
      'Partnership is based on shared purpose rather than logo collection. Schools, youth groups, civil-society organisations and technology actors can offer complementary strengths, including trusted local access, subject expertise, infrastructure and follow-up. Testimonials and partner references are published only with confirmation and consent.',
      'An expression of interest is the beginning of a conversation, not an automatic acceptance into a programme or partnership. Tell us who you are, the audience you hope to support, your preferred contribution and relevant timing. The team will respond with the most suitable next step based on current capacity.',
    ],
    fr:[
      'La transparence commence avant la réception des fonds. Nous précisons l’usage prévu, la période de mise en œuvre, les responsabilités de protection et les preuves pouvant être collectées de manière réaliste. La visibilité publique est décidée avec le contributeur et ne passe jamais avant la vie privée des participants.',
      'Le partenariat repose sur une mission partagée, et non sur une simple accumulation de logos. Écoles, groupes de jeunes, organisations de la société civile et acteurs technologiques apportent des forces complémentaires : accès local, expertise, infrastructure et suivi. Les références sont publiées uniquement après confirmation et consentement.',
      'Une manifestation d’intérêt ouvre une conversation ; elle ne constitue pas une admission automatique dans un programme ou un partenariat. Présentez votre organisation, le public visé, la contribution souhaitée et le calendrier. L’équipe proposera l’étape suivante la plus adaptée aux capacités actuelles.',
    ],
  },
  reports:{
    en:[
      'The document set is designed for different levels of review. A short impact brief provides an accessible overview, the programme document explains the learning model, and the data note records definitions and interpretation limits. Together they allow readers to understand both the work and the basis of its public claims.',
      'The report follows a clear sequence: organisational context, programme design, participant pathways, delivered activities, available evidence, governance considerations and next steps. This structure helps readers distinguish programme description from results and future intentions from completed work.',
      'Resource-allocation information explains the main categories required to deliver responsible youth programmes. Learning delivery includes facilitation and participant support; access covers tools and connectivity; community action supports practical projects; operations include coordination, safeguarding, monitoring and reporting.',
      'Partners conducting due diligence or researchers asking more detailed questions can request supporting information. Access depends on privacy, consent and the sensitivity of participant data. We share aggregated or anonymised material where possible and explain clearly when a requested data set cannot be released.',
    ],
    fr:[
      'L’ensemble documentaire répond à plusieurs niveaux de lecture. Une note d’impact courte offre une vue accessible, la présentation du programme explique le modèle pédagogique et la note méthodologique précise les définitions et limites d’interprétation. Ensemble, elles permettent de comprendre l’action et la base des affirmations publiques.',
      'Le rapport suit une séquence claire : contexte associatif, conception des programmes, parcours des participants, activités menées, preuves disponibles, gouvernance et prochaines étapes. Cette structure aide à distinguer la description du programme de ses résultats, et les intentions futures des actions achevées.',
      'Les informations sur les ressources expliquent les principales catégories nécessaires à des programmes jeunesse responsables. La formation comprend facilitation et suivi ; l’accès couvre outils et connexion ; l’action communautaire soutient les projets ; le fonctionnement inclut coordination, protection, suivi et reporting.',
      'Les partenaires réalisant une vérification ou les chercheurs ayant des questions détaillées peuvent demander des informations complémentaires. L’accès dépend de la vie privée, du consentement et de la sensibilité des données. Nous privilégions les éléments agrégés ou anonymisés et expliquons les limites de partage.',
    ],
  },
}

// Shared (language-independent) settings and images. File names without a
// folder resolve to public/cyberambassador/media(/gallery); uploads are URLs.
export const settings = {
  email: 'contact@sykoticenter.com',
  // Annual membership contribution, voted each year by the General Assembly.
  membershipFeeMin: '0',
  membershipFeeMax: '25 000',
  membershipInstalments: '3',
  membershipOpen: 'yes',
}

export const pageImages = {
  home: { hero: 'graduation-group.jpg', feature: 'community-action.jpg' },
  about: { hero: 'graduation-group.jpg' },
  programs: { hero: 'community-action.jpg' },
  impact: { hero: 'graduation-ceremony.png' },
  resources: { hero: 'cyber-attacks-webinar.png' },
  'get-involved': { hero: 'jeunes-connectes-workshop.png' },
  reports: { hero: 'fellows-2026.jpg' },
}

// Built-in images shipped with the site (shown in the admin media picker).
export const builtInImages = [
  ...['digital-citizenship','practical-stem','inclusive-access','innovation','project-support','leadership'].map((name) => `/img/placeholders/${name}.svg`),
  ...[1, 2, 3, 4, 5, 6, 7, 8].map((n) => `/img/placeholders/person-${n}.svg`),
  ...['community-action.jpg','cyber-attacks-webinar.png','fellows-2026.jpg','graduation-ceremony.png','graduation-group.jpg','jeunes-connectes-workshop.png','platform-dashboard.png','platform-home.png','platform-login.png','platform-module.png'],
  ...['bissa-marguerite.jpeg','cybera-fellows.jpeg','cybera-graduation-1.jpeg','cybera-graduation-2.jpeg','dinou-diane.jpeg','dinou-jordan.jpeg','esther-ngono.jpeg','kouatchou-lyne-dehlia.jpeg','lesly-voumo.jpeg','mokam-dora.jpeg','roxanna-moussombo.jpeg','samson-fawa.jpeg','tchoconte-larry.jpeg','toumpe-eric.jpeg','wilfried-adi-yafsia.jpeg'],
]
