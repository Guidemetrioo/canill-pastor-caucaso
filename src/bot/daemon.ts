import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.BOT_API_PORT || 3005;

// Config state variables
let botStatus = "disconnected";
let pairingCode: string | null = null;
let qrCode: string | null = null;
let phoneNumber: string | null = null;

// Callbacks for on-demand pairing code requests and logout
let requestCodeCallback: ((phone: string) => Promise<string>) | null = null;
let logoutCallback: (() => Promise<void>) | null = null;

export function registerRequestCodeCallback(cb: (phone: string) => Promise<string>) {
  requestCodeCallback = cb;
}

export function registerLogoutCallback(cb: () => Promise<void>) {
  logoutCallback = cb;
}

// Log buffer to capture console messages
const logBuffer: string[] = [];
const maxLogs = 500;

function appendToLog(level: string, message: string) {
  const time = new Date().toLocaleTimeString();
  logBuffer.push(`[${time}] [${level}] ${message}`);
  if (logBuffer.length > maxLogs) {
    logBuffer.shift();
  }
}

// Hook into console methods to capture logs
const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;

console.log = (...args) => {
  const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
  appendToLog("INFO", msg);
  originalLog(...args);
};

console.error = (...args) => {
  const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
  appendToLog("ERROR", msg);
  originalError(...args);
};

console.warn = (...args) => {
  const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
  appendToLog("WARN", msg);
  originalWarn(...args);
};

app.use(cors());
app.use(express.json());

// API: Get Status
app.get("/api/status", (req, res) => {
  res.json({
    status: botStatus,
    pairingCode,
    qrCode,
    phoneNumber
  });
});

// API: Get logs
app.get("/api/logs", (req, res) => {
  res.header("Content-Type", "text/plain");
  res.send(logBuffer.join("\n"));
});

// API: Request Pairing Code on demand
app.post("/api/request-code", async (req, res) => {
  const { phoneNumber: phone } = req.body;
  if (!phone) {
    return res.status(400).json({ error: "Número de telefone obrigatório." });
  }
  if (!requestCodeCallback) {
    return res.status(500).json({ error: "Serviço de pareamento ainda não inicializado." });
  }

  try {
    const code = await requestCodeCallback(phone);
    res.json({ success: true, pairingCode: code });
  } catch (err: any) {
    let userMessage = "Falha ao solicitar código do WhatsApp.";
    if (err.message && (err.message.includes("rate-overlimit") || err.message.includes("CompanionHelloError") || err.message === "t")) {
      userMessage = "O WhatsApp bloqueou temporariamente novas solicitações de código por segurança (Limite de tentativas excedido). Por favor, use a opção de escaneamento de QR Code ou aguarde cerca de 1 hora antes de tentar novamente por número.";
    } else if (err.message) {
      userMessage = `Erro: ${err.message}`;
    }
    res.status(500).json({ error: userMessage });
  }
});

// API: Logout/Disconnect WhatsApp Session
app.post("/api/logout", async (req, res) => {
  if (!logoutCallback) {
    return res.status(500).json({ error: "Serviço de desconexão não inicializado." });
  }

  try {
    await logoutCallback();
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Erro ao desconectar a sessão." });
  }
});

// Start express server daemon
export function startDaemon() {
  app.listen(PORT, () => {
    console.log(`🤖 WhatsApp Bot Daemon API rodando em http://localhost:${PORT}`);
  });
}

// State setters
export function setBotStatus(status: string) {
  botStatus = status;
}

export function setPairingCode(code: string | null) {
  pairingCode = code;
}

export function setQrCode(qr: string | null) {
  qrCode = qr;
}

export function setPhoneNumber(phone: string | null) {
  phoneNumber = phone;
}
