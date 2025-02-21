// Global variables
const democratNames = [
    "Tim Walz", "Kamala Harris", "Joe Biden", "Chuck Schumer", "Elizabeth Warren",
    "Bernie Sanders", "Cory Booker", "Chris Coons", "Dick Durbin", "Mark Kelly",
    "Tammy Baldwin", "Jon Ossoff", "Pramila Jayapal", "Alexandria Ocasio-Cortez", "Ilhan Omar",
    "Nancy Pelosi", "Melanie Stansbury", "Eleanor Holmes Norton", "Jamie Raskin", "Bennie Thompson",
    "Anthony Fauci", "Volodymyr Zelensky", "Ketanji Brown Jackson", "Sonia Sotomayor", "Elena Kagan",
    "Merrick Garland", "Janet Yellen", "Xavier Becerra", "Pete Buttigieg", "Gina Raimondo",
    "Deb Haaland", "Tom Vilsack", "Lloyd Austin", "Antony Blinken", "Jennifer Granholm",
    "Marty Walsh", "Miguel Cardona", "Rochelle Walensky", "Robert Califf", "Lina Khan",
    "Jessica Rosenworcel", "Christopher Wray", "Avril Haines", "Michael Regan", "Shalanda Young",
    "Rohit Chopra", "Julie Su", "Eric Lander", "John Kerry", "Al Gore"
];
const democratDetails = {
    "Tim Walz": "(MN Governor) – Opposes efficiency cuts to progressive programs, per web",
    "Kamala Harris": "(VP, CA) – Opposes audits undermining Biden’s policies, per web",
    "Joe Biden": "(President, DE) – Opposes audits threatening Democratic priorities, per web",
    "Chuck Schumer": "(NY, Senator) – Opposes audits cutting social programs, per web",
    "Elizabeth Warren": "(MA, Senator) – Opposes audits on consumer protections, per web",
    "Bernie Sanders": "(VT, Senator) – Opposes efficiency cuts to safety nets, per web",
    "Cory Booker": "(NJ, Senator) – Opposes audits on housing/education, per web",
    "Chris Coons": "(DE, Senator) – Opposes audits weakening foreign aid, per web",
    "Dick Durbin": "(IL, Senator) – Opposes cuts to judicial/labor, per web",
    "Mark Kelly": "(AZ, Senator) – Opposes audits on space/veterans, per web",
    "Tammy Baldwin": "(WI, Senator) – Opposes cuts to healthcare/labor, per web",
    "Jon Ossoff": "(GA, Senator) – Opposes audits on tech/infrastructure, per web",
    "Pramila Jayapal": "(WA, House Rep) – Opposes efficiency cuts to progressives, per web",
    "Alexandria Ocasio-Cortez": "(NY, House Rep) – Opposes audits on Green New Deal, per web",
    "Ilhan Omar": "(MN, House Rep) – Opposes audits reducing social justice, per web",
    "Nancy Pelosi": "(CA, Former Speaker) – Opposes audits cutting Democratic priorities, per web",
    "Melanie Stansbury": "(NM, House Rep) – Opposes cuts to working-class programs, per web",
    "Eleanor Holmes Norton": "(DC, House Delegate) – Opposes audits harming D.C. programs, per web",
    "Jamie Raskin": "(MD, House Rep) – Opposes audits on Jan. 6 work, per web",
    "Bennie Thompson": "(MS, House Rep) – Opposes audits threatening Jan. 6 findings, per web",
    "Anthony Fauci": "(Former NIAID Director) – Opposes audits of COVID response, per web",
    "Volodymyr Zelensky": "(Ukraine President) – Opposes audits cutting Ukraine aid, per web",
    "Ketanji Brown Jackson": "(U.S. Supreme Court Justice) – Opposes audits on judiciary, per web",
    "Sonia Sotomayor": "(U.S. Supreme Court Justice) – Opposes audits on social programs, per web",
    "Elena Kagan": "(U.S. Supreme Court Justice) – Opposes audits politicizing judiciary, per web",
    "Merrick Garland": "(U.S. Attorney General) – Opposes audits of DOJ, per web",
    "Janet Yellen": "(U.S. Treasury Secretary) – Opposes Fed audits/cuts, per web",
    "Xavier Becerra": "(U.S. HHS Secretary) – Opposes audits of health programs, per web",
    "Pete Buttigieg": "(U.S. Transportation Secretary) – Opposes audits on infrastructure, per web",
    "Gina Raimondo": "(U.S. Commerce Secretary) – Opposes audits on commerce, per web",
    "Deb Haaland": "(U.S. Interior Secretary) – Opposes cuts to environmental programs, per web",
    "Tom Vilsack": "(U.S. Agriculture Secretary) – Opposes audits of USDA, per web",
    "Lloyd Austin": "(U.S. Defense Secretary) – Opposes audits of DOD, per web",
    "Antony Blinken": "(U.S. State Secretary) – Opposes audits on foreign aid, per web",
    "Jennifer Granholm": "(U.S. Energy Secretary) – Opposes audits on energy, per web",
    "Marty Walsh": "(Former U.S. Labor Secretary) – Opposes cuts to labor, per web",
    "Miguel Cardona": "(U.S. Education Secretary) – Opposes audits of education, per web",
    "Rochelle Walensky": "(Former CDC Director) – Opposes audits of COVID response, per web",
    "Robert Califf": "(FDA Commissioner) – Opposes audits of health agencies, per web",
    "Lina Khan": "(FTC Chair) – Opposes audits on consumer protections, per web",
    "Jessica Rosenworcel": "(FCC Chair) – Opposes audits on communications, per web",
    "Christopher Wray": "(FBI Director) – Opposes audits of FBI, per web",
    "Avril Haines": "(U.S. DNI Director) – Opposes audits on intelligence, per web",
    "Michael Regan": "(EPA Administrator) – Opposes cuts to environmental programs, per web",
    "Shalanda Young": "(OMB Director) – Opposes audits of budgeting, per web",
    "Rohit Chopra": "(CFPB Director) – Opposes audits on consumer finance, per web",
    "Julie Su": "(U.S. Acting Labor Secretary) – Opposes cuts to labor, per web",
    "Eric Lander": "(Former OSTP Director) – Opposes audits of science, per web",
    "John Kerry": "(Former Special Envoy) – Opposes audits on climate, per web",
    "Al Gore": "(Former VP) – Opposes audits reducing climate action, per web"
};

