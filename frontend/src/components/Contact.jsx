import { useState } from "react";
import { api } from "../api/client.js";
import { SplitText } from "./ui.jsx";

const TYPES = ["Software project", "Data / analytics", "AI / ML", "Research collaboration", "Job opportunity", "Other"];
const EMPTY = { name: "", email: "", type: TYPES[0], message: "", website: "" };

function validate(v) {
  const e = {};
  if (v.name.trim().length < 2) e.name = "Please enter your name";
  if (!/^\S+@\S+\.\S+$/.test(v.email)) e.email = "Enter a valid email";
  if (v.message.trim().length < 10) e.message = "Message is too short";
  return e;
}

function ContactForm() {
  const [v, setV] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(v);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSending(true);
    setStatus("Sending…");
    try {
      await api.sendMessage(v);
      setStatus("Thanks — your message was sent.");
      setV(EMPTY);
    } catch (err) {
      if (err.data?.errors) setErrors(err.data.errors);
      setStatus(err.status === 429 ? err.message : "Sorry, sending failed. Please try LinkedIn or email instead.");
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate>
      <div>
        <label>
          Full Name
          <input value={v.name} onChange={set("name")} autoComplete="name" />
          <span className="err">{errors.name}</span>
        </label>
      </div>
      <div>
        <label>
          Email Address
          <input type="email" value={v.email} onChange={set("email")} autoComplete="email" />
          <span className="err">{errors.email}</span>
        </label>
      </div>
      <div>
        <label>
          Project Type
          <select value={v.type} onChange={set("type")}>
            {TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label>
          Message
          <textarea rows={4} value={v.message} onChange={set("message")} />
          <span className="err">{errors.message}</span>
        </label>
      </div>
      {/* Honeypot field for bots — hidden from people */}
      <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={v.website} onChange={set("website")} />
      <button className="pill light" type="submit" style={{ alignSelf: "flex-start" }} disabled={sending}>
        Send Message →
      </button>
      <div id="fm" role="status">
        {status}
      </div>
    </form>
  );
}

export default function Contact({ config }) {
  return (
    <footer id="contact">
      <div className="shell">
        <div className="ct">
          <div className="cta">
            <SplitText text="Let’s Build Something Meaningful." />
            <p>
              Whether you have a software project, an interesting research idea or a professional opportunity, I’d
              love to connect.
            </p>
            <div className="cl">
              {config.linkedin && (
                <a href={config.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn <span>↗</span>
                </a>
              )}
              {config.email && (
                <a href={`mailto:${config.email}`}>
                  {config.email} <span>✉</span>
                </a>
              )}
              {config.github && (
                <a href={config.github} target="_blank" rel="noopener noreferrer">
                  GitHub <span>↗</span>
                </a>
              )}
            </div>
          </div>
          <ContactForm />
        </div>
        <div className="leg">
          <span>© {new Date().getFullYear()} SAHIL HAQ · Building Software. Exploring Data. Creating Impact.</span>
          <span>
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
          </span>
        </div>
      </div>
      <div className="fw" aria-hidden="true">
        SAHIL
      </div>
    </footer>
  );
}
