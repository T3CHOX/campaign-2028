/* ============================================
   DECISION 2028 - INTEREST GROUPS & DEMOGRAPHICS
   ============================================ */

// Interest Groups with priorities and baseline leans
const INTEREST_GROUPS = {
    // Racial/Ethnic
    white: {
        name: 'White Voters',
        category: 'Racial/Ethnic',
        baseline: 2, // Slight R lean
        priorities: ['economy', 'taxation', 'immigration'],
        // 2024 validated-voter reference: Harris 43%, Trump 55%.
        support: { D: 43, R: 55, I: 2, G: 0, L: 0, PSL: 0 },
        elasticity: 0.8,
        thirdPartyPath: 'I'
    },
    black: {
        name: 'African American',
        category: 'Racial/Ethnic',
        baseline: -7, // Strong D lean
        priorities: ['criminal', 'healthcare', 'economy'],
        // 2024 validated-voter reference: Harris 83%, Trump 15%.
        support: { D: 83, R: 15, I: 2, G: 0, L: 0, PSL: 0 },
        elasticity: 0.2,
        thirdPartyPath: 'I'
    },
    hispanic: {
        name: 'Hispanic/Latino',
        category: 'Racial/Ethnic',
        baseline: -3,
        priorities: ['immigration', 'economy', 'healthcare'],
        // 2024 validated-voter reference: Harris 51%, Trump 48%.
        support: { D: 51, R: 48, I: 1, G: 0, L: 0, PSL: 0 },
        elasticity: 0.8,
        thirdPartyPath: 'I',
        ageSkew: null
    },
    asian: {
        name: 'Asian American',
        category: 'Racial/Ethnic',
        baseline: -2,
        priorities: ['economy', 'healthcare', 'immigration'],
        // 2024 validated-voter reference: Harris 57%, Trump 40%.
        support: { D: 57, R: 40, I: 3, G: 0, L: 0, PSL: 0 },
        elasticity: 0.8,
        thirdPartyPath: 'I',
        ageSkew: null
    },
    native: {
        name: 'Native American',
        category: 'Racial/Ethnic',
        baseline: -4, // Moderate D lean
        priorities: ['healthcare', 'environment', 'economy'],
        // 2024 American Electorate Voter Poll: Harris 57%, Trump 39%.
        support: { D: 57, R: 39, I: 4, G: 0, L: 0, PSL: 0 },
        elasticity: 0.8,
        thirdPartyPath: 'I'
    },
    
    // Religious
    evangelical: {
        name: 'Evangelical',
        category: 'Religious',
        baseline: 6,
        priorities: ['abortion', 'lgbtq', 'religious_freedom'],
        support: { D: 17, R: 81, I: 2, G: 0, L: 0, PSL: 0 },
        elasticity: 0.2,
        thirdPartyPath: 'L',
        ageSkew: 'old'
    },
    catholic: {
        name: 'Catholic',
        category: 'Religious',
        baseline: 1, // Slight R lean
        priorities: ['abortion', 'immigration', 'healthcare'],
        support: { D: 43, R: 55, I: 2, G: 0, L: 0, PSL: 0 },
        elasticity: 0.8,
        thirdPartyPath: 'I'
    },
    jewish: {
        name: 'Jewish',
        category: 'Religious',
        baseline: -3, // Moderate D lean
        priorities: ['israel', 'criminal', 'healthcare'],
        support: { D: 68, R: 29, I: 3, G: 0, L: 0, PSL: 0 },
        elasticity: 0.8,
        thirdPartyPath: 'I'
    },
    muslim: {
        name: 'Muslim',
        category: 'Religious',
        baseline: -5, // Strong D lean
        priorities: ['foreign', 'immigration', 'civil_rights'],
        support: { D: 58, R: 32, I: 10, G: 0, L: 0, PSL: 0 },
        elasticity: 0.2,
        thirdPartyPath: 'G'
    },
    secular: {
        name: 'Secular/None',
        category: 'Religious',
        baseline: -4, // Moderate D lean
        priorities: ['climate', 'healthcare', 'lgbtq'],
        support: { D: 70, R: 28, I: 2, G: 0, L: 0, PSL: 0 },
        elasticity: 0.8,
        thirdPartyPath: 'G'
    },
    
    // Occupational
    bluecollar: {
        name: 'Blue Collar Workers',
        category: 'Occupational',
        baseline: 1, // Slight R lean
        priorities: ['economy', 'trade', 'labor'],
        support: { D: 39, R: 58, I: 3, G: 0, L: 0, PSL: 0 },
        elasticity: 0.8,
        thirdPartyPath: 'I'
    },
    whitecollar: {
        name: 'White Collar Professionals',
        category: 'Occupational',
        baseline: -1, // Slight D lean
        priorities: ['economy', 'taxation', 'healthcare'],
        support: { D: 52, R: 45, I: 3, G: 0, L: 0, PSL: 0 },
        elasticity: 0.8,
        thirdPartyPath: 'I'
    },
    smallbusiness: {
        name: 'Small Business Owners',
        category: 'Occupational',
        baseline: 3, // Moderate R lean
        priorities: ['taxation', 'economy', 'govspend'],
        support: { D: 37, R: 60, I: 3, G: 0, L: 0, PSL: 0 },
        elasticity: 0.8,
        thirdPartyPath: 'I'
    },
    union: {
        name: 'Union Workers',
        category: 'Occupational',
        baseline: -4,
        priorities: ['labor', 'economy', 'healthcare'],
        support: { D: 51, R: 48, I: 1, G: 0, L: 0, PSL: 0 },
        elasticity: 0.2,
        thirdPartyPath: 'I',
        ageSkew: null
    },
    tech: {
        name: 'Tech Workers',
        category: 'Occupational',
        baseline: -2, // Slight D lean
        priorities: ['economy', 'immigration', 'climate'],
        support: { D: 62, R: 35, I: 3, G: 0, L: 0, PSL: 0 },
        elasticity: 0.8,
        thirdPartyPath: 'I'
    },
    farmers: {
        name: 'Farmers',
        category: 'Occupational',
        baseline: 4, // Moderate R lean
        priorities: ['trade', 'economy', 'govspend'],
        support: { D: 24, R: 73, I: 3, G: 0, L: 0, PSL: 0 },
        elasticity: 0.8,
        thirdPartyPath: 'I'
    },
    military: {
        name: 'Military/Veterans',
        category: 'Occupational',
        baseline: 3, // Moderate R lean
        priorities: ['military', 'foreign', 'economy'],
        support: { D: 36, R: 61, I: 3, G: 0, L: 0, PSL: 0 },
        elasticity: 0.8,
        thirdPartyPath: 'I'
    },
    
    // Demographic
    college: {
        name: 'College Educated',
        category: 'Demographic',
        baseline: -2,
        priorities: ['economy', 'climate', 'healthcare'],
        support: { D: 58, R: 42, I: 0, G: 0, L: 0, PSL: 0 },
        elasticity: 0.8,
        thirdPartyPath: 'I',
        ageSkew: 'young'
    },
    noncollege: {
        name: 'Non-College',
        category: 'Demographic',
        baseline: 2, // Slight R lean
        priorities: ['economy', 'jobs', 'immigration'],
        support: { D: 43, R: 57, I: 0, G: 0, L: 0, PSL: 0 },
        elasticity: 0.8,
        thirdPartyPath: 'I'
    },
    suburban: {
        name: 'Suburban Voters',
        category: 'Demographic',
        baseline: 0, // Neutral
        priorities: ['economy', 'healthcare', 'education'],
        support: { D: 52, R: 48, I: 0, G: 0, L: 0, PSL: 0 },
        elasticity: 0.8,
        thirdPartyPath: 'I'
    },
    urban: {
        name: 'Urban',
        category: 'Demographic',
        baseline: -5,
        priorities: ['climate', 'healthcare', 'criminal'],
        support: { D: 65, R: 33, I: 2, G: 0, L: 0, PSL: 0 },
        elasticity: 0.8,
        thirdPartyPath: 'I',
        ageSkew: 'young'
    },
    rural: {
        name: 'Rural',
        category: 'Demographic',
        baseline: 5,
        priorities: ['economy', 'guns', 'trade'],
        support: { D: 29, R: 69, I: 2, G: 0, L: 0, PSL: 0 },
        elasticity: 0.8,
        thirdPartyPath: 'I',
        ageSkew: 'old'
    },
    youth: {
        name: 'Youth (18-24)',
        category: 'Age',
        baseline: -5, // Strong D lean
        priorities: ['climate', 'abortion', 'economy'], 
        support: { D: 60, R: 35, I: 3, G: 2, L: 0, PSL: 0 },
        elasticity: 0.2,
        thirdPartyPath: 'G'
    },
    age25_44: {
        name: 'Adults (25-44)',
        category: 'Age',
        baseline: -2,
        priorities: ['economy', 'healthcare', 'taxation'],
        support: { D: 52, R: 44, I: 2, G: 1, L: 1, PSL: 0 },
        elasticity: 0.8,
        thirdPartyPath: 'I'
    },
    age45_64: {
        name: 'Middle Age (45-64)',
        category: 'Age',
        baseline: 2,
        priorities: ['taxation', 'economy', 'immigration'],
        support: { D: 45, R: 52, I: 2, G: 0, L: 1, PSL: 0 },
        elasticity: 0.8,
        thirdPartyPath: 'I'
    },
    seniors: {
        name: 'Seniors (65+)',
        category: 'Age',
        baseline: 4, // Moderate R lean
        priorities: ['healthcare', 'taxation', 'criminal'],
        support: { D: 44, R: 54, I: 2, G: 0, L: 0, PSL: 0 },
        elasticity: 0.8,
        thirdPartyPath: 'I'
    },
    
    // Political Orientation
    progressives: {
        name: 'Progressives',
        category: 'Political',
        internalOnly: true,
        canonicalFaction: 'activist_left',
        baseline: -8, // Very Strong D lean
        priorities: ['climate', 'healthcare', 'inequality'],
        support: { D: 86, R: 4, I: 10, G: 0, L: 0, PSL: 0 },
        elasticity: 0.2,
        thirdPartyPath: 'G'
    },
    libertarians: {
        name: 'Libertarians',
        category: 'Political',
        internalOnly: true,
        canonicalFaction: 'unaligned_center',
        baseline: 5, // Moderate R lean
        priorities: ['freedom', 'taxation', 'govspend'],
        support: { D: 8, R: 70, I: 22, G: 0, L: 0, PSL: 0 },
        elasticity: 0.8,
        thirdPartyPath: 'I'
    },
    maga: {
        name: 'MAGA',
        category: 'Political',
        internalOnly: true,
        canonicalFaction: 'america_first_conservative',
        baseline: 9, // Extreme R lean
        priorities: ['immigration', 'trade', 'nationalism'],
        support: { D: 0, R: 99, I: 1, G: 0, L: 0, PSL: 0 },
        elasticity: 0.2,
        thirdPartyPath: 'I'
    },
    centrists: {
        name: 'Centrists',
        category: 'Political',
        internalOnly: true,
        canonicalFaction: 'pragmatic_moderate',
        baseline: 0,
        priorities: ['economy', 'bipartisanship', 'pragmatism'],
        support: { D: 49, R: 48, I: 2, G: 0, L: 0, PSL: 1 },
        elasticity: 0.8,
        thirdPartyPath: 'I',
        ageSkew: null
    },
    
    // Gender/Orientation
    lgbtq_community: {
        name: 'LGBTQ+ Community',
        category: 'Gender/Orientation',
        baseline: -6, // Strong D lean
        priorities: ['lgbtq', 'healthcare', 'civil_rights'],
        support: { D: 78, R: 18, I: 4, G: 0, L: 0, PSL: 0 },
        elasticity: 0.2,
        thirdPartyPath: 'I'
    },
    
    women: {
        name: 'Women Voters',
        category: 'Gender/Orientation',
        baseline: -2,
        priorities: ['healthcare', 'abortion', 'economy'],
        support: { D: 53, R: 44, I: 3, G: 0, L: 0, PSL: 0 },
        elasticity: 0.8,
        thirdPartyPath: 'I',
        ageSkew: null
    },

    // v2 New Groups
    genz: {
        name: 'Gen Z',
        category: 'Demographic',
        internalOnly: true,
        baseline: -4,
        priorities: ['climate', 'economy', 'healthcare'],
        support: { D: 60, R: 34, I: 3, G: 3, L: 0, PSL: 0 },
        elasticity: 0.8,
        thirdPartyPath: 'I',
        ageSkew: 'young'
    },
    suburban_women: {
        name: 'Suburban Women',
        category: 'Gender/Orientation',
        baseline: -3,
        priorities: ['healthcare', 'abortion', 'economy'],
        support: { D: 59, R: 38, I: 2, G: 0, L: 0, PSL: 1 },
        elasticity: 0.8,
        thirdPartyPath: 'I',
        ageSkew: null
    }
};

