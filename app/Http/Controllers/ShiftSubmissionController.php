<?php

namespace App\Http\Controllers;

use App\Models\ShiftSubmission;
use Illuminate\Http\Request;
use App\Http\Requests\ShiftSubmissionRequest;
use App\Models\Schedule;
use Illuminate\Support\Facades\Auth;

/**
 * シフト希望提出コントローラー
 */

class ShiftSubmissionController extends Controller
{
    /**
     * ユーザーの希望シフトを返す
     */
    public function index()
    {
        // 現在募集中のシフトを取得
        $schedules = Schedule::where('status', 'open')->get();
        // \dd($schedules);
        if($schedules->isEmpty() || $schedules->first()->status !== 'open'){
            return response()->json([
                'status' => '404',
                'message' => '現在募集中のシフトはありません。'
            ], 204);
        }
        $user = auth()->user();
        $shiftSubmissions = $user->shiftSubmissions()->whereIn('schedule_id', $schedules->pluck('id'))->get();
        $scheduleId = $schedules->pluck('id')->first();
        return response()->json([
            'scheduleId' => $scheduleId,
            'date' => $schedules->first()->year . '年' . $schedules->first()->month . '月',
            'shiftSubmissions' => $shiftSubmissions,
        ], 200);
        // return response()->json($user->shiftSubmissions);
    }

    /**
     * 希望シフトを追加する
     */
    public function create(Request $request)
    {
        // \dd($request->all());
        $request->validate([
            'newSchedule' => 'required|array',
            'newSchedule.start_datetime' => 'required|date',
            'newSchedule.end_datetime' => 'required|date|after:newSchedule.start_datetime',
            'scheduleId' => 'required|integer|exists:schedules,id',
        ]);
        $user = auth()->user();
        $newSchedule = $request->input('newSchedule');
        $scheduleId = $request->input('scheduleId');

        // 時間が被っていないか確認
        $overlap = ShiftSubmission::where('user_id', $user->id)
            ->where(function ($query) use ($newSchedule) {
                $query->whereBetween('start_datetime', [$newSchedule['start_datetime'], $newSchedule['end_datetime']])
                      ->orWhereBetween('end_datetime', [$newSchedule['start_datetime'], $newSchedule['end_datetime']])
                      ->orWhere(function ($query) use ($newSchedule) {
                          $query->where('start_datetime', '<=', $newSchedule['start_datetime'])
                                ->where('end_datetime', '>=', $newSchedule['end_datetime']);
                      });
            })
        ->exists();


        if ($overlap) {
            return response()->json([
                'status' => '409',
                'message' => 'シフトの時間が重複しています。'
            ], 409);
        }

        $shiftSubmission = ShiftSubmission::create([
            'user_id' => $user->id,
            'schedule_id' => $scheduleId,
            'start_datetime' => $newSchedule['start_datetime'],
            'end_datetime' => $newSchedule['end_datetime'],
            'status' => 'draft',
            'notes' => $newSchedule['notes'] ?? null,
        ]);
        return response()->json($shiftSubmission, 201); // 201 Created

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ShiftSubmissionRequest $request) // Use the custom request for validation
    {
        $user = auth()->user();
        $shiftSubmission = $user->shiftSubmissions()->create($request->validated());

        return response()->json($shiftSubmission, 201); // 201 Created
    }

    /**
     * Display the specified resource.
     */
    public function show(ShiftSubmission $shiftSubmission)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ShiftSubmission $shiftSubmission)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ShiftSubmission $shiftSubmission)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ShiftSubmission $shiftSubmission)
    {
        //
    }
}
