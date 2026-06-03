export function mapToCVData(profile, cv, cvVersion) {
    return {
        name: profile?.name || "",
        image: profile?.image || "",
        summary: profile?.profile_summary || "",
        skills: profile?.skills || [],
        workExperience: cvVersion?.content?.workExperience || [],
    };
}