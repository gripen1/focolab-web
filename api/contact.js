export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { name, company, email, phone, need, budget, time } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Nombre y correo son requeridos' });
  }

  try {
    // CORREO 1 → A ti (focolabchile@gmail.com)
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'FocoLab <contacto@focolab.cl>',
        to: ['focolabchile@gmail.com'],
        subject: `🔥 Nueva solicitud de proyecto — ${name}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#fff;border-radius:12px;overflow:hidden;">
            <div style="background:#c8f135;padding:24px 32px;">
              <h1 style="margin:0;color:#0a0a0a;font-size:22px;">Nueva solicitud — FocoLab</h1>
            </div>
            <div style="padding:32px;">
              <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:10px 0;color:#888;font-size:14px;width:140px;">Nombre</td><td style="padding:10px 0;font-size:14px;font-weight:600;">${name}</td></tr>
                ${company ? `<tr><td style="padding:10px 0;color:#888;font-size:14px;">Empresa</td><td style="padding:10px 0;font-size:14px;">${company}</td></tr>` : ''}
                <tr><td style="padding:10px 0;color:#888;font-size:14px;">Email</td><td style="padding:10px 0;font-size:14px;"><a href="mailto:${email}" style="color:#c8f135;">${email}</a></td></tr>
                ${phone ? `<tr><td style="padding:10px 0;color:#888;font-size:14px;">Teléfono</td><td style="padding:10px 0;font-size:14px;">${phone}</td></tr>` : ''}
                <tr><td colspan="2" style="border-top:1px solid #222;padding-top:16px;"></td></tr>
                <tr><td style="padding:10px 0;color:#888;font-size:14px;">Servicio</td><td style="padding:10px 0;font-size:14px;">${need || '—'}</td></tr>
                <tr><td style="padding:10px 0;color:#888;font-size:14px;">Presupuesto</td><td style="padding:10px 0;font-size:14px;">${budget || '—'}</td></tr>
                <tr><td style="padding:10px 0;color:#888;font-size:14px;">Inicio</td><td style="padding:10px 0;font-size:14px;">${time || '—'}</td></tr>
              </table>
              <div style="margin-top:24px;padding:16px;background:#161616;border-radius:8px;border-left:3px solid #c8f135;">
                <p style="margin:0;font-size:13px;color:#888;">Responde a este correo o contacta al cliente por WhatsApp.</p>
              </div>
            </div>
          </div>
        `,
      }),
    });

    // CORREO 2 → Al cliente (confirmación)
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'FocoLab <contacto@focolab.cl>',
        to: [email],
        subject: `✅ Recibimos tu solicitud, ${name.split(' ')[0]}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#fff;border-radius:12px;overflow:hidden;">
            <div style="background:#c8f135;padding:24px 32px;">
              <h1 style="margin:0;color:#0a0a0a;font-size:22px;">¡Hola, ${name.split(' ')[0]}! 👋</h1>
            </div>
            <div style="padding:32px;">
              <p style="font-size:16px;line-height:1.7;margin-bottom:1.5rem;">Recibimos tu solicitud con éxito. Un especialista de <strong style="color:#c8f135;">FocoLab</strong> revisará tu requerimiento y se contactará contigo en <strong>menos de 24 horas hábiles</strong>.</p>

              <div style="background:#161616;border-radius:10px;padding:20px 24px;margin-bottom:24px;border-left:3px solid #c8f135;">
                <p style="margin:0 0 8px;font-size:13px;color:#888;text-transform:uppercase;letter-spacing:0.08em;">Resumen de tu solicitud</p>
                <table style="width:100%;border-collapse:collapse;">
                  <tr><td style="padding:6px 0;color:#888;font-size:13px;width:120px;">Servicio</td><td style="padding:6px 0;font-size:13px;">${need || '—'}</td></tr>
                  <tr><td style="padding:6px 0;color:#888;font-size:13px;">Presupuesto</td><td style="padding:6px 0;font-size:13px;">${budget || '—'}</td></tr>
                  <tr><td style="padding:6px 0;color:#888;font-size:13px;">Inicio</td><td style="padding:6px 0;font-size:13px;">${time || '—'}</td></tr>
                </table>
              </div>

              <p style="font-size:14px;color:#888;line-height:1.6;">¿Tienes alguna duda urgente? Escríbenos directo por WhatsApp:</p>
              <a href="https://wa.me/56961683503" style="display:inline-block;margin-top:12px;background:#25d366;color:#fff;padding:12px 24px;border-radius:99px;text-decoration:none;font-size:14px;font-weight:600;">💬 Escribir por WhatsApp</a>

              <hr style="border:none;border-top:1px solid #222;margin:32px 0;"/>
              <p style="font-size:12px;color:#555;margin:0;">FocoLab · Equipo chileno 🇨🇱 · <a href="https://focolab.cl" style="color:#c8f135;text-decoration:none;">focolab.cl</a></p>
            </div>
          </div>
        `,
      }),
    });

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
