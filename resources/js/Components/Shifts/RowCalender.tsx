import { Submission, User } from '@/types/shifts';
import { css } from '@emotion/react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import React from 'react';

interface RowCalenderProps {
    users: User[];
    days: Date[];
    confirmedShifts: Submission[];
    handleSubmitModal: (isOpen: boolean) => void;
    setSelectedShift: (shift: { confirmed: Submission | null } | null) => void;
}

const RowCalender: React.FC<RowCalenderProps> = ({
    users,
    days,
    confirmedShifts,
    handleSubmitModal,
    setSelectedShift,
}) => {
    return (
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
                                const confirmed = confirmedShifts!.find((s) =>
                                    s.user_id === user.id &&
                                    s.start_datetime && s.start_datetime.startsWith(dayStr)
                                );

                                return (
                                    <td key={index}
                                        onClick={() => {
                                            handleSubmitModal(true);
                                            setSelectedShift({ confirmed: confirmed ?? null });
                                        }}
                                        css={tdContent}
                                    >
                                        <div css={containerCss}>
                                            {confirmed && (
                                                <div css={confirmedWapperCss}>
                                                    <p>{confirmed ? format(new Date(confirmed.start_datetime), "HH:mm") : ""}</p>
                                                    <span css={hrCss} />
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
    );
};

export default RowCalender;

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
