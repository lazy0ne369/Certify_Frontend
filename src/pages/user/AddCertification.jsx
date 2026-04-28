import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    Check,
    FileCheck2,
    FileUp,
    Layers3,
    PlusCircle,
    Upload,
    X,
} from 'lucide-react';
import canvasConfetti from 'canvas-confetti';
import { useCertStore } from '../../store/certStore';
import PageWrapper from '../../components/layout/PageWrapper';
import Button from '../../components/ui/Button';
import { certSchema } from '../../components/ui/CertForm';
import { listItemVariants } from '../../animations/variants';

const MotionDiv = motion.div;

const STEPS = [
    { id: 1, label: 'Details', icon: Layers3 },
    { id: 2, label: 'Upload', icon: FileUp },
    { id: 3, label: 'Review', icon: FileCheck2 },
];

const CATEGORIES = ['Cloud', 'DevOps', 'Data', 'Frontend'];

function fireConfetti() {
    const burst = (angle, spread) =>
        canvasConfetti({
            particleCount: 60,
            angle,
            spread,
            origin: { x: 0.5, y: 0.25 },
            colors: ['#2563EB', '#1D4ED8', '#60A5FA', '#ffffff', '#16A34A'],
            scalar: 1.05,
            zIndex: 9999,
        });

    burst(60, 70);
    setTimeout(() => burst(120, 70), 160);
}

