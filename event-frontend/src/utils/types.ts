export interface LoginResponse {
    token: string;
}

export interface SignUpResponse {
    token: string;
}

export interface User {
    id: string;
    username: string;
}

export interface EventItem {
    id: number;
    title: string;
    date: string;
    location: string;
    owner_id: number;
    capacity: number;
    attendees_count: number;
    is_joined: boolean;
}
