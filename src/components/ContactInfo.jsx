import { trackWhatsappClick, trackClickToCall } from "../lib/analytics";

// Always-visible floating quick-contact: WhatsApp (primary) + one-tap call.
const WHATSAPP =
  "https://wa.me/972587250990?text=" +
  encodeURIComponent("היי שרונה, הגעתי דרך האתר ואשמח לתאם שיחה 🙂");
const TEL = "tel:+972587250990";

export const ContactInfo = () => {
  return (
    <div
      className="org-fabs"
      style={{
        position: "fixed",
        bottom: 22,
        insetInlineEnd: 22,
        zIndex: 87,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <a
        href={WHATSAPP}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackWhatsappClick("floating_fab")}
        aria-label="שליחת הודעה בוואטסאפ"
        className="pill-cta"
        style={{ ...fab, background: "#25D366" }}
      >
        <svg width="30" height="30" viewBox="0 0 32 32" fill="#fff" aria-hidden="true">
          <path d="M16.01 3.2c-7.06 0-12.8 5.73-12.8 12.79 0 2.25.59 4.45 1.71 6.39L3.2 28.8l6.6-1.73a12.76 12.76 0 0 0 6.2 1.58h.01c7.05 0 12.79-5.74 12.79-12.8 0-3.42-1.33-6.63-3.75-9.04a12.7 12.7 0 0 0-9.04-3.61zm0 23.31h-.01c-1.9 0-3.76-.51-5.39-1.48l-.39-.23-3.92 1.03 1.05-3.82-.25-.4a10.6 10.6 0 0 1-1.63-5.66c0-5.86 4.77-10.63 10.64-10.63 2.84 0 5.51 1.11 7.52 3.12a10.56 10.56 0 0 1 3.11 7.52c0 5.87-4.77 10.64-10.63 10.64zm5.83-7.96c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.5-.16-.71.16-.21.32-.82 1.04-1 1.25-.19.21-.37.24-.68.08-.32-.16-1.35-.5-2.57-1.58-.95-.85-1.59-1.9-1.78-2.22-.19-.32-.02-.49.14-.65.15-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.71-1.72-.98-2.35-.26-.62-.52-.54-.71-.55-.18-.01-.4-.01-.61-.01-.21 0-.56.08-.85.4-.29.32-1.11 1.09-1.11 2.66 0 1.57 1.14 3.08 1.3 3.29.16.21 2.25 3.43 5.45 4.81.76.33 1.35.53 1.82.68.76.24 1.46.21 2.01.13.61-.09 1.89-.77 2.16-1.52.27-.74.27-1.38.19-1.51-.08-.13-.29-.21-.61-.37z" />
        </svg>
      </a>
      <a
        href={TEL}
        onClick={() => trackClickToCall("floating_fab")}
        aria-label="חיוג לשרונה"
        // the mobile action bar already carries a call button
        className="pill-cta org-fab-call"
        style={{ ...fab, background: "var(--color-accent-2)" }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11.4 11.4 0 0 0 3.6.58 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.58 3.6a1 1 0 0 1-.25 1l-2.23 2.2z"
            fill="#fff"
          />
        </svg>
      </a>
    </div>
  );
};

const fab = {
  width: 56,
  height: 56,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "var(--shadow-lg)",
};
