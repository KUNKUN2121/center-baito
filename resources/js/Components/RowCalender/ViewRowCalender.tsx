import { Schedule } from '@/types/shifts';
import { css } from '@emotion/react';
import { format, addDays, endOfMonth, endOfWeek, startOfMonth, startOfWeek } from 'date-fns';
import { ja } from 'date-fns/locale';
import React from 'react';


const ViewRowCalender: React.FC<{
    users: any[];
    schedule: Schedule;
    shiftSubmissions: any[];
    onShiftClick?: (userId: number, date: string) => void;
    confirmedShifts?: any[];
 }> = ({
    users,
    schedule,
    shiftSubmissions,
    onShiftClick,
    confirmedShifts,
}) => {
    // const requestMonth = "202510"; // YYYYMM形式で指定

    // カレンダーの初期化処理
    // const currentDate = new Date(requestMonth.slice(0, 4) + "-" + requestMonth.slice(4, 6) + "-01");
    const currentDate = new Date(Number(schedule.year), Number(schedule.month) - 1, 1);
    const start = startOfMonth(startOfMonth(currentDate));
    const end = endOfMonth(endOfMonth(currentDate));
    const days = [];
    let date = start;

    while (date <= end) {
        days.push(date);
        date = addDays(date, 1);
    }


    // axiosでuserを取得する

    return (
        <div css={wapperCss}>
            <div css={tableWapperCss}>
                <table>
                    <thead>
                        <tr>
                            <th>名前</th>
                            <th></th>
                            {days.map((day, index) => (
                                <th key={index}>
                                    {format(day, "d(eee)", { locale: ja })}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    {/* <thead>
                        <th>実数</th>
                        <th>2</th>
                    </thead> */}
                        <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>
                                    {/* <span>希望シフト</span>
                                    <span>確定シフト</span> */}
                                </td>
                                {days.map((day, index) => {
                                    const dayStr = format(day, "yyyy-MM-dd");
                                    // shiftSubmissionsからuser_idとstart_datetimeが一致するものを探す

                                    // 希望シフト
                                    const submission = shiftSubmissions.find((s) =>
                                        s.user_id === user.id &&
                                        s.start_datetime && s.start_datetime.startsWith(dayStr)
                                    );
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
                                                {submission ? (
                                                <div css={submissionWapperCss}>
                                                    <p>{submission ? format(new Date(submission.start_datetime), "HH:mm") : ""}</p>
                                                    <p>-</p>
                                                    <p>{submission ? format(new Date(submission.end_datetime), "HH:mm") : ""}</p>
                                                </div>
                                                ): (<div />)}

                                                {confirmed && (
                                                    <div css={confirmedWapperCss}>
                                                        <p>{confirmed ? format(new Date(confirmed.start_datetime), "HH:mm") : ""}</p>
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

export default ViewRowCalender;


const wapperCss = css`
    `;

const tableWapperCss = css`
    overflow-x: scroll;
        table {
        border-collapse: collapse;
        /* width: 100%; */
         width: max-content;
        margin: 20px 20px;
        table-layout: fixed;
        /* background-color: blue; */
    }

    th, td {
        border: 1px solid #ccc;
        width: 70px;
        text-align: center;
        height: 60px;
        padding: 4px;
    }

    th, th:first-of-type{
        background-color: #f4f4f4;
    }

`
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

const submissionWapperCss = css`
    display: flex;
    justify-content: center;
    background-color: lightblue;
    height: 40%;
`;
const confirmedWapperCss = css`
    display: flex;
    justify-content: space-between;
    background-color: #c6ffc6;
    height: 60%;
    flex-direction: column;
    p{
        font-weight: bold;
        text-align: center;
    }
`;

const none = css`
    height: 40%;
`
