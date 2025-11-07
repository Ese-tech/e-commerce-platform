// Real address data for different countries
export interface AddressData {
  cities: {
    name: string;
    state: string;
    zipCodes: string[];
    streets: string[];
  }[];
  states: string[];
}

export const addressData: Record<string, AddressData> = {
  Germany: {
    states: [
      'Baden-Württemberg',
      'Bayern',
      'Berlin',
      'Brandenburg',
      'Bremen',
      'Hamburg',
      'Hessen',
      'Mecklenburg-Vorpommern',
      'Niedersachsen',
      'Nordrhein-Westfalen',
      'Rheinland-Pfalz',
      'Saarland',
      'Sachsen',
      'Sachsen-Anhalt',
      'Schleswig-Holstein',
      'Thüringen'
    ],
    cities: [
      {
        name: 'Bielefeld',
        state: 'Nordrhein-Westfalen',
        zipCodes: ['33602', '33604', '33605', '33607', '33609', '33611', '33613', '33615', '33617', '33619'],
        streets: [
          'Hauptstraße',
          'Bahnhofstraße',
          'Königstraße',
          'Marktstraße',
          'Kirchstraße',
          'Schulstraße',
          'Gartenstraße',
          'Lindenstraße',
          'Rosenstraße',
          'Kastanienallee',
          'Am Stadtpark',
          'Friedrichstraße',
          'Wilhelmstraße',
          'Heinrich-Heine-Straße',
          'Goethestraße'
        ]
      },
      {
        name: 'Berlin',
        state: 'Berlin',
        zipCodes: ['10115', '10117', '10119', '10178', '10179', '10243', '10245', '10247', '10249', '10435'],
        streets: [
          'Unter den Linden',
          'Friedrichstraße',
          'Potsdamer Straße',
          'Alexanderplatz',
          'Kurfürstendamm',
          'Wilhelmstraße',
          'Leipziger Straße',
          'Kantstraße',
          'Tauentzienstraße',
          'Hackescher Markt',
          'Prenzlauer Allee',
          'Karl-Marx-Allee',
          'Warschauer Straße',
          'Oranienstraße',
          'Bergmannstraße'
        ]
      },
      {
        name: 'München',
        state: 'Bayern',
        zipCodes: ['80331', '80333', '80335', '80337', '80339', '80469', '80538', '80539', '80634', '80636'],
        streets: [
          'Marienplatz',
          'Maximilianstraße',
          'Leopoldstraße',
          'Ludwigstraße',
          'Theatinerstraße',
          'Residenzstraße',
          'Sendlinger Straße',
          'Tal',
          'Isartorplatz',
          'Odeonsplatz',
          'Stachus',
          'Frauenstraße',
          'Augustinerstraße',
          'Herzogspitalstraße',
          'Rosenstraße'
        ]
      },
      {
        name: 'Hamburg',
        state: 'Hamburg',
        zipCodes: ['20095', '20097', '20099', '20144', '20146', '20148', '20149', '20249', '20251', '20253'],
        streets: [
          'Mönckebergstraße',
          'Spitalerstraße',
          'Jungfernstieg',
          'Reeperbahn',
          'Große Bleichen',
          'Neuer Wall',
          'Alsterarkaden',
          'Ballindamm',
          'Gänsemarkt',
          'Lange Reihe',
          'Schanzenviertel',
          'Sternschanze',
          'Elbchaussee',
          'Hafencity',
          'Speicherstadt'
        ]
      },
      {
        name: 'Köln',
        state: 'Nordrhein-Westfalen',
        zipCodes: ['50667', '50668', '50670', '50672', '50674', '50676', '50677', '50678', '50679', '50733'],
        streets: [
          'Hohe Straße',
          'Schildergasse',
          'Breite Straße',
          'Ehrenstraße',
          'Mittelstraße',
          'Apostelnstraße',
          'Domkloster',
          'Heumarkt',
          'Neumarkt',
          'Rudolfplatz',
          'Friesenplatz',
          'Barbarossaplatz',
          'Zülpicher Straße',
          'Venloer Straße',
          'Aachener Straße'
        ]
      }
    ]
  },
  'United States': {
    states: [
      'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
      'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
      'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
      'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
      'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
      'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
      'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
    ],
    cities: [
      {
        name: 'New York',
        state: 'New York',
        zipCodes: ['10001', '10002', '10003', '10004', '10005', '10006', '10007', '10008', '10009', '10010'],
        streets: [
          'Broadway',
          'Fifth Avenue',
          'Madison Avenue',
          'Park Avenue',
          'Lexington Avenue',
          'Third Avenue',
          'Second Avenue',
          'First Avenue',
          'Wall Street',
          'Main Street',
          'Church Street',
          'Water Street',
          'Houston Street',
          'Canal Street',
          'Spring Street'
        ]
      },
      {
        name: 'Los Angeles',
        state: 'California',
        zipCodes: ['90001', '90002', '90003', '90004', '90005', '90006', '90007', '90008', '90009', '90010'],
        streets: [
          'Hollywood Boulevard',
          'Sunset Boulevard',
          'Wilshire Boulevard',
          'Santa Monica Boulevard',
          'Melrose Avenue',
          'Rodeo Drive',
          'Beverly Drive',
          'La Cienega Boulevard',
          'Vine Street',
          'Highland Avenue',
          'Fairfax Avenue',
          'La Brea Avenue',
          'Western Avenue',
          'Vermont Avenue',
          'Normandie Avenue'
        ]
      },
      {
        name: 'Chicago',
        state: 'Illinois',
        zipCodes: ['60601', '60602', '60603', '60604', '60605', '60606', '60607', '60608', '60609', '60610'],
        streets: [
          'Michigan Avenue',
          'State Street',
          'LaSalle Street',
          'Wabash Avenue',
          'Clark Street',
          'Dearborn Street',
          'Franklin Street',
          'Wells Street',
          'Lake Street',
          'Madison Street',
          'Monroe Street',
          'Adams Street',
          'Jackson Boulevard',
          'Van Buren Street',
          'Harrison Street'
        ]
      }
    ]
  },
  Canada: {
    states: [
      'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador',
      'Northwest Territories', 'Nova Scotia', 'Nunavut', 'Ontario', 'Prince Edward Island',
      'Quebec', 'Saskatchewan', 'Yukon'
    ],
    cities: [
      {
        name: 'Toronto',
        state: 'Ontario',
        zipCodes: ['M5H 2N2', 'M5V 3A8', 'M5B 2H1', 'M5C 2B5', 'M5E 1A4', 'M5G 1L7', 'M5J 2R2', 'M5K 3C7'],
        streets: [
          'Queen Street West',
          'King Street West',
          'Yonge Street',
          'Bay Street',
          'University Avenue',
          'Dundas Street',
          'College Street',
          'Bloor Street',
          'Front Street',
          'Richmond Street',
          'Adelaide Street',
          'Wellington Street',
          'King Street East',
          'Queen Street East',
          'Jarvis Street'
        ]
      },
      {
        name: 'Vancouver',
        state: 'British Columbia',
        zipCodes: ['V6B 1A1', 'V6B 2W2', 'V6B 3K9', 'V6B 4N4', 'V6B 5L5', 'V6C 1G1', 'V6C 2T1', 'V6C 3B3'],
        streets: [
          'Granville Street',
          'Robson Street',
          'Davie Street',
          'Denman Street',
          'Georgia Street',
          'Pender Street',
          'Hastings Street',
          'Powell Street',
          'Cordova Street',
          'Water Street',
          'Abbott Street',
          'Cambie Street',
          'Main Street',
          'Commercial Drive',
          'Broadway'
        ]
      }
    ]
  },
  'United Kingdom': {
    states: [
      'England', 'Scotland', 'Wales', 'Northern Ireland'
    ],
    cities: [
      {
        name: 'London',
        state: 'England',
        zipCodes: ['SW1A 1AA', 'W1A 0AX', 'EC1A 1BB', 'E1 6AN', 'N1 9GU', 'SE1 9SG', 'NW1 5LT', 'WC1N 3AX'],
        streets: [
          'Oxford Street',
          'Regent Street',
          'Bond Street',
          'Piccadilly',
          'The Strand',
          'Fleet Street',
          'Tottenham Court Road',
          'Baker Street',
          'King\'s Road',
          'Kensington High Street',
          'Portobello Road',
          'Carnaby Street',
          'Brick Lane',
          'Camden High Street',
          'Abbey Road'
        ]
      },
      {
        name: 'Manchester',
        state: 'England',
        zipCodes: ['M1 1AA', 'M1 2AB', 'M1 3AC', 'M2 1AD', 'M2 2AE', 'M3 1AF', 'M3 2AG', 'M4 1AH'],
        streets: [
          'Market Street',
          'King Street',
          'Deansgate',
          'Cross Street',
          'Mosley Street',
          'Princess Street',
          'Portland Street',
          'Oxford Street',
          'Piccadilly',
          'Albert Square',
          'St Ann\'s Square',
          'Exchange Square',
          'Spinningfields',
          'Chinatown',
          'Northern Quarter'
        ]
      }
    ]
  },
  France: {
    states: [
      'Auvergne-Rhône-Alpes', 'Bourgogne-Franche-Comté', 'Bretagne', 'Centre-Val de Loire',
      'Corse', 'Grand Est', 'Hauts-de-France', 'Île-de-France', 'Normandie', 'Nouvelle-Aquitaine',
      'Occitanie', 'Pays de la Loire', 'Provence-Alpes-Côte d\'Azur'
    ],
    cities: [
      {
        name: 'Paris',
        state: 'Île-de-France',
        zipCodes: ['75001', '75002', '75003', '75004', '75005', '75006', '75007', '75008', '75009', '75010'],
        streets: [
          'Champs-Élysées',
          'Rue de Rivoli',
          'Boulevard Saint-Germain',
          'Rue Saint-Honoré',
          'Boulevard Haussmann',
          'Rue de la Paix',
          'Avenue Montaigne',
          'Rue du Faubourg Saint-Honoré',
          'Boulevard Saint-Michel',
          'Rue Mouffetard',
          'Avenue des Gobelins',
          'Rue de Belleville',
          'Avenue de la République',
          'Boulevard Voltaire',
          'Rue Oberkampf'
        ]
      },
      {
        name: 'Lyon',
        state: 'Auvergne-Rhône-Alpes',
        zipCodes: ['69001', '69002', '69003', '69004', '69005', '69006', '69007', '69008', '69009'],
        streets: [
          'Rue de la République',
          'Rue Victor Hugo',
          'Cours Franklin Roosevelt',
          'Avenue Jean Jaurès',
          'Rue Garibaldi',
          'Place Bellecour',
          'Rue Mercière',
          'Rue du Président Édouard Herriot',
          'Cours Gambetta',
          'Avenue Lacassagne',
          'Rue de Marseille',
          'Avenue Félix Faure',
          'Rue Paul Bert',
          'Cours Vitton',
          'Avenue Maréchal Foch'
        ]
      }
    ]
  },
  Italy: {
    states: [
      'Abruzzo', 'Basilicata', 'Calabria', 'Campania', 'Emilia-Romagna', 'Friuli-Venezia Giulia',
      'Lazio', 'Liguria', 'Lombardia', 'Marche', 'Molise', 'Piemonte', 'Puglia', 'Sardegna',
      'Sicilia', 'Toscana', 'Trentino-Alto Adige', 'Umbria', 'Valle d\'Aosta', 'Veneto'
    ],
    cities: [
      {
        name: 'Rome',
        state: 'Lazio',
        zipCodes: ['00118', '00119', '00120', '00121', '00122', '00123', '00124', '00125', '00126', '00127'],
        streets: [
          'Via del Corso',
          'Via dei Fori Imperiali',
          'Via Nazionale',
          'Via del Tritone',
          'Via Veneto',
          'Via Appia Antica',
          'Via Flaminia',
          'Via Cassia',
          'Via Aurelia',
          'Via Ostiense',
          'Via Tiburtina',
          'Via Salaria',
          'Via Nomentana',
          'Via Prenestina',
          'Via Casilina'
        ]
      },
      {
        name: 'Milan',
        state: 'Lombardia',
        zipCodes: ['20121', '20122', '20123', '20124', '20125', '20126', '20127', '20128', '20129', '20130'],
        streets: [
          'Via Montenapoleone',
          'Corso Buenos Aires',
          'Via Torino',
          'Corso di Porta Ticinese',
          'Via Brera',
          'Via della Spiga',
          'Via Manzoni',
          'Corso Venezia',
          'Via Dante',
          'Via Garibaldi',
          'Corso Magenta',
          'Via Solferino',
          'Via Moscova',
          'Via Durini',
          'Via Sant\'Andrea'
        ]
      }
    ]
  },
  Spain: {
    states: [
      'Andalucía', 'Aragón', 'Asturias', 'Baleares', 'Canarias', 'Cantabria', 'Castilla-La Mancha',
      'Castilla y León', 'Cataluña', 'Extremadura', 'Galicia', 'La Rioja', 'Madrid', 'Murcia',
      'Navarra', 'País Vasco', 'Valencia'
    ],
    cities: [
      {
        name: 'Madrid',
        state: 'Madrid',
        zipCodes: ['28001', '28002', '28003', '28004', '28005', '28006', '28007', '28008', '28009', '28010'],
        streets: [
          'Gran Vía',
          'Calle de Alcalá',
          'Paseo del Prado',
          'Calle Mayor',
          'Calle de Serrano',
          'Paseo de la Castellana',
          'Calle de Goya',
          'Calle de Velázquez',
          'Calle de Atocha',
          'Plaza Mayor',
          'Puerta del Sol',
          'Calle de Preciados',
          'Calle del Carmen',
          'Calle de Fuencarral',
          'Paseo de Recoletos'
        ]
      },
      {
        name: 'Barcelona',
        state: 'Cataluña',
        zipCodes: ['08001', '08002', '08003', '08004', '08005', '08006', '08007', '08008', '08009', '08010'],
        streets: [
          'Las Ramblas',
          'Passeig de Gràcia',
          'Carrer de Balmes',
          'Avinguda Diagonal',
          'Carrer Gran de Gràcia',
          'Carrer de Muntaner',
          'Via Laietana',
          'Carrer del Consell de Cent',
          'Carrer de València',
          'Carrer de Mallorca',
          'Carrer d\'Aragó',
          'Ronda de Sant Pere',
          'Carrer de Pelai',
          'Portal de l\'Àngel',
          'Carrer de la Ribera'
        ]
      }
    ]
  },
  Netherlands: {
    states: [
      'Drenthe', 'Flevoland', 'Friesland', 'Gelderland', 'Groningen', 'Limburg',
      'North Brabant', 'North Holland', 'Overijssel', 'South Holland', 'Utrecht', 'Zeeland'
    ],
    cities: [
      {
        name: 'Amsterdam',
        state: 'North Holland',
        zipCodes: ['1011', '1012', '1013', '1014', '1015', '1016', '1017', '1018', '1019', '1020'],
        streets: [
          'Damrak',
          'Kalverstraat',
          'Nieuwedijk',
          'Rokin',
          'Leidsestraat',
          'Utrechtsestraat',
          'Overtoom',
          'Vondelstraat',
          'Prinsengracht',
          'Herengracht',
          'Keizersgracht',
          'Jordaan',
          'Museumplein',
          'Leidseplein',
          'Rembrandtplein'
        ]
      },
      {
        name: 'Rotterdam',
        state: 'South Holland',
        zipCodes: ['3011', '3012', '3013', '3014', '3015', '3016', '3017', '3018', '3019', '3020'],
        streets: [
          'Lijnbaan',
          'Coolsingel',
          'Witte de Withstraat',
          'Nieuwe Binnenweg',
          'Westzeedijk',
          'Kruiskade',
          'Beijerlandselaan',
          'Mathenesserlaan',
          'Schiekade',
          'Blaak',
          'Mauritsweg',
          'Karel Doormanstraat',
          'Lloydstraat',
          'Vasteland',
          'Westblaak'
        ]
      }
    ]
  },
  Austria: {
    states: [
      'Burgenland', 'Carinthia', 'Lower Austria', 'Upper Austria', 'Salzburg',
      'Styria', 'Tyrol', 'Vorarlberg', 'Vienna'
    ],
    cities: [
      {
        name: 'Vienna',
        state: 'Vienna',
        zipCodes: ['1010', '1020', '1030', '1040', '1050', '1060', '1070', '1080', '1090', '1100'],
        streets: [
          'Kärntner Straße',
          'Graben',
          'Mariahilfer Straße',
          'Ringstraße',
          'Prater',
          'Naschmarkt',
          'Schwedenplatz',
          'Stephansplatz',
          'Karlsplatz',
          'Westbahnstraße',
          'Landstraßer Hauptstraße',
          'Favoritenstraße',
          'Meidlinger Hauptstraße',
          'Ottakringer Straße',
          'Hernalser Hauptstraße'
        ]
      }
    ]
  },
  Switzerland: {
    states: [
      'Aargau', 'Appenzell Ausserrhoden', 'Appenzell Innerrhoden', 'Basel-Landschaft', 'Basel-Stadt',
      'Bern', 'Fribourg', 'Geneva', 'Glarus', 'Graubünden', 'Jura', 'Lucerne', 'Neuchâtel',
      'Nidwalden', 'Obwalden', 'Schaffhausen', 'Schwyz', 'Solothurn', 'St. Gallen', 'Thurgau',
      'Ticino', 'Uri', 'Valais', 'Vaud', 'Zug', 'Zurich'
    ],
    cities: [
      {
        name: 'Zurich',
        state: 'Zurich',
        zipCodes: ['8001', '8002', '8003', '8004', '8005', '8006', '8007', '8008', '8032', '8037'],
        streets: [
          'Bahnhofstrasse',
          'Limmatquai',
          'Niederdorfstrasse',
          'Langstrasse',
          'Universitätstrasse',
          'Rämistrasse',
          'Forchstrasse',
          'Seestrasse',
          'Militärstrasse',
          'Badenerstrasse',
          'Hohlstrasse',
          'Hardstrasse',
          'Quellenstrasse',
          'Birmensdorferstrasse',
          'Uetlibergstrasse'
        ]
      }
    ]
  },
  Belgium: {
    states: [
      'Antwerp', 'Brussels', 'East Flanders', 'Flemish Brabant', 'Hainaut', 'Liège',
      'Limburg', 'Luxembourg', 'Namur', 'Walloon Brabant', 'West Flanders'
    ],
    cities: [
      {
        name: 'Brussels',
        state: 'Brussels',
        zipCodes: ['1000', '1020', '1030', '1040', '1050', '1060', '1070', '1080', '1090', '1120'],
        streets: [
          'Boulevard Anspach',
          'Rue Neuve',
          'Avenue Louise',
          'Chaussée de Charleroi',
          'Rue de la Loi',
          'Boulevard du Regent',
          'Rue Royale',
          'Chaussée de Wavre',
          'Avenue de Tervueren',
          'Boulevard du Midi',
          'Rue Antoine Dansaert',
          'Place Eugène Flagey',
          'Chaussée d\'Ixelles',
          'Avenue de la Toison d\'Or',
          'Boulevard de Waterloo'
        ]
      }
    ]
  },
  Japan: {
    states: [
      'Hokkaido', 'Aomori', 'Iwate', 'Miyagi', 'Akita', 'Yamagata', 'Fukushima', 'Ibaraki',
      'Tochigi', 'Gunma', 'Saitama', 'Chiba', 'Tokyo', 'Kanagawa', 'Niigata', 'Toyama',
      'Ishikawa', 'Fukui', 'Yamanashi', 'Nagano', 'Gifu', 'Shizuoka', 'Aichi', 'Mie',
      'Shiga', 'Kyoto', 'Osaka', 'Hyogo', 'Nara', 'Wakayama', 'Tottori', 'Shimane',
      'Okayama', 'Hiroshima', 'Yamaguchi', 'Tokushima', 'Kagawa', 'Ehime', 'Kochi',
      'Fukuoka', 'Saga', 'Nagasaki', 'Kumamoto', 'Oita', 'Miyazaki', 'Kagoshima', 'Okinawa'
    ],
    cities: [
      {
        name: 'Tokyo',
        state: 'Tokyo',
        zipCodes: ['100-0001', '100-0002', '100-0003', '100-0004', '100-0005', '100-0006', '100-0011', '100-0012'],
        streets: [
          'Ginza',
          'Shibuya',
          'Shinjuku',
          'Harajuku',
          'Roppongi',
          'Akihabara',
          'Ueno',
          'Asakusa',
          'Ikebukuro',
          'Odaiba',
          'Tsukiji',
          'Marunouchi',
          'Nihombashi',
          'Akasaka',
          'Ebisu'
        ]
      },
      {
        name: 'Osaka',
        state: 'Osaka',
        zipCodes: ['530-0001', '530-0002', '530-0003', '530-0004', '530-0005', '530-0011', '530-0012', '530-0013'],
        streets: [
          'Dotonbori',
          'Namba',
          'Shinsekai',
          'Umeda',
          'Tennoji',
          'Sumiyoshi',
          'Nippombashi',
          'Kitahama',
          'Honten',
          'Shinsaibashi',
          'Amerikamura',
          'Kuromon Market',
          'Osaka Castle',
          'Tsutenkaku',
          'Universal Studios'
        ]
      }
    ]
  },
  Australia: {
    states: [
      'New South Wales', 'Victoria', 'Queensland', 'Western Australia', 'South Australia',
      'Tasmania', 'Australian Capital Territory', 'Northern Territory'
    ],
    cities: [
      {
        name: 'Sydney',
        state: 'New South Wales',
        zipCodes: ['2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009'],
        streets: [
          'George Street',
          'Pitt Street',
          'King Street',
          'Queen Street',
          'Market Street',
          'Oxford Street',
          'William Street',
          'Elizabeth Street',
          'Castlereagh Street',
          'Macquarie Street',
          'Circular Quay',
          'The Rocks',
          'Darling Harbour',
          'Chinatown',
          'Hyde Park'
        ]
      },
      {
        name: 'Melbourne',
        state: 'Victoria',
        zipCodes: ['3000', '3001', '3002', '3003', '3004', '3005', '3006', '3008', '3031', '3141'],
        streets: [
          'Collins Street',
          'Bourke Street',
          'Flinders Street',
          'Queen Street',
          'Elizabeth Street',
          'Swanston Street',
          'Spencer Street',
          'Little Collins Street',
          'Little Bourke Street',
          'Lonsdale Street',
          'La Trobe Street',
          'Franklin Street',
          'Victoria Street',
          'King Street',
          'William Street'
        ]
      }
    ]
  }
};

