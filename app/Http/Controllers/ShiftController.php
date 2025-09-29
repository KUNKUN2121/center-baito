<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use App\Models\Shift;
use App\Models\ShiftSubmission;
use App\Models\User;
use Illuminate\Http\Request;

class ShiftController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Schedule::query()->where('status', 'published');

        // クエリパラメータから month (YYYY-MM形式) を取得
        $yearMonth = $request->input('month');


        if ($yearMonth) {
            // YYYY-MM形式を想定
            $parts = explode('-', $yearMonth);
            if (count($parts) === 2) {
                $year = $parts[0];
                $month = $parts[1];
                $query->where('year', $year)->where('month', $month);
            }
        } else {
            // monthパラメータがない場合は、最新の公開済みスケジュールを取得
            $latestSchedule = Schedule::where('status', 'published')
                ->orderBy('year', 'desc')
                ->orderBy('month', 'desc')
                ->first();

            if ($latestSchedule) {
                // 最新の年月と同じ年月のスケジュールをすべて取得
                $query->where('year', $latestSchedule->year)->where('month', $latestSchedule->month);
            } else {
                // 公開済みのスケジュールが一つもない場合
                $query->whereRaw('1=0'); // 結果を空にする
            }
        }

        $schedules = $query->get();

        if ($schedules->isEmpty()) {
            return response()->json([
                'status' => '404',
                'message' => '現在公開されているシフトはありません。'
            ], 404);
        }

        // is_activeがfalseのユーザーは、その月のシフト希望を提出している場合のみ含める
        $users = User::where('is_active', true)
            ->orWhere(function ($query) use ($schedules) {
                $query->where('is_active', false)
                    ->whereHas('shiftSubmissions', function ($q) use ($schedules) {
                        $q->whereIn('schedule_id', $schedules->pluck('id'));
                    });
            })
            ->get();

        $confirmedShifts = Shift::whereIn('schedule_id', $schedules->pluck('id'))->get();

        return response()->json([
            'schedules' => $schedules,
            'confirmedShifts' => $confirmedShifts,
            'users' => $users,
        ], 200);
    }


    // ダッシュボード用のデータ取得
    public function dashboard(Request $request)
    {
        $user = $request->user();

        // 次回出勤の予定を取得 start_datetimeが今日以降のもののうち、最も近いもの
        $nextShift = Shift::where('user_id', $user->id)
            ->where('start_datetime', '>=', now())
            ->orderBy('start_datetime', 'asc')
            ->first();
        // お知らせを取得
        $notices = []; // ここにお知らせの取得ロジックを追加

        // 現在シフト募集中か確認する openになっているものがあればtrue
        $currentSchedule = Schedule::where('status', 'open')->first();

        return response()->json([
            'status' => '200',
            'nextShift' => $nextShift,
            'notices' => $notices,
            'isSubmittingOpen' => $currentSchedule ? true : false,
        ], 200);
    }

}