// Player-facing background copy. These descriptions explain why a group may
// matter in a campaign without treating a broad identity as a single bloc.
// They are intentionally separate from the electorate's technical profile
// text so the interface can stay readable and the simulation can stay tuned.
const PLAYER_GROUP_DESCRIPTIONS = {
    white: 'White voters include people with European, Middle Eastern, and North African roots, as well as many multigenerational American families. This is the country’s largest and most internally diverse racial category, spanning rural, suburban, and urban communities with large differences in religion, education, class, region, and partisan identity. Campaigns often compete over the economy, immigration, public safety, cultural issues, and the perceived direction of the country.',
    black: 'Black voters include descendants of U.S. slavery, newer African and Caribbean immigrants, and communities shaped by distinct regional and religious traditions. Black political life has been strongly influenced by the civil-rights movement, voting-rights enforcement, economic inequality, criminal-justice policy, and the continuing importance of churches and civic organizations. The group is not politically uniform, but candidates are commonly judged on economic opportunity, health care, voting access, public safety, and protection from discrimination.',
    hispanic: 'Hispanic and Latino voters include people with roots across Mexico, Puerto Rico, Cuba, Central America, South America, Spain, and many other Spanish-speaking communities; Hispanic origin can occur alongside any race. The electorate is young, geographically dispersed, and politically varied, with family history, immigration experience, religion, class, generation, and local economic conditions shaping priorities. Campaigns commonly compete over wages and prices, immigration, health care, education, public safety, and foreign policy toward Latin America.',
    asian: 'Asian American voters include communities with roots in East Asia, Southeast Asia, and South Asia, each with different migration histories, languages, religions, and economic profiles. Some communities are long-established while others include newer immigrants, refugees, and second-generation families; educational attainment and household income also vary substantially. Candidates may encounter concerns about small-business conditions, education, housing costs, immigration and visas, hate crimes, health care, and U.S. policy in the Indo-Pacific.',
    native: 'Native American voters include citizens of federally and state-recognized tribes, Alaska Native communities, and other Native people with ties to sovereign tribal nations and Indigenous communities. Tribal sovereignty, treaty responsibilities, land and water rights, health-care access, infrastructure, and underinvestment in rural and reservation communities are central political contexts. Native voters live in many different regions and also bring varied partisan, religious, and economic perspectives.',
    evangelical: 'Evangelical voters are a cross-denominational religious constituency organized around the authority of the Bible, personal conversion, active faith communities, and public moral concerns. The group includes white, Black, Latino, Asian, and other congregations whose racial and regional experiences can produce different political priorities. Campaigns often encounter strong interest in abortion, religious liberty, family policy, education, immigration, Israel, and the role of religion in public life.',
    catholic: 'Catholic voters include parish communities with wide differences in race, ethnicity, immigration history, income, and theology. Catholic social teaching combines protection of human life and family with concern for poverty, workers, immigrants, health care, and the common good, while individual voters weigh these principles differently. The group can be competitive in elections because it contains both socially conservative and economically progressive traditions.',
    jewish: 'Jewish voters include Orthodox, Conservative, Reform, secular, and other communities with varied religious practice and political outlooks. American Jewish political life is shaped by concerns about antisemitism, civil rights, democratic institutions, religious freedom, and the security of Israel, but views on foreign policy and domestic issues are far from unanimous. Education, urban and suburban life, and family migration histories also contribute to internal diversity.',
    muslim: 'Muslim voters include Arab, Black, South Asian, African, Southeast Asian, convert, and other communities with different languages, immigration histories, and levels of religious observance. They often connect domestic questions about civil rights, discrimination, education, health care, and economic opportunity with U.S. policy in the Middle East and other Muslim-majority regions. The community contains a range of ideological and partisan views, and local leadership and foreign-policy events can be especially influential.',
    secular: 'Secular or religiously unaffiliated voters include atheists, agnostics, humanists, people who rarely attend services, and people who simply do not identify with a formal tradition. They are not a single philosophy, but many place emphasis on church–state separation, scientific institutions, personal autonomy, climate policy, health care, and equal treatment regardless of belief. Age, education, family background, and partisan identity produce substantial variation within the group.',
    bluecollar: 'Blue-collar workers include people in production, construction, transportation, maintenance, extraction, logistics, and other hands-on or industrial jobs. Their circumstances differ by union coverage, industry, region, job security, exposure to automation, and whether work is tied to manufacturing, energy, building, or services. Campaigns often compete over wages, trade, domestic production, workplace safety, taxes, energy prices, and whether government policy respects working people.',
    whitecollar: 'White-collar professionals include managers, administrators, analysts, educators, engineers, health professionals, lawyers, and other workers whose jobs are primarily office-based or specialized. They range from highly paid executives to public-sector and service professionals facing student debt, housing costs, and insecure employment. Their political priorities often combine economic stability, education, health care, taxes, institutional competence, and professional regulation.',
    smallbusiness: 'Small-business owners run local shops, farms, contractors, restaurants, professional practices, and other firms that depend on customers, employees, credit, and predictable rules. They may be employers and workers at the same time, making labor costs, taxes, health coverage, permitting, inflation, and access to capital immediate concerns. Their political views vary by industry and size, but campaigns often appeal to independence, local control, and protection from burdensome regulation.',
    union: 'Union workers are employees represented by organized labor through collective bargaining in both private and public workplaces. Their political experience is shaped by wages, benefits, job security, workplace safety, pensions, strikes, right-to-work laws, and the strength of local labor institutions. Union households are racially and regionally diverse, and members may prioritize economic issues while holding a range of views on social and cultural questions.',
    tech: 'Tech workers include software and data specialists, engineers, product and design staff, researchers, information-security professionals, and other employees in technology-intensive industries. The sector is concentrated in several metropolitan regions but supports jobs nationwide, including in smaller firms and public institutions. Voters in this group may weigh immigration and skilled visas, innovation, privacy, artificial intelligence, labor disruption, antitrust enforcement, climate policy, and the high cost of living in tech hubs.',
    farmers: 'Farmers and agricultural workers operate or work on farms, ranches, orchards, dairies, and other production systems that depend on land, water, labor, weather, credit, and transportation. Family farms, large commercial operations, specialty growers, and livestock producers face different market pressures, while rural communities often depend on agriculture beyond the farm gate. Campaign issues include trade and export markets, farm programs, input costs, immigration and seasonal labor, conservation, rural infrastructure, and land and water policy.',
    military: 'Military and veteran voters include active-duty personnel, reservists, National Guard members, retirees, and veterans from different service eras and branches, along with families whose lives are shaped by military service. Their priorities can include readiness, defense spending, veterans’ health care, disability benefits, housing, military family support, and the use of force abroad. The group is patriotic but politically diverse, and service experience does not dictate one view on every foreign or domestic issue.',
    college: 'College-educated voters include adults with a bachelor’s degree or advanced credential, from recent graduates to older professionals and retirees. Education intersects with occupation, income, geography, race, and age, so the group contains both highly progressive urban professionals and conservative suburban or rural constituencies. Campaigns often compete for this bloc through messages about economic opportunity, schools, climate, health care, democratic institutions, and competence in government.',
    noncollege: 'Non-college voters include adults without a four-year degree, including people with vocational training, community-college experience, certificates, apprenticeships, military training, or no postsecondary credential. This broad group includes workers and retirees across every region and income level, not only manual laborers. Campaigns commonly address wages, prices, health care, immigration, public safety, education and training, manufacturing, and respect for communities outside professional and university networks.',
    suburban: 'Suburban voters live in communities between dense urban centers and rural areas, from inner-ring neighborhoods to exurban subdivisions. Suburbs vary widely in race, density, housing cost, transit access, employment, school systems, and political culture, so they are often an important but heterogeneous battleground. Their concerns may include schools, property taxes, housing supply, commuting, public safety, reproductive rights, health care, and the tone and stability of national politics.',
    urban: 'Urban voters live in dense cities and metropolitan neighborhoods where housing, transit, public services, and diverse populations are concentrated. Urban communities include affluent professionals, working-class neighborhoods, immigrants, students, and long-standing communities facing displacement or disinvestment. Campaigns often compete over housing affordability, public safety, transit, jobs, climate resilience, health care, education, and the balance between local authority and federal investment.',
    rural: 'Rural voters live in small towns, open-country areas, farming regions, resource communities, and remote places that can be far from major services and media centers. Rural America is not economically uniform: agriculture, manufacturing, energy, tourism, commuting, tribal communities, and retirees all shape different local realities. Common campaign concerns include health-care access, broadband, roads, schools, jobs, land and water, public safety, gun rights, and skepticism toward distant institutions.',
    youth: 'Young voters ages 18–24 are entering the electorate while navigating school, first jobs, military service, family formation, and high housing and education costs. They are more likely than older voters to be renters, students, or financially dependent, and their political participation can be strongly affected by registration rules, campus networks, peer influence, and whether campaigns speak to their future. Climate, abortion, education debt, wages, housing, civil rights, and the risk of conflict can all be salient.',
    age25_44: 'Voters ages 25–44 are often balancing careers, caregiving, marriage or partnership, young children, and the cost of housing and child care. They include a wide range of education, income, race, religion, and employment experiences, from new professionals to long-time workers and small-business owners. Campaigns commonly compete over wages, family policy, health insurance, housing, taxes, education, immigration, and the economic prospects of the next decade.',
    age45_64: 'Voters ages 45–64 often occupy a middle stage of life marked by peak work and caregiving responsibilities, retirement planning, health concerns, and support for both children and older relatives. Some are approaching retirement while others face layoffs, retraining, or the need to keep working longer. Their priorities may include taxes, Social Security and Medicare, health costs, public safety, economic stability, immigration, and the condition of local communities.',
    seniors: 'Senior voters are adults 65 and older, including long-retired people, older workers, caregivers, and residents of every region and income level. Health care, prescription costs, Social Security, Medicare, housing, long-term care, and public safety often carry particular weight, but seniors also respond to taxes, foreign policy, cultural issues, and the welfare of younger generations. Older voters tend to participate at high rates, making them a closely watched constituency.',
    progressives: 'Progressives are an ideological coalition that seeks large-scale changes to reduce inequality, expand public provision, strengthen labor, protect civil rights, and accelerate climate action. The coalition includes activists, younger voters, organized labor allies, and policy-focused voters who may disagree on tactics but generally distrust incrementalism. They can be highly motivated by movement issues and highly sensitive to compromises they see as abandoning marginalized communities.',
    libertarians: 'Libertarians prioritize individual liberty, limited government, private choice, free expression, and skepticism toward concentrated state power. The coalition can include fiscal conservatives, civil-liberties advocates, antiwar voters, entrepreneurs, and people who are socially permissive but economically market-oriented. They may support lower taxes and spending while opposing surveillance, censorship, unnecessary regulation, and restrictions on personal conduct.',
    maga: 'MAGA is a populist-nationalist movement built around the belief that established political, media, corporate, and bureaucratic institutions have failed ordinary Americans. Its supporters commonly emphasize border enforcement, national sovereignty, cultural traditionalism, trade protection, law and order, and loyalty to a confrontational style of leadership. The movement includes rural, exurban, working-class, evangelical, and online constituencies with different economic interests but a shared distrust of the political establishment.',
    centrists: 'Centrists are voters who prefer practical, incremental, or cross-party solutions and are often uncomfortable with ideological extremes. They can include moderate Democrats, moderate Republicans, independents, and voters who make different choices issue by issue rather than identifying strongly with a party. Candidates compete for them through messages about competence, affordability, stability, public safety, fiscal responsibility, and reducing political conflict.',
    lgbtq_community: 'LGBTQ+ voters include lesbian, gay, bisexual, transgender, queer, and other sexual- and gender-minority people across every race, religion, age, class, and region. Their political context includes civil-rights protections, employment and housing discrimination, health care, family recognition, youth policy, public safety, and debates over gender identity. The community is diverse, but candidates’ language and record on equal treatment can strongly affect trust and turnout.',
    women: 'Women voters are a cross-cutting constituency spanning every race, age, religion, occupation, and partisan identity. They often experience public policy through health care, pregnancy and abortion access, caregiving, wages, education, housing, safety, and family finances, while also responding to national security and cultural issues. The group is not politically uniform, but candidates’ positions on reproductive autonomy and the practical costs of family life can be especially consequential.',
    genz: 'Generation Z is the cohort coming of age in an era of smartphones, social media, climate anxiety, political polarization, school disruption, and high housing and education costs. Its members are racially diverse and include students, workers, young parents, military personnel, and people outside college settings. Their participation is shaped by digital communication, peer networks, distrust of institutions, and whether campaigns offer credible plans for economic security and personal rights.',
    suburban_women: 'Suburban women combine the concerns of suburban households with the policy experiences of women as workers, caregivers, parents, homeowners, renters, and patients. This is a politically mixed constituency: some prioritize abortion rights and public schools, others emphasize taxes, crime, immigration, or religious values, and many are sensitive to candidates’ temperament. Campaigns often compete here through messages about family finances, safety, education, health care, housing, and governing stability.',
    hispanic_004: 'Mexican American voters include families whose roots may reach back generations in the Southwest as well as newer immigrants and descendants of migrants from across Mexico. Communities vary between border regions, large cities, agricultural areas, and fast-growing suburbs, with different experiences of labor, immigration, language, and cultural identity. Wages, prices, immigration enforcement, education, health care, public safety, and family opportunity are common campaign contexts.',
    hispanic_005: 'Puerto Rican voters are U.S. citizens by birth, whether they live on the island or on the mainland, and many families move between places such as Florida, New York, Pennsylvania, and Puerto Rico. Political concerns can include the island’s economic condition and political status, disaster recovery, health care, housing, jobs, and the cost of living, alongside the same domestic issues that shape other voters. Community ties, migration experience, religion, and generation create significant internal diversity.',
    hispanic_006: 'Cuban American voters include descendants of several migration waves, from people who left after the Cuban Revolution to later arrivals and their U.S.-born children. In South Florida especially, family history makes Cuba, political repression, exile, remittances, migration, and the U.S. embargo unusually personal, while concerns about inflation, crime, schools, and small business remain part of everyday politics. The community is diverse, but anti-communism and skepticism toward policies described as socialist can be powerful campaign frames for some voters; humanitarian aid, family travel, food, and medicine can complicate a simple hardline-versus-engagement divide.',
    hispanic_007: 'Dominican American voters include families connected to the Dominican Republic through migration, remittances, language, and close cultural networks. The community is concentrated in major metropolitan areas but is increasingly present in growing suburbs and other regions. Campaigns may encounter concerns about wages, housing, education, health care, immigration, small business, public safety, and the treatment of the Caribbean and Latin America.',
    hispanic_025: 'Venezuelan American voters include people who arrived in different periods and for different reasons, including political repression, economic collapse, family reunification, and professional opportunity. Many have direct experience with or family memories of authoritarianism, inflation, shortages, and displacement, making Venezuela policy and anti-socialist rhetoric unusually salient for some voters. The group also includes U.S.-born family members and newer arrivals with varied legal status, class, religion, and partisan outlooks.',
    hispanic_central: 'Central American American voters include people with roots in countries such as El Salvador, Guatemala, Honduras, Nicaragua, Costa Rica, Panama, and Belize. Migration stories range from family reunification and work to displacement caused by violence, political instability, natural disasters, or economic hardship. Immigration policy, wages, remittances, public safety, housing, education, and U.S. engagement with the region can all matter, but national origin and generation produce different priorities.',
    hispanic_south: 'South American American voters include communities with roots in Colombia, Venezuela, Ecuador, Peru, Brazil, Argentina, Chile, Bolivia, Paraguay, Uruguay, and other countries. They include refugees, political exiles, students, professionals, entrepreneurs, and long-established families, so their economic and foreign-policy concerns vary widely. Campaigns may compete over inflation and wages, immigration, small business, public safety, family ties, and U.S. policy toward Latin America.',
    hispanic_spanish: 'Spanish Americans and Spaniards in the United States include immigrants and descendants of families connected to Spain, with identities that may be cultural, national, linguistic, or tied to broader Hispanic communities. They are present in different regions and generations and do not share one political outlook. Their concerns generally overlap with other voters—housing, wages, health care, education, immigration, and foreign affairs—while language, European ties, and local community institutions can add distinctive context.',
    hispanic_other: 'This broad Hispanic/Latino category includes people who report an origin not separately listed in the major national-origin groups. It can include smaller Caribbean, Central American, South American, and Spanish-speaking communities, as well as people with mixed or less commonly captured family histories. Campaigns should expect wide variation in language, migration experience, religion, class, and priorities rather than treating the group as a single bloc.',
    pacific: 'Native Hawaiian and Pacific Islander voters include Native Hawaiian communities and people with roots in Samoa, Guam, the Northern Mariana Islands, Micronesia, the Marshall Islands, and other Pacific nations and territories. Their political context includes Indigenous sovereignty, military presence, remoteness, climate and disaster risk, housing costs, health disparities, and the high cost of transportation and basic goods. Island communities are distinct from one another and often have strong local, family, and cultural institutions.',
    multiracial: 'Multiracial voters identify with two or more racial groups and include people whose family histories, cultures, and community ties cross conventional racial categories. They are present at every age and income level, and their experiences can include negotiating multiple identities, family traditions, and institutions. Political priorities vary widely, but candidates’ approaches to civil rights, belonging, education, health care, and representation can shape how this group evaluates them.',
    other_race: 'Voters who select another race category include people whose identities do not fit neatly into the major federal race categories or who describe themselves using a national, ethnic, Indigenous, or other community identity. This is a diverse residual category rather than a unified culture or political movement. Campaigns should avoid assuming a common ideology and instead focus on the local communities, family histories, and policy concerns represented in a given constituency.'
};

