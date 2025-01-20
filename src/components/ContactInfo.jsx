import React from "react";

const contacts = [
  {
    icon: "/whatsapp.png",
    link: "https://wa.me/+972587250990",
    text: "WhatsApp: +972587250990",
  },
  {
    icon: "/phone.png",
    link: "tel:+972533402284",
    text: "Phone: +972533402284",
  },
  {
    icon: "/mail.png",
    link: "https://mail.google.com/mail/?view=cm&fs=1&to=nirkis.al@gmail.com",
    text: "Email: nirkis.al@gmail.com",
  },
];

export const ContactInfo = () => {
  return (
    <div className="fixed top-1/3 right-4 z-50">
      <div className="flex flex-col items-center gap-4">
        {contacts.map((contact, index) => (
          <div key={index} className="group relative">
            <a
              href={contact.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center"
            >
              <img
                src={contact.icon}
                alt="Contact Icon"
                className="w-10 h-10 hover:opacity-80"
              />
            </a>
            <div className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 text-white bg-black text-sm px-2 py-1 rounded-md transition-opacity duration-300">
              {contact.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
