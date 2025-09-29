import { Submission, User } from '@/types/shifts';
import React, { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { endOfMonth, endOfWeek, format, getDay, isSameMonth, startOfMonth, startOfWeek } from 'date-fns';
import { ja } from 'date-fns/locale';
import axios from 'axios';

interface NormalCalenderProps {
    users: User[];
    // days: Date[];
    requestYearMonth: number;
    confirmedShifts: Submission[];
    handleSubmitModal: () => void;
    setSelectedShift: (shift: { confirmed: Submission | null } | null) => void;
}

const DayCell: React.FC<{
    date: Date;
    shifts: Submission[];
    onClick: () => void;
    isHoliday: boolean;
}> = ({ date, shifts, onClick, isHoliday }) => {
    const dayNumber = format(date, 'd');
    const isToday = format(new Date(), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
    const dayOfWeek = getDay(date);
    const isRestDay = dayOfWeek === 0 || dayOfWeek === 6 || isHoliday;

    const dayNumberStyles = [dayNumberCss];
    if (isRestDay) {
        dayNumberStyles.push(restDayNumberCss);
    }

    return (
        <div
            css={[dayCellCss, isToday ? todayCss : null, isRestDay ? restDayCss : null]}
            onClick={onClick}
        >
            <div css={dayNumberStyles}>{dayNumber}</div>
            <div css={shiftsCss}>
                {shifts.map(shift => (
                    <div key={shift.id} css={shiftCss}>
                        {format(new Date(shift.start_datetime), 'HH:mm')} - {format(new Date(shift.end_datetime), 'HH:mm')}
                    </div>
                ))}
            </div>
        </div>
    );
};

const NormalCalender: React.FC<NormalCalenderProps> = ({
    users,
    requestYearMonth,
    confirmedShifts,
    handleSubmitModal,
    setSelectedShift,
}) => {
    const [holidays, setHolidays] = useState<{ [key: string]: string }>({});

    const days : Date[] = [];
    // カレンダーなので startOfWeek(startOfMonth) を使う
    const currentDate = new Date(String(requestYearMonth).slice(0, 4) + "-" + String(requestYearMonth).slice(4, 6) + "-01");
    const start = startOfWeek(startOfMonth(currentDate));
    const end = endOfWeek(endOfMonth(currentDate));
    let date = start;

    while (date <= end) {
        days.push(date);
        date = new Date(date.getTime() + 24 * 60 * 60 * 1000); // 次の日へ
    }

    // 祝日データを取得

    useEffect(() => {
        axios.get('https://holidays-jp.github.io/api/v1/date.json')
            .then(response => {
                setHolidays(response.data);
            })
            .catch(error => {
                console.error("Error fetching holidays:", error);
            });
    }, []);

    // 仮にログインユーザーIDを1とします
    const loggedInUserId = 1;

    const handleDayClick = (shift: Submission | null) => {
        setSelectedShift({ confirmed: shift });
        handleSubmitModal();
    };

    return (
        <div>
            <div css={calendarGridCss}>
                {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
                    <div key={day} css={headerCellCss}>
                        {day}
                    </div>
                ))}
            </div>
            <div css={calendarGridCss}>
                {days.map(day => {
                    const dayString = format(day, 'yyyy-MM-dd');
                    const shiftsForDay = confirmedShifts.filter(
                        shift =>
                            format(new Date(shift.start_datetime), 'yyyy-MM-dd') === dayString &&
                            shift.user_id === loggedInUserId
                    );
                    const isHoliday = holidays.hasOwnProperty(dayString);

                    return (
                        <DayCell
                            key={dayString}
                            date={day}
                            shifts={shiftsForDay}
                            onClick={() => handleDayClick(shiftsForDay.length > 0 ? shiftsForDay[0] : null)}
                            isHoliday={isHoliday}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default NormalCalender;

const calendarGridCss = css`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;
`;

const headerCellCss = css`
    padding: 8px;
    text-align: center;
    background-color: #f4f4f4;
    border-right: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
`;

const dayCellCss = css`
    min-height: 100px;
    padding: 8px;
    border-right: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    cursor: pointer;
    &:hover {
        background-color: #f0f0f0;
    }
`;

const todayCss = css`
    background-color: #e6f7ff;
`;

const restDayCss = css`
    background-color: #dfdfdf;
    opacity: 0.8;
    &:hover {
        background-color: #dfdfdf !important;
    }
`;

const dayNumberCss = css`
    font-size: 14px;
    font-weight: bold;
`;

const restDayNumberCss = css`
    color: #888;
`;

const shiftsCss = css`
    margin-top: 8px;
`;

const shiftCss = css`
    font-size: 12px;
    background-color: #d4edda;
    padding: 2px 4px;
    border-radius: 4px;
    margin-bottom: 4px;
`;