const agencyAcronyms = [
    "FEMA", "CIA", "FBI", "HUD", "USDA", "DOD", "DOE", "STATE", "Treasury", "DOJ",
    "NASA", "VA", "EPA", "IRS", "SSA", "USPS", "NPS", "GSA", "USAID", "OPM",
    "SBA", "DOI", "DOT", "CDC", "NIH", "FDA", "DEA", "SEC", "DHS", "DOC",
    "ED", "DOL", "TSA", "BOP", "NRC", "ATF", "FAA", "FTC", "FCC", "OSHA",
    "HHS", "OMB", "CFPB", "NCIS", "ICE", "CBP", "USCG", "AMTRAK", "NSF", "Smithsonian"
];
const agencyFullNames = {
    "FEMA": "Federal Emergency Management Agency",
    "CIA": "Central Intelligence Agency",
    "FBI": "Federal Bureau of Investigation",
    "HUD": "U.S. Department of Housing and Urban Development",
    "USDA": "U.S. Department of Agriculture",
    "DOD": "U.S. Department of Defense",
    "DOE": "U.S. Department of Energy",
    "STATE": "U.S. Department of State",
    "Treasury": "U.S. Department of the Treasury",
    "DOJ": "U.S. Department of Justice",
    "NASA": "National Aeronautics and Space Administration",
    "VA": "U.S. Department of Veterans Affairs",
    "EPA": "Environmental Protection Agency",
    "IRS": "Internal Revenue Service",
    "SSA": "Social Security Administration",
    "USPS": "United States Postal Service",
    "NPS": "National Park Service",
    "GSA": "General Services Administration",
    "USAID": "U.S. Agency for International Development",
    "OPM": "Office of Personnel Management",
    "SBA": "Small Business Administration",
    "DOI": "U.S. Department of the Interior",
    "DOT": "U.S. Department of Transportation",
    "CDC": "Centers for Disease Control and Prevention",
    "NIH": "National Institutes of Health",
    "FDA": "Food and Drug Administration",
    "DEA": "Drug Enforcement Administration",
    "SEC": "Securities and Exchange Commission",
    "DHS": "U.S. Department of Homeland Security",
    "DOC": "U.S. Department of Commerce",
    "ED": "U.S. Department of Education",
    "DOL": "U.S. Department of Labor",
    "TSA": "Transportation Security Administration",
    "BOP": "Bureau of Prisons",
    "NRC": "Nuclear Regulatory Commission",
    "ATF": "Bureau of Alcohol, Tobacco, Firearms and Explosives",
    "FAA": "Federal Aviation Administration",
    "FTC": "Federal Trade Commission",
    "FCC": "Federal Communications Commission",
    "OSHA": "Occupational Safety and Health Administration",
    "HHS": "U.S. Department of Health and Human Services",
    "OMB": "Office of Management and Budget",
    "CFPB": "Consumer Financial Protection Bureau",
    "NCIS": "Naval Criminal Investigative Service",
    "ICE": "U.S. Immigration and Customs Enforcement",
    "CBP": "U.S. Customs and Border Protection",
    "USCG": "United States Coast Guard",
    "AMTRAK": "National Railroad Passenger Corporation",
    "NSF": "National Science Foundation",
    "Smithsonian": "Smithsonian Institution"
};
let usedAgencyAcronyms = new Set();
let agencyList = [];
let usedDemocratNames = new Set();
let democratList = [];

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const restartText = document.getElementById('restartText');
    const rulesText = document.getElementById('rulesText');
    const democratsText = document.getElementById('democratsText');
    const agenciesText = document.getElementById('agenciesText');
    const scoreText = document.createElement('div');
    scoreText.className = 'score-text';
    scoreText.textContent = 'Score: 0';
    document.querySelector('.game-container').appendChild(scoreText);

    if (!canvas || !ctx || !restartText || !rulesText || !democratsText || !agenciesText || !scoreText) {
        console.error('One or more DOM elements not found. Check your HTML.');
        return;
    }

    const gridSize = 20;
    const tileCountX = canvas.width / gridSize;  // 40
