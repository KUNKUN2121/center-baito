<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use App\Models\Shift;
use App\Models\ShiftSubmission;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;

class EditController extends Controller
{
    public function show()
    {
        // Todo: 募集中のシフトを選択できるようにする。
        $schedules = Schedule::where('status', 'open')->get();
        $users = User::all();

        // usersのis_activeがfalse かつ $schedulesのidがshift_submissionsに存在しないユーザーは除外
        $users = $users->filter(function ($user) use ($schedules) {
            if (!$user->is_active) {
                $hasSubmission = ShiftSubmission::where('user_id', $user->id)
                    ->whereIn('schedule_id', $schedules->pluck('id'))
                    ->exists();
                return $hasSubmission;
            }
            return true;
        });

        // 提出されたシフト希望を取得
        $ShiftSubmissions = ShiftSubmission::whereIn('schedule_id', $schedules->pluck('id'))->get();
        // 確定シフトを取得
        $confirmedShifts = Shift::whereIn('schedule_id', $schedules->pluck('id'))->get();


        return response()->json([
            'schedules' => $schedules,
            'shiftSubmissions' => $ShiftSubmissions,
            'confirmedShifts' => $confirmedShifts,
            'users' => $users,
        ], 200);
    }


    // 確定シフトの保存
    public function confirm(Request $request)
    {
        // schedule_id, user_id, start_datetime, end_datetime, notes
        $data = $request->validate([
            'schedule_id' => 'required|integer|exists:schedules,id',
            'user_id' => 'required|integer|exists:users,id',
            'start_datetime' => 'required|date',
            'end_datetime' => 'required|date|after:start_datetime',
            'notes' => 'nullable|string',
        ]);

        // 出勤日
        $date = Carbon::parse($data['start_datetime'])->toDateString();
        // 既に確定シフトが存在するか確認
        $confirmShift = Shift::where('user_id', $data['user_id'])
            ->where('schedule_id', $data['schedule_id'])
            ->whereDate('start_datetime', $date)
            ->first();

        if ($confirmShift) {
            // 既存のシフト希望があれば更新
            $confirmShift->update([
                'start_datetime' => $data['start_datetime'],
                'end_datetime' => $data['end_datetime'],
                'notes' => $data['notes'] ?? '',
            ]);
            return response()->json([
                'message' => '更新しました。',
                'shiftSubmission' => $confirmShift,
            ], 200);
        } else {
            // 新規作成
            $confirmShift = Shift::create([
                'user_id' => $data['user_id'],
                'schedule_id' => $data['schedule_id'],
                'start_datetime' => $data['start_datetime'],
                'end_datetime' => $data['end_datetime'],
                'notes' => $data['notes'] ?? '',
            ]);
            return response()->json([
                'message' => '保存しました。',
                'shiftSubmission' => $confirmShift,
            ], 200);
        }


    }
}