// National 2024 reference anchors used by the electorate's initialization
// rake. They apply only to the exclusive racial/ethnic cells and use a
// Democratic-versus-Republican denominator, leaving any active third-party
// county shares intact. They do not describe a uniform voter within a group.
//
// Pew's post-election validated-voter study supplies the White, Black,
// Hispanic and Asian values. The Native reference uses the 2024 American
// Electorate Voter Poll, whose Native sample was designed to address the
// limitations of conventional national exit-poll sampling for this group.
var REFERENCE_2024_RACE_VOTE_CHOICE = {
    year: 2024,
    source: {
        pew: 'https://www.pewresearch.org/politics/2025/06/26/voting-patterns-in-the-2024-election/',
        native: 'https://www.brookings.edu/articles/the-native-american-vote-in-the-2024-presidential-election/'
    },
    twoPartyDemocraticShare: {
        white: 43 / (43 + 55),
        black: 83 / (83 + 15),
        hispanic: 51 / (51 + 48),
        asian: 57 / (57 + 40),
        native: 57 / (57 + 39)
    }
};

// Presidential turnout baselines. Race/ethnicity and age values use the UF
// Election Lab's reweighted 2024 CPS Voting and Registration Supplement. The
// 2024 presidential cycle is the recent, ordinary-cycle anchor for 2028; the
// unusually high 2020 pandemic-election rates are retained in the source CSV
// but are not treated as the default. Education categories are crosswalked to
// this simulator's BA-or-higher split (the source publishes broader bands).
var PRESIDENTIAL_TURNOUT_CONTEXT = {
    electionType: 'presidential',
    benchmarkYear: 2024,
    source: 'UF Election Lab CPS Demographic Turnout Rates v2.1',
    sourceFile: 'data/CPS_Demographic_Turnout_Rates_v2.1.csv'
};

