import sprites from "./sprites";

const items: Item[] = [
  { name: "Random", sprite: sprites.sprite22 },
  { name: "Dash", sprite: sprites.sprite03 },
  { name: "Grenade", sprite: sprites.sprite04 },
  { name: "Bow", sprite: sprites.sprite24 },
  { name: "Engine", sprite: sprites.sprite11 },
  { name: "Blink Gun", sprite: sprites.sprite14 },
  { name: "Gust", sprite: sprites.sprite15 },
  { name: "Growth Ray", sprite: sprites.sprite42 },
  { name: "Rock", sprite: sprites.sprite02 },
  { name: "Missile", sprite: sprites.sprite40 },
  { name: "Spike", sprite: sprites.sprite23 },
  { name: "Time Stop", sprite: sprites.sprite12 },
  { name: "Smoke", sprite: sprites.sprite31 },
  { name: "Platform", sprite: sprites.sprite33 },
  { name: "Revival", sprite: sprites.sprite21 },
  { name: "Roll", sprite: sprites.sprite05 },
  { name: "Shrink Ray", sprite: sprites.sprite43 },
  { name: "Black Hole", sprite: sprites.sprite41 },
  { name: "Invisibility", sprite: sprites.sprite34 },
  { name: "Meteor", sprite: sprites.sprite35 },
  { name: "Throw", sprite: sprites.sprite10 },
  { name: "Push", sprite: sprites.sprite13 },
  { name: "Tesla Coil", sprite: sprites.sprite01 },
  { name: "Mine", sprite: sprites.sprite20 },
  { name: "Teleport", sprite: sprites.sprite45 },
  { name: "Drill", sprite: sprites.sprite50 },
  { name: "Grappling Hook", sprite: sprites.sprite53 },
  { name: "Beam", sprite: sprites.sprite54 },
  { name: "Duplicator", sprite: sprites.sprite60 },
  { name: "Magnet Gun", sprite: sprites.sprite30 },
];

interface Item {
  name: string;
  sprite: string;
}

export default items;
