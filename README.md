# 🎮 E-CET Games

Plataforma de torneo de integración para el equipo CET de **Sofka**. Permite a los 44 miembros del equipo inscribirse en uno de 4 juegos, ver tablas de posiciones, premios, y a los administradores gestionar resultados.

## Juegos disponibles

| Juego | Máx. jugadores | Modalidad | Ubicación |
|-------|----------------|-----------|-----------|
| Stopots | 10 | Virtual | Cualquier sede o remoto |
| Gartic.io | 14 | Virtual | Cualquier sede o remoto |
| FIFA 18 | 10 | Presencial | Sede Medellín |
| Call of Duty Infinite Warfare | 10 | Presencial | Sede Medellín |

## Tech Stack

- **Frontend:** Next.js 14 (App Router) + React + TypeScript
- **Styling:** Tailwind CSS con design tokens de Sofka
- **Auth:** NextAuth.js con Google Workspace SSO (@sofka.com.co)
- **Database:** Supabase (PostgreSQL)
- **Deploy:** Vercel

---

## 🚀 Setup rápido

### 1. Clonar y configurar

```bash
git clone https://github.com/arinconmoreno/ecet-games.git
cd ecet-games
npm install
cp .env.example .env.local
```

### 2. Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea un nuevo proyecto (plan gratuito)
2. Ve a **SQL Editor** y ejecuta el contenido de `supabase/migration.sql`
3. Ve a **Settings > API** y copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

> ⚠️ **Importante:** En **Settings > API > RLS**, asegúrate de que las políticas RLS estén configuradas. El migration.sql ya las incluye.

### 3. Configurar Google OAuth (SSO corporativo)

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o usa uno existente
3. Ve a **APIs & Services > Credentials > Create Credentials > OAuth 2.0 Client IDs**
4. Tipo: **Web application**
5. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (desarrollo)
   - `https://tu-dominio.vercel.app/api/auth/callback/google` (producción)
6. Copia **Client ID** y **Client Secret** al `.env.local`

> 💡 El parámetro `hd: 'sofka.com.co'` en la configuración de NextAuth restringe el login exclusivamente a cuentas del dominio Sofka.

### 4. Generar NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

Pega el resultado en `NEXTAUTH_SECRET` de tu `.env.local`.

### 5. Archivo `.env.local` completo

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-secret-generado

GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx
```

### 6. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

> 💡 **Modo desarrollo:** Si no tienes Google OAuth configurado aún, puedes usar el login por email. Ingresa cualquier correo de la lista de contactos autorizados (ej: `andres.rincon@sofka.com.co`).

---

## 🌐 Deploy en Vercel

### Opción A: Desde la CLI

```bash
npm i -g vercel
vercel
```

### Opción B: Desde el dashboard

1. Ve a [vercel.com](https://vercel.com) y conecta tu cuenta de GitHub
2. Importa el repositorio `arinconmoreno/ecet-games`
3. En **Environment Variables**, agrega todas las variables del `.env.local`
4. Actualiza `NEXTAUTH_URL` con tu dominio de Vercel (ej: `https://ecet-games.vercel.app`)
5. Actualiza la redirect URI de Google OAuth con tu dominio de Vercel
6. Deploy

---

## 📱 Pantallas

| Pantalla | Ruta | Descripción |
|----------|------|-------------|
| Login | `/` | SSO con @sofka.com.co |
| Inicio | `/home` | Dashboard con stats y juegos |
| Juegos | `/games` | Inscripción/baja de juegos |
| Posiciones | `/leaderboard` | Tabla de posiciones por juego |
| Premios | `/prizes` | Estructura de premios |
| Admin | `/admin` | Gestión de resultados (solo admins) |

## 👤 Administradores

Los siguientes correos tienen acceso al panel de admin:

- `andres.mira@sofka.com.co`
- `andres.rincon@sofka.com.co`
- `david.buitrago@sofka.com.co`
- `alejandra.calderon@sofka.com.co`

## 📋 Reglas de negocio

1. Cada usuario solo puede inscribirse en **1 juego** a la vez
2. Puede darse de baja y cambiarse **antes** del 14 de agosto de 2026
3. Después del deadline, no se permiten cambios de inscripción
4. Solo los admins pueden actualizar puntajes
5. Solo correos `@sofka.com.co` de la lista autorizada pueden ingresar
6. Se respetan los límites de capacidad por juego

## 🏆 Premios

- **1er lugar:** $200.000 COP / $65 USD (por juego)
- **2do lugar:** Reconocimiento E-CET
- **3er lugar:** Reconocimiento E-CET

---

## Licencia

Uso interno — Sofka CET Team
