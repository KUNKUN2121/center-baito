import EditModal from '@/Components/Edit/EditModal';
import ViewRowCalender from '@/Components/RowCalender/ViewRowCalender';
import { Submission, User } from '@/types/shifts';
import { css } from '@emotion/react';
import axios from 'axios';
import { format, set } from 'date-fns';
import React, { useEffect, useState } from 'react';




const Edit: React.FC = () => {

    const [schedule, setSchedule] = useState([]);
    const [users, setUsers] = useState<User[]>([]);
    const [shiftSubmissions, setShiftSubmissions] = useState<(Submission)[]>([]);
    const [confirmedShifts, setConfirmedShifts] = useState<Submission[]>([]);


    const [selectedShift, setSelectedShift] = useState<{ userId: number; date: string } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);


    const [modalData, setModalData] = useState<Submission | null>(null);


    useEffect(() => {
        getIndex();
    }, []);


    // 初期データ取得
    function getIndex() {
        axios.get('/api/shifts/admin/edit/show')
            .then(response => {
                console.log("Fetched user data:", response.data);
                setSchedule(response.data.schedule);
                setUsers(response.data.users);
                setShiftSubmissions(response.data.shiftSubmissions);
                setConfirmedShifts(response.data.confirmedShifts);

            })
            .catch(error => {
                console.error("api/shifts/admin/edit", error);
            });
    }

    // シフト情報を送信
    function postShift() {
        axios.post('/api/shifts/admin/edit/post', {
            schedule,
            users,
            shiftSubmissions,
        })
            .then(response => {
                console.log("Post response:", response.data);
                // 必要に応じて状態を更新
            }
            )
            .catch(error => {
                console.error("Error posting data:", error);
            });
    }



    // シフトをクリックしたときの処理
    const handleShiftClick = (userId: number, date: string) => {
        console.log("Clicked shift for user:", userId, "on date:", date);
        // ここでモーダルを開くなどの処理を行う
        // setSelectedShift({ userId, date });
        setIsModalOpen(true);
        setSelectedShift({ userId, date });
        const modalSubmissions = shiftSubmissions.find(value =>
            value.user_id === userId &&
            value.start_datetime.startsWith(date)
        )
        setModalData(modalSubmissions ?? null);
    }







    if(users.length === 0){
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div>
                <h1>シフトエディター（管理者ページ）</h1>
                <ViewRowCalender
                    schedule={schedule}
                    shiftSubmissions={shiftSubmissions}
                    users={users}
                    onShiftClick={handleShiftClick}
                ></ViewRowCalender>
            </div>
            {/* モーダル */}
            {isModalOpen && (
            <EditModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="シフト編集">
                <div css={modalContentWapper}>
                    <p>{selectedShift?.date}</p>
                    <h2>{users.find(user => user.id === selectedShift?.userId)?.name} さん</h2>

                    {/* 希望シフト */}
                    <span>希望シフト: </span>
                    {modalData ? (
                        <div>
                            <span> {format(new Date(modalData.start_datetime), 'HH:mm')} - {format(new Date(modalData.end_datetime), 'HH:mm')}</span>
                            <p>メモ: {modalData.notes}</p>
                        </div>
                    ) : (
                        <p>この日の希望シフトはありません。</p>
                    )}





                    {/* ユーザ情報、日付、希望シフトを表示 */}
                    {/*
                    <p>日付: {selectedShift?.date}</p>
                    <p>希望シフト: {format(modalData!.start_datetime, 'HH:mm')} - {format(modalData!.end_datetime, 'HH:mm')}</p>
                    <p>メモ: {modalData?.notes}</p> */}


                    <button onClick={postShift}>保存</button>
                </div>
            </EditModal>
            )}
        </div>
    );
};

export default Edit;
const modalContentWapper = css`
    display: flex;
    flex-direction: column;
    /* gap: 1rem; */
    /* padding: 1rem; */

    h2{
        font-size: 1.25rem;
    }
`;


// dateFNS
