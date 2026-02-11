import type { EventItem } from "../utils/types";
import type { User } from "../utils/types";


function getToken(): string | null {
    return localStorage.getItem("token");
}

async function authFetch(url: string, options: RequestInit = {}) {
    const token = getToken();
    if (!token) throw new Error("No token");

    const res = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...(options.headers || {}),
        },
    });

    if (res.status === 401) {
        throw new Error("Unauthorized (token invalide)");
    }

    if (!res.ok) {
        const msg = await res.text();
        throw new Error(`Error: ${msg || res.status}`);
    }

    return res.json();
}

/* -------------------------------------------------------
 * EVENTS API
 * ----------------------------------------------------- */

//Retourne les events
export async function getEvents(): Promise<EventItem[]> {
    const data = await authFetch("/api/events");
    return data.events;
}

//Crée un event
export async function createEvent(payload: {
    title: string;
    date: string;
    location: string;
    capacity: number;
}): Promise<EventItem> {
    const data = await authFetch("/api/events", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    return data.event;
}

export async function updateEvent(
    id: number,
    payload: { title: string; date: string; location: string; capacity: number }
) {
    const data = await authFetch(`/api/events/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });

    return data.event;
}


// Delete un event
export async function deleteEvent(id: number): Promise<void> {
    await authFetch(`/api/events/${id}`, {
        method: "DELETE",
    });
}

export async function joinEvent(id: number): Promise<{ attendees_count: number; is_joined: boolean }> {
    return await authFetch(`/api/events/${id}/join`, { method: "POST" });
}

export async function leaveEvent(id: number): Promise<{ attendees_count: number; is_joined: boolean }> {
    return await authFetch(`/api/events/${id}/join`, { method: "DELETE" });
}


