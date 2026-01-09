/* calculator.js
   Trip Cost Calculator:
   - Destination + travellers + days + travel style
   - Preset rates (daily per traveller) + accommodation per night + multiplier
   - Shows total + clear sentence output (per brief)
*/

(function () {
  const form = document.querySelector('#calcForm');
  if (!form) return;

  const out = document.querySelector('#calcOutput');
  const errorBox = document.querySelector('#calcError');

  // Preset rates (AUD) - you can adjust
  const DEST = {
    Bali: { dailyPerTraveller: 120, accommodationPerNight: 160 },
    Tokyo: { dailyPerTraveller: 190, accommodationPerNight: 260 },
    Paris: { dailyPerTraveller: 210, accommodationPerNight: 300 },
    Dubai: { dailyPerTraveller: 200, accommodationPerNight: 280 },
    Auckland: { dailyPerTraveller: 150, accommodationPerNight: 220 }
  };

  const MULT = {
    Budget: 0.90,
    Standard: 1.00,
    Luxury: 1.35
  };

  function toMoney(n){
    return n.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' });
  }

  function showError(msg){
    if (errorBox) {
      errorBox.textContent = msg;
      errorBox.hidden = !msg;
    }
  }

  function showOutput(html){
    if (out) out.innerHTML = html;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    showError('');

    const destination = form.destination.value;
    const travellers = Number(form.travellers.value);
    const days = Number(form.days.value);
    const style = form.style.value;

    // Validation
    if (!DEST[destination]) return showError('Please select a valid destination.');
    if (!Number.isFinite(travellers) || travellers < 1 || travellers > 20) return showError('Travellers must be between 1 and 20.');
    if (!Number.isFinite(days) || days < 1 || days > 60) return showError('Days must be between 1 and 60.');
    if (!MULT[style]) return showError('Please choose a travel style.');

    const rate = DEST[destination];
    const multiplier = MULT[style];

    // Cost model:
    // base = (dailyPerTraveller * travellers * days) + (accommodationPerNight * (days - 1))
    // total = base * multiplier
    const accomNights = Math.max(0, days - 1);
    const base = (rate.dailyPerTraveller * travellers * days) + (rate.accommodationPerNight * accomNights);
    const total = Math.round(base * multiplier);

    const sentence = `Estimated cost for ${travellers} traveller${travellers>1?'s':''} to ${destination} for ${days} day${days>1?'s':''}: ${toMoney(total)} – ${style} Travel Package.`;

    showOutput(`
      <div class="results" role="status" aria-live="polite">
        <p style="margin:0 0 8px;"><strong>${sentence}</strong></p>
        <p style="margin:0;color:rgba(234,240,255,0.85);">
          Includes daily activities, recommended experiences, and accommodation estimate. Final pricing depends on flights, season, and custom requests.
        </p>
      </div>
    `);
  });
})();