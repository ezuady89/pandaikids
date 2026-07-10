import type { LearnerProfile, SchoolLevel } from "@/types";

export const defaultSchoolLevel: SchoolLevel = "year1";

export const schoolLevelLabels: Record<SchoolLevel, string> = {
  preschool: "Prasekolah",
  year1: "Tahun 1",
  year2: "Tahun 2",
  year3: "Tahun 3",
  year4: "Tahun 4",
  year5: "Tahun 5",
  year6: "Tahun 6"
};

export function getSchoolLevelFromAge(age: number | string): SchoolLevel {
  const numericAge = typeof age === "number" ? age : Number(age);

  if (numericAge >= 5 && numericAge <= 6) return "preschool";
  if (numericAge === 7) return "year1";
  if (numericAge === 8) return "year2";
  if (numericAge === 9) return "year3";
  if (numericAge === 10) return "year4";
  if (numericAge === 11) return "year5";
  if (numericAge === 12) return "year6";

  return defaultSchoolLevel;
}

export function getSchoolLevelFromProfile(
  profile: Pick<LearnerProfile, "age" | "schoolLevel">
): SchoolLevel {
  if (profile.age) return getSchoolLevelFromAge(profile.age);
  return profile.schoolLevel || defaultSchoolLevel;
}

export function normalizeSchoolLevel(level?: string): SchoolLevel {
  if (
    level === "preschool" ||
    level === "year1" ||
    level === "year2" ||
    level === "year3" ||
    level === "year4" ||
    level === "year5" ||
    level === "year6"
  ) {
    return level;
  }

  return defaultSchoolLevel;
}
