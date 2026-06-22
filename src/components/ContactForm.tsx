"use client";

import { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("filhote");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Mensagem enviada com sucesso! Entraremos em contato em breve.");
    setName("");
    setEmail("");
    setPhone("");
    setSubject("filhote");
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div className="space-y-1">
        <label className="text-gray-400 font-medium">Nome Completo</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-[#0F0F0F] border border-[#2A2A2A] p-3 rounded-lg text-white text-xs focus:outline-none focus:border-[#D97457]"
          placeholder="Ex: Carlos Augusto..."
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-gray-400 font-medium">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#0F0F0F] border border-[#2A2A2A] p-3 rounded-lg text-white text-xs focus:outline-none focus:border-[#D97457]"
            placeholder="carlos@exemplo.com"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-gray-400 font-medium">Celular</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-[#0F0F0F] border border-[#2A2A2A] p-3 rounded-lg text-white text-xs focus:outline-none focus:border-[#D97457]"
            placeholder="(11) 99876-5432"
            required
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-gray-400 font-medium">Assunto</label>
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full bg-[#0F0F0F] border border-[#2A2A2A] p-3 rounded-lg text-white text-xs focus:outline-none focus:border-[#D97457]"
        >
          <option value="filhote">Comprar Filhote</option>
          <option value="cobertura">Serviço de Cobertura / Monta</option>
          <option value="hospedagem">Hospedagem Canina</option>
          <option value="adestramento">Adestramento</option>
          <option value="visita">Agendar Visita</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-gray-400 font-medium">Mensagem / Dúvida</label>
        <textarea
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full bg-[#0F0F0F] border border-[#2A2A2A] p-3 rounded-lg text-white text-xs focus:outline-none focus:border-[#D97457] resize-none"
          placeholder="Olá! Gostaria de saber mais sobre..."
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-[#D97457] hover:bg-[#C25F43] text-[#0F0F0F] font-bold py-3 rounded-lg transition-all text-xs"
      >
        Enviar Mensagem
      </button>
    </form>
  );
}
