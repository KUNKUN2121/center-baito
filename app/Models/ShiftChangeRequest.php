<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShiftChangeRequest extends Model
{
    //
    protected $fillable = [
        'shift_id',
        'requester_user_id',
        'substitute_user_id',
        'approver_user_id',
        'status',
    ];
}
