import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './ContactForm.css';

const ContactForm = () => {
    const formRef = useRef(null);
    const submitBtnRef = useRef(null);
    const successMsgRef = useRef(null);

    useEffect(() => {
        // tsParticles will be integrated here
        // For now, using CSS particles
    }, []);

    const handleFocus = (e) => {
        const field = e.target;
        const label = field.previousElementSibling;

        gsap.to(field, {
            boxShadow: '0 0 30px 10px rgba(56, 189, 248, 0.6)',
            borderColor: '#38bdf8',
            scale: 1.02,
            duration: 0.6,
            ease: 'elastic.out(1, 0.6)',
        });

        if (label) {
            gsap.to(label, {
                y: -30,
                scale: 0.85,
                color: '#38bdf8',
                duration: 0.4,
                ease: 'back.out(1.7)',
            });
        }
    };

    const handleBlur = (e) => {
        const field = e.target;
        const label = field.previousElementSibling;

        if (!field.value && label) {
            gsap.to(label, {
                y: 0,
                scale: 1,
                color: '#ffffff',
                duration: 0.4,
                ease: 'power2.out',
            });
        }

        gsap.to(field, {
            boxShadow: '0 0 0 0 rgba(56, 189, 248, 0)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const btn = submitBtnRef.current;
        const form = formRef.current;

        // Button morph to circle
        const tl = gsap.timeline();
        tl.to(btn, {
            width: 60,
            borderRadius: '50%',
            duration: 0.4,
        })
            .to(
                btn.querySelector('.btn-text'),
                {
                    opacity: 0,
                    duration: 0.2,
                },
                '-=0.4'
            )
            .fromTo(
                btn.querySelector('.checkmark'),
                { scale: 0, opacity: 0, rotation: 90 },
                {
                    scale: 1,
                    opacity: 1,
                    rotation: 0,
                    duration: 0.6,
                    display: 'block',
                    ease: 'elastic.out(1, 0.6)',
                }
            );

        // Form fields dissolve
        const fields = form.querySelectorAll('.form-field');
        gsap.to(fields, {
            scale: 0,
            opacity: 0,
            y: -100,
            rotation: () => gsap.utils.random(-45, 45),
            stagger: 0.1,
            duration: 0.8,
            ease: 'back.in(1.7)',
        });

        // Success message typewriter
        setTimeout(() => {
            if (successMsgRef.current) {
                successMsgRef.current.style.display = 'block';
                const text = "Thanks! We'll reach out within 24 hours.";
                // Simple text insertion for now, can be complex typewriter if needed
                successMsgRef.current.textContent = text;
                gsap.fromTo(successMsgRef.current,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.5 }
                );
            }
        }, 1000);
    };

    return (
        <section id="contact-section" className="contact-form-section">
            {/* Particle background placeholder */}
            <div className="particle-bg" aria-hidden="true"></div>

            <div className="contact-container">
                <h2 className="contact-title gradient-text">LET'S BUILD SOMETHING AMAZING</h2>

                <form ref={formRef} onSubmit={handleSubmit} className="contact-form">
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input
                            type="text"
                            id="name"
                            className="form-field"
                            required
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="form-field"
                            required
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="message" className="form-label">Message</label>
                        <textarea
                            id="message"
                            className="form-field form-textarea"
                            rows="5"
                            required
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        ></textarea>
                    </div>

                    <button
                        ref={submitBtnRef}
                        type="submit"
                        className="submit-btn interactive"
                        onMouseEnter={(e) => {
                            gsap.to(e.currentTarget, {
                                scale: 1.1,
                                boxShadow: '0 20px 60px rgba(56, 189, 248, 0.5)',
                                duration: 0.3,
                                ease: 'power2.out',
                            });
                        }}
                        onMouseLeave={(e) => {
                            gsap.to(e.currentTarget, {
                                scale: 1,
                                boxShadow: '0 10px 30px rgba(56, 189, 248, 0.3)',
                                duration: 0.3,
                                ease: 'power2.out',
                            });
                        }}
                    >
                        <span className="btn-text">SEND</span>
                        <span className="checkmark" style={{ display: 'none' }}>✓</span>
                    </button>
                </form>

                <div ref={successMsgRef} className="success-message" style={{ display: 'none' }} aria-live="polite"></div>

                <div className="contact-info">
                    <a href="mailto:hello@vmwebsites.com" className="contact-link interactive">
                        hello@vmwebsites.com
                    </a>
                </div>
            </div>
        </section>
    );
}

export default ContactForm;