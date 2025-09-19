import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { css } from '@emotion/react';
import ViewCalender from '@/Components/NormalCalender/ViewCalender';
import { Schedule } from '@/types/shifts';

const wapper = css`

`;

// シフト希望画面
export default function Request() {


    const sampleSchedules: Schedule[] = [
        {
            id: 1,
            user_id: 1,
            work_date: "2025-09-15",
            start_time: "09:00",
            end_time: "17:00",
            status: "confirm",
        },
        {
            id: 2,
            user_id: 2, // 別のユーザーのシフト
            work_date: "2025-09-20",
            start_time: "10:00",
            end_time: "18:00",
            status: "confirm",
        },
        {
            id: 3,
            user_id: 1, // 自分のシフト
            work_date: "2025-09-25",
            start_time: "12:00",
            end_time: "20:00",
            status: "draft",
        }
    ];

    const handleChangeShift = (schedule: Schedule) => {
        console.log("handleChangeShift", schedule);
    };

    return (
        <div css={wapper}>
            <div>
                <ViewCalender
                    requestMonth="2025/09"
                    schedules={sampleSchedules}
                    closedDays={[]}
                    userId={1}
                    handleChangeShift={handleChangeShift}
                />
            </div>
        </div>
    );
}
