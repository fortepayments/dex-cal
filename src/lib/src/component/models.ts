export interface DexCalOptions {
  label?: string;
  ranges?: DexCalRange[];
  allowCustomDates?: boolean;
}

export interface DexCalRange {
  label: string;
  daysBackFromToday: number;
}

export interface DexSelectedRange {
  startDate: Date;
  endDate: Date;
}