export default function AddCertification() {
    const navigate = useNavigate();
    const addCertificate = useCertStore((state) => state.addCertificate);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const fileRef = useRef(null);

    const {
        register,
        handleSubmit,
        control,
        setValue,
        trigger,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(certSchema),
        defaultValues: {
            title: '',
            organization: '',
            issueDate: '',
            expiryDate: '',
            category: '',
            credentialId: '',
            description: '',
        },
    });

    const values = useWatch({ control });
    const fileName = watch('_fileName');

    const nextStep = async () => {
        const fields =
            step === 1
                ? ['title', 'organization', 'issueDate', 'expiryDate', 'category', 'credentialId', 'description']
                : ['certificateFile'];

        const valid = await trigger(fields);
        if (valid) {
            setStep((current) => Math.min(3, current + 1));
        }
    };

    const previousStep = () => setStep((current) => Math.max(1, current - 1));

    const handleFile = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            setValue('certificateFile', file, { shouldValidate: true });
            setValue('_fileName', file.name);
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);

        try {
            await addCertificate({
                ...data,
                badgeUrl: '',
                certificateUrl: '',
            });

            fireConfetti();
            toast.success('Certification added successfully!');
            setTimeout(() => navigate('/user/certifications'), 1200);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageWrapper className="py-8">
            <MotionDiv variants={listItemVariants} initial="hidden" animate="visible" className="space-y-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="section-label">Add Certification</p>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                            <span>Submit a new </span>
                            <span className="text-[#2563EB]">credential</span>
                        </h1>
                        <p className="mt-2 text-sm font-light leading-7 text-slate-500">
                            Move through details, upload, and review in a simple three-step flow.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate('/user/certifications')}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-[#2563EB]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Certifications
                    </button>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-md">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        {STEPS.map((item, index) => {
                            const Icon = item.icon;
                            const active = step === item.id;
                            const complete = step > item.id;

                            return (
                                <div key={item.id} className="flex flex-1 items-center gap-3">
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${
                                        complete
                                            ? 'border-[#2563EB] bg-[#2563EB] text-white'
                                            : active
                                                ? 'border-[#2563EB] bg-blue-50 text-[#2563EB]'
                                                : 'border-slate-200 bg-white text-slate-400'
                                    }`}>
                                        {complete ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Step {item.id}</p>
                                        <p className={`text-sm font-semibold ${active || complete ? 'text-slate-900' : 'text-slate-400'}`}>{item.label}</p>
                                    </div>
                                    {index < STEPS.length - 1 && (
                                        <div className={`hidden h-0.5 flex-1 md:block ${step > item.id ? 'bg-[#2563EB]' : 'bg-slate-200'}`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 xl:grid-cols-[1fr_320px]">
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-md">
                        {step === 1 && (
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <label className="text-sm font-medium text-slate-700">Certificate Title</label>
                                    <input {...register('title')} className="mt-2 h-12 w-full border-0 border-b-2 border-slate-200 bg-transparent px-0 text-sm text-slate-800 focus:border-[#2563EB] focus:outline-none" placeholder="AWS Solutions Architect" />
                                    {errors.title?.message && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Organization</label>
                                    <input {...register('organization')} className="mt-2 h-12 w-full border-0 border-b-2 border-slate-200 bg-transparent px-0 text-sm text-slate-800 focus:border-[#2563EB] focus:outline-none" placeholder="Amazon Web Services" />
                                    {errors.organization?.message && <p className="mt-1 text-xs text-red-500">{errors.organization.message}</p>}
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Category</label>
                                    <select {...register('category')} className="mt-2 h-12 w-full border-0 border-b-2 border-slate-200 bg-transparent px-0 text-sm text-slate-800 focus:border-[#2563EB] focus:outline-none">
                                        <option value="">Select category</option>
                                        {CATEGORIES.map((category) => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                    {errors.category?.message && <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>}
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Issue Date</label>
                                    <input {...register('issueDate')} type="date" className="mt-2 h-12 w-full border-0 border-b-2 border-slate-200 bg-transparent px-0 text-sm text-slate-800 focus:border-[#2563EB] focus:outline-none" />
                                    {errors.issueDate?.message && <p className="mt-1 text-xs text-red-500">{errors.issueDate.message}</p>}
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Expiry Date</label>
                                    <input {...register('expiryDate')} type="date" className="mt-2 h-12 w-full border-0 border-b-2 border-slate-200 bg-transparent px-0 text-sm text-slate-800 focus:border-[#2563EB] focus:outline-none" />
                                    {errors.expiryDate?.message && <p className="mt-1 text-xs text-red-500">{errors.expiryDate.message}</p>}
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="text-sm font-medium text-slate-700">Credential ID</label>
                                    <input {...register('credentialId')} className="mt-2 h-12 w-full border-0 border-b-2 border-slate-200 bg-transparent px-0 text-sm text-slate-800 focus:border-[#2563EB] focus:outline-none" placeholder="ABC-123-XYZ" />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="text-sm font-medium text-slate-700">Description</label>
                                    <textarea {...register('description')} rows={4} className="mt-2 w-full resize-none border-0 border-b-2 border-slate-200 bg-transparent px-0 py-2 text-sm text-slate-800 focus:border-[#2563EB] focus:outline-none" placeholder="Brief description of this certification" />
                                    {errors.description?.message && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6">
                                <div>
                                    <p className="text-lg font-semibold text-slate-900">Upload Certificate File</p>
                                    <p className="mt-2 text-sm font-light leading-7 text-slate-500">
                                        Add a PDF or image for this certification. The current backend still stores URL fields, so this step is for the UI flow and review experience.
                                    </p>
                                </div>

                                <div
                                    onClick={() => fileRef.current?.click()}
                                    className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-blue-200 bg-blue-50/60 p-6 text-center transition-colors hover:bg-blue-50"
                                >
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#2563EB] shadow-sm">
                                        <Upload className="h-7 w-7" />
                                    </div>
                                    <p className="mt-5 text-base font-semibold text-slate-900">Drop your file here or click to browse</p>
                                    <p className="mt-2 text-sm font-light text-slate-500">Accepted formats: PDF, JPG, PNG</p>
                                    {fileName && (
                                        <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                                            {fileName}
                                            <button
                                                type="button"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    setValue('_fileName', '');
                                                    setValue('certificateFile', null, { shouldValidate: true });
                                                }}
                                            >
                                                <X className="h-4 w-4 text-slate-400" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept=".pdf,image/*"
                                    className="hidden"
                                    onChange={handleFile}
                                />
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6">
                                <div>
                                    <p className="text-lg font-semibold text-slate-900">Review Before Submit</p>
                                    <p className="mt-2 text-sm font-light leading-7 text-slate-500">
                                        Confirm the details, uploaded file, and dates before saving the certification.
                                    </p>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="rounded-xl bg-slate-50 p-4">
                                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Title</p>
                                        <p className="mt-2 text-sm font-semibold text-slate-900">{values.title || '—'}</p>
                                    </div>
                                    <div className="rounded-xl bg-slate-50 p-4">
                                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Organization</p>
                                        <p className="mt-2 text-sm font-semibold text-slate-900">{values.organization || '—'}</p>
                                    </div>
                                    <div className="rounded-xl bg-slate-50 p-4">
                                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Category</p>
                                        <p className="mt-2 text-sm font-semibold text-slate-900">{values.category || '—'}</p>
                                    </div>
                                    <div className="rounded-xl bg-slate-50 p-4">
                                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Credential ID</p>
                                        <p className="mt-2 text-sm font-semibold text-slate-900">{values.credentialId || '—'}</p>
                                    </div>
                                    <div className="rounded-xl bg-slate-50 p-4">
                                        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                                            <CalendarDays className="h-3.5 w-3.5" />
                                            Issue Date
                                        </p>
                                        <p className="mt-2 text-sm font-semibold text-slate-900">
                                            {values.issueDate ? format(parseISO(values.issueDate), 'dd MMM yyyy') : '—'}
                                        </p>
                                    </div>
                                    <div className="rounded-xl bg-slate-50 p-4">
                                        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                                            <CalendarDays className="h-3.5 w-3.5" />
                                            Expiry Date
                                        </p>
                                        <p className="mt-2 text-sm font-semibold text-slate-900">
                                            {values.expiryDate ? format(parseISO(values.expiryDate), 'dd MMM yyyy') : '—'}
                                        </p>
                                    </div>
                                    <div className="sm:col-span-2 rounded-xl bg-slate-50 p-4">
                                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Description</p>
                                        <p className="mt-2 text-sm font-light leading-7 text-slate-600">{values.description || 'No description provided.'}</p>
                                    </div>
                                    <div className="sm:col-span-2 rounded-xl bg-blue-50 p-4">
                                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-500">Selected File</p>
                                        <p className="mt-2 text-sm font-semibold text-slate-900">{fileName || 'No file selected'}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-md">
                            <p className="section-label">Progress</p>
                            <p className="mt-2 text-xl font-bold tracking-tight text-slate-900">Step {step} of 3</p>
                            <p className="mt-2 text-sm font-light leading-7 text-slate-500">
                                Finish each step to keep the submission clean and complete.
                            </p>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-md">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                    <PlusCircle className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">Submission Controls</p>
                                    <p className="text-xs text-slate-500">Move between steps or save when ready.</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                {step > 1 && (
                                    <Button type="button" variant="outline" size="lg" onClick={previousStep}>
                                        <ArrowLeft className="h-4 w-4" />
                                        Previous
                                    </Button>
                                )}

                                {step < 3 ? (
                                    <Button type="button" variant="primary" size="lg" onClick={nextStep}>
                                        Next Step
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                ) : (
                                    <Button type="submit" variant="primary" size="lg" loading={loading}>
                                        {loading ? 'Saving Certification...' : 'Submit Certification'}
                                        {!loading && <Check className="h-4 w-4" />}
                                    </Button>
                                )}

                                <Button type="button" variant="secondary" size="md" onClick={() => navigate('/user/certifications')}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </MotionDiv>
        </PageWrapper>
    );
}