var BASE_TURNOUT_RATES = {
    white: 0.7095,
    black: 0.5980,
    hispanic: 0.4725,
    asian: 0.5609,
    native: 0.5609,
    pacific: 0.5609,
    multiracial: 0.5609,
    other_race: 0.5609,
    evangelical: 0.80,
    catholic: 0.66,
    jewish: 0.76,
    muslim: 0.61,
    secular: 0.68,
    bluecollar: 0.56,
    whitecollar: 0.74,
    smallbusiness: 0.76,
    union: 0.68,
    tech: 0.73,
    farmers: 0.75,
    military: 0.70,
    college: 0.7900,
    noncollege: 0.5200,
    suburban: 0.69,
    urban: 0.61,
    rural: 0.66,
    youth: 0.4851,
    age25_44: 0.5999,
    age45_64: 0.7140,
    seniors: 0.7561,
    genz: 0.4851,
    progressives: 0.78,
    libertarians: 0.67,
    maga: 0.82,
    centrists: 0.63,
    lgbtq_community: 0.71,
    women: 0.66
};

// Candidate/VP group modifiers are embedded directly in CANDIDATES and VPS entries as groupBoosts/groupDebuffs.

// PAC definitions
const PACS = {
    bigoil: {
        name: 'Big Oil & Gas',
        category: 'Industry',
        priority_issue: 'energy',
        desired_position: 7, // Pro-fossil fuels
        contribution: 25, // $25M
        description: 'Represents oil, natural-gas, and related energy companies whose business depends on continued production, infrastructure investment, and access to domestic and international markets. It generally favors permitting, pipeline and export approvals, predictable tax rules, and a slower or more market-led transition away from fossil fuels, while arguing that energy security and affordable fuel require continued conventional production.',
        vulnerability: {
            id: 'oil-money',
            label: 'Oil money attack',
            risk: 0.18,
            favorability: -0.05,
            turnoutHits: { progressives: -0.06, urban: -0.03 },
            story: 'Opposition media highlights fossil fuel money ties.'
        }
    },
    unions: {
        name: 'AFL-CIO (Labor Unions)',
        category: 'Labor',
        priority_issue: 'labor',
        desired_position: -6, // Pro-labor
        contribution: 20,
        description: 'Represents a federation of unions across construction, manufacturing, transportation, public services, health care, education, and other industries. It advocates collective bargaining, higher wages, workplace safety, pensions, paid leave, and labor standards, and typically supports policies that make organizing easier and attach strong job and wage requirements to public investment.',
        vulnerability: {
            id: 'labor-boss',
            label: 'Union boss backlash',
            risk: 0.12,
            favorability: -0.03,
            turnoutHits: { smallbusiness: -0.04, suburban: -0.02 },
            story: 'Opponents frame the campaign as captured by union bosses.'
        }
    },
    nra: {
        name: 'NRA (Gun Rights)',
        category: 'Grassroots',
        priority_issue: 'guns',
        desired_position: 8, // Pro-gun rights
        contribution: 18,
        description: 'Represents gun owners, firearms instructors, sport shooters, hunters, and Second Amendment advocates. It generally opposes bans and broad licensing or registration requirements, emphasizes self-defense and constitutional protections, and supports enforcement against violent offenders while arguing that lawful ownership should not be burdened by restrictions aimed at criminal misuse.',
        vulnerability: {
            id: 'gun-lobby',
            label: 'Gun lobby headline',
            risk: 0.16,
            favorability: -0.04,
            turnoutHits: { suburban: -0.05, women: -0.04 },
            story: 'Gun lobby donations trigger suburban backlash.'
        }
    },
    plannedparenthood: {
        name: 'Planned Parenthood',
        category: 'Grassroots',
        priority_issue: 'abortion',
        desired_position: -7, // Pro-choice
        contribution: 15,
        description: 'Represents a reproductive-health provider and advocacy network focused on contraception, abortion access, pregnancy care, cancer screening, and sex education. Its political agenda generally supports legal abortion access, public funding for reproductive care, protection for providers and patients, and opposition to policies that allow states or government officials to override a patient’s medical decision.',
        vulnerability: {
            id: 'abortion-rights',
            label: 'Abortion rights controversy',
            risk: 0.14,
            favorability: -0.03,
            turnoutHits: { evangelical: -0.06, rural: -0.03 },
            story: 'Social conservatives attack the campaign over abortion funding.'
        }
    },
    techindustry: {
        name: 'Tech Industry PAC',
        category: 'Industry',
        priority_issue: 'immigration',
        desired_position: -4, // Pro-immigration
        contribution: 30,
        description: 'Represents technology companies and the wider innovation economy, including employers that recruit engineers, researchers, and other specialized workers globally. It generally favors skilled-immigration pathways, research investment, digital infrastructure, competition, and rules that allow firms to scale, while also seeking predictable regulation of artificial intelligence, privacy, and online markets.',
        vulnerability: {
            id: 'tech-money',
            label: 'Tech billionaire ties',
            risk: 0.12,
            favorability: -0.02,
            turnoutHits: { bluecollar: -0.03 },
            story: 'Opponents tie the campaign to Silicon Valley elites.'
        }
    },
    wallstreet: {
        name: 'Wall Street PAC',
        category: 'Wall Street',
        priority_issue: 'taxation',
        desired_position: 6, // Low taxes
        contribution: 35,
        description: 'Represents banks, investment firms, asset managers, and other financial institutions whose business depends on capital formation and functioning securities markets. It generally favors lower and more predictable taxes on investment, stable financial regulation, and policies that encourage growth, while opponents argue that the sector has outsized influence and should contribute more to public revenue.',
        vulnerability: {
            id: 'wall-street',
            label: 'Wall Street capture',
            risk: 0.18,
            favorability: -0.05,
            turnoutHits: { progressives: -0.05, union: -0.04 },
            story: 'Wall Street donor coverage undermines populist appeal.'
        }
    },
    environmental: {
        name: 'Environmental Defense Fund',
        category: 'Grassroots',
        priority_issue: 'climate',
        desired_position: -8, // Pro-environment
        contribution: 12,
        description: 'Represents environmental advocates, scientists, conservation partners, and communities seeking faster reductions in greenhouse-gas emissions. It generally supports clean-energy deployment, pollution controls, climate investment, conservation, and stronger accountability for major emitters, while emphasizing public health, climate resilience, and a transition that protects workers and vulnerable communities.',
        vulnerability: {
            id: 'green-agenda',
            label: 'Green agenda backlash',
            risk: 0.1,
            favorability: -0.02,
            turnoutHits: { farmers: -0.03, rural: -0.03 },
            story: 'Opponents warn climate donors threaten rural jobs.'
        }
    }
};

