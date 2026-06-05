import type { ComponentType } from "react";
import {
  FiLinkedin,
  FiGithub,
  FiMail,
  FiInstagram,
  FiYoutube,
  FiFileText,
} from "react-icons/fi";
import { FaWhatsapp, FaXTwitter, FaPinterest } from "react-icons/fa6";
import type { SocialLink } from "../types";

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  linkedin: FiLinkedin,
  github: FiGithub,
  email: FiMail,
  instagram: FiInstagram,
  youtube: FiYoutube,
  resume: FiFileText,
  cv: FiFileText,
  file: FiFileText,
  whatsapp: FaWhatsapp,
  twitter: FaXTwitter,
  x: FaXTwitter,
  pinterest: FaPinterest,
};

type Props = {
  socialLinks: SocialLink[];
  contactHeading: string;
  footerNote: string;
};

export default function ContactFooter({
  socialLinks,
  contactHeading,
  footerNote,
}: Props) {
  return (
    <footer className="contact-section" id="contact">
      <div className="section-container">
        <h2 className="contact-heading">{contactHeading}</h2>
        <div className="social-bar">
          {socialLinks.map((link) => {
            const Icon = iconMap[link.platform.toLowerCase()] || FiMail;
            const external = /^https?:\/\//i.test(link.url);
            return (
              <a
                key={link.platform + link.url}
                href={link.url}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
                className="social-item"
              >
                <span className="social-icon">
                  <Icon />
                </span>
                <span className="social-label">{link.label || link.platform}</span>
              </a>
            );
          })}
        </div>
        <p className="footer-note">{footerNote}</p>
        <a href="/admin/login" className="admin-link-footer">
          Admin
        </a>
      </div>
    </footer>
  );
}
