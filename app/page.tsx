"use client";

import { useState } from "react";

type Trade = {
  symbol: string;
  pnl: number;
  side: string;
};

export default function Home() {
  const [page, setPage] = useState("home");

  // =========================
  // JOURNAL DE TRADING
  // =========================

  const [trades, setTrades] = useState<Trade[]>([]);
  const [symbol, setSymbol] = useState("");
  const [pnl, setPnl] = useState("");
  const [side, setSide] = useState("Long");

  // =========================
  // SCANNER IA
  // =========================

  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState("");
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  // =========================
  // COACH IA
  // =========================

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [loadingCoach, setLoadingCoach] = useState(false);

  // =========================
  // STATISTIQUES
  // =========================

  const totalPnl = trades.reduce(
    (total, trade) => total + trade.pnl,
    0
  );

  const winningTrades = trades.filter(
    (trade) => trade.pnl > 0
  ).length;

  const winRate =
    trades.length > 0
      ? Math.round((winningTrades / trades.length) * 100)
      : 0;

  // =========================
  // AJOUTER UN TRADE
  // =========================

  function addTrade() {
    if (!symbol.trim() || pnl === "") {
      alert("Remplis le symbole et le P&L.");
      return;
    }

    const newTrade: Trade = {
      symbol: symbol.toUpperCase(),
      pnl: Number(pnl),
      side,
    };

    setTrades((previous) => [...previous, newTrade]);

    setSymbol("");
    setPnl("");
  }

  // =========================
  // UPLOAD GRAPHIQUE
  // =========================

  function handleImage(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("Image trop lourde. Maximum 10 MB.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Sélectionne une image.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result as string);
      setAnalysis("");
    };

    reader.readAsDataURL(file);
  }

  // =========================
  // ANALYSER LE GRAPHIQUE
  // =========================

 async function analyzeChart() {
  if (!image) {
    alert("Sélectionne d'abord un graphique.");
    return;
  }

  setLoadingAnalysis(true);
  setAnalysis("");

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image,
      }),
    });

    const text = await response.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(
        `Réponse serveur invalide (${response.status}) : ${text}`
      );
    }

    if (!response.ok) {
      throw new Error(
        data.error ||
        `Erreur serveur HTTP ${response.status}`
      );
    }

    if (!data.analysis) {
      throw new Error(
        "Le serveur n'a renvoyé aucune analyse."
      );
    }

    setAnalysis(data.analysis);

  } catch (error) {
    console.error("Erreur scanner :", error);

    setAnalysis(
      `❌ ${error instanceof Error
        ? error.message
        : "Erreur inconnue"}`
    );
  } finally {
    setLoadingAnalysis(false);
  }
}

  // =========================
  // COACH IA
  // =========================

  async function askCoach() {
    if (!question.trim() || loadingCoach) return;

    const userQuestion = question.trim();

    setMessages((previous) => [
      ...previous,
      "👤 " + userQuestion,
    ]);

    setQuestion("");
    setLoadingCoach(true);

    try {
      const response = await fetch("/api/coach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: userQuestion,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Erreur du coach IA."
        );
      }

      setMessages((previous) => [
        ...previous,
        "🤖 " + data.answer,
      ]);
    } catch (error) {
      console.error(error);

      setMessages((previous) => [
        ...previous,
        "🤖 ❌ Une erreur est survenue avec le coach IA.",
      ]);
    } finally {
      setLoadingCoach(false);
    }
  }

  // =========================
  // INTERFACE
  // =========================

  return (
    <main className="app">

      {/* HEADER */}

      <header className="header">
        <div>
          <div className="logo">
            TradePilot <span>AI</span>
          </div>

          <div className="subtitle">
            Ton copilote de trading
          </div>
        </div>

        <div className="status">
          <span></span>
          IA ACTIVE
        </div>
      </header>

      {/* =========================
          ACCUEIL
      ========================= */}

      {page === "home" && (
        <section className="content">

          <div className="hero">
            <div className="heroIcon">🤖</div>

            <h1>
              Bienvenue sur
              <br />
              <span>TradePilot AI</span>
            </h1>

            <p>
              Analyse tes graphiques, comprends ton
              marché et améliore ta discipline de trading.
            </p>
          </div>

          <div className="cards">

            <ActionCard
              icon="📸"
              title="Scanner IA"
              text="Envoie ton graphique et laisse l'IA l'analyser."
              onClick={() => setPage("scanner")}
            />

            <ActionCard
              icon="🧠"
              title="Coach IA"
              text="Pose tes questions et apprends à mieux trader."
              onClick={() => setPage("coach")}
            />

            <ActionCard
              icon="📊"
              title="Journal"
              text="Enregistre tes trades et suis tes performances."
              onClick={() => setPage("trade")}
            />

          </div>

          <div className="statsGrid">

            <Stat
              label="Trades"
              value={trades.length.toString()}
            />

            <Stat
              label="Win Rate"
              value={`${winRate}%`}
            />

            <Stat
              label="P&L"
              value={`${totalPnl >= 0 ? "+" : ""}${totalPnl.toFixed(2)} €`}
            />

          </div>

        </section>
      )}

      {/* =========================
          SCANNER
      ========================= */}

      {page === "scanner" && (
        <section className="content">

          <SectionTitle
            icon="📸"
            title="Analyse graphique"
            subtitle="Laisse l'IA étudier ton graphique."
          />

          <div className="uploadBox">

            {!image ? (
              <>
                <div className="uploadIcon">
                  📊
                </div>

                <h2>
                  Ajoute ton graphique
                </h2>

                <p>
                  PNG, JPG ou WEBP — maximum 10 MB
                </p>

                <label className="uploadButton">
                  Choisir une image

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                  />
                </label>
              </>
            ) : (
              <>
                <img
                  src={image}
                  alt="Graphique sélectionné"
                  className="chartImage"
                />

                <div className="buttonRow">

                  <label className="secondaryButton">
                    Changer l'image

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImage}
                    />
                  </label>

                  <button
                    className="primaryButton"
                    onClick={analyzeChart}
                    disabled={loadingAnalysis}
                  >
                    {loadingAnalysis
                      ? "⏳ Analyse en cours..."
                      : "🤖 Analyser avec l'IA"}
                  </button>

                </div>
              </>
            )}

          </div>

          {analysis && (
            <div className="analysisBox">

              <div className="analysisTitle">
                🤖 Analyse TradePilot AI
              </div>

              <div className="analysisText">
                {analysis}
              </div>

            </div>
          )}

          <div className="warning">
            ⚠️ L'analyse IA est informative et ne
            constitue pas un conseil financier personnalisé.
          </div>

        </section>
      )}

      {/* =========================
          AJOUTER TRADE
      ========================= */}

      {page === "trade" && (
        <section className="content">

          <SectionTitle
            icon="📈"
            title="Journal de trading"
            subtitle="Enregistre tes opérations."
          />

          <div className="formCard">

            <label>
              Symbole
            </label>

            <input
              value={symbol}
              onChange={(e) =>
                setSymbol(e.target.value)
              }
              placeholder="Ex : BTCUSD"
            />

            <label>
              P&L (€)
            </label>

            <input
              type="number"
              value={pnl}
              onChange={(e) =>
                setPnl(e.target.value)
              }
              placeholder="Ex : 125"
            />

            <label>
              Direction
            </label>

            <select
              value={side}
              onChange={(e) =>
                setSide(e.target.value)
              }
            >
              <option>Long</option>
              <option>Short</option>
            </select>

            <button
              className="primaryButton full"
              onClick={addTrade}
            >
              + Ajouter le trade
            </button>

          </div>

          <div className="tradeList">

            {trades.length === 0 ? (
              <div className="empty">
                Aucun trade enregistré.
              </div>
            ) : (
              trades.map((trade, index) => (
                <div
                  className="tradeItem"
                  key={index}
                >
                  <div>
                    <strong>
                      {trade.symbol}
                    </strong>

                    <small>
                      {trade.side}
                    </small>
                  </div>

                  <strong
                    className={
                      trade.pnl >= 0
                        ? "profit"
                        : "loss"
                    }
                  >
                    {trade.pnl >= 0 ? "+" : ""}
                    {trade.pnl.toFixed(2)} €
                  </strong>
                </div>
              ))
            )}

          </div>

        </section>
      )}

      {/* =========================
          DASHBOARD
      ========================= */}

      {page === "dashboard" && (
        <section className="content">

          <SectionTitle
            icon="📊"
            title="Dashboard"
            subtitle="Tes statistiques de trading."
          />

          <div className="statsLarge">

            <Stat
              label="P&L total"
              value={`${totalPnl >= 0 ? "+" : ""}${totalPnl.toFixed(2)} €`}
            />

            <Stat
              label="Trades"
              value={trades.length.toString()}
            />

            <Stat
              label="Trades gagnants"
              value={winningTrades.toString()}
            />

            <Stat
              label="Win Rate"
              value={`${winRate}%`}
            />

          </div>

        </section>
      )}

      {/* =========================
          COACH IA
      ========================= */}

      {page === "coach" && (
        <section className="content">

          <SectionTitle
            icon="🧠"
            title="Coach IA"
            subtitle="Pose ta question à TradePilot."
          />

          <div className="coachBox">

            <div className="messages">

              {messages.length === 0 && (
                <div className="coachWelcome">
                  <div className="bigEmoji">
                    🤖
                  </div>

                  <h2>
                    Bonjour 👋
                  </h2>

                  <p>
                    Je suis ton coach IA.
                    Pose-moi une question sur le
                    trading, la structure du marché,
                    le risque ou ta psychologie.
                  </p>
                </div>
              )}

              {messages.map((message, index) => (
                <div
                  className="message"
                  key={index}
                >
                  {message}
                </div>
              ))}

              {loadingCoach && (
                <div className="message">
                  🤖 ⏳ Je réfléchis...
                </div>
              )}

            </div>

            <div className="coachInput">

              <input
                value={question}
                onChange={(e) =>
                  setQuestion(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    askCoach();
                  }
                }}
                placeholder="Pose ta question..."
              />

              <button
                onClick={askCoach}
                disabled={loadingCoach}
              >
                ➤
              </button>

            </div>

          </div>

        </section>
      )}

      {/* =========================
          NAVIGATION
      ========================= */}

      <nav className="bottomNav">

        <NavButton
          icon="⌂"
          label="Accueil"
          active={page === "home"}
          onClick={() => setPage("home")}
        />

        <NavButton
          icon="📸"
          label="Scanner"
          active={page === "scanner"}
          onClick={() => setPage("scanner")}
        />

        <NavButton
          icon="➕"
          label="Trade"
          active={page === "trade"}
          onClick={() => setPage("trade")}
        />

        <NavButton
          icon="📊"
          label="Stats"
          active={page === "dashboard"}
          onClick={() => setPage("dashboard")}
        />

        <NavButton
          icon="🧠"
          label="Coach"
          active={page === "coach"}
          onClick={() => setPage("coach")}
        />

      </nav>

      {/* =========================
          STYLE
      ========================= */}

      <style jsx>{`

        * {
          box-sizing: border-box;
        }

        .app {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at top,
              #18233b 0%,
              #080c14 45%,
              #05070b 100%
            );
          color: white;
          font-family:
            Inter,
            Arial,
            sans-serif;
          padding-bottom: 100px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px;
          border-bottom: 1px solid rgba(255,255,255,.08);
        }

        .logo {
          font-size: 22px;
          font-weight: 800;
        }

        .logo span {
          color: #5ee7a5;
        }

        .subtitle {
          color: #7e8ba3;
          font-size: 12px;
          margin-top: 3px;
        }

        .status {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #5ee7a5;
          font-size: 11px;
          font-weight: 700;
        }

        .status span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #5ee7a5;
          box-shadow: 0 0 12px #5ee7a5;
        }

        .content {
          max-width: 900px;
          margin: auto;
          padding: 30px 20px;
        }

        .hero {
          text-align: center;
          padding: 30px 0;
        }

        .heroIcon {
          font-size: 60px;
          margin-bottom: 15px;
        }

        .hero h1 {
          font-size: 36px;
          line-height: 1.15;
          margin: 0;
        }

        .hero h1 span {
          color: #5ee7a5;
        }

        .hero p {
          color: #8995aa;
          max-width: 550px;
          margin: 18px auto;
          line-height: 1.6;
        }

        .cards {
          display: grid;
          grid-template-columns:
            repeat(
              auto-fit,
              minmax(220px, 1fr)
            );
          gap: 15px;
        }

        .actionCard {
          background: rgba(255,255,255,.045);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 20px;
          padding: 22px;
          cursor: pointer;
          transition: .2s;
        }

        .actionCard:hover {
          transform: translateY(-3px);
          border-color: #5ee7a5;
        }

        .actionIcon {
          font-size: 30px;
          margin-bottom: 15px;
        }

        .actionCard h3 {
          margin: 0 0 8px;
        }

        .actionCard p {
          color: #8995aa;
          font-size: 14px;
          line-height: 1.5;
        }

        .statsGrid,
        .statsLarge {
          display: grid;
          grid-template-columns:
            repeat(
              auto-fit,
              minmax(150px, 1fr)
            );
          gap: 12px;
          margin-top: 20px;
        }

        .stat {
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 16px;
          padding: 18px;
        }

        .statLabel {
          color: #7f8aa0;
          font-size: 12px;
        }

        .statValue {
          font-size: 25px;
          font-weight: 800;
          margin-top: 8px;
        }

        .sectionTitle {
          margin-bottom: 25px;
        }

        .sectionTitle h1 {
          margin: 0;
          font-size: 30px;
        }

        .sectionTitle p {
          color: #8490a5;
          margin-top: 8px;
        }

        .uploadBox,
        .formCard,
        .coachBox,
        .analysisBox {
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 20px;
          padding: 25px;
        }

        .uploadBox {
          text-align: center;
        }

        .uploadIcon {
          font-size: 55px;
        }

        .uploadBox h2 {
          margin-bottom: 8px;
        }

        .uploadBox p {
          color: #7f8aa0;
        }

        input,
        select {
          width: 100%;
          padding: 14px 15px;
          background: #0c111c;
          color: white;
          border: 1px solid #263044;
          border-radius: 12px;
          outline: none;
          margin-top: 7px;
          margin-bottom: 17px;
        }

        input:focus,
        select:focus {
          border-color: #5ee7a5;
        }

        .uploadButton,
        .secondaryButton,
        .primaryButton {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-radius: 12px;
          padding: 13px 18px;
          cursor: pointer;
          border: none;
          font-weight: 700;
        }

        .uploadButton,
        .primaryButton {
          background: #5ee7a5;
          color: #06100b;
        }

        .secondaryButton {
          background: #151c2a;
          color: white;
        }

        .primaryButton:disabled {
          opacity: .5;
          cursor: not-allowed;
        }

        .uploadButton input,
        .secondaryButton input {
          display: none;
        }

        .chartImage {
          width: 100%;
          max-height: 600px;
          object-fit: contain;
          border-radius: 14px;
          margin-bottom: 20px;
          background: black;
        }

        .buttonRow {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .analysisBox {
          margin-top: 20px;
          text-align: left;
        }

        .analysisTitle {
          font-size: 18px;
          font-weight: 800;
          color: #5ee7a5;
          margin-bottom: 18px;
        }

        .analysisText {
          white-space: pre-wrap;
          color: #dce3ef;
          line-height: 1.7;
        }

        .warning {
          margin-top: 15px;
          color: #a8b2c4;
          font-size: 12px;
          text-align: center;
          line-height: 1.5;
        }

        .formCard label {
          display: block;
          font-size: 13px;
          color: #9ba6b9;
        }

        .full {
          width: 100%;
        }

        .tradeList {
          margin-top: 20px;
        }

        .tradeItem {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 14px;
          padding: 17px;
          margin-bottom: 10px;
        }

        .tradeItem small {
          display: block;
          color: #7f8aa0;
          margin-top: 4px;
        }

        .profit {
          color: #5ee7a5;
        }

        .loss {
          color: #ff7373;
        }

        .empty {
          text-align: center;
          color: #7f8aa0;
          padding: 30px;
        }

        .coachBox {
          display: flex;
          flex-direction: column;
          min-height: 550px;
        }

        .messages {
          flex: 1;
          overflow-y: auto;
        }

        .coachWelcome {
          text-align: center;
          max-width: 500px;
          margin: 60px auto;
        }

        .bigEmoji {
          font-size: 55px;
        }

        .coachWelcome p {
          color: #8995aa;
          line-height: 1.6;
        }

        .message {
          background: #101725;
          border: 1px solid #202a3c;
          border-radius: 14px;
          padding: 14px;
          margin-bottom: 10px;
          white-space: pre-wrap;
          line-height: 1.6;
        }

        .coachInput {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .coachInput input {
          margin: 0;
        }

        .coachInput button {
          width: 50px;
          border: none;
          border-radius: 12px;
          background: #5ee7a5;
          cursor: pointer;
          font-size: 20px;
        }

        .coachInput button:disabled {
          opacity: .5;
        }

        .bottomNav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 75px;
          background: rgba(7,10,16,.94);
          backdrop-filter: blur(15px);
          border-top: 1px solid rgba(255,255,255,.08);
          display: flex;
          justify-content: center;
          gap: 5px;
          z-index: 50;
        }

        .navButton {
          flex: 1;
          max-width: 130px;
          border: none;
          background: transparent;
          color: #69758b;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          font-size: 11px;
        }

        .navButton.active {
          color: #5ee7a5;
        }

        .navIcon {
          font-size: 20px;
        }

        @media (max-width: 600px) {

          .hero h1 {
            font-size: 29px;
          }

          .content {
            padding: 25px 15px;
          }

          .header {
            padding: 18px 15px;
          }

          .buttonRow {
            flex-direction: column;
          }

          .buttonRow > * {
            width: 100%;
          }

        }

      `}</style>

    </main>
  );
}

// =========================
// COMPOSANTS
// =========================

function ActionCard({
  icon,
  title,
  text,
  onClick,
}: {
  icon: string;
  title: string;
  text: string;
  onClick: () => void;
}) {
  return (
    <div
      className="actionCard"
      onClick={onClick}
    >
      <div className="actionIcon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{text}</p>
    </div>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="stat">
      <div className="statLabel">
        {label}
      </div>

      <div className="statValue">
        {value}
      </div>
    </div>
  );
}

function SectionTitle({
  icon,
  title,
  subtitle,
}: {
  icon: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="sectionTitle">
      <h1>
        {icon} {title}
      </h1>

      <p>{subtitle}</p>
    </div>
  );
}

function NavButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={
        active
          ? "navButton active"
          : "navButton"
      }
      onClick={onClick}
    >
      <span className="navIcon">
        {icon}
      </span>

      <span>{label}</span>
    </button>
  );
}