export interface Schedule {
    id?: number;
    user_id?: number;
    status: Status;
    start_datetime: string;
    end_datetime: string;
    notes?: string;
}

export interface SelectedItem {
    date: Date;
    userId: number | null;
    schedule: Schedule | null;
    confirmedShift: Schedule | null;

}

export interface ClosedDay {
    id?: number;
    date: string; // YYYY-MM-DD
    reason?: string;
}


export type User = {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
};

export interface Submission {
    id?: number;
    user_id: number;
    start_datetime: string; // YYYY-MM-DD HH:mm:ss
    end_datetime: string;   // YYYY-MM-DD HH:mm:ss
    status: 'draft' | 'tentative' | 'confirm';
    notes?: string;
    created_at?: string;
    updated_at?: string;
}
