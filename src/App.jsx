import { useState, useEffect } from "react";

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];
const FULL_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DEFAULT_HABITS = [
  { id: 1, name: "Drink Water 💧", category: "Glow Up", color: "#4fc3f7", streak: 0, completedDays: [] },
  { id: 2, name: "Study 📖", category: "Study", color: "#f48fb1", streak: 0, completedDays: [] },
  { id: 3, name: "No Junk Food 🥗", category: "Glow Up", color: "#a5d6a7", streak: 0, completedDays: [] },
  { id: 4, name: "Wake Up Early 🌅", category: "Mind", color: "#ffe082", streak: 0, completedDays: [] },
];

const todayIndex = new Date().getDay();
const today = new Date();
const todayKey = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

function getWeekKeys() {
  const keys = [];
  const today = new Date();

  // get current day index (0 = Sunday)
  const day = today.getDay();

  // go back to Sunday
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - day);

  for (let i = 0; i < 7; i++) {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);

    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    keys.push(key);
  }

  return keys;
}
export default function HabitTracker() {
  const [habits, setHabits] = useState(() => {
    try {
      const saved = localStorage.getItem("habits_v2");
      return saved ? JSON.parse(saved) : DEFAULT_HABITS;
    } catch { return DEFAULT_HABITS; }
  });
const [newHabit, setNewHabit] = useState("");
const [adding, setAdding] = useState(false);
const [activeCategory, setActiveCategory] = useState("All");

const categories = ["All", "Glow Up", "Study", "Mind", "Fitness"];

const [quote] = useState(() => {
    const quotes = [
      "Small steps. Big life. 🌸",
      "You got this, bestie. 💪",
      "One day at a time. ✨",
      "Progress > Perfection. 🔥",
      "Show up. Always. 🌙",
    ];
    return quotes[new Date().getDay() % quotes.length];
  });

  const weekKeys = getWeekKeys();
const weeklyCompleted = filteredHabits.reduce((total, habit) => {
  return total + habit.completedDays.filter(day => weekKeys.includes(day)).length;
}, 0);

const weeklyTotal = filteredHabits.length * 7;

const weeklyPercent = weeklyTotal
  ? Math.round((weeklyCompleted / weeklyTotal) * 100)
  : 0;

const bestStreak = filteredHabits.length
  ? Math.max(...filteredHabits.map(h => h.streak))
  : 0;
const dailyData = weekKeys.map(day => {
  const count = filteredHabits.filter(h => h.completedDays.includes(day)).length;
  return {
    day,
    count
  };
});

const maxDaily = Math.max(...dailyData.map(d => d.count), 1);

  useEffect(() => {
    try { localStorage.setItem("habits_v2", JSON.stringify(habits)); } catch {}
  }, [habits]);

  const toggleDay = (habitId, dayKey) => {
    setHabits(prev => prev.map(h => {
      if (h.id !== habitId) return h;
      const already = h.completedDays.includes(dayKey);
      const newDays = already
        ? h.completedDays.filter(d => d !== dayKey)
        : [...h.completedDays, dayKey];
      const streak = calcStreak(newDays);
      return { ...h, completedDays: newDays, streak };
    }));
  };

  const calcStreak = (days) => {
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().split("T")[0];
      if (days.includes(key)) streak++;
      else break;
    }
    return streak;
  };

  const addHabit = () => {
    if (!newHabit.trim()) return;
    const colors = ["#ce93d8", "#80deea", "#ffcc80", "#ef9a9a", "#c5e1a5"];
const newH = {
  id: Date.now(),
  name: newHabit.trim(),
  category: activeCategory === "All" ? "Glow Up" : activeCategory,
      color: colors[habits.length % colors.length],
      streak: 0,
      completedDays: [],
    };
    setHabits(prev => [...prev, newH]);
    setNewHabit("");
    setAdding(false);
  };

  const deleteHabit = (id) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

const filteredHabits =
  activeCategory === "All"
    ? habits
    : habits.filter(h => h.category === activeCategory);

const todayCompleted = filteredHabits.filter(h =>
  h.completedDays.includes(todayKey)
).length;

