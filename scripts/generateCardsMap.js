const fs = require("fs");
const cards = require("../data/scryfall-default-cards.json");

const fields = [
  "name",
  "mana_cost",
  "type_line",
  "oracle_text",
  "power",
  "toughness"
];

// Remove duplicates with most recent and only keep the fields we need to reduce the size of the JSON
const cardsMap = cards.reduce((acc, card) => {
  if (!(card.name in acc) || card.released_at > acc[card.name].released_at) {
    // normalize the card titles, removing non work characters except for single quotes
    const key = card.name.toLowerCase().replace(/[^a-z0-9']+/g, " ");
    acc[key] = {};
    // this is similar to lodash _.pick(card, fields)
    fields.forEach(field => {
      acc[key][field] = card[field];
    });
    try {
      acc[key].normal_image_uri = card.image_uris.normal;
    } catch {
      // console.log(`no image for ${card.name}`);
      acc[key].normal_image_uri = "";
    }
  }

  return acc;
}, {});

const names = [];
const imageUris = [];
const COMMON_PREFIX = "https://img.scryfall.com/cards/normal/";
Object.entries(cardsMap).forEach(([key, value]) => {
  names.push(key);

  imageUris.push(value.normal_image_uri.replace(COMMON_PREFIX, ""));
});

fs.writeFile("./src/cardsMap.json", JSON.stringify(cardsMap), "utf8", error => {
  if (error) {
    console.error(error);
    throw error;
  }
  console.log("CardsMap written", Object.keys(cardsMap).length, "entries");
});

fs.writeFile(
  "./src/cardsArray.json",
  JSON.stringify({ names, imageUris }),
  "utf8",
  error => {
    if (error) {
      console.error(error);
      throw error;
    }
    console.log(
      "CardsArray written",
      names.length,
      imageUris.length,
      "entries"
    );
  }
);

exports.cardsMap = cardsMap;
exports.cardsArray = { names, imageUris };

/* DEBUG, sample stuff here


{ object: 'card',
  id: 'b2279cb1-089f-4c41-ae96-41837ed57822',
  oracle_id: '32e5339e-9e4f-46f8-b305-f9d6d3ba8bb5',
  multiverse_ids: [ 420602 ],
  mtgo_id: 62179,
  mtgo_foil_id: 62180,
  tcgplayer_id: 122852,
  name: 'Lotus Petal',
  lang: 'en',
  released_at: '2016-09-30',
  uri:
   'https://api.scryfall.com/cards/b2279cb1-089f-4c41-ae96-41837ed57822',
  scryfall_uri:
   'https://scryfall.com/card/mps/15/lotus-petal?utm_source=api',
  layout: 'normal',
  highres_image: true,
  image_uris:
   { small:
      'https://img.scryfall.com/cards/small/en/mps/15.jpg?1517813031',
     normal:
      'https://img.scryfall.com/cards/normal/en/mps/15.jpg?1517813031',
     large:
      'https://img.scryfall.com/cards/large/en/mps/15.jpg?1517813031',
     png:
      'https://img.scryfall.com/cards/png/en/mps/15.png?1517813031',
     art_crop:
      'https://img.scryfall.com/cards/art_crop/en/mps/15.jpg?1517813031',
     border_crop:
      'https://img.scryfall.com/cards/border_crop/en/mps/15.jpg?1517813031' },
  mana_cost: '{0}',
  cmc: 0,
  type_line: 'Artifact',
  'oracle_tex,': '{T}, Sacrifice Lotus Petal: Add one mana of any color.',
  colors: [],
  color_identity: [],
  legalities:
   { standard: 'not_legal',
     future: 'not_legal',
     frontier: 'not_legal',
     modern: 'not_legal',
     legacy: 'legal',
     pauper: 'legal',
     vintage: 'restricted',
     penny: 'not_legal',
     commander: 'legal',
     '1v1': 'legal',
     duel: 'legal',
     brawl: 'not_legal' },
  games: [ 'mtgo', 'paper' ],
  reserved: false,
  foil: true,
  nonfoil: false,
  oversized: false,
  promo: false,
  reprint: true,
  set: 'mps',
  set_name: 'Kaladesh Inventions',
  set_uri: 'https://api.scryfall.com/sets/mps',
  set_search_uri:
   'https://api.scryfall.com/cards/search?order=set&q=e%3Amps&unique=prints',
  scryfall_set_uri: 'https://scryfall.com/sets/mps?utm_source=api',
  rulings_uri:
   'https://api.scryfall.com/cards/b2279cb1-089f-4c41-ae96-41837ed57822/rulings',
  prints_search_uri:
   'https://api.scryfall.com/cards/search?order=released&q=oracleid%3A32e5339e-9e4f-46f8-b305-f9d6d3ba8bb5&unique=prints',
  collector_number: '15',
  digital: false,
  rarity: 'mythic',
  flavor_text:
   'Each of these intricate mechanical petals stores enough power to supply all of Ghirapur, if only for a fleeting moment.',
  illustration_id: '49505c4e-855a-49ed-b2c6-9d851f138214',
  artist: 'Slawomir Maniak',
  border_color: 'black',
  frame: '2015',
  frame_effect: '',
  full_art: false,
  timeshifted: false,
  colorshifted: false,
  futureshifted: false,
  story_spotlight: false,
  edhrec_rank: 642,
  related_uris:
   { gatherer:
      'http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=420602',
     tcgplayer_decks:
      'https://decks.tcgplayer.com/magic/deck/search?contains=Lotus+Petal&page=1&partner=Scryfall&utm_campaign=affiliate&utm_medium=scryfall&utm_source=scryfall',
     edhrec: 'http://edhrec.com/route/?cc=Lotus+Petal',
     mtgtop8:
      'http://mtgtop8.com/search?MD_check=1&SB_check=1&cards=Lotus+Petal' } }
> e.cardsMap['Ezuri, Claw of Progress']
{ object: 'card',
  id: '5ce6761c-9af4-4836-bcdf-402e68503593',
  oracle_id: '40eacdae-fae5-46b9-a9e5-9211469f74fc',
  multiverse_ids: [],
  mtgo_id: 59143,
  name: 'Ezuri, Claw of Progress',
  lang: 'en',
  released_at: '2015-11-18',
  uri:
   'https://api.scryfall.com/cards/5ce6761c-9af4-4836-bcdf-402e68503593',
  scryfall_uri:
   'https://scryfall.com/card/pz1/102/ezuri-claw-of-progress?utm_source=api',
  layout: 'normal',
  highres_image: true,
  image_uris:
   { small:
      'https://img.scryfall.com/cards/small/en/pz1/102.jpg?1517813031',
     normal:
      'https://img.scryfall.com/cards/normal/en/pz1/102.jpg?1517813031',
     large:
      'https://img.scryfall.com/cards/large/en/pz1/102.jpg?1517813031',
     png:
      'https://img.scryfall.com/cards/png/en/pz1/102.png?1517813031',
     art_crop:
      'https://img.scryfall.com/cards/art_crop/en/pz1/102.jpg?1517813031',
     border_crop:
      'https://img.scryfall.com/cards/border_crop/en/pz1/102.jpg?1517813031' },
  mana_cost: '{2}{G}{U}',
  cmc: 4,
  type_line: 'Legendary Creature — Elf Warrior',
  oracle_text:
   'Whenever a creature with power 2 or less enters the battlefield under your control, you get an experience counter.\nAt the beginning of combat on your turn, put X +1/+1 counters on another target creature you control, where X is the number of experience counters you have.',
  power: '3',
  toughness: '3',
  colors: [ 'G', 'U' ],
  color_identity: [ 'G', 'U' ],
  legalities:
   { standard: 'not_legal',
     future: 'not_legal',
     frontier: 'not_legal',
     modern: 'not_legal',
     legacy: 'legal',
     pauper: 'not_legal',
     vintage: 'legal',
     penny: 'not_legal',
     commander: 'legal',
     '1v1': 'legal',
     duel: 'legal',
     brawl: 'not_legal' },
  games: [ 'mtgo' ],
  reserved: false,
  foil: true,
  nonfoil: true,
  oversized: false,
  promo: false,
  reprint: true,
  set: 'pz1',
  set_name: 'Legendary Cube',
  set_uri: 'https://api.scryfall.com/sets/pz1',
  set_search_uri:
   'https://api.scryfall.com/cards/search?order=set&q=e%3Apz1&unique=prints',
  scryfall_set_uri: 'https://scryfall.com/sets/pz1?utm_source=api',
  rulings_uri:
   'https://api.scryfall.com/cards/5ce6761c-9af4-4836-bcdf-402e68503593/rulings',
  prints_search_uri:
   'https://api.scryfall.com/cards/search?order=released&q=oracleid%3A40eacdae-fae5-46b9-a9e5-9211469f74fc&unique=prints',
  collector_number: '102',
  digital: true,
  rarity: 'rare',
  illustration_id: '02e4b91f-797a-40d5-8dcf-763d6789b84a',
  artist: 'James Ryman',
  border_color: 'black',
  frame: '2015',
  frame_effect: '',
  full_art: false,
  timeshifted: false,
  colorshifted: false,
  futureshifted: false,
  story_spotlight: false,
  edhrec_rank: 2908,
  related_uris:
   { tcgplayer_decks:
      'https://decks.tcgplayer.com/magic/deck/search?contains=Ezuri%2C+Claw+of+Progress&page=1&partner=Scryfall&utm_campaign=affiliate&utm_medium=scryfall&utm_source=scryfall',
     edhrec: 'http://edhrec.com/route/?cc=Ezuri%2C+Claw+of+Progress',
     mtgtop8:
      'http://mtgtop8.com/search?MD_check=1&SB_check=1&cards=Ezuri%2C+Claw+of+Progress' } }

      */
