interface StreakCalendarProps {
  activeDays: number[];
  totalDays: number;
}

export function StreakCalendar({ activeDays, totalDays }: StreakCalendarProps) {
  const days = Array.from({ length: totalDays }, (_, i) => i + 1);
  
  return (
    <div className="flex flex-wrap gap-2">
      {days.map((day) => {
        const isActive = activeDays.includes(day);
        return (
          <div
            key={day}
            className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-medium transition-colors ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
            data-testid={`day-${day}`}
          >
            {day}
          </div>
        );
      })}
    </div>
  );
}
