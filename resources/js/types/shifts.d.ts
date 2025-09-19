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
  };
