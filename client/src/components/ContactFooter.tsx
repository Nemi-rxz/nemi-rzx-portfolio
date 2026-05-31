import type { ComponentType } from "react";
import {
  FiLinkedin,
  FiGithub,
  FiMail,
  FiInstagram,
  FiYoutube,
} from "react-icons/fi";
import { FaWhatsapp, FaXTwitter, FaPinterest } from "react-icons/fa6";
import type { SocialLink } from "../types";

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  linkedin: FiLinkedin,
  github: FiGithub,
  email: FiMail,
  instagram: FiInstagram,
  youtube: FiYoutube,
  whatsapp: FaWhatsapp,
  twitter: FaXTwitter,
  x: FaXTwitter,
  pinterest: FaPinterest,
};

type Props = { socialLinks: SocialLink[] };

export default function ContactFooter({ socialLinks }: Props) {
  return (
    <footer className="contact-section" id="contact">
      <div className="section-container">
        <h2 className="contact-heading">Contact me</h2>
        <div className="social-bar">
          {socialLinks.map((link) => {
            const Icon = iconMap[link.platform.toLowerCase()] || FiMail;
            return (
              <a
                key={link.platform + link.url}
                href={link.url}
                target="_blank"
                rel="noreferrer"
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
        <p className="footer-note">
          © {new Date().getFullYear()} Nemi RZX — Creative Technologist
        </p>
        <a href="/admin/login" className="admin-link-footer">
          Admin
        </a>
      </div>
    </footer>
  );
}
