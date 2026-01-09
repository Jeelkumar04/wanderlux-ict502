/* forms.js
   - Basic validation for forms (appointment + contact)
   - Contact form: send email via EmailJS if configured, else show setup warning.
*/

(function () {
  // Simple helpers
  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());
  const byId = (id) => document.getElementById(id);

  function setFieldError(fieldId, msg){
    const el = byId(fieldId);
    if (!el) return;
    const err = el.closest('.field')?.querySelector('.error');
    if (err) err.textContent = msg || '';
  }

  function clearErrors(form){
    form.querySelectorAll('.error').forEach(e => e.textContent = '');
  }

  // Appointment form validation (client-side)
  const apptForm = document.querySelector('#appointmentForm');
  if (apptForm) {
    apptForm.addEventListener('submit', (e) => {
      clearErrors(apptForm);

      const name = apptForm.name.value.trim();
      const email = apptForm.email.value.trim();
      const phone = apptForm.phone.value.trim();
      const date = apptForm.date.value.trim();
      const msg = apptForm.message.value.trim();

      let ok = true;

      if (name.length < 2){ setFieldError('apptName', 'Please enter your full name.'); ok = false; }
      if (!isEmail(email)){ setFieldError('apptEmail', 'Please enter a valid email address.'); ok = false; }
      if (phone.length < 8){ setFieldError('apptPhone', 'Please enter a valid phone number.'); ok = false; }
      if (!date){ setFieldError('apptDate', 'Please choose a preferred date.'); ok = false; }
      if (msg.length < 10){ setFieldError('apptMessage', 'Please provide at least 10 characters.'); ok = false; }

      if (!ok) e.preventDefault();
    });
  }

  // Contact form + EmailJS
  const contactForm = document.querySelector('#contactForm');
  const statusBox = document.querySelector('#contactStatus');

  function setStatus(type, text){
    if (!statusBox) return;
    statusBox.className = 'notice' + (type === 'warn' ? ' warn' : '');
    statusBox.textContent = text;
    statusBox.hidden = false;
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearErrors(contactForm);

      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const subject = contactForm.subject.value.trim();
      const message = contactForm.message.value.trim();

      let ok = true;
      if (name.length < 2){ setFieldError('cName', 'Please enter your name.'); ok = false; }
      if (!isEmail(email)){ setFieldError('cEmail', 'Please enter a valid email.'); ok = false; }
      if (subject.length < 3){ setFieldError('cSubject', 'Please add a subject.'); ok = false; }
      if (message.length < 10){ setFieldError('cMessage', 'Please write at least 10 characters.'); ok = false; }
      if (!ok) return;

      // EmailJS config - MUST fill these in (see instructions below)
      const EMAILJS_PUBLIC_KEY = contactForm.dataset.emailjsPublicKey || '';
      const EMAILJS_SERVICE_ID = contactForm.dataset.emailjsServiceId || '';
      const EMAILJS_TEMPLATE_ID = contactForm.dataset.emailjsTemplateId || '';

      // If not configured, show warning + fallback mailto (still "directly" via user's mail client)
      if (!EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !window.emailjs) {
        setStatus(
          'warn',
          'Email sending is not configured yet. Add your EmailJS keys in contact.html. Fallback: opening your email client...'
        );

        const mailto = `mailto:hello@wanderlux.example?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
          `From: ${name} <${email}>\n\n${message}`
        )}`;
        window.location.href = mailto;
        return;
      }

      try {
        window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

        setStatus('info', 'Sending your message…');

        const payload = {
          from_name: name,
          reply_to: email,
          subject: subject,
          message: message
        };

        await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, payload);

        setStatus('info', 'Message sent successfully! We will get back to you soon.');
        contactForm.reset();
      } catch (err) {
        console.error(err);
        setStatus('warn', 'Something went wrong while sending. Please try again or use the fallback email link.');
      }
    });
  }
})();