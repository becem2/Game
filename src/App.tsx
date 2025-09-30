import React, { useState, useEffect, useMemo } from "react";
import CrosswordGrid from "./components/CrosswordGrid";
import Clues from "./components/Clues";
import lightBg from "./assets/crosswordbg-01.jpg";
import darkBg from "./assets/crosswordbg_light-01.jpg";

interface Word {
  word: string;
  clue: string;
  row: number;
  col: number;
  direction: "across" | "down";
}

const crosswordWords: Word[] = [
  {
    word: "IMPACT",
    clue: "Strong effect or influence",
    row: 0,
    col: 0,
    direction: "across",
  },
  {
    word: "MEETING",
    clue: "Gathering of people to discuss something",
    row: 0,
    col: 1,
    direction: "down",
  },
  {
    word: "TECHNICAL",
    clue: "Specialized or practical",
    row: 2,
    col: 0,
    direction: "across",
  },
  {
    word: "NETWORKING",
    clue: "Building professional or digital connections",
    row: 2,
    col: 4,
    direction: "down",
  },
  {
    word: "MENTORING",
    clue: "Guiding and advising someone less experienced",
    row: 2,
    col: 13,
    direction: "down",
  },
  {
    word: "TUNISIAN",
    clue: "Person from Tunisia",
    row: 4,
    col: 4,
    direction: "across",
  },
  {
    word: "COMPUTING",
    clue: "Act of using a computer to process information",
    row: 6,
    col: 3,
    direction: "across",
  },
  {
    word: "SYMPOSIUM",
    clue: "Formal meeting where experts discuss a topic",
    row: 8,
    col: 2,
    direction: "down",
  },
  {
    word: "COMPUTER",
    clue: "Machine for processing data",
    row: 8,
    col: 7,
    direction: "down",
  },
  {
    word: "IEEE",
    clue: "Engineering organization for electrical and electronics engineers",
    row: 8,
    col: 13,
    direction: "across",
  },
  {
    word: "INNOVATION",
    clue: "Introduction of new ideas or methods",
    row: 9,
    col: 4,
    direction: "across",
  },
  {
    word: "TUNISIA",
    clue: "North African country on the Mediterranean",
    row: 9,
    col: 10,
    direction: "down",
  },
  {
    word: "GLOBAL",
    clue: "Worldwide or all-encompassing",
    row: 11,
    col: 14,
    direction: "down",
  },
  {
    word: "SOCIETY",
    clue: "Organized group sharing common rules",
    row: 13,
    col: 2,
    direction: "across",
  },
  {
    word: "INDIAN",
    clue: "Person from the second-most populous country",
    row: 13,
    col: 5,
    direction: "down",
  },
  {
    word: "CLOUD",
    clue: "Visible mass of condensed water in the sky, also online storage metaphor",
    row: 13,
    col: 12,
    direction: "across",
  },
  {
    word: "ANNUAL",
    clue: "Happening once every year",
    row: 15,
    col: 10,
    direction: "across",
  },
  {
    word: "NANO",
    clue: "Prefix meaning one-billionth",
    row: 15,
    col: 11,
    direction: "down",
  },
  {
    word: "MICRO",
    clue: "Opposite of MACRO",
    row: 18,
    col: 7,
    direction: "across",
  },
];

const GRID_SIZE = 20;
const SECRET_WORD = "CSTS";

const initializeGrid = (size: number) =>
  Array(size)
    .fill(null)
    .map(() => Array(size).fill(""));

const App: React.FC = () => {
  const [grid, setGrid] = useState<string[][]>(() => initializeGrid(GRID_SIZE));
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showModal, setShowModal] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [finalWord, setFinalWord] = useState("");
  const [bonusSuccess, setBonusSuccess] = useState(false);

  // Specific highlighted cells
  const highlightedCells = ["13-7", "13-10", "13-2", "13-12"];

  // Detect screen resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const activeCells = useMemo(() => {
    const cells = new Set<string>();
    crosswordWords.forEach((w) => {
      for (let k = 0; k < w.word.length; k++) {
        const r = w.row + (w.direction === "down" ? k : 0);
        const c = w.col + (w.direction === "across" ? k : 0);
        cells.add(`${r}-${c}`);
      }
    });
    return cells;
  }, []);

  const checkCompletion = (currentGrid: string[][]) => {
    if (completed) return;
    for (const w of crosswordWords) {
      for (let k = 0; k < w.word.length; k++) {
        const r = w.row + (w.direction === "down" ? k : 0);
        const c = w.col + (w.direction === "across" ? k : 0);
        if (
          (currentGrid[r]?.[c] ?? "").toUpperCase() !== w.word[k].toUpperCase()
        )
          return;
      }
    }
    setCompleted(true);
    setShowModal(true);
  };

  const handleChange = (row: number, col: number, value: string) => {
    const upperValue = value.toUpperCase();
    setGrid((prev) => {
      const newGrid = prev.map((r) => [...r]);
      newGrid[row][col] = upperValue;
      checkCompletion(newGrid);
      return newGrid;
    });
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    row: number,
    col: number
  ) => {
    let newRow = row;
    let newCol = col;
    switch (e.key) {
      case "ArrowUp":
        newRow = Math.max(row - 1, 0);
        break;
      case "ArrowDown":
        newRow = Math.min(row + 1, GRID_SIZE - 1);
        break;
      case "ArrowLeft":
        newCol = Math.max(col - 1, 0);
        break;
      case "ArrowRight":
        newCol = Math.min(col + 1, GRID_SIZE - 1);
        break;
      default:
        return;
    }
    e.preventDefault();
    const input = document.getElementById(
      `cell-${newRow}-${newCol}`
    ) as HTMLInputElement;
    input?.focus();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2vw",
        padding: "2vw",
        width: "100%",
        minHeight: "100vh",
        backgroundColor: theme === "light" ? "#f0f2f5" : "#1e1e1e",
        color: theme === "light" ? "#000" : "#fff",
        fontFamily: "Arial, sans-serif",
        boxSizing: "border-box",
        alignItems: "center",
      }}
    >
      {/* Grid */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundImage: `url(${theme === "light" ? lightBg : darkBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: isMobile ? "1vw" : "2vw",
          borderRadius: "10px",
          width: isMobile ? "100%" : "95%",
        }}
      >
        <CrosswordGrid
          grid={grid}
          onChange={handleChange}
          handleKeyDown={handleKeyDown}
          words={crosswordWords}
          theme={theme}
          highlightedCells={highlightedCells}
        />
      </div>

      {/* Clues */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "2vw",
          width: "95%",
        }}
      >
        <div
          style={{
            flex: 1,
            backgroundColor: theme === "light" ? "#ffffff" : "#2a2a2a",
            padding: "1rem",
            borderRadius: "1rem",
            boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          }}
        >
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            style={{
              marginBottom: "1rem",
              padding: "0.5rem 1rem",
              cursor: "pointer",
              borderRadius: "5px",
              border: "none",
              backgroundColor: theme === "light" ? "#333" : "#ddd",
              color: theme === "light" ? "#fff" : "#000",
            }}
          >
            Switch to {theme === "light" ? "Dark" : "Light"} Theme
          </button>
          <Clues words={crosswordWords} theme={theme} isMobile={isMobile} />
        </div>
      </div>
    </div>
  );
};

export default App;
