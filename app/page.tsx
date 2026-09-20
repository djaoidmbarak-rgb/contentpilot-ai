"use client";

import { useState } from "react";

type Trade = {
  symbol: string;
  pnl: number;
  side: string;
};

export default function Home() {
  const [page, setPage] = useState("home");
  const [trades, setTrades] = useState<Trade[]>([]);

  const [symbol, setSymbol] = useState("");
  const [pnl, setPnl] = useState("");
  const [side, setSide] = useState("Long");

  const [image, setImage] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

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

  function addTrade() {
    if (!symbol || pnl === "") {
      alert("Remplis le symbole et le P&L.");
      return;
    }

    const newTrade: Trade = {
      symbol,
      pnl: Number(pnl),
      side,
    };

    setTrades([...trades, newTrade]);

    setSymbol("");
    setPnl("");
  }

  function handleImage(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result as string);
    };

    reader.readAsDataURL(file);
  }

  function analyzeChart() {
    alert(
      "Analyse du graphique lancée. La vraie IA sera connectée ensuite."
    );
  }

  function askCoach() {
    if (!question.trim()) return;

    setMessages([
      ...messages,
      "👤 " + question,
      "🤖 Analyse simulée : vérifie ton contexte, ton risque et tes règles avant de prendre une position.",
    ]);

    setQuestion("");
  }

  return (
    <main className="app">

      {/* HEADER */}

      <header className="header">

        <div className="logo">
          Trade<span>Pilot</span> AI
        </div>

        <div className="avatar">
          TP
        </div>

      </header>


      {/* CONTENU */}

      <div className="content">

        {/* ACCUEIL */}

        {page === "home" && (
          <>
            <h1>Salut 👋</h1>

            <p className="muted">
              Ton assistant de trading IA
            </p>

            <div className="dashboard-card">

              <h2>📊 Tes performances</h2>

              <div className="stats">

                <div>
                  <small>P&L</small>
                  <strong
                    className={
                      totalPnl >= 0
                        ? "green"
                        : "red"
                    }
                  >
                    €{totalPnl.toFixed(2)}
                  </strong>
                </div>

                <div>
                  <small>Trades</small>
                  <strong>
                    {trades.length}
                  </strong>
                </div>

                <div>
                  <small>Win Rate</small>
                  <strong>
                    {winRate}%
                  </strong>
                </div>

              </div>

            </div>


            <h2>Que veux-tu faire ?</h2>


            <ActionCard
              icon="📷"
              title="Analyser un graphique"
              description="Ajoute une capture et analyse ton graphique."
              onClick={() => setPage("scanner")}
            />


            <ActionCard
              icon="➕"
              title="Logger un trade"
              description="Enregistre ton opération dans ton journal."
              onClick={() => setPage("trade")}
            />


            <ActionCard
              icon="🤖"
              title="Demander au coach"
              description="Discute avec ton coach de trading."
              onClick={() => setPage("coach")}
            />


            <ActionCard
              icon="📈"
              title="Dashboard"
              description="Consulte tes statistiques."
              onClick={() => setPage("dashboard")}
            />

          </>
        )}


        {/* SCANNER */}

        {page === "scanner" && (
          <>
            <button
              className="back"
              onClick={() => setPage("home")}
            >
              ← Retour
            </button>

            <h1>📷 Analyse graphique</h1>

            <p className="muted">
              Sélectionne une capture depuis ton téléphone.
            </p>

            <div className="card">

              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
              />

              {image && (
                <img
                  src={image}
                  alt="Graphique"
                  className="chart-image"
                />
              )}

              <button
                className="primary"
                onClick={analyzeChart}
              >
                🔍 Analyser le graphique
              </button>

            </div>

          </>
        )}


        {/* TRADE */}

        {page === "trade" && (
          <>
            <button
              className="back"
              onClick={() => setPage("home")}
            >
              ← Retour
            </button>

            <h1>➕ Nouveau trade</h1>

            <div className="card">

              <label>Symbole</label>

              <input
                value={symbol}
                onChange={(e) =>
                  setSymbol(e.target.value)
                }
                placeholder="BTCUSDT"
              />


              <label>Direction</label>

              <select
                value={side}
                onChange={(e) =>
                  setSide(e.target.value)
                }
              >
                <option>Long</option>
                <option>Short</option>
              </select>


              <label>P&L</label>

              <input
                type="number"
                value={pnl}
                onChange={(e) =>
                  setPnl(e.target.value)
                }
                placeholder="Ex : 120"
              />


              <button
                className="primary"
                onClick={addTrade}
              >
                💾 Enregistrer le trade
              </button>

            </div>

          </>
        )}


        {/* DASHBOARD */}

        {page === "dashboard" && (
          <>
            <button
              className="back"
              onClick={() => setPage("home")}
            >
              ← Retour
            </button>

            <h1>📊 Dashboard</h1>

            <div className="stats-grid">

              <Stat
                title="P&L total"
                value={`€${totalPnl.toFixed(2)}`}
              />

              <Stat
                title="Trades"
                value={String(trades.length)}
              />

              <Stat
                title="Win Rate"
                value={`${winRate}%`}
              />

              <Stat
                title="Gagnants"
                value={String(winningTrades)}
              />

            </div>


            <h2>Derniers trades</h2>

            {trades.length === 0 && (
              <div className="card muted">
                Aucun trade enregistré.
              </div>
            )}

            {trades.map((trade, index) => (

              <div
                className="trade"
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
                      ? "green"
                      : "red"
                  }
                >
                  {trade.pnl >= 0 ? "+" : ""}
                  €{trade.pnl.toFixed(2)}
                </strong>

              </div>

            ))}

          </>
        )}


        {/* COACH */}

        {page === "coach" && (
          <>
            <button
              className="back"
              onClick={() => setPage("home")}
            >
              ← Retour
            </button>

            <h1>🤖 Coach IA</h1>

            <div className="chat">

              <div className="message ai">
                👋 Salut ! Je suis ton coach.
                Pose-moi une question.
              </div>

              {messages.map(
                (message, index) => (
                  <div
                    key={index}
                    className="message"
                  >
                    {message}
                  </div>
                )
              )}

            </div>

            <input
              value={question}
              onChange={(e) =>
                setQuestion(e.target.value)
              }
              placeholder="Ex : pourquoi ce trade était mauvais ?"
            />

            <button
              className="primary"
              onClick={askCoach}
            >
              Envoyer
            </button>

          </>
        )}

      </div>


      {/* NAVIGATION */}

      <nav className="navigation">

        <NavButton
          icon="🏠"
          text="Accueil"
          onClick={() => setPage("home")}
        />

        <NavButton
          icon="📷"
          text="Scanner"
          onClick={() => setPage("scanner")}
        />

        <NavButton
          icon="➕"
          text="Trade"
          onClick={() => setPage("trade")}
        />

        <NavButton
          icon="📊"
          text="Stats"
          onClick={() => setPage("dashboard")}
        />

        <NavButton
          icon="🤖"
          text="Coach"
          onClick={() => setPage("coach")}
        />

      </nav>


      <style jsx>{`

        * {
          box-sizing: border-box;
        }

        .app {
          min-height: 100vh;
          background: #08070f;
          color: white;
          font-family: Arial, sans-serif;
          padding-bottom: 90px;
        }

        .header {
          height: 70px;
          padding: 15px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-size: 22px;
          font-weight: 800;
        }

        .logo span {
          color: #9b5cff;
        }

        .avatar {
          background: #292638;
          padding: 12px;
          border-radius: 50%;
        }

        .content {
          max-width: 600px;
          margin: auto;
          padding: 20px;
        }

        h1 {
          font-size: 32px;
          margin-bottom: 8px;
        }

        h2 {
          margin-top: 25px;
        }

        .muted {
          color: #9995a8;
        }

        .dashboard-card,
        .card,
        .action {
          background: #15131f;
          border: 1px solid #29263a;
          border-radius: 20px;
          padding: 20px;
          margin-top: 14px;
        }

        .action {
          cursor: pointer;
          transition: 0.2s;
        }

        .action:hover {
          border-color: #9b5cff;
          transform: translateY(-2px);
        }

        .action-icon {
          font-size: 25px;
          margin-bottom: 12px;
        }

        .action p {
          color: #9995a8;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-top: 20px;
        }

        .stats small,
        .stats strong {
          display: block;
        }

        .stats small {
          color: #9995a8;
        }

        .stats strong {
          font-size: 21px;
          margin-top: 5px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 20px;
        }

        .stat-box {
          background: #15131f;
          border: 1px solid #29263a;
          border-radius: 16px;
          padding: 18px;
        }

        .stat-box small {
          color: #9995a8;
        }

        .stat-box strong {
          display: block;
          font-size: 23px;
          margin-top: 8px;
        }

        input,
        select {
          width: 100%;
          padding: 14px;
          margin: 8px 0 15px;
          background: #0e0d15;
          color: white;
          border: 1px solid #29263a;
          border-radius: 12px;
        }

        .primary {
          width: 100%;
          padding: 15px;
          border: none;
          border-radius: 13px;
          background: linear-gradient(
            135deg,
            #9b5cff,
            #6330c9
          );
          color: white;
          font-weight: bold;
          cursor: pointer;
        }

        .back {
          background: none;
          border: none;
          color: #aaa;
          font-size: 15px;
          margin-bottom: 15px;
        }

        .chart-image {
          width: 100%;
          max-height: 350px;
          object-fit: contain;
          border-radius: 15px;
          margin: 15px 0;
        }

        .trade {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #15131f;
          border: 1px solid #29263a;
          border-radius: 15px;
          padding: 15px;
          margin-top: 10px;
        }

        .trade small {
          display: block;
          color: #9995a8;
          margin-top: 5px;
        }

        .green {
          color: #4ee19a;
        }

        .red {
          color: #ff647e;
        }

        .chat {
          background: #111019;
          border: 1px solid #29263a;
          border-radius: 15px;
          padding: 15px;
          min-height: 250px;
          margin-top: 20px;
        }

        .message {
          background: #252131;
          padding: 10px;
          border-radius: 12px;
          margin: 8px 0;
        }

        .message.ai {
          background: #1d1830;
        }

        .navigation {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 75px;
          background: #111019;
          border-top: 1px solid #29263a;
          display: flex;
          justify-content: space-around;
          align-items: center;
        }

        .nav-button {
          background: none;
          border: none;
          color: #9995a8;
          cursor: pointer;
          font-size: 11px;
        }

        .nav-button div {
          font-size: 20px;
          margin-bottom: 3px;
        }

      `}</style>

    </main>
  );
}


/* CARTE */

function ActionCard({
  icon,
  title,
  description,
  onClick,
}: {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <div
      className="action"
      onClick={onClick}
    >
      <div className="action-icon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{description}</p>
    </div>
  );
}


/* STATISTIQUE */

function Stat({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="stat-box">
      <small>{title}</small>
      <strong>{value}</strong>
    </div>
  );
}


/* NAVIGATION */

function NavButton({
  icon,
  text,
  onClick,
}: {
  icon: string;
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      className="nav-button"
      onClick={onClick}
    >
      <div>{icon}</div>
      {text}
    </button>
  );
}