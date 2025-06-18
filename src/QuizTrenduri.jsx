import React, { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";

const ProFxLogo = ({ width = 140, height = 60, style = {} }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 260 100"
    width={width}
    height={height}
    style={style}
  >
    <rect width="260" height="100" fill="#000000" />
    <text
      x="20"
      y="70"
      fontFamily="Arial, sans-serif"
      fontWeight="300"
      fontSize="64"
      fill="#d3d3d3"
    >
      Pro
    </text>
    <rect x="130" y="18" width="100" height="64" rx="8" ry="8" fill="#c89b00" />
    <text
      x="148"
      y="66"
      fontFamily="Arial, sans-serif"
      fontWeight="700"
      fontSize="48"
      fill="#000000"
    >
      FX
    </text>
  </svg>
);

const questions = [
  {
    question: "Ce reprezintă un trend în analiza pieței Forex?",
    options: [
      "Un indicator tehnic complex",
      "Direcția generală a mișcării prețului",
      "Valoarea totală a tranzacțiilor zilnice",
      "O strategie de tranzacționare pe termen lung",
    ],
    answer: 1,
  },
  {
    question: "Cum arată un trend ascendent?",
    options: [
      "Maxime mai mici și minime mai mici",
      "Mișcări orizontale între suport și rezistență",
      "Maxime mai mari și minime mai mari",
      "Preț constant fără variații",
    ],
    answer: 2,
  },
  {
    question: "Ce caracterizează un trend lateral?",
    options: [
      "Prețul urcă constant",
      "Prețul scade constant",
      "Prețul se mișcă într-un interval fix fără direcție clară",
      "Prețul atinge maxime istorice",
    ],
    answer: 2,
  },
];

export default function QuizTrenduri() {
  const [username, setUsername] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [reviewMode, setReviewMode] = useState(false);
  const diplomaRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    if (!isStarted) inputRef.current?.focus();
  }, [isStarted]);

  const handleStart = () => {
    if (username.trim()) {
      setIsStarted(true);
      setStartTime(Date.now());
    }
  };

  const handleAnswer = (index) => {
    if (selectedOption !== null) return;
    const correct = index === questions[currentQuestion].answer;
    setSelectedOption(index);
    setAnswers((prev) => [
      ...prev,
      {
        question: questions[currentQuestion].question,
        selected: index,
        correct,
        correctIndex: questions[currentQuestion].answer,
        options: questions[currentQuestion].options,
      },
    ]);
    if (correct) setScore((s) => s + 1);

    setTimeout(() => {
      const next = currentQuestion + 1;
      if (next < questions.length) {
        setCurrentQuestion(next);
        setSelectedOption(null);
      } else {
        setShowResult(true);
        setEndTime(Date.now());
      }
    }, 1000);
  };

  const getResultMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage === 100) return "Ești maestrul trendurilor! 🧠🔥";
    if (percentage >= 66) return "Foarte bine! Se vede că ai înțeles.";
    if (percentage >= 33) return "E ok, dar mai aruncă un ochi pe lecție.";
    return "Hai că poți mai bine! Reia lecția și încearcă din nou.";
  };

  const downloadDiploma = () => {
    diplomaRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => {
      html2canvas(diplomaRef.current, {
        useCORS: true,
        backgroundColor: "#ffffff",
        scale: 2,
      }).then((canvas) => {
        const link = document.createElement("a");
        link.download = `diploma_${username}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      });
    }, 600);
  };

  const handleRetry = () => {
    setIsStarted(true);
    setCurrentQuestion(0);
    setSelectedOption(null);
    setScore(0);
    setShowResult(false);
    setAnswers([]);
    setStartTime(Date.now());
    setEndTime(null);
    setReviewMode(false);
  };

  const duration = endTime && startTime ? Math.round((endTime - startTime) / 1000) : 0;
  const scorePercentage = (score / questions.length) * 100;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-2xl rounded-2xl mt-10 max-h-screen overflow-auto relative">
      <div className="flex justify-center mb-6">
        <ProFxLogo />
      </div>
      {!isStarted ? (
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Introdu numele pentru a începe testul</h1>
          <input
            ref={inputRef}
            type="text"
            placeholder="Numele tău"
            className="w-full p-3 mb-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            onClick={handleStart}
            className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
          >
            Începe testul
          </button>
        </div>
      ) : !showResult && !reviewMode ? (
        <div key={currentQuestion} className="transition-opacity duration-500 ease-in-out">
          <div className="mb-4 w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-500 h-4 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
          <h2 className="text-lg font-semibold mb-2">Întrebare {currentQuestion + 1} din {questions.length}</h2>
          <p className="mb-4 text-lg font-medium">{questions[currentQuestion].question}</p>
          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => {
              let buttonClass = "bg-blue-500 hover:bg-blue-600 text-white";
              let icon = "";
              if (selectedOption !== null) {
                if (index === questions[currentQuestion].answer) {
                  buttonClass = "bg-green-500 text-white";
                  icon = "✅";
                } else if (index === selectedOption) {
                  buttonClass = "bg-red-500 text-white";
                  icon = "❌";
                } else {
                  buttonClass = "bg-gray-300 text-black";
                }
              }
              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={selectedOption !== null}
                  className={`w-full py-2 px-4 rounded-xl transition ${buttonClass}`}
                >
                  {option} <span className="ml-2">{icon}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : reviewMode ? (
        <div>
          <h2 className="text-xl font-bold text-center mb-4">Revizuire răspunsuri</h2>
          {answers.map((ans, idx) => (
            <div key={idx} className="mb-4 border p-4 rounded-xl bg-gray-50">
              <p className="font-semibold">{idx + 1}. {ans.question}</p>
              <ul className="mt-2 space-y-1">
                {ans.options.map((opt, i) => (
                  <li
                    key={i}
                    className={`px-2 py-1 rounded ${i === ans.correctIndex ? "bg-green-200" : i === ans.selected && !ans.correct ? "bg-red-200" : ""}`}
                  >
                    {opt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="text-center">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
              onClick={() => setReviewMode(false)}
            >
              Înapoi la rezultat
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-xl font-semibold mb-4">
            Felicitări, {username}!<br />
            Ai răspuns corect la {score} din {questions.length} întrebări în {duration} secunde.
          </p>
          <p className="text-lg mb-4 italic">{getResultMessage()}</p>
          <p className="mb-6 text-sm text-gray-600">
            Răspunsuri corecte: {score} • Greșite: {questions.length - score} • Timp total: {duration} sec
          </p>
          <button
            className="mb-4 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700"
            onClick={() => setReviewMode(true)}
          >
            Revizuiește întrebările
          </button>

          {showResult && !reviewMode && (
            <>
              {scorePercentage > 66 ? (
                <>
                  <button
                    className="mb-4 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700"
                    onClick={downloadDiploma}
                  >
                    Descarcă Diploma
                  </button>
                  <div className="text-center">
                    <div
                      ref={diplomaRef}
                      className="w-full max-w-md mx-auto border-8 p-8 rounded-xl shadow-lg text-center bg-white relative"
                      style={{
                        fontFamily: "Georgia, serif",
                        borderColor: "#c89b00",
                        borderStyle: "double",
                        backgroundImage:
                          "url('https://www.transparenttextures.com/patterns/paper-fibers.png')",
                        backgroundRepeat: "repeat",
                      }}
                    >
                      <ProFxLogo width={160} height={60} style={{ filter: "drop-shadow(2px 2px 2px gray)" }} />
                      <h2 className="text-4xl mb-2" style={{ fontFamily: "'Great Vibes', cursive" }}>
                        Diplomă de Merit
                      </h2>
                      <p className="text-lg mt-2">Se acordă cu onoare lui</p>
                      <p className="text-2xl font-semibold text-blue-700 mt-2 mb-4">{username}</p>
                      <p className="text-gray-800 text-md">
                        pentru finalizarea cu succes a testului despre <strong>trenduri</strong> în cadrul academiei
                      </p>
                      <p className="text-gray-800 font-semibold mt-2 mb-4">ProFX – Curs Forex</p>
                      <div className="inline-block mt-4 px-6 py-2 bg-blue-100 border border-blue-400 rounded-full font-semibold text-blue-800">
                        Scor: {score} / {questions.length}
                      </div>
                      <div
                        className="mt-4 p-4 rounded-xl text-white font-medium"
                        style={{ background: "linear-gradient(to right, #4facfe, #00f2fe)" }}
                      >
                        „Felicitări! Primul pas spre succesul în trading este în spate. Ține-o tot așa!” 🚀📈
                      </div>
                      <div className="flex justify-between mt-8 text-sm text-gray-600">
                        <div className="text-left">
                          <div>_________________</div>
                          <div className="italic">Coordonator ProFX</div>
                        </div>
                        <div className="text-right">
                          <div>_________________</div>
                          <div className="italic">Cursant</div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        Cod diplomă: {username.slice(0, 3).toUpperCase()}-{Date.now().toString().slice(-5)}
                      </p>
                      <p className="text-right text-xs text-gray-400 mt-2">
                        {new Date().toLocaleDateString("ro-RO")} • ProFX Academy
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <button
                  className="mb-4 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition"
                  onClick={handleRetry}
                >
                  ↻ Reia Testul
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
