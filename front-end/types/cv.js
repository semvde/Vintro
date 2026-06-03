export function mapToCVData(profile, cv, cvVersion) {
    return {
        name: profile.name,
        // age: profile.age,
        image: profile.image,
        summary: profile.profile_summary,
        skills: profile.skills || [],
        workExperience: cvVersion?.content?.workExperience || [],
        educationLevel: cvVersion?.content?.educationLevel || [],
        // interests: profile.interests,
        // strengths: profile.strengths,
        // jobPreferences: profile.jobPreferences,
    };
}