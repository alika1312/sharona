// Contact details and the site origin, in one place. Every page, the JSON-LD
// and the floating buttons read from here, so a changed number or address only
// has to be edited once.

export const SITE = "https://sharona-bar-nes.com";

export const PHONE_E164 = "+972587250990";
export const PHONE_LABEL = "058-725-0990";
export const TEL = `tel:${PHONE_E164}`;

export const EMAIL = "sharonabar5@gmail.com";

// wa.me wants the number without the leading "+".
export const WHATSAPP = `https://wa.me/${PHONE_E164.slice(1)}`;

/** WhatsApp link that opens with `text` already typed in. */
export const whatsappWith = (text) => `${WHATSAPP}?text=${encodeURIComponent(text)}`;
