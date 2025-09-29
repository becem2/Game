import React, { useState } from "react";
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
    word: "FIRST",
    clue: "Coming before all others",
    row: 0,
    col: 16,
    direction: "down",
  },
  {
    word: "TECHNICAL",
    clue: "Specialized or practical",
    row: 2,
    col: 0,
    direction: "across",
  },
  // ... add your other words here
];

const GRID_SIZE = 20;

const initializeGrid = (size: number, words: Word[]): string[][] => {
  const newGrid = Array(size)
    .fill(null)
    .map(() => Array(size).fill(""));
  words.forEach((w) => {
    for (let k = 0; k < w.word.length; k++) {
      const r = w.row + (w.direction === "down" ? k : 0);
      const c = w.col + (w.direction === "across" ? k : 0);
      if (newGrid[r] && newGrid[r][c] !== undefined) newGrid[r][c] = "";
    }
  });
  return newGrid;
};

const App: React.FC = () => {
  const [grid, setGrid] = useState<string[][]>(() =>
    initializeGrid(GRID_SIZE, crosswordWords)
  );
  const [selectedCell, setSelectedCell] = useState({ row: 0, col: 0 });
  const [showModal, setShowModal] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [finalWord, setFinalWord] = useState(""); // for the secret word input
  const [bonusSuccess, setBonusSuccess] = useState(false); // to show new message

  const SECRET_WORD = "CSTS"; // replace with your hidden word

  const checkCompletion = (currentGrid: string[][]) => {
    if (completed) return;
    for (const w of crosswordWords) {
      for (let k = 0; k < w.word.length; k++) {
        const r = w.row + (w.direction === "down" ? k : 0);
        const c = w.col + (w.direction === "across" ? k : 0);
        if (
          (currentGrid[r]?.[c] ?? "").toUpperCase() !== w.word[k].toUpperCase()
        ) {
          return; // exit immediately if any letter is wrong
        }
      }
    }
    setCompleted(true);
    setShowModal(true);
  };

  const handleChange = (row: number, col: number, value: string) => {
    const upperValue = value.toUpperCase();
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((r) => [...r]);
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
    setSelectedCell({ row: newRow, col: newCol });
    const input = document.getElementById(
      `cell-${newRow}-${newCol}`
    ) as HTMLInputElement;
    input?.focus();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "2vw",
        padding: "2vw",
        width: "100%",
        minHeight: "100vh",
        backgroundColor: theme === "light" ? "#f0f2f5" : "#1e1e1e",
        color: theme === "light" ? "#000" : "#fff",
        fontFamily: "Arial, sans-serif",
        boxSizing: "border-box",
      }}
    >
      {/* Grid with background image */}
      <div
        style={{
          flex: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          backgroundImage: `url(${theme === "light" ? lightBg : darkBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "130px",
          borderRadius: "10px",
        }}
      >
        <CrosswordGrid
          grid={grid}
          onChange={handleChange}
          handleKeyDown={handleKeyDown}
          words={crosswordWords}
          theme={theme}
        />
      </div>

      {/* Clues Panel */}
      <div
        style={{
          flex: 1,
          backgroundColor: theme === "light" ? "#ffffff" : "#2a2a2a",
          padding: "2rem",
          borderRadius: "1rem",
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          overflowY: "auto",
          maxHeight: "96vh",
          color: theme === "light" ? "#000" : "#fff",
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
        <Clues words={crosswordWords} theme={theme} />
      </div>

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            animation: "fadeIn 0.3s",
          }}
        >
          <div
            style={{
              backgroundColor: theme === "light" ? "#ffffff" : "#2a2a2a",
              color: theme === "light" ? "#000" : "#fff",
              padding: "2.5rem 4rem",
              borderRadius: "1.5rem",
              textAlign: "center",
              boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
              position: "relative",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "2rem",
                color: theme === "light" ? "#001affff" : "#51ffffff",
              }}
            >
              {bonusSuccess ? (
                <>
                  🎊 Amazing! You found the hidden word!
                  <h3
                    style={{
                      fontSize: "1.2rem",
                      marginTop: "1rem",
                      color: theme === "light" ? "#000000ff" : "#ffffffaa",
                    }}
                  >
                    But what is CSTS? <br /> CSTS is a new...
                  </h3>
                </>
              ) : (
                "🎉 Congratulations on finishing the game, that was just the first step. Did you guess the hidden word?"
              )}
            </h2>

            {!bonusSuccess && (
              <div style={{ marginTop: "1.5rem" }}>
                <input
                  type="text"
                  placeholder="Type the hidden word"
                  value={finalWord}
                  onChange={(e) => setFinalWord(e.target.value)}
                  style={{
                    padding: "0.5rem 1rem",
                    fontSize: "1rem",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    width: "70%",
                  }}
                />
                <button
                  onClick={() => {
                    if (finalWord.toUpperCase() === SECRET_WORD) {
                      setBonusSuccess(true);
                    } else {
                      alert("Try again!");
                    }
                  }}
                  style={{
                    marginLeft: "0.5rem",
                    padding: "0.5rem 1rem",
                    borderRadius: "5px",
                    border: "none",
                    backgroundColor: "#4CAF50",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Submit
                </button>
              </div>
            )}

            <button
              onClick={() => {
                setShowModal(false);
                setFinalWord("");
                setBonusSuccess(false);
              }}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "transparent",
                border: "none",
                fontSize: "1.5rem",
                cursor: "pointer",
                color: theme === "light" ? "#888" : "#ccc",
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from {opacity:0} to {opacity:1} }
      `}</style>
    </div>
  );
};

export default App;