// Coalition breakpoints for loyalty/turnout collapse
const COALITION_BREAKPOINTS = {
    progressives: {
        label: 'Progressives',
        parties: ['D', 'G', 'PSL'],
        requirements: [
            { issue: 'climate', max: -6, label: '65%+ climate investment' },
            { issue: 'healthcare', max: -4, label: 'Public option or better' }
        ],
        warningWeeks: 2,
        collapseWeeks: 4,
        riskLeak: 0.06,
        collapseLeak: 0.18,
        leakTo: { G: 0.6, PSL: 0.4 }
    },
    union: {
        label: 'Union Workers',
        parties: ['D'],
        requirements: [
            { issue: 'labor', max: -3, label: 'Union-first labor policy' }
        ],
        warningWeeks: 2,
        collapseWeeks: 4,
        riskLeak: 0.05,
        collapseLeak: 0.16,
        leakTo: { _opponent: 0.5, _undecided: 0.5 }
    },
    evangelical: {
        label: 'Evangelicals',
        parties: ['R'],
        requirements: [
            { issue: 'abortion', min: 4, label: 'Abortion restrictions' },
            { issue: 'lgbtq', min: 2, label: 'Religious carve-outs' }
        ],
        warningWeeks: 2,
        collapseWeeks: 3,
        riskLeak: 0.07,
        collapseLeak: 0.20,
        leakTo: { _undecided: 0.7, L: 0.3 }
    },
    smallbusiness: {
        label: 'Small Business',
        parties: ['R'],
        requirements: [
            { issue: 'taxation', min: 4, label: 'Pro-growth tax cuts' }
        ],
        warningWeeks: 2,
        collapseWeeks: 4,
        riskLeak: 0.05,
        collapseLeak: 0.16,
        leakTo: { L: 0.6, _undecided: 0.4 }
    },
    muslim: {
        label: 'Muslim Voters',
        parties: ['D', 'G', 'PSL'],
        requirements: [
            { issue: 'israel', max: -3, label: 'Ceasefire-forward stance' }
        ],
        warningWeeks: 2,
        collapseWeeks: 3,
        riskLeak: 0.08,
        collapseLeak: 0.22,
        leakTo: { G: 0.5, _undecided: 0.5 }
    },
    // v2 New Coalitions
    genz_bloc: {
        label: 'Gen Z Bloc',
        parties: ['D', 'G', 'PSL'],
        requirements: [
            { issue: 'climate', max: -4, label: 'Aggressive climate action' },
            { issue: 'economy', max: -3, label: 'Student debt relief' }
        ],
        warningWeeks: 2,
        collapseWeeks: 3,
        riskLeak: 0.06,
        collapseLeak: 0.17,
        leakTo: { G: 0.4, _undecided: 0.4, PSL: 0.2 }
    },
    maga_core: {
        label: 'MAGA Core',
        parties: ['R'],
        requirements: [
            { issue: 'immigration', min: 5, label: 'Hardline immigration stance' },
            { issue: 'trade', min: 3, label: 'America First trade policy' }
        ],
        warningWeeks: 2,
        collapseWeeks: 3,
        riskLeak: 0.10,
        collapseLeak: 0.24,
        leakTo: { _undecided: 0.8, _opponent: 0.2 }
    },
    moderate_republicans: {
        label: 'Moderate Republicans',
        parties: ['R'],
        requirements: [
            { issue: 'abortion', max: 0, label: 'Moderate abortion stance' },
            { issue: 'lgbtq', max: 0, label: 'Tolerant LGBTQ+ stance' }
        ],
        warningWeeks: 2,
        collapseWeeks: 4,
        riskLeak: 0.05,
        collapseLeak: 0.15,
        leakTo: { _undecided: 0.6, D: 0.4 }
    }
};

