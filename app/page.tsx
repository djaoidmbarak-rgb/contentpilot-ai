<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>TradePilot AI</title>

  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background: #08070f;
      color: white;
      font-family: Arial, sans-serif;
    }

    .app {
      max-width: 430px;
      margin: auto;
      min-height: 100vh;
      padding-bottom: 90px;
    }

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
    }

    .logo {
      font-size: 22px;
      font-weight: bold;
    }

    .logo span {
      color: #9b5cff;
    }

    .avatar {
      background: #292536;
      padding: 12px;
      border-radius: 50%;
    }

    main {
      padding: 10px 18px;
    }

    .screen {
      display: none;
    }

    .screen.active {
      display: block;
    }

    h1 {
      font-size: 32px;
      margin-bottom: 8px;
    }

    h2 {
      margin: 20px 0 12px;
    }

    .subtitle {
      color: #9995a8;
      margin-bottom: 20px;
    }

    .card {
      background: #15131f;
      border: 1px solid #29263a;
      border-radius: 20px;
      padding: 20px;
      margin-bottom: 12px;
    }

    .button-card {
      cursor: pointer;
    }

    .button-card:hover {
      border-color: #9b5cff;
    }

    .icon {
      font-size: 25px;
      margin-bottom: 15px;
    }

    .button-card h3 {
      margin-bottom: 7px;
    }

    .button-card p {
      color: #9995a8;
    }

    button {
      width: 100%;
      border: none;
      border-radius: 13px;
      padding: 15px;
      background: linear-gradient(135deg, #9b5cff, #6330c9);
      color: white;
      font-size: 15px;
      font-weight: bold;
      cursor: pointer;
      margin-top: 10px;
    }

    input,
    select,
    textarea {
      width: 100%;
      padding: 14px;
      margin: 7px 0;
      background: #0d0c14;
      color: white;
      border: 1px solid #29263a;
      border-radius: 12px;
    }

    .preview {
      width: 100%;
      margin-top: 10px;
      border-radius: 15px;
      display: none;
    }

    .stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .stat {
      background: #171521;
      border: 1px solid #29263a;
      padding: 15px;
      border-radius: 15px;
    }

    .stat small {
      color: #9995a8;
    }

    .stat strong {
      display: block;
      font-size: 23px;
      margin-top: 7px;
    }

    .green {
      color: #4ee19a;
    }

    .red {
      color: #ff647e;
    }

    .trade {
      background: #15131f;
      border: 1px solid #29263a;
      padding: 15px;
      border-radius: 15px;
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
    }

    nav {
      position: fixed;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: min(430px, 100%);
      height: 75px;
      background: #111019;
      border-top: 1px solid #29263a;
      display: flex;
      justify-content: space-around;
      align-items: center;
    }

    nav button {
      background: none;
      padding: 5px;
      margin: 0;
      color: #858193;
      font-size: 11px;
    }

    nav button.active {
      color: #b16cff;
    }
  </style>
</head>

<body>

<div class="app">

  <header>
    <div class="logo">
      Trade<span>Pilot</span> AI
    </div>

    <div class="avatar">
      TP
    </div>
  </header>

  <main>

    <!-- ACCUEIL -->
    <section id="home" class="screen active">

      <h1>Salut 👋</h1>

      <p class="subtitle">
        Ton assistant de trading IA
      </p>

      <div class="card">
        <h2>📊 Dashboard</h2>

        <div class="stats">

          <div class="stat">
            <small>P&L</small>
            <strong id="homePnl">€0</strong>
          </div>

          <div class="stat">
            <small>Trades</small>
            <strong id="homeTrades">0</strong>
          </div>

        </div>
      </div>

      <h2>Que veux-tu faire ?</h2>

      <div class="card button-card"
           onclick="showScreen('scanner')">

        <div class="icon">📷</div>

        <h3>Analyser un graphique</h3>

        <p>
          Ajoute une capture et analyse ton graphique.
        </p>

      </div>

      <div class="card button-card"
           onclick="showScreen('trade')">

        <div class="icon">➕</div>

        <h3>Ajouter un trade</h3>

        <p>
          Enregistre ton trade dans ton journal.
        </p>

      </div>

      <div class="card button-card"
           onclick="showScreen('coach')">

        <div class="icon">🤖</div>

        <h3>Coach IA</h3>

        <p>
          Discute avec ton assistant.
        </p>

      </div>

    </section>


    <!-- SCANNER -->
    <section id="scanner" class="screen">

      <h1>Scanner</h1>

      <p class="subtitle">
        Analyse ton graphique
      </p>

      <div class="card">

        <input
          type="file"
          accept="image/*"
          onchange="loadImage(event)"
        >

        <img
          id="chartPreview"
          class="preview"
        >

        <button onclick="analyzeChart()">
          🔍 Analyser
        </button>

      </div>

      <div
        id="analysis"
        class="card"
        style="display:none"
      >

        <h3>Analyse IA</h3>

        <br>

        <div class="stats">

          <div class="stat">
            <small>Tendance</small>
            <strong>À confirmer</strong>
          </div>

          <div class="stat">
            <small>Risque</small>
            <strong>Modéré</strong>
          </div>

        </div>

        <br>

        <p>
          Structure du marché détectée.
          Vérifie toujours ton scénario avant toute prise de position.
        </p>

      </div>

    </section>


    <!-- AJOUTER TRADE -->
    <section id="trade" class="screen">

      <h1>Nouveau trade</h1>

      <p class="subtitle">
        Ajoute ton opération
      </p>

      <div class="card">

        <input
          id="symbol"
          placeholder="BTCUSDT"
        >

        <select id="direction">
          <option>Long</option>
          <option>Short</option>
        </select>

        <input
          id="pnl"
          type="number"
          placeholder="P&L (€)"
        >

        <textarea
          id="note"
          placeholder="Pourquoi as-tu pris ce trade ?"
        ></textarea>

        <button onclick="saveTrade()">
          💾 Enregistrer
        </button>

      </div>

    </section>


    <!-- DASHBOARD -->
    <section id="dashboard" class="screen">

      <h1>Dashboard</h1>

      <div class="stats">

        <div class="stat">
          <small>P&L total</small>
          <strong id="totalPnl">
            €0
          </strong>
        </div>

        <div class="stat">
          <small>Trades</small>
          <strong id="totalTrades">
            0
          </strong>
        </div>

        <div class="stat">
          <small>Win Rate</small>
          <strong id="winRate">
            0%
          </strong>
        </div>

        <div class="stat">
          <small>Gagnants</small>
          <strong id="winningTrades">
            0
          </strong>
        </div>

      </div>

      <h2>Derniers trades</h2>

      <div id="tradeList"></div>

    </section>


    <!-- COACH -->
    <section id="coach" class="screen">

      <h1>Coach IA 🤖</h1>

      <p class="subtitle">
        Ton assistant de trading
      </p>

      <div class="card">

        <div
          id="chat"
          style="
            min-height:180px;
            margin-bottom:10px;
          "
        >
          <p>
            👋 Salut ! Pose-moi une question
            sur ton trading.
          </p>
        </div>

        <input
          id="question"
          placeholder="Écris ta question..."
        >

        <button onclick="askCoach()">
          Envoyer
        </button>

      </div>

    </section>

  </main>


  <!-- NAVIGATION -->

  <nav>

    <button
      id="navHome"
      class="active"
      onclick="showScreen('home')"
    >
      🏠<br>
      Accueil
    </button>

    <button
      onclick="showScreen('scanner')"
    >
      📷<br>
      Scanner
    </button>

    <button
      onclick="showScreen('trade')"
    >
      ➕<br>
      Trade
    </button>

    <button
      onclick="showScreen('dashboard')"
    >
      📊<br>
      Stats
    </button>

    <button
      onclick="showScreen('coach')"
    >
      🤖<br>
      Coach
    </button>

  </nav>

</div>


<script>

  /*
   * NAVIGATION
   */

  function showScreen(screen) {

    document
      .querySelectorAll(".screen")
      .forEach(element => {
        element.classList.remove("active");
      });

    document
      .getElementById(screen)
      .classList.add("active");

    if (screen === "dashboard") {
      updateDashboard();
    }

  }


  /*
   * IMAGE
   */

  function loadImage(event) {

    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(e) {

      const image =
        document.getElementById("chartPreview");

      image.src = e.target.result;

      image.style.display = "block";

    };

    reader.readAsDataURL(file);

  }


  /*
   * ANALYSE
   */

  function analyzeChart() {

    document
      .getElementById("analysis")
      .style.display = "block";

  }


  /*
   * TRADES
   */

  function getTrades() {

    return JSON.parse(
      localStorage.getItem("trades") || "[]"
    );

  }


  function saveTrade() {

    const symbol =
      document.getElementById("symbol").value;

    const direction =
      document.getElementById("direction").value;

    const pnl =
      Number(
        document.getElementById("pnl").value
      );

    const note =
      document.getElementById("note").value;

    if (!symbol || isNaN(pnl)) {

      alert("Remplis le symbole et le P&L.");

      return;

    }

    const trades = getTrades();

    trades.push({

      symbol,
      direction,
      pnl,
      note,
      date: new Date().toISOString()

    });

    localStorage.setItem(
      "trades",
      JSON.stringify(trades)
    );

    document.getElementById("symbol").value = "";

    document.getElementById("pnl").value = "";

    document.getElementById("note").value = "";

    alert("Trade enregistré ✅");

    updateDashboard();

  }


  /*
   * DASHBOARD
   */

  function updateDashboard() {

    const trades = getTrades();

    const total =
      trades.reduce(
        (sum, trade) =>
          sum + trade.pnl,
        0
      );

    const winners =
      trades.filter(
        trade => trade.pnl > 0
      ).length;

    const winRate =
      trades.length
        ? Math.round(
            winners / trades.length * 100
          )
        : 0;

    document.getElementById(
      "totalPnl"
    ).textContent =
      "€" + total.toFixed(2);

    document.getElementById(
      "totalTrades"
    ).textContent =
      trades.length;

    document.getElementById(
      "winningTrades"
    ).textContent =
      winners;

    document.getElementById(
      "winRate"
    ).textContent =
      winRate + "%";

    document.getElementById(
      "homePnl"
    ).textContent =
      "€" + total.toFixed(2);

    document.getElementById(
      "homeTrades"
    ).textContent =
      trades.length;

    const list =
      document.getElementById(
        "tradeList"
      );

    list.innerHTML = "";

    trades
      .slice()
      .reverse()
      .forEach(trade => {

        const div =
          document.createElement("div");

        div.className = "trade";

        div.innerHTML = `

          <div>
            <strong>
              ${trade.symbol}
            </strong>

            <br>

            <small>
              ${trade.direction}
            </small>
          </div>

          <strong class="${
            trade.pnl >= 0
              ? "green"
              : "red"
          }">

            ${
              trade.pnl >= 0
                ? "+"
                : ""
            }€${trade.pnl.toFixed(2)}

          </strong>

        `;

        list.appendChild(div);

      });

  }


  /*
   * COACH
   */

  function askCoach() {

    const input =
      document.getElementById(
        "question"
      );

    const question =
      input.value.trim();

    if (!question) return;

    const chat =
      document.getElementById("chat");

    chat.innerHTML += `

      <p style="
        background:#252131;
        padding:10px;
        border-radius:12px;
        margin:8px 0;
      ">

        👤 ${question}

      </p>

      <p style="
        background:#1d1830;
        padding:10px;
        border-radius:12px;
        margin:8px 0;
      ">

        🤖 Je vais analyser ta question.
        Dans cette première version,
        ma réponse est simulée.
        La prochaine étape sera de connecter
        une véritable IA.

      </p>

    `;

    input.value = "";

  }


  updateDashboard();

</script>

</body>
</html>