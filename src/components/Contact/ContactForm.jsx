import { useRef, useState, useCallback } from 'react';
import './ContactForm.css';
import { gsap, ScrollTrigger } from '../../gsap-config';


// REPLACE THIS URL WITH YOUR OWN DEPLOYMENT URL FROM THE MANUAL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbySOrWyHvsRLY525xpzXYX7YX2AaNeB2FbeTaSXABGDPPxnoNwDH1ozzLgnRR0_h8wdWw/exec";

// ── Field component — CSS handles label float, no GSAP on labels ──────────────
const Field = ({ id, label, type = 'text', rows, required, value, onChange }) => {
    const [focused, setFocused] = useState(false);
    const isTextarea = type === 'textarea';

    return (
        <div className={`field-wrap${focused ? ' is-focused' : ''}${value ? ' has-value' : ''}`}>
            <label htmlFor={id} className="field-label">{label}</label>

            {isTextarea ? (
                <textarea
                    id={id}
                    className="field-input field-textarea"
                    rows={rows || 4}
                    required={required}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    aria-label={label}
                />
            ) : (
                <input
                    id={id}
                    type={type}
                    className="field-input"
                    required={required}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    aria-label={label}
                />
            )}

            {/* Cyan scan line grows on focus via CSS */}
            <span className="field-scan" aria-hidden="true" />
        </div>
    );
};

