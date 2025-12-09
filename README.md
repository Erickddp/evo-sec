🚨 EVOSEC – NetSec Monitoring Platform

Advanced Local Network Scanner & Diagnostic Toolkit

EVOSEC es una plataforma moderna para escaneo, diagnóstico y análisis de redes locales, construida con TypeScript fullstack, Nmap, Fastify y un dashboard profesional estilo enterprise.

NOTA: EVOSEC funciona exclusivamente en redes privadas (seguras y de tu propiedad).
No escanea hosts públicos por seguridad y cumplimiento legal.

🧩 Índice

🔥 Descripción general

✨ Características principales

🛠 Tecnologías utilizadas

📦 Instalación paso a paso

🚀 Cómo usar EVOSEC

🧠 Arquitectura interna

⚠️ Uso ético obligatorio

📌 Próximas mejoras sugeridas

🔥 1. Descripción General

EVOSEC permite:

Escanear redes locales completas

Detectar hosts activos

Identificar puertos y servicios abiertos

Obtener versiones, productos y sistema operativo estimado

Ejecutar herramientas rápidas como Ping y Traceroute

Visualizar todo en un dashboard profesional y limpio

Perfecto para aprendizaje, auditoría interna, práctica de pentesting legal y monitoreo personal.

✨ 2. Características Principales
🛰 Escaneo Avanzado con Nmap

Incluye 5 perfiles completos:

Perfil	Propósito	Comando base
⚡ Quick	Escaneo rápido	-F
📡 Full	Todos los puertos	-p-
🔍 Deep	Puertos + versión + OS	-p- -sV -O
🔥 Aggressive	Escaneo completo avanzado	-A
🛡 Safe	Scripts NSE seguros	--script=safe -sV

EVOSEC extrae automáticamente:

Sistema operativo detectado

Probabilidad y vendor

Servicios por puerto

Producto y versión

Extra info técnica (SSL, protocolos, banners)

⚙️ Herramientas Rápidas (Dominios Permitidos)

A diferencia de Nmap, estas sí aceptan dominios públicos:

📍 Ping google.com

🌍 Traceroute github.com

🔎 IP o dominio arbitrario

Permite diagnóstico de conectividad y resolución DNS.

🎛 Dashboard Profesional

Incluye:

Tarjetas de resumen

Formulario de escaneo

Tabla de hosts detectados

Drawer técnico por host

Panel de herramientas rápidas

Consola interactiva con logs en vivo

Modo claro/oscuro

🛠 3. Tecnologías Utilizadas
Frontend

React + Vite

Zustand (state)

TypeScript

TailwindCSS + shadcn/ui

Lucide Icons

Backend

Fastify

NodeJS

Child Process (Nmap, Ping, Traceroute)

fast-xml-parser

Monorepo

Workspaces

Packages/shared (tipos globales TS)

📦 4. Instalación (Muy Claras)

Sigue estos pasos exactamente:

🔽 Paso 1: Clonar el proyecto
git clone https://github.com/Erickddp/evo-sec.git
cd evo-sec
npm install

🛡 Paso 2: Instalar Nmap (obligatorio)
Windows

Descargar desde:
https://nmap.org/download.html

Durante la instalación marcar:
✔ Install Npcap in WinPcap API-compatible mode

Linux
sudo apt install nmap

macOS
brew install nmap

▶️ Paso 3: Ejecutar EVOSEC
npm run dev


Esto levanta:

API: http://localhost:4000

Web: http://localhost:5173

🚀 5. Cómo usar EVOSEC
🧭 Escanear una red privada

Ir al panel principal

En Target, escribir:

192.168.1.0/24


Elegir un perfil (ej. Aggressive)

Presionar Start Scan

🔎 Ver detalle de un dispositivo

Selecciona el icono 👁 en la tabla.

Podrás ver:

Estado

Puertos abiertos

Servicios detectados

Versiones

Sistema operativo (si Nmap lo detecta)

🌐 Herramientas rápidas
Ping:
google.com

Traceroute:
8.8.8.8


Dominios públicos totalmente permitidos.

🧠 6. Arquitectura Interna
evosec/
├─ apps/
│  ├─ api/              → Fastify + Nmap tools
│  └─ web/              → React dashboard
├─ packages/
│  └─ shared/           → Tipos TypeScript compartidos
└─ README.md


Monorepo modular, perfecto para escalar nuevas herramientas.

⚠️ 7. Uso Ético Obligatorio

EVOSEC únicamente debe usarse en:

✔ Redes privadas
✔ Dispositivos propios
✔ Laboratorios de pruebas

Queda totalmente prohibido usarlo para:

✘ Escaneo de redes públicas
✘ Terceros sin permiso
✘ Infraestructura del gobierno o empresas ajenas

Tu seguridad es primero, amor.

📌 8. Próximas Mejoras (Opcionales)

📡 Módulo de historial de escaneos

🧬 Comparador entre escaneos

🧱 Firewall tester

🛰 IoT Analyzer

📝 Reportes automáticos en PDF

🔭 Identificador de vulnerabilidades simples