export function mapToCVData(profile, cv, cvVersion) {
    return {
        name: profile?.name || "",
        image: profile?.image || "",
        summary: profile?.profile_summary || "",

        skills: profile?.skills || [],
        strengths: profile?.strengths || [],
        interests: profile?.interests || [],
        jobPreferences: profile?.job_preferences || [],

        educationLevel: profile?.education_level || "",

        workExperience: cvVersion?.content?.workExperience || [],
    };
}