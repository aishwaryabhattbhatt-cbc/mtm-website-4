// Shared with both HomeFaqsSection.astro (rendering) and index.astro (FAQPage
// JSON-LD) so the two never drift out of sync.
export interface HomeFaqEntry {
    id: string;
    questionKey: string;
    answerKey: string;
    questionFallback: string;
    answerFallback: string;
    color: string;
}

export const homeFaqs: HomeFaqEntry[] = [
    {
        id: 'faq_1',
        questionKey: 'faq_1_question',
        answerKey: 'faq_1_answer',
        questionFallback:
            'Can MTM data be customized for specific funding, research, or measurement projects?',
        answerFallback:
            "Yes. MTM's DAT Tool and Census platform allow for flexible data querying by demographic group, platform type, or region. For organizations requiring deeper or comparative analysis, MTM provides custom cross-tabulations and export support, ensuring that the data aligns with each partner's reporting framework, whether for funding applications, program evaluation, or strategic benchmarking.",
        color: '#e8f3fd',
    },
    {
        id: 'faq_2',
        questionKey: 'faq_2_question',
        answerKey: 'faq_2_answer',
        questionFallback: 'What are the turnaround times for high-volume or complex data requests?',
        answerFallback:
            'Turnaround times vary based on complexity. Standard queries through our tools are instant. Custom requests typically take 5–10 business days. For urgent requests, expedited processing is available.',
        color: '#e8f7f5',
    },
    {
        id: 'faq_3',
        questionKey: 'faq_3_question',
        answerKey: 'faq_3_answer',
        questionFallback:
            'Is MTM data accepted as a source for funding justification and policy submissions?',
        answerFallback:
            'Yes. MTM data is recognized and cited by funding bodies, policy makers, and research institutions across Canada. Our datasets meet rigorous quality standards and are suitable for policy submissions and funding applications.',
        color: '#f7f4ff',
    },
    {
        id: 'faq_4',
        questionKey: 'faq_4_question',
        answerKey: 'faq_4_answer',
        questionFallback: 'How does MTM ensure the validity and reliability of its datasets?',
        answerFallback:
            'MTM employs rigorous methodology, continuous validation, peer review, and partnerships with industry experts to ensure data accuracy and relevance. Our processes comply with international research standards.',
        color: '#fae8fc',
    },
    {
        id: 'faq_5',
        questionKey: 'faq_5_question',
        answerKey: 'faq_5_answer',
        questionFallback: 'When is MTM 18+ data released?',
        answerFallback:
            'MTM 18+ data is published twice annually, with Fall results released in February and Spring results released in July.',
        color: '#fef3e8',
    },
];
