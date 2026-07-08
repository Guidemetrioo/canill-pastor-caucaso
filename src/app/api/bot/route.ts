import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { spawn } from "child_process";

const pidPath = fs.existsSync(path.resolve(process.cwd(), "node_modules"))
  ? path.resolve(process.cwd(), "node_modules", "bot-whatsapp.pid")
  : path.resolve(process.cwd(), "bot-whatsapp.pid");

// Helper to check if a process is running
function isProcessRunning(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch (e: any) {
    return e.code !== "ESRCH";
  }
}

export async function GET(req: Request) {
  try {
    // 1. Parse search query params (to check for logs request)
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");

    // Check if process is running
    if (!fs.existsSync(pidPath)) {
      return NextResponse.json({ running: false });
    }

    const pidContent = fs.readFileSync(pidPath, "utf8").trim();
    const pid = parseInt(pidContent, 10);

    if (isNaN(pid) || !isProcessRunning(pid)) {
      // Clean up orphaned PID file
      try {
        fs.unlinkSync(pidPath);
      } catch (err) {}
      return NextResponse.json({ running: false });
    }

    // 2. If action is "logs", fetch from local daemon
    if (action === "logs") {
      try {
        const logsRes = await fetch("http://localhost:3005/api/logs", { cache: "no-store" });
        if (logsRes.ok) {
          const logsText = await logsRes.text();
          return NextResponse.json({ success: true, logs: logsText });
        }
      } catch (err) {
        return NextResponse.json({ success: true, logs: "⏳ Inicializando console de logs..." });
      }
      return NextResponse.json({ success: true, logs: "" });
    }

    // 3. Otherwise, return status (try querying daemon)
    try {
      const statusRes = await fetch("http://localhost:3005/api/status", { cache: "no-store" });
      if (statusRes.ok) {
        const daemonData = await statusRes.json();
        return NextResponse.json({
          running: true,
          pid,
          status: daemonData.status,
          qrCode: daemonData.qrCode,
          pairingCode: daemonData.pairingCode,
          phoneNumber: daemonData.phoneNumber
        });
      }
    } catch (daemonErr) {
      // Daemon starting up, fetch last status from database or fallback
      return NextResponse.json({ running: true, pid, status: "connecting" });
    }

    return NextResponse.json({ running: true, pid, status: "connecting" });
  } catch (err: any) {
    return NextResponse.json({ running: false, error: err.message });
  }
}

export async function POST(req: Request) {
  try {
    const { action, phoneNumber } = await req.json();

    if (action === "start") {
      // Detect if running on Vercel / serverless environment
      if (process.env.VERCEL === "1" || process.env.NOW_REGION) {
        return NextResponse.json({
          success: false,
          message: "O robô de WhatsApp não pode ser iniciado a partir do servidor da Vercel. O robô deve ser executado no seu computador local rodando o comando 'npm run bot' no terminal."
        });
      }

      // Check if already running
      if (fs.existsSync(pidPath)) {
        const pid = parseInt(fs.readFileSync(pidPath, "utf8").trim(), 10);
        if (!isNaN(pid) && isProcessRunning(pid)) {
          return NextResponse.json({
            success: false,
            message: `O robô já está rodando sob o PID ${pid}.`,
          });
        }
      }

      console.log("🚀 Spawning WhatsApp Bot process in background...");

      // Spawn process in background (detached)
      const child = spawn("npm", ["run", "bot"], {
        cwd: process.cwd(),
        detached: true,
        stdio: "ignore",
        shell: true,
      });

      // Detach the child process so it survives parent exiting
      child.unref();

      return NextResponse.json({
        success: true,
        message: "Robô inicializado com sucesso em segundo plano.",
      });
    }

    if (action === "stop") {
      if (!fs.existsSync(pidPath)) {
        return NextResponse.json({
          success: false,
          message: "O robô não está ativo.",
        });
      }

      const pid = parseInt(fs.readFileSync(pidPath, "utf8").trim(), 10);
      if (isNaN(pid)) {
        try {
          fs.unlinkSync(pidPath);
        } catch (err) {}
        return NextResponse.json({
          success: true,
          message: "Arquivo PID inválido removido.",
        });
      }

      if (isProcessRunning(pid)) {
        console.log(`🔌 Parando processo do bot (PID: ${pid})...`);
        try {
          process.kill(pid, "SIGTERM");
          // Force stop daemon port 3005 request (optional)
          try {
            await fetch("http://localhost:3005/api/logout", { method: "POST" }).catch(() => {});
          } catch (e) {}

          setTimeout(() => {
            try {
              process.kill(pid, 0);
              process.kill(pid, "SIGKILL");
            } catch (e) {}
          }, 3000);
        } catch (killErr: any) {
          return NextResponse.json({
            success: false,
            message: `Erro ao finalizar processo: ${killErr.message}`,
          });
        }
      }

      try {
        fs.unlinkSync(pidPath);
      } catch (err) {}

      return NextResponse.json({
        success: true,
        message: "Processo do robô interrompido com sucesso.",
      });
    }

    // Proxy action "request-code" to bot daemon
    if (action === "request-code") {
      try {
        const daemonRes = await fetch("http://localhost:3005/api/request-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phoneNumber }),
          cache: "no-store"
        });

        const data = await daemonRes.json();
        if (daemonRes.ok) {
          return NextResponse.json({ success: true, pairingCode: data.pairingCode });
        } else {
          return NextResponse.json({ success: false, message: data.error || "Erro no pareamento." }, { status: daemonRes.status });
        }
      } catch (err) {
        return NextResponse.json({ success: false, message: "O robô não está respondendo na porta 3005. Certifique-se de que ele foi iniciado." }, { status: 503 });
      }
    }

    // Proxy action "logout" to bot daemon
    if (action === "logout") {
      try {
        const daemonRes = await fetch("http://localhost:3005/api/logout", {
          method: "POST",
          cache: "no-store"
        });

        const data = await daemonRes.json();
        if (daemonRes.ok) {
          return NextResponse.json({ success: true });
        } else {
          return NextResponse.json({ success: false, message: data.error || "Erro ao desconectar." }, { status: daemonRes.status });
        }
      } catch (err) {
        return NextResponse.json({ success: false, message: "O robô não está ativo para efetuar o logout." }, { status: 503 });
      }
    }

    return NextResponse.json({ success: false, message: "Ação desconhecida." });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
