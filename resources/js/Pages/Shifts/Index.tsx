import EditModal from '@/Components/Edit/EditModal';
import ViewCalender from '@/Components/NormalCalender/ViewCalender';
import ColumnCalender from '@/Components/Shifts/ColumnCalender';
import RowCalender from '@/Components/Shifts/RowCalender';
import { Submission, User } from '@/types/shifts';
import { css } from '@emotion/react';
import axios from 'axios';
import { format, addDays, endOfMonth, startOfMonth } from 'date-fns';
import { ja } from 'date-fns/locale';
import React, { useEffect, useState } from 'react';


const ShiftsIndex: React.FC = () => {
    // 仮のシフトデータ
    const [schedule, setSchedule] = useState<any[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [confirmedShifts, setConfirmedShifts] = useState<Submission[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 押されたシフトの情報
    const [selectedShift, setSelectedShift] = useState<{ confirmed: Submission | null } | null>(null);


    // schedule[0].year + schedule[0].month で月を指定する


    useEffect(() => {
        getIndex();
    }, []);


    // modalOpen時に処理する
    const handleSubmitModal = () => {
        // クリックした場所がシフトない場合
        if (!selectedShift) {
            return;
        }
        setIsModalOpen(!isModalOpen);
    }


    // 初期データ取得
    function getIndex() {
        // TODO: 将来的に年月を切り替えるUIを実装し、
        // params: { month: 'YYYY-MM' } を渡すようにする
        axios.get('/api/shifts')
            .then(response => {
                console.log("Fetched user data:", response.data);
                setSchedule(response.data.schedules);
                setUsers(response.data.users);
                setConfirmedShifts(response.data.confirmedShifts);
                console.log("schedule", schedule);
            })
            .catch(error => {
                console.error("api/shifts", error);
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


            <div>
                <label htmlFor="viewMethod">ビュー </label>
                <select id="viewMethod" name="viewMethod">
                    <option value="row">横表示</option>
                    <option value="column">縦表示</option>
                    <option value="calendar">カレンダー表示</option>
                </select>

                <label htmlFor="userViewMethod">ユーザー</label>
                <select id="userViewMethod" name="userViewMethod">
                    <option value="all">すべて</option>
                    <option value="me">自分のみ</option>
                </select>
            </div>

            <RowCalender
                users={users}
                days={days}
                confirmedShifts={confirmedShifts}
                handleSubmitModal={handleSubmitModal}
                setSelectedShift={setSelectedShift}
            />





            {/* <EditModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="シフト変更リクエスト">
                <div>
                    <h2>シフト変更リクエスト</h2>
                    <p>このシフトを変更しますか？</p>
                    <button onClick={() => setIsModalOpen(false)}>閉じる</button>
                    <button onClick={() => {
                        // 変更リクエスト送信
                        setIsModalOpen(false);
                        axios.post('/api/shifts/change/request', {
                            user_id: 1, // 仮のユーザーID
                            shift_id: selectedShift?.confirmed ? selectedShift.confirmed.id : null,
                            reason : "test理由"
                        }
                        ).then(response => {
                            alert("変更リクエストを送信しました。");
                        }).catch(error => {
                            console.error("Error creating shift change request:", error);
                            alert("変更リクエストの送信に失敗しました。");
                        });
                    }}>変更リクエスト送信</button>
                </div>
            </EditModal> */}

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