const progress = filteredHabits.length
  ? Math.round((todayCompleted / filteredHabits.length) * 100)
  : 0;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0d0d0d",
      fontFamily: "'DM Sans', sans-serif",
      color: "#f0ece4",
      padding: "0",
      overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,700;1,500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .grain {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.5;
        }

        .blob {
          position: fixed; border-radius: 50%; filter: blur(80px); pointer-events: none; z-index: 0;
        }

        .habit-row {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 12px;
          align-items: center;
          padding: 16px 20px;
          border-radius: 16px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          margin-bottom: 10px;
          transition: background 0.2s;
          position: relative;
          z-index: 1;
        }
        .habit-row:hover { background: rgba(255,255,255,0.07); }

        .day-dot {
          width: 32px; height: 32px;
          border-radius: 50%;
          border: 1.5px solid rgba(255,255,255,0.15);
          background: transparent;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.3);
          transition: all 0.18s ease;
          flex-shrink: 0;
        }
        .day-dot:hover { border-color: rgba(255,255,255,0.4); transform: scale(1.1); }
        .day-dot.done { border-color: transparent; color: #0d0d0d; }
        .day-dot.today-dot { border-width: 2px; }

        .add-btn {
          width: 100%; padding: 14px;
          border-radius: 14px;
          background: rgba(255,255,255,0.05);
          border: 1.5px dashed rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.4);
          font-size: 14px; cursor: pointer;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
          position: relative; z-index: 1;
        }
        .add-btn:hover { background: rgba(255,255,255,0.09); color: rgba(255,255,255,0.7); }

        .input-row {
          display: flex; gap: 8px; margin-bottom: 10px;
          position: relative; z-index: 1;
        }
        .habit-input {
          flex: 1; padding: 12px 16px;
          border-radius: 12px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          color: #f0ece4; font-size: 14px;
          outline: none; font-family: 'DM Sans', sans-serif;
        }
        .habit-input::placeholder { color: rgba(255,255,255,0.3); }
        .habit-input:focus { border-color: rgba(255,255,255,0.3); }

        .confirm-btn {
          padding: 12px 20px; border-radius: 12px;
          background: #f0ece4; color: #0d0d0d;
          border: none; font-weight: 600; cursor: pointer;
          font-family: 'DM Sans', sans-serif; font-size: 14px;
          transition: opacity 0.2s;
        }
        .confirm-btn:hover { opacity: 0.85; }

        .del-btn {
          background: none; border: none;
          color: rgba(255,255,255,0.2); cursor: pointer;
          font-size: 16px; padding: 4px;
          transition: color 0.2s;
          position: absolute; top: 12px; right: 12px;
        }
        .del-btn:hover { color: #ef9a9a; }

        .progress-bar-track {
          width: 100%; height: 6px;
          background: rgba(255,255,255,0.08);
          border-radius: 99px; overflow: hidden;
          margin-top: 8px;
        }
        .progress-bar-fill {
          height: 100%; border-radius: 99px;
          background: linear-gradient(90deg, #f48fb1, #ce93d8);
          transition: width 0.5s ease;
        }

        .streak-badge {
          font-size: 11px; font-weight: 600;
          padding: 3px 8px; border-radius: 99px;
          letter-spacing: 0.02em;
        }
      `}</style>

      {/* Background blobs */}
      <div className="grain" />
      <div className="blob" style={{ width: 400, height: 400, top: -100, right: -100, background: "rgba(206,147,216,0.12)" }} />
      <div className="blob" style={{ width: 300, height: 300, bottom: 0, left: -80, background: "rgba(79,195,247,0.08)" }} />

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "36px 20px 60px", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, lineHeight: 1.1, marginBottom: 8 }}>
            My Habits
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", fontStyle: "italic" }}>{quote}</p>
        </div>

        {/* Progress Card */}
<div style={{
  padding: "20px 24px",
  borderRadius: 20,
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.08)",
  marginBottom: 28,
}}>

  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8 }}>

    {/* LEFT */}
    <div>
      <p style={{
        fontSize: 12,
        color: "rgba(255,255,255,0.35)",
        textTransform: "uppercase",
        letterSpacing: "0.08em"
      }}>
        Today's Progress
      </p>

      <p style={{ fontSize: 28, fontWeight: 600, marginTop: 2 }}>
        {todayCompleted}
<span style={{ fontSize: 16, color: "rgba(255,255,255,0.35)" }}>
  /{filteredHabits.length}
</span>
      </p>
    </div>

    {/* RIGHT */}
    <div style={{
      textAlign: "right",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end"
    }}>
      <p style={{
        fontSize: 32,
        fontWeight: 700,
        color: progress === 100 ? "#a5d6a7" : "#f48fb1"
      }}>
        {progress}%
      </p>

      <p style={{
        fontSize: 14,
        marginTop: 6,
        color: "rgba(255,255,255,0.5)"
      }}>
        {progress < 30 ? "Lazy day 😴" :
         progress < 70 ? "Getting there 👀" :
         progress < 100 ? "That girl energy 💅" :
         "Perfect day 🔥"}
      </p>
    </div>

  </div>

  <div className="progress-bar-track">
    <div
      className="progress-bar-fill"
      style={{ width: `${progress}%` }}
    />
  </div>

</div>

        {/* Week labels */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 4, paddingRight: 20, marginBottom: 6 }}>
          {weekKeys.map((key, i) => {
            const dayOfWeek = new Date(key + "T12:00:00").getDay();
            const isToday = key === todayKey;
            return (
              <div key={key} style={{
                width: 32, textAlign: "center",
                fontSize: 10, fontWeight: isToday ? 700 : 400,
                color: isToday ? "#f48fb1" : "rgba(255,255,255,0.3)",
                letterSpacing: "0.02em",
              }}>
                {DAYS[dayOfWeek]}
              </div>
            );
          })}
        </div>

<div style={{
  display: "flex",
  gap: 8,
  marginBottom: 16,
  overflowX: "auto"
}}>
  {categories.map(cat => (
    <button
      key={cat}
      onClick={() => setActiveCategory(cat)}
      style={{
        padding: "6px 12px",
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.15)",
        background: activeCategory === cat ? "#f48fb1" : "transparent",
        color: activeCategory === cat ? "#0d0d0d" : "rgba(255,255,255,0.6)",
        fontSize: 12,
        cursor: "pointer",
        whiteSpace: "nowrap"
      }}
    >
      {cat}
    </button>
  ))}
</div>

        {/* Habits */}
        {habits
  .filter(habit => activeCategory === "All" || habit.category === activeCategory)
  .map(habit => (
          <div key={habit.id} className="habit-row">
            <button className="del-btn" onClick={() => deleteHabit(habit.id)}>×</button>
            <div style={{ marginBottom: 6 }}>

  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
    
    {/* LEFT SIDE */}
    <div style={{ display: "flex", flexDirection: "column" }}>
      
      <span style={{ fontSize: 14, fontWeight: 500 }}>
        {habit.name}
      </span>

      <span style={{
        fontSize: 11,
        color: "rgba(255,255,255,0.35)",
        marginTop: 2
      }}>
        {habit.category}
      </span>

    </div>

    {/* RIGHT SIDE (STREAK) */}
    {habit.streak > 0 && (
      <span
        className="streak-badge"
        style={{
          background: `${habit.color}22`,
          color: habit.color,
          fontSize: 11,
          padding: "4px 8px",
          borderRadius: 999
        }}
      >
        🔥 {habit.streak}
      </span>
    )}

  </div>

</div>
            <div style={{
              display: "flex",
              gap: 4,
              flexWrap: "wrap",
              justifyContent: "flex-end"
            }}>
              {weekKeys.map((key, i) => {
                const done = habit.completedDays.includes(key);
                const isToday = key === todayKey;
                return (
                  <button
                    key={key}
                    className={`day-dot ${done ? "done" : ""} ${isToday ? "today-dot" : ""}`}
                    style={{
                      background: done ? habit.color : "transparent",
                      borderColor: isToday && !done ? habit.color : undefined,
                    }}
                    onClick={() => toggleDay(habit.id, key)}
                    title={key}
                  >
                    {done ? "✓" : ""}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Add Habit */}
        {adding ? (
          <div className="input-row">
            <input
              className="habit-input"
              placeholder="e.g. Read 10 pages 📚"
              value={newHabit}
              onChange={e => setNewHabit(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addHabit()}
              autoFocus
            />
            <button className="confirm-btn" onClick={addHabit}>Add</button>
            <button onClick={() => setAdding(false)} style={{
              background: "none", border: "none", color: "rgba(255,255,255,0.3)",
              cursor: "pointer", fontSize: 20, padding: "0 4px"
            }}>×</button>
          </div>
        ) : (
          <button className="add-btn" onClick={() => setAdding(true)}>
            + Add new habit
          </button>
        )}

<div style={{
  marginTop: 30,
  padding: "20px",
  borderRadius: 16,
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)"
}}>

  <p style={{
    fontSize: 12,
    color: "rgba(255,255,255,0.35)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: 10
  }}>
    This Week
  </p>

  <p style={{ fontSize: 14, marginBottom: 6 }}>
    ✔ Completed: {weeklyCompleted}
  </p>

  <p style={{ fontSize: 14, marginBottom: 6 }}>
    🔥 Best streak: {bestStreak} days
  </p>

  <p style={{ fontSize: 14 }}>
    📈 Consistency: {weeklyPercent}%
  </p>

<div style={{
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  marginTop: 16,
  gap: 6
}}>
  {dailyData.map((d, i) => {
    const height = (d.count / maxDaily) * 60;

    return (
      <div key={i} style={{ textAlign: "center", flex: 1 }}>
        <div style={{
          height: `${height}px`,
          background: "linear-gradient(180deg, #ce93d8, #f48fb1)",
          borderRadius: 6,
          marginBottom: 4,
          transition: "0.3s"
        }} />
        <span style={{
          fontSize: 10,
          color: "rgba(255,255,255,0.3)"
        }}>
          {new Date(d.day).toLocaleDateString("en-US", { weekday: "short" })}
        </span>
      </div>
    );
  })}
</div>

</div>

        {/* Footer */}
        <p style={{ textAlign: "center", marginTop: 40, fontSize: 12, color: "rgba(255,255,255,0.18)", letterSpacing: "0.05em" }}>
          discipline creates confidence 🔥
        </p>
      </div>
    </div>
  );
}
