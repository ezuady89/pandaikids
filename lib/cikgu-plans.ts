export type TeacherPlanId = "free" | "plus" | "pro";

export type TeacherPlan = {
  id: TeacherPlanId;
  name: string;
  manualLimit: number;
  aiLimit: number;
  questionLimit: number;
  amountCents: number;
  durationDays: number;
};

export const TEACHER_PLANS: Record<TeacherPlanId, TeacherPlan> = {
  free: { id: "free", name: "Percuma", manualLimit: 5, aiLimit: 3, questionLimit: 20, amountCents: 0, durationDays: 0 },
  plus: { id: "plus", name: "Cikgu Plus", manualLimit: 50, aiLimit: 30, questionLimit: 30, amountCents: 990, durationDays: 30 },
  pro: { id: "pro", name: "Cikgu Pro", manualLimit: 200, aiLimit: 100, questionLimit: 50, amountCents: 1990, durationDays: 30 },
};

export const FREE_TEACHER_PLAN = TEACHER_PLANS.free;
