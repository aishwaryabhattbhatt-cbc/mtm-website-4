// Shared with AboutUsTeamSection.astro (the full card grid) so the roster
// only needs to be edited in one place.
export interface AboutUsTeamMember {
    nameKey: string;
    nameFallback: string;
    titleKey: string;
    titleFallback: string;
    descKey: string;
    descFallback: string;
}

export const aboutUsTeam: AboutUsTeamMember[] = [
    {
        nameKey: 'about_team_member_1_name',
        nameFallback: '[Name]',
        titleKey: 'about_team_member_1_title',
        titleFallback: 'Senior Research Analyst',
        descKey: 'about_team_member_1_desc',
        descFallback: 'Description of what they do in a line or two.',
    },
    {
        nameKey: 'about_team_member_2_name',
        nameFallback: '[Name]',
        titleKey: 'about_team_member_2_title',
        titleFallback: 'Senior Data Analyst',
        descKey: 'about_team_member_2_desc',
        descFallback: 'Description of what they do in a line or two.',
    },
    {
        nameKey: 'about_team_member_3_name',
        nameFallback: '[Name]',
        titleKey: 'about_team_member_3_title',
        titleFallback: 'Methodology Lead',
        descKey: 'about_team_member_3_desc',
        descFallback: 'Description of what they do in a line or two.',
    },
    {
        nameKey: 'about_team_member_4_name',
        nameFallback: '[Name]',
        titleKey: 'about_team_member_4_title',
        titleFallback: 'Industry Partnerships Lead',
        descKey: 'about_team_member_4_desc',
        descFallback: 'Description of what they do in a line or two.',
    },
    {
        nameKey: 'about_team_member_5_name',
        nameFallback: '[Name]',
        titleKey: 'about_team_member_5_title',
        titleFallback: 'Research Director',
        descKey: 'about_team_member_5_desc',
        descFallback: 'Description of what they do in a line or two.',
    },
    {
        nameKey: 'about_team_member_6_name',
        nameFallback: '[Name]',
        titleKey: 'about_team_member_6_title',
        titleFallback: 'Data Visualization Specialist',
        descKey: 'about_team_member_6_desc',
        descFallback: 'Description of what they do in a line or two.',
    },
];
