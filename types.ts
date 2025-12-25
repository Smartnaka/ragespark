
export enum HeatLevel {
  MILD = 'Mildly Annoying',
  SPICY = 'Unpopular Opinion',
  RAGE = 'Internet Meltdown',
  NUCLEAR = 'Unsubscribe Worthy'
}

export interface GeneratorInput {
  topic: string;
  heat: HeatLevel;
  platform: 'X/Twitter' | 'TikTok' | 'Reddit' | 'YouTube';
}

export interface GeneratedContent {
  hook: string;
  strategy: string;
  psychology: string;
}

export interface Tutorial {
  id: string;
  title: string;
  content: string;
  icon: string;
}
