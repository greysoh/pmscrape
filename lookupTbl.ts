const lookupSource = [
  "All",
  "Bedrock",
  "1.19",
  "1.18.1",
  "1.18",
  "1.17.1",
  "1.17",
  "1.16.5",
  "1.16.3",
  "1.16.2",
  "1.16.1",
  "1.16",
  "1.15",
  "1.14",
  "1.13",
  "1.12.2",
  "1.12",
  "1.11",
  "1.10",
  "1.9.4",
  "1.9.3",
  "1.9.2",
  "1.9.1",
  "1.9",
  "1.8.9",
  "1.8.8",
  "1.8.7",
  "1.8.6",
  "1.8.4",
  "1.8.3",
  "1.8.2",
  "1.8.1",
  "1.8",
  "1.7.10",
  "1.7.9",
  "1.7.8",
  "1.7.4",
  "1.7.2",
  "1.6.4",
  "1.6.2",
  "1.6",
  "1.5.2",
  "1.5.1",
  "1.5",
  "1.4.7",
  "1.4.6",
  "1.4",
  "1.3.1",
  "1.2.5",
  "1.2.4",
  "1.2",
  "1.1",
  "1.0",
  "1.9 beta",
  "1.8 beta",
  "1.7 beta",
  "1.6 beta",
  "1.5 beta",
  "1.4 beta",
  "1.3 beta",
  "Dungeons",
];

const lookupDest = [
  "https://www.planetminecraft.com/texture-packs/?op1=any",
  "https://www.planetminecraft.com/texture-packs/?op1=128",
  "https://www.planetminecraft.com/texture-packs/?op1=59",
  "https://www.planetminecraft.com/texture-packs/?op1=58",
  "https://www.planetminecraft.com/texture-packs/?op1=57",
  "https://www.planetminecraft.com/texture-packs/?op1=56",
  "https://www.planetminecraft.com/texture-packs/?op1=55",
  "https://www.planetminecraft.com/texture-packs/?op1=54",
  "https://www.planetminecraft.com/texture-packs/?op1=53",
  "https://www.planetminecraft.com/texture-packs/?op1=52",
  "https://www.planetminecraft.com/texture-packs/?op1=51",
  "https://www.planetminecraft.com/texture-packs/?op1=50",
  "https://www.planetminecraft.com/texture-packs/?op1=49",
  "https://www.planetminecraft.com/texture-packs/?op1=48",
  "https://www.planetminecraft.com/texture-packs/?op1=47",
  "https://www.planetminecraft.com/texture-packs/?op1=46",
  "https://www.planetminecraft.com/texture-packs/?op1=45",
  "https://www.planetminecraft.com/texture-packs/?op1=44",
  "https://www.planetminecraft.com/texture-packs/?op1=41",
  "https://www.planetminecraft.com/texture-packs/?op1=43",
  "https://www.planetminecraft.com/texture-packs/?op1=42",
  "https://www.planetminecraft.com/texture-packs/?op1=40",
  "https://www.planetminecraft.com/texture-packs/?op1=39",
  "https://www.planetminecraft.com/texture-packs/?op1=38",
  "https://www.planetminecraft.com/texture-packs/?op1=37",
  "https://www.planetminecraft.com/texture-packs/?op1=36",
  "https://www.planetminecraft.com/texture-packs/?op1=35",
  "https://www.planetminecraft.com/texture-packs/?op1=34",
  "https://www.planetminecraft.com/texture-packs/?op1=32",
  "https://www.planetminecraft.com/texture-packs/?op1=31",
  "https://www.planetminecraft.com/texture-packs/?op1=30",
  "https://www.planetminecraft.com/texture-packs/?op1=29",
  "https://www.planetminecraft.com/texture-packs/?op1=28",
  "https://www.planetminecraft.com/texture-packs/?op1=27",
  "https://www.planetminecraft.com/texture-packs/?op1=26",
  "https://www.planetminecraft.com/texture-packs/?op1=25",
  "https://www.planetminecraft.com/texture-packs/?op1=24",
  "https://www.planetminecraft.com/texture-packs/?op1=23",
  "https://www.planetminecraft.com/texture-packs/?op1=22",
  "https://www.planetminecraft.com/texture-packs/?op1=21",
  "https://www.planetminecraft.com/texture-packs/?op1=20",
  "https://www.planetminecraft.com/texture-packs/?op1=19",
  "https://www.planetminecraft.com/texture-packs/?op1=18",
  "https://www.planetminecraft.com/texture-packs/?op1=17",
  "https://www.planetminecraft.com/texture-packs/?op1=16",
  "https://www.planetminecraft.com/texture-packs/?op1=15",
  "https://www.planetminecraft.com/texture-packs/?op1=14",
  "https://www.planetminecraft.com/texture-packs/?op1=13",
  "https://www.planetminecraft.com/texture-packs/?op1=12",
  "https://www.planetminecraft.com/texture-packs/?op1=11",
  "https://www.planetminecraft.com/texture-packs/?op1=10",
  "https://www.planetminecraft.com/texture-packs/?op1=9",
  "https://www.planetminecraft.com/texture-packs/?op1=8",
  "https://www.planetminecraft.com/texture-packs/?op1=7",
  "https://www.planetminecraft.com/texture-packs/?op1=6",
  "https://www.planetminecraft.com/texture-packs/?op1=5",
  "https://www.planetminecraft.com/texture-packs/?op1=4",
  "https://www.planetminecraft.com/texture-packs/?op1=3",
  "https://www.planetminecraft.com/texture-packs/?op1=2",
  "https://www.planetminecraft.com/texture-packs/?op1=1",
  "https://www.planetminecraft.com/texture-packs/?op1=0",
];

export function lookup(str: string): string {
  for (var i = 0; i < lookupSource.length; i++) {
    const lookupSrc = lookupSource[i];
    const lookupDst = lookupDest[i];

    if (lookupSrc.toLowerCase() == str.toLowerCase()) {
      return lookupDst;
    }
  }

  return lookupDest[0]; // All Versions
}

export function getLookupSource(): string[] {
  return lookupSource;
}

export function getLookupDest(): string[] {
  return lookupDest;
}