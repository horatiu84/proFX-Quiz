import React, { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import academyLogo from "./utils/logo.jpg";

const ProFxLogo = ({ width = 140, height = 60, style = {} }) => (
  <img
    src={academyLogo}
    width={width}
    height={height}
    style={style}
    alt="ProFX Academy"
  />
);

export default function DiplomaForm() {
  const [username, setUsername] = useState("");
  const [place, setPlace] = useState("");
  const [month, setMonth] = useState("");
  const [showDiploma, setShowDiploma] = useState(false);
  const diplomaRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleGenerate = (e) => {
    e.preventDefault();
    if (username.trim() && place.trim() && month.trim()) {
      setShowDiploma(true);
    }
  };

  const downloadDiploma = () => {
    diplomaRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => {
      html2canvas(diplomaRef.current, {
        useCORS: true,
        backgroundColor: null,
        scale: 3,
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const width = pdf.internal.pageSize.getWidth();
        const height = pdf.internal.pageSize.getHeight();
        pdf.addImage(imgData, "PNG", 0, 0, width, height);
        pdf.save(`diploma_${username}.pdf`);
      });
    }, 600);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-2xl rounded-2xl mt-10 max-h-screen overflow-auto relative">
      <div className="flex justify-center mb-6">
        <ProFxLogo />
      </div>
      {!showDiploma ? (
        <form className="space-y-4" onSubmit={handleGenerate}>
          <h1 className="text-2xl font-bold mb-4 text-center">
            Completează datele pentru diplomă
          </h1>
          <input
            ref={inputRef}
            type="text"
            placeholder="Numele participantului"
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="text"
            placeholder="Locul obținut (ex: Locul 1)"
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
          />
          <input
            type="text"
            placeholder="Luna concursului (ex: August 2025)"
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 w-full"
          >
            Generează diploma
          </button>
        </form>
      ) : (
        <div className="text-center">
          <button
            className="mb-4 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700"
            onClick={downloadDiploma}
          >
            Descarcă Diploma
          </button>
          <div
            ref={diplomaRef}
            className="w-full max-w-md mx-auto border-8 p-8 rounded-xl shadow-lg text-center relative"
            style={{
              fontFamily: "Georgia, serif",
              borderColor: "#c89b00",
              borderStyle: "double",
              backgroundColor: "#000000",
              color: "#ffffff",
              aspectRatio: "210/297",
            }}
          >
            <ProFxLogo width={160} height={60} />
            <h2
              className="text-4xl mb-2"
              style={{ fontFamily: "'Great Vibes', cursive" }}
            >
              Diplomă de Excelență
            </h2>
            <p className="text-lg mt-2">Se acordă cu onoare lui</p>
            <p
              className="text-2xl font-semibold mt-2 mb-4"
              style={{ color: "#c8ac00" }}
            >
              {username}
            </p>
            <p className="text-gray-300 text-md">
              🏆 Locul {place} 🏆 pentru performanță excepțională și rezultate
              remarcabile în cadrul
            </p>
            <p className="text-gray-300 font-semibold mt-2 mb-1">
              Concurs Trading : {month} ProFX
            </p>
            <div className="mt-2 p-4 rounded-xl font-medium">
              „Felicitări! În trading, victoria nu e întâmplare – e rezultatul
              muncii, analizei și disciplinei.”
            </div>
            <div className="flex justify-between mt-8 text-sm text-gray-400">
              <div className="text-left">
                <div
                  style={{
                    fontFamily: "'Great Vibes', cursive",
                    fontSize: "1.5rem",
                    marginTop: "0.2rem",
                    color: "#c8ac00",
                    fontWeight: 400,
                    letterSpacing: "1px",
                  }}
                >
                  ProFX Team
                </div>
                <div>_________________</div>
                <div className="italic">Coordonator ProFX</div>
              </div>
              <div className="text-right">
                <div
                  style={{
                    fontFamily: "'Great Vibes', cursive",
                    fontSize: "1.5rem",
                    marginTop: "0.2rem",
                    color: "#c8ac00",
                    fontWeight: 400,
                    letterSpacing: "1px",
                  }}
                >
                  {username}
                </div>
                <div>_________________</div>
                <div className="italic">Participant</div>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Cod diplomă: {username.slice(0, 3).toUpperCase()}-
              {Date.now().toString().slice(-5)}
            </p>
            <p className="text-right text-xs text-gray-400 mt-2">
              {new Date().toLocaleDateString("ro-RO")} • ProFX Academy
            </p>
          </div>
          <button
            className="mt-6 px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700"
            onClick={() => setShowDiploma(false)}
          >
            ↻ Generează altă diplomă
          </button>
        </div>
      )}
    </div>
  );
}