export const getStatesForCountry = (country: string): string[] => {
  return addressData[country]?.states || [];
};

export const getCitiesForCountry = (country: string, stateFilter?: string) => {
  const data = addressData[country];
  if (!data) return [];
  
  if (stateFilter) {
    return data.cities.filter(city => 
      city.state.toLowerCase().includes(stateFilter.toLowerCase())
    );
  }
  
  return data.cities;
};

export const getZipCodesForCity = (country: string, cityName: string): string[] => {
  const data = addressData[country];
  if (!data) return [];
  
  const city = data.cities.find(c => 
    c.name.toLowerCase() === cityName.toLowerCase()
  );
  
  return city?.zipCodes || [];
};

export const getStreetsForCity = (country: string, cityName: string): string[] => {
  const data = addressData[country];
  if (!data) return [];
  
  const city = data.cities.find(c => 
    c.name.toLowerCase() === cityName.toLowerCase()
  );
  
  return city?.streets || [];
};

export const searchCities = (country: string, query: string) => {
  const data = addressData[country];
  if (!data || !query) return data?.cities || [];
  
  return data.cities.filter(city =>
    city.name.toLowerCase().includes(query.toLowerCase()) ||
    city.state.toLowerCase().includes(query.toLowerCase())
  );
};

export const searchStreets = (country: string, cityName: string, query: string): string[] => {
  const streets = getStreetsForCity(country, cityName);
  if (!query) return streets;
  
  return streets.filter(street =>
    street.toLowerCase().includes(query.toLowerCase())
  );
};