// ── Main component ────────────────────────────────────────────────────────────
const ContactForm = () => {
    const sectionRef = useRef(null);

    const formRef = useRef(null);
    const submitBtnRef = useRef(null);
    const successRef = useRef(null);

    const [fields, setFields] = useState({ name: '', email: '', phone: '', message: '' });
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [charCount, setCharCount] = useState(0);

    // ── Scroll-triggered entrance ────────────────────────────────────────────
    // Using useCallback + ref callback so it only runs once when section mounts
    const sectionCallback = useCallback((node) => {
        if (!node) return;
        sectionRef.current = node;

        const leftChildren = node.querySelectorAll('.contact-eyebrow, .contact-headline, .contact-descriptor, .contact-direct');
        const rightChildren = node.querySelectorAll('.field-wrap, .submit-row');

        gsap.set(leftChildren, { opacity: 0, y: 40 });
        gsap.set(rightChildren, { opacity: 0, y: 30 });

        ScrollTrigger.create({
            trigger: node,
            start: 'top 75%',
            once: true,
            onEnter: () => {
                gsap.to(leftChildren, {
                    opacity: 1,
                    y: 0,
                    duration: 0.9,
                    stagger: 0.12,
                    ease: 'power3.out',
                });
                gsap.to(rightChildren, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.08,
                    ease: 'power3.out',
                    delay: 0.2,
                });
            }
        });
    }, []);

    // ── Field change handlers ─────────────────────────────────────────────────
    const handleChange = (key) => (e) => {
        setFields(f => ({ ...f, [key]: e.target.value }));
        if (key === 'message') setCharCount(e.target.value.length);
    };

    // ── Submit ────────────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (sending || sent) return;
        setSending(true);

        const btn = submitBtnRef.current;
        const form = formRef.current;
        const success = successRef.current;

        // 1. Button pulse
        gsap.to(btn, {
            scale: 0.97,
            duration: 0.15,
            yoyo: true,
            repeat: 1,
            ease: 'power1.inOut',
        });

        try {
            // 2. Add data sending logic
            const formData = {
                date: new Date().toLocaleString(),
                name: fields.name,
                email: fields.email,
                phone: fields.phone,
                message: fields.message
            };

            await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                body: JSON.stringify(formData)
            });

            // 3. Stagger fields out (Visual success flow)
            const fieldWraps = form.querySelectorAll('.field-wrap');
            gsap.to(fieldWraps, {
                opacity: 0,
                y: -24,
                stagger: 0.06,
                duration: 0.5,
                ease: 'power2.in',
                delay: 0.2,
            });

            // 4. Fade submit row
            gsap.to('.submit-row', {
                opacity: 0,
                duration: 0.4,
                delay: 0.4,
            });

            // 5. Reveal success
            setTimeout(() => {
                setSent(true);
                setSending(false);

                if (success) {
                    success.style.display = 'flex';
                    gsap.fromTo(
                        success.children,
                        { opacity: 0, y: 20 },
                        {
                            opacity: 1,
                            y: 0,
                            stagger: 0.1,
                            duration: 0.7,
                            ease: 'power3.out',
                        }
                    );
                }
            }, 900);

        } catch (error) {
            console.error("Form submission error", error);
            setSending(false);
            alert("Something went wrong. Please try again or email us directly.");
        }
    };

    // ── Button hover — GSAP only on the border glow, not transform ───────────
    const onBtnEnter = () => {
        gsap.to(submitBtnRef.current, {
            boxShadow: '0 0 30px rgba(56,189,248,0.25)',
            duration: 0.3,
            ease: 'power2.out',
        });
    };
    const onBtnLeave = () => {
        gsap.to(submitBtnRef.current, {
            boxShadow: '0 0 0px rgba(56,189,248,0)',
            duration: 0.3,
            ease: 'power2.out',
        });
    };

    return (
        <section
            id="contact-section"
            className="contact-section"
            ref={sectionCallback}
            aria-labelledby="contact-heading"
        >
            {/* Ambient background */}
            <div className="contact-section__bg" aria-hidden="true">
                <div className="contact-section__blob contact-section__blob--1" />
                <div className="contact-section__blob contact-section__blob--2" />
            </div>
            <div className="contact-section__rule" aria-hidden="true" />

            <div className="contact-inner">

                {/* ── LEFT ── */}
                <div className="contact-left">
                    <span className="contact-eyebrow">Start a project</span>

                    <h2 className="contact-headline" id="contact-heading">
                        LET'S<br />
                        BUILD<br />
                        <em>TOGETHER</em>
                    </h2>

                    <p className="contact-descriptor">
                        Have an idea? We turn concepts into polished digital
                        experiences — from first sketch to final launch.
                    </p>

                    <div className="contact-direct">
                        <span className="contact-direct__label">Or reach us directly</span>
                        <a
                            href="mailto:vm.creationteam@gmail.com"
                            className="contact-direct__link interactive"
                        >
                            vm.creationteam@gmail.com
                        </a>
                    </div>
                </div>

                {/* ── RIGHT ── */}
                <div className="contact-right">
                    <form
                        ref={formRef}
                        className="contact-form"
                        onSubmit={handleSubmit}
                        noValidate
                    >
                        <Field
                            id="cf-name"
                            label="Your name"
                            value={fields.name}
                            onChange={handleChange('name')}
                            required
                        />
                        <Field
                            id="cf-email"
                            label="Email address"
                            type="email"
                            value={fields.email}
                            onChange={handleChange('email')}
                            required
                        />
                        <Field
                            id="cf-phone"
                            label="Phone number"
                            type="tel"
                            value={fields.phone}
                            onChange={handleChange('phone')}
                        />
                        <Field
                            id="cf-message"
                            label="Tell us about the project"
                            type="textarea"
                            rows={4}
                            value={fields.message}
                            onChange={handleChange('message')}
                            required
                        />

                        <div className="submit-row">
                            <button
                                ref={submitBtnRef}
                                type="submit"
                                className={`submit-btn interactive${sending ? ' is-sending' : ''}`}
                                onMouseEnter={onBtnEnter}
                                onMouseLeave={onBtnLeave}
                                disabled={sending}
                                aria-label="Send message"
                            >
                                <span className="btn-text">
                                    {sending ? 'Sending…' : 'Send Message'}
                                </span>
                                {/* Arrow icon */}
                                {!sending && (
                                    <span className="submit-arrow" aria-hidden="true">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                )}
                            </button>

                            {fields.message.length > 0 && (
                                <span className="char-count" aria-live="polite">
                                    {charCount} chars
                                </span>
                            )}
                        </div>
                    </form>

                    {/* Success state */}
                    <div
                        ref={successRef}
                        className="contact-success"
                        aria-live="polite"
                        role="status"
                    >
                        <span className="contact-success__icon">✦</span>
                        <p className="contact-success__title">Message sent.</p>
                        <p className="contact-success__body">
                            We'll get back to you within 24 hours.<br />
                            Talk soon.
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default ContactForm;