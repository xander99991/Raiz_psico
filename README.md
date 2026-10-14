# RAÍZ Psicología Clínica · Sitio web

Sitio web de RAÍZ (Quito · Ambato · En línea), construido con la identidad del *Manual de Marca RAÍZ*.

**Páginas:** Inicio · Psicología y sociedad · Equipo · Tu tarifa · Agenda · Rincón Raíz · Panel `/admin`.

## ¿Qué edito y dónde?

| Quiero cambiar… | Archivo |
|---|---|
| Teléfono, correo, WhatsApp, redes, ciudades, frases, servicios, preguntas frecuentes | `lib/site.ts` |
| Psicólogos, su corriente, bio, modalidades y **horarios** | `lib/equipo.ts` |
| Precios ($20 / $40), preguntas de la calculadora y puntajes | `lib/tarifa.ts` |
| Textos de las corrientes, círculos de la sociedad, mitos | `lib/corrientes.ts` |
| Logos, fotos, ilustraciones | `public/img/` |
| Colores y tipografías | `tailwind.config.ts` |

> Los perfiles con `ejemplo: true` muestran la etiqueta "Perfil de ejemplo". Cámbialo a `false` cuando tengan datos reales.
> Para poner una foto a un psicólogo, súbela a `public/img/` (lo ideal es una foto cuadrada).

## Cómo funciona la agenda

- Cada psicólogo tiene un horario semanal en `lib/equipo.ts`. Las sesiones son de 50 minutos.
- La web solo deja elegir horarios **libres**. Los ocupados aparecen como "Ocupado" y los días completos como "Lleno".
- Si dos personas intentan reservar el mismo horario al mismo tiempo, la base de datos solo acepta a una.
- El precio se calcula **en el servidor** a partir de las respuestas. Nadie puede cambiarlo desde el navegador.
- Se puede reservar desde 12 horas hasta 60 días antes (configurable en `lib/site.ts`).

### Panel `/admin`
Entra en `tu-sitio.vercel.app/admin` con la contraseña `ADMIN_PASSWORD`. Desde ahí puedes:
- ver los turnos por día, con el WhatsApp y el correo de cada persona;
- cambiar el estado (pendiente, confirmada, atendida o cancelada). **Cancelar libera el horario**;
- bloquear días u horas (vacaciones, feriados);
- descargar los turnos en Excel (CSV).

## Publicar en internet (gratis)

1. **Base de datos:** crea una cuenta en [neon.tech](https://neon.tech) (gratis) → *New project* → copia la *connection string* (empieza con `postgresql://`).
   También sirve Supabase, o Vercel → *Storage* → *Neon*, que la conecta sola.
2. **Vercel:** entra en [vercel.com](https://vercel.com) con tu GitHub → *Add New → Project* → elige `Raiz_psico` → *Deploy*.
3. En Vercel → *Settings → Environment Variables* agrega:
   - `DATABASE_URL` = la connection string de Neon
   - `ADMIN_PASSWORD` = una contraseña para el panel
   Luego ve a *Deployments* → *Redeploy*.

Las tablas se crean solas la primera vez que alguien abre la agenda. No hace falta ejecutar nada.

## Trabajar en tu computadora (opcional)

```bash
npm install
cp .env.example .env   # y pon tu DATABASE_URL y ADMIN_PASSWORD
npm run dev            # http://localhost:3000
```

Tecnología: Next.js 14, Tailwind CSS, Framer Motion y PostgreSQL (`pg`).
