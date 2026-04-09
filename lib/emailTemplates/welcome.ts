export const welcomeEmail = (email: string) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  </head>

  <body style="margin:0;padding:0;background-color:#020403;font-family:Arial, sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#020403;padding:30px 0;">
      <tr>
        <td align="center">

          <!-- Main Container -->
          <table width="600" cellpadding="0" cellspacing="0" style="background:#0b0f0d;border-radius:12px;padding:30px;">
            
            <!-- Header -->
            <tr>
              <td align="center" style="padding-bottom:20px;">
                <h1 style="color:#00ff88;margin:0;font-size:24px;">
                  Welcome to EFT 🚀
                </h1>
              </td>
            </tr>

            <!-- Body Text -->
            <tr>
              <td style="color:#cccccc;font-size:15px;line-height:1.6;">
                Hi there,<br/><br/>
                Thanks for joining the EFT waitlist. You're now part of a select group of traders getting early access to our platform.
                <br/><br/>
                We're building a prop trading experience focused on simplicity, fairness, and real opportunities.
              </td>
            </tr>

            <!-- Offer Box -->
            <tr>
              <td style="padding:25px 0;">
                <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #00ff88;border-radius:10px;background:#06110c;padding:20px;">
                  <tr>
                    <td align="center">
                      <p style="margin:0;color:#00ff88;font-weight:bold;font-size:16px;">
                        🎉 Early Access Benefit
                      </p>
                      <p style="margin:10px 0;color:#cccccc;font-size:14px;">
                        You're eligible for a <b>50% discount</b> on your first challenge.
                      </p>

                      <div style="margin-top:10px;padding:10px;background:#000;border-radius:6px;display:inline-block;">
                        <span style="color:#00ff88;font-size:18px;font-weight:bold;letter-spacing:2px;">
                          LAUNCH50
                        </span>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- CTA -->
            <tr>
              <td align="center" style="padding-top:10px;">
                <a href="https://yourdomain.com" 
                  style="display:inline-block;padding:12px 24px;background:#00ff88;color:#000;text-decoration:none;border-radius:6px;font-weight:bold;font-size:14px;">
                  View Platform →
                </a>
              </td>
            </tr>

            <!-- Extra Content (important for spam score) -->
            <tr>
              <td style="padding-top:25px;color:#888;font-size:13px;line-height:1.6;">
                We'll notify you as soon as we go live. In the meantime, stay tuned for updates and tips to help you get started.
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding-top:30px;border-top:1px solid #1a1a1a;color:#666;font-size:12px;text-align:center;line-height:1.6;">
                EFT — Built for serious traders<br/>
                You received this email because you signed up for the EFT waitlist.<br/><br/>
                
                If you didn't sign up, you can safely ignore this email.<br/>
                <a href="#" style="color:#888;text-decoration:underline;">Unsubscribe</a>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
};