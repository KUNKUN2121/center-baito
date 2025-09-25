import EditModal from '@/Components/Edit/EditModal';
import ViewRowCalender from '@/Components/RowCalender/ViewRowCalender';
import { Schedule, Submission, User } from '@/types/shifts';
import { css } from '@emotion/react';
import { Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';

const Edit: React.FC = () => {

    //Todo: シフト作成を選べるようにする。 また、編集もここでできるようにする。

    const [schedule, setSchedule] = useState<Schedule>();
    const [users, setUsers] = useState<User[]>([]);
    const [shiftSubmissions, setShiftSubmissions] = useState<(Submission)[]>([]);
    const [confirmedShifts, setConfirmedShifts] = useState<Submission[]>([]);


    const [selectedShift, setSelectedShift] = useState<{ userId: number; date: string } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);


    const [modalData, setModalData] = useState<Submission | null>(null);
    const [editShift, setEditShift] = useState<Submission | null>(null);


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

    // シフトを保存する
    const confirmShift = (submission: Submission) => {

        console.log("confirmShift", submission);


        // 変更前データをバックアップ
        const previousConfirmedShifts = [...confirmedShifts];

        // 既に存在するか確認

        const exists = confirmedShifts.some(
            s => s.user_id === submission.user_id &&
                s.schedule_id === submission.schedule_id &&
                s.id === submission.id
        );
        if (exists) {
            // 既存のシフトを更新
            console.log("更新")
            setConfirmedShifts(confirmedShifts.map(s => (s.user_id === submission.user_id && s.schedule_id === submission.schedule_id) ? submission : s));
        } else {
            // 新しいシフトを追加
            console.log("追加")
            setConfirmedShifts([...confirmedShifts, submission]);
        }
        setIsModalOpen(false);

        // サーバーに保存
        // // schedule_id, user_id, start_datetime, end_datetime, notes を送信
        axios.post('/api/shifts/admin/edit/confirm', {
            user_id: submission.user_id,
            schedule_id: submission.schedule_id,
            start_datetime: submission.start_datetime,
            end_datetime: submission.end_datetime,
            notes: submission.notes,
        })
            .then(response => {
                console.log("Shift confirmed successfully:", response.data);
                // 必要に応じてUIを更新
            })
            .catch(error => {
                alert("シフトの保存に失敗しました。");
                // エラーが発生した場合、変更前のデータに戻す
                setConfirmedShifts(previousConfirmedShifts);
            });

    }



    // モーダルを開いた時
    const handleShiftClick = (userId: number, date: string) => {

        // 募集シフトのIDを取得。通常一つしかないため、最初の要素を使用
        const scheduleId = schedule?.id;


        if (!scheduleId) {
            console.error("No schedule found for this date");
            return;
        }

        // 希望シフトを探す
        const baseSubmission = shiftSubmissions.find(
            (s) => s.user_id === userId && s.start_datetime.startsWith(date)
        );

        // 確定シフトを探す
        const confirmed = confirmedShifts.find(
            (s) => s.user_id === userId && s.start_datetime.startsWith(date)
        );

        // 条件分岐
        // 確定シフトがあればそれを編集
        if (confirmed) {
            setEditShift(confirmed);
            setModalData(confirmed);
        }
        else if (baseSubmission) {
            setEditShift(baseSubmission);
            setModalData(baseSubmission);
        }
        else {
            // どちらもなければ新規作成モード
            setEditShift({
                user_id: userId,
                schedule_id: scheduleId,
                start_datetime: date + "T16:30:00", // 仮の開始時間
                end_datetime: date + "T21:00:00",   // 仮の終了時間
                status: 'draft',
            });
            setModalData(null);
        }

        setSelectedShift({ userId, date });
        setIsModalOpen(true);
    };



    // シフト確定
    const handleConfirmShift = () => {
        if (!schedule) return;

        if (!window.confirm("シフトを確定します。よろしいですか？")) {
            return;
        }

        // 確定アクションをサーバーに送信
        axios.post('/api/shifts/admin/edit/publish', {
            schedule_id: schedule.id,
        })
            .then(response => {
                alert("シフトを確定しました。");
                // ステータスを更新
                setSchedule({ ...schedule, status: 'published' });
            })
            .catch(error => {
                alert("シフトの確定に失敗しました。");
            });
    }



    if (users.length === 0) {
        return <div>Loading...</div>;
    }


    console.log(schedule);



    return (
        <div css={wapperCss}>
            <div>
                <h1>シフトエディター（管理者ページ）</h1>
                <h2>{schedule?.year} 年 {schedule?.month} 月 のシフト</h2>



                {/* schedulesのstatusがopened closed のときはシフト確定（公開), publishedのときは更新 */}

                {
                    schedule?.status !== 'published' ? (
                        <Button
                            onClick={() => {
                                handleConfirmShift();
                            }}
                        >シフト公開(確定)</Button>
                    ) : (
                        <p>確定済みのため、変更したらすぐに変更されます。</p>
                        // Todo: 更新は、Historyでやるべきかも？
                    )
                }




                <ViewRowCalender
                    schedule={schedule}
                    shiftSubmissions={shiftSubmissions}
                    users={users}
                    onShiftClick={handleShiftClick}
                    confirmedShifts={confirmedShifts}
                ></ViewRowCalender>
            </div>
            {/* モーダル */}
            {isModalOpen && (
                <EditModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="シフト編集">
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
                        <Typography variant="subtitle1">{selectedShift?.date}</Typography>
                        <Typography variant="h6">{users.find(user => user.id === selectedShift?.userId)?.name} さん</Typography>

                        <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', p: 2, mb: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>希望シフト</Typography>
                            {modalData ? (
                                <>
                                    <Typography variant="body1">
                                        {format(new Date(modalData.start_datetime), 'HH:mm')} - {format(new Date(modalData.end_datetime), 'HH:mm')}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        メモ: {modalData.notes || 'なし'}
                                    </Typography>
                                </>
                            ) : (
                                <Typography variant="body1" color='red'>なし</Typography>
                            )}
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="開始時間"
                                type="time"
                                value={editShift ? format(new Date(editShift.start_datetime), "HH:mm") : ""}
                                onChange={(e) => {
                                    if (editShift && selectedShift) {
                                        const newDateTime = `${selectedShift.date}T${e.target.value}:00`;
                                        setEditShift({
                                            ...editShift,
                                            start_datetime: newDateTime,
                                        });
                                    }
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />

                            <TextField
                                label="終了時間"
                                type="time"
                                value={editShift ? format(new Date(editShift.end_datetime), "HH:mm") : ""}
                                onChange={(e) => {
                                    if (editShift && selectedShift) {
                                        const newDateTime = `${selectedShift.date}T${e.target.value}:00`;
                                        setEditShift({
                                            ...editShift,
                                            end_datetime: newDateTime,
                                        });
                                    }
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />

                        </Box>

                        <Button
                            variant="contained"
                            onClick={() => editShift && confirmShift(editShift)}
                            sx={{ mt: 2 }}
                        >
                            保存 or 更新
                        </Button>
                    </Box>
                </EditModal>
            )}
        </div>
    );
};

const wapperCss = css`
    height: 100vh;
    background-color: #e7f4ffbf;
`

export default Edit;
