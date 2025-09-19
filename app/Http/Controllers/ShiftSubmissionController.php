<?php

namespace App\Http\Controllers;

use App\Models\ShiftSubmission;
use Illuminate\Http\Request;
use App\Http\Requests\ShiftSubmissionRequest;
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
        $user = auth()->user();
        return response()->json($user->shiftSubmissions);
    }

    /**
     * 希望シフトを追加する
     */
    public function create(Request $request)
    {
        $user = auth()->user();
        $shiftSubmission = $user->shiftSubmissions()->create(
            $request->only(['start_datetime', 'end_datetime', 'status', 'notes'])
        );
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
