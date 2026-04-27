import { ShieldCheck, Sparkles } from 'lucide-react';

export default function AuthShowcasePanel({
    eyebrow,
    title,
    copy,
    highlights = [],
    metricLabel,
    metricValue,
    metricHint,
}) {
    return (
        <div className="auth-visual-panel hidden min-h-full flex-col justify-between p-8 text-white lg:flex xl:p-10">
            <div className="relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/8 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/86">
                    <Sparkles className="h-3.5 w-3.5" />
                    {eyebrow}
                </div>
                <h2 className="mt-6 max-w-sm font-display text-5xl leading-[1.02] tracking-tight">
                    {title}
                </h2>
                <p className="mt-5 max-w-md text-sm leading-7 text-white/72">
                    {copy}
                </p>
            </div>

            <div className="relative z-10 space-y-5">
                <div className="auth-mock-card rounded-[26px] p-5">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-xs uppercase tracking-[0.16em] text-white/60">{metricLabel}</p>
                            <p className="mt-2 text-4xl font-semibold tracking-tight">{metricValue}</p>
                            <p className="mt-2 text-sm text-white/62">{metricHint}</p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                    </div>
                </div>

                <div className="grid gap-3">
                    {highlights.map((item) => (
                        <div
                            key={item}
                            className="auth-mock-card rounded-[22px] px-4 py-3 text-sm text-white/78"
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
