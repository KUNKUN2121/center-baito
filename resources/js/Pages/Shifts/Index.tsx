import { Submission, User } from '@/types/shifts';
import { css } from '@emotion/react';
import axios from 'axios';
import { format, addDays, endOfMonth, endOfWeek, startOfMonth, startOfWeek } from 'date-fns';
import { ja } from 'date-fns/locale';
import React, { useEffect } from 'react';


const ShiftsIndex: React.FC = () => {
    // 仮のシフトデータ
    const [schedule, setSchedule] = React.useState<any[]>([]);
    const [users, setUsers] = React.useState<User[]>([]);
    const [confirmedShifts, setConfirmedShifts] = React.useState<Submission[]>([]);


    // schedule[0].year + schedule[0].month で月を指定する


    useEffect(() => {
        getIndex();
    }, []);


    // 初期データ取得
    function getIndex() {
        axios.get('/api/shifts/admin/edit/show')
            .then(response => {
                console.log("Fetched user data:", response.data);
                setSchedule(response.data.schedules);
                setUsers(response.data.users);
                setConfirmedShifts(response.data.confirmedShifts);
                console.log("schedule", schedule);
            })
            .catch(error => {
                console.error("api/shifts/admin/edit", error);
            });
    }

    if(users.length === 0){
        return <div>Loading...</div>;
    }


    const scheduleYear = schedule.length > 0 ? schedule[0].year : 2025;
    const scheduleMonth = schedule.length > 0 ? String(schedule[0].month).padStart(2, '0') : "10";
    const requestMonth = `${scheduleYear}${scheduleMonth}`; // YYYYMM形式で指定

    // const requestMonth = "202510"; // YYYYMM形式で指定
    // カレンダーの初期化処理
    const currentDate = new Date(requestMonth.slice(0, 4) + "-" + requestMonth.slice(4, 6) + "-01");
    const start = startOfMonth(startOfMonth(currentDate));
    const end = endOfMonth(endOfMonth(currentDate));
    const days = [];
    let date = start;

    while (date <= end) {
        days.push(date);
        date = addDays(date, 1);
    }



    return (
        <div css={wapperCss}>
            <div css={titleWapperCss}>
                <h1 style={{
                    fontSize: '1.5rem', fontWeight: 'bold', margin: '20px'
                }}>{scheduleYear}年{scheduleMonth}月シフト表</h1>
                <p>閲覧日: {format(new Date(), "yyyy年MM月dd日", { locale: ja })}</p>
            </div>

            <div css={tableWapperCss}>
                <table>
                    <thead>
                        <tr>
                            <th>名前</th>
                            {days.map((day, index) => (
                                <th key={index}>
                                    <p>{format(day, "d", { locale: ja })}</p>
                                    <p>{format(day, "(eee)", { locale: ja })}</p>
                                </th>
                            ))}
                        </tr>
                    </thead>
                        <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                {days.map((day, index) => {
                                    const dayStr = format(day, "yyyy-MM-dd");
                                    // 確定シフト
                                    const confirmed = confirmedShifts!.find((s) =>
                                        s.user_id === user.id &&
                                        s.start_datetime && s.start_datetime.startsWith(dayStr)
                                    );

                                    return (
                                        <td key={index}
                                            onClick={() => onShiftClick ? onShiftClick(user.id, dayStr) : null}
                                            css={tdContent}
                                        >
                                            <div css={containerCss}>
                                                {confirmed && (
                                                    <div css={confirmedWapperCss}>
                                                        <p>{confirmed ? format(new Date(confirmed.start_datetime), "HH:mm") : ""}</p>
                                                        <span css={hrCss}/>
                                                        <p>{confirmed ? format(new Date(confirmed.end_datetime), "HH:mm") : ""}</p>
                                                    </div>
                                                )}


                                            </div>

                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ShiftsIndex;


const wapperCss = css`
    width: 100vw;
    height: 100vh;
`;

const titleWapperCss = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const tableWapperCss = css`
    table {
        border-collapse: collapse;
        width: 100%;
        margin: 20px 0;
        table-layout: fixed;
    }

    th, td {
        border: 1px solid #ccc;
        width: auto;
        text-align: center;
        height: 60px;
        padding: 4px;
        white-space: pre-wrap;
        @media print {
            font-size: 10px !important;
            width: 25px !important;
            height: 40px !important;
            padding: 0px !important;
        }

    }

    th, th:first-of-type{
        background-color: #f4f4f4;
    }
`;
const tdContent = css`
    padding: 0 !important;
`;

const containerCss = css`
    cursor: pointer;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;


const confirmedWapperCss = css`
    display: flex;
    justify-content: space-between;
    background-color: #c6ffc6;
    height: 100%;
    flex-direction: column;
    p{
        font-weight: bold;
        text-align: center;
        font-size: 1rem;
    }

    @media screen and (max-width: 1300px) {
        p{
            font-size: 13px !important;
        }
    }

    @media print {
        p {
            font-size: 8px !important;
        }
        /* 印刷時に背景色は不要な場合が多いので白にしています */
    }
`;


const hrCss = css`
    /* 縦の線 */
    border-left: 2px solid #000;
    height: 10px;
    margin: 0 auto;
    @media print {
        border-left: 0.2px solid #000;
        height: 5px;
    }
`;
