export type QuizAnswers = Record<string, string[]>;

export type SignupProfile = {
  name: string;
  email: string;
};

export type OnboardingProfile = {
  answers: QuizAnswers;
  user: SignupProfile;
};
