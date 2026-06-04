export function mapToCVData(profile, cv) {
    return {
        name: profile?.name || "",
        email: cv?.email || "Bewerk om toe te voegen",
        phoneNumber: cv?.phoneNumber || "Bewerk om toe te voegen",
        image: profile?.image || "",
        summary: profile?.profile_summary || "",

        skills: profile?.skills || [],
        strengths: profile?.strengths || [],
        interests: profile?.interests || [],
        jobPreferences: profile?.job_preferences || [],

        educationLevel: profile?.education_level || [],

        workExperience: profile?.work_experience || [],
    };
}