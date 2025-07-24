/**
 * @fileOverview This file provides a mock service for finding health centers.
 * In a real application, this would be replaced with a service that queries a database or an external API.
 */

import type { HealthCenter } from "@/lib/types";

// This is a placeholder list of health centers.
// In a real application, you would fetch this data from a database or an API.
const mockHealthCenters: HealthCenter[] = [
    { 
        name: "Apollo Clinic", 
        address: "123 Health St, Wellness City", 
        phone: "+1-555-123-4567", 
        specialty: "General Physician" 
    },
    { 
        name: "Fortis Hospital", 
        address: "456 Cure Ave, Remedy Town", 
        phone: "+1-555-987-6543", 
        specialty: "Cardiology" 
    },
    { 
        name: "Max Healthcare", 
        address: "789 Life Blvd, Vitality Village", 
        phone: "+1-555-234-5678", 
        specialty: "Dermatology"
    },
    {
        name: "City General Hospital",
        address: "101 Main St, Metroburg",
        phone: "+1-555-111-2222",
        specialty: "General Physician"
    },
    {
        name: "Heartbeat Cardiology Center",
        address: "202 Pulse Rd, Cardio City",
        phone: "+1-555-333-4444",
        specialty: "Cardiology"
    },
    {
        name: "Skin Deep Dermatology Clinic",
        address: "303 Dermis Dr, Epiderm Ville",
        phone: "+1-555-555-6666",
        specialty: "Dermatology"
    }
];

/**
 * Finds nearby health centers based on a specialty.
 * @param specialty The medical specialty to filter by.
 * @returns A promise that resolves to an array of HealthCenter objects.
 */
export async function findNearbyHealthCenters(specialty: string): Promise<HealthCenter[]> {
    console.log(`Searching for health centers with specialty: ${specialty}`);
    
    const filteredCenters = mockHealthCenters.filter(center => 
        center.specialty?.toLowerCase().includes(specialty.toLowerCase())
    );

    // If no specific specialty matches, return general physicians
    if (filteredCenters.length > 0) {
        return filteredCenters;
    } else {
        return mockHealthCenters.filter(center => 
            center.specialty?.toLowerCase().includes('general physician')
        );
    }
}
