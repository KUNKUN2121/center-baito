import { css } from '@emotion/react';
import { format, addDays, endOfMonth, endOfWeek, startOfMonth, startOfWeek } from 'date-fns';
import { ja } from 'date-fns/locale';
import React from 'react';


const ViewRowCalender: React.FC<{
    users: any[];
    schedule: any[];
    shiftSubmissions: any[];
    onShiftClick?: (userId: number, date: string) => void;
 }> = ({
    users,
    schedule,
    shiftSubmissions,
    onShiftClick,
}) => {
    const requestMonth = "202510"; // YYYYMM形式で指定
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


    // axiosでuserを取得する

    return (
        <div css={wapperCss}>
            <div css={tableWapperCss}>
                <table>
                    <thead>
                        <th>名前</th>
                        <th></th>
                        {days.map((day, index) => (
                            <th key={index}>
                                {format(day, "d(eee)", { locale: ja })}
                            </th>
                        ))}
                    </thead>
                    {/* <thead>
                        <th>実数</th>
                        <th>2</th>
                    </thead> */}
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>
                                    <span>希望シフト</span>
                                    <span>確定シフト</span>
                                </td>
                                {days.map((day, index) => {
                                    const dayStr = format(day, "yyyy-MM-dd");
                                    // shiftSubmissionsからuser_idとstart_datetimeが一致するものを探す
                                    const submission = shiftSubmissions.find((s) =>
                                        s.user_id === user.id &&
                                        s.start_datetime.startsWith(dayStr)
                                    );
                                    return (
                                        <td key={index}
                                            onClick={() => onShiftClick ? onShiftClick(user.id, dayStr) : null}
                                        >
                                            <p>{submission ? format(new Date(submission.start_datetime), "HH:mm") : ""}</p>
                                            <p>{submission ? format(new Date(submission.end_datetime), "HH:mm") : ""}</p>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    <tbody>

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
        width: 100px;
        text-align: center;
        height: 80px;
        padding: 4px;
    }

    th, th:first-of-type{
        background-color: #f4f4f4;
    }

`
