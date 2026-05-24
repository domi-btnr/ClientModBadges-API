import { RepluggedUserDTO } from "@providers/replugged/dto/replugged-user.dto";

interface Badge {
  name: string;
  image: string;
  color?: string;
}

const BADGES_MAP: Record<string, string> = {
  developer: "Developer",
  staff: "Staff",
  support: "Support",
  contributor: "Contributor",
  translator: "Translator",
  hunter: "Bug Hunter",
  early: "Early Supporter",
  booster: "Booster"
};

export function toBadges(user: RepluggedUserDTO, baseUrl: string): Badge[] {
  const badges: Badge[] = [];

  for (const [key, name] of Object.entries(BADGES_MAP)) {
    if (user.badges[key as keyof typeof user.badges] === true) {
      badges.push({ name, image: `${baseUrl}/badges/replugged/${key}` });
    }
  }

  if (user.badges.custom.icon) {
    badges.push({
      name: user.badges.custom.name ?? "Repplugged Supporter",
      image: user.badges.custom.icon,
      color: user.badges.custom.color ?? undefined
    });
  }

  return badges;
}
