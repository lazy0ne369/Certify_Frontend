import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

const CAROUSEL_LINES = [
    'Track all your certifications in one place',
    'Never miss a certification expiry again',
    'Your professional credentials, always organized',
    'Stay ahead with timely renewal reminders',
    'Verify and showcase your achievements instantly',
    'One platform for all your professional growth',
];

const PANEL_THEMES = {
    LOGIN: {
        accent: '#2563EB',
        accentSoft: '#60A5FA',
        background:
            'linear-gradient(160deg, #08101f 0%, #10224a 45%, #2563eb 100%)',
        shapes: ['#1D4ED8', '#2563EB', '#132346', '#1E40AF'],
        heading1: 'Professional progress,',
        heading2: 'kept visible.',
    },
    REGISTER: {
        accent: '#0F9D8A',
        accentSoft: '#5EEAD4',
        background:
            'linear-gradient(160deg, #061717 0%, #0f3d39 45%, #0f9d8a 100%)',
        shapes: ['#0F766E', '#0F9D8A', '#0A2A28', '#14B8A6'],
        heading1: 'Build credentials with',
        heading2: 'confidence and clarity.',
    },
};

export default function AuthVisualPanel({ mode }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const navigate = useNavigate();
    const theme = PANEL_THEMES[mode] ?? PANEL_THEMES.LOGIN;

    useEffect(() => {
        const timer = window.setInterval(() => {
            setActiveIndex((current) => (current + 1) % CAROUSEL_LINES.length);
        }, 3600);

        return () => window.clearInterval(timer);
    }, []);

    return (
        <div
            className="relative min-h-[100vh] w-full overflow-hidden lg:min-h-screen lg:w-[42vw]"
        >
            <div
                className="absolute inset-0 transition-colors duration-300"
                style={{ background: theme.background }}
            />

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute bottom-0 left-0 transition-colors duration-300"
                    style={{
                        width: '300px',
                        height: '300px',
                        background: theme.shapes[0],
                        clipPath: 'polygon(0% 100%, 100% 100%, 0% 0%)',
                    }}
                />
                <div
                    className="absolute bottom-0 left-[124px] transition-colors duration-300"
                    style={{
                        width: '240px',
                        height: '240px',
                        background: theme.shapes[1],
                        clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
                    }}
                />
                <div
                    className="absolute right-0 top-0 transition-colors duration-300"
                    style={{
                        width: '180px',
                        height: '180px',
                        background: theme.shapes[2],
                        clipPath: 'polygon(100% 0%, 0% 0%, 100% 100%)',
                    }}
                />
                <div
                    className="absolute right-[-40px] top-[30%] transition-colors duration-300"
                    style={{
                        width: '180px',
                        height: '200px',
                        background: theme.shapes[3],
                        clipPath: 'polygon(20% 0%, 100% 0%, 80% 100%, 0% 100%)',
                    }}
                />
            </div>

            <div className="absolute top-[24px] left-[24px] inline-flex w-fit max-w-[300px] items-center gap-[10px] rounded-full border border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.08)] px-[18px] py-[10px] backdrop-blur-[12px]">
                <ShieldCheck className="h-[20px] w-[20px] shrink-0 text-white" />
                <div className="flex min-w-0 flex-col">
                    <p className="truncate text-sm font-bold tracking-widest text-white">CERTIFY</p>
                    <p className="truncate text-xs text-white/50">Professional Skill Certification Tracking</p>
                </div>
            </div>

            <div className="absolute right-[24px] top-[24px] z-20 rounded-full border border-white/14 bg-white/10 p-[6px] shadow-[0_14px_34px_rgba(0,0,0,0.18)] backdrop-blur-xl">
                <div className="relative flex items-center gap-[6px]">
                    {['LOGIN', 'REGISTER'].map((item) => {
                        const isActive = item === mode;
                        return (
                            <button
                                key={item}
                                type="button"
                                onClick={() => navigate(item === 'LOGIN' ? '/login' : '/register')}
                                className={`relative z-10 min-w-[118px] rounded-full px-[18px] py-[11px] text-[13px] font-[700] transition-colors duration-300 ${
                                    isActive ? 'text-white' : 'text-white/64 hover:text-white'
                                }`}
                            >
                                {isActive && (
                                    <motion.span
                                        layoutId="auth-mode-pill"
                                        className="absolute inset-0 -z-10 rounded-full"
                                        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                                        style={{
                                            background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accentSoft} 100%)`,
                                            boxShadow: `0 12px 28px ${theme.accent}55`,
                                        }}
                                    />
                                )}
                                {item}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="absolute left-[48px] top-1/2 z-10 w-full max-w-[380px] -translate-y-1/2">
                <p
                    className="mb-[20px] text-[11px] font-bold tracking-[3px]"
                    style={{ color: theme.accentSoft }}
                >
                    // CAREER FLOW
                </p>

                <h2 className="text-[36px] font-[800] leading-[1.2] text-white">
                    {theme.heading1}
                </h2>
                <h2
                    className="mb-[20px] text-[36px] font-[800] leading-[1.2]"
                    style={{ color: theme.accentSoft }}
                >
                    {theme.heading2}
                </h2>

                <div className="min-h-[24px]">
                    <p className="text-[15px] font-normal text-[rgba(255,255,255,0.70)]">
                        {CAROUSEL_LINES[activeIndex]}
                    </p>
                </div>

                <div className="mt-[28px] flex gap-[8px]">
                    {CAROUSEL_LINES.map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => setActiveIndex(index)}
                            aria-label={`Slide ${index + 1}`}
                            className="h-[6px] rounded-full transition-all duration-300"
                            style={{
                                width: index === activeIndex ? '24px' : '6px',
                                background: index === activeIndex ? theme.accentSoft : 'rgba(255,255,255,0.3)',
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