// Cross-pressure penalties when courting opposing coalitions — v2 expanded
const COALITION_CROSS_PRESSURES = [
    {
        id: 'secular-backlash',
        label: 'Evangelical backlash to secular messaging',
        triggerIssue: 'lgbtq',
        triggerMax: -6,
        targetGroup: 'evangelical',
        penalty: 0.06
    },
    {
        id: 'hispanic-immigration',
        label: 'Hispanic backlash to hardline immigration',
        triggerIssue: 'immigration',
        triggerMin: 7,
        targetGroup: 'hispanic',
        penalty: 0.08
    },
    {
        id: 'maga-immigration-soft',
        label: 'MAGA backlash to soft immigration',
        triggerIssue: 'immigration',
        triggerMax: -7,
        targetGroup: 'maga',
        penalty: 0.10
    },
    {
        id: 'smallbiz-labor',
        label: 'Small business backlash to pro-labor',
        triggerIssue: 'labor',
        triggerMin: 5,
        targetGroup: 'smallbusiness',
        penalty: 0.06
    },
    {
        id: 'muslim-israel',
        label: 'Muslim backlash to pro-Israel stance',
        triggerIssue: 'israel',
        triggerMin: 5,
        targetGroup: 'muslim',
        penalty: 0.09
    },
    {
        id: 'jewish-palestine',
        label: 'Jewish backlash to pro-Palestine stance',
        triggerIssue: 'israel',
        triggerMax: -5,
        targetGroup: 'jewish',
        penalty: 0.07
    },
    {
        id: 'rural-climate',
        label: 'Rural backlash to aggressive climate policy',
        triggerIssue: 'climate',
        triggerMin: 6,
        targetGroup: 'rural',
        penalty: 0.05
    },
    {
        id: 'centrist-healthcare',
        label: 'Centrist backlash to single payer',
        triggerIssue: 'healthcare',
        triggerMin: 5,
        targetGroup: 'centrists',
        penalty: 0.04
    },
    {
        id: 'seniors-studentdebt',
        label: 'Senior backlash to student debt forgiveness',
        triggerIssue: 'economy',
        triggerMax: -5,
        targetGroup: 'seniors',
        penalty: 0.04
    }
];

