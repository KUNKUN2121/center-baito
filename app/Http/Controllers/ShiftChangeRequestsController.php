<?php

namespace App\Http\Controllers;

use App\Models\shift_change_requests;
use App\Models\ShiftChangeRequest;
use App\Models\ShiftHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ShiftChangeRequestsController extends Controller
{
    // リクエスト一覧取得
    public function index()
    {
        $requests = ShiftChangeRequest::all();
        return response()->json($requests);
    }


    // リクエスト作成
    public function create(Request $request)
    {
        // 変えたい人のuser_id, 変えたいシフトのshift_id, 理由 (任意)
        $request->validate([
            'user_id' => 'required|integer', // 変更をリクエストしたユーザーのID
            'shift_id' => 'required|integer', // 変更をリクエストしたシフトのID
            'substitute_user_id' => 'nullable|integer', // 代わりにシフトに入るユーザーのID （基本はnull)
            'create' => 'nullable|string',
        ]);

        // dd($request->all());


        $shiftChangeRequest = ShiftChangeRequest::create([
            'requester_user_id' => $request->input('user_id'), // リクエストユーザー
            'shift_id' => $request->input('shift_id'), // 変更したいシフト
            'substitute_user_id' => null, // 代わりにシフトに入るユーザがいる場合はここで指定
            'status' => 'pending',
        ]);

        return response()->json([
            'status' => '201',
            'message' => 'シフト変更リクエストが作成されました。', 'data' => $shiftChangeRequest], 201);
    }


    // リクエスト更新 (承認、拒否、キャンセル)
    public function update(Request $request)
    {
        $request->validate([
            'user_id' => 'required|integer', // 変更するユーザ
            'id' => 'required|integer', // 更新するリクエストのID
            'action' => 'required|string|in:approve,reject,cancel', // 承認、拒否、キャンセルのいずれか
        ]);
        $id = $request->input('id');
        $action = $request->input('action');
        $loginUser = Auth::user();
        $role = $loginUser->role;
        $loginUserId = $loginUser->id;

        $shiftChangeRequest = ShiftChangeRequest::find($id);
        if (!$shiftChangeRequest) {
            return response()->json([
                'status' => '404',
                'message' => 'シフト変更リクエストが見つかりませんでした。'], 404);
        }

        // キャンセル処理 (本人、またはadminがリクエストをキャンセル)
        if ($request->input('action') === 'cancel') {
            if ($loginUserId !== $shiftChangeRequest->requester_user_id && $role !== 'admin') {
                return response()->json(['status' => '403', 'message' => '自分のリクエスト、または管理者がキャンセルできます。'], 403);
            }

            $shiftChangeRequest->status = 'canceled';
            $shiftChangeRequest->save();

            return response()->json([
                'status' => '200',
                'message' => '変更リクエストがキャンセルされました。', 'data' => $shiftChangeRequest]);
        }

        // 承認処理 (リクエストユーザー以外が承認)
        if($request->input('action') === 'approve') {
            // ログインユーザの場合 承認しない、 adminであれば同じユーザでも承認可能
            if ($loginUserId === $shiftChangeRequest->requester_user_id && $role !== 'admin') {
                return response()->json(['status' => '403', 'message' => '自分のリクエストは承認できません。'], 403);
            }


            $shiftChangeRequest->status = 'approved';
            $shiftChangeRequest->approver_user_id = $loginUserId;
            $shiftChangeRequest->save();

            // TODO: シフト履歴の更新

            return response()->json([
                'status' => '200',
                'message' => '変更リクエストが承認されました。', 'data' => $shiftChangeRequest]);
        }


        return response()->json(['status' => '400', 'message' => '無効なアクションです。'], 400);
    }
}
