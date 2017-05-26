export interface DexCalOptions {
  label?: string;
  defaultRange?: number;
  ranges?: DexCalRange[];
}

export interface DexCalRange {
  label: string;
  daysBackFromToday: number;
}

export interface DexSelectedRange {
  startDate: Date;
  endDate: Date;
}

export interface Day {
  date: number;
  isSelected?: boolean;
  isInRange?: boolean;
}