// State demographic compositions (% of each group)
const STATE_DEMOGRAPHICS = {
    'CA': {
        white: 38, black: 6, hispanic: 39, asian: 15, native: 2,
        evangelical: 12, catholic: 28, jewish: 3, muslim: 2, secular: 35,
        bluecollar: 20, whitecollar: 35, union: 16, tech: 12,
        college: 42, suburban: 45, urban: 48, rural: 7, youth: 22, seniors: 18,
        lgbtq_community: 6, women: 51
    },
    'TX': {
        white: 42, black: 12, hispanic: 39, asian: 5, native: 2,
        evangelical: 31, catholic: 23, jewish: 1, muslim: 2, secular: 20,
        bluecollar: 28, whitecollar: 30, union: 5, farmers: 3,
        college: 32, suburban: 35, urban: 40, rural: 25, youth: 24, seniors: 16,
        lgbtq_community: 4, women: 51
    },
    'FL': {
        white: 54, black: 16, hispanic: 26, asian: 3, native: 1,
        evangelical: 24, catholic: 21, jewish: 3, muslim: 1, secular: 24,
        bluecollar: 24, whitecollar: 32, military: 8,
        college: 35, suburban: 45, urban: 35, rural: 20, youth: 20, seniors: 28,
        lgbtq_community: 5, women: 51
    },
    'NY': {
        white: 56, black: 15, hispanic: 19, asian: 9, native: 1,
        evangelical: 8, catholic: 31, jewish: 9, muslim: 3, secular: 30,
        bluecollar: 18, whitecollar: 40, union: 24,
        college: 45, suburban: 35, urban: 60, rural: 5, youth: 21, seniors: 19,
        lgbtq_community: 6, women: 52
    },
    'PA': {
        white: 77, black: 11, hispanic: 8, asian: 4, native: 0,
        evangelical: 15, catholic: 24, jewish: 3, muslim: 1, secular: 28,
        bluecollar: 32, whitecollar: 30, union: 14,
        college: 35, suburban: 45, urban: 30, rural: 25, youth: 19, seniors: 22,
        lgbtq_community: 4, women: 51
    }
};

// Default demographics for states not specified
var DEFAULT_DEMOGRAPHICS = {
    white: 70, black: 10, hispanic: 12, asian: 5, native: 3,
    evangelical: 20, catholic: 20, jewish: 2, muslim: 1, secular: 25,
    bluecollar: 25, whitecollar: 30, smallbusiness: 8, union: 10,
    college: 35, suburban: 40, urban: 30, rural: 30, youth: 20, seniors: 20,
    lgbtq_community: 4, women: 51
